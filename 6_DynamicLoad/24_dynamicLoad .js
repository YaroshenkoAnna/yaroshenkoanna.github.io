'use strict'

function throttle(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	var last,
		deferTimer;
	return function() {
		var context = scope || this;

		var now = +new Date,
			args = arguments;
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function() {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}


(function() {

	var $div = $('#featured-comic').parent().parent().addClass('main-section');
	var numberOfLoadPictures = 0;
	var isImageLoad = false;
	var nextUrl;
	defineNextUrl($('body'));
	isBottomSideVisible();


	$(window).scroll(throttle(isBottomSideVisible));

	function isBottomSideVisible() {
		if ($(window).scrollTop() >= $div.offset().top + $div.outerHeight() - window.innerHeight) {

			if (isImageLoad === false) {
				loadImage();
			};
		}
	}

	function defineNextUrl(data) {
		var link = $(data).find('.previous-comic').attr('href');
		nextUrl = 'http://explosm.net' + link;
	}

	function loadImage() {
		isImageLoad = true;
		$.ajax({
			url: nextUrl,
			success: function(data) {
				var imageLink = $(data).find('div>#main-comic').attr('src');
				defineNextUrl(data);

				if (imageLink !== undefined) {
					var $prevImage = $('<img>').attr('src', imageLink).hide().fadeIn(2500);
					$div.append($prevImage);
					numberOfLoadPictures++;
					if (numberOfLoadPictures % 2 !== 0) {
						loadImage();
					} else {
						isImageLoad = false;
						isBottomSideVisible();
					}

				} else {
					loadImage();
				}

			}
		})

	}
})()