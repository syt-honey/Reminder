// pages/home/index.js
const dayjs = require("./dayjs");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    openTaskPage: false,
    taskName: "",
    remark: "",
    rules: {
      rule: [0, 1, 2, 3, 7, 15, 30],
      ruleName: "五毒刷题法"
    },
    taskList: [],
    count: 0,
    isShow: null
  },

  onShow() {
    // 每个页面都要去检查一下
    app.checkAuthorization().then((res) => {
      // console.log(app.globalData.isAuthorize)
      if (app.globalData.isAuthorize) {
        this.setData({
          isShow: false
        });
      } else {
        this.setData({
          isShow: true
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTaskList();
  },

  toAddTask() {
    // TODO 其他字段的 init
    this.setData({
      remark: "",
      taskName: ""
    }, () => {
      this.setData({
        openTaskPage: true
      });
    });
  },

  refresh() {
    console.log('refresh')
    this.getTaskList();
  },

  getTaskList() {
    wx.showLoading({
      title: '获取列表...',
    });

    app.globalData.cloud.callFunction({
      name: "getTodayTaskList",
      data: {}
    }).then((res) => {
      const {
        list,
        count
      } = res.result.res.data;
      this.setData({
        taskList: list,
        count: count
      });
      wx.hideLoading({
        success: () => {},
      });
    }).catch((err) => {
      wx.hideLoading({
        success: () => {
          wx.showToast({
            title: err,
            duration: 1000,
            mask: true
          });
        },
      });
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
    this.setData({
      openTaskPage: false
    });

    // 根据规则生成提醒日期列表
    // 当前的时间
    const now = new Date();
    // 当前日期 00:00 的时间戳
    const nowOfDay = new Date(dayjs(now).format('YYYY-MM-DD')).getTime();
    // 根据时间戳生成列表
    let dateList = [];
    this.data.rules.rule.forEach(e => {
      let i = {
        done: false
      };
      i.date = nowOfDay + e * 24 * 60 * 60 * 1000;
      i.dateOfDay = dayjs(new Date(i.date)).format("YYYY-MM-DD");
      dateList.push(i);
    });

    // 请求参数
    const req = {
      taskName: this.data.taskName,
      remark: this.data.remark,
      createTime: now.getTime(),
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
        msg
      } = res.result.res;
      wx.hideLoading({
        success: () => {
          wx.showToast({
            icon: "success",
            title: msg,
            duration: 1000,
            mask: true
          });
        },
      });
      this.getTaskList();
    }).catch((err) => {
      wx.hideLoading({
        success: () => {
          wx.showToast({
            title: err,
            duration: 1000,
            mask: true
          });
        },
      });
    });
  },

  queryDefaultRuleDesc() {
    wx.showToast({
      icon: "error",
      title: '还没写好哦~',
      duration: 2000,
      mask: true
    })
  },

  onClose() {
    this.setData({
      openTaskPage: false
    })
  },

  changeAuthorize(isAuthorize, reason = "授权错误") {
    if (isAuthorize) {
      this.setData({
        isShow: !isAuthorize
      });
    } else {
      wx.showToast({
        title: reason,
        icon: 'fail',
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
  onPullDownRefresh: function () {
    console.log('lala')
  },

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