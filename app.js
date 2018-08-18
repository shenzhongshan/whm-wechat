//app.js
var util = require("/utils/util.js");
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.serviceUrl+'/wechat/login',
          data:{
            authCode:res.code
          },
          method:'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var app = getApp();
            //console.log(res)
            app.openid = res.data['openId'];
            loginServer();
          },
          complete: function (res) {

          }
        })
      }
    });
  },
  util:util,
  token:null,
  openid:null,
  userInfo:null,
  staffName:'',
  currentMonth: util.formatMonth(new Date()),
  serviceUrl:'http://120.31.136.125:9400/whm'
});
function loginServer() {
  var app = getApp();
  wx.request({
    url: app.serviceUrl + '/login',
    data: {
      username: 'wechat-user',
      password: app.openid
    },
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      //console.log(res.header)
      app.token = res.header['Authorization'];
      if (app.isLogon) {
        app.isLogon(app.token);
      }
    },
    complete: function (res) {
      if (app.token) {
        wx.navigateTo({
          url: '/pages/index/index'
        })
      }
    }
  });
}
