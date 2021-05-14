// pages/home/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openTaskPage: false,
    taskName: "",
    remark: "",
    option1: [{
        text: '每天',
        value: 0
      },
      {
        text: '每周',
        value: 1
      },
      {
        text: '每年',
        value: 2
      },
      {
        text: '法定工作日',
        value: 3
      },
      {
        text: '艾宾浩斯记忆法',
        value: 4
      },
    ],
    option2: [{
        text: '一直重复',
        value: 'a'
      },
      {
        text: '按次数重复',
        value: 'b'
      },
    ],
    value1: 0,
    value2: 'a',
    taskList: [{
        taskName: "07 待办列表",
        remark: "明天要检查",
        time: [{
          time: '2021-5-6',
          tag: 1
        }, {
          time: '2021-5-7',
          tag: 1
        }, {
          time: '2021-5-8',
          tag: 0
        }, {
          time: '2021-5-9',
          tag: 0
        }, {
          time: '2021-5-10',
          tag: 0
        }, ]
      },
      {
        taskName: "07 待办列表",
        remark: "明天要检查",
        time: [{
          time: '2021-5-6',
          tag: 1
        }, {
          time: '2021-5-7',
          tag: 1
        }, {
          time: '2021-5-8',
          tag: 0
        }, {
          time: '2021-5-9',
          tag: 0
        }, {
          time: '2021-5-10',
          tag: 0
        }, ]
      },
      {
        taskName: "07 待办列表",
        remark: "明天要检查",
        time: [{
          time: '2021-5-6',
          tag: 1
        }, {
          time: '2021-5-7',
          tag: 1
        }, {
          time: '2021-5-8',
          tag: 0
        }, {
          time: '2021-5-9',
          tag: 0
        }, {
          time: '2021-5-10',
          tag: 0
        }, ]
      },
    ],
    isShow: null
  },

  onShow() {
    // 每个页面都要去检查一下
    app.checkAuthorization().then((res) => {
      console.log(app.globalData.isAuthorize)
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

  getTaskList() {
    wx.showLoading({
      title: '获取列表...',
    });

    app.globalData.cloud.callFunction({
      name: "getTaskList",
      data: {}
    }).then((res) => {
      console.log(res);
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
    this.setData({
      openTaskPage: false
    });
    const req = {
      taskName: this.data.taskName,
      remark: this.data.remark
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
      console.log(res);
      wx.hideLoading({
        success: () => {
          wx.showToast({
            icon: "success",
            title: res.result.res.data.msg,
            duration: 1000,
            mask: true
          });
        },
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

  onClose() {
    this.setData({
      openTaskPage: false
    })
  },

  addRule() {
    console.log("add rule")
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