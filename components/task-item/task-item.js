// components/task-item/task-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready() {
    console.log(this.data.item)
  },

  /**
   * 组件的方法列表
   */
  methods: {
  
  }
})
