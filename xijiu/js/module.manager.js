;(function(){
	// 某一些公用事件
	var ev=(function(){
		var isTouch=('ontouchstart' in window);
		var vendor=(/webkit/i).test(navigator.appVersion) ? 'webkit' :
				(/firefox/i).test(navigator.userAgent) ? 'Moz' :
				(/trident/i).test(navigator.userAgent) ? 'ms' :
				'opera' in window ? 'O' : '';
		return {
			isTouch:isTouch,
			start:(isTouch?'touchstart':'mousedown'),
			move:(isTouch?'touchmove':'mousemove'),
			end:(isTouch?'touchend':'mouseup'),
			vendor:vendor,
			get:function(id){return document.querySelector(id);},
			getAll:function(id){return document.querySelectorAll(id);},
			removeEvent:function(obj,event,fn){
				obj&&obj.removeEventListener(event,fn,false);
			},
			addEvent:function(obj,event,fn){
				obj&&obj.addEventListener(event,fn,false);
			},
			forEach:function(arr,fn){
				if (!arr.length||typeof(fn)!=='function') {return};
				for (var i = 0; i < arr.length; i++) {
					fn(arr[i],i);
				};
			},
			closest:function(obj,classname){
				while(obj&&!obj.classList.contains(classname)){
					obj=obj.parentElement;
					if (obj===document.body) {obj=undefined};
				}
				return obj;
			}
		}
	})();
	// 各种功能模块：刮刮卡，地图，视频
	var module={};

	// 刮刮卡
	module.ggk=(function(){

		var canvas = undefined,
			ctx = undefined,
			_ctx = undefined,
			tips=undefined,
			img = new Image(),
			run = false,
			ended=false,
			_interval,fontColor,
			fn_end=function(){};

		var core = {
			w : 260,
			h : 150,
			drawing : false,
			curPoint : {
				x : 0,
				y : 0
			},
			lastPoint : {
				x : 0,
				y : 0
			}
		}
		function event_bind(){
			var is_touch = 'ontouchstart' in window;
			var event_start	= is_touch ? 'touchstart' : 'mousedown';
			var event_move = is_touch ? 'touchmove' : 'mousemove';
			var event_end = is_touch ? 'touchend' : 'mouseup';
			var showresult;
			canvas.addEventListener(event_start,function(e){
				e.preventDefault();
				is_touch && (e = e.touches[0]);
				core.drawing = true;
				var offset=canvas.getBoundingClientRect();
				core.lastPoint = {
					x: e.pageX*2 - offset.left,
					y: e.pageY*2 - offset.top
				};
				core.curPoint = core.lastPoint;
				if (!run) {
					run=true;
				};
			});

			canvas.addEventListener(event_move,function(e){
				e.preventDefault();
				is_touch && (e = e.touches[0]);
				
				var offset=canvas.getBoundingClientRect();
				var cx = e.pageX*2 - offset.left,
					cy = e.pageY*2 - offset.top;
				core.curPoint = {
					x : cx,
					y : cy
				};
				
			});
			//结束
			canvas.addEventListener(event_end,function(e){
				e.preventDefault();
				core.drawing = false;
				core.lastPoint = {
					x : 0,
					y : 0
				};
				var _data=ctx.getImageData(0,0,core.w,core.h).data;
				for(var i=0,j=0;i<_data.length;i+=4){
					if(_data[i+3]){
						j++;
					}
				}
				if(j<=core.w*core.h*0.75&&ended==false){
					ended=true
					fn_end(canvas,ctx);
				}
			});

			canvas.addEventListener('touchcancel',function(e){
				e.preventDefault();
				core.drawing = false;
				core.lastPoint = {
					x : 0,
					y : 0
				};
			});

			
		}
		function draw(){
			if(!core.drawing){ return;}

			var lp = core.lastPoint,
				cp = core.curPoint;
			
			ctx.save();
			ctx.lineWidth = 70;
			ctx.fillStyle = ctx.strokeStyle = '#000';
			ctx.lineCap = 'round';

			ctx.beginPath();
			if(lp.x && lp.x == cp.x && lp.y == cp.y){
				ctx.arc(cp.x,cp.y,ctx.lineWidth/2,0,Math.PI*2,true);
				ctx.fill();
			}else{
				ctx.moveTo(lp.x||cp.x, lp.y||cp.y);
				ctx.lineTo(cp.x, cp.y);
				ctx.stroke();
			}
			ctx.restore();

			core.lastPoint = {
				x: cp.x,
				y: cp.y
			};
		}

		img.addEventListener('load', function(e) {
			// ctx.drawImage(img,0,0,core.w,core.h);
			var w=window.innerWidth*2;
			var h=w/img.width*img.height;
			ctx.drawImage(img,0,0,w,h);
			setFontColor(fontColor)
		});

		function _createElement(){

			canvas=document.createElement('canvas');
			canvas.id="global-canvas";
			canvas.className="global-canvas";
			canvas.width=core.w=window.innerWidth*2;
			canvas.height=core.h=window.innerHeight*2;
			document.body.appendChild(canvas);
			ctx = canvas.getContext('2d');

		}
		function setFontColor(fontColor){

			var str="请用手指擦一擦",_GCO='destination-out';
			if (typeof(fontColor)==='string') {
				ctx.fillStyle=fontColor;
				_GCO='source-over';
			}
			ctx.font="bolder 50px Arial";

			ctx.globalCompositeOperation = _GCO;
			ctx.fillText(str,window.innerWidth-ctx.measureText(str).width/2,100);
			ctx.globalCompositeOperation = 'destination-out';
		}

		return {
			init:function(src,ending_fn,_fontColor){
				if (this.inited||!src) {return};
				this.inited=true;
				fontColor=_fontColor;
				_createElement();

				img.src=src;
				_interval=setInterval(draw, 0);
				event_bind();
				fn_end=function(canvas,ctx){
					canvas.classList.add('hide');
					setTimeout(function(){
						clearInterval(_interval)
						canvas.style.display="none";
					},400);
					typeof(ending_fn)=='function'&&ending_fn(canvas,ctx);
				};

				// setFontColor(fontColor);
			}
		}
	})();


	// 地图
	module.map=(function(){
		var map,Obj_map,Obj_title,city,fn={};

		function _createElement(){
			Obj_map=document.createElement('div');
			Obj_map.id="global-map";
			Obj_map.className="global-block global-map";
			Obj_map.innerHTML='<div id="allmap" class="allmap"></div>\
				<div class="map-topbar"><div class="btn-map-closer"></div><div id="map-title" class="map-title"></div></div>\
				';
			document.body.appendChild(Obj_map);
			Obj_title=ev.get('#map-title');
			Obj_title.setTitle=function(text){
				this.innerHTML=text;
			}
		}
		return {
			doFn:function(id){
				typeof(fn[id])=='function'&&fn[id](map,Obj_title);
				return this;
			},
			addFn:function(id,_fn){
				fn[id]=_fn;
				return this;
			},
			setTitle:function(text){
				if (Obj_title) {
					Obj_title.innerHTML=text;
				};
				return this;
			},
			setGeo:function(addr,infoWindowHTML,_city){
				if (typeof(addr)!=='string'||!this.inited) {return};

				// addr[必选]:目标地点详细地址
				// infoWindowHTML:弹出窗口的信息
				// 比如'<p style="font-size:16px;color:#999;">标题</p><p style="font-size:14px;line-height:1.8;">其他信息</p>';

				infoWindowHTML=infoWindowHTML||addr;
				_city=_city||city;

				var myGeo = new BMap.Geocoder();
				// 将地址解析结果显示在地图上,并调整地图视野
				myGeo.getPoint(addr,function(point){
					if (point) {
						map.clearOverlays();
						var maker=new BMap.Marker(point);
						map.centerAndZoom(point, 16);
						map.addOverlay(maker);
						var info = new BMap.InfoWindow(infoWindowHTML,{
							enableMessage:false
						});
						maker.openInfoWindow(info);
						maker.addEventListener("click", function(){this.openInfoWindow(info);});
					}
				}, _city);

			},
			hide:function(){
				Obj_map.classList.remove('show');
				return this;
			},
			show:function(){
				Obj_map.classList.add('show');
				return this;
			},
			init:function(_city){
				// 传入'市'：比如'广州市'
				var that=this;
				if (that.inited) {return};
				that.inited=true;
				city=_city||'广州市';

				_createElement();

				map=new BMap.Map('allmap');
				map.centerAndZoom(city, 14);
				map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));

				// btn-map 地图按钮
				ev.forEach(ev.getAll('.btn-map'),function(item,i){
					ev.addEvent(item,'click',function(){
						that.show();
						var source=item.getAttribute('source');
						if (source) {
							that.doFn(source)
						};
					});
				});
				ev.addEvent(ev.get('#global-map .btn-map-closer'),'click',function(){
					that.hide();
					Obj_title.innerHTML='';
				});
			}
		}

	})();



	// 视频video
	module.video=(function(){

		var videobox,video;

		function _createElement(){
			videobox=document.createElement('div');
			videobox.id="global-video";
			videobox.className="global-block global-video";
			videobox.innerHTML='<div class="btn-closer"></div><video controls></video>';
			document.body.appendChild(videobox);
			video=ev.get('#global-video video');
		}
		function setVideoRect(v,w,h){
			var _w=window.innerWidth;
			var _h=parseInt(_w*h/w);
			v.width=_w;
			v.height=_h;
			v.style.margin='-'+parseInt(_h/2)+'px 0 0 -'+_w/2+'px';
			v.style.opacity=1;
		}
		function setSrc(){
			videobox.classList.add('show');
			//source="xxx.mp4|width|height"
			var source=this.getAttribute('source').split('|');
			if(!source[1]||!source[2]){
				source[1]=320;
				source[2]=180;
			}
			if (video._src!=source[0]) {
				video.style.opacity=0;
				video.src=video._src=source[0];
				setVideoRect(video,source[1],source[2]);
			};
		}
		return {
			pause:function(){
				video.pause();
			},
			reset:function(){
				ev.forEach(ev.getAll('.btn-video'),function(item,i){
					ev.removeEvent(item,'click',setSrc);
					ev.addEvent(item,'click',setSrc);
				});
			},
			init:function(){
				if (this.inited) {return};
				this.inited=true;

				_createElement();

				ev.addEvent(video,'play',function(){
					// 视频播放的时候，音乐暂停
					if(module.audio.inited&&module.audio.isPlaying()){
						module.audio.pause();
					};
				});
				this.reset();

				ev.addEvent(ev.get('#global-video .btn-closer'),'click',function(){
					this.parentElement.classList.remove('show');
					video.pause();
				});

			}
		}
	})();

	// 音频 audio
	module.audio=(function(){
		var audiobox,audio;
		function _createElement(src){
			
			audiobox=document.createElement('div');

			audiobox.className="global-audio-box pause";
			audiobox.id="global-audio-box";
			audiobox.innerHTML='<div class="global-audio-box-inner"><div></div></div>';

			audio=document.createElement('audio');
			audio.id="global-audio";
			audio.style.display='none';
			audio.src=src;
			// audio.autoplay='autoplay';
			audio.loop='loop';
			audio.preload='auto';



			audiobox.appendChild(audio)
			document.body.appendChild(audiobox);

			audio=ev.get('#global-audio');

		}
		return {
			isPlaying:function(){
				return !audio.paused;
			},
			pause:function(){
				if (!this.isInited) {return};
				audio.pause();
				audiobox.classList.add('pause')
			},
			play:function(){
				if (!this.isInited) {return};
				audio.play();
			},
			changeSrc:function(src){
				if (!src||!this.isInited) {return};
				audio.src=src;
			},
			init:function(src){
				var that=this;
				if (!src||that.isInited) {return}
				that.isInited=true;

				_createElement(src);
				ev.addEvent(audiobox,'click',function(){
					if (that.isPlaying()) {
						that.pause()
					}else{
						that.play();
					};
				});
				ev.addEvent(audio,'play',function(){
					audiobox.classList.remove('pause');
				});
			}
		}
	})();


	// 微信
	module.wx=(function() {
		var data={},sharebox;
		function _createElement(){
			var html='<div class="box-share"></div>';
			sharebox=document.createElement('div');
			sharebox.className='box-share';

			document.body.appendChild(sharebox);
			ev.addEvent(sharebox,'click',function(){
				sharebox.classList.remove('show');
			});
		}

		function isWeiXin() {
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			} else {
				return false;
			}
		}
		return {
			iswx: isWeiXin,
			contactLink:'',
			setData:function(opt){
				opt=opt||{};
				data={
					'title': opt['title'] || document.title,
					'link': opt['link'] || location.href,
					'desc': opt['desc'] || document.title,
					'img_url': opt['img_url']||''
				}
				return this;
			},
			getData:function(){
				return data;
			},
			invoke: function(name, data) {
				if (!name || typeof(data) != 'object' || typeof WeixinJSBridge == 'undefined') {
					return false;
				};
				WeixinJSBridge.invoke(name, data);
			},
			shareMessage: function() {
				var data=this.getData();
				this.invoke('sendAppMessage', data);
			},
			share: function() {
				var data=this.getData();
				data.title=data.desc;
				this.invoke('shareTimeline', data);
			},
			/*shareWeibo: function() {
				WeixinJSBridge.invoke('shareWeibo',   {                 
					"content":'',
					"url":'',
				});
			},*/
			init:function(){
				var that=this;
				if (that.inited) {return};
				that.inited=true;

				_createElement();

				ev.forEach(ev.getAll('.btn-share'),function(item,i){
					ev.addEvent(item,'click',function(){
						sharebox.classList.add('show');
					});
				});

				that.setData();

				document.addEventListener('WeixinJSBridgeReady', function() {
					// 发送给好友
					WeixinJSBridge.on('menu:share:appmessage', function(argv) {
						that.shareMessage();
					});
					// 分享到朋友圈
					WeixinJSBridge.on('menu:share:timeline', function(argv) {
						that.share();
					});
					// 分享到微博
					// WeixinJSBridge.on('menu:share:weibo', function(argv){
					// 	that.shareWeibo();
					// });
				}, false);
			}
		}
	})();

	module.loading=(function(){
		var box;
		function _createElement(){
			box=document.createElement('div');
			box.id="loadingbox";
			box.className="loadingbox";
			document.body.appendChild(box);
		}

		return {
			hide:function(){
				if (!this.inited) {return};
				box.style.display='none';
			},
			show:function(){
				var that=this;
				if (!that.inited) {that.init();return};
				box.style.display='block';
			},
			init:function(){
				var that=this;
				if (that.inited) {return};
				that.inited=true;
				_createElement();
				that.show();
			}
		}
	})();

	//弹窗
	module.popup=(function(){
		var boxes={};
		function _createElement(id,html,fn){
			var box=document.createElement('div');
			box.id=id;
			box.className="popbox";
			box.style.display='none';
			box.innerHTML=html||'';//<div class="innerbox">有默认样式</div>
			document.body.appendChild(box);
			boxes[id]=box;
			ev.addEvent(box,'click',function(e){
				if (e.target===this) {
					this.style.display='none';
				};
			});
			if (typeof fn ==='function') {fn.call(box)};
			return box;
		}

		return {
			hide:function(id){
				if (id&&boxes[id]) {
					boxes[id].style.display='none';
				}else{
					ev.forEach(boxes,function(item,i){
						item.style.display='none';
					});
				};
			},
			show:function(id){
				if (id&&boxes[id]) {
					boxes[id].style.display='block';
				}
			},
			add:function(id,html,fn){
				if (boxes[id]) {console.log('box of '+id+' is Existed!');return};
				_createElement(id,html,fn);
			},
			bind:function(objId,html){
				var id='r_'+Math.random();
				var box=_createElement(id,html,function(){
					ev.addEvent(ev.get(objId),'click',function(e){
						box.style.display='block';
					});
				});
			}
		}
	})();







	window.ev=ev;
	window.mymodule=module;
})();