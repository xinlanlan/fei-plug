/*
 * fei-scroll.js
 * @author fiveStarsAndMoon
 */
(function(window) {
	'use strict';
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
	var CURRENYTIME = new Date(new Date().setHours(0,0,0,0));
	var ENDTIME = new Date();
	var ENDYEAR = ENDTIME.getFullYear();
	var ENDMONTH = ENDTIME.getMonth();
	var ENDDAY = ENDTIME.getDate();
	var STARTTIME = new Date(new Date().setMonth(0,1));
	var STARTYEAR = ENDYEAR;
	
	var MONTHLEN = ENDMONTH + 1;
	var feiCalendar = function(ele) {
		this.params.elements = ele;
	};
	feiCalendar.prototype = {
		params: {
			setStartTime: STARTTIME,
			setEndTime: ENDTIME,
			timeOutHide: 500
		},
		setOption: function(params, callback) {
			this.extend(this.params, params);
			this.setTimeParams();
			this.init(params, callback);
		},
		setTimeParams: function(){
			var self = this;
			ENDTIME = self.params.setEndTime;
			ENDYEAR = ENDTIME.getFullYear();
			ENDMONTH = ENDTIME.getMonth();
			ENDDAY = ENDTIME.getDate();
			STARTYEAR = self.params.setStartTime.getFullYear();
			var STARTMONTH = self.params.setStartTime.getMonth();
			MONTHLEN = (ENDYEAR - STARTYEAR)*12+ENDMONTH-STARTMONTH+1;
		},
		init: function(params, callback) {
			var self = this;
			self.renderHtml();
			if(self.params.elements) {
				self.open(self.params.elements);
			};
			self.selected(callback);
			self.close();
		},
		renderHtml: function() {
			var self = this;
			var calendar = document.createElement('div');
			var calendarTop = document.createElement('div');
			var calendarBody = document.createElement('div');

			//设置标题
			calendar.className = 'fei-calendar';
			calendarTop.className = 'calendar-top';
			calendarTop.innerHTML = '<header class="fei-header">' +
				'<a class="fei-back"></a>' +
				'<div class="fei-title">选择日期</div>' +
				'</header>' +
				'<div class="week-bar">' +
				'<span>日</span>' +
				'<span>一</span>' +
				'<span>二</span>' +
				'<span>三</span>' +
				'<span>四</span>' +
				'<span>五</span>' +
				'<span>六</span>' +
				'</div>';
			calendar.appendChild(calendarTop);

			//设置主体及主题的表格
			calendarBody.className = 'calendar-body';

			//一个月最多31天，所以最多占6行表格
			var _tableHtml = '';
			for(var i = 0; i < 6; i++) {
				_tableHtml += '<li class="table-line"><span class="item-day"></span><span class="item-day"></span><span class="item-day"></span><span class="item-day"></span><span class="item-day"></span><span class="item-day"></span><span class="item-day"></span></li>'
			};
			for(var j = 0; j < MONTHLEN; j++) {
				calendarBody.innerHTML += '<div class="body-item"><h1 class="body-item-header"></h1><ul class="calendar-table">' + _tableHtml + '</ul></div>'
			};
			document.body.appendChild(calendar);
			calendar.appendChild(calendarBody);
			var tableHeaderEle = document.querySelectorAll('.body-item-header');
			var tableEle = document.querySelectorAll('.calendar-table');
			self.renderMonth(tableHeaderEle, tableEle);
		},
		renderMonth: function(tableHeaderEle, tableEle) {
			var self = this;
			for(var i = MONTHLEN; i > 0; i--) {
				dateObj.setDate(new Date(ENDYEAR, ENDMONTH - (i - 1), 1));
				self.showCalendarData(tableHeaderEle[MONTHLEN - i], tableEle[MONTHLEN - i], MONTHLEN - i);
			};
		},
		showCalendarData: function(tableHeaderEle, tableEle, tableIndex) {
			var _year = dateObj.getDate().getFullYear();
			var _month = (dateObj.getDate().getMonth() + 1) > 9 ? (dateObj.getDate().getMonth() + 1) : ('0' + (dateObj.getDate().getMonth() + 1));

			// 设置顶部标题栏中的 年、月信息
			var bodyItemHeader = tableHeaderEle;
			var titleStr = _year + "年" + _month + "月";
			bodyItemHeader.innerText = titleStr;

			// 设置表格中的日期数据
			var _table = tableEle;
			var _span = _table.getElementsByTagName("span");
			var _firstDay = new Date(_year, _month - 1, 1); // 当前月第一天
			var _spanLen = _span.length;
			for(var i = 0; i < _spanLen; i++) {
				var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
				_span[i].innerText = _thisDay.getDate();
				_span[i].setAttribute('data-num', tableIndex * 42 + i)
				var dataMill = _thisDay.getTime();
				_span[i].setAttribute('data-mill', dataMill);
				//_span[i].setAttribute('data-num', i + 1);
				if(_thisDay.getTime() === CURRENYTIME.getTime() && _firstDay.getMonth() === CURRENYTIME.getMonth()) { // 当前天
					_span[i].classList.add('currentDay');
					_span[i].classList.add('currentMonth');
				} else if(_thisDay.getMonth() === _firstDay.getMonth()) {
					_span[i].classList.add('currentMonth'); // 当前月
				} else { // 其他月
					_span[i].classList.add('otherMonth');
					_span[i].innerText = '';
				};
			};
		},
		open: function(ele) {
			var len = ele.length;
			for(var i=0;i<len;i++){
				ele[i].ontouchend = function(){
					document.querySelector('.fei-calendar').classList.add('fei-calendar-active');
				};
			};
		},
		close: function() {
			document.querySelector('.fei-back').ontouchend = function() {
				document.querySelector('.fei-calendar').classList.remove('fei-calendar-active');
			};
		},
		selected: function(callback) {
			var self = this;
			var itemDay = document.querySelectorAll('.currentMonth');
			var len = itemDay.length;
			var calendarBox = document.querySelector('.fei-calendar');
			for(var i = 0; i < len; i++) {
				itemDay[i].ontouchend = function() {
					var that = this;
					if(!calendarBox.classList.contains('end')) {
						if(calendarBox.classList.contains('start')) {
							var sEle = document.querySelector('.fei-start-time');
							var sTime = document.querySelector('.fei-start-time').getAttribute('data-mill');
							var eTime = that.getAttribute('data-mill');
							if(eTime < sTime) {
								calendarBox.addList.add('start');
								sEle.classList.remove('fei-start-time');
								that.classList.add('fei-start-time');
							} else {
								calendarBox.classList.add('end');
								that.classList.add('fei-end-time');
								var nodeNum1 = parseInt(sEle.getAttribute('data-num'));
								var nodeNum2 = parseInt(that.getAttribute('data-num'));
								var nodes = document.querySelectorAll('.item-day');
								var nodeLen = nodes.length;
								for(var i = nodeNum1 + 1; i < nodeNum2; i++) {
									nodes[i].classList.add('fei-between-time');
								};
								setTimeout(function() {
									var time_1 = sTime,time_2 = eTime;
									calendarBox.classList.remove('start');
									calendarBox.classList.remove('end');
									sEle.classList.remove('fei-start-time');
									document.querySelector('.fei-end-time').classList.remove('fei-end-time');
									document.querySelector('.fei-calendar').classList.remove('fei-calendar-active');
									var ele =  document.querySelectorAll('.fei-between-time'),len = ele.length;
									for(var i=0;i<len;i++){
										ele[i].classList.remove('fei-between-time');
									};
									callback({
										feiStartTime: Number(sTime),
										feiEndTime: Number(eTime)
									});
								}, self.params.timeOutHide);
							};
						} else {
							calendarBox.classList.add('start');
							that.classList.add('fei-start-time');
						};
					};
				};
			};
		},
		addEvent: function(dom, eType, func) {
			if(dom.addEventListener) { // DOM 2.0
				dom.addEventListener(eType, function(e) {
					func(e);
				});
			} else if(dom.attachEvent) { // IE5+
				dom.attachEvent('on' + eType, function(e) {
					func(e);
				});
			} else { // DOM 0
				dom['on' + eType] = function(e) {
					func(e);
				}
			}
		},
		extend: function(a, b) {
			for(var key in b) {
				if(b.hasOwnProperty(key)) {
					a[key] = b[key];
				};
			};
			return a;
		}
	};
	window.feiCalendar = feiCalendar;
})(window);