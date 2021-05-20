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
 const wxContext = cloud.getWXContext()
 const {
  _id,
  date,
  type // 1 取消 2 完成
 } = event;

 const res = {
  code: null,
  msg: ''
 };

 await db.collection("task").where({
  _id: _id,
  'rules.dateList.date': date
 }).update({
  data: {
   'rules.dateList.$.done': type === 1 ? false : true
  }
 }).then(r => {
  res.code = CODE_STATUS.SUCCESS;
  res.msg = "更新成功";
 }).catch((err) => {
  res.code = CODE_STATUS.ERROR;
  res.msg = "更新失败：" + err;
 });


 return {
  event,
  res,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}