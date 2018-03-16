var util = require('../../utils/util.js')

// pages/room_detail/room_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiUrl: 'https://weixin.qzcool.com/',
    room_info:null,//房间信息 
    screenHeight: 0,
    screenWidth: 0,
    imagewidth: 0,//缩放后的宽  
    imageheight: 0,//缩放后的高 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options.roomid);
    this.loadRoomInfo(options.roomid)
  },

  imageLoad: function (e) {
    var imageSize = util.imageUtil(e);
    console.log(imageSize);
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    });
  }, 
  Call:function() {
    console.log('makePhoneCall');
    var vm = this;

    wx.makePhoneCall({
      phoneNumber: vm.data.room_info.phone, //此号码并非真实电话号码，仅用于测试  
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  loadRoomInfo: function (roomid){
    var vm = this;
    var url = vm.data.apiUrl + 'room/' + roomid;
    console.log(url)

    wx.showLoading({
      title: '加载中',
    });

    //服务器请求数据
    wx.request({
      url: url, //接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();

        var room = res.data['value'];
        
        const length = room.image.length;

        for (let i = 0; i < length; ++i) {
        
          room.image[i] = vm.data.apiUrl + 'image/' + room.image[i].name;
        }

        if (room.avatar != '')
          room.avatar = vm.data.apiUrl + 'avatar/' + room.avatar
        else
          room.avatar = vm.data.apiUrl + 'avatar/default'


        vm.setData({
          room_info: room,
        }); 
        }});
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