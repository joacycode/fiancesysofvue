import Vue from 'vue'
import $ from 'jquery'
import Cookie from 'js-cookie'
require('assets/less/main.less')

import Dialogpop from '../../components/dialogpop'
import store from '../../assets/js/store/index'
import Pagination from '../../components/pagination'

let _this
/* eslint-disable no-new */
new Vue({
// router: router,
  store,
  el: '#detailPage',
  data: {
    isShowthis: false,
    billid: '',
    payChannel: '',
    billAccount: '',
    billTime: '',
    billDetailList: [],
    unCheckedList: [],
    ischeckDetailTab: true,
    detialRevenue: '',
    detialRefund: '',
    detialFee: '',
    uncheckedRevenue: '',
    uncheckedRefund: '',
    uncheckedFee: '',
    dialogType: 'handlebar', // dailog类型 dialogbar progressbar uploaddbar handlebar
    dialogTitle: '手动确认订单', // 标题
    dialogRank: '', // icon类型 notce success warn
    hasDialogsub: false,  // 是否有sub文字
    dialogHtml: '', // 文字
    dialogHtmlSub: '', // sub文字
    loginName: Cookie.get('loginSure'),
    detailTotal: 0,
    uncheckTotal: 0,
    pageSize: 20,
    hasUncheckTab: false
  },
  computed: {
    exporturi: function () {
      return 'http://financial-checking.heyi.test/statement/exportUncheck?id=' + this.billid
    }
  },
  components: {
    'dialogpop': Dialogpop,
    'pagination': Pagination
  },
  mounted: function () {
    let ref = window.location.search
    let arr = ref.split('&')
    _this = this
    this.billid = arr[0].substring(ref.indexOf('?') + 4)
    this.payChannel = arr[1]
    this.billAccount = arr[2]
    this.billTime = arr[3].substring(0, 4) + '-' + arr[3].substring(4)
    this.detailBillOverview()
    this.detailBillEvent({pageSize: this.pageSize, pageNo: 1})
    this.detialUncheckEvent({pageSize: this.pageSize, pageNo: 1})
    this.detialUncheckOverview()
  },
  methods: {
    tohandeventsure: function (val) {
      this.commonFormReq({ // detial uncheck overview
        apiurl: 'http://financial-checking.heyi.test/statement/uncheckConfirm?id=',
        datas: {reason: val},
        callbackFun (res) {
          if (res.code === 0) {
            window.location.href = window.location.href
          } else {
            _this.dialogType = 'dialogbar'
            _this.dialogRank = 'notice'
            _this.dialogHtml = res.message || '手动确认有误'
          }
        }
      })
    },
    detailBillEvent: function (params) { // detail bill
      this.commonFormReq({
        apiurl: 'http://financial-checking.heyi.test/statement/detailInfo?billId=',
        datas: params || '',
        diffcallback: 'getdetail',
        callbackFun (res) {
          if (res.code === 0) {
            _this.billDetailList = res.data.dataList
            _this.detailTotal = res.data.totalCount
            console.log('对账详情表:' + res.data)
          }
        }
      })
    },
    detailBillOverview: function () { // detail bill overview
      this.commonFormReq({
        apiurl: 'http://financial-checking.heyi.test/statement/detailInfoStatistics?billId=',
        datas: '',
        diffcallback: 'getdetailov',
        callbackFun (res) {
          if (res.code === 0) {
            console.log('对账数据统计', res.data, res.data.refund, res.data.fee)
            _this.detialRevenue = res.data.revenue
            _this.detialRefund = res.data.refund
            _this.detialFee = res.data.fee
          }
        }
      })
    },
    detialUncheckEvent: function (params) { // detial uncheck
      this.commonFormReq({
        apiurl: 'http://financial-checking.heyi.test/statement/uncheckInfo?billId=',
        datas: params || '',
        diffcallback: 'getuncheck',
        callbackFun (res) {
          if (res.code === 0) {
            _this.hasUncheckTab = true // 显示出未核对tab
            _this.unCheckedList = res.data.dataList
            _this.uncheckTotal = res.data.totalCount
            console.log('未核对订单表:' + res.data)
          }
        }
      })
    },
    detialUncheckOverview: function () { // detial uncheck overview
      this.commonFormReq({
        apiurl: 'http://financial-checking.heyi.test/statement/uncheckInfoStatistics?billId=',
        datas: '',
        diffcallback: 'getuncheckov',
        callbackFun (res) {
          if (res.code === 0) {
            console.log('未核对统计', res, res.data.refund, res.data.fee)
            _this.uncheckedRevenue = res.data.revenue
            _this.uncheckedRefund = res.data.refund
            _this.uncheckedFee = res.data.fee
          }
        }
      })
    },
    commonFormReq: function (params) {
      $.ajax({
        url: params.apiurl + this.billid,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: params.diffcallback,
        data: params.datas ? $.param(params.datas) : ''
      })
      .done((res) => {
        params.callbackFun(res)
      })
      .fail((Xhr, txt) => {
        console.log('请求数据失败！', Xhr, txt)
      })
    },
    closeEvent: function () {
      this.isShowthis = false
      // window.location.href = window.location.href
    },
    handComfirmEvent: function () {
      this.isShowthis = true
      this.dialogType = 'handlebar'
    },
    checkDetailTab: function () {
      this.ischeckDetailTab = true
    },
    uncheckedTab: function () {
      this.ischeckDetailTab = false
    },
    getBillNewPage: function (current) {
      this.detailBillEvent({pageSize: this.pageSize, pageNo: current})
    },
    getUncheckNewPage: function (current) {
      this.detialUncheckEvent({pageSize: this.pageSize, pageNo: current})
    },
    logoutReq: function () {
      if (this.canlgout) {
        this.canlgout = false
        $.ajax({
          url: 'http://financial-checking.heyi.test/user/logout',
          type: 'GET',
          dataType: 'jsonp',
          jsonp: 'jsoncallback',
          jsonpCallback: 'getData'
        })
        .done((res) => {
          this.canlgout = true
          Cookie.remove('loginSure')
          window.location.href = window.location.href
        })
        .fail(() => {
          this.canlgout = true
          console.log('请求数据失败！')
        })
      }
    }
  }
})

