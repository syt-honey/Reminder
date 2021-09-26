// components/add-subscribe-count/add-subscribe-count.js
Component({
 /**
  * 组件的属性列表
  */
 properties: {
  show: {
   type: Boolean,
   value: false
  },
  count: {
   type: Number,
   value: 0
  }
 },

 /**
  * 组件的初始数据
  */
 data: {
 },

 /**
  * 组件的方法列表
  */
 methods: {
  addCount() {
   this.triggerEvent("addCount");
  },
  close() {
   this.triggerEvent("closeCount")
  }
 }
})
