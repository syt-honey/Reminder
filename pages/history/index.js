// pages/history/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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