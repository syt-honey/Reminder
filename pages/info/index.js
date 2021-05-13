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
    email: "5532064.91@163.com",
    settings: [
      {
        name: "提醒规则管理",
        path: "/pages/rule/rule"
      }, {
        name: "成长日志/一览图",
        path: "/pages/log/log"
      }, {
        name: "关于我们",
        path: "/pages/about/about"
      }
    ]
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