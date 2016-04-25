;(function(){
	var drag=(function(){
		var fn={};

		//fn.imgsoloEnd 图片滑动结束之后
		//fn.sectionEnd 页面滑动结束之后

		return {
			started:false,
			transiting:false,
			pointX:[],
			pointY:[],
			doFn:function(type,obj){
				if (fn[type]&&fn[type].length) {
					ev.forEach(fn[type],function(item,i){
						typeof(item)=='function'&&item.call(obj||drag);
					});
				};
			},
			addFn:function(type,_fn){
				if(!fn[type]){
					fn[type]=[];
				}
				if(typeof(_fn)=='function'&&fn[type].indexOf(_fn)<0){
					fn[type].push(_fn);
				}
			},
			removeFn:function(type,fn){
				if(!fn[type]||typeof(fn)!='function'){
					return
				}
				var index=fn[type].indexOf(fn);
				while(index>=0){
					fn[type].splice(index,1);
					index=fn[type].indexOf(fn);
				}
			},
			getNext:function(obj,isPrev){
				var next=obj[isPrev?'previousElementSibling':'nextElementSibling'];
				if (!next) {
					next=isPrev?sections[sections.length-1]:sections[0]
				};
				return next;
			},
			isUp:function(){
				var r=true;
				var py=this['pointY'];
				if (py[py.length-1]-py[0]>=0) {
					r=false
				};
				return r;
			},
			curIsFirst:function(){return sections[0].className.indexOf('cur')>=0},
			curIsLast:function(){return sections[sections.length-1].className.indexOf('cur')>=0},
			translateY:function(obj,x){
				obj.style[ev.vendor+'Transform']=obj._translate='translate3d(0,'+x+'px,0)';
			},
			translateX:function(obj,x){
				obj.style[ev.vendor+'Transform']=obj._translate='translate3d('+x+'px,0,0)';
			},
			// touchend的时候
			imgsoloEnd:function(){

				var px=drag['pointX'];
				drag['imgsoloDuration'](0.3);
				var fn=function(){};
				var _li=drag.imgsolo.querySelector('li');
				if (Math.abs(px[px.length-1]-px[0])>20) {
					fn=function(){
						_li.style.cssText='';
						_li.querySelector('img').style.cssText='';
						drag.imgsolo.querySelector('ul').appendChild(_li);
					}
					var x=window.innerWidth
					if (px[px.length-1]-px[0]<0) {
						x=-window.innerWidth;
					};
					_li.style.opacity=0;
					drag.translateX(_li,x);
				}else{
					_li.querySelector('img').style.cssText='';
					drag.translateX(_li,0);
				};

				var imgIndex=parseInt(_li.getAttribute('imgIndex'));
				var discUl=drag.imgsolo.nextElementSibling;
				if (discUl) {
					var disc=discUl.querySelectorAll('li');
					ev.forEach(disc,function(item,i){
						if (i==imgIndex+1) {
							item.className="cur";
						}else{
							item.className="";
						};
					});
				};
				setTimeout(function(){fn();drag['doFn']('imgsoloEnd',drag.imgsolo);drag.transiting=false;},300);
			},
			// touchmove
			imgsoloTransform:function(){

				var px=drag['pointX'];

				var _li=drag.imgsolo.querySelector('li');
				var _py=px[px.length-1]-px[0];
				var _x=1-Math.abs(_py)/window.innerHeight;
				_li.style[ev.vendor+'Transform']='translate3d('+_py+'px,0,0) scale('+(_x<0.9?0.9:_x)+')';
				_li.querySelector('img').style.opacity=_x;

				// drag.translateX(_li,_py);
			},
			imgsoloDuration:function(t){
				drag.imgsolo.querySelector('li').style[ev.vendor+'Transition']=t+'s';
			},
			sectionDuration:function(t){
				var cur=ev.get('.section.cur');
				var next=drag.getNext(cur);
				var prev=drag.getNext(cur,true);
				cur.style[ev.vendor+'Transition']=t+'s';
				next.style[ev.vendor+'Transition']=t+'s';
				prev.style[ev.vendor+'Transition']=t+'s';
			},
			sectionScale:function(obj,x){
				var _x=x;
				if (x<0) {_x=-x};
				var _x=1-_x/window.innerHeight;
				obj.style[ev.vendor+'Transform']=obj._translate+' scale('+_x+')';
			},
			slideY:function(x,isEnd){
				var cur=ev.get('.section.cur');
				if (drag['dir']=='y') {
					var next=drag.getNext(cur);
					var prev=drag.getNext(cur,true);
					var winH=window.innerHeight;

					if ((!drag.isUp()&&drag.curIsFirst())||(drag.isUp()&&drag.curIsLast())) {
						//当在第一个向下滑的时候
						drag.reset();
						next.classList.remove('next');
						prev.classList.remove('next');
					}else{
						next.classList.add('next');
						prev.classList.add('next');

						if (isEnd) {
							if (drag.isUp()) {
								drag.translateY(next,0);
							}else{
								drag.translateY(prev,0);
							};
						}else{
							drag.translateY(next,-x+winH);
							drag.translateY(prev,(-winH-x));
						};
						next.style['opacity']=prev.style['opacity']=1;
						cur.style['opacity']=1-Math.abs(x)/window.innerHeight;
						drag.sectionScale(cur,x/2);
					};
				};
			},
			sectionEnded:function(){

				var cur=ev.get('.section.cur');
				var next=drag.getNext(cur);
				if(drag.isUp()){
					next=drag.getNext(cur);
				}else{
					next=drag.getNext(cur,true);
				}
				drag['sectionDuration'](0);
				if(drag['goToNext']){
					var curs=ev.getAll('.section.cur');
					ev.forEach(curs,function(item,i){
						item.classList.remove('cur');
					});
					next.classList.add('cur');
				}
				var nexts=ev.getAll('.section.next');
				ev.forEach(nexts,function(item,i){
					item.classList.remove('next');
				});

				//当滚到最后一个的时候，隐藏箭头
				var arrow=ev.get('#global-arrow');
				if (drag.curIsLast()) {
					arrow.className='global-arrow-top';
				}else{
					arrow.className='global-arrow-btm';
				};
				// 回调
				drag.doFn('sectionEnd');

			},
			reset:function(){
				var cur=ev.get('.section.cur');
				var next=drag.getNext(cur);
				var prev=drag.getNext(cur,true);
				cur.style['opacity']=next.style['opacity']=prev.style['opacity']=1;
				drag.translateY(cur,0);
				drag.translateY(next,window.innerHeight);
				drag.translateY(prev,-window.innerHeight);
			},
			setIndex:function(){
				ev.forEach(ev.getAll('.block-imgsolo'),function(_imgsolo,i){
					ev.forEach(_imgsolo.querySelectorAll('li'),function(item,i){
						item.setAttribute('imgIndex',i)
					});
				});
			},
			init:function(){
				//重置所有section的位置
				ev.forEach(sections,function(item,i){
					var h=i==0?0:window.innerHeight;
					drag.translateY(item,h);
					item.setAttribute('sectionIndex',i);
				});

				drag.translateY(sections[0],0);
				sections[0].classList.add("cur");
				drag.setIndex();
				event_bind();
				ev.get('#global-arrow').classList.add('global-arrow-btm');
			}
		}
	})();

	var wrap=ev.get('#wrap');
	// 获取全部section
	var sections=ev.getAll('.section');

	// 绑定事件
	function event_bind(){

		ev.addEvent(wrap,ev['start'],function(e){
			if (drag.transiting) {return};
			drag.imgsolo=ev.closest(e.target,'block-imgsolo');
			drag.imgsoloStart=drag.imgsolo?true:false;

			var nexts=ev.getAll('.section.next');
			ev.forEach(nexts,function(item,i){
				item.classList.remove('next');
			});

			drag.started=true;
			drag.stop=false;
			var _e = ev.isTouch ? e.touches[0] : e;
			drag['pointX']=[_e["pageX"]];
			drag['pointY']=[_e["pageY"]];
			if (!drag.imgsoloStart) {
				drag['sectionDuration'](0);
			}else{
				drag['imgsoloDuration'](0);
			};
		});
		ev.addEvent(document,ev['move'],function(e){
			if (drag.started) {
				var _e = ev.isTouch ? e.touches[0] : e;
				var px=drag['pointX'];
				var py=drag['pointY'];
				var x=px[px.length]=_e["pageX"];
				var y=py[py.length]=_e["pageY"];

				if (drag.imgsoloStart&&Math.abs(px[0]-px[1]) >= Math.abs(py[0]-py[1])) {
					drag.imgsoloTransform();
				}else{
					drag['dir']='y';
					drag.stop=(!drag.isUp()&&drag.curIsFirst())||(drag.isUp()&&drag.curIsLast());
					if (drag['dir']=='y') {
						drag['slideY'](py[0]-py[py.length-1]);
					};
				};
				e.preventDefault();
			};
		});
		ev.addEvent(document,ev['end'],function(e){
			
			var px=drag['pointX'];
			var py=drag['pointY'];
			// px.length始终跟py.length相等
			if (drag.started&&px.length>2) {
				drag.transiting=true;

				if (drag.imgsoloStart&&Math.abs(px[0]-px[1]) >= Math.abs(py[0]-py[1])) {
					// 图片浏览
					drag.imgsoloEnd();

				}else{

					setTimeout(function(){drag['sectionEnded']();drag['doFn']('sectionEnd');drag.transiting=false;},300);
					drag['sectionDuration'](0.3);

					var y=window.innerHeight;
					var goToNext=drag['goToNext']=!drag.stop&&Math.abs(py[py.length-1]-py[0])>=y/4;
					if (goToNext) {
						y=drag.isUp()?y:-y;
						drag['slideY'](y,true);
					}else{
						drag['reset']();
					};
				};


				e.preventDefault();
			};
			drag.imgsoloStart=undefined;
			drag.started=false;
		});
	}

	window.sectionSwipe=drag;


})();