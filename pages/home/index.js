// pages/home/index.js
const dayjs = require("./dayjs");
const app = getApp();

var isToday = require('dayjs/plugin/isToday');
dayjs.extend(isToday);

// TODO 时间获取上有重复，需要整理抽取出来
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // rules: {
    //   rule: [0, 1, 2, 3, 7, 15, 30],
    //   ruleName: "五毒刷题法"
    // },
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
      addTaskForm: {
        taskName: "",
        remark: "",
        selectedRule: null, // 选中的规则 id
        ruleList: [] // 所有可选择的规则
      }
    },
    rule: {
      rawRuleList: [], // 当前用户全部的规则列表
      ruleCount: 0,
      openAddRuleForm: false,
      addRuleForm: { // 添加规则表单
        ruleName: "",
        ruleList: []
      }
    },
    custom: { // 自定义规则表单
      customList: [0, 1, 2, 3, 7, 15, 30], // 默认可选的规则表单
      customInput: 0, // 自定义的时间规则间隔
      columns: ['每天', '每周', '每个工作日', '每月', '每年'], // 默认的规则间隔（！！待确认）
      selectedRule: [0, 1, 2, 3, 7] // 用户选中的规则间隔
    },
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navbarHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTaskList();
    this.getTodayDate();
    this.getRuleList();
  },

  // 新增任务
  toAddTask() {
    // TODO 其他字段的 init
    this.setData({
      ["task.addTaskForm.remark"]: "",
      ["task.addTaskForm.taskName"]: ""
    }, () => {
      this.setData({
        ["task.openTaskPage"]: true
      });
    });
  },

  // 新增规则
  toAddRule() {
    this.setData({
      ['rule.addRuleForm.ruleName']: "",
      ['rule.addRuleForm.ruleList']: []
    }, () => {
      this.setData({
        ["rule.openAddRuleForm"]: true
      });
    });
  },

  customRule() {
    console.log('custom rule')
  },

  onChange(e) {
    console.log(e)
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

  addTask() {
    if (!this.data.taskName) {
      wx.showToast({
        icon: "error",
        title: '任务名不能为空',
      });
      return;
    }
    const that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['V6OoWiI3AGE-JRdvlTQDgLZcb5666JBrMd019pABtJQ'],
      success: (res) => {
        console.log(res)
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

        const rules = this.data.rule.ruleList.find(v => v.value === this.data.selectedRule);
        this.data.rules.ruleList.forEach(e => {
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
          allDone: false,
          rules: {
            rule: [...this.data.rules.rule],
            ruleName: this.data.rules.ruleName,
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
            this.getTaskList();
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
      }
    });
  },

  addRule() {
    console.log('add rule')
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
      count && list.map(i => {
        this.data.task.addTaskForm.ruleList.push({
          text: i.ruleName,
          value: i._id
        });
        this.setData({
          ["task.addTaskForm.ruleList"]: [...this.data.task.addTaskForm.ruleList],
          ["task.addTaskForm.selectedRule"]: this.data.task.addTaskForm.ruleList.length && this.data.task.addTaskForm.ruleList[0].value
        });
      })
    }).catch((e) => {
      console.log(e)
    });
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
      openAddRuleForm: false
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