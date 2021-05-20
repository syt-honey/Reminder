const app = getApp();

Component({
  externalClasses: ['i-bg', 'i-margin'],
  /**
   * 组件属性列表
   */
  properties: {
    title: {
      type: String,
      value: ""
    },
    typeBar: {
      type: Number,
      value: 1
    },
    showCloseIcon: {
      type: Boolean,
      value: false
    },
    isHome: {
      type: Boolean,
      value: true
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navbarHeight: app.globalData.navbarHeight
  },
  /**
   * 生命周期
   */
  lifetimes: {
    attached() {
    }
  },

  methods: {
    goBack() {
      wx.navigateBack();
    }
  }
})