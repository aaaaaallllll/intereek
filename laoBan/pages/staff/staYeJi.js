// pages/staff/staYeJi.js
import {
  Datas
} from '../../utils/data.js'
import {
  api
} from '../../api/config.js'
const datas = new Datas()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: false,
    begin: '',
    end: '',
    begintime: new Date().getTime(),
    endtime: new Date().getTime(),
    shopTitles: ['本日实收', '本月累计', '本月指标', '指标完成率'],
    gradeData: [],
    total: [],
    shopNames: [],
    companyList: [],
    datetype: 'date',
    left: 0,
    offsetTop: 10000,
    scrollTop: 0,
    shopName: '',
    yuEType: null,
    yuEList: [],
    huoDongType: null,
    huoDongList: [],
    catList:[],
    catType:null,
    jobList:[],
    jobType:null,
    seatText:'',
    xsList: [{
        name:'汇总'
      },
      {
        name: '明细'
      }],
    xsType: '汇总',
    timeList: [{
        name: '录单时间'
      },
      {
        name: '结账时间'
      }],
    ldType: '录单时间',
    jzList: [{
        name: '已结'
      },
      {
        name: '未结'
      }],
    jzType: '已结',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getToday()


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
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    const that = this
    let companyName = wx.getStorageSync('userinfo').companyName
    that.setData({
      shopName: companyName
    })
    var query = wx.createSelectorQuery()//创建节点查询器 query
    query.select('#title').boundingClientRect()//这段代码的意思是选择Id=the-id的节点，获取节点位置信息的查询请求
    query.selectViewport().scrollOffset()//这段代码的意思是获取页面滑动位置的查询请求
    query.exec(function (res) {
      // res[0].top       // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
      // console.log(res)
      that.setData({
        offsetTop: res[0].top,
      })
      // console.log(res[0].top)
      // console.log(res[0].left)
    })
    that.getXmList()
    that.getCat()
    that.getyesterday()
    that.getJob()
  },
  onPageScroll: function (e) {
    // console.log(e)//{scrollTop:99}
    this.setData({
      scrollTop: e.scrollTop
    })
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
  //获取日期
  resdata: function (e) {
    console.log(e)
    this.setData({
      begin: e.detail.begin,
      end: e.detail.end,
      begintime: e.detail.begintime,
      endtime: e.detail.endtime
    })
    // this.getList()
  },
  //切换查询方式
  changedata() {
    var status = this.data.status
    this.setData({
      status: !status
    })
  },
  //时段查询
  // checkdata: function (e) {
  //   var that = this;
  //   console.log(e)
  //   var type = e.currentTarget.dataset.id
  //   that.setData({
  //     type: type
  //   })
  //   if (type == 0) {
  //     this.getToday()
  //   } else if (type == 1) {
  //     this.getyesterday()
  //   } else if (type == 2) {
  //     this.getCurrentMonth()
  //   } else {
  //     this.getlastMonth()
  //   }
  // },
  // getToday() {
  //   var that = this;
  //   let timeType = 1;
  //   let end = datas.gettoday()
  //   let begin = datas.gettoday()
  //   let begin1 = begin.replace(/-/g, '/');
  //   let end1 = end.replace(/-/g, '/');
  //   that.setData({
  //     timeType: timeType,
  //     begin: begin,
  //     end: end,
  //     begintime: new Date(begin1).getTime(),
  //     endtime: new Date(end1).getTime()
  //   })
  //   this.getList()
  // },
  todetail(e) {
    let begin = e.currentTarget.dataset.begin
    let end = e.currentTarget.dataset.end
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/table/statisticsdetail?type=' + type + '&begin=' + begin + '&end=' + end,
    })
  },
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  },
  changedata() {
    var status = this.data.status
    this.setData({
      status: !status
    })
  },
  getdata: function (e) {
    // console.log(e)
    this.setData({
      begin: e.detail.begin,
      end: e.detail.end,
      begintime: e.detail.begintime,
      endtime: e.detail.endtime
    })
    this.getList()
  },
  getdatatimebegin: function (e) {
    // console.log(e)
    this.setData({
      begin: e.detail.data,
      begintime: e.detail.datatime
    })
  },
  getdatatimeend: function (e) {
    // console.log(e)
    this.setData({
      end: e.detail.data,
      endtime: e.detail.datatime
    })
  },
  formatter: function (val) {
    var strs = val.split(''); //字符串数组
    var str = ''
    for (var i = 0, s; s = strs[i++];) { //遍历字符串数组
      str += s;
      if (!(i % 4)) str += '\n'; //按需要求余
    }
    return str
  },
  getList() {
    // console.log('1')
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const companyCode = wx.getStorageSync('userinfo').companyCode
    const userId = wx.getStorageSync('userinfo').userId
    wx.request({
      url: api.url,
      data: {
        operationType: 'queryLocal',
        companyCode: companyCode,
        queryType: 'YuanGongYeJiBaoBiao',
        job:that.data.jobType,
        userId: that.data.seatText,
        cat: that.data.catType,
        dapart: that.data.yuEType,
        menu: that.data.huoDongType,
        showType: that.data.xsType,
        timeType: that.data.ldType,
        paid: that.data.jzType,
        begin: that.data.begin,
        // begin: '2019-04-07',
        end:that.data.end,
        logInUserId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        
        if (res.data.success) {
          const data = res.data.result
          that.setData({
            gradeData:data
          })
        } else {
          wx.showToast({

            title: res.data.errorDesc,

            icon: 'none',

            duration: 1000//持续的时间

          })
        }
      }
    })

  },
  getyesterday() {
    var that = this;
    let timeType = 1;
    let end = that.checkdatatime(datas.getyesterday())
    let begin = that.checkdatatime(datas.getyesterday())
    let begin1 = begin.replace(/-/g, '/');
    let end1 = end.replace(/-/g, '/');
    that.setData({
      timeType: timeType,
      begin: begin,
      end: end,
      begintime: new Date(begin1).getTime(),
      endtime: new Date(end1).getTime()
    })
    that.getList()
  },
  checkdatatime: function (e) {
    var time = new Date(e.replace(/-/g, '/'));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    if (this.data.datetype == 'date') {
      var datas = y + '-' + this.add0(m) + '-' + this.add0(d)
    } else {
      var datas = y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
    }

    return datas
  },
  add0: function (m) {
    return m < 10 ? '0' + m : m
  },
  getLeft(e) {
    // console.log(e.detail.scrollLeft)
    // console.log(e.currentTarget.offsetTop)
    let left = e.detail.scrollLeft
    let offsetTop = e.currentTarget.offsetTop
    this.setData({
      left: left,

    })
  },
  // 筛选
  bindPickeryuEtype(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      yuEType: that.data.yuEList[e.detail.value].name
    })
    console.log('1')
  },
  bindPickerHuoDongtype(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      huoDongType: that.data.huoDongList[e.detail.value].name
    })
    console.log('1')
  },
  bindPickerCattype(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      catType: that.data.catList[e.detail.value].name
    })
    console.log('1')
    that.getPage()
  },
  bindPickerJobtype(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      jobType: that.data.jobList[e.detail.value].name
    })
    console.log('1')
  },
  bindPickerXstype(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      xsType: that.data.xsList[e.detail.value].name
    })
    console.log('1')
  },
  bindPickerTimetype(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      ldType: that.data.timeList[e.detail.value].name
    })
    console.log('1')
  },
  bindPickerJztype(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      jzType: that.data.jzList[e.detail.value].name
    })
    console.log('1')
  },
  //获取列表
  getPage(){
    const that = this
    let companyCode = wx.getStorageSync('userinfo').companyCode
    if (that.data.catType==null){
      wx.showToast({

        title: '请选择项目类别',

        icon: 'none',

        duration: 1000//持续的时间

      })
      return
    }
    wx.request({
      url: api.url,
      data: {
        operationType: 'queryLocal',
        companyCode: companyCode,
        queryType: 'queryCatMenus',
        catName: that.data.catType
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success(res) {

        console.log(res.data)

        if (res.data.success) {
          const data = res.data.result
          let list = []
          for (let i = 0; i < data.length; i++) {
            let son = {
              name: data[i].name
            }
            list.push(son)
          }
          that.setData({
            huoDongList: list,
            // huoDongType: list[0].name
          })
        } else {
          wx.showToast({

            title: res.data.errorDesc,

            icon: 'none',

            duration: 1000//持续的时间

          })
        }
      }
    })
  },
  getJob(){
    const that = this
    let companyCode = wx.getStorageSync('userinfo').companyCode
    wx.request({
      url: api.url,
      data: {
        operationType: 'queryLocal',
        companyCode: companyCode,
        queryType: 'queryJobs',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success(res) {

        console.log(res.data)

        if (res.data.success) {
          const data = res.data.result
          let list = []
          for (let i = 0; i < data.length; i++) {
            let son = {
              name: data[i]
            }
            list.push(son)
          }
          that.setData({
            jobList: list,
            // jobType: list[0].name
          })
          
        } else {
          wx.showToast({

            title: res.data.errorDesc,

            icon: 'none',

            duration: 1000//持续的时间

          })
        }
      }
    })
  },
  getCat(){
    const that = this
    let companyCode = wx.getStorageSync('userinfo').companyCode
    wx.request({
      url: api.url,
      data: {
        operationType: 'queryLocal',
        companyCode: companyCode,
        queryType: 'queryCats',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success(res) {

        console.log(res.data)

        if (res.data.success) {
          const data = res.data.result
          let list = []
          for (let i = 0; i < data.length; i++) {
            let son = {
              name: data[i]
            }
            list.push(son)
          }
          that.setData({
            catList: list,
            // catType: list[0].name
          })
          
        } else {
          wx.showToast({

            title: res.data.errorDesc,

            icon: 'none',

            duration: 1000//持续的时间

          })
        }
      }
    })
  },
  getXmList(){
    const that=this
    let companyCode = wx.getStorageSync('userinfo').companyCode
    
    wx.request({
      url: api.url,
      data: {
        operationType: 'queryLocal',
        companyCode: companyCode,
        queryType: 'queryDeparts',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success(res) {
       
        console.log(res.data)

        if (res.data.success) {
          const data = res.data.result
          let list = []
          for (let i = 0; i < data.length; i++) {
            let son = {
              name: data[i]
            }
            list.push(son)
          }
          
          that.setData({
            yuEList: list,
            // yuEType: list[0].name
          })
          
        } else {
          wx.showToast({

            title: res.data.errorDesc,

            icon: 'none',

            duration: 1000//持续的时间

          })
        }
      }
    })
   
    
   
  },
  // getYlcList(){
  //   console.log('1')
  //   this.getXmList()
  // }
})