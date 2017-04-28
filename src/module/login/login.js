import Vue from 'vue'
import $ from 'jquery'
import Cookie from 'js-cookie'
import Md5 from 'md5'
require('assets/less/main.less')
/* eslint-disable no-new */
new Vue({
  el: '#loginPage',
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
    loginReq: function (params) {
      $.ajax({
        url: 'http://financial-checking.heyi.test/user/login',
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'getData',
        data: decodeURIComponent($.param(params))
      })
      .done((res) => {
        this.canlogin = true
        if (res.code === 0) {
          Cookie.set('loginSure', this.accountVal)
          window.location.href = '/module/index.html'
        } else {
          this.errorMsg = res.message || '登录失败'
        }
      })
      .fail(() => {
        this.canlogin = true
        this.errorMsg = '请求错误，稍后再试'
      })
    }
  }
})

