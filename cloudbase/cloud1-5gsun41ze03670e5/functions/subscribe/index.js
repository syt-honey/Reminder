// 云函数入口文件
const {
  TEMPLATE_ID
} = require("./contant.js");
const cloud = require('wx-server-sdk')

cloud.init();

let open_id = "oDieM5O5IexCyJSeCWqGGeN5sgJ8";

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  console.log(event)
  // open_id = wxContext.OPENID;
  // setRegular(12);

  await cloud.openapi.subscribeMessage.send({
    "touser": open_id,
    "page": 'pages/home/index',
    "lang": 'zh_CN',
    "data": {
      "thing6": {
        "value": '339208499'
      },
      "time12": {
        "value": '2015年01月05日'
      }
    },
    "templateId": TEMPLATE_ID,
    "miniprogramState": 'developer'
  });

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

// async function getProductFileList() {
//   // 发送通知
//   // let res = this.getTodayTaskList();
//   // if (res.code === 2001) {
//     await cloud.openapi.subscribeMessage.send({
//       "touser": open_id,
//       "page": 'pages/home/index',
//       "lang": 'zh_CN',
//       "data": {
//         "thing6": {
//           "value": '339208499'
//         },
//         "time12": {
//           "value": '2015年01月05日'
//         }
//       },
//       "templateId": TEMPLATE_ID,
//       "miniprogramState": 'developer'
//     });
//   // }
//   setTimeout(getProductFileList, 24 * 3600 * 1000); //之后每天调用一次
// }

// function setRegular(targetHour) {
//   let timeInterval, nowTime, nowSeconds, targetSeconds;
//   nowTime = new Date();
//   nowSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds();
//   targetSeconds = targetHour * 3600;
//   timeInterval = targetSeconds > nowSeconds ? targetSeconds - nowSeconds : targetSeconds + 24 * 3600 - nowSeconds;
//   setTimeout(getProductFileList, timeInterval * 1000);
// }

// async function getTodayTaskList() {
//   const res = {
//     code: null,
//     msg: '',
//     data: {
//       list: [],
//       count: null
//     }
//   };
//   // 求出“今天”的时间戳范围。筛选的日期应该在该时间段内。 规则：[)，开始时间为闭区间、结束时间为开区间
//   const now = new Date();
//   const yes = new Date(dayjs(now).format('YYYY-MM-DD') + " 00:00:00").getTime();
//   const tow = new Date(dayjs(now).format('YYYY-MM-DD') + " 23:59:59").getTime();

//   await db.collection("task")
//     .aggregate()
//     .match({
//       _openid: wxContext.OPENID
//     }).project({
//       _openid: 0
//     }).sort({
//       createTime: -1
//     }).end().then((r) => {
//       // 注：如果要写分页逻辑，获取长度的方法需要改
//       const list = r.list;

//       // 筛选出有 “今日” 的项
//       let returnList = [];
//       list.length && list.map(i => {
//         let tem = i.rules.dateList;
//         tem.length && (tem.some(i2 => i2.date >= yes && i2.date < tow)) &&
//           returnList.push(i);
//       });

//       res.code = CODE_STATUS.SUCCESS;
//       res.msg = "今日任务查询成功";
//       res.data.list = returnList;
//       res.data.count = returnList.length;
//     }).catch((err) => {
//       res.code = CODE_STATUS.ERROR;
//       res.msg = "今日任务查询失败：" + err;
//     });

//   return res;
// }