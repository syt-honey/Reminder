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

 const resquest = {
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

  const res = await getCollectionById(_id);
  console.log(res)
  // await db.collection("task").where({
  //  _id: _id
  // }).get().then(async res => {

   if (res.data.length) {
    let o = res.data[0];
    const allDone = o.rules.dateList.every(i => i.done === true);
    console.log(allDone, o.rules.allDone);

    if (allDone !== o.rules.allDone) {
     await updateAllDoneById(_id);
     // await db.collection("task").where({
     //  _id: _id
     // }).update({
     //  data: {
     //   'rules.allDone': allDone
     //  }
     // }).then(() => {
      resquest.code = CODE_STATUS.SUCCESS;
      resquest.msg = "更新成功";
     // });
    }
   }
  // });
 }).catch((err) => {
  resquest.code = CODE_STATUS.ERROR;
  resquest.msg = "更新失败：" + err;
 });

 return {
  event,
  resquest,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}

async function updateAllDoneById(id) {
 console.log('update alldone')
 return await db.collection("task").where({
  _id: id
 }).update({
  data: {
   'rules.allDone': allDone
  }
 });
}

async function getCollectionById(id) {
 console.log('query by id')
 return await db.collection("task").where({
  _id: id
 }).get();
}