require('assets/less/main.less')

import Vue from 'vue'
import Cookie from 'js-cookie'
import VueResource from 'vue-resource'
import Loadiner from '../../components/loadiner'
import Selector from '../../components/selector'
import Pagination from '../../components/pagination'
import Dialogpop from '../../components/dialogpop'
import store from '../../assets/js/store/index'

Vue.use(VueResource)
let _this
/* eslint-disable no-new */
new Vue({
// router: router,
  store,
  el: '#detailPage',
  data: {
    isShowthis: false, // 弹框显示
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
    curBillPage: 1,
    isloading: false,
    itemId: '',
    itemType: ''
  },
  computed: {
    exporturi () {
      return 'http://financial.manage.youku.com/statement/exportUncheck?id=' + this.billid
    }
  },
  components: {
    'dialogpop': Dialogpop,
    'pagination': Pagination,
    'selector': Selector,
    'loadiner': Loadiner
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
    tohandeventsure (thisrea) {
      let apiurl, paramsObj
      if (this.ischeckDetailTab) {
        apiurl = 'http://financial.manage.youku.com/statement/uncheckConfirm'
        paramsObj = {id: this.itemId, reason: encodeURI(encodeURI(thisrea))}
      } else {
        apiurl = 'http://financial.manage.youku.com/statement/uncheckConfirmCharge'
        paramsObj = {id: this.itemId, reason: encodeURI(encodeURI(thisrea)), type: this.itemType}
      }
      this.$http.jsonp(apiurl, {jsonp: 'jsoncallback', params: paramsObj}).then((response) => {
        if (response.body.code === 0) {
          window.location.href = window.location.href
        } else if (response.body.code === -2007) {
          window.location.href = window.location.href
        } else {
          _this.dialogType = 'dialogbar'
          _this.dialogRank = 'notice'
          _this.dialogHtml = response.body.message || '手动确认有误'
        }
      }, (errResponse) => {
        this.isloading = false
        console.log(errResponse)
      })
    },
    detailBillEvent (datas) { // detail bill
      this.isloading = true
      this.commonFormReq({
        apiurl: 'http://financial.manage.youku.com/statement/detailInfo?billId=' + this.billid,
        _params: {jsonp: 'jsoncallback', params: datas},
        callbackFun (res) {
          if (res.code === 0) { // 获取成功
            _this.billDetailList = res.data.dataList
            _this.detailTotal = res.data.totalCount
            console.log('对账详情表:' + res.data)
          } else if (res.code === -2007) { // 登录超时
            window.location.href = window.location.href
          } else if (res.code === -6) { // 无法获取数据为空
            _this.billDetailList = []
            _this.detailTotal = 0
          } else { // 无法获取信息提示
            _this.isShowthis = true
            _this.dialogType = 'dialogbar'
            _this.dialogRank = 'notice'
            _this.dialogHtml = res.message || '查询有误'
          }
          _this.isloading = false
        }
      })
    },
    detailBillOverview () { // detail bill overview
      this.commonFormReq({
        apiurl: 'http://financial.manage.youku.com/statement/detailInfoStatistics?billId=' + this.billid,
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
        apiurl: 'http://financial.manage.youku.com/statement/uncheckInfo?billId=' + this.billid,
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
        apiurl: 'http://financial.manage.youku.com/statement/uncheckInfoStatistics?billId=' + this.billid,
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
      this.$http.jsonp(paramsObj.apiurl, paramsObj._params).then((response) => {
        // console.log(response.body.data)
        paramsObj.callbackFun(response.body)
      }, (errResponse) => {
        this.isloading = false
        console.log(errResponse)
      })
    },
    closeEvent () {
      this.isShowthis = false
      // window.location.href = window.location.href
    },
    handComfirmEvent (item) {
      this.isShowthis = true
      this.dialogType = 'handlebar'
      this.itemId = item.id
      this.itemType = item.type
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

