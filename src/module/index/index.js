import Vue from 'vue'
import $ from 'jquery'
require('assets/less/main.less')
// import VueRouter from 'vue-router'
// import Add from './add'
// import List from './list'

// import 'assets/a.css'

import Selector from '../../components/selector'
// Vue.use(VueRouter)

// // 创建一个路由器实例
// // 并且配置路由规则
// const router = new VueRouter({
//   mode: 'history',
//   // base: baseUrl,
//   routes: [
//     {
//       path: '/add',
//       component: Add
//     },
//     {
//       path: '/list',
//       component: List
//     }
//   ]
// })
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #index 匹配的元素上。
/* eslint-disable no-new */
new Vue({
  // router: router,
  el: '#indexPage',
  data: {
    total: 0,
    payAccount: '',
    billOflist: [],
    checkOflist: [],
    resOfshow: '',
    billtabshow: true,
    checktabshow: false,
    statushow: true,
    byear: '2017',
    bmonth: '01',
    eyear: '2017',
    emonth: '01',
    billStatus: '-2',
    channel: '-2',
    accountName: '',
    apiUrl: 'http://financial-checking.heyi.test/bill/selectBillInfoByPage'
  },
  components: {
    'selector': Selector
  },
  methods: {
    getBilldata: function (params) {
      $.ajax({
        url: this.apiUrl,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'getData',
        data: decodeURIComponent($.param(params))
      })
      .done((res) => {
        if (res.success && res.data.totalCount !== 0) {
          this.billOflist = res.data.dataList
          this.resOfshow = 'y'
          // console.log(res.data.dataList)
        } else {
          this.resOfshow = 'n'
        }
      })
      .fail(() => {
        console.log('请求数据失败！')
      })
    },
    billtabEvent: function () {
      $(document)
      .find('.selectPicker .defaultVal')
      .removeClass('hashow')
      .siblings('ul')
      .slideUp('fast')
      this.billtabshow = true
      this.checktabshow = false
      this.statushow = true
    },
    checktabEvent: function () {
      $(document)
      .find('.selectPicker .defaultVal')
      .removeClass('hashow')
      .siblings('ul')
      .slideUp('fast')
      this.billtabshow = false
      this.checktabshow = true
      this.statushow = false
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
    searchResult: function () {
      // console.log(this.billStatus, this.byear, this.bmonth, this.eyear, this.emonth, this.channel)
      this.getBilldata({
        billStatus: this.billStatus,
        startTime: Number(this.byear + this.bmonth),
        endTime: Number(this.eyear + this.emonth),
        channel: this.channel,
        accountName: this.accountName,
        pageNo: 1
      })
    },
    combineEvent: function () {
      console.log('111123213123123123')
    }
  }
})
