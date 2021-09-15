// components/rule-item/rule-item.js
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
 },

 lifetimes: {
  attached() {
   console.log(this.properties.ruleItem)
  }
 },

 /**
  * 组件的方法列表
  */
 methods: {
  onClick() {
   console.log('click')
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
