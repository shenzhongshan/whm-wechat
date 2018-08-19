//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
      userInfo: {},
      isLogon: false,
      hasUserInfo: false
    },
    onLoad: function() {
      var me = this;
      app.isLogon = tkn => {
        me.setData({
          isLogon: !!tkn
        });
        if (me.data.isLogon) {
          wx.showTabBar({
            animation: true
          })
        }else{
          wx.hideTabBar({
            animation: true
          })
        }
      }
      me.setData({
        isLogon: !!app.token
      });

      if (app.userInfo) {
        me.setData({
          userInfo: app.userInfo,
          hasUserInfo: true
        })
      } else {
        wx.getUserInfo({
          success: res => {
            app.userInfo = res.userInfo
            me.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        });
      }
    },
    onReady:function(){
      if(this.data.isLogon){
        wx.showTabBar({
          animation: true
        })
      }else{
          wx.hideTabBar({
            animation: true
          });
      }
    }
})