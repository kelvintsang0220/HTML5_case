;(function($){
    var dayNum = 0;
    
    var wrap = $("#calendar");
    var Calendar = function (options){
    		this.options = options;
    		
    		if (this.options) {
    			this.oDate = new Date(this.options[0].time);
    			this.oYear = this.oDate.getFullYear();
		    this.oMonth = this.oDate.getMonth() + 1;
		    this.oDay = this.oDate.getDate(); // 当天
		    this.oWeek = this.oDate.getDay(); 
    		} else{
    			this.oDate = new Date();
    			this.oYear = this.oDate.getFullYear();
		    this.oMonth = this.oDate.getMonth() + 1;
		    this.oDay = this.oDate.getDate(); // 当天
		    this.oWeek = this.oDate.getDay(); 
    		}

    		this.init();
    };
    
    Calendar.prototype = {
    		init:function(){
     		this.render();
     		this.showDate(this.oYear,this.oMonth);//初始化日期
     	},
     	render:function (){
    			var header = '<div class="hd"><div class="tc"><span id="start"></span>—<span id="end"></span></div> </div>';
    			var body = '<table cellpadding="0" cellspacing="0"><thead><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></thead><tbody></tbody></table>';
    			wrap.append(header);
    			wrap.append(body);
    			
    			$("#start").text(this.oMonth+ '月' + this.oDay + '日');
    			$("#end").text( ( (this.oMonth+1)>12 ? 1:(this.oMonth+1) )  + '月' + this.oDay + '日');
    			
//		    // 生成td
	        var oTbody = wrap.find("tbody");
	        for (var i = 0; i < 6; i++) {
	            var oTr = document.createElement('tr');
	            for (var j = 0; j < 7; j++) {
	                var oTd = document.createElement('td');
	                $(oTr).append(oTd);
	            }
	            $(oTbody).append(oTr);
	        }
	        wrap.find("table").append(oTbody);
     	},
     	_getDate:function (_month){
    			var days = 0;
			if (_month == 1 || _month == 3 || _month == 5 || _month == 7 || _month == 8 || _month == 10 || _month == 12) {
		        days = 31;
		    }
		    else if (_month == 4 || _month == 6 || _month == 9 || _month == 11) {
		        days = 30;
		    }
		    else if (_month == 2 && this.isLeapYear(this.oYear)) {
		        days = 29;
		    }
		    else {
		        days = 28;
		    }
		    return days;
    		},
    		//插入日期
		showDate:function (year, month) {
			var aTd = wrap.find('td');
			$(aTd).text('');
			$(aTd).removeClass("current");
			this.oDate.setFullYear(year);
			this.oDate.setMonth(month-1);
			switch (this.oDate.getDay()) {
				case 0:
					this.selectDays(0,aTd);
	                break;
	            case 1:
	            		this.selectDays(1,aTd);
	                break;
	            case 2:
	            		this.selectDays(2,aTd);
	                break;
	            case 3:
	            		this.selectDays(3,aTd);
	                break;
	            case 4:
	            		this.selectDays(4,aTd);
	                break;
	            case 5:
	            		this.selectDays(5,aTd);
	                break;
	            case 6:
					this.selectDays(6,aTd);
	                break;
			}
		},
		//插入日期
		selectDays:function (number,aTd){
			var endDay = this._getDate(this.oMonth); //获得总天数
			var len = (endDay - this.oDay); // 当月中距离最后一天相差多少天
			var nextSameDate = new Date(this.oYear, this.oMonth, this.oDay); //获取下个月的同一天
			var days = Math.ceil(( nextSameDate.getTime() - this.oDate.getTime() )/1000/60/60/24 ); //计算距离下月同一天相差的时间
			
			for (var i = 0; i <= days; i++) {
				if ( this.oDay+i <=  endDay) { //当月剩余的天数
					$(aTd).eq(i + number).text(this.oDay+i).attr({
						'data-month':this.oMonth,
						'data-day':this.oDay+i
					});
				} else{ // 下月
					$(aTd).eq(i + number).text(i-len).attr({
						'data-month':(this.oMonth+1)>12 ? 1:(this.oMonth+1),
						'data-day':i-len
					});
				}
				$(aTd).eq(i + number).addClass('enable');
	        }
			
			this.pastDays(number,$(aTd));

		},
		pastDays:function(number,aTd){ // 获取今天的前N天
			var lastDay = this._getDate( this.oMonth == 1 ? 12 : (this.oMonth-1) ); //获取上月最后一天
			if( number > 0 ){
				if (this.oDay == 1) {
					// 拿上个月的后N天
					for( var i = number ; i > 0 ; i--){
						aTd.eq(number-i).text(lastDay-i+1).addClass('past');
					}
				} else if( number <  this.oDay){
					var arr = [];
					for( var i = number ; i > 0 ; i--){
						aTd.eq(number-i).text(this.oDay-i).attr({
							'data-month':this.oMonth,
							'data-day':this.oDay-i
						}).addClass('past');
					}
				} else if ( number > this.oDay ) {
					var arr = [];
					for( var i = number ; i > 0 ; i--){
						if (this.oDay-i>0) {
							aTd.eq(number-i).text(this.oDay-i).addClass('past');
						} else{
							aTd.eq(number-i).text(lastDay - (Math.abs(this.oDay-i))).addClass('past');
						}
						
					}
				}
				
			}
		},
		
		//判断是否润年  
       	isLeapYear:function (year) {
            if (year % 4 == 0 && year % 100 != 0) {
                return true;
            }
            else {
                if (year % 400 == 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    };
     	
		
		
        
         //下一月
//	    $(".next-mon").on("click", function() {
//	    		++oMonth;
//	    		if (oMonth > 12) {
//	    			oMonth = 1;
//	    			++oYear;
//	    			$("#year").text(oYear);
//	    		}
//	    		$("#month").text(oMonth);
//	    		showDate(oYear, oMonth);
//	    });
     	
     $.fn.clndr = function(json){
     	  var clndrInstance = new Calendar(json);
     }

})(Zepto);