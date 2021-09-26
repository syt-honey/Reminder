// 云函数入口文件
const {
 ENV,
 CODE_STATUS
} = require("./contant.js");
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
 env: ENV
});

// 云函数入口函数
/**
 * 是否订阅？如果订阅了，count 为多少？
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
 const wxContext = cloud.getWXContext()
 const res = {
  code: null,
  msg: '',
  data: {
   isSubscribe: false,
   count: null
  }
 };

 try {
  const messages = await db
   .collection("messages").where({
    touser: wxContext.OPENID,
    templateId: event.templateId,
   })
   .get();
  if (messages.data.length) {
   res.code = CODE_STATUS.SUCCESS;
   res.msg = "查阅成功";
   res.data.isSubscribe = true;
   res.data.count = messages.data[0].count;
  } else {
   res.code = CODE_STATUS.SUCCESS;
   res.msg = "查阅成功";
  }
 } catch (e) {
  res.code = CODE_STATUS.ERROR;
  res.msg = "查阅失败";
 }

 return {
  res,
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}