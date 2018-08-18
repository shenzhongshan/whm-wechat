const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  formSubmit: function (e) {
    var me = this;
    console.log(e.detail.value);
    wx.request({
      url: app.serviceUrl+"/wechat/bind",
      data: {
        username: e.detail.value.username,
        password: e.detail.value.password,
        openid: app.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          me.loginServer();
        }
      }
    })
  },
  loginServer: function(){
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
        console.log(res.header)
        app.token = res.header['Authorization'];
      },
      complete: function (res) {
        if (app.token) {
          wx.showToast({
            title: "登陆成功",
            icon: 'success',
            duration: 20000,
            success: function () {
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/worksheet/worksheet'
                })
              }, 2000)
            }
          })
        }
      }
    });
  }
})