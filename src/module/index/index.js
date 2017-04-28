import Vue from 'vue'
import $ from 'jquery'
import Cookie from 'js-cookie'
require('assets/less/main.less')

import Selector from '../../components/selector'
import Dialogpop from '../../components/dialogpop'
import store from '../../assets/js/store/index'
import Pagination from '../../components/pagination'
/* eslint-disable no-new */
new Vue({
  store,
  components: {
    'selector': Selector,
    'dialogpop': Dialogpop,
    'pagination': Pagination
  },
  el: '#indexPage',
  data: {
    total: 0,
    payAccount: '',
    resultListBill: [],
    resultListCheck: [],
    resultShow: '',
    billRequestdata: false,
    checkRequestdata: false,
    isTabshow: true,
    statushow: true,
    byear: '2017',
    bmonth: '01',
    eyear: '2017',
    emonth: '01',
    billStatus: '-2',
    channel: '-2',
    accountName: '',
    isShowthis: false,
    dialogType: '', // dailog类型 dialogbar progressbar uploaddbar handlebar
    dialogTitle: '', // 标题
    dialogRank: '', // icon类型 notce success warn
    hasDialogsub: false,  // 是否有sub文字
    dialogHtml: '', // 文字
    dialogHtmlSub: '', // sub文字
    canlgout: true,
    loginName: Cookie.get('loginSure'),
    billTotal: 0,
    checkTotal: 0,
    pageSize: 10
  },
  methods: {
    getBilldata: function (params) {
      $.ajax({
        url: 'http://financial-checking.heyi.test/bill/selectBillInfoByPage',
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'getData',
        data: decodeURIComponent($.param(params))
      })
      .done((res) => {
        if (res.code === 0) {
          if (this.isTabshow) {
            this.resultShow = 'bill'
            this.billRequestdata = true
            this.resultListBill = res.data.dataList
            this.billTotal = res.data.totalCount
          } else {
            this.resultShow = 'check'
            this.checkRequestdata = true
            this.resultListCheck = res.data.dataList
            this.checkTotal = res.data.totalCount
          }
        } else {
          this.resultShow = 'nores'
        }
      })
      .fail(() => {
        console.log('请求数据失败！')
      })
    },
    billTabEvent: function () {
      $(document)
      .find('.selectPicker .defaultVal')
      .removeClass('hashow')
      .siblings('ul')
      .slideUp('fast')
      this.isTabshow = true
      this.resultShow = 'bill'
    },
    checkTabEvent: function () {
      $(document)
      .find('.selectPicker .defaultVal')
      .removeClass('hashow')
      .siblings('ul')
      .slideUp('fast')
      this.isTabshow = false
      this.resultShow = 'check'
    },
    handledata: function (m, n) { // 触发组件传来的事件处理[自定义事件]
      switch (m) {
        case 'byear':
          this.byear = n
          break
        case 'bmonth':
          this.bmonth = n
          break
        case 'eyear':
          this.eyear = n
          break
        case 'emonth':
          this.emonth = n
          break
        case 'billStatus':
          this.billStatus = n
          break
        case 'channel':
          this.channel = n
          break
        case 'accountName':
          this.accountName = n
          break
        default: return
      }
    },
    searchResultEvent: function () {
      this.getBilldata({
        billStatus: this.billStatus,
        startTime: Number(this.byear + this.bmonth),
        endTime: Number(this.eyear + this.emonth),
        channel: this.channel,
        accountName: this.accountName,
        pageNo: 1,
        pageSize: this.pageSize
      })
    },
    combineEvent: function () {
      // console.log('111123213123123123')
    },
    uploadsth: function () {
      this.isShowthis = true
      this.dialogType = 'uploaddbar'
      this.dialogTitle = '上传账单'
    },
    closeEvent: function () {
      this.isShowthis = false
      // window.location.href = window.location.href
    },
    toUploadEvent: function (params) {
      $.ajax({
        url: 'http://financial-checking.heyi.test/bill/addBill',
        async: false,
        type: 'get',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonCallback: 'getData',
        data: decodeURIComponent($.param(params))
      })
      .done((res) => {
        this.dialogType = 'dialogbar'
        if (res.code && res.code < 0) {
          this.dialogType = 'dialogbar'
          this.dialogRank = 'notice'
          this.dialogHtml = res.message
        } else if (res.code && res.code === 0) {
          // this.dialogType = 'progressbar'
          this.dialogType = 'dialogbar'
          this.dialogRank = 'success'
          this.dialogHtml = '上传成功'
        }
      })
      .fail((XHR, textStatus, errorThrown) => {
        console.log(textStatus)
      })
    },
    startCheckBtn: function (id) {
      this.checkBtnRequst({apiurl: 'http://financial-checking.heyi.test/bill/startCheck?id=', apiid: id})
    },
    confirmCheckBtn: function (id) {
      this.checkBtnRequst({apiurl: 'http://financial-checking.heyi.test/statement/confirm?id=', apiid: id})
    },
    checkBtnRequst: function (params) {
      $.ajax({
        url: params.apiurl + params.apiid,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'getData'
      })
      .done((res) => {
        if (res.code === 0) {
          this.isShowthis = true
          this.dialogType = 'dialogbar'
          this.dialogRank = 'success'
          this.dialogHtml = res.message || '操作成功'
        } else {
          this.isShowthis = true
          this.dialogType = 'dialogbar'
          this.dialogRank = 'notice'
          this.dialogHtml = res.message
        }
      })
      .fail(() => {
        console.log('请求数据失败！')
      })
    },
    getNewPageEvent: function (current) {
      this.getBilldata({
        billStatus: this.billStatus,
        startTime: Number(this.byear + this.bmonth),
        endTime: Number(this.eyear + this.emonth),
        channel: this.channel,
        accountName: this.accountName,
        pageNo: current,
        pageSize: this.pageSize
      })
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
