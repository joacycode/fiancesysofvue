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
            <div class="middler" :class="conRank"> <!-- conRank: warn success notice -->
              <span class="ico"></span>
              <div class="multiWords" v-if="dialogSub && dialogSub == true">
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
<!-- progressbar -->
        <div class="progressbar" v-else-if="conType == 'progressbar'">
          <p>处理中，请稍后</p>
          <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
          <!-- <div class="probar"><span></span></div><p class="proTxt">88%</p> -->
        </div>
<!-- uploaddbar -->
        <div class="uploaddbar" v-else-if="conType == 'uploaddbar'">
          <div class="toper">
            <span class="title">{{conTitle}}</span>
            <span class="close"  @click="dialogClose"></span>
          </div>
          <div class="former">
            <div class="formitem selectorWrap">
              <span>支付渠道</span><use-selector class="ty_long selector" default-html="支付宝" :default-val="channel" select-type="channel" select-mean="channel" @chooseopt="handledata"></use-selector>
            </div>
            <div class="formitem">
              <span>支付账号</span><input type="text" class="ty_long" v-model.trim="uploadAccount" :class="{blanknull:isAccountNull}" @focus="combineFocus" @blur="combineBlur">
               <div class="combineResWrap" v-show="isCombineShow">
                    <p v-if="isListNull">未找到匹配结果</p>
                    <ul v-else>
                        <li v-for="item in combinelist" @mousedown="combineItemEvent">{{item}}</li>
                    </ul>
                </div>
            </div>
            <div class="formitem selectorWrap">
              <span>账单年月</span> <use-selector class="selector mr20 " default-html="2017年" :default-val="year" select-type="year" select-mean="year" @chooseopt="handledata"></use-selector><use-selector class="selector" default-html="1月" :default-val="month" select-type="month" select-mean="month" @chooseopt="handledata"></use-selector>
            </div>
            <div class="formitem">
              <span>账单名称</span><input type="text" class="ty_long" v-model.trim="uploadAdress" :class="{blanknull:isAdressNull}">
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
          <div class="middler">
            <p><span>原因:</span><span class="lastNum">还剩<b class="first">{{typeNums}}</b>/<b class="second">50</b>字</span></p>
            <textarea placeholder="必填" @keyup="countEvent" @input="countEvent" v-model.trim="handlebarVal" :class="{blanknull:isTextareaNull}"></textarea>
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
    'useSelector': Selector
  },
  data () {
    return {
      typeNums: 50,
      year: 2017,
      month: '01',
      channel: '1',
      uploadAccount: '',
      uploadAdress: '',
      isAdressNull: false,
      isAccountNull: false,
      isTextareaNull: false,
      handlebarVal: '',
      isCombineShow: false,
      combinelist: ''
    }
  },
  computed: {
    isListNull () {
      return !this.combinelist.length
    }
  },
  props: {
    conType: {
      type: String,
      reqirue: true
    },
    conTitle: {
      type: String,
      reqirue: true
    },
    conRank: {
      type: String,
      reqirue: true
    },
    dialogSub: Boolean,
    uploadArray: Array
  },
  mounted: function () {
    if (this.uploadArray) {
      this.combinelist = this.uploadArray[1]
    }
  },
  methods: {
    countEvent (e) {
      // console.log(e.target.value.length)
      this.isTextareaNull = false
      let len = e.target.value.length
      if (len >= 0 && len <= 50) {
        this.typeNums = 50 - len
      } else {
        e.target.value = e.target.value.substring(0, 50)
      }
    },
    dialogClose () {
      this.$emit('dialogclose')
    },
    uploadEvent () {
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
    handTypeEventsure () {
      if (this.handlebarVal === '') {
        this.isTextareaNull = true
        return false
      }
      this.isTextareaNull = false
      this.$emit('handeventsure', this.handlebarVal)
    },
    handTypeEventcancel () {
      this.$emit('dialogclose')
    },
    handledata (m, n) {
      switch (m) {
        case 'year':
          this.year = n
          break
        case 'month':
          this.month = n
          break
        case 'channel':
          this.channel = n
          this.uploadAccount = ''
          if (n === 1) {
            this.combinelist = this.uploadArray[1]
          } else if (n === 2) {
            this.combinelist = this.uploadArray[2]
          } else if (n === 3) {
            this.combinelist = this.uploadArray[3]
          }
          console.log(this.combinelist)
          break
        default: return
      }
    },
    combineItemEvent (e) {
      this.uploadAccount = e.target.innerHTML
    },
    combineFocus () {
      this.isCombineShow = true
    },
    combineBlur () {
      this.isCombineShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.dialogWrap{position:absolute;top:50%;left:50%;width:450px;min-height:225px;margin-top:-200px;margin-left:-225px;padding-bottom:40px;text-align:center;border-radius:2px;background:#fff;box-shadow:0 0 5px 0 rgba(184,191,197,.50);
  // public
  .ico-base(@width,@height,@posw,@posh){display:inline-block;width:@width;height:@height;background-image:url(../assets/img/collect.png);background-repeat:no-repeat;background-position:@posw @posh;}
  .elpsis(@width){overflow:hidden;max-width:@width;vertical-align:middle;white-space:nowrap;text-overflow:ellipsis;}
  .ico-warn{.ico-base(35px,35px,0,-41px);}
  .ico-success{.ico-base(35px,35px,0,-111px);}
  .ico-notice{.ico-base(35px,35px,0,-76px);}
  .ico-loginclo{.ico-base(14px,14px,-36px,-21px);}
  .toper{line-height:45px;position:relative;width:100%;height:45px;padding:0 20px;background:rgba(244,248,250,.7);
    .title{font-size:16px;font-weight:700;float:left;}
    .close{float:right;margin-top:15px;cursor:pointer;.ico-loginclo;}
  }
  .makeSure,.cancel{line-height:35px;display:inline-block;width:125px;height:35px;cursor:pointer;text-align:center;color:#fff;border-radius:2px;background:#30a4ff;}
  .makeSure{color:#fff;background:#30a4ff;
    &:hover{background:#47adfd;}
  }
  .cancel{color:#666;border:1px solid #ddd;background:#fafafa;
    &:hover{background:#fafafe;}
  }
  .blanknull{border-color:#ff5e5e!important;box-shadow:0 0 5px 0 #ff5e5e!important;}
  textarea{border:none;}
  // dialogbar
  .dialogbar{.middler{font-size:16px;width:90%;height:135px;margin:0 auto;padding-top:45px;text-align:center;
      .ico{margin-right:10px;vertical-align:middle;}
      &.success{.ico{.ico-success;}
      }
      &.notice{.ico{.ico-notice;}
      }
      &.warn{.ico{.ico-warn;}
      }
      .signlWords{display:inline-block;.elpsis(360px);}
      .multiWords{display:inline-block;overflow:hidden;text-align:left;vertical-align:middle;
        p:first-child{margin-bottom:8px;}
        p:last-child{font-size:12px;font-weight:normal;color:#666;}
        p{.elpsis(360px);}
      }
    }
  }
  // progressbar  
  .progressbar{margin-top:90px;color:#666;
    p:first-child{margin-bottom:10px;}
    p.proTxt{margin-top:10px;}
    .probar{width:200px;height:8px;margin:0 auto;border-radius:100px;background:#ececec;
      span{display:block;width:176px;height:8px;border-radius:100px;background:#30a4ff;}
    }
    .spinner{font-size:10px;width:50px;height:30px;margin:0 auto;text-align:center;}
    .spinner > div{display:inline-block;width:4px;height:100%;-webkit-animation:sk-stretchdelay 1.2s infinite ease-in-out;animation:sk-stretchdelay 1.2s infinite ease-in-out;background-color:#999;}
    .spinner .rect2{-webkit-animation-delay:-1.1s;animation-delay:-1.1s;}
    .spinner .rect3{-webkit-animation-delay:-1.0s;animation-delay:-1.0s;}
    .spinner .rect4{-webkit-animation-delay:-.9s;animation-delay:-.9s;}
    .spinner .rect5{-webkit-animation-delay:-.8s;animation-delay:-.8s;}
    @-webkit-keyframes sk-stretchdelay{
      0%,40%,100%{-webkit-transform:scaleY(.4);}
      20%{-webkit-transform:scaleY(1.0);}
    }
    @keyframes sk-stretchdelay{
      0%,40%,100%{-webkit-transform:scaleY(.4);transform:scaleY(.4);}
      20%{-webkit-transform:scaleY(1.0);transform:scaleY(1.0);}
    }
  }
  .uploaddbar{// uplaodbar
    .former{margin:20px 30px -15px 30px;color:#666;}
    .formitem{line-height:35px;position:relative;width:100%;height:35px;margin-bottom:15px;
      span,input,.selector{line-height:35px;float:left;height:35px;}
      .selector{display:inline-block;width:150px;height:35px;vertical-align:middle;background:#eee;background:#fff;
        ul{top:35px;}
        &.ty_long{width:320px;border:1px solid #ddd;border-radius:2px;background:#fff;}
      }
      & > span:first-child{width:60px;margin-right:10px;}
      input.ty_long{width:320px;padding:0 10px;border:1px solid #ddd;border-radius:2px;background:#fff;}
      .combineResWrap{position:absolute;z-index:2;top:36px;right:0;width:320px;border:1px solid #ccc;
        p{line-height:30px;width:100%;padding:0 10px;color:#f37255;background:#fff;}
        ul{overflow-x:auto;overflow-y:scroll;max-height:120px;
          li{line-height:30px;width:100%;padding:0 10px;cursor:default;text-align:left;background:#fff;
            &:hover{background:#edf7ff;}
          }
        }
      }
    }
  }
  //handlevbar
  .handlebar{.middler{margin:20px 20px 0 20px;
      p{span:first-child{float:left;}
        .lastNum{float:right;color:#666;
          b{margin:0 2px;}
          .first{color:#f26c4e;}
        }
      }
      textarea{width:100%;height:120px;margin-top:15px;padding:15px;resize:none;color:#666;border:1px solid #ddd;background:#fff;}
    }
  }
}
.dialogMaskfix{position:absolute;z-index:999;top:0;left:0;width:100%;height:100%;
  .dialogMaskbg{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);}
}
</style>
