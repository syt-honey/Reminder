// 云函数入口文件
const {
 ENV,
 CODE_STATUS
} = require("./contant.js");
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database({
 env: ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
   ruleName,
   ruleList
 } = event;

  const res = {
   code: null,
   msg: "",
   data: {}
  };

  const createTime = new Date().getTime();

  await db.collection("rule").add({
    data: {
      ruleName,
      ruleList,
      _openid: wxContext.OPENID,
      createTime,
      isDeleted: false,
      updateTime: createTime
    }
  }).then(() => {
    res.code = CODE_STATUS.SUCCESS;
    res.msg = "规则创建成功";
  }).catch((err) => {
    res.code = CODE_STATUS.ERROR;
    res.msg = "规则创建失败：" + err;
  });

 return {
  res,
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
 }
}