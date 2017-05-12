<template>
  <div class="selectPicker">
    <span class="defaultVal" @click.stop="updowns" v-html="getShowhtml" onselectstart="return false"></span>
      <ul v-show="isDownShow">
        <li v-for="item in selectList"  @click="chooseopt(item.name, item.id, $event)">{{item.name}}</li>
      </ul>
  </div>
</template>
<script>
const typeJson = {
  yearData: [{id: 2017, name: '2017年'}, {id: 2018, name: '2018年'}, {id: 2019, name: '2019年'}],
  monthData: [{id: '01', name: '1月'}, {id: '02', name: '2月'}, {id: '03', name: '3月'}, {id: '04', name: '4月'}, {id: '05', name: '5月'}, {id: '06', name: '6月'}, {id: '07', name: '7月'}, {id: '08', name: '8月'}, {id: '09', name: '9月'}, {id: '10', name: '10月'}, {id: '11', name: '11月'}, {id: '12', name: '12月'}],
  statuData: [{id: -2, name: '全部'}, {id: 2, name: '对账通过'}, {id: 3, name: '对账不通过'}, {id: 0, name: '未对账'}, {id: 4, name: '已确认'}],
  verifyData: [{id: '-2', name: '核对结果'}, {id: 0, name: '不一致'}, {id: 1, name: '一致'}]
}
export default {
  data () {
    return {
      getShowhtml: '',
      sendBackval: '',
      channels: [],
      allListArray: [],
      isDownShow: false
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
          return typeJson.yearData
        case 'month':
          return typeJson.monthData
        case 'status':
          return typeJson.statuData
        case 'verify':
          return typeJson.verifyData
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
    document.addEventListener('mousedown', (e) => {
      if (!this.$el.contains(e.target)) { this.isDownShow = false }
    })
    if (this.selectType === 'channel') { // 动态请求列表的数据
      this.$http.jsonp('http://financial.manage.youku.com/account/getAllAcount', {jsonp: 'jsoncallback'}).then((response) => {
        // console.log(response.body.data)
        if (response.body.code === 0) {
          let listTotal = [] // listTotal  Array
          let newDataArr = response.body.data
          for (let item of newDataArr) {
            listTotal = listTotal.concat(item.accountList)
            this.allListArray.push(item.accountList)
          }
          if (this.needTotal === 'yes') { // 需要显示全部渠道账单
            newDataArr.unshift({id: -2, name: '全部', accountList: listTotal})
            this.allListArray.unshift(listTotal) // all accountList Array
          }
          this.channels.splice(0, 0, ...newDataArr) // 动态增加新数据
        }
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
      this.isDownShow = !this.isDownShow
    },
    chooseopt: function (_name, _id, event) {
      this.getShowhtml = _name
      this.sendBackval = _id
      this.isDownShow = false
      // 事件和参数发射出去
      this.$emit('chooseopt', this.selectMean, this.sendBackval)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
// selectPicker
.selectPicker{line-height:28px;position:relative;display:inline-block;float:left;height:28px;cursor:default;border:1px solid #ddd;border-radius:2px;background:#fff;
  .defaultVal{position:relative;display:block;overflow:hidden;width:100%;height:100%;padding:0 30px 0 10px;text-align:left;white-space:nowrap;color:#666;
    &:after{position:absolute;top:50%;right:10px;width:0;height:0;margin-top:-2.5px;content:'';border-width:5px;border-style:solid;border-color:#666 transparent transparent transparent;}
  }
  ul{position:absolute;z-index:2;top:28px;left:0;overflow-x:hidden;overflow-y:auto;min-width:100%;max-height:280px;padding:10px 0;list-style:none;white-space:nowrap;background:#fff;box-shadow:0 0 5px 0 rgba(184,191,197,.50);
    li{line-height:24px;float:none;padding:0 10px;text-align:left;color:#666;
      &:hover{background:#f4f8fa;}
    }
  }
  &.selectStya{width:100px;}
  &.selectStyb{width:210px;}
  &.selectStyc{width:150px;}
}
</style>
