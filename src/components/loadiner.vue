<template>
  <div class="loadMaskfix">
    <div class="loadMaskbg">
        <div class="sk-fading-circle">
          <div class="sk-circle1 sk-circle"></div>
          <div class="sk-circle2 sk-circle"></div>
          <div class="sk-circle3 sk-circle"></div>
          <div class="sk-circle4 sk-circle"></div>
          <div class="sk-circle5 sk-circle"></div>
          <div class="sk-circle6 sk-circle"></div>
          <div class="sk-circle7 sk-circle"></div>
          <div class="sk-circle8 sk-circle"></div>
          <div class="sk-circle9 sk-circle"></div>
          <div class="sk-circle10 sk-circle"></div>
          <div class="sk-circle11 sk-circle"></div>
          <div class="sk-circle12 sk-circle"></div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      msg: 'dasdas'
    }
  }
}
</script>
<style lang="less" scoped>
.loadMaskfix{position:absolute;z-index:999;top:0;left:0;width:100%;height:100%;
  .loadMaskbg{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.1);}
}
.sk-fading-circle{position:absolute;top:50%;left:50%;width:30px;height:50px;margin-top:-25px;margin-left:-15px;}
.sk-fading-circle .sk-circle{position:absolute;top:0;left:0;width:100%;height:100%;}
.sk-fading-circle .sk-circle:before{display:block;width:15%;height:15%;margin:0 auto;content:'';-webkit-animation:sk-circleFadeDelay 1.2s infinite ease-in-out both;animation:sk-circleFadeDelay 1.2s infinite ease-in-out both;border-radius:100%;background-color:#333;}
.sk-fading-circle .sk-circle2{-webkit-transform:rotate(30deg);-ms-transform:rotate(30deg);transform:rotate(30deg);}
.sk-fading-circle .sk-circle3{-webkit-transform:rotate(60deg);-ms-transform:rotate(60deg);transform:rotate(60deg);}
.sk-fading-circle .sk-circle4{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg);}
.sk-fading-circle .sk-circle5{-webkit-transform:rotate(120deg);-ms-transform:rotate(120deg);transform:rotate(120deg);}
.sk-fading-circle .sk-circle6{-webkit-transform:rotate(150deg);-ms-transform:rotate(150deg);transform:rotate(150deg);}
.sk-fading-circle .sk-circle7{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg);}
.sk-fading-circle .sk-circle8{-webkit-transform:rotate(210deg);-ms-transform:rotate(210deg);transform:rotate(210deg);}
.sk-fading-circle .sk-circle9{-webkit-transform:rotate(240deg);-ms-transform:rotate(240deg);transform:rotate(240deg);}
.sk-fading-circle .sk-circle10{-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg);}
.sk-fading-circle .sk-circle11{-webkit-transform:rotate(300deg);-ms-transform:rotate(300deg);transform:rotate(300deg);}
.sk-fading-circle .sk-circle12{-webkit-transform:rotate(330deg);-ms-transform:rotate(330deg);transform:rotate(330deg);}
.sk-fading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s;}
.sk-fading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s;}
.sk-fading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s;}
.sk-fading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s;}
.sk-fading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s;}
.sk-fading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s;}
.sk-fading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s;}
.sk-fading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s;}
.sk-fading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s;}
.sk-fading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s;}
.sk-fading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s;}
@-webkit-keyframes sk-circleFadeDelay{
  0%,39%,100%{opacity:0;}
  40%{opacity:1;}
}
@keyframes sk-circleFadeDelay{
  0%,39%,100%{opacity:0;}
  40%{opacity:1;}
}
</style>

