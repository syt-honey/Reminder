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
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo(e) {
      // 获得最新的用户信息
      if (!e.detail.userInfo) {
        return;
      }
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
        title: '登录',
        icon: 'succes',
        duration: 1000,
        mask: true
      });
    },
  }
})