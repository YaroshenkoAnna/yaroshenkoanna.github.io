'use strict';

$(document).ready(function() {



    function Slider(root, arrayOfLinks) {
        this.root = root;
        this._buildSliderMarkup(root, arrayOfLinks);
        this.widthOfImg;
        this.shift = 0;
        this.animationTimer;
        this.restartAnimationTimer;
        var _this = this;
        var $img = this.root.find('img');

        $img.eq(3).on('load', function() {

            _this.widthOfImg = $img.width();
            _this.root.find('.image-panel').css('width', _this.widthOfImg);
            console.log(this.widthOfImg);
            _this.makeTimer();
            _this.root.find('.tab').on('click', 'div', (function() {
                clearTimeout(_this.restartAnimationTimer);
                clearInterval(_this.animationTimer);
                _this.root.find('img').stop();
                var target = $(this);
                _this._activateTab(target);
                _this.restartAnimationTimer = setTimeout(_this.makeTimer.bind(_this), 5000);

            }))
        })
    }

    Slider.prototype._buildSliderMarkup = function(root, arrayOfLinks) {

        var tab = root.addClass('wrap').append('<div>').children().eq(0).addClass('tab');
        var imagePanel = root.append('<div>').children().eq(1).addClass('image-panel');
        $.each(arrayOfLinks, function(index) {
            tab.append('<div>').children().eq(index).addClass('tab' + (1 + index));
            imagePanel.append('<img>').children().eq(index).attr({
                'src': arrayOfLinks[index],
                'alt': 'image' + (1 + index),
                'height': '350px'
            });
        })
        $('.tab1').addClass('active');

    }

    Slider.prototype._activateTab = function(tab) {
        var previousIndex = this.root.find('.tab div').index(this.root.find('.active'));
        var currentIndex = this.root.find('.tab div').index(tab);
        this.root.find('.active').removeClass('active');
        tab.addClass('active');
        this._scrollImg(previousIndex, currentIndex)
    }

    Slider.prototype._scrollImg = function(previousIndex, currentIndex) {
        this.shift = (previousIndex - currentIndex) * this.widthOfImg + this.shift;
        this.root.find('img').animate({
            left: this.shift
        }, 1000)
    }

    Slider.prototype._findNextTab = function() {
        var nextTab = this.root.find('.active').next();
        if (this.root.find('.tab div').index(nextTab) === -1) {
            nextTab = this.root.find('.tab div:first-of-type');
        }
        this._activateTab(nextTab);
    }

    Slider.prototype.makeTimer = function() {
        this.animationTimer = setInterval(this._findNextTab.bind(this), 2000)
    }

    window.Slider = Slider;
    //pictures must have same dimensions. image panel has width=img1
    window.slider1 = new Slider($('.slider1'), ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg']);
    window.slider2 = new Slider($('.slider2'), ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg']);
})