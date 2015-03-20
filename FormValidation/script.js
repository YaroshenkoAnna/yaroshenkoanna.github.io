/* 
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

	// Full polyfill for browsers with no classList support
	if (!("classList" in document.createElement("_"))) {

		(function(view) {

			"use strict";

			if (!('Element' in view)) return;

			var
				classListProp = "classList",
				protoProp = "prototype",
				elemCtrProto = view.Element[protoProp],
				objCtr = Object,
				strTrim = String[protoProp].trim || function() {
					return this.replace(/^\s+|\s+$/g, "");
				},
				arrIndexOf = Array[protoProp].indexOf || function(item) {
					var
						i = 0,
						len = this.length;
					for (; i < len; i++) {
						if (i in this && this[i] === item) {
							return i;
						}
					}
					return -1;
				}
				// Vendors: please allow content code to instantiate DOMExceptions
				,
				DOMEx = function(type, message) {
					this.name = type;
					this.code = DOMException[type];
					this.message = message;
				},
				checkTokenAndGetIndex = function(classList, token) {
					if (token === "") {
						throw new DOMEx(
							"SYNTAX_ERR", "An invalid or illegal string was specified"
						);
					}
					if (/\s/.test(token)) {
						throw new DOMEx(
							"INVALID_CHARACTER_ERR", "String contains an invalid character"
						);
					}
					return arrIndexOf.call(classList, token);
				},
				ClassList = function(elem) {
					var
						trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
						classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
						i = 0,
						len = classes.length;
					for (; i < len; i++) {
						this.push(classes[i]);
					}
					this._updateClassName = function() {
						elem.setAttribute("class", this.toString());
					};
				},
				classListProto = ClassList[protoProp] = [],
				classListGetter = function() {
					return new ClassList(this);
				};
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function(i) {
				return this[i] || null;
			};
			classListProto.contains = function(token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function() {
				var
					tokens = arguments,
					i = 0,
					l = tokens.length,
					token, updated = false;
				do {
					token = tokens[i] + "";
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function() {
				var
					tokens = arguments,
					i = 0,
					l = tokens.length,
					token, updated = false,
					index;
				do {
					token = tokens[i] + "";
					index = checkTokenAndGetIndex(this, token);
					while (index !== -1) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function(token, force) {
				token += "";

				var
					result = this.contains(token),
					method = result ?
					force !== true && "remove" :
					force !== false && "add";

				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.toString = function() {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) { // IE 8 doesn't support enumerable:true
					if (ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}

		}(self));

	} else {
		// There is full or partial native classList support, so just check if we need
		// to normalize the add/remove and toggle APIs.

		(function() {
			"use strict";

			var testElement = document.createElement("_");

			testElement.classList.add("c1", "c2");


			testElement = null;
		}());

	}

}



(function() {
	'use strict';

	var form = document.querySelector('[role="form"]');
	var password = document.querySelector('#password');
	var phone = document.querySelector('#phone');
	var email = document.querySelector('#email');
	var checkbox = document.querySelector('input[type="checkbox"]');
	var submit = document.querySelector('button[type="submit"]');

	form.addEventListener('keyup', startInput, false);
	form.addEventListener('input', startInput, false);
	checkbox.addEventListener('change', startInput, false);
	submit.addEventListener('click', checkAgreement, false);


	function isFormValide() {
		if (document.querySelector('.alert-danger') ||
			password.value === '' ||
			email.value === '') {
			submit.classList.add('disabled');
		} else {
			submit.classList.remove('disabled');
		}
	};

	function startInput(event) {
		var input = event.target;

		if (input === phone) {
			setTimeout(checkPhone, 500);

		} else if ((/^\s*$/).test(input.value)) {
			if (input.parentNode.classList.contains('required')) {
				setTimeout(function() {
					createErrorRequired(input);
				}, 500);
			}
		} else if (input === email) {
			setTimeout(checkEmail, 500);

		} else if (input === password) {
			setTimeout(checkPassword, 500);

		} else if (input === checkbox) {
			setTimeout(checkAgreement, 500);
		}

		setTimeout(isFormValide, 500);
	}

	function createErrorRequired(input) {
		var parent = input.parentNode;
		createErrorContainer(parent, 'Поле, обязательное к заполнению не заполнено');
	}

	function checkEmail() {
		var checkOfEmail = /^([a-z]+\w*@[a-z]+\.[a-z]+(\.[a-z])*)$/gi;
		var parent = email.parentNode;
		if (checkOfEmail.test(email.value)) {

			var encodedEmail = encodeURIComponent(email.value);
			var url = 'https://aqueous-reaches-8130.herokuapp.com/check-email/?email=' + encodedEmail;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onreadystatechange = isEmailUsed;
			xhr.send(null);

		} else {
			createErrorContainer(parent, 'Ошибка в email-е');
		}

		function isEmailUsed() {
			if (this.readyState == 4) {
				var response = JSON.parse(this.responseText)
				if (response.used) {

					createErrorContainer(parent, 'email уже занят');
				} else {
					removeErrorContainer(parent);
				}
			}
		}
	};

	function checkPassword() {
		var parent = password.parentNode;
		var checkOfCorrectSymbols = /^([a-z0-9_-]+)$/i;
		var onlyLetters = /^([a-z]+)$/i;
		var onlyNumbers = /^([0-9]+)$/;
		if (!checkOfCorrectSymbols.test(password.value)) {
			createErrorContainer(parent, 'Пароль содержит запрещенные символы');

		} else if (password.value.length <= 5) {
			createErrorContainer(parent, 'Пароль должен содержать более 5 символов');

		} else if (onlyLetters.test(password.value) || onlyNumbers.test(password.value)) {
			createErrorContainer(parent, 'Пароль должен содержить хотя бы одну цифру и букву');

		} else {
			removeErrorContainer(parent);
		}
	};

	function checkPhone() {
		var parent = phone.parentNode;
		var checkOfPhone = /^\+380([0-9]{9})$/;
		if (checkOfPhone.test(phone.value) || phone.value === '') {
			removeErrorContainer(parent);
		} else {
			createErrorContainer(parent, 'Телефонный номер должен быть в международном формате');
		}
	};

	function checkAgreement(event) {
		var parent = checkbox.parentNode;
		if (!checkbox.checked) {
			if (event) {
				event.preventDefault();
			};
			createErrorContainer(parent, 'Галочка "Согласен со всем" не поставлена');
		} else {
			removeErrorContainer(parent);
		}
	}

	function createErrorContainer(node, errorText) {
		if (!node.classList.contains('has-error')) {
			node.classList.add('has-error')
			var div = document.createElement('div');
			div.className = 'alert alert-danger';
			node.appendChild(div);
		};

		node.querySelector('.alert-danger').textContent = errorText;
	}

	function removeErrorContainer(node) {
		if (node.classList.contains('has-error')) {
			node.classList.remove('has-error');
			var removedNode = node.querySelector('.alert-danger');
			node.removeChild(removedNode);
		}
	}
})()