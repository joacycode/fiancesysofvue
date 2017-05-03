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
    billHasdata: false,
    checkHasdata: false,
    billSearchNull: false,
    checkSearchNull: false,
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
    pageSize: 10,
    combinelist: [],
    allListArray: [],
    isCombineShow: false
  },
  computed: {
    newResultListBill () {
      return this.transformData(this.resultListBill)
    },
    newresultListCheck () {
      return this.transformData(this.resultListCheck)
    },
    isListNull () {
      return !this.combinelist.length
    },
    saveBillCondition () {
      return {byear: '', bmonth: '', eyear: '', emonth: '', billStatus: '', channel: '', accountName: '', combinelist: ''}
    },
    saveCheckCondition () {
      return {byear: '2017', bmonth: '01', eyear: '2017', emonth: '01', billStatus: '-2', channel: '-2', accountName: '', combinelist: this.allListArray[0]}
    }
  },
  methods: {
    searchResultEvent () { // 账单和对账表查询
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
    billTabEvent () { // 账单tab
      if (!this.isTabshow) {
        $(document)
        .find('.selectPicker .defaultVal')
        .removeClass('hashow')
        .siblings('ul')
        .slideUp('fast')
        this.isTabshow = true
        this.saveCheckCondition['byear'] = this.byear
        this.saveCheckCondition['bmonth'] = this.bmonth
        this.saveCheckCondition['eyear'] = this.eyear
        this.saveCheckCondition['emonth'] = this.emonth
        this.saveCheckCondition['billStatus'] = this.billStatus
        this.saveCheckCondition['channel'] = this.channel
        this.saveCheckCondition['accountName'] = this.accountName
        this.saveCheckCondition['combinelist'] = this.combinelist
        this.byear = this.saveBillCondition['byear']
        this.bmonth = this.saveBillCondition['bmonth']
        this.eyear = this.saveBillCondition['eyear']
        this.emonth = this.saveBillCondition['emonth']
        this.billStatus = this.saveBillCondition['billStatus']
        this.channel = this.saveBillCondition['channel']
        this.accountName = this.saveBillCondition['accountName']
        this.combinelist = this.saveBillCondition['combinelist']
      }
    },
    checkTabEvent () { // 对账tab
      if (this.isTabshow) {
        $(document)
        .find('.selectPicker .defaultVal')
        .removeClass('hashow')
        .siblings('ul')
        .slideUp('fast')
        this.isTabshow = false
        this.saveBillCondition['byear'] = this.byear
        this.saveBillCondition['bmonth'] = this.bmonth
        this.saveBillCondition['eyear'] = this.eyear
        this.saveBillCondition['emonth'] = this.emonth
        this.saveBillCondition['billStatus'] = this.billStatus
        this.saveBillCondition['channel'] = this.channel
        this.saveBillCondition['accountName'] = this.accountName
        this.saveBillCondition['combinelist'] = this.combinelist
        this.byear = this.saveCheckCondition['byear']
        this.bmonth = this.saveCheckCondition['bmonth']
        this.eyear = this.saveCheckCondition['eyear']
        this.emonth = this.saveCheckCondition['emonth']
        this.billStatus = this.saveCheckCondition['billStatus']
        this.channel = this.saveCheckCondition['channel']
        this.accountName = this.saveCheckCondition['accountName']
        this.combinelist = this.saveCheckCondition['combinelist']
      }
    },
    getNewPageEvent (current) { // 分页页面请求
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
    handledata (m, n) { // 根据被触发的组件含义对应处理[自定义事件]
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
          this.accountName = ''
          if (n === '1') {
            this.combinelist = this.allListArray[1]
          } else if (n === '2') {
            this.combinelist = this.allListArray[2]
          } else if (n === '3') {
            this.combinelist = this.allListArray[3]
          } else {
            this.combinelist = this.allListArray[0]
          }
          break
        case 'accountName':
          this.accountName = n
          break
        default: return
      }
    },
    combineFocus () {
      this.isCombineShow = true
    },
    combineBlur () {
      this.isCombineShow = false
    },
    uploadsth () {
      this.isShowthis = true
      this.dialogType = 'uploaddbar'
      this.dialogTitle = '上传账单'
    },
    closeEvent () { // dialog关闭事件
      this.isShowthis = false
      // window.location.href = window.location.href
    },
    toUploadEvent (params) { // 上传确认
      $.ajax({
        url: 'http://financial-checking.heyi.test/bill/addBill',
        type: 'get',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonCallback: 'getData',
        data: $.param(params)
      })
      .done((res) => {
        this.dialogType = 'dialogbar'
        if (res.code !== 0) {
          this.dialogType = 'dialogbar'
          this.dialogRank = 'notice'
          this.dialogHtml = res.message
        } else {
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
    startCheckBtn (id) { // 开始对账
      this.checkBtnRequst({apiurl: 'http://financial-checking.heyi.test/bill/startCheck?id=', apiid: id})
    },
    confirmCheckBtn (id) { // 确认对账
      this.checkBtnRequst({apiurl: 'http://financial-checking.heyi.test/statement/confirm?id=', apiid: id})
    },
    getBilldata (params) { // 获取账单和对账表方法
      $.ajax({
        url: 'http://financial-checking.heyi.test/bill/selectBillInfoByPage',
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'getData',
        data: $.param(params)
      })
      .done((res) => {
        if (res.code === 0) {
          if (this.isTabshow) {
            this.billHasdata = true
            this.billSearchNull = false
            this.resultListBill = res.data.dataList
            this.billTotal = res.data.totalCount
          } else {
            this.checkHasdata = true
            this.checkSearchNull = false
            this.resultListCheck = res.data.dataList
            this.checkTotal = res.data.totalCount
          }
        } else {
          if (this.isTabshow) {
            this.billHasdata = false
            this.billSearchNull = true
          } else {
            this.checkHasdata = false
            this.checkSearchNull = true
          }
        }
      })
      .fail(() => {
        console.log('请求数据失败！')
      })
    },
    transformData (datalist) { // 数据转换方法
      for (let item of datalist) {
        item['unixtime'] = this.unixTimeto(item.gmtCreate)
      }
      return datalist
    },
    checkBtnRequst (params) { // 对账api
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
    unixTimeto (t) { // unix时间转换YYYY-MM-DD HH:MM:SS
      let date = new Date(t)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    combineItemEvent (e) { // 联想数据选择事件
      this.accountName = e.target.innerHTML
    },
    receiveListEvent (arraylist) { // 接受联想数据
      this.allListArray = arraylist
      this.combinelist = this.allListArray[0]
    },
    logoutReq () { // 登出
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
