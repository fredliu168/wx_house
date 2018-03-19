// pages/rent_room_list/rent_room_list.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiUrl: 'https://weixin.qzcool.com/',
    rooms_list: [],//房间列表 
    banner_image: 'https://weixin.qzcool.com/banner',
    curent_page_index: 1,//当前页面
    screenHeight: 0,
    screenWidth: 0,
    imagewidth: 0,//缩放后的宽  
    imageheight: 0,//缩放后的高 ,
    tabTxt: [
      {
        'text': '排序',
        'originalText': '排序',
        'active': false,
        'child': [
          { 'id': 1, 'text': '按价格从低到高' },
          { 'id': 2, 'text': '按价格从高到低' },
          { 'id': 3, 'text': '按面积从小到大' },
          { 'id': 4, 'text': '按面积从大到小' },
          { 'id': 5, 'text': '按发布时间' }
        ],
        'type': 0
      },
      {
        'text': '价格',
        'originalText': '价格',
        'active': false,
        'child': [
          { 'id': 1, 'text': '1000元以下' },
          { 'id': 2, 'text': '1000元-2000元' },
          { 'id': 3, 'text': '2000元-3000元' },
          { 'id': 4, 'text': '3000元以上' }
        ], 'type': 0
      },
      {
        'text': '房型',
        'originalText': '房型',
        'active': false,
        'child': [
          { 'id': 1, 'text': '一房' },
          { 'id': 2, 'text': '两房' },
          { 'id': 3, 'text': '三房' },
          { 'id': 3, 'text': '四房' },
        ],
        'type': 0
      },
      {
        'text': '类型',
        'originalText': '类型',
        'active': false,
        'child': [
          { 'id': 1, 'text': '住宅' },
          { 'id': 2, 'text': '商铺' },
          { 'id': 3, 'text': '写字楼' },
        ],
        'type': 0
      }
    ],
    searchParam: []

  },
  
  imageLoad: function (e) {
    var imageSize = util.imageUtil(e);
    console.log(imageSize);
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    });


  },

  suo: function (e) {
    // wx.navigateTo({
    //   url: '../search/search',
    // })
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var vm = this;
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
    
    this.LoadRoomsList(1);
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
    
    console.log('onPullDownRefresh');
    this.data.rooms_list = [];
    this.LoadRoomsList(1);
    wx.stopPullDownRefresh();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.curent_page_index++;
    this.LoadRoomsList(this.data.curent_page_index); 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  
  filterTab: function (e) {
    var that = this;
    var data = JSON.parse(JSON.stringify(that.data.tabTxt));
    var index = e.currentTarget.dataset.index;
    var newTabTxt = data.map(function (e) {
      e.active = false;
      return e;
    });
    newTabTxt[index].active = !that.data.tabTxt[index].active;
    this.setData({
      tabTxt: data
    })

  },
  filterTabChild: function (e) {

    //我需要切换选中项 修改展示文字 并收回抽屉  
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = JSON.parse(JSON.stringify(that.data.tabTxt));
    if (typeof (e.target.dataset.id) == 'undefined' || e.target.dataset.id == '') {
      data[index].active = !that.data.tabTxt[index].active;
    }
    else {
      data[index].type = e.target.dataset.id;
      data[index].active = !that.data.tabTxt[index].active;
      if (e.target.dataset.id == '0') {
        data[index].text = that.data.tabTxt[index].originalText;
        //不限删除条件
        delete that.data.searchParam[index];
      }
      else {
        data[index].text = e.target.dataset.txt;
        //更改删除条件
        that.data.searchParam[index] = data[index].text;
      }


    }

    that.setData({
      tabTxt: data
    })
    console.log(that.data.searchParam);


  },

   //加载房间
   LoadRoomsList: function (page) {
    var vm = this;
    var url = vm.data.apiUrl + 'rent-house/' + page;

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

        //vm.data.rooms_list = []; 

        var rooms_list = []

        rooms_list.push(...res.data['value']);

        const length = rooms_list.length;

        for (let i = 0; i < length; ++i) {

          if (rooms_list[i].house_name == null)
            rooms_list[i].house_name = ''


          if (rooms_list[i].image.length != 0)
            rooms_list[i].image_s = vm.data.apiUrl + 'image/' + rooms_list[i].image[0].name;
          else
            rooms_list[i].image_s = vm.data.apiUrl + 'image/default'
        }


        vm.data.rooms_list.push(...rooms_list);

        console.log(vm.data.rooms_list)

        vm.setData({
          rooms_list: vm.data.rooms_list,
        });
      }
    })

  }
})