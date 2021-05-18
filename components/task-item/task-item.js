// components/task-item/task-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskItem: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemTem: []
  },

  ready() {
    const i = this.properties.taskItem;
    i.rules = [{
      date: "1621301158251",
      done: true
    }, {
      date: "1621180800000",
      done: true
    }, {
      date: "1621008000000",
      done: true
    }, {
      date: "1620921600000",
      done: true
    }];
    this.setData({
      itemTem: i
    }, () => {
      // console.log(this.data.itemTem)
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})