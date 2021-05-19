// 云函数入口文件
const {
 ENV,
 CODE_STATUS
} = require("./contant.js");
const cloud = require('wx-server-sdk');
const dayjs = require('dayjs');

cloud.init();

const db = cloud.database({
 env: ENV
});
const _ = db.command;

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

 // 求出“今天”的时间戳范围。筛选的日期应该在该时间段内。 规则：[)，开始时间为闭区间、结束时间为开区间
 const now = new Date();
 const yes = new Date(dayjs(now).format('YYYY-MM-DD') + " 00:00:00").getTime();
 const tow = new Date(dayjs(now).format('YYYY-MM-DD') + " 23:59:59").getTime();

 await db.collection("task")
 .aggregate()
 .match({
  _openid: wxContext.OPENID,
  create_time: _.gte(yes).lt(tow)
 }).project({
  _openid: 0
 }).sort({
  create_time: 1
 }).end().then((r) => {
  // 注：如果要写分页逻辑，获取长度的方法需要该
  const list = r.list;
  res.code = CODE_STATUS.SUCCESS;
  res.msg = "任务查询成功";
  res.data.list = list;
  res.data.count = list.length;
 }).catch((err) => {
  res.code = CODE_STATUS.ERROR;
  res.msg = "任务查询失败：" + err;
 });

 return {
  res,
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}