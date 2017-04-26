/* pulic.js 
 * Origin author xzhang & Licence to youku
 * Create 2017-04-10 & Update 2017-04-10(xzhang)
 */
//dom操作
$(function(){
	let $switch = $(".s-w-l ul li");
	let $detail = $(".tabOfdetail .tablist");
	$switch.on('click',function(e){
		switchtab({
			_this:$(this),
			activeClass:'active',
			sibEle:'li',
			tabClassA:'tabofbill',
			idOfeleA:'#statuOfbill,#resOfbill',
			idOfeleB:'#statuOfcheck,#resOfcheck'
		});
	});
	$detail.on('click',function(e){
		switchtab({
			_this:$(this),
			activeClass:'active',
			sibEle:'.tablist',
			tabClassA:'tab_first',
			idOfeleA:'#d-of-ch',
			idOfeleB:'#d-of-unch'
		});
	});
	// 下拉列表 selectPicker
	$(".selectPicker")
	.on('click','.defaultVal',function(e) {
		e.stopPropagation();
		if(!$(this).hasClass('hashow')){
			$(this).addClass('hashow').siblings('ul').slideDown('fast');
		}else{
			$(this).removeClass('hashow').siblings('ul').slideUp('fast');
		}
	})
	.on('click', 'ul li', function(e) {
		let vals = $(this).html();
		$(".defaultVal").removeClass('hashow').html(vals);
		$(this).parent('ul').slideUp('fast');
	});
	//document event
	$(document).on('click',function(e){
		// console.log(e.target.nodeName);
		if($('.selectPicker .defaultVal').hasClass('hashow') && e.target.nodeName != 'LI' && e.target.nodeName != 'UL'){$('.selectPicker .defaultVal').trigger('click');}
	})
}); 
let switchtab = function(obj){
	if(typeof(obj)!='object')return;
	obj._this.addClass(obj.activeClass).siblings(obj.sibEle).removeClass(obj.activeClass);
	if(obj._this.hasClass(obj.tabClassA)){
		$(obj.idOfeleA).show().siblings(obj.idOfeleB).hide();
	}else{
		$(obj.idOfeleB).show().siblings(obj.idOfeleA).hide();
	}
}


// 弹窗


// 数据接口请求
