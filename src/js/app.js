window.onload = function() {

	function $(ele) {
		this.ele = document.querySelector(ele);
		this.addClass = addClass;
		this.removeClass = removeClass;

		function removeClass(str) {
			console.log(str)
			var arr = this.ele.className.split(' ');
			if (~arr.indexOf(str)>=0) {
				return this;
			} else {
				arr.splice(arr.indexOf(str), 1)
				console.log(arr)
				this.ele.className = arr.join(' ');
			}
			return this;
		}
		function addClass(str) {
			console.log(str)
			var arr = this.ele.className.split(' ');
			if (~arr.indexOf(str)>=0) {
				arr.push(str)
				this.ele.className = arr.join(' ');
			}
		}
		return this;
	}
	var times = 1;
	setInterval(function() {
		var body = $('.ct-body');
		console.log(body)
		body.removeClass('actived-' + ((times + 2) % 3)).addClass('actived-' + times);
		times++;
		times = times % 3;
	}, 8000);
}