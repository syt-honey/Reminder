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
 const {
  _id
 } = event;

 const res = {
  code: null,
  msg: ''
 };

 await db.collection("task").where({
   _id: _id
  })
  .remove().then(() => {
   res.code = CODE_STATUS.SUCCESS;
   res.msg = "删除成功";
  }).catch(err => {
   res.code = CODE_STATUS.ERROR;
   res.msg = "删除失败" + err;
  });

 return {
  res,
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}