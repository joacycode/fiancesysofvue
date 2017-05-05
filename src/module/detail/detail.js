require('assets/less/main.less')

import Vue from 'vue'
import Cookie from 'js-cookie'
import VueResource from 'vue-resource'
import Dialogpop from '../../components/dialogpop'
import Selector from '../../components/selector'
import store from '../../assets/js/store/index'
import Pagination from '../../components/pagination'

Vue.use(VueResource)
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
    hasUncheckTab: false,
    verifyVal: '',
    curUncheckPage: 1,
    curBillPage: 1
  },
  computed: {
    exporturi () {
      return 'http://financial-checking.heyi.test/statement/exportUncheck?id=' + this.billid
    }
  },
  components: {
    'dialogpop': Dialogpop,
    'pagination': Pagination,
    'selector': Selector
  },
  mounted () {
    let ref = window.location.search
    let arr = ref.split('&')
    _this = this
    this.billid = arr[0].substring(ref.indexOf('?') + 4)
    this.payChannel = arr[1]
    this.billAccount = arr[2]
    this.billTime = arr[3].substring(0, 4) + '-' + arr[3].substring(4)
    this.detailBillOverview()
    this.detialUncheckOverview()
    this.detailBillEvent({pageSize: this.pageSize, pageNo: 1})
    this.detialUncheckEvent({pageSize: this.pageSize, pageNo: 1})
  },
  methods: {
    tohandeventsure (val) {
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
    detailBillEvent (datas) { // detail bill
      this.commonFormReq({
        apiurl: 'http://financial-checking.heyi.test/statement/detailInfo?billId=',
        _params: {jsonp: 'jsoncallback', params: datas},
        callbackFun (res) {
          if (res.code === 0) {
            _this.billDetailList = res.data.dataList
            _this.detailTotal = res.data.totalCount
            console.log('对账详情表:' + res.data)
          }
        }
      })
    },
    detailBillOverview () { // detail bill overview
      this.commonFormReq({
        apiurl: 'http://financial-checking.heyi.test/statement/detailInfoStatistics?billId=',
        _params: {jsonp: 'jsoncallback'},
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
    detialUncheckEvent (datas) { // detial uncheck
      this.commonFormReq({
        apiurl: 'http://financial-checking.heyi.test/statement/uncheckInfo?billId=',
        _params: {jsonp: 'jsoncallback', params: datas},
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
    detialUncheckOverview () { // detial uncheck overview
      this.commonFormReq({
        apiurl: 'http://financial-checking.heyi.test/statement/uncheckInfoStatistics?billId=',
        _params: {jsonp: 'jsoncallback'},
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
    commonFormReq (paramsObj) {
      this.$http.jsonp(paramsObj.apiurl + this.billid, paramsObj._params).then((response) => {
        // console.log(response.body.data)
        paramsObj.callbackFun(response.body)
      }, (errResponse) => {
        console.log(errResponse)
      })
    },
    closeEvent () {
      this.isShowthis = false
      // window.location.href = window.location.href
    },
    handComfirmEvent () {
      this.isShowthis = true
      this.dialogType = 'handlebar'
    },
    checkDetailTab () {
      this.ischeckDetailTab = true
    },
    uncheckedTab () {
      this.ischeckDetailTab = false
    },
    getBillNewPage (current) {
      this.curBillPage = current
      this.detailBillOverview()
      this.detailBillEvent({pageSize: this.pageSize, pageNo: current})
    },
    getUncheckNewPage (current) {
      this.curUncheckPage = current
      this.detialUncheckOverview()
      this.detialUncheckEvent({pageSize: this.pageSize, pageNo: current})
    },
    handledata (m, n) {
      if (m === 'verify' && n !== '') {
        this.verifyVal = n
        if (this.ischeckDetailTab) {
          this.detailBillOverview()
          this.detailBillEvent({pageSize: this.pageSize, pageNo: this.curBillPage, verifyResult: this.verifyVal})
        } else {
          this.detialUncheckOverview()
          this.detialUncheckEvent({pageSize: this.pageSize, pageNo: this.curUncheckPage, verifyResult: this.verifyVal})
        }
      }
    },
    logoutReq () {
      if (this.canlgout) {
        this.canlgout = false
        this.$http.jsonp('http://financial-checking.heyi.test/user/logout', {jsonp: 'jsoncallback'}).then((response) => {
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

