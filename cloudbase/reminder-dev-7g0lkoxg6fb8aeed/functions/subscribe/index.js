// 云函数入口文件
const {
 ENV,
 CODE_STATUS
} = require("./contant.js");
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database({
 env: ENV
});
// 云函数入口函数
exports.main = async (event, context) => {
 const res = {
  code: null,
  msg: '',
  data: {
   list: [],
   count: null
  }
 };
 const wxContext = cloud.getWXContext()

 try {

  let message = await db
  .collection("messages").where({
   touser: wxContext.OPENID,
   templateId: event.templateId,
  })
  .get();

  if (message.data.length) {
   res.code = CODE_STATUS.SUCCESS;
   res.msg = "订阅成功";
   res.data.list = message;
  } else {
   const result = await db.collection("messages").add({
    data: {
     ...event,
     touser: wxContext.OPENID,
     page: "home"
    }
   });
 
   res.code = CODE_STATUS.SUCCESS;
   res.msg = "订阅成功";
   res.data.list = result;
  }

 } catch (err) {
  res.code = CODE_STATUS.ERROR;
  res.msg = "订阅失败" + err;
 }

 return {
  res,
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}