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

 await db.collection("task")
 .aggregate()
 .match({
  _openid: wxContext.OPENID
 }).sort({
  createTime: -1
 }).end().then((r) => {
  const list = r.list;
  const resList = [];
  list.length && list.map(item => {
   let tem = item.rules.dateList;
   tem.length && tem.map(subItem => {
    const timeItem = resList.find((v) => v.date === subItem.date)
    if (timeItem) {
     timeItem.taskList.push({
      id: item._id,
      name: item.taskName,
      done: subItem.done
     });
    } else {
     resList.push({
      date: subItem.date,
      day: subItem.dateOfDay,
      taskList: [
       {
        id: item._id,
        name: item.taskName,
        done: subItem.done
       }
      ]
     })
    }
   });
  });

  resList.sort((a, b) => a.date > b.date ? 1 : -1);
  res.code = CODE_STATUS.SUCCESS;
  res.msg = "任务查询成功";
  res.data.list = resList;
  res.data.count = resList.length;
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