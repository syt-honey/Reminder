// pages/home/index.js

import API from "../../api/index.js";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openTaskPage: false,
    taskName: "",
    remark: "",
    option1: [
      { text: '每天', value: 0 },
      { text: '每周', value: 1 },
      { text: '每年', value: 2 },
      { text: '法定工作日', value: 3 },
      { text: '艾宾浩斯记忆法', value: 4 },
    ],
    option2: [
      { text: '一直重复', value: 'a' },
      { text: '按次数重复', value: 'b' },
    ],
    value1: 0,
    value2: 'a',
    taskList: [
      {
        taskName: "07 待办列表",
        remark: "明天要检查",
        time: [{
          time: '2021-5-6',
          tag: 1
        }, {
          time: '2021-5-7',
          tag: 1
        },{
          time: '2021-5-8',
          tag: 0
        },{
          time: '2021-5-9',
          tag: 0
        },{
          time: '2021-5-10',
          tag: 0
        },]
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
        },{
          time: '2021-5-8',
          tag: 0
        },{
          time: '2021-5-9',
          tag: 0
        },{
          time: '2021-5-10',
          tag: 0
        },]
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
        },{
          time: '2021-5-8',
          tag: 0
        },{
          time: '2021-5-9',
          tag: 0
        },{
          time: '2021-5-10',
          tag: 0
        },]
      },
    ],
    isShow: null,
  },

  onShow() {
    wx.getSetting({
      withSubscriptions: true, // 同时获取用户订阅消息的订阅状态
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 授权过
          this.setData({
            isShow: false
          });
        } else {
          // 未授权
          this.setData({
            isShow: true
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  toAddTask: function() {
    this.setData({
      openTaskPage: true
    });
  },

  addTask: function() {
    this.setData({
      openTaskPage: false
    });
    // console.log(API.createTask)
    console.log(this.data.taskName, this.data.value1, this.data.value2, this.data.remark)
  },

  onClose: function() {
    this.setData({
      openTaskPage: false
    })
  },

  addRule: function() {
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