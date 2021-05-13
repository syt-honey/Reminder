// components/login/login.js
const app = getApp();
import CONSTANT from "../../utils/CONSTANT";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHide: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  ready() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          app.globalData.isAuthorize = true;
          this.triggerEvent("changeAuthorize", true);
          wx.setStorageSync('userInfo', res.userInfo)
          this.login();
        }
      })
    },
    getUserInfo(e) {
      // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      app.globalData.isAuthorize = true;
      this.triggerEvent("changeAuthorize", true);
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.login();
    },
    async login() {
      wx.showLoading({
        title: '登录中...',
      })
      const a = new wx.cloud.Cloud({
        resourceEnv: CONSTANT.ENV_ID,
        traceUser: true,
      })
      await a.init();
      wx.hideLoading();
      wx.showToast({
        title: '登录成功',
        icon: 'succes',
        duration: 1000,
        mask: true
      });
    },
  }
})