<template>
  <div class="dialogMaskfix">
    <div class="dialogMaskbg">
      <div class="dialogWrap">
        <!-- dialogbar -->
        <div class="dialogbar" v-if="conType == 'dialogbar'">
           <div class="toper">
              <span class="title">{{conTitle}}</span>
              <span class="close" @click="dialogClose"></span>
            </div>
            <!-- conRank: warn success notice -->
            <div class="middler" :class="conRank"> 
              <span class="ico"></span>
              <div class="multiWords" v-if="dialogSub == true">
                  <slot></slot>
              </div>
              <div class="signlWords" v-else>
                <p>
                  <slot></slot>
                </p>
              </div>
            </div>
            <span class="makeSure" @click="dialogClose">确认</span>
        </div>
        <!-- dialogbar -->
        <div class="progressbar" v-else-if="conType == 'progressbar'">
          <p>处理中，请稍后</p>
          <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
          <!-- <div class="probar">
            <span></span>
          </div>
          <p class="proTxt">88%</p> -->
        </div>
        <!-- uploaddbar -->
        <div class="uploaddbar" v-else-if="conType == 'uploaddbar'">
          <div class="toper">
            <span class="title">{{conTitle}}</span>
            <span class="close"  @click="dialogClose"></span>
          </div>
          <div class="former">
            <div class="formitem">
              <span>支付渠道</span><selector class="ty_long selector" def-html="全部" :def-val="channel" select-type="cNel" select-mean="channel" @chooseopt=""></selector>
            </div>
            <div class="formitem">
              <span>支付账号</span><input type="text" class="ty_long" v-model="uploadAccount" :class="{blanknull:isAccountNull}">
            </div>
            <div class="formitem selectorWrap">
              <span>账单年月</span> <selector class="selector mr10 " def-html="2017年" :def-val="year" select-type="year" select-mean="year" @chooseopt="handledata"></selector><selector class="selector" def-html="1月" :def-val="month" select-type="month" select-mean="month" @chooseopt="handledata"></selector>
            </div>
            <div class="formitem">
              <span>账单地址</span><input type="text" class="ty_long" v-model="uploadAdress" :class="{blanknull:isAdressNull}">
            </div>
          </div>  
          <span class="makeSure mt35" @click="uploadEvent">立即上传</span>
        </div>
        <!-- handlebar -->
        <div class="handlebar" v-else-if="conType == 'handlebar'">
          <div class="toper">
            <span class="title">{{conTitle}}</span>
            <span class="close"  @click="dialogClose"></span>
          </div>
          <div class="manualSurer">
            <p><span>原因:</span><span class="lastNum">还剩<b class="first">{{typeNums}}</b>/<b class="second">50</b>字</span></p>
            <textarea placeholder="必填" @keyup="countEvent" @input="countEvent"></textarea>
          </div>
          <div class="mutiBtns mt35">
            <span class="makeSure mr20" @click="handTypeEventsure">确认  
            </span><span class="cancel" @click="handTypeEventcancel">取消</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- <dialogpop v-if="isShowthis" :con-type="dialogType" :con-title="dialogTitle" :con-rank="dialogRank" :dialog-sub="hasDialogsub" @dialogclose="closeEvent" @uploadeventsure="toUploadEvent" @handeventsure="tohandeventsure" @handeventcancel="tohandeventcancel"><p>{{dialogHtml}}</p><p v-if="hasDialogsub">{{dialogHtmlSub}}</p></dialogpop> -->
<script>
// import VueResource from 'vue-resource'
import Selector from './selector'
export default {
  components: {
    Selector
  },
  data () {
    return {
      msg: '213123123',
      typeNums: 50,
      year: 2017,
      month: '01',
      channel: '-2',
      uploadAccount: '',
      uploadAdress: '',
      isAdressNull: false,
      isAccountNull: false
    }
  },
  props: ['conType', 'conTitle', 'conRank', 'dialogSub'],
  methods: {
    countEvent: function (e) {
      // console.log(e.target.value.length)
      let len = e.target.value.length
      if (len >= 0 && len <= 50) {
        this.typeNums = 50 - len
      } else {
        e.target.value = e.target.value.substring(0, 50)
      }
    },
    dialogClose: function () {
      this.$emit('dialogclose')
    },
    uploadEvent: function () {
      if (this.uploadAccount === '') {
        this.isAccountNull = true
        return false
      }
      if (this.uploadAdress === '') {
        this.isAdressNull = true
        return false
      }
      this.isAccountNull = false
      this.isAdressNull = false
      let params = {
        channel: Number(this.channel),
        accountName: this.uploadAccount,
        billTime: Number(this.year + this.month),
        downloadUrl: this.uploadAdress
      }
      this.$emit('uploadeventsure', params)
    },
    handTypeEventsure: function () {
      this.$emit('handeventsure')
    },
    handTypeEventcancel: function () {
      this.$emit('dialogclose')
    },
    handledata: function (m, n) {
      switch (m) {
        case 'year':
          this.year = n
          break
        case 'month':
          this.month = n
          break
        case 'channel':
          this.channel = n
          break
        default: return
      }
    }
  }
}
</script>
<style lang="less">
.blanknull{
  border-color: #ff5e5e!important;
  box-shadow: 0 0 5px 0px #ff5e5e!important;
}
.dialogMaskfix{
  width: 100%;height: 100%;position: absolute;top: 0;left: 0;z-index: 999;
  .dialogMaskbg{
    background: rgba(0,0,0,0.5);position: fixed;left: 0;top: 0;width: 100%;height: 100%;
  }
}
.spinner {
  margin: 0 auto;
  width: 50px;
  height: 30px;
  text-align: center;
  font-size: 10px;
}
.spinner > div {
  background-color: #999;
  height: 100%;
  width: 4px;
  display: inline-block;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}
.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}
@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>
