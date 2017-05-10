require('assets/less/main.less')

import Vue from 'vue'
import Cookie from 'js-cookie'
import VueResource from 'vue-resource'
import Selector from '../../components/selector'
import Dialogpop from '../../components/dialogpop'
import store from '../../assets/js/store/index'
import Pagination from '../../components/pagination'

Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  store, // vuex store
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
    isTabshow: true, // 对账管理账单管理
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
    combinelists: [],
    allListArray: [],
    isCombineShow: false,
    uploadCombinelList: []
  },
  computed: {
    newResultListBill () { // 统一数据处理新数据
      return this.transformData(this.resultListBill)
    },
    newresultListCheck () {
      return this.transformData(this.resultListCheck)
    },
    isListNull () {
      return !this.combinelists.length
    },
    saveBillCondition () {
      return {byear: '', bmonth: '', eyear: '', emonth: '', billStatus: '', channel: '', accountName: '', comblist: []}
    },
    saveCheckCondition () {
      return {byear: '2017', bmonth: '01', eyear: '2017', emonth: '01', billStatus: '-2', channel: '-2', accountName: '', comblist: this.allListArray[0] || []}
    },
    getFormsUrl () {
      return this.isTabshow ? 'http://financial.manage.youku.com/bill/selectBillInfoByPage' : 'http://financial.manage.youku.com/bill/selectBillStatementByPage'
    }
  },
  methods: {
    searchResultEvent () { // 账单和对账表查询
      if (this.byear <= this.eyear) { // 月份始末对比过滤
        if (this.bmonth <= this.emonth) {
          this.getBilldata({
            billStatus: this.billStatus,
            startTime: Number(this.byear + this.bmonth),
            endTime: Number(this.eyear + this.emonth),
            channel: this.channel,
            accountName: this.accountName,
            pageNo: 1,
            pageSize: this.pageSize
          }, this.getFormsUrl)
        } else {
          this.isShowthis = true
          this.dialogType = 'dialogbar'
          this.dialogRank = 'warn'
          this.dialogHtml = '同年结束月份不能小于开始月份'
        }
      } else {
        this.isShowthis = true
        this.dialogType = 'dialogbar'
        this.dialogRank = 'warn'
        this.dialogHtml = '结束年份不能小于开始年份'
      }
    },
    billTabEvent () { // 账单tab
      if (!this.isTabshow) {
        this.isTabshow = true
        this.saveCheckCondition['byear'] = this.byear
        this.saveCheckCondition['bmonth'] = this.bmonth
        this.saveCheckCondition['eyear'] = this.eyear
        this.saveCheckCondition['emonth'] = this.emonth
        this.saveCheckCondition['billStatus'] = this.billStatus
        this.saveCheckCondition['channel'] = this.channel
        this.saveCheckCondition['accountName'] = this.accountName
        this.saveCheckCondition['comblist'] = this.combinelists
        this.byear = this.saveBillCondition['byear']
        this.bmonth = this.saveBillCondition['bmonth']
        this.eyear = this.saveBillCondition['eyear']
        this.emonth = this.saveBillCondition['emonth']
        this.billStatus = this.saveBillCondition['billStatus']
        this.channel = this.saveBillCondition['channel']
        this.accountName = this.saveBillCondition['accountName']
        this.combinelists = this.saveBillCondition['comblist']
      }
    },
    checkTabEvent () { // 对账tab
      if (this.isTabshow) {
        this.isTabshow = false
        this.saveBillCondition['byear'] = this.byear
        this.saveBillCondition['bmonth'] = this.bmonth
        this.saveBillCondition['eyear'] = this.eyear
        this.saveBillCondition['emonth'] = this.emonth
        this.saveBillCondition['billStatus'] = this.billStatus
        this.saveBillCondition['channel'] = this.channel
        this.saveBillCondition['accountName'] = this.accountName
        this.saveBillCondition['comblist'] = this.combinelists
        this.byear = this.saveCheckCondition['byear']
        this.bmonth = this.saveCheckCondition['bmonth']
        this.eyear = this.saveCheckCondition['eyear']
        this.emonth = this.saveCheckCondition['emonth']
        this.billStatus = this.saveCheckCondition['billStatus']
        this.channel = this.saveCheckCondition['channel']
        this.accountName = this.saveCheckCondition['accountName']
        this.combinelists = this.saveCheckCondition['comblist']
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
      }, this.getFormsUrl)
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
          if (n === 1) {
            this.combinelists = this.allListArray[1]
          } else if (n === 2) {
            this.combinelists = this.allListArray[2]
          } else if (n === 3) {
            this.combinelists = this.allListArray[3]
          } else {
            this.combinelists = this.allListArray[0]
          }
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
      this.uploadCombinelList = this.allListArray
    },
    closeEvent () { // dialog关闭事件
      this.isShowthis = false
      this.uploadCombinelList = []
      // window.location.href = window.location.href
    },
    toUploadEvent (paramsObj) { // 上传确认
      this.$http.jsonp('http://financial.manage.youku.com/bill/addBill', {jsonp: 'jsoncallback', params: paramsObj}).then((response) => {
        // console.log(response.body.data)
        this.dialogType = 'dialogbar'
        if (response.body.code !== 0) {
          this.dialogType = 'dialogbar'
          this.dialogRank = 'notice'
          this.dialogHtml = response.body.message
        } else {
          // this.dialogType = 'progressbar'
          this.dialogType = 'dialogbar'
          this.dialogRank = 'success'
          this.dialogHtml = '账单上传中，请确认后刷新页面'
        }
      }, (errResponse) => {
        console.log(errResponse)
      })
    },
    startCheckBtn (id) { // 开始对账
      this.checkBtnRequst({apiurl: 'http://financial.manage.youku.com/bill/startCheck?id=', apiid: id})
    },
    confirmCheckBtn (id) { // 确认对账
      this.checkBtnRequst({apiurl: 'http://financial.manage.youku.com/statement/confirm?id=', apiid: id})
    },
    getBilldata (paramsObj, _url) { // 获取账单和对账表方法
      this.$http.jsonp(_url, {jsonp: 'jsoncallback', params: paramsObj}).then((response) => {
        if (response.body.code === 0) {
          if (this.isTabshow) {
            this.billHasdata = true
            this.billSearchNull = false
            this.resultListBill = response.body.data.dataList
            this.billTotal = response.body.data.totalCount
          } else {
            this.checkHasdata = true
            this.checkSearchNull = false
            this.resultListCheck = response.body.data.dataList
            this.checkTotal = response.body.data.totalCount
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
      }, (errResponse) => {
        console.log(errResponse)
      })
    },
    transformData (datalist) { // 增加转换新数据
      for (let item of datalist) {
        item['unixTime'] = this.unixTimeto(item.gmtCreate)
        switch (item.channel) {
          case 1:
            item['fileName'] = '支付宝_' + item.accountName + '_' + item.billTime
            item['channelName'] = '支付宝'
            break
          case 2:
            item['fileName'] = '微信_' + item.accountName + '_' + item.billTime
            item['channelName'] = '微信'
            break
          case 3:
            item['fileName'] = '财付通_' + item.accountName + '_' + item.billTime
            item['channelName'] = '财付通'
            break
          default:
            item['fileName'] = item.channel + '_' + item.accountName + '_' + item.billTime
            item['channelName'] = '未知'
            break
        }
      }
      return datalist
    },
    checkBtnRequst (paramsObj) { // 对账api
      this.$http.jsonp(paramsObj.apiurl + paramsObj.apiid, {jsonp: 'jsoncallback'}).then((response) => {
        if (response.body.code === 0) {
          this.isShowthis = true
          this.dialogType = 'dialogbar'
          this.dialogRank = 'success'
          this.dialogHtml = '操作成功'
        } else {
          this.isShowthis = true
          this.dialogType = 'dialogbar'
          this.dialogRank = 'notice'
          this.dialogHtml = response.body.message
        }
      }, (errResponse) => {
        console.log(errResponse)
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
      this.combinelists = this.allListArray[0]
    },
    logoutReq () { // 登出
      if (this.canlgout) {
        this.canlgout = false
        this.$http.jsonp('http://financial.manage.youku.com/user/logout', {jsonp: 'jsoncallback'}).then((response) => {
          // console.log(response.body.data)
          this.canlgout = true
          if (response.body.code === 0) {
            Cookie.remove('loginSure')
            window.location.href = window.location.href
          }
        }, (errResponse) => {
          this.canlgout = true
          console.log(errResponse)
        })
      }
    }

  }
})
