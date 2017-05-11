require('assets/less/main.less')
import Vue from 'vue'
import VueResource from 'vue-resource'
import Cookie from 'js-cookie'
import Md5 from 'md5'
import Headwrap from '../../components/headwrap'

Vue.use(VueResource)
/* eslint-disable no-new */
new Vue({
  el: '#loginPage',
  components: {
    'headwrap': Headwrap
  },
  data: {
    canlogin: true,
    accountVal: '',
    pwdVal: '',
    errorMsg: ''
  },
  methods: {
    logininEvent: function () {
      if (!this.canlogin) { return false }
      if (this.accountVal === '') {
        this.errorMsg = '请填写登录名'
        return false
      }
      if (this.pwdVal === '') {
        this.errorMsg = '请填写密码'
        return false
      }
      this.errorMsg = ''
      if (this.canlogin) {
        this.canlogin = false
        this.loginReq({
          userName: this.accountVal,
          password: Md5(this.pwdVal)
        })
      }
    },
    loginReq: function (paramsObj) {
      this.$http.jsonp('http://financial.manage.youku.com/user/login', {jsonp: 'jsoncallback', params: paramsObj}).then((response) => {
        this.canlogin = true
        if (response.body.code === 0) {
          Cookie.set('loginSure', this.accountVal)
          window.location.href = '/module/index.html'
        } else {
          this.errorMsg = response.body.message || '登录失败'
        }
      }, (response) => {
        this.canlogin = true
        this.errorMsg = '请求错误，稍后再试'
      })
    }

  }
})

