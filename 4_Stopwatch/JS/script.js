'use strict';

(function() {

	function changeHeightOfContainer() {
		var container = document.querySelector('.container');
		var container1 = document.querySelector('.container1');
		var style = window.getComputedStyle(container, null);
		var style1 = window.getComputedStyle(container1, null);
		container1.style.height='auto';
		container.style.height='auto';
		var height=style.height;
		var height1=style1.height;
		console.log(height,height1)
		if (height>height1) {
			container1.style.height=height;
		}else{
			container.style.height=height1;
		}
	}

/*polyfill for bind*/
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {

				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function() {},
				fBound = function() {
					return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}
	/*polyfill for bind*/


	var START_STOP_KEYCODE = 83; //S
	var LAP_KEYCODE = 76; //L
	var RESET_KEYCODE = 82; //R
	var activeStopWatch;



	function Stopwatch(node) {
		this.root = node;
		this.timeIndicatorNode = this.root.querySelector('.stopwatch-current');
		this.intervalId = null;
		this.elapsedTime = 0;
		this.buttonStartStop = this.root.querySelector('.btn-primary');
		this.lapsContainer = this.root.querySelector('.stopwatch-laps');
		this.lapNodes;
		var _this = this;
		var buttonReset = this.root.querySelector('.btn-danger');
		var buttonLap = this.root.querySelector('.btn-info');

		this.buttonStartStop.addEventListener('click', this.start.bind(this), false);
		buttonReset.addEventListener('click', this.reset.bind(this), false);
		buttonLap.addEventListener('click', this.lap.bind(this), false);
		this.lapsContainer.addEventListener('click', function() {
			event = event || window.event;
			var target = event.target || event.srcElement;
			if (target.className === 'label-danger') {
				_this.removeLap(event);
			};

		}, false);
		this.root.addEventListener('mouseenter', function(event) {
			event = event || window.event;
			var target = event.target || event.srcElement;
			activeStopWatch = target;

		}, false);


		document.addEventListener('keyup', function(event) {
			activeStopWatch = activeStopWatch || document.querySelector('.container');
			event = event || window.event;
			if (activeStopWatch !== _this.root) {
				return;
			};

			if (event.keyCode === START_STOP_KEYCODE) {
				_this.start()
			} else if (event.keyCode === LAP_KEYCODE) {
				_this.lap();
			} else if (event.keyCode === RESET_KEYCODE) {
				_this.reset();
			};
		}, false);


	}

	Stopwatch.prototype.start = function() {

		if (this.buttonStartStop.textContent === 'Start') {
			this.buttonStartStop.textContent = 'Stop';
			var _this = this;
			var lastUpdateTime = (new Date()).getTime();
			this.intervalId = setInterval(function() {
				var nextTicTime = (new Date()).getTime();
				_this.elapsedTime += (nextTicTime - lastUpdateTime);
				lastUpdateTime = nextTicTime;
				_this.drawTime(_this.timeIndicatorNode);
			}, 16);

		} else(this.stop.bind(this)())
	}

	Stopwatch.prototype.stop = function() {
		clearInterval(this.intervalId);
		this.buttonStartStop.textContent = 'Start';
	}


	Stopwatch.prototype.reset = function() {
		clearInterval(this.intervalId);
		this.buttonStartStop.textContent = 'Start';
		this.timeIndicatorNode.textContent = '00:00:00:000';
		this.elapsedTime = 0;
		if (this.lapNodes) {
			this.lapNodes = undefined;
		};

		while (this.lapsContainer.childNodes[0]) {
			this.lapsContainer.removeChild(this.lapsContainer.childNodes[0]);
		}

		changeHeightOfContainer();
	}

	Stopwatch.prototype.lap = function() {
		var i;
		if (!this.lapNodes) {
			this.lapNodes = [];
			i = 0;
		} else {
			i = this.lapNodes.length;

		}
		this.lapNodes[i] = this.lapsContainer.appendChild(document.createElement('div'));
		this.lapNodes[i].className = 'alert-info';
		var _this = this;
		var removeButton = document.createElement('span');
		removeButton.textContent = '×';
		_this.drawTime(this.lapNodes[i]);
		this.lapNodes[i].appendChild(removeButton);
		removeButton.className = 'label-danger';
		i++;

		changeHeightOfContainer();
	}

	Stopwatch.prototype.removeLap = function(event) {
		event = event || window.event;
		var target = event.target || event.srcElement;

		var lapNode = target.parentNode;
		var childNodes = this.lapsContainer.childNodes;

		var childIndex;
		for (var i = 0; i < childNodes.length; i++) {
			if (lapNode === childNodes[i]) {
				childIndex = i;
				break;
			}
		}

		this.lapNodes.splice(childIndex, 1);
		this.lapsContainer.removeChild(lapNode);

		changeHeightOfContainer()
	}

	Stopwatch.prototype.drawTime = function(node) {
		var milliseconds = parseInt(this.elapsedTime % 1000);
		if (milliseconds < 10) {
			milliseconds = '00' + milliseconds;
		} else if (milliseconds < 100) {
			milliseconds = '0' + milliseconds;
		}

		var seconds = parseInt((this.elapsedTime / 1000) % 60);
		var minutes = parseInt((this.elapsedTime / (1000 * 60)) % 60);
		var hours = parseInt((this.elapsedTime / (1000 * 60 * 60)) % 24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		var time = (hours + ":" + minutes + ":" + seconds + ":" + milliseconds);
		node.textContent = time;
	}


	Stopwatch.prototype.onGlobalKeyup = function(event) {

	}

	window.Stopwatch = Stopwatch;
})()