<template>
<div class="header">
    <div class="head-top">
        <div class="lg-info" v-if="needLogfoo">
            <span class="exit" @click="logoutReq">退出</span>
            <span>欢迎您,<b>{{loginName}}</b></span>
        </div>
    </div>
    <div class="head-bot">
        <ul>
            <li class="yklogo"><span></span></li>
            <li class="tit">{{title}}</li>
            <li id="uploadfile" v-if="needUpload"><span onselectstart="return false;" @click="uploadBill">上传账单</span></li>
        </ul>
    </div>
</div>
</template>
<script>
import Cookie from 'js-cookie'
export default {
  data () {
    return {
      loginName: Cookie.get('loginSure') || 'user',
      canlgout: true
    }
  },
  props: ['title', 'needUpload', 'needLogfoo'],
  methods: {
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
    },
    uploadBill () {
      this.$emit('uploadbill')
    }
  }
}
</script>
<style lang="less">
// head
.header{width: 100%;overflow: hidden;}
.head-top{
	width: 100%;height: 30px;background: #343F52;overflow: hidden;
	.lg-info{
		width: 1200px;margin: 0 auto;color: #fff;overflow: hidden;height: 100%;line-height: 30px;
		span{float: right;font-size: 12px;b{margin-left: 10px;}}
		span:first-child{margin-left: 20px;cursor: pointer;}
	 }
}
.head-bot{
	width: 100%;background: #fff;overflow: hidden;
	ul{
		width: 1200px;height: 60px;margin: 0 auto;
		li{float: left;height: 100%;line-height: 60px;}
	}
	li.yklogo{
		width: 130px;padding-right: 30px;position: relative;box-sizing: content-box;
		span{width: 130px;height: 25px;display: inline-block;background-image: url(../assets/img/yk-logo.png);background-repeat: no-repeat;vertical-align: middle;}
		&:after{
			content: '';display: inline-block;
			width: 1px;height: 20px;background: #D8D8D8;
			position: absolute;right: 15px;top: 50%;margin-top: -10px;
		}
	}
	li.tit{
		font-size: 20px;color: #666;display: inline-block;
	}
}
#uploadfile{
	float: right;
	span{
		width: 120px;height: 35px;line-height: 35px;color: #30A4FF;border: 1px solid #30A4FF;border-radius: 2px;text-indent: 46px;display: inline-block;cursor: pointer;position: relative;
		&:before{
			width: 20px;height: 20px;background-image: url(../assets/img/collect.png);background-repeat: no-repeat;background-position: -80px -1px;display: inline-block;
			content: '';
			position: absolute;
			top: 50%;
			left: 10px;
			margin-top: -10px;
		}
	}
}
</style>

