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
			7: 75,
			8: 90,
			9: 105,
			10: 120,
			11: 135,
			12: 150,
			13: 165,
			14: 180,
			15: 195,
			16: 210,
			17: 225,
			18: 240,
			19: 255,
			20: 270,
			21: 285,
			22: 300,
			23: 315,
			24: 330,
			25: 345
		};

		var _cost = {
			'soap': {
				1: 60,
				10: 40,
				20: 30,
				100: 28
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
			var itemWeight = 0;

			// Soap
			if ($.inArray(_product.soap_qty, _freeShipping.soap) == -1) {

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

		function _freeGif(cost) {

			var gift = {};
			var bag = 0;

			gift.mask = _product.serum;
			bag = _product.soap_qty / 5;
			bag = Math.floor(bag);

			gift.bag = bag;

			cost.gift = gift;

			return cost;

		}

		function _checkPromotionPrice(cost) {

			var productQty = 0;
			var promotion = true;

			$.each(_product, function (key, value) {
				if(key!="soap_qty"){
					productQty += value;
				}
			});

			
			if ((_product.soap_qty == 2 && _product.lotion == 1) && productQty == 3) {
				cost.shipping_fees = 0;
				cost.total_price = 500;
				cost.total_amount = cost.total_price;
				cost.total_amount_cod = cost.total_price + 20;
			} else if ((_product.soap_qty == 20 && _product.lotion == 1) && productQty == 21) {
				cost.shipping_fees = 0;
				cost.total_price = 990;
				cost.total_amount = cost.total_price;
				cost.total_amount_cod = cost.total_price + 40;
			} else if ((_product.soap_qty == 1 && _product.serum == 1) && productQty == 2) {
				cost.shipping_fees = 0;
				cost.total_price = 450;
				cost.total_amount = cost.total_price;
				cost.total_amount_cod = cost.total_price + 20;
			} else if ((_product.soap_qty == 10 && _product.serum == 3) && productQty == 13) {
				cost.shipping_fees = 0;
				cost.total_price = 1300;
				cost.total_amount = cost.total_price;
				cost.total_amount_cod = cost.total_price + 50;
			} else if (((_product.choco + _product.morosil) == 5) && productQty == 5) {
				cost.shipping_fees = 60;
				cost.total_price = 990;
				cost.total_amount = cost.total_price + cost.shipping_fees;
				cost.total_amount_cod = cost.total_amount + 50;
			} else {
				promotion = false;
			}

			cost.set_promotion = promotion;

			return cost;

		}




		function getCost() {

			var differanceTotalAmount = 0;
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
			_product.soap_qty = _product.soap_red + _product.soap_white;

			cost.soap_price = _getPrice(_product.soap_qty, _cost.soap);
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

			differanceTotalAmount = cost.total_amount_cod - cost.total_amount;
			if (differanceTotalAmount < 11) {
				cost.total_amount_cod = cost.total_amount + 20;
			}

			cost = _checkPromotionPrice(cost);
			cost = _freeGif(cost);

			return cost;

		}

		function _setDetail() {

			var labelPrice = '';
			var labelOrder = '';
			var cost = {};
			var soap = 0;
			var cod = false;
			var shippingFees = 0;

			cost = getCost();
			cod = $('#chkCod').is(':checked');

			soap = _product.soap_white + _product.soap_red;

			if (_product.soap_white > 0 || _product.soap_red > 0) {
				labelPrice += '- สบู่ ' + soap + ' ก้อน ' + cost.soap_price.toLocaleString() + ' บาท\n';
				if (_product.soap_white > 0) {
					labelOrder += '- สบู่ขาว ' + _product.soap_white + ' ก้อน\n';
				}
				if (_product.soap_red > 0) {
					labelOrder += '- สบู่แดง ' + _product.soap_red + ' ก้อน\n';
				}
			}

			if (_product.serum > 0) {
				labelPrice += '- เซรั่ม ' + _product.serum + ' ขวด ' + cost.serum_price.toLocaleString() + ' บาท\n';
				labelOrder += '- เซรั่ม ' + _product.serum + ' ขวด\n';
			}

			if (_product.lotion > 0) {
				labelPrice += '- โลชั่น ' + _product.lotion + ' กล่อง ' + cost.lotion_price.toLocaleString() + ' บาท\n';
				labelOrder += '- โลชั่น ' + _product.lotion + ' กล่อง\n';
			}

			if (_product.morosil > 0) {
				labelPrice += '- โมโรซิว ' + _product.morosil + ' กล่อง ' + cost.morosil_price.toLocaleString() + ' บาท\n';
				labelOrder += '- โมโรซิว ' + _product.morosil + ' กล่อง\n';
			}

			if (_product.choco > 0) {
				labelPrice += '- ช๊อคโก้ ' + _product.choco + ' กล่อง ' + cost.choco_price.toLocaleString() + ' บาท\n';
				labelOrder += '- ช๊อคโก้ ' + _product.choco + ' กล่อง\n';
			}

			if (_product.coffee > 0) {
				labelPrice += '- กาแฟ ' + _product.coffee + ' กล่อง ' + cost.coffee_price.toLocaleString() + ' บาท\n';
				labelOrder += '- กาแฟ ' + _product.coffee + ' กล่อง\n';
			}

			if (_product.fiber > 0) {
				labelPrice += '- ไฟเบอร์ ' + _product.fiber + ' กล่อง ' + cost.fiber_price.toLocaleString() + ' บาท\n';
				labelOrder += '- ไฟเบอร์ ' + _product.fiber + ' กล่อง\n';
			}

			if (_product.gluta > 0) {
				labelPrice += '- กรูตร้า ' + _product.gluta + ' กล่อง ' + cost.gluta_price.toLocaleString() + ' บาท\n';
				labelOrder += '- กรูตร้า ' + _product.gluta + ' กล่อง\n';
			}

			if (cost.gift.mask > 0) {
				var lblMask = "- มาร์คหน้า " + cost.gift.mask + " ชิ้น (ฟรี)\n";
				labelPrice += lblMask;
				labelOrder += lblMask;
			}

			if (cost.gift.bag > 0) {
				var lblBag = "- ตาข่ายตีฟอง " + cost.gift.bag + " ชิ้น (ฟรี)\n";
				labelPrice += lblBag;
				labelOrder += lblBag;
			}

			if (cost.set_promotion == false) {
				if (cost.total_price > 0) {
					labelPrice += '\nรวมทั้งหมด ' + cost.total_price.toLocaleString() + ' บาท\n';
				}
			} else {
				labelPrice += '\nราคาเซ็ทโปรโมชั่น ' + cost.total_price.toLocaleString() + ' บาท\n';
			}

			if (cost.total_amount > 0) {

				if (cod) {
					shippingFees = cost.shipping_fees_cod;
				} else {
					shippingFees = cost.shipping_fees;
				}

				if (shippingFees > 0) {
					labelPrice += 'ค่าจัดส่ง ' + shippingFees.toLocaleString() + ' บาท\n';
				} else {
					labelPrice += 'จัดส่งฟรี\n';
				}

				labelPrice += '--------------------------' + '\n';
				labelPrice += 'โอนเงินรวมค่าจัดส่ง ' + cost.total_amount.toLocaleString() + ' บาท\n';
				labelPrice += 'เก็บเงินปลายทาง ' + cost.total_amount_cod.toLocaleString() + ' บาท\n';

			}

			if (cod) {
				labelOrder += "- เก็บเงินปลายทาง " + cost.total_amount_cod.toLocaleString() + " บาท\n";
			}

			labelOrder += "\nผู้รับ...";

			$("#txtPrice").val(labelPrice);
			$("#txtOrder").val(labelOrder);

		}

		function _clearDetail() {

			$('#chkCod').prop('checked', false);
			$("#txtPrice").val('');
			$("#txtOrder").val('');

		}

		function init() {

			new ClipboardJS('.btn');

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