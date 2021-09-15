// pages/rule/rule.js
const app = getApp();

Page({

 /**
  * 页面的初始数据
  */
 data: {
  ruleList: [],
  count: 0,
  triggered: false, // 是否下拉
  statusBarHeight: app.globalData.statusBarHeight,
  navBarHeight: app.globalData.navbarHeight,
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {
  this.getRuleList();
 },

  //用户下拉动作
  onScrollRefresh: function () {
   this.getRuleList(true);
 },

 // 获取规则列表
 getRuleList(isPullRefresh) {
  if (!isPullRefresh) {
    wx.showLoading({
      title: '获取列表...',
    });
  }
  app.globalData.cloud.callFunction({
    name: "getRuleList",
    data: {}
  }).then((res) => {
    const {
      list,
      count
    } = res.result.res.data;

    const {
     code
   } = res.result.res;

    if (code === 2001) {
     if (!isPullRefresh) {
      wx.hideLoading({
        success: () => {}
      });
     } else {
      this.setData({
        triggered: false,
      });
     }
     this.setData({
      ruleList: list,
      count: count
     });
   } else {
     wx.hideLoading({
       success: () => {
         wx.showToast({
           title: "列表获取失败",
           icon: "error",
           duration: 1000,
           mask: true
         });
       },
     });
   }
  }).catch((e) => {
    console.log(e)
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