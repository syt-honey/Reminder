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

 // 1. 根据 date、id 更新对应 done 字段
 // 2. 更新完成后再更新 allDone 字段
 await db.collection("task").where({
  _id: _id,
  'rules.dateList.date': date
 }).update({
  data: {
   'rules.dateList.$.done': type === 1 ? false : true
  }
 }).then(async () => {
  await db.collection("task").where({
   _id: _id
  }).get().then(async r => {

   if (r.data.length) {
    let o = r.data[0];
    const allDone = o.rules.dateList.every(i => i.done === true);

    if (allDone !== o.rules.allDone) {
     await db.collection("task").where({
      _id: _id
     }).update({
      data: {
       'rules.allDone': allDone
      }
     }).then(() => {
      res.code = CODE_STATUS.SUCCESS;
      res.msg = "更新成功";
     }).catch((err) => {
      res.code = CODE_STATUS.ERROR;
      res.msg = "更新失败：" + err;
     });
    } else {
     res.code = CODE_STATUS.SUCCESS;
      res.msg = "更新成功";
    }
   }
  }).catch((err) => {
   res.code = CODE_STATUS.ERROR;
   res.msg = "更新失败：" + err;
  });
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
