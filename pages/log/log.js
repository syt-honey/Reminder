const dayjs = require("dayjs");

// pages/log/log.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
    minDate: new Date(2021, 1, 1).getTime(),
    maxDate: new Date(2021, 10, 10).getTime(),
    today: new Date().getTime(),
    recordList: [],
    formatter(day) {}
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {
   this.getTaskList();
 },


 getTaskList() {
   wx.showLoading({
      title: '任务记录获取中...',
   });

   app.globalData.cloud.callFunction({
   name: "getAllSchedule",
   data: {}
   }).then((res) => {
   const {
      msg,
      code,
      data
   } = res.result.res;

   if (code === 2001) {
      wx.hideLoading({
         success: () => {
            this.setData({
               minDate: data.count ? new Date(data.list[0].day).getTime() : new Date().getTime(),
               maxDate: data.count ? new Date(data.list[data.count - 1].day).getTime() : new Date().getTime(),
               recordList: data.list
            }, () => {
               this.setData({
                  formatter: (day) => {
                     const date = dayjs(day.date).format("YYYY-MM-DD");
                     if (this.data.recordList) {
                        const d = this.data.recordList.find((v) => v.day === date);
                        if (d) {
                           day.topInfo = d.taskList.every((v) => v.done) ? 'finished' : 'task';
                        }
                     }
                     return day;
                  }
               })
            });
         },
      });
   } else {
      wx.hideLoading({
         success: () => {
         wx.showToast({
            title: JSON.stringify(msg, Object.getOwnPropertyNames(msg)),
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