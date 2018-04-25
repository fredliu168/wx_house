// pages/rent_room_list/rent_room_list.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiUrl: 'https://w.qzcool.com/api/v1.0/',
    rooms_list: [],//房间列表 
    banner_image: 'https://w.qzcool.com/api/v1.0/banner',
    search_value:'',
    curent_page_index: 1,//当前页面
    cond:'',//查询条件
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
          { 'id': 1, 'text': '价格从低到高' },
          { 'id': 2, 'text': '价格从高到低' },
          { 'id': 3, 'text': '面积从小到大' },
          { 'id': 4, 'text': '面积从大到小' },
          { 'id': 5, 'text': '发布时间' }
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
          { 'id': 4, 'text': '四房' },
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

  searchValueInput: function (e) {
    var value = e.detail.value;
    console.log(value);
    this.setData({
      searchValue: value,
    });
    // if (!value && this.data.productData.length == 0) {
    //   this.setData({
    //     centent_Show: false,
    //   });
    // }
    this.data.search_value = value;
    this.data.curent_page_index = 1

    this.data.rooms_list=[];
    

    if (!value || value.length == 0)
    {
      this.LoadRoomsList(1)
    }else
    {
      this.search_data(value, 1);
    }


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
    console.log('onPullDownRefresh');
    this.data.curent_page_index = 1;
    this.data.search_value = '';
    this.data.cond ='';

    //初始化
    for (var index in this.data.tabTxt) { 
      this.data.tabTxt[index].type = 0;
      this.data.tabTxt[index].text = this.data.tabTxt[index].originalText;
    }

    this.setData({
      tabTxt: this.data.tabTxt,
    }); 

    this.setData({
      searchValue: '',
    });
    
    this.data.rooms_list = [];
    this.LoadRoomsList(1);
    wx.stopPullDownRefresh();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    this.data.curent_page_index++; 

    if (this.data.search_value.length != 0) {

      this.search_data(this.data.search_value, this.data.curent_page_index);
    
    } else if (this.data.cond.length != 0)
    {
      this.get_data_by_cond(this.data.cond,this.data.curent_page_index)
    }else
    {
      this.LoadRoomsList(this.data.curent_page_index)
    }

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
    console.log(data);
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

        var len = e.target.dataset.txt.length;
        data[index].text = len < 5 ? e.target.dataset.txt: e.target.dataset.txt.slice(0,5)+'...';
        //更改删除条件
        that.data.searchParam[index] = data[index].text;
      }


    }

    that.setData({
      tabTxt: data
    })
    console.log(that.data.searchParam);
    console.log(that.data.tabTxt);

    var cond = '' ; //条件信息
    for (var index in that.data.tabTxt)
    {
      console.log(that.data.tabTxt[index]);
      cond += that.data.tabTxt[index].type + '_';
    }

    cond = cond.slice(0, cond.length -1);

    that.data.cond = cond;

    that.data.curent_page_index = 1;
    that.data.rooms_list=[];

    console.log(cond);
    that.get_data_by_cond(cond,1);
  },

  get_data_by_cond:function(cond,page){
    //获取条件数据
    var vm = this;
    var url = vm.data.apiUrl + 'rent-cond-house/' + cond + '/' + page;
    this.get_data(url);
  },

  search_data:function(key_word,page){
    //查询数据
    var vm = this;
    var url = vm.data.apiUrl + 'rent-search-house/' + encodeURI(key_word)+'/' + page;
    this.get_data(url);
  },

  get_data:function(url){
    //请求网络数据
    var vm = this;
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
  },

   //加载房间
   LoadRoomsList: function (page) {
    var vm = this;
    var url = vm.data.apiUrl + 'rent-house/' + page;

    this.get_data(url);

  }
})