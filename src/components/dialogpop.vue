<template>
  <div class="dialogMaskfix" v-if="dialogShow">
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
              <div class="multiWords" v-if="dialogSub == 'true'">
                <p>该月账单正在处理中，不允许重复操作</p>
                <p>系统繁忙，请稍后再试。</p>
              </div>
              <p class="signlWords" v-else>该月账单正在处理中，不允许重复操作！</p>
            </div>
            <span class="makeSure" @click="dialogEventsure">确认</span>
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
        <!-- uplaodbar -->
        <div class="uplaodbar" v-else-if="conType == 'uplaodbar'">
          <div class="toper">
            <span class="title">{{conTitle}}</span>
            <span class="close"  @click="dialogClose"></span>
          </div>
          <div class="former">
            <div class="formitem">
              <span>支付渠道</span><input type="text" class="ty_long">
            </div>
            <div class="formitem">
              <span>支付账号</span><input type="text" class="ty_long">
            </div>
            <div class="formitem selectorWrap">
              <span>账单年月</span> <selector class="selector mr10 " def-html="2017年" :def-val="year" select-type="year"  @chooseopt=""></selector><selector class="selector" def-html="5月" :def-val="month" select-type="month"  @chooseopt=""></selector>
            </div>
            <div class="formitem">
              <span>账单地址</span><input type="text" class="ty_long">
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
<script>
// import VueResource from 'vue-resource'
import Selector from './selector'
export default {
  data () {
    return {
      msg: '213123123',
      typeNums: 50,
      dialogShow: true
    }
  },
  props: ['conType', 'conTitle', 'conRank', 'dialogSub'],
  components: {
    Selector
  },
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
      this.dialogShow = false
    },
    dialogEventsure: function () {
      this.dialogShow = false
      this.$emit('dialogClose')
    },
    uploadEvent: function () {
      this.dialogShow = false
      this.$emit('uploadEvent')
    },
    handTypeEventsure: function () {
      this.dialogShow = false
      this.$emit('handTypeEventsure')
    },
    handTypeEventcancel: function () {
      this.dialogShow = false
      this.$emit('handTypeEventcancel')
    }
  }
}
</script>
<style lang="less">
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
