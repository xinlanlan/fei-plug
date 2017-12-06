(function() {
	/*
	 * 用于记录日期，显示的时候，根据dateObj中的日期的年月显示
	 */
	var dateObj = (function() {
		var _date = new Date(); // 默认为当前系统时间
		return {
			getDate: function() {
				return _date;
			},
			setDate: function(date) {
				_date = date;
			}
		};
	})();
	var MonthLen = new Date().getMonth()+1;

	// 设置calendar div中的html部分
	renderHtml();
	
	//设置那几个月份的渲染到页面
	function renderMonth(a){
		var date = new Date();
	    dateObj.setDate(new Date(date.getFullYear(), date.getMonth() - a, 1));
	}
	
	for(var i = MonthLen;i > 0;i--){
		renderMonth(i-1);
		showCalendarData(MonthLen - i);
	};

	/*
	 * 渲染html结构
	 */
	function renderHtml(){
		var calendar = document.getElementById('calendar');
		var titleBox = document.createElement("div");  // 标题，显示周几周几
		var calendarBody = document.createElement("div");  // 表格区 显示数据
		
		//设置标题
		titleBox.className = 'title-box';
		titleBox.innerHTML = '<span class="week">日</span>'+
					'<span class="week">一</span>'+
					'<span class="week">二</span>'+
					'<span class="week">三</span>'+
					'<span class="week">四</span>'+
					'<span class="week">五</span>'+
					'<span class="week">六</span>';
		calendar.appendChild(titleBox);
		
		//设置主体及主体内的表格
		calendarBody.className = 'calendar-body';
		
		// 一个月最多31天，所以一个月最多占6行表格
		var _tableHtml = "";
	    for(var i = 0; i < 6; i++) {  
	      _tableHtml += '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	    }
	    for(var j = 0;j < MonthLen;j ++){
			calendarBody.innerHTML += '<div class="body-item">'+
			'<h1 id="calendar-item-header'+j+'"></h1>'+
			'<table data-table="'+j+'" cellpadding="0" cellspacing="0" id="calendarTable'+j+'">'+_tableHtml+'</table>'+
			'</div>';
		}
		//calendarBody.innerHTML = '<div class="body-item"><h1 id="calendar-item-header"></h1><table id="calendarTable">'+_tableHtml+'</table></div>';
		calendar.appendChild(calendarBody);
	};
	
	/**
   * 表格中显示数据，并设置类名
   */
  function showCalendarData(indexs) {
    var _year = dateObj.getDate().getFullYear();
    var _month = dateObj.getDate().getMonth() + 1;
    var _dateStr = getDateStr(dateObj.getDate());

    // 设置顶部标题栏中的 年、月信息
    var calendarItemHeader = document.getElementById("calendar-item-header"+indexs);
    var titleStr = _dateStr.substr(0, 4) + "年" + _dateStr.substr(4,2) + "月";
    calendarItemHeader.innerText = titleStr;

    // 设置表格中的日期数据
    var _table = document.getElementById("calendarTable"+indexs);
    var _tds = _table.getElementsByTagName("td");
    var _firstDay = new Date(_year, _month - 1, 1);  // 当前月第一天
    for(var i = 0; i < _tds.length; i++) {
      var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
      var _thisDayStr = getDateStr(_thisDay);
      _tds[i].innerText = _thisDay.getDate();
      var dataMill = getDateMill(_thisDay);
      //_tds[i].data = _thisDayStr;
      _tds[i].setAttribute('data-mill', dataMill);
      _tds[i].setAttribute('data-num', i+1);
      if(_thisDayStr == getDateStr(new Date())) {    // 当前天
        _tds[i].className = 'currentDay';
      }else if(_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
        _tds[i].className = 'currentMonth';  // 当前月
      }else {    // 其他月
        _tds[i].className = 'otherMonth';
        _tds[i].innerText = '';
      }
    }
  }
  
  /**
   * 日期转化为字符串， 4位年+2位月
   */
  function getDateStr(date) {
    var _year = date.getFullYear();
    var _month = date.getMonth() + 1;    // 月从0开始计数
    var _d = date.getDate();
    
    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
    return _year + _month + _d;
  }
  
	function getDateMill(date){
  	var times = date.getTime();
  	return times;
  }

})();