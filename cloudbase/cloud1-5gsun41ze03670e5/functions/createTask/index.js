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
    createTime,
    rules
  } = event;

  const res = {
    code: null,
    msg: "",
    data: {}
  };

  await db.collection("task").add({
    data: {
      taskName,
      remark,
      _openid: wxContext.OPENID,
      createTime,
      rules
    }
  }).then(() => {
    res.code = CODE_STATUS.SUCCESS;
    res.msg = "任务创建成功";
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