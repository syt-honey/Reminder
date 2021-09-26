// components/rule-item/rule-item.js
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();
const dayjs = require("./dayjs");

Component({
 /**
  * 组件的属性列表
  */
 properties: {
   ruleItem: {
     type: Object,
     value: {}
   },
   operator: {
     type: Boolean,
     value: true
   }
 },

 observers: {
  'ruleItem'(val) {
    if (val) {
      this.setData({
        formatCreateTime: dayjs(new Date(this.properties.ruleItem.createTime)).format("YYYY-MM-DD")
      });
      if (this.selectComponent('#swipe-cell')) {
        this.selectComponent('#swipe-cell').close();
      }
    }
  }
},

 /**
  * 组件的初始数据
  */
 data: {
  openSide: "left",
  formatCreateTime: null
 },

 /**
  * 组件的方法列表
  */
 methods: {
  onClick(e) {
   if (e.detail === "right") {
    // 删除
    // this.deleteRule();
    wx.showToast({
     title: '正在上线的路上',
     icon: "error",
     duration: 1000,
    })
   }
  },
  deleteRule() {
   Dialog.confirm({
    context: this,
    title: '删除规则',
    message: '确定删除该规则吗？',
    confirmButtonColor: '#4fc08d'
   }).then(() => {
    // 调用删除接口
    wx.showLoading({
      title: '正在删除...',
    });

    const req = {
      _id: this.properties.ruleItem._id
    };

    app.globalData.cloud.callFunction({
      name: "deleteRule",
      data: {
        ...req
      }
    }).then((res) => {
      const {
        msg
      } = res.result.res;
      this.triggerEvent('refresh');
      wx.hideLoading({
        success: () => {
          wx.showToast({
            title: msg,
            duration: 1000,
            mask: true
          });
        },
      });
    }).catch((err) => {
      wx.hideLoading({
        success: () => {
          wx.showToast({
            title: JSON.stringify(err, Object.getOwnPropertyNames(err)),
            icon: "error",
            duration: 1000,
            mask: true
          });
        },
      });
    });
  });
  },
  onOpen(event) {
   const {
     position
   } = event.detail;
   if (position === "right") {
     // 删除
     this.setData({
       openSide: position
     });
   }
  },
 }
})
