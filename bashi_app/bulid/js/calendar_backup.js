;(function($,obj){
	var Len = obj.length;
	if (obj.btn === 'order') {
		var SchDate = obj[0].time;
	} else{
		var SchDate = obj[0].SchDate;
	}
	var oDate = new Date(SchDate);
    var dayNum = 0;
    var oYear = oDate.getFullYear();
    var oMonth = oDate.getMonth() + 1;
    var oDay = oDate.getDate(); // 当天

    var currentYear = oDate.getFullYear();
    var currentMonth = oDate.getMonth() + 1;
    var currentDay = oDate.getDate();
    
    
    var bBtn = true;
    
    var wrap = $("#calendar");
    var Calendar = {
    		init:function(){
    			this.renderDOM();	
    		},
    		renderDOM:function(){
    			var header = '<div class="hd">	<div class="fl month">月</div><div class="fr select" id="select_all"><div class="fl">全选</div>	<div class="fl sel_icon"></div></div></div>';
    			var body = '<table cellpadding="0" cellspacing="0"><thead><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></thead><tbody></tbody></table>';
    			wrap.append(header);
    			wrap.append(body);
    			
			$(".month").text('车票');
    			
    			
    			//判断月份的天数
    			function _getDate(_month){
    				var days = 0;
    				if (_month == 1 || _month == 3 || _month == 5 || _month == 7 || _month == 8 || _month == 10 || _month == 12) {
			        days = 31;
			    }
			    else if (_month == 4 || _month == 6 || _month == 9 || _month == 11) {
			        days = 30;
			    }
			    else if (_month == 2 && isLeapYear(oYear)) {
			        days = 29;
			    }
			    else {
			        days = 28;
			    }
			    return days;
    			}
		    
		    var tdRow = Math.ceil(Len/7)+1;
		    // 生成td
		    for (var i = 0; i < tdRow; i++) {
		        var oTbody = wrap.find("tbody");
		        for (var i = 0; i < tdRow; i++) {
		            var oTr = document.createElement('tr');
		            for (var j = 0; j < 7; j++) {
		                var oTd = document.createElement('td');
		                $(oTr).append(oTd);
		            }
		            $(oTbody).append(oTr);
		        }
		        wrap.find("table").append(oTbody);
		    }
		    
		    //插入日期
			function showDate(year, month) {
				var aTd = wrap.find('td');
				$(aTd).text('');
				$(aTd).removeClass("current");
				oDate.setFullYear(year);
				oDate.setMonth(month-1);
//				oDate.setDate(1);
				dayNum = _getDate(oMonth); //获得当月天数
				switch (oDate.getDay()) {
					case 0:
						selectDays(0,aTd);
		                break;
		            case 1:
		            		selectDays(1,aTd);
		                break;
		            case 2:
		            		selectDays(2,aTd);
		                break;
		            case 3:
		            		selectDays(3,aTd);
		                break;
		            case 4:
		            		selectDays(4,aTd);
		                break;
		            case 5:
		            		selectDays(5,aTd);
		                break;
		            case 6:
						selectDays(6,aTd);
		                break;
				}
			}
			
			showDate(oDate.getFullYear(), oDate.getMonth()+1);//初始化日期
			
			
			//插入日期
			function selectDays(number,aTd){
				if (obj.btn === 'order') {
					for (var i = 0; i <Len; i++) {
						$(aTd).eq(i + number).text(oDay+i).addClass('enable').attr({
							'data-month':oMonth,
							'data-day':oDay+i,
						});
			        }
				}else{
					for (var i = 0; i <= tdRow*7; i++) {
						if ( oDay+i > dayNum ) { //去拿下个月的前n天
							var bs = Len - (dayNum - oDay+1);
							$(aTd).eq(i + number).text(i-(dayNum - oDay)).addClass('enable').attr({
								'data-month':oMonth+1,
								'data-day':i-(dayNum - oDay),
							});
							//下个月的第一天
							if (i-(dayNum - oDay) === 1) {
								$(aTd).eq((dayNum - oDay+1) + number).attr('first-day',true).html('<div class="day">'+(oMonth+1)+'月'+'1日'+'</div>');
							} 
						}else{
							$(aTd).eq(i + number).text(oDay+i).addClass('enable').attr({
								'data-month':oMonth,
								'data-day':oDay+i,
							});
						}
			        }
				}
				
			}
				
				
			//判断是否润年  
	       	function isLeapYear(year) {
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
	        
		    
    		},
    }
    Calendar.init();
})(Zepto,dataObj);