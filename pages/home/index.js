// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openTaskPage: true,
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
      { text: '按日期结束', value: 'b' },
      { text: '按次数重复', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
    date: '',
    openTimePick: false,
  },

  onDisplay() {
    this.setData({ openTimePick: true });
  },
  onClose() {
    this.setData({ openTimePick: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      openTimePick: false,
      date: this.formatDate(event.detail),
    });
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

  onClose: function() {
    this.setData({
      openTaskPage: false
    })
  },

  addRule: function() {
    console.log("add rule")
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