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
			9: 90,
			10: 100,
			11: 110,
			12: 120,
			13: 130,
			14: 140,
			15: 150,
			16: 160,
			17: 170,
			18: 180,
			19: 190,
			20: 200,
			21: 210,
			22: 220,
			23: 230,
			24: 240,
			25: 250,
			26: 260,
			27: 270,
			28: 280,
			29: 290,
			30: 300
		};

		var _cost = {
			'soap': {
				1: 60,
				10: 40,
				20: 30,
				100: 26
			},
			'serum': {
				1: 390,
				3: 300,
				5: 290
			},
			'lotion': {
				1: 350,
				4: 247.5
			},
			'morosil': {
				1: 290,
				3: 250,
				5: 198
			},
			'choco': {
				1: 290,
				3: 250,
				5: 198
			},
			'fiber': {
				1: 450,
				5: 360
			},
			'coffee': {
				1: 250,
				5: 200
			},
			'gluta': {
				1: 650,
				4: 500
			}
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

		function _getPrice(qty, cost) {

			var price = 0;
			var beforeKey;
			var total = 0;

			if (qty > 0) {

				$.each(cost, function (key, value) {

					if (qty < key) {
						price = cost[beforeKey];
						return false;
					} else if (qty == key) {
						price = value;
						return false;
					}

					beforeKey = key;

				});

				if (price == 0) {
					price = cost[beforeKey];
				}

				total = parseInt(qty * price);

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

			var soapQty = 0;
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

			// cost.promotion_price = _getPromotionPrice();

			cost.soap_price = _getPrice(soapQty, _cost.soap);
			cost.serum_price = _getPrice(_product.serum, _cost.serum);
			cost.morosil_price = _getPrice(_product.morosil, _cost.morosil);
			cost.lotion_price = _getPrice(_product.lotion, _cost.lotion);
			cost.choco_price = _getPrice(_product.choco, _cost.choco);
			cost.fiber_price = _getPrice(_product.fiber, _cost.fiber);
			cost.coffee_price = _getPrice(_product.coffee, _cost.coffee);
			cost.gluta_price = _getPrice(_product.gluta, _cost.gluta);
			cost.shipping_fees = _getShippingFees();
			cost.shipping_fees = Math.round(cost.shipping_fees / 10) * 10;

			cost.total_price = cost.soap_price + cost.serum_price + cost.morosil_price + cost.lotion_price + cost.choco_price + cost.fiber_price + cost.coffee_price + cost.gluta_price;

			cost.total_amount = cost.total_price + cost.shipping_fees;
			cost.shipping_fees_cod = (cost.total_amount * _codRate) + cost.shipping_fees;
			cost.shipping_fees_cod = Math.round(cost.shipping_fees_cod / 10) * 10;

			cost.total_amount_cod = cost.total_price + cost.shipping_fees_cod;
			cost.total_amount_cod = Math.round(cost.total_amount_cod / 10) * 10;

			return cost;

		}

		function _setDetail() {

			var labelProductPrice = '';
			var labelOrder = '';
			var cost = {};
			var soap = 0;
			var cod = false;
			var shippingFees = 0;

			cost = getCost();
			cod = $('#chkCod').is(':checked');

			soap = _product.soap_white + _product.soap_red;

			if (_product.soap_white > 0 || _product.soap_red > 0) {
				labelProductPrice += '- สบู่ ' + soap + ' ก้อน ' + cost.soap_price.toLocaleString() + ' บาท<br>';
				if (_product.soap_white > 0) {
					labelOrder += '- สบู่ขาว ' + _product.soap_white + ' ก้อน\n';
				}
				if (_product.soap_red > 0) {
					labelOrder += '- สบู่แดง ' + _product.soap_red + ' ก้อน\n';
				}
			}

			if (_product.serum > 0) {
				labelProductPrice += '- เซรั่ม ' + _product.serum + ' ขวด ' + cost.serum_price.toLocaleString() + ' บาท<br>';
				labelOrder += '- เซรั่ม ' + _product.serum + ' ขวด\n';
			}

			if (_product.lotion > 0) {
				labelProductPrice += '- โลชั่น ' + _product.lotion + ' กล่อง ' + cost.lotion_price.toLocaleString() + ' บาท<br>';
				labelOrder += '- โลชั่น ' + _product.lotion + ' กล่อง\n';
			}

			if (_product.morosil > 0) {
				labelProductPrice += '- โมโรซิว ' + _product.morosil + ' กล่อง ' + cost.morosil_price.toLocaleString() + ' บาท<br>';
				labelOrder += '- โมโรซิว ' + _product.morosil + ' กล่อง\n';
			}

			if (_product.choco > 0) {
				labelProductPrice += '- ช๊อคโก้ ' + _product.choco + ' กล่อง ' + cost.choco_price.toLocaleString() + ' บาท<br>';
				labelOrder += '- ช๊อคโก้ ' + _product.choco + ' กล่อง\n';
			}

			if (_product.coffee > 0) {
				labelProductPrice += '- กาแฟ ' + _product.coffee + ' กล่อง ' + cost.coffee_price.toLocaleString() + ' บาท<br>';
				labelOrder += '- กาแฟ ' + _product.coffee + ' กล่อง\n';
			}

			if (_product.fiber > 0) {
				labelProductPrice += '- ไฟเบอร์ ' + _product.fiber + ' กล่อง ' + cost.fiber_price.toLocaleString() + ' บาท<br>';
				labelOrder += '- ไฟเบอร์ ' + _product.fiber + ' กล่อง\n';
			}

			if (_product.gluta > 0) {
				labelProductPrice += '- กรูตร้า ' + _product.gluta + ' กล่อง ' + cost.gluta_price.toLocaleString() + ' บาท<br>';
				labelOrder += '- กรูตร้า ' + _product.gluta + ' กล่อง\n';
			}

			if (cost.total_price > 0) {
				labelProductPrice += '<br><b>รวมทั้งหมด</b> ' + cost.total_price.toLocaleString() + ' บาท<br>';
			}

			if (cost.total_amount > 0) {

				if (cod) {
					shippingFees = cost.shipping_fees_cod;
				} else {
					shippingFees = cost.shipping_fees;
				}

				if (shippingFees > 0) {
					labelProductPrice += '<b>ค่าจัดส่ง</b> ' + shippingFees.toLocaleString() + ' บาท<br>';
				} else {
					labelProductPrice += '<b>จัดส่งฟรี</b><br>';
				}

				labelProductPrice += '--------------------------' + '<br>';
				labelProductPrice += '<b>โอนเงินรวมค่าจัดส่ง </b> ' + cost.total_amount.toLocaleString() + ' บาท<br>';
				labelProductPrice += '<b>เก็บเงินปลายทาง </b> ' + cost.total_amount_cod.toLocaleString() + ' บาท<br>';

			}

			if (cod) {
				labelOrder += "\nเก็บเงินปลายทาง " + cost.total_amount_cod.toLocaleString() + " บาท\n";
			}

			labelOrder += "\nผู้รับ...";

			$("#lblProductPrice").html(labelProductPrice);
			$("#txtOrder").html(labelOrder);

			if (cod) {
				$('#lblShippingFees').text(cost.shipping_fees_cod.toLocaleString());
			} else {
				$('#lblShippingFees').text(cost.shipping_fees.toLocaleString());
			}

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