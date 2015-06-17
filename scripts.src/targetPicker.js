/**
 * Created by HENG on 2015/6/17.
 */

"use strict";
(function() {
	var defaults = {
		targetEle: "body",
		data: []
	};
	var pickerId = 1;

	var targetPicker = {
		$wrap: $("<div class='target-picker-wrap target-picker-" + pickerId + "'></div>"),
		$navs: $("<div class='target-picker-navs'></div>"),
		$boxs: $("<div class='target-picker-boxs'></div>"),
		$custom: $("<form class='target-picker-custom'><input class='inp-custom-place' type='text' placeholder='其他地方' /><button class='mu-btn mu-btn-s mu-btn-brown' type='submit'>添加</button></form>"),
		$result: $("<div class='check-result'></div>"),
		create: function(options) {
			pickerId++;
			this.opts = $.extend(defaults, options) || {};
			// 合成组件界面
			this.$wrap.append(this.$navs, this.$boxs, this.$custom, this.$result);
			// 在目标元素插入组件
			$(this.opts.targetEle).append(this.$wrap);
		},
		init: function() {
			return Object.create(this);
		}
	};

	window.targetPicker = targetPicker;
}());