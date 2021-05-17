// 云函数入口文件
const {
 ENV,
 CODE_STATUS
} = require("./contant.js");
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database({
 env: ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
 const wxContext = cloud.getWXContext();
 const res = {
  code: null,
  msg: '',
  data: {
   list: [],
   count: null
  }
 };

 await db.collection("task").where({
  _openid: wxContext.OPENID,
 }).orderBy('create_time', 'desc').get().then((r) => {
  // 注：如果要写分页逻辑，获取长度的方法需要该
  const list = r.data;
  // 不将 _openid 暴露给前端
  list.length && list.map(item => {
   item._openid && delete item._openid;
  });
  res.code = CODE_STATUS.SUCCESS;
  res.msg = "任务创建成功";
  res.data.list = list;
  res.data.count = list.length;
 }).catch((err) => {
  res.code = CODE_STATUS.ERROR;
  res.msg = "任务创建失败：" + err;
 });

 return {
  event,
  res,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}