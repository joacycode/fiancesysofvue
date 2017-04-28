import Vue from 'vue'
import $ from 'jquery'
import Cookie from 'js-cookie'
require('assets/less/main.less')

import Dialogpop from '../../components/dialogpop'

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
    this.billid = arr[0].substring(ref.indexOf('?') + 4)
    this.payChannel = arr[1]
    this.billAccount = arr[2]
    this.billTime = arr[3].substring(0, 4) + '-' + arr[3].substring(4)
    this.billDetailReq()
    this.unCheckedReq()
    this.billDetailOverView()
    this.unCheckedOverView()
  },
  methods: {
    billDetailReq: function () {
      this.commonFormReq('http://financial-checking.heyi.test/statement/detailInfo?billId=', 'billDetail')
    },
    unCheckedReq: function () {
      this.commonFormReq('http://financial-checking.heyi.test/statement/uncheckInfo?billId=', 'unChecked')
    },
    billDetailOverView: function () {
      this.commonFormReq('http://financial-checking.heyi.test/statement/detailInfoStatistics?billId=', 'bdOverview')
    },
    unCheckedOverView: function () {
      this.commonFormReq('http://financial-checking.heyi.test/statement/uncheckInfoStatistics?billId=', 'ucOverview')
    },
    tohandeventsure: function () {
      this.commonFormReq('http://financial-checking.heyi.test/statement/uncheckConfirm?id=', 'handConfirm')
    },
    closeEvent: function () {
      this.isShowthis = false
      // window.location.href = window.location.href
    },
    handComfirmEvent: function () {
      this.isShowthis = true
      this.dialogType = 'handlebar'
    },
    commonFormReq: function (apiurl, ref, params) {
      $.ajax({
        url: apiurl + this.billid,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'getData',
        data: params ? decodeURIComponent($.param(params)) : ''
      })
      .done((res) => {
        if (res.code === 0) {
          switch (ref) {
            case 'billDetail':
              this.billDetailList = res.data.dataList
              console.log('billDetail')
              break
            case 'unChecked':
              this.unCheckedList = res.data.dataList
              console.log('unChecked')
              break
            case 'bdOverview':
              console.log('bdOverview')
              break
            case 'ucOverview':
              console.log('ucOverview')
              break
            case 'handConfirm':
              window.location.href = window.location.href
              break
            default: return
          }
        } else {
          if (ref === 'handConfirm') {
            this.dialogType = 'dialogbar'
            this.dialogRank = 'notice'
            this.dialogHtml = res.message || '手动确认有误'
          }
        }
      })
      .fail(() => {
        console.log('请求数据失败！')
      })
    },
    checkDetailTab: function () {
      this.ischeckDetailTab = true
      console.log('ccccc')
    },
    uncheckedTab: function () {
      this.ischeckDetailTab = false
      console.log('uuuu')
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

