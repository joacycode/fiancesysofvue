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
<style lang="less" scoped>
// head
.header{overflow:hidden;width:100%;}
.head-top{overflow:hidden;width:100%;height:30px;background:#343f52;
  .lg-info{line-height:30px;overflow:hidden;width:1200px;height:100%;margin:0 auto;color:#fff;
    span:first-child{margin-left:20px;cursor:pointer;}
    span{font-size:12px;float:right;
      b{margin-left:10px;}
    }
  }
}
.head-bot{overflow:hidden;width:100%;background:#fff;
  ul{width:1200px;height:60px;margin:0 auto;
    li{line-height:60px;float:left;height:100%;}
  }
  li.yklogo{position:relative;box-sizing:content-box;width:130px;padding-right:30px;
    span{display:inline-block;width:130px;height:25px;vertical-align:middle;background-image:url(../assets/img/yk-logo.png);background-repeat:no-repeat;}
    &:after{position:absolute;top:50%;right:15px;display:inline-block;width:1px;height:20px;margin-top:-10px;content:'';background:#d8d8d8;}
  }
  li.tit{font-size:20px;display:inline-block;color:#666;}
}
#uploadfile{float:right;
  span{line-height:35px;position:relative;display:inline-block;width:120px;height:35px;cursor:pointer;text-indent:46px;color:#30a4ff;border:1px solid #30a4ff;border-radius:2px;
    &:before{position:absolute;top:50%;left:10px;display:inline-block;width:20px;height:20px;margin-top:-10px;content:'';background-image:url(../assets/img/collect.png);background-repeat:no-repeat;background-position:-80px -1px;}
  }
}
</style>

