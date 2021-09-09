// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
 ENV,
 CODE_STATUS
} = require("./contant.js");

cloud.init()
const db = cloud.database({
 env: ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
 const wxContext = cloud.getWXContext()
 const res = {
  code: null,
  msg: '',
  data: {
   list: [],
   count: null
  }
 };

 await db.collection("rule")
 .aggregate()
 .match({
  _openid: wxContext.OPENID
 }).project({
  _openid: 0
 }).sort({
  refCount: -1
 }).end().then((r) => {
  res.code = CODE_STATUS.SUCCESS;
  res.msg = "规则查询成功";
  res.data.list = r.list;
  res.data.count = r.list.length;
 }).catch((err) => {
  res.code = CODE_STATUS.ERROR;
  res.msg = "规则查询失败：" + err;
 });

 return {
  res,
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}