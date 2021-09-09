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
    taskName,
    remark,
    rules
  } = event;

  const res = {
    code: null,
    msg: "",
    data: {}
  };

  const createTime = new Date().getTime();

  await db.collection("task").add({
    data: {
      taskName,
      remark,
      _openid: wxContext.OPENID,
      createTime,
      rules,
      updateTime: createTime
    }
  }).then(() => {
    res.code = CODE_STATUS.SUCCESS;
    res.msg = "任务创建成功";

    setRegular(14);
    
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


 function getProductFileList() {
  console.log('getProductFileList')
  // 发送通知
  // let res = await cloud.callFunction({
  //   name: "getTodayTask",
  //   data: {}
  // });

  // console.log(res)
  
  // if (res.code === 2001) {
  //   console.log('success', res)
  //   await cloud.openapi.subscribeMessage.send({
  //     "touser": open_id,
  //     "page": 'pages/home/index',
  //     "lang": 'zh_CN',
  //     "data": {
  //       "thing6": {
  //         "value": '339208499'
  //       },
  //       "time12": {
  //         "value": '2015年01月05日'
  //       }
  //     },
  //     "templateId": TEMPLATE_ID,
  //     "miniprogramState": 'developer'
  //   });
  // }
  setTimeout(getProductFileList, 24 * 3600 * 1000); //之后每天调用一次
}

function setRegular(targetHour) {
  let timeInterval, nowTime, nowSeconds, targetSeconds;
  nowTime = new Date();
  nowSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds();
  targetSeconds = targetHour * 3600;
  timeInterval = targetSeconds > nowSeconds ? targetSeconds - nowSeconds : targetSeconds + 24 * 3600 - nowSeconds;
  console.log(timeInterval)
  setTimeout(getProductFileList, timeInterval * 1000);
}