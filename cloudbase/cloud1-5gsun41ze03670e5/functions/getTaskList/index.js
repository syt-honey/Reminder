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

 await db.collection("task")
 .aggregate()
 .match({
  _openid: wxContext.OPENID
 }).project({
  _openid: 0
 }).sort({
  createTime: 1
 }).end().then((r) => {
  // 注：如果要写分页逻辑，获取长度的方法需要该
  const list = r.list;
  // 不将 _openid 暴露给前端
  list.length && list.map(item => {
   let tem = item.rules.dateList;
   tem.length && (tem = tem.sort((a, b) => {
    return (a.date < b.date) ? -1 : (a.date > b.date) ? 1 : 0;
   }));
  });

  res.code = CODE_STATUS.SUCCESS;
  res.msg = "任务查询成功";
  res.data.list = list;
  res.data.count = list.length;
 }).catch((err) => {
  res.code = CODE_STATUS.ERROR;
  res.msg = "任务查询失败：" + err;
 });

 return {
  event,
  res,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}