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
    itemTem: [],
    openSide: "left"
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
      done: false
    }, {
      date: "1620921600000",
      done: false
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
    onOpen(event) {
      const { position } = event.detail;
      if (position === "left") {
        // 完成/取消
        this.setData({
          openSide: position
        });
      } else if (position === "right") {
        // 删除
        this.setData({
          openSide: position
        });
      }
    },
    onClick({
      detail
    }) {
      if (detail === "left") {
        // 完成/取消
        this.finishTask();
      } else if (detail === "right") {
        // 删除
        this.deleteTask();
      }
    },
    deleteTask() {
      console.log('delete')
    },
    finishTask() {
      console.log('finished')
    }
  }
})