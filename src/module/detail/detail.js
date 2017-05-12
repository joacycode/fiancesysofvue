require('assets/less/main.less')

import Vue from 'vue'
import Cookie from 'js-cookie'
import VueResource from 'vue-resource'
import Loadiner from '../../components/loadiner'
import Selector from '../../components/selector'
import Pagination from '../../components/pagination'
import Dialogpop from '../../components/dialogpop'
import Headwrap from '../../components/headwrap'
import store from '../../assets/js/store/index'

Vue.use(VueResource)
let vm
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
    verifyRes: -2,
    isloading: false,
    canShowLoading: false, // 未核对订单加载进来第一次请求不出现loading，分页时候改变为ture才显示loading等待
    itemId: '',
    itemType: '',
    uncheckCurrent: 1,
    billCurrent: 1,
    UCOV_FIRSTIN: true
  },
  computed: {
    exporturi () {
      return 'http://financial.manage.youku.com/statement/exportUncheck?id=' + this.billid
    }
  },
  components: {
    'useDialog': Dialogpop,
    'usePagination': Pagination,
    'useSelector': Selector,
    'useLoad': Loadiner,
    'useHead': Headwrap
  },
  mounted () {
    let ref = window.location.search
    let arr = ref.split('&')
    vm = this
    this.billid = arr[0].substring(ref.indexOf('?') + 4)
    this.payChannel = arr[1]
    this.billAccount = arr[2]
    this.billTime = arr[3].substring(0, 4) + '-' + arr[3].substring(4)
    this.detailBillOverview()
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
        if (response.body.code === 0) { // 手动确认成功
          vm.dialogType = 'dialogbar'
          vm.dialogRank = 'success'
          vm.dialogHtml = response.body.message || '手动确认成功'
          if (vm.ischeckDetailTab) {
            vm.detailBillEvent({pageSize: vm.pageSize, pageNo: vm.billCurrent, verifyResult: vm.verifyRes}) // 局部刷新数据
          } else {
            vm.detialUncheckEvent({pageSize: vm.pageSize, pageNo: vm.uncheckCurrent})
          }
        } else if (response.body.code === -2007) { // 登录超时
          window.location.href = window.location.href
        } else { // 手动确认失败
          vm.dialogType = 'dialogbar'
          vm.dialogRank = 'notice'
          vm.dialogHtml = response.body.message || '手动确认有误'
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
            vm.billDetailList = res.data.dataList
            vm.detailTotal = res.data.totalCount
          } else if (res.code === -2007) { // 登录超时
            window.location.href = window.location.href
          } else if (res.code === -6) { // 无法获取数据为空
            vm.billDetailList = []
            vm.detailTotal = 0
          } else { // 无法获取信息提示
            vm.isloading = false // 提示信息之前消除loading
            vm.isShowthis = true
            vm.dialogType = 'dialogbar'
            vm.dialogRank = 'notice'
            vm.dialogHtml = res.message || '查询有误'
          }
          vm.isloading = false
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
            vm.detialRevenue = res.data.revenue
            vm.detialRefund = res.data.refund
            vm.detialFee = res.data.fee
          }
        }
      })
    },
    detialUncheckEvent (datas) { // detial uncheck
      if (this.canShowLoading) { this.isloading = true }
      this.commonFormReq({
        apiurl: 'http://financial.manage.youku.com/statement/uncheckInfo?billId=' + this.billid,
        _params: {jsonp: 'jsoncallback', params: datas},
        callbackFun (res) {
          if (res.code === 0) {
            vm.hasUncheckTab = true // 显示出未核对tab
            vm.unCheckedList = res.data.dataList
            vm.uncheckTotal = res.data.totalCount
          } else if (res.code === -2007) { // 登录超时
            window.location.href = window.location.href
          } else if (res.code === -6) { // 无法获取数据为空
            vm.unCheckedList = []
            vm.uncheckTotal = 0
          } else { // 无法获取信息提示
            if (this.canShowLoading) {
              this.isloading = false
              vm.isShowthis = true
              vm.dialogType = 'dialogbar'
              vm.dialogRank = 'notice'
              vm.dialogHtml = res.message || '查询有误'
            }
          }
          if (this.canShowLoading) { this.isloading = false }
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
            vm.uncheckedRevenue = res.data.revenue
            vm.uncheckedRefund = res.data.refund
            vm.uncheckedFee = res.data.fee
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
      if (this.UCOV_FIRSTIN) {
        this.UCOV_FIRSTIN = false
        this.detialUncheckOverview()
      }
    },
    getBillNewPage (current) { // 分页获取详情数据
      this.billCurrent = current
      this.detailBillEvent({pageSize: this.pageSize, pageNo: current, verifyResult: this.verifyRes})
    },
    getUncheckNewPage (current) { // 分页获取未核对数据
      this.canShowLoading = true
      this.uncheckCurrent = current
      this.detialUncheckEvent({pageSize: this.pageSize, pageNo: current})
    },
    handledata (m, n) { // 核对条件筛选 一致|不一致|全部
      if (m === 'verify' && n !== '') {
        this.verifyRes = n
        if (this.ischeckDetailTab) {
          this.detailBillEvent({pageSize: this.pageSize, pageNo: 1, verifyResult: this.verifyRes})
        } else {
          this.detialUncheckEvent({pageSize: this.pageSize, pageNo: 1, verifyResult: this.verifyRes})
        }
      }
    }

  }
})

