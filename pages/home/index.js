// pages/home/index.js
const dayjs = require("./dayjs");
const app = getApp();
import CONSTANT from "../../utils/CONSTANT";

var isToday = require('dayjs/plugin/isToday');
dayjs.extend(isToday);

// TODO 时间获取上有重复，需要整理抽取出来
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAddCountPage: false,
    leaveCount: 0,
    doingList: [],
    finishedList: [],
    showAuthoriztion: false,
    today: { // “今天” 日期
      year: "",
      month: "",
      day: "",
    },
    triggered: false, // 是否下拉
    task: {
      degreeOfCompletion: 0,
      taskList: [],
      taskCount: 0,
      openTaskPage: false,
    },
    // wxml 不支持 按照路径进行双向绑定（垃圾！）参考：https://developers.weixin.qq.com/community/develop/doc/0002e6bcea4bf09999da7c6145bc00
    selectedRule: null, // 选中的规则 id
    ruleList: [], // 所有可选择的规则
    taskName: "",
    remark: "",
    ruleName: "",
    rule: {
      rawRuleList: [], // 当前用户全部的规则列表
      ruleCount: 0,
      openAddRuleForm: false,
      customList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, 30], // 默认可选的规则表单
      toSelectedList: [],
      // 添加规则表单
      selectedRule: [0, 1, 2, 3, 7, 15, 30], // 用户选中的规则间隔
    },
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navbarHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const rules = this.data.rule.customList.map(i => {
      return {
        count: i,
        selected: this.data.rule.selectedRule.includes(i)
      }
    })
    this.setData({
      ["rule.toSelectedList"]: rules
    });

    this.getTaskList();
    this.getTodayDate();
    this.getRuleList();
  },

  changeRule(e) {
    this.setData({
      selectedRule: e.detail
    });
  },

  // 新增任务
  toAddTask() {
    // TODO 其他字段的 init
    this.setData({
      remark: "",
      taskName: ""
    }, () => {
      this.setData({
        ["task.openTaskPage"]: true
      });
    });
  },

  // 新增规则
  toAddRule() {
    this.setData({
      ruleName: ""
    }, () => {
      this.setData({
        ["rule.openAddRuleForm"]: true
      });
    });
  },

  /**
   * 
   * @param {*} isPullRefresh 是否是下拉刷新
   */
  getTaskList(isPullRefresh) {
    if (!isPullRefresh) {
      wx.showLoading({
        title: '获取列表...',
      });
    }

    this.getTaskListInterface().then(res => {
      if (!isPullRefresh) {
        wx.hideLoading({
          success: () => {},
        });
      } else {
        this.setData({
          triggered: false,
        });
      }
      if (res === -1) {
        wx.showToast({
          title: "获取任务列表出错",
          icon: "error",
          duration: 1000,
          mask: true
        });
      }
    });
  },

  getTaskListInterface() {
    return new Promise((resolve, reject) => {
      app.globalData.cloud.callFunction({
        name: "getTodayTaskList",
        data: {}
      }).then((res) => {
        const {
          list,
          count
        } = res.result.res.data;
        this.setData({
          ["task.taskList"]: list,
          ["task.taskCount"]: count
        }, () => {
          if (this.data.task.taskList.length) {
            this.initList();
            this.setDegreeOfCompletion();
          }
          resolve(1);
        });
      }).catch(() => {
        reject(-1);
      });
    });
  },

  // 
  initList() {
    const now = dayjs(dayjs(now).format('YYYY-MM-DD') + " 00:00:00").valueOf();
    const finishedList = [],
      doingList = [];
    this.data.task.taskList.forEach(i => {
      const temList = i.rules.dateList;
      let todayFinished = false;
      for (let i = 0; i < temList.length; ++i) {
        if (dayjs(temList[i].date).isToday() && temList[i].done) {
          todayFinished = true;
          break;
        }
      }
      if (todayFinished) {
        finishedList.push(i);
      } else {
        doingList.push(i);
      }
    });
    doingList.sort((a, b) => {
      return a.createTime > b.createTime ? -1 : 1;
    });
    this.setData({
      doingList: [...doingList],
      finishedList: [...finishedList]
    });
  },

  async onSubscribe() {
    await app.globalData.cloud.callFunction({
      name: "subscribe",
      data: {
        templateId: CONSTANT.TMP_ID
      }
    }).then((r) => {
      const {
        msg,
        code,
        data
      } = r.result.res;
      if (code === 2001) {
        this.setData({
          leaveCount: data.list.data[0].count
        });
      } else {
        wx.showToast({
          title: msg,
          icon: "error",
          duration: 2000
        })
      }
    }).catch(() => {
      wx.showToast({
        title: '订阅失败',
        icon: "error",
        duration: 2000
      })
    })
  },

  async addTask() {
    if (!this.data.taskName) {
      wx.showToast({
        icon: "error",
        title: '任务名不能为空',
      });
      return;
    }

    this.setData({
      ["task.openTaskPage"]: false
    });

    // 根据规则生成提醒日期列表
    // 当前的时间
    const now = new Date();
    // 当前日期 00:00 的时间戳
    const nowOfDay = dayjs(dayjs(now).format('YYYY-MM-DD')).valueOf();
    // 根据时间戳生成列表
    let dateList = [];

    this.data.rule.selectedRule.forEach(e => {
      let i = {
        done: false
      };
      i.date = nowOfDay + e * 24 * 60 * 60 * 1000;
      i.dateOfDay = dayjs(dayjs(i.date).valueOf()).format("YYYY-MM-DD");
      dateList.push(i);
    });

    // 请求参数
    const req = {
      taskName: this.data.taskName,
      remark: this.data.remark,
      rules: {
        allDone: false,
        rule: [...this.data.rule.selectedRule],
        ruleId: this.data.selectedRule,
        ruleName: this.data.ruleList.filter(i => i.value === this.data.selectedRule)[0].text,
        dateList: [...dateList]
      }
    };

    wx.showLoading({
      title: '任务创建中...',
    });

    app.globalData.cloud.callFunction({
      name: "createTask",
      data: {
        ...req
      }
    }).then(async (res) => {
      const {
        msg,
        code,
        data
      } = res.result.res;

      if (code === 2001) {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: msg,
              duration: 1000,
              mask: true
            });
          },
        });
        await app.globalData.cloud.callFunction({
          name: "getSubscribeCount",
          data: {
            templateId: CONSTANT.TMP_ID
          }
        }).then(async res => {
          const {
            code,
            data
          } = res.result.res;
          if (code === 2001) {
            if (data.isSubscribe) {
              if (data.count <= 7) {
                this.setData({
                  leaveCount: data.count,
                  showAddCountPage: true
                });
              }
            } else {
              await wx.requestSubscribeMessage({
                tmplIds: [CONSTANT.TMP_ID],
                success: async (res) => {
                  if (res.errMsg === "requestSubscribeMessage:ok") {
                    this.onSubscribe();
                  }
                }
              });
            }
          }
        })
        this.getTaskList(true);
      } else {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: "任务创建失败",
              icon: "error",
              duration: 1000,
              mask: true
            });
          },
        });
      }

    }).catch((err) => {
      wx.hideLoading({
        success: () => {
          wx.showToast({
            title: "任务创建失败",
            icon: "error",
            duration: 1000,
            mask: true
          });
        },
      });
    });
  },

  addCount() {
    this.onSubscribe();
  },

  closeCount() {
    this.setData({
      showAddCountPage: false
    });
  },

  addRule() {
    if (!this.data.ruleName) {
      wx.showToast({
        icon: "error",
        title: '规则名不能为空',
      });
      return;
    }

    if (!this.data.rule.selectedRule) {
      wx.showToast({
        icon: "error",
        title: '计算设置不能为空',
      });
      return;
    }

    // 请求参数
    const req = {
      ruleName: this.data.ruleName,
      ruleList: this.data.rule.selectedRule
    };

    wx.showLoading({
      title: '规则创建中...',
    });

    app.globalData.cloud.callFunction({
      name: "createRule",
      data: {
        ...req
      }
    }).then((res) => {
      const {
        msg,
        code
      } = res.result.res;

      if (code === 2001) {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: msg,
              duration: 1000,
              mask: true
            });
          },
        });
        this.getRuleList();
        this.closeRuleForm();
      } else {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: "规则创建失败",
              icon: "error",
              duration: 1000,
              mask: true
            });
          },
        });
      }
    }).catch((err) => {
      wx.hideLoading({
        success: () => {
          wx.showToast({
            title: "规则创建失败",
            icon: "error",
            duration: 1000,
            mask: true
          });
        },
      });
    });
  },

  // 获取规则列表
  getRuleList() {
    app.globalData.cloud.callFunction({
      name: "getRuleList",
      data: {}
    }).then((res) => {
      const {
        list,
        count
      } = res.result.res.data;
      this.setData({
        ["rule.rawRuleList"]: list,
        ["rule.ruleCount"]: count
      });
      this.data.ruleList = [];
      count && list.map(i => {
        this.data.ruleList.push({
          text: i.ruleName,
          value: i._id
        });
        this.setData({
          ruleList: [...this.data.ruleList],
          selectedRule: this.data.ruleList.length && this.data.ruleList[0].value
        });
      })
    }).catch((e) => {
      console.log(e)
    });
  },

  closeTag(e) {
    this.data.rule.toSelectedList.map(i => {
      if (i.count === e.currentTarget.dataset.item.count) {
        // 选中逻辑
        if (!i.selected) {
          i.selected = true;

          if (!this.data.rule.selectedRule.includes(i.count)) {
            this.data.rule.selectedRule.push(i.count);
            this.data.rule.selectedRule.sort((a, b) => a > b ? 1 : -1);
            this.setData({
              ["rule.selectedRule"]: this.data.rule.selectedRule
            })
          }
        } else {
          // 去除逻辑
          i.selected = false;
          const index = this.data.rule.selectedRule.indexOf(i.count);
          if (index > -1) {
            this.data.rule.selectedRule.splice(index, 1);
            this.setData({
              ["rule.selectedRule"]: this.data.rule.selectedRule
            })
          }
        }
      }
    });
    this.setData({
      ["rule.toSelectedList"]: this.data.rule.toSelectedList
    })
  },

  //用户下拉动作
  onScrollRefresh: function () {
    this.getTaskList(true);
  },

  // 设置完成进度
  setDegreeOfCompletion() {
    let completedCount = this.data.finishedList.length;
    this.setData({
      ["task.degreeOfCompletion"]: completedCount ? ((completedCount / this.data.task.taskList.length) * 100).toFixed(2) : 0
    });
  },

  // 获取当天日期信息
  getTodayDate() {
    const now = new Date();
    const year = "" + dayjs(now).year(),
      month = (dayjs(now).month() + 1) < 10 ? "0" + (dayjs(now).month() + 1) : "" + (dayjs(now).month() + 1),
      day = (dayjs(now).date() + 1) < 10 ? "0" + dayjs(now).date() : "" + dayjs(now).date();
    this.setData({
      ["today.year"]: year,
      ["today.month"]: month,
      ["today.day"]: day
    });
  },

  refresh() {
    this.getTaskList();
  },

  closeTaskPage() {
    this.setData({
      ["task.openTaskPage"]: false
    });
  },

  closeRuleForm() {
    this.setData({
      ["rule.openAddRuleForm"]: false
    });
  },

  onShow() {
    // 每个页面都要去检查一下
    app.checkAuthorization().then((res) => {
      if (app.globalData.isAuthorize) {
        this.setData({
          showAuthoriztion: false
        });
      } else {
        this.setData({
          showAuthoriztion: true
        });
      }
    });
  },

  changeAuthorize(isAuthorize, reason = "授权错误") {
    if (isAuthorize) {
      this.setData({
        showAuthoriztion: !isAuthorize
      });
    } else {
      wx.showToast({
        title: reason,
        icon: 'error',
        duration: 1000,
        mask: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})