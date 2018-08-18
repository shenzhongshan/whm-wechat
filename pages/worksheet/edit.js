// pages/index/edit.js
const app = getApp();
const util = app.util;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    id:null,
    month: '',
    prjPhaseIndex: 0,
    prjPositionIndex: 0,
    projectIndex:0,
    startDate: null,
    endDate: null,
    projects:[],
    idsIndex:[],
    prjPhases: ['规划研究','预可行性研究','可行性研究','初步设计','施工图设计','配合施工','变更设计','初测','定测'],
    prjPositions: ['总体','副总体','专业设计负责人','一般设计人员','技术队长','内业组长','一般外业人员']
  },
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindProjectChange: function (e) {
    this.setData({
      projectIndex: e.detail.value
    });
  },
  bindPrjPhaseChange: function (e) {
    this.setData({
      prjPhaseIndex: e.detail.value
    })
  },
  bindPrjPositionChange: function (e) {
    this.setData({
      prjPositionIndex: e.detail.value
    })
  },
  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  cancelBindHandler: function (e) {
    wx.navigateTo({
      url: '/pages/worksheet/worksheet'
    })
  },
  saveBindHandler: function (e) {
    var pdata = this.data;
    var month = parseInt(pdata.month.replace('-', ''));
    var sheet = {
      id: pdata.id,
      month: month,
      prjId: pdata.projects[pdata.projectIndex].prjId,
      prjPhase: pdata.prjPhases[pdata.prjPhaseIndex],
      prjPosition: pdata.prjPositions[pdata.prjPositionIndex],
      startDate: pdata.startDate,
      endDate: pdata.endDate
    }
    this.saveWorksheet(sheet);
  },
  saveWorksheet: function (sheet) {
    var me = this;
    wx.request({
      url: app.serviceUrl + '/wts/save/',
      data: sheet,
      header: {
        'Authorization': app.token
      },
      method: 'post',
      dataType: 'json',
      responseType: '',
      success: function (res) {
        if (res.statusCode==200){
          wx.showToast({
            title: "保存成功",
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateTo({
                url: '/pages/worksheet/worksheet'
              })
            }
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  queryProjects: function(){
    //console.log(this.data['month']);
    var month = parseInt(this.data['month'].replace('-', ''));
    var me = this;
    wx.request({
      url: app.serviceUrl + '/prj/list/' + month,
      data: '',
      header: {
        'Authorization': app.token
      },
      method: 'get',
      dataType: 'json',
      responseType: '',
      success: function (res) {
        var ids = [];
        res.data.forEach(item => {
          ids.push(item.prjId);
        });
        me.setData({
          projects:res.data,
          idsIndex: ids
        });
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  queryWorksheet: function (id) {
    //console.log(id);
    var me = this;
    wx.request({
      url: app.serviceUrl + '/wts/get/' + id,
      data: '',
      header: {
        'Authorization': app.token
      },
      method: 'get',
      dataType: 'json',
      responseType: '',
      success: function (res) {
        debugger;
        if (res.statusCode==200){
          var rd = res.data;
          var idxph = me.data.prjPhases.indexOf(rd.prjPhase), 
              idxpo = me.data.prjPositions.indexOf(rd.prjPosition), 
            idxprj = me.data.idsIndex.indexOf(rd.prjId);
          me.setData({
            id: rd.id,
            month: Math.round(rd.month / 100) + '-' + util.formatNumber((rd.month %100)),
            prjPhaseIndex: idxph < 0 ? 0 : idxph,
            prjPositionIndex: idxpo < 0 ? 0 : idxpo,
            projectIndex: idxprj < 0 ? 0 : idxprj,
            startDate: util.formatDate(new Date(rd.startDate)),
            endDate: util.formatDate(new Date(rd.endDate))
          });
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ym = app.currentMonth.split('-');
    var y = parseInt(ym[0]), m = parseInt(ym[1]);
    var firstDay = new Date(y, m-1, 1);
    var lastDay = new Date(y, m, 0);
    this.setData({
       month: app.currentMonth,
      startDate: util.formatDate(firstDay),
      endDate: util.formatDate(lastDay)
       });
    this.queryProjects();
    if(options.id){
      this.queryWorksheet(options.id);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})