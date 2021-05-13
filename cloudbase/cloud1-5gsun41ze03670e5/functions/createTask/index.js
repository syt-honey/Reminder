// 云函数入口文件
const env = "cloud1-5gsun41ze03670e5";

const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 const {
  taskName: task_name,
  remark
 } = event;

 const db = cloud.database({
  env: env
 });

 db.collection("task").add({
  data: {
   task_name,
   remark
  }
 }).then(res => {
  console.log(res, '存储成功！')
 });

 const wxContext = cloud.getWXContext();

 return {
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}