const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
  },
  formSubmit: function (e) {
    var me = this;
    debugger;
    //console.log(e.detail.value);
    wx.request({
      
      url: app.serviceUrl+"/wechat/bind",
      data: {
        username: e.detail.value.username,
        password: e.detail.value.password,
        openid: me.data.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          me.loginServer();
        }
      }
    })
  },
  loginServer: function(){
    var me = this;
    wx.request({
      url: app.serviceUrl + '/login',
      data: {
        username: 'wechat-user',
        password: me.data.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.header)
        app.token = res.header['Authorization'];
      },
      complete: function (res) {
        if (app.token) {
          wx.showToast({
            title: "登陆成功",
            icon: 'success',
            duration: 2000,
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
  },
  onLoad:function(){
      this.setData({
         openid:app.openid
      });
      app.setOpenid = oid => {
        this.setData({
          openid: app.openid
        });
      }
  }
})