// pages/rooms_list/rooms_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiUrl: 'https://weixin.qzcool.com/',
    rooms_list: [],//房间列表 
    message:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var vm = this;
    vm.LoadRoomsList(1) //加载房间数据
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
  
  },

  //加载房间
   LoadRoomsList: function (page) {
    var vm = this;
    var url = vm.data.apiUrl + 'house/' + page;

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

       vm.data.rooms_list = []; 

       var rooms_list = []

       rooms_list.push(...res.data['value']);

       const length = rooms_list.length;
       
       for (let i = 0; i < length; ++i) {
         
         if (rooms_list[i].image.length != 0)
           rooms_list[i].image_s = vm.data.apiUrl + 'image/' + rooms_list[i].image[0].name;
         else
           rooms_list[i].image_s = ''       
       }


       vm.data.rooms_list.push(...rooms_list);
       
       console.log(vm.data.rooms_list)

       vm.setData({
         rooms_list: vm.data.rooms_list,
         message:'hello world'
       }); 
     }
     })

   }


})