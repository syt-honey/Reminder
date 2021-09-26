// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
 ENV
} = require("./contant.js");

cloud.init({
 env: ENV
});

const db = cloud.database({
 env: ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
 const _ = db.command
 const messages = await db
  .collection('messages')
  .get();

 const sendPromises = messages.data.map(async message => {

  if (message.count <= 0) {
   return "count < 0, user refuse";
  }

  try {
   const id = message.touser;
   await cloud.callFunction({
    config: {
     env: ENV
    },
    name: 'getTodayTaskList',
    data: {
     openid: id
    }
   }).then(async res => {
    const {
     list
    } = res.result.res.data;

    let thing6 = {
     value: ""
    };

    const thing1 = {
     value: "任务提醒"
    };
    list.length && list.map((task, index) => {
     thing6.value += `${index + 1}.${task.taskName}`
    });

    // 规定为 20 个字符，暂时简单判断下
    if (thing6.value.length > 10) {
     thing6.value = thing6.value.substring(0, 10) + "...";
    }

    if (thing6) {
     await cloud.openapi.subscribeMessage.send({
      touser: message.touser,
      page: message.page,
      data: {
       thing1,
       thing6
      },
      templateId: message.templateId
     });

     return db.collection("messages").doc(message._id).update({
      data: {
       count: _.inc(-1)
      }
     });
    }
   })

  } catch (e) {
   return e;
  }
 });

 return Promise.all(sendPromises);
}