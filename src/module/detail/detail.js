import Vue from 'vue'
import $ from 'jquery'
import Cookie from 'js-cookie'
require('assets/less/main.less')

import Dialogpop from '../../components/dialogpop'

let _this
/* eslint-disable no-new */
new Vue({
// router: router,
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
    loginName: Cookie.get('loginSure')
  },
  computed: {
    exporturi: function () {
      return 'http://financial-checking.heyi.test/statement/exportUncheck?id=' + this.billid
    }
  },
  components: {
    'dialogpop': Dialogpop
  },
  mounted: function () {
    let ref = window.location.search
    let arr = ref.split('&')
    _this = this
    this.billid = arr[0].substring(ref.indexOf('?') + 4)
    this.payChannel = arr[1]
    this.billAccount = arr[2]
    this.billTime = arr[3].substring(0, 4) + '-' + arr[3].substring(4)
    this.commonFormReq({ // detail bill
      apiurl: 'http://financial-checking.heyi.test/statement/detailInfo?billId=',
      datas: '',
      callbackFun (res) {
        if (res.code === 0) {
          _this.billDetailList = res.data.dataList
          console.log('对账详情:' + res.data)
        }
      }
    })
    this.commonFormReq({ // detial uncheck
      apiurl: 'http://financial-checking.heyi.test/statement/uncheckInfo?billId=',
      datas: '',
      callbackFun (res) {
        if (res.code === 0) {
          _this.unCheckedList = res.data.dataList
          console.log(res.code, res.data.dataList)
          console.log('未核对订单:' + res.data)
        }
      }
    })
    // this.commonFormReq({ // detail bill overview
    //   apiurl: 'http://financial-checking.heyi.test/statement/detailInfoStatistics?id=',
    //   datas: '',
    //   callbackFun (res) {
    //     console.log(res.code)
    //     if (res.code === 0) {
    //       console.log('对账数据', res.data, res.data.refund, res.data.fee)
    //       _this.detialRevenue = res.data.revenue
    //       _this.detialRefund = res.data.refund
    //       _this.detialFee = res.data.fee
    //     }
    //   }
    // })
    this.commonFormReq({ // detial uncheck overview
      apiurl: 'http://financial-checking.heyi.test/statement/uncheckInfoStatistics?billId=',
      datas: '',
      callbackFun (res) {
        console.log(res.code)
        if (res.code === 0) {
          console.log('未核对数据', res, res.data.refund, res.data.fee)
          _this.uncheckedRevenue = res.data.revenue
          _this.uncheckedRefund = res.data.refund
          _this.uncheckedFee = res.data.fee
        }
      }
    })
  },
  methods: {
    tohandeventsure: function () {
      this.commonFormReq({ // detial uncheck overview
        apiurl: 'http://financial-checking.heyi.test/statement/uncheckConfirm?id=',
        datas: '',
        callbackFun (res) {
          if (res.code === 0) {
            window.location.href = window.location.href
          } else {
            this.dialogType = 'dialogbar'
            this.dialogRank = 'notice'
            this.dialogHtml = res.message || '手动确认有误'
          }
        }
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
    commonFormReq: function (params) {
      $.ajax({
        url: params.apiurl + this.billid,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'getData',
        data: params.datas ? decodeURIComponent($.param(params.datas)) : ''
      })
      .done((res) => {
        params.callbackFun(res)
      })
      .fail((Xhr, txt) => {
        console.log('请求数据失败！', txt)
      })
    },
    checkDetailTab: function () {
      this.ischeckDetailTab = true
    },
    uncheckedTab: function () {
      this.ischeckDetailTab = false
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

