<template>
  <div class="selectPicker">
    <span class="defaultVal" @click.stop="updowns" v-html="getShowhtml"></span>
    <ul>
      <li v-for="item in selectList"  @click="chooseopt(item.name, item.id, $event)">{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
import $ from 'jquery'
const yearData = [{id: 2017, name: '2017年'}, {id: 2018, name: '2018年'}, {id: 2019, name: '2019年'}]
const monthData = [{id: '01', name: '1月'}, {id: '02', name: '2月'}, {id: '03', name: '3月'}, {id: '04', name: '4月'}, {id: '05', name: '5月'}, {id: '06', name: '6月'}, {id: '07', name: '7月'}, {id: '08', name: '8月'}, {id: '09', name: '9月'}, {id: '10', name: '10月'}, {id: '11', name: '11月'}, {id: '12', name: '12月'}]
const statuData = [{id: -2, name: '全部'}, {id: 2, name: '对账通过'}, {id: 3, name: '对账不通过'}, {id: 0, name: '未对账'}, {id: 4, name: '已确认'}]
const verifyData = [{id: '', name: '核对结果'}, {id: 0, name: '一致'}, {id: 1, name: '不一致'}]
export default {
  data () {
    return {
      getShowhtml: '',
      sendBackval: '',
      channels: '',
      allListArray: []
    }
  },
  props: {
    defaultHtml: [String, Number],
    defaultVal: [String, Number],
    selectType: [String, Number],
    selectMean: [String, Number],
    needTotal: {
      type: String,
      default: 'no'
    }
  },
  computed: {
    selectList: function () {
      switch (this.selectType) {
        case 'year':
          return yearData
        case 'month':
          return monthData
        case 'status':
          return statuData
        case 'verify':
          return verifyData
        case 'channel':
          return this.channels
        default:
          return []
      }
    }
  },
  mounted: function () {
    this.getShowhtml = this.defaultHtml
    this.sendBackval = this.defaultVal
    if (this.selectType === 'channel') { // 动态请求列表的数据
      this.$http.jsonp('http://financial-checking.heyi.test/account/getAllAcount', {jsonp: 'jsoncallback'}).then((response) => {
        // console.log(response.body.data)
        let listTotal = [] // listTotal  Array
        let newData = response.body.data
        for (let item of newData) {
          listTotal = listTotal.concat(item.accountList)
          this.allListArray.push(item.accountList)
        }
        if (this.needTotal === 'yes') { // 需要显示全部渠道账单
          newData.unshift({id: -2, name: '全部', accountList: listTotal})
          this.allListArray.unshift(listTotal) // all accountList Array
        }
        this.channels = newData
      }, (errResponse) => {
        console.log(errResponse)
      })
    }
  },
  watch: {
    allListArray: function () {
      this.$emit('sendlists', this.allListArray)
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
    chooseopt: function (_name, _id, event) {
      let $e = $(event.target)
      let $dl = $e.closest('.selectPicker')
      this.getShowhtml = _name
      this.sendBackval = _id
      $dl
      .find('ul')
      .slideUp('fast')
      $dl
      .find('.defaultVal')
      .removeClass('hashow')
      // 事件和参数发射出去
      this.$emit('chooseopt', this.selectMean, this.sendBackval)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
// selectPicker
.selectPicker{
  background: #fff;border:1px solid #ddd;border-radius: 2px;position: relative;cursor: default;height: 28px;line-height: 28px;display: inline-block;float: left;
  .defaultVal{width: 100%;height: 100%;display: block;text-align: left;overflow: hidden;white-space: nowrap;padding: 0 30px 0 10px;position: relative;
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
      min-width: 100%;max-height: 280px;list-style: none;position: absolute;top: 28px;left:0;background: #fff;padding:10px 0;box-shadow: 0 0 5px 0 rgba(184,191,197,0.50);z-index: 2;overflow-y: auto;overflow-x: hidden;white-space: nowrap;display: none;
    li{
      text-align: left;padding:0 10px;float: none;line-height: 24px;
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
