//获取应用实例
const app = getApp();
const util = app.util;
Page({
  data: {
    selectedMonth: null,
    workSheet:null,
    status:false
  },
  requestWorkSheet: function(){
    var me = this;
    console.log(this.data['selectedMonth']);
    var month = parseInt(this.data['selectedMonth'].replace('-',''));
     wx.request({
       url: app.serviceUrl + '/wts/listByCurrentUser/' + month,
       data: '',
       header: {
         'Authorization':app.token
       },
       method: 'get',
       dataType: 'json',
       responseType: '',
       success: function(res) {
         var submitStatus = res.data && res.data.length > 0;
         if (res.data && res.data.length > 0){
             res.data.forEach(item => {
               item.startDate = util.formatDate(new Date(item.startDate));
               item.endDate = util.formatDate(new Date(item.endDate));
               submitStatus = submitStatus && (item.status > 0);
           });
           me.setData({
             workSheet: res.data,
             status: submitStatus
           });
         }

       },
       fail: function(res) {},
       complete: function(res) {},
     })
  },
  datePickerBindchange: function (e) {
    this.setData({
      selectedMonth: e.detail.value,
      workSheet:[],
      status:false
    });
    app.currentMonth = this.data['selectedMonth'];
    this.requestWorkSheet();
  },
  submitBindHandler: function (e) {
    var me = this;
    var month = parseInt(this.data['selectedMonth'].replace('-', ''));
    wx.request({
      url: app.serviceUrl + '/wts/submit/' + month,
      data: '',
      header: {
        'Authorization': app.token
      },
      method: 'post',
      dataType: 'json',
      responseType: '',
      success: function (res) {
        if (res.statusCode == 200) {
          me.setData({
            status: true
          });
          wx.showToast({
            title: "提交成功",
            icon: 'success',
            duration: 2000,
            success: function () {
            }
          });
        }else{
          wx.showToast({
            title: "提交失败",
            icon: 'fail',
            duration: 2000,
            success: function () {
            }
          });
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  addBindHandler: function (e) {
    wx.navigateTo({
      url: '/pages/worksheet/edit'
    })
  },
  onLoad: function () {
    this.setData({ 
      selectedMonth: app.currentMonth
      });
  },
  onShow: function () {
    this.requestWorkSheet();
  }
})
