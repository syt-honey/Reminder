// app.js
App({
  onLaunch() {
    this.checkAuthorization();
    this.getSystemInfo();
  },
  async checkAuthorization() {
    await wx.getSetting({
      withSubscriptions: true, // 同时获取用户订阅消息的订阅状态
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 授权过
          this.globalData.isAuthorize = true;
        } else {
          // 未授权
          this.globalData.isAuthorize = false;
        }
      }
    })
  },
  // 初始化屏幕宽高、状态栏，确定设备类型、导航栏高度
  getSystemInfo() {
    const sysInfo = wx.getSystemInfoSync();
    const menuInfo = wx.getMenuButtonBoundingClientRect();
    // 获取屏幕宽高、状态栏高，计算导航栏高
    ;[
      this.globalData.screenWidth, 
      this.globalData.screenHeight,
      this.globalData.statusBarHeight
    ] = [
      sysInfo.screenWidth,
      sysInfo.screenHeight,
      sysInfo.statusBarHeight
    ];
    this.globalData.navbarHeight = menuInfo.height + (menuInfo.top - sysInfo.statusBarHeight) * 2;
  
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
    userInfo: null,
    screenHeight: 300,
    screenWidth: 350,
    statusBarHeight: 20,
    navbarHeight: 44,
    system: "ios",
    isAuthorize: null
  }
})
