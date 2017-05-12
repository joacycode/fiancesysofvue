<template>
  <div class="page-wrap">
    <ul v-show="prePage" class="li-page" @click="goPrePage">&lt;</ul>
    <ul>
      <li v-for="i in showPageBtn" :class="{active: i === currentPage, pointer: i, hover: i && i !== currentPage}" @click="pageOffset(i)">
        <a v-if="i" class="notPointer">{{i}}</a>
        <a v-else>···</a>
      </li>
    </ul>
    <ul v-show="nextPage" class="li-page" @click="goNextPage">&gt;</ul>
    <div class="skipTo">跳转到<input type="text" v-model.trim.number="somePage" :class="{blankError: inputError}"><span @click="goSomePage">GO</span></div>
  </div>
</template>
<script>
  export default{
    data () {
      return {
        somePage: '1',
        inputError: false
      }
    },
    props: ['totalItems', 'pageSize'],
    computed: {
      offset () {
        return this.$store.state.offset
      },
      prePage () {
        return this.offset !== 0 && this.totalItems
      },
      nextPage () {
        return (this.offset + this.pageSize < this.totalItems) && this.totalItems
      },
      totalPage () {
        return Math.ceil(this.totalItems / this.pageSize)
      },
      currentPage () {
        return Math.ceil(this.offset / this.pageSize) + 1
      },
      showPageBtn () {
        let pageNum = this.totalPage
        let index = this.currentPage
        let arr = []
        if (pageNum <= 5) {
          for (let i = 1; i <= pageNum; i++) {
            arr.push(i)
          }
          return arr
        }
        if (index <= 2) return [1, 2, 3, 0, pageNum]
        if (index >= pageNum - 1) return [1, 0, pageNum - 2, pageNum - 1, pageNum]
        if (index === 3) return [1, 2, 3, 4, 0, pageNum]
        if (index === pageNum - 2) return [1, 0, pageNum - 3, pageNum - 2, pageNum - 1, pageNum]
        return [1, 0, index - 1, index, index + 1, 0, pageNum]
      }
    },
    methods: {
      pageOffset (i) {
        if (i === 0 || i === this.currentPage) return
        this.$store.commit('GO_PAGE', (i - 1) * this.pageSize)
        this.somePage = this.currentPage
        this.$emit('getnewpage', this.currentPage)
      },
      goPrePage () {
        this.$store.commit('PRE_PAGE', this.pageSize)
        this.somePage = this.currentPage
        this.$emit('getnewpage', this.currentPage)
      },
      goNextPage () {
        this.$store.commit('NEXT_PAGE', this.pageSize)
        this.somePage = this.currentPage
        this.$emit('getnewpage', this.currentPage)
      },
      goSomePage () {
        if (this.somePage !== 'NAN' && this.somePage > 0 && this.somePage <= this.totalPage) {
          this.pageOffset(this.somePage)
        } else {
          this.inputError = true
          setTimeout(() => {
            this.inputError = false
          }, 1000)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.blankError{border-color:#ff5e5e!important;box-shadow:0 0 5px 0 #ff5e5e!important;}
.page-wrap{font-size:12px;margin-top:20px;text-align:right;
  & > ul{display:inline-block;overflow:hidden;list-style:none;vertical-align:middle;
    li{float:left;margin:0 5px;padding:6px 11px;user-select:none;color:#666;border:1px solid #ddd;border-radius:2px;}
    a{color:#999;}
  }
  .pointer{cursor:pointer;}
  .hover{&:hover{a{color:#30a4ff;}
    }
  }
  .li-page{line-height:1.5;padding:6px 11px;cursor:pointer;color:#999;border:1px solid #ddd;border-radius:2px;
    &:hover{color:#30a4ff;}
  }
  .active{border-color:#30a4ff;background:#30a4ff;
    a{color:#fff;}
  }
  .skipTo{display:inline-block;margin-left:20px;vertical-align:middle;color:#999;
    input[type='text']{line-height:28px;width:50px;height:28px;margin:0 10px;padding:10px;border:1px solid #ddd;}
    span{line-height:28px;display:inline-block;width:32px;height:28px;cursor:pointer;text-align:center;border:1px solid #ddd;border-radius:2px;background:#fafafa;}
  }
}
</style>
