/**
 * Created by HENG on 2015/6/17.
 */
"use strict";

(function($) {
	// 唯一CLASS ID
	var pickerId = 0;


	function TargetPicker(opts) {
		// 保存用于输出的结果
		var globalResult = [];
		var cusResult;
		// 每次实例化，自增
		pickerId++;
		// 默认配置
		var defaults = {
			targetEle: "body",
			data: []
		};
		// 混合配置项
		this.opts = $.extend(defaults, opts);
		// 组件自带的DOM结构
		this.$wrap = $("<div class='target-picker-wrap target-picker-" + pickerId + "'></div>");
		this.$navs = $("<div class='target-picker-navs'></div>");
		this.$boxs = $("<div class='target-picker-boxs'></div>");
		this.$custom = $("<form class='target-picker-custom'><input class='inp-custom-place' type='text' placeholder='其他地方' /><button class='mu-btn mu-btn-s mu-btn-brown' type='submit'>添加</button></form>");
		this.$result = $("<div class='check-result'></div>");

		// this的引用
		var that = this;

		// 合成组件界面
		this.$wrap.append(this.$navs, this.$boxs, this.$custom, this.$result);

		// 在目标元素插入组件
		$(this.opts.targetEle).append(this.$wrap);

		// 循环数据，生成DOM节点
		var navHtml = "";
		var boxHtml = "";
		for (var i = 0; i < this.opts.data.length; i++) {
			var area = this.opts.data[i];
			navHtml += "<a class='" + (i === 0 ? " curr" : "") + "' href='javascript:;'>" + area.name + "</a>";
			boxHtml += "<div class='box-item" + (i === 0 ? " curr" : "") + "'>";
			for (var j = 0; j < area.citys.length; j++) {
				boxHtml += "<a data-id='item-" + i + j + "' href='javascript:;'>" + area.citys[j].name + "</a>";
			}
			boxHtml += "</div>";
		}

		cusResult = (function() {
			var ret = [];
			var index = 0;

			// 去除左右空格
			function trim(str) {
				return str.replace(/(^\s*)|(\s*$)/g, "");
			}

			// 添加
			function add(name) {
				name = trim(name);
				var check = $.grep(ret, function(n) {
					return n.name === name;
				});
				if (check.length) {
					return false;
				}
				var obj = {
					id: "custom" + index++,
					name: name
				};
				ret.push(obj);
			}

			// 删除
			function del(name) {
				for (var i = 0; i < ret.length; i++) {
					if (ret[i].name === name) {
						ret.splice(i, 1);
						break;
					}
				}
			}

			// 获取
			function get() {
				return ret;
			}
			return {
				add: add,
				del: del,
				get: get
			};
		}());

		// 目的地点击事件
		this.$boxs.delegate("a", "click", function() {
			// 切换选中class，很重要，checked类和输出数据挂钩
			$(this).toggleClass("checked");
			// 脏检测
			dirtyCheck(that.$result);
		});

		// 删除目的地
		this.$result.delegate(".del", "click", function() {
			var id = $(this).parent().data("id");
			var name = $(this).parent().text();
			// 如果是自定义的地址，使用相关的删除方法
			if (/^custom/.test(id)) {
				cusResult.del(name);
				dirtyCheck(that.$result);
			} else {
				that.$boxs.find("[data-id=" + id + "]").trigger("click");
			}



		});

		this.$custom.on("submit", function() {
			var $inp = $(this).find(".inp-custom-place");
			var cusVal = $inp.val();
			cusResult.add(cusVal);
			dirtyCheck(that.$result);
			$inp.val("").focus();
			return false;
		});

		/**
		 * 脏检测，用于跑一次所有数据，抓出被checked的选项
		 * @param  {jqObject} $resultDom 插入输出结果的JQ对象
		 */
		function dirtyCheck($resultDom) {
			var result = [];
			var $checked = that.$boxs.find(".checked");
			$checked.each(function(index, ele) {
				result.push({
					id: $(ele).data("id"),
					name: $(ele).text()
				});
			});
			globalResult = result;
			result = result.concat(cusResult.get());
			var htmlStr = renderResult(result);
			$resultDom.html(htmlStr);
		}

		/**
		 * 渲染结果DOM
		 * @param  {array} data 在脏检测里面获取到的数据
		 * @return {string}      返回渲染好的html字符串
		 */
		function renderResult(data) {
			var html = "";
			for (var i = 0; i < data.length; i++) {
				html += "<a data-id='" + data[i].id + "' href='javascript:;'>" + data[i].name + "<em class='del'></em></a>";
			}
			return html;
		}

		/**
		 * 获取picker结果，用于在实例上使用，实时获取整个Picker的结果，一般给外部组件使用
		 * @return {array} 以数组形式存在的结果
		 */
		TargetPicker.prototype.getResult = function() {
			return globalResult.concat(cusResult.get());
		};



		this.$navs.html(navHtml);
		this.$boxs.append(boxHtml);

		// 依赖tabSwitch进行选项卡切换
		$.fn.tabSwitch = function(options) {
			var settings = {
				"liSelcter": ".w_tab_names li",
				"boxSelecter": ".w_tab_boxs .box",
				"liActiveClass": "cur",
				"boxActiveClass": "cur",
				"callback": $.noop
			};
			if (options) {
				$.extend(settings, options);
			}
			return this.each(function() {
				var that = this;
				$(this).find(settings.liSelcter).each(function(index) {
					$(this).click(function() {
						$(this).addClass(settings.liActiveClass).siblings().removeClass(settings.liActiveClass);
						$(that).find(settings.boxSelecter).eq(index).addClass(settings.boxActiveClass).siblings().removeClass(settings.boxActiveClass);
						settings.callback($(this), $(that).find(settings.boxSelecter).eq(index));
					});
				});
			});
		};


		this.$wrap.tabSwitch({
			liSelcter: ".target-picker-navs a",
			boxSelecter: ".target-picker-boxs .box-item",
			liActiveClass: "curr",
			boxActiveClass: "curr"
		});
	}



	window.TargetPicker = TargetPicker;
})(window.$);