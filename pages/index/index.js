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
      if(!this.data.isLogon){
        wx.hideTabBar({
          animation: true
        });
      }
      app.isLogon = tkn => {
        this.setData({
          isLogon: !!tkn
        });
        if (this.data.isLogon) {
          wx.showTabBar({
            animation: true
          })
        }
      }
      this.setData({
        isLogon: !!app.token
      });

      if (app.userInfo) {
        this.setData({
          userInfo: app.userInfo,
          hasUserInfo: true
        })
      } else {
        wx.getUserInfo({
          success: res => {
            app.userInfo = res.userInfo
            this.setData({
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
      }
    }
})