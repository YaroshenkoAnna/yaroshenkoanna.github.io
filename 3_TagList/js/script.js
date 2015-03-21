(function() {
	'use strict';

	function TagList(node, tagArray) {
		this.editMode = false;
		this.tags;
		this.tagValues = [];
		this.node = $('<div class="container"></div>');
		$(node).append(this.node);
		this.tagContainer = $('<div class="tagwrap"></div>');
		this.createStructure();
		this.tags;
		var _this = this;

		if (tagArray) {
			tagArray.forEach(this.createTag.bind(this))
		}

		this.node.find('a').click(_this.changeMode.bind(_this));
		this.node.find('.btn-info').click(function() {
			_this.createTag.bind(_this)(_this.node.find('input').val());
		});
		this.node.find('.btn-danger').click(_this.deleteAllTags.bind(_this));
		this.node.delegate('span.label-default', 'click', _this.deleteTag.bind(_this))
		this.node.find('input').keyup(function(event){
			var ENTER_KEYCODE=13;
			if (event.keyCode===ENTER_KEYCODE) {
				_this.createTag.bind(_this)(_this.node.find('input').val())
			};
		});
	}

	TagList.prototype.createStructure = function() {
		this.node.append('<h4><a>Редактировать тэги</a></h4>')
			.append(this.tagContainer);
		var hiddenModeStructure = $('<form role="form" onsubmit="return false">'+
										'<div class="input-group col-md-6">'+
											'<input type="text" class="form-control">'+
											'<span class="input-group-btn btn-md">'+
												'<button type="button" class="btn btn-info">Добавить</button>'+
												'<button type="button" class="btn btn-danger">Удалить все</button>'+
											'</span>'+
											'</div>'+
									'</form>').hide()
		this.node.append(hiddenModeStructure);
	}

	TagList.prototype.createTag = function(tagValue) {
		tagValue = $.trim(tagValue);
		if (this.tagValues.indexOf(tagValue) !== -1 || tagValue === '') {
			return;
		};
		this.tagValues.push(tagValue);

		var $tag = $('<div class="label label-default"></div>').text(tagValue).append('<span class="label label-default">✕</span>');
		var $tagWrap = $('<div class="wrap"></div>').append($tag);

		//without check don't show closed element next to add element
		if (this.editMode === true) {
			$tag.find('span.label-default').show();
		};

		this.tagContainer.append($tagWrap);
		this.node.find('input').val('');
		this.autofocus();
	}

	TagList.prototype.deleteTag = function(event) {
		var $tag = $(event.target).parent();
		var tagValue = $tag.contents()[0].textContent;
		this.tagValues.splice(this.tagValues.indexOf(tagValue), 1);
		$tag.remove();
		this.autofocus();
	}

	TagList.prototype.deleteAllTags = function() {
		this.tagContainer.empty();
		this.tagValues = [];
		this.autofocus();
	}

	TagList.prototype.changeMode = function(event) {
		var $target = $(event.target);
		var $closed = this.tagContainer.find('span.label-default');
		var $ModeStructure = this.node.find('form');

		//show
		if (this.editMode === false) {
			$closed.show();
			$ModeStructure.show();
			$target.html('Завершить редактирование')
			this.editMode = true;
			this.autofocus();

		//hide
		} else {
			$closed.hide();
			$ModeStructure.hide();
			$target.html('Редактировать тэги')
			this.editMode = false;
		}
	}

	TagList.prototype.autofocus = function() {
		this.node.find('input').focus();
	}

	window.TagList=TagList;
})()


var tagList1 = new TagList(document.querySelector('body'), ['<div><i>qwerty</i></div>', 'abc', 'abc']);
var tagList2 = new TagList(document.querySelector('body'), ['1', '2']);
var tagList3 = new TagList(document.querySelector('body'));

