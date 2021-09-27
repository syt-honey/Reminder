// pages/info/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navbarHeight: app.globalData.navbarHeight,
    info: {},
    version: "beta-v1.0.24",
    settings: [{
      name: "提醒规则管理",
      path: "/pages/rule/rule"
    }, {
      name: "成长一览图",
      path: "/pages/log/log"
    }, {
      name: "戳一戳",
      path: "/pages/about/about"
    }, {
      name: "获取源码",
      path: "/pages/github/github"
    }],
    isShow: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo') || {};
    if (userInfo !== {}) {
      userInfo.avatarUrl = userInfo.avatarUrl.replace(/\/\d+/, "/0");
    }
    this.setData({
      info: userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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