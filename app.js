// app.js
import CONSTANT from "./utils/CONSTANT";
App({
  onLaunch() {
    this.getSystemInfo();
    this.checkAuthorization().then(() => {});
    this.initCloud();
  },
  initCloud() {
    this.globalData.cloud = new wx.cloud.Cloud({
      resourceEnv: CONSTANT.ENV_ID,
      traceUser: true,
    })
    this.globalData.cloud.init();
  },
  checkAuthorization() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        withSubscriptions: true, // 同时获取用户订阅消息的订阅状态
        success: (res) => {
          const userInfo = wx.getStorageSync('userInfo');
          if (res.authSetting['scope.userInfo'] && userInfo) {
            // 授权过
            this.globalData.isAuthorize = true;
          } else {
            // 未授权
            this.globalData.isAuthorize = false;
          }
          resolve(0);
        },
        fail: () => {
          this.globalData.isAuthorize = false;
          reject(-1);
        }
      });
    })

  },
  // 初始化屏幕宽高、状态栏，确定设备类型、导航栏高度
  getSystemInfo() {
    const sysInfo = wx.getSystemInfoSync();
    const menuInfo = wx.getMenuButtonBoundingClientRect();
    const rate = parseInt(sysInfo.screenWidth) / 750;
    // 获取屏幕宽高、状态栏高，计算导航栏高，同时将拿到的 px 转换为 rpx
    ;
    [
      this.globalData.screenWidth,
      this.globalData.screenHeight,
      this.globalData.statusBarHeight
    ] = [
      sysInfo.screenWidth / rate,
      sysInfo.screenHeight / rate,
      sysInfo.statusBarHeight / rate
    ];
    this.globalData.navbarHeight = (menuInfo.height + (menuInfo.top - sysInfo.statusBarHeight) * 2) / rate;

    // 获取当前设备类型
    const systems = ["ios", "android"];
    const sys = sysInfo.system.toLocaleLowerCase();
    const expectedSystem = systems.some(type => {
      return sys.indexOf(type) > -1;
    });
    if (expectedSystem) {
      this.globalData.system = sys;
    } else {
      console.warn("Unexpected system!");
    }
  },
  globalData: {
    rate: 0, // 屏幕宽度 / 750。可用于 px 和 rpx 之间的精确转换
    userInfo: null,
    screenHeight: 0,
    screenWidth: 0,
    statusBarHeight: 0,
    navbarHeight: 0,
    system: "ios",
    isAuthorize: null,
    cloud: null
  }
})