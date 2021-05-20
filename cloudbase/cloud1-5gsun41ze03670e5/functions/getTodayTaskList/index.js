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
   _openid: wxContext.OPENID
  }).project({
   _openid: 0
  }).sort({
   createTime: 1
  }).end().then((r) => {
   // 注：如果要写分页逻辑，获取长度的方法需要改
   const list = r.list;

   // 筛选出有 “今日” 的项
   let returnList = [];
   list.length && list.map(i => {
    let tem = i.rules.dateList;
    tem.length && (tem.some(i2 => i2.date >= yes && i2.date < tow)) &&
     returnList.push(i);
   });

   // 对日期进行排序
   returnList.length && returnList.map(i => {
    let tem = i.rules.dateList;
    tem.length && (tem = tem.sort((a, b) => {
     return (a.date < b.date) ? -1 : (a.date > b.date) ? 1 : 0;
    }));
   });

   res.code = CODE_STATUS.SUCCESS;
   res.msg = "今日任务查询成功";
   res.data.list = returnList;
   res.data.count = returnList.length;
  }).catch((err) => {
   res.code = CODE_STATUS.ERROR;
   res.msg = "今日任务查询失败：" + err;
  });

 return {
  res,
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}