<template>
  <div class="selectPicker" :class="extraClass" :data-value="toShowval" :data-mean="selectMean">
    <span class="defaultVal" @click.stop="updowns" v-html="toShowhtml"></span>
    <ul>
      <li v-for="item in selectOpts" :data-value="item.val" @click="chooseopt">{{item.txt}}</li>
    </ul>
  </div>
</template>
<!-- <selector extra-class="selectStya mr10" def-html="2017年" :def-val="byear" select-type="year" select-mean="byear" @chooseopt="handledata"></selector> -->
<script>
// import VueResource from 'vue-resource'
import $ from 'jquery'
export default {
  data () {
    return {
      months: [{val: '01', txt: '1月'}, {val: '02', txt: '2月'}, {val: '03', txt: '3月'}, {val: '04', txt: '4月'}, {val: '05', txt: '5月'}, {val: '06', txt: '6月'}, {val: '07', txt: '7月'}, {val: '08', txt: '8月'}, {val: '09', txt: '9月'}, {val: '10', txt: '10月'}, {val: '11', txt: '11月'}, {val: '12', txt: '12月'}],
      years: [{val: 2016, txt: '2016年'}, {val: 2017, txt: '2017年'}, {val: 2018, txt: '2018年'}, {val: 2019, txt: '2019年'}],
      billStus: [{val: -2, txt: '全部'}, {val: 2, txt: '对账通过'}, {val: 3, txt: '对账不通过'}, {val: 0, txt: '未对账'}],
      checkStus: [{val: -2, txt: '全部'}, {val: 2, txt: '对账通过'}, {val: 3, txt: '对账不通过'}, {val: 4, txt: '已确认'}],
      checkRes: [{val: 0, txt: '一致'}, {val: 1, txt: '不一致'}],
      channel: '',
      toShowhtml: this.defHtml,
      toShowval: this.defVal
    }
  },
  props: ['extraClass', 'defHtml', 'defVal', 'selectType', 'selectMean'],
  computed: {
    selectOpts: function () {
      switch (this.selectType) {
        case 'year':
          return this.years
        case 'month':
          return this.months
        case 'bStatu':
          return this.billStus
        case 'cStatu':
          return this.checkStus
        case 'checkRe':
          return this.checkRes
        case 'cNel':
          this.getcNel()
          return this.channel
        default:
          return []
      }
    }
  },
  methods: {
    updowns: function (event) {
      let $e = $(event.target)
      let $dfs = $e.closest('.selectPicker').siblings('.selectPicker').find('.defaultVal')
      let $pdfs = $e.closest('.selectorWrap').siblings('.selectorWrap').find('.selectPicker .defaultVal')
      // console.log(_this)
      if (!$e.hasClass('hashow')) {
        $e
        .addClass('hashow')
        .siblings('ul')
        .slideDown('fast')
      } else {
        $e
        .removeClass('hashow')
        .siblings('ul')
        .slideUp('fast')
      }
      if ($dfs.hasClass('hashow')) {
        $dfs
        .removeClass('hashow')
        .siblings('ul')
        .slideUp('fast')
      }
      if ($pdfs.hasClass('hashow')) {
        $pdfs
        .removeClass('hashow')
        .siblings('ul')
        .slideUp('fast')
      }
    },
    chooseopt: function (event) {
      let $e = $(event.target)
      let $dl = $e.closest('.selectPicker')
      this.toShowhtml = $e.text()
      this.toShowval = $e.attr('data-value')
      $dl
      .find('ul')
      .slideUp('fast')
      $dl
      .find('.defaultVal')
      .removeClass('hashow')
      // 事件和参数发射出去
      this.$emit('chooseopt', this.selectMean, this.toShowval)
    },
    getcNel: function () {
      $.ajax({
        url: 'http://financial-checking.heyi.test/account/getAllAcount',
        type: 'get',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: 'getData'
      })
      .done((res) => {
        this.channel = res.message
      })
      .fail((XHR, textStatus, errorThrown) => {
        console.log(textStatus)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
// selectPicker
.selectPicker{
  background: #fff;border:1px solid #ddd;border-radius: 2px;position: relative;cursor: default;height: 28px;line-height: 28px;display: inline-block;float: left;
  .defaultVal{width: 100%;height: 100%;display: block;text-align: center;overflow: hidden;white-space: nowrap;padding: 0 30px 0 10px;position: relative;
     &:after{
      content: '';
      position: absolute;
      right: 10px;
      top: 50%;
      width: 0;
      height: 0;
      margin-top: -2.5px;
      border-width: 5px;
      border-color: #666 transparent transparent transparent;
      border-style: solid;     
    }
  }
  ul{
      min-width: 100%;max-height: 280px;list-style: none;position: absolute;top: 28px;left:0;background: #fff;padding:10px 0;box-shadow: 0 0 5px 0 rgba(184,191,197,0.50);z-index: 2;overflow-y: scroll;overflow-x: auto;white-space: nowrap;display: none;
    li{
      text-align: center;padding:0 10px;float: none;line-height: 24px;
      &:hover{
        background: #f4f8fa;
      }
    }
  }
  &.selectStya{
    width:100px;
  }
  &.selectStyb{
    width:210px;
  }
  &.selectStyc{
    width:150px;
  }
}
</style>
