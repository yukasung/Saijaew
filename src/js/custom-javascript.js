$(function () {
	"use strict";

	var shipping = (function () {

		var _product = {
			'soap_red': 0,
			'soap_white': 0,
			'serum': 0,
			'morosil': 0,
			'lotion': 0,
			'choco': 0,
			'fiber': 0,
			'coffee': 0,
			'gluta': 0
		};

		var _weight = {
			'soap_red': 0.15,
			'soap_white': 0.15,
			'serum': 0.015,
			'morosil': 0.15,
			'lotion': 0.3,
			'choco': 0.3,
			'fiber': 0.07,
			'coffee': 0.15,
			'gluta': 0.018
		};

		var _codRate = 0.04;

		var _costShipping = {
			1: 35,
			2: 40,
			3: 45,
			4: 50,
			5: 55,
			6: 60,
			7: 70,
			8: 80,
			9: 90
		};

		var _costSoap = {
			1: 60,
			10: 40,
			20: 30,
			100: 26
		};

		var _costSerum = {
			1: 390,
			3: 300,
			5: 290
		};

		var _costLotion = {
			1: 350,
			4: 252
		};

		var _costMorosil = {
			1: 290,
			3: 250,
			5: 198
		};

		var _costChoco = {
			1: 290,
			3: 250,
			5: 198
		};

		var _costFiber = {
			1: 450,
			5: 360
		};

		var _costCoffee = {
			1: 250,
			5: 200
		};

		var _costGluta = {
			1: 650,
			4: 500
		};

		var _freeShipping = {
			'soap': [5],
			'morosil': [3],
			'choco': [3],
			'lotion': [2],
			'fiber': [2, 3, 5],
			'coffee': [],
			'serum': [],
			'gluta': []
		};

		function _getPrice(num, cost) {

			var price;
			var beforeKey;
			var total = 0;

			if (num > 0) {

				$.each(cost, function (key, value) {

					if (num < key) {
						price = cost[beforeKey];
						return false;
					} else if (num == key) {
						price = value;
						return false;
					}

					beforeKey = key;

				});

				total = (num * price);

			}

			return total;

		}

		function _getShippingFees() {

			var price = 0;
			var soapQty = 0;
			var itemWeight = 0;

			// Soap
			soapQty = _product.soap_red + _product.soap_white;
			if ($.inArray(soapQty, _freeShipping.soap) == -1) {

				if (_product.soap_red > 0) {
					itemWeight += _product.soap_red * _weight.soap_red;
				}

				if (_product.soap_white > 0) {
					itemWeight += _product.soap_white * _weight.soap_white;
				}
			}

			// Morosil
			if ($.inArray(_product.morosil, _freeShipping.morosil) == -1) {

				itemWeight += (_product.morosil > 0 ? _weight.morosil : 0);

			}

			// Choco
			if ($.inArray(_product.choco, _freeShipping.choco) == -1) {

				itemWeight += (_product.choco > 0 ? _weight.choco : 0);

			}

			// Lotion
			if ($.inArray(_product.lotion, _freeShipping.lotion) == -1) {

				itemWeight += (_product.lotion > 0 ? _weight.lotion : 0);

			}

			// Fiber
			if ($.inArray(_product.fiber, _freeShipping.fiber) == -1) {

				itemWeight += (_product.fiber > 0 ? _weight.fiber : 0);

			}

			// Coffee
			if ($.inArray(_product.coffee, _freeShipping.coffee) == -1) {

				itemWeight += (_product.coffee > 0 ? _weight.coffee : 0);

			}

			$.each(_costShipping, function (key, value) {

				if (itemWeight > 0 && itemWeight <= key) {
					price = value;
					return false;
				}

			});

			return price;

		}

		function _getPromotionPrice() {

			var soapQty = 0;
			var price = 0;

			soapQty = _product.soap_red + _product.soap_white;

			if (soapQty == 2 && _product.lotion == 1) {
				price = 500;
			} else if (soapQty == 20 && _product.lotion == 1) {
				price = 990;
			} else if (_product.soap_red == 1 && _product.serum == 1) {
				price = 450;
			}

			return price;

		}

		function getCost() {

			var totalPrice = 0;
			var soapQty = 0;
			var soapPrice = 0;
			var serumPrice = 0;
			var morosilPrice = 0;
			var lotionPrice = 0;
			var chocoPrice = 0;
			var fiberPrice = 0;
			var coffeePrice = 0;
			var glutaPrice = 0;
			var shippingFees = 0;
			var promotionPrice = 0;
			var cost = {};

			_product.soap_white = parseInt($.trim($('#txtSoapWhite').val()).length > 0 ? $('#txtSoapWhite').val() : 0);
			_product.soap_red = parseInt($.trim($('#txtSoapRed').val()).length > 0 ? $('#txtSoapRed').val() : 0);
			_product.serum = parseInt($.trim($('#txtSerum').val()).length > 0 ? $('#txtSerum').val() : 0);
			_product.lotion = parseInt($.trim($('#txtLotion').val()).length > 0 ? $('#txtLotion').val() : 0);
			_product.morosil = parseInt($.trim($('#txtMorosil').val()).length > 0 ? $('#txtMorosil').val() : 0);
			_product.fiber = parseInt($.trim($('#txtFiber').val()).length > 0 ? $('#txtFiber').val() : 0);
			_product.choco = parseInt($.trim($('#txtChoco').val()).length > 0 ? $('#txtChoco').val() : 0);
			_product.coffee = parseInt($.trim($('#txtCoffee').val()).length > 0 ? $('#txtCoffee').val() : 0);
			_product.gluta = parseInt($.trim($('#txtGluta').val()).length > 0 ? $('#txtGluta').val() : 0);

			soapQty = _product.soap_red + _product.soap_white;

			promotionPrice = _getPromotionPrice();

			if (promotionPrice == 0) {

				soapPrice = _getPrice(soapQty, _costSoap);
				serumPrice = _getPrice(_product.serum, _costSerum);
				morosilPrice = _getPrice(_product.morosil, _costMorosil);
				lotionPrice = _getPrice(_product.lotion, _costLotion);
				chocoPrice = _getPrice(_product.choco, _costChoco);
				fiberPrice = _getPrice(_product.fiber, _costFiber);
				coffeePrice = _getPrice(_product.coffee, _costCoffee);
				glutaPrice = _getPrice(_product.gluta, _costGluta);
				shippingFees = _getShippingFees();
				shippingFees = Math.round(shippingFees / 10) * 10;

			}
			
			cost.shipping_fees = shippingFees;

			cost.total_price = promotionPrice + soapPrice + serumPrice + morosilPrice + lotionPrice + chocoPrice + fiberPrice + coffeePrice + glutaPrice;

			cost.total_amount = cost.total_price + cost.shipping_fees;			
			cost.shipping_fees_cod = (cost.total_amount * _codRate) + cost.shipping_fees;
			cost.shipping_fees_cod = Math.round(cost.shipping_fees_cod / 10) * 10;		

			cost.total_amount_cod  = cost.total_price + cost.shipping_fees_cod;
			cost.total_amount_cod  = Math.round(cost.total_amount_cod / 10) * 10;
			

			return cost;

		}

		function _setDetail() {

			var label = '';
			var cost = getCost();

			if (_product.soap_white > 0) {
				label += "- สบู่ขาว " + _product.soap_white + '<br>';
			}

			if (_product.soap_red > 0) {
				label += "- สบู่แดง " + _product.soap_red + '<br>';
			}

			if (_product.serum > 0) {
				label += "- เซรั่ม " + _product.serum + '<br>';
			}

			if (_product.lotion > 0) {
				label += "- โลชั่น " + _product.lotion + '<br>';
			}

			if (_product.morosil > 0) {
				label += "- โมโรซิว " + _product.morosil + '<br>';
			}

			if (_product.choco > 0) {
				label += "- ช๊อคโก้ " + _product.choco + '<br>';
			}

			if (_product.coffee > 0) {
				label += "- กาแฟ " + _product.coffee + '<br>';
			}

			if (_product.fiber > 0) {
				label += "- ไฟเบอร์ " + _product.fiber + '<br>';
			}

			if (_product.gluta > 0) {
				label += "- กรูตร้า " + _product.gluta + '<br>';
			}

			if ($('#chkCod').is(':checked')) {
				label += "- เก็บเงินปลายทาง " + cost.total_amount_cod.toLocaleString() + " บาท<br>";
			}

			label += "<br>ผู้รับ...";

			$("#lblProductDetail").html(label);
			$('#lblPrice').text(cost.total_price.toLocaleString());

			if ($('#chkCod').is(':checked')) {
				$('#lblShippingFees').text(cost.shipping_fees_cod.toLocaleString());
			}else{
				$('#lblShippingFees').text(cost.shipping_fees.toLocaleString());
			}
			
			$('#lblTotalAmount').text(cost.total_amount.toLocaleString());
			$('#lblTotalAmountCod').text(cost.total_amount_cod.toLocaleString());

		}

		function _clearDetail() {

			$('#lblPrice').text('0');
			$('#lblShippingFees').text('0');
			$('#lblTotalAmount').text('0');
			$('#lblTotalAmountCod').text('0');
			$('#chkCod').prop('checked', false);
			$("#lblProductDetail").text('');

		}

		function init() {

			$("form input").bind("keyup", function () {
				_setDetail();
			});

			$("#chkCod").bind("change", function () {
				_setDetail();
			});

			$('#btnClear').bind("click", function () {

				$("form input").val('');
				_setDetail();
				_clearDetail();

			});

		}

		return {
			init: init,
			getCost: getCost
		};

	}());

	shipping.init();


});