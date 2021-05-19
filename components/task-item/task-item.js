// components/task-item/task-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskItem: {
      type: Object,
      value: {}
    },
    operator: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    openSide: "left"
  },

  ready() {
    console.log(this.data.taskItem)
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