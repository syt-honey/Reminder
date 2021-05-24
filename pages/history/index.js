// pages/history/index.js
const dayjs = require("./dayjs");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: null,
    taskList: [],
    doingList: [],
    historyList: [],
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getTaskList() {
    wx.showLoading({
      title: '获取列表...',
    });

    app.globalData.cloud.callFunction({
      name: "getTaskList",
      data: {}
    }).then((res) => {
      const {
        list,
        count
      } = res.result.res.data;
      this.setData({
        taskList: list,
        count: count
      }, () => {
        this.initList();
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

  initList() {
    this.setData({
      historyList: [],
      doingList: []
    });
    const now = dayjs(dayjs(now).format('YYYY-MM-DD') + " 00:00:00").valueOf();
    const historyList = [],
      doingList = [];
    this.data.taskList.forEach(i => {
      const temList = i.rules.dateList;
      let lastDay = 0; // 最后一天 23:59:59 的时间戳
      temList && (lastDay = dayjs(temList[temList.length - 1].dateOfDay + " 23:59:59").valueOf()); // 直接获取最后一个值的这种方法依赖 dateList 升序排序
      if (now > lastDay) {
        historyList.push(i)
      } else {
        doingList.push(i)
      }
    });
    this.setData({
      historyList: [...historyList],
      doingList: [...doingList]
    }, () => {
      console.log(this.data.historyList, this.data.doingList)
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTaskList();
    // 每个页面都要去检查一下
    app.checkAuthorization().then(() => {
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