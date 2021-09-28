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

  refresh() {
    this.getRuleList();
  },

  // 获取规则列表
  async getRuleList(isPullRefresh) {
    if (!isPullRefresh) {
      wx.showLoading({
        title: '获取列表...',
      });
    }

    try {
      let res = await app.globalData.cloud.callFunction({
        name: "getRuleList",
        data: {}
      });
      const {
        code
      } = res.result.res;

      if (code === 2001) {
        const {
          list,
          count
        } = res.result.res.data;

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
    } catch {
      console.log(e)
    };
  },
})