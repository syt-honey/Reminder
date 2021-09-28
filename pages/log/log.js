const dayjs = require("dayjs");

// pages/log/log.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      minDate: new Date(2021, 1, 1).getTime(),
      maxDate: new Date(2021, 10, 10).getTime(),
      today: new Date().getTime(),
      recordList: [],
      formatter(day) {}
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      this.getTaskList();
   },

   /**
    * 获取任务记录
    */
   async getTaskList() {
      wx.showLoading({
         title: '任务记录获取中...',
      });

      let res = await app.globalData.cloud.callFunction({
         name: "getAllSchedule",
         data: {}
      });

      try {
         const {
            msg,
            code,
            data
         } = res.result.res;

         if (code === 2001) {
            wx.hideLoading({
               success: () => {
                  this.setData({
                     minDate: data.count ? new Date(data.list[0].day).getTime() : new Date().getTime(),
                     maxDate: data.count ? new Date(data.list[data.count - 1].day).getTime() : new Date().getTime(),
                     recordList: data.list
                  }, () => {
                     this.setData({
                        formatter: (day) => {
                           const date = dayjs(day.date).format("YYYY-MM-DD");
                           if (this.data.recordList) {
                              const d = this.data.recordList.find((v) => v.day === date);
                              if (d) {
                                 day.topInfo = d.taskList.every((v) => v.done) ? 'finished' : 'task';
                              }
                           }
                           return day;
                        }
                     })
                  });
               },
            });
         } else {
            wx.hideLoading({
               success: () => {
                  wx.showToast({
                     title: JSON.stringify(msg, Object.getOwnPropertyNames(msg)),
                     icon: "error",
                     duration: 1000,
                     mask: true
                  });
               },
            });
         }
      } catch {
         wx.hideLoading({
            success: () => {
               wx.showToast({
                  title: "任务创建失败",
                  icon: "error",
                  duration: 1000,
                  mask: true
               });
            },
         })
      };
   }
})