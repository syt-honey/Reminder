// components/task-item/task-item.js
import Dialog from '@vant/weapp/dialog/dialog';
const dayjs = require("./dayjs");
const app = getApp();

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
    openSide: "left",
    todayStart: null,
    todayEnd: null,
    todayStatus: null // 1 已完成 -1 未完成
  },

  ready() {
    let now = new Date();
    this.setData({
      todayStart: new Date(dayjs(now).format('YYYY-MM-DD') + " 00:00:00").getTime(),
      todayEnd: new Date(dayjs(now).format('YYYY-MM-DD') + " 23:59:59").getTime()
    }, () => {
      // 获取当前任务的完成状态
      this.properties.taskItem.rules.dateList.map(i => {
        if (i.date >= this.data.todayStart && i.date < this.data.todayEnd) {
          this.setData({
            todayStatus: i.done ? 1 : -1
          });
        }
      });
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpen(event) {
      const {
        position
      } = event.detail;
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
      wx.showToast({
        icon: "error",
        title: '还没写好哦~',
        duration: 2000,
        mask: true
      })
      if (detail === "left") {
        // 已经完成了，则说明要去取消
        let type = this.data.todayStatus === 1 ? 1 : 2;
        console.log(type)
        // 完成/取消
        // this.finishOrCancelTask(type);
      } else if (detail === "right") {
        // 删除
        // this.deleteTask();
      }
    },
    deleteTask() {
      Dialog.confirm({
        context: this,
        title: '删除任务',
        message: '确定删除该任务吗？',
        confirmButtonColor: '#4fc08d'
      }).then(() => {
        // 调用删除接口
      });
    },
    finishOrCancelTask(type) {
      wx.showLoading({
        title: '正在更新...',
      });

      // 完成
      const req = {
        _id: this.properties.taskItem._id,
        date: this.properties.taskItem.rules.dateList.filter(i => {
          return i.date >= this.data.todayStart && i.date < this.data.todayEnd
        })[0].date,
        type
      };

      app.globalData.cloud.callFunction({
        name: "finishOrCancelTask",
        data: {
          ...req
        }
      }).then(() => {
        console.log('lal')
        this.triggerEvent('refresh');
        wx.hideLoading({
          success: () => {},
        });
      }).catch((err) => {
        console.log('err')
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: err,
              duration: 1000,
              mask: true
            });
          },
        });
      });
    }
  }
});