;(function(){

	var datas={
		img:[
			'sources/p00.jpg',
			'sources/p01.jpg',
			'sources/p02.jpg',
			'sources/p03.jpg',
			'sources/p04.jpg',
			'sources/btns.png',
			'sources/popupbox.jpg'
		],
		css:[],
		js:[]
	};
	mymodule.loading.init();
	resourceLoader.add(datas);


	var imgsloaded=0,//所有文件已load的数量
		all=datas.img.length+datas.css.length+datas.js.length;//所有文件的数量

	resourceLoader.load({
		thread:3,
		onload:function(isloaded,src){
			if (isloaded){
				imgsloaded++
			}
			if(imgsloaded==all){
				sectionLoadImg();
				mymodule.loading.hide();
			}
			if (src===datas['img'][0]) {
				init();
			};

		}
	});

	// 设置section背景图
	function sectionLoadImg(min,max){
		min=min||0;
		max=max||1000;
		ev.forEach(ev.getAll('.section'),function(item,i){
			if (i>=min&&i<max) {
				var source=item.getAttribute('source');
				if (source) {
					item.style.backgroundImage='url('+source+')';
				};
			};
		});
	}

	function init(){

		mymodule.wx.init();

		mymodule['ggk'].init('sources/p00.jpg',function(canvas,ctx){

			sectionSwipe.init();


			var mapCity='广州市'
			mymodule['map'].init(mapCity);



			var _innerHTML='<img src="sources/popupbox.jpg" class="selector-head" alt="" />\
				<div class="selector-box">\
					<div class="selector-box-title">离你最近的贵州习酒门店</div>\
					<select name="" id="s-area"></select>\
					<select name="" id="s-store"></select>\
					<span class="btn-showmap">进入门店</span>\
				</div>';

			mymodule['popup'].add('box-selector','<div class="innerbox">'+_innerHTML+'</div>',function(e){

				insertOption(ev.get('#s-area'),addrs);
				insertOption(ev.get('#s-store'),addrs[0]['addrs']);

				ev.addEvent(ev.get('#s-area'),'change',function(){
					insertOption(ev.get('#s-store'),addrs[this.value]['addrs']);
				});
				ev.addEvent(ev.get('.btn-showmap'),'click',function(){
					var _area=ev.get('#s-area').value;
					var _addr=ev.get('#s-store').value;

					mymodule['popup'].hide('box-selector');

					var __title=addrs[_area]['addrs'][_addr]['name'];
					var __addr=ADDR+addrs[_area]['area']+addrs[_area]['addrs'][_addr]['addr'];
					var __html='<p style="font-size:16px;color:#999;">'+__title+'</p><p style="font-size:14px;line-height:1.8;">'+__addr+'</p>';


					mymodule['map'].show();
					mymodule['map'].setGeo(__addr,__html,mapCity);
					mymodule['map'].setTitle(__title);
				});
			});

			ev.addEvent(ev.get('.btn-goto'),'click',function(){
				mymodule['popup'].show('box-selector');
			});


			function insertOption(select,addrs){
				var options=[];
				ev.forEach(addrs,function(item,i){
					options.push('<option value="'+i+'">'+(item.area||item.addr)+'</option>');
				});
				select.innerHTML=options.join('');
			}



		});
	}


	var ADDR='广东省广州市';
	var addrs=[
		{area:'海珠区',addrs:[
			{name:'五手商行',addr:'新港中路395号'},
			{name:'荣盛酒业',addr:'新港中路485号'},
			{name:'金液酒业',addr:'新港中路487号'},
			{name:'利燃贸易商行',addr:'新港中路344号1栋首层'}/*,
			{name:'广东金叶革新店',addr:'革新路129号103铺'},
			{name:'广东金叶礼岗店',addr:'礼岗路10号'},
			{name:'业创商行',addr:'南泰路168号'},
			{name:'嘉顺烟酒',addr:'南泰批发市场63档'},
			{name:'潮涌烟酒',addr:'南泰批发市场168号103档'},
			{name:'鸿泰商行',addr:'南泰批发市场N5/N7档'},
			{name:'新兴烟酒',addr:'南泰批发市场E60档'},
			{name:'鉴峰酒业',addr:'江燕路38号'},
			{name:'铭喜商行',addr:'西基东50号'},
			{name:'恒众贸易行',addr:'南泰批发市场344号'},
			{name:'玖隆贸易行',addr:'南泰路168号'},
			{name:'佳豪酒行',addr:'礼岗路17号'},
			{name:'百顺商场',addr:'礼岗路8-7'},
			{name:'周诚商行',addr:'金恒北街20号'},
			{name:'华信烟酒',addr:'金恒北街8号'}*/
		]},
		{area:'番禺区',addrs:[
			{name:'酒捡酒业连锁桥南店',addr:'桥南江景大道59号'},
			{name:'双超酒庄',addr:'大龙街城区大道132号'},
			{name:'珑品烟茶酒行',addr:'南村兴南大道902号'},
			{name:'海丽航贸易商行',addr:'南村镇兴南大道147号'},
			{name:'龙腾酒业',addr:'大石朝阳东路415号'},
			{name:'金骅墉贸易',addr:'大石大发大厦201'},
			{name:'兆美嘉酒行',addr:'桥南街德福路23号'},
			{name:'和威酒庄',addr:'市桥捷进西路168号'}
		]}
	]



})();



