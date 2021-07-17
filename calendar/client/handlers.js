/**
 * @file handlers.js
 * @module handlers.js
 * @author wlr961 wayloggerman@gmail.com for toprent15.ru
*/
// ------------------------------------------------------------------------------------------------

/**
 * @global
 * @type {array}
 * 
 * @description object in array defined in namespaces.js
*/
const fieldHandlers = [
	dateObj,
	receivePlace,
	returnPlace,
	customerName,
	customerPhone,
	lawAgreementNamespace
]
/**
 * @global
 * @type {Array}
 */
const state = new Array(fieldHandlers.length).fill(false);
/**
 * @global
 * @type {array}
 * @description define state of 2 checkboxes 
*/
const lawAgreements = new Array(2).fill('');
/**
 * @global
 * @type {number}
 * @description index pf age and experience checkbox
*/
const ageExpInx = 0;
/**
 * @global
 * @type {number}
 * @description index of agreement's checkbox 
*/
const agreePolicyInx = 1;
/**
 * @function
 * @param {number} inx in state
 * @param {string} fieldClass css class
 * @description coloring border 
*/

function coloringBorder(inx, fieldClass) {
	$(`#${fieldHandlers[inx].id}`).addClass(fieldClass);
}
/**
 * @function
 * @param {number} inx in state
 * @param {string} fieldClass css class
 * @description decoloring border 
*/
function deColoringBorder(inx, fieldClass) {
	$(`#${fieldHandlers[inx].id}`).removeClass(fieldClass);
}
//-------------------------------------------------------------------------------------------------


/**
 * @function
 * @description reformat date
 * @example
 * 	from 11.12.2011 10:00 
 * 	to 2011-12-11 10:00
 * @param {string} date
*/

function reformDate(date) {
	if (!date) return;
	let [dt, time] = date.split(' ');
	dt = dt.split('.').reverse().join('-');

	return `${dt} ${time}`;
}

/**
 * @function
 * @param {object}
 * @returns {FormData}
 * @description принимает объект и возвращает форму
*/
function objToFormData(obj) {
	const form = new FormData();
	Object.keys(obj).forEach(
		(item) => {
			form.append(item, obj[item]);
		}
	)

	return form;

}

/**
 * @function
 * @param {Date} start
 * @param {Date} end
 * @returns {string} duration
 * @example ('01-01-2000 10:00', '02-01-2000 10:00') => (на 1 день с 01.01.2000 г. 10:00 по 02.02.2000 10:00)
*/
function translateDate(start, end) {
	if (!start || !end) return undefined;

	const d1 = new Date(start.split(' ')[0]);
	const d2 = new Date(end.split(' ')[0]);
	const t1 = start.split(' ')[1];
	const t2 = end.split(' ')[1];

	const numOfDays = ((d2 - d1) / 1000 / (24 * 3600)) + 1;
	const numOfDaysStr = numOfDays.toString();
	let dayWord = '';
	let last2num = parseInt(numOfDaysStr, 10);
	if (last2num >= 10 && last2num <= 19) {
		dayWord = 'дней'
		return `на ${numOfDaysStr} ${dayWord} с ${d1.toLocaleDateString()} ${t1} по ${d2.toLocaleDateString()} ${t2}`;
	}
	let lastNum = parseInt(numOfDaysStr.charAt(numOfDaysStr.length - 1), 10);
	if (lastNum === 1) dayWord = 'день';
	else if (lastNum === 0) dayWord = 'дней';
	else if (lastNum > 1 && lastNum < 5) dayWord = 'дня';
	else if (lastNum >= 5) dayWord = 'дней';
	return `на ${numOfDaysStr} ${dayWord} с ${d1.toLocaleDateString()} ${t1} по ${d2.toLocaleDateString()} ${t2}`;



}
/**
 * @function
 * @description "book" button handler the function should collect data from the fields, transform the data and send it to the server
 * 
*/
async function bookCar() {
	if (dataFromServer.dataSent) return;
	let badBit = false;
	state.forEach((el, inx) => {
		if (!el) {
			coloringBorder(inx, fieldClasses.validationFailed);
			badBit = true;
		}
		else {
			coloringBorder(inx, fieldClasses.validationPassed);
		}
	})

	const custName = `${$(`#${customerName.id}`).val()} -`
	const custPhone = `${$(`#${customerPhone.id}`).val()}`;
	const car_id = 9;
	const begin = reformDate($(`#leftDate`).val());
	const end = reformDate($(`#rightDate`).val());
	const receivePlaceId = dataFromServer.getPlaceId($(`#receivePlaceSelect`).val());
	const returnPlaceId = dataFromServer.getPlaceId($(`#returnPlaceSelect`).val());
	const include_reserves = true;
	const include_idles = true;
	const city_id = 1;
	if (badBit) return false;


	const bidObj = {
		fio: custName,
		phone: custPhone,
		car_id: 9,
		begin: begin,
		end: end,
		begin_place_id: receivePlaceId,
		end_place_id: returnPlaceId,
		prepayment: 0,
		file: '',
	}

		;
	const bidForm = objToFormData(bidObj);

	// const bid = await sendRequest(bidForm);
	// if (bid.bid_id) {
	// 	$(`#bookButtonId`).text('Поздравляем! Заявка на бронироавние успешно отправлена!');
	// 	$(`#bookButtonId`).removeClass('book__btn');
	// 	$(`#bookButtonId`).addClass('book__btn_send');
	// 	dataFromServer.dataSent = true;
	// }
	return true;
}
//-------------------------------------------------------------------------------------------------
/**
 * @function
 * @param {number} percent
 * @returns {Date} HH:MM
 * @description convert percent to HH:MM
 * 
*/
function percentsToTime(percent) {
	//проценты это шаги по 15 минут, 1 процент - 15 минут
	const minutes = percent * 15;

	const milisecondsPerMinutes = 1000 * 60 * minutes;
	//convert Thu, 01 Jan 1970 12:00:00 GMT
	//to 12:00
	return (new Date(milisecondsPerMinutes).toUTCString().split(' ')[4]).slice(0, 5);
}

//-------------------------------------------------------------------------------------------------
/**
 * @function
 * @description transfers the time input to the display field 
*/
function transferReceiveTime() {

	const time = percentsToTime($(this).val());
	const data = $('#leftDate').val();
	const date = data.length > 0 ? data.split(' ')[0] : '';
	if (date === '') return;
	$('#leftDate').val(`${date} ${time}`);
}
//-------------------------------------------------------------------------------------------------
/**
 * @function
 * @description transfers the time input to the display field 
*/
function transferReturnTime() {
	const time = percentsToTime($(this).val());
	const data = $('#rightDate').val();
	const date = data.length > 0 ? data.split(' ')[0] : '';
	if (date === '') return;
	$('#rightDate').val(`${date} ${time}`);
}
//-------------------------------------------------------------------------------------------------
/**
 * @function
 * @description checking input of phone number and show results
*/
function checkingInputPhone() {
	const inx = customerPhone.inx;
	if (validationPhone($(`#${customerPhone.id}`).val())) {
		state[inx] = true;
		coloringBorder(inx, fieldClasses.validationPassed);
		deColoringBorder(inx, fieldClasses.validationFailed);
		return;
	}
	state[inx] = false;
	coloringBorder(inx, fieldClasses.validationFailed);
	deColoringBorder(inx, fieldClasses.validationPassed);
}
/**
 * @function
 * @param {object} namespace
 * @param {function} validator
 * 
 * @description universal handler which colored border of element (namespace) on dependies of validation
*/
function inputHandler(namespace, validator) {
	return () => {
		const inx = namespace.inx;
		if (validator($(`#${namespace.id}`).val())) {
			state[inx] = true;
			coloringBorder(inx, fieldClasses.validationPassed);
			deColoringBorder(inx, fieldClasses.validationFailed);
			return;
		}
		state[inx] = false;
		coloringBorder(inx, fieldClasses.validationFailed);
		deColoringBorder(inx, fieldClasses.validationPassed);
	}
}
/**
 * @function
 * @type {void}
 * @description function with side effect: set class on agreement field, if all checkbox are checked, and managment of lawAgreement
*/

function lawAgreementHandlerAgeExpr() {
	return () => {
		lawAgreement[ageExpInx] = lawAgreement[ageExpInx] === true ? false : true;

		if (lawAgreement[ageExpInx] && lawAgreement[agreePolicyInx]) {
			$(`#${lawAgreementNamespace.id}`).addClass(fieldClasses.validationPassed);

			state[lawAgreementNamespace.inx] = true;
		}
		else if (!lawAgreement[ageExpInx] || !lawAgreement[agreePolicyInx]) {
			$(`#${lawAgreementNamespace.id}`).removeClass(fieldClasses.validationPassed);
			state[lawAgreementNamespace.inx] = false;
		}
	}
}

/**
 * @function
 * @type {void}
 * @description function with side effect: set class on agreement field, if all checkbox are checked, and managment of lawAgreement
*/
function lawAgreementHandlerAgreePolicy() {
	return () => {
		lawAgreement[agreePolicyInx] = lawAgreement[agreePolicyInx] === true ? false : true;
		if (lawAgreement[ageExpInx] && lawAgreement[agreePolicyInx]) {
			$(`#${lawAgreementNamespace.id}`).addClass(fieldClasses.validationPassed);
			state[lawAgreementNamespace.inx] = true;
		}

		else if (!lawAgreement[ageExpInx] || !lawAgreement[agreePolicyInx]) {
			$(`#${lawAgreementNamespace.id}`).removeClass(fieldClasses.validationPassed);
			state[lawAgreementNamespace.inx] = false;
		}
	}
}
/**
 * @function
 * @description managment state of receivePlace
 * 
 * */

function receivePlaceHandle() {
	const val = $('#receivePlaceSelect').val();
	if (val != '') {
		state[receivePlace.inx] = true;
		coloringBorder(receivePlace.inx, fieldClasses.validationPassed);
	}
	else {
		state[receivePlace.inx] = false;
		deColoringBorder(receivePlace.inx, fieldClasses.validationPassed);
	}
}



/**
 * @function
 * @description managment state of returnPlace
 * 
 * */

function returnPlaceHandle() {
	const val = $('#returnPlaceSelect').val();
	if (val != '') {
		state[returnPlace.inx] = true;
		coloringBorder(returnPlace.inx, fieldClasses.validationPassed);
	}
	else {
		state[returnPlace.inx] = false;
		deColoringBorder(returnPlace.inx, fieldClasses.validationPassed);
	}
}

/**
 * @function
 * @callback
*/
function carPreview() {
	const currCar = dataFromServer.getCurrentCar();
	if (!currCar) return;
	/*
	тут убираем цвет, а после его выбора, надпись обновится
	*/
	//0 потому что все машине в массиве отличаются только цветом
	const car = currCar[0].model.replace(/\([^\s]+\)/, ''); //убираем цвет
	$('#carName').text(`Аренда: ${car}`);
}

/**
 * @function
 * @callback
*/
function datePreview() {
	const begin = reformDate($(`#leftDate`).val());
	const end = reformDate($(`#rightDate`).val());
	$(`#periodRent`).text(translateDate(begin, end));
}

/**
 * @function
 * @callback
*/
async function costPreview() {

	const begin = reformDate($(`#leftDate`).val());
	const end = reformDate($(`#rightDate`).val());
	let receivePlaceId = dataFromServer.getPlaceId($(`#receivePlaceSelect`).val());
	receivePlaceId = receivePlaceId ? receivePlaceId : dataFromServer.getFreePlace();
	let returnPlaceId = dataFromServer.getPlaceId($(`#returnPlaceSelect`).val());
	returnPlaceId = returnPlaceId ? returnPlaceId : dataFromServer.getFreePlace();


	if (!begin || !end) {
		const deliveryCost = dataFromServer.getDeliveryCost(receivePlaceId) + dataFromServer.getDeliveryCost(returnPlaceId);
		const resolution = `Итого: ${deliveryCost} ₽`;
		$(`#bidCost`).text(`Cтоимость доставки авто ${deliveryCost} ₽`);
		$(`#resolution`).text(resolution);
		return;
	}

	const bidCostObj = {
		car_id: 9,
		begin: begin,
		end: end,
		begin_place_id: receivePlaceId,
		end_place_id: returnPlaceId,
	}


	const bidCost = await getCost(bidCostObj);

	const deliveryCost = dataFromServer.getDeliveryCost(receivePlaceId) + dataFromServer.getDeliveryCost(returnPlaceId);

	const depositStr = `+ залог (возвращаем полностью по окончанию аренды) ${bidCost.deposit} ₽`

	const resolution = `Итого: ${bidCost.cost + bidCost.deposit + deliveryCost} ₽`;

	if (deliveryCost > 0) $(`#bidCost`).text(`Cтоимость аренды ${bidCost.cost - deliveryCost} ₽ + доставка авто ${deliveryCost} ₽`);
	else $(`#bidCost`).text(`Cтоимость аренды: ${bidCost.cost} ₽ `);

	$(`#deposit`).text(depositStr);
	$(`#resolution`).text(resolution)
}
/**
 * @function
 * @callback
*/
function showCustomReceivePlaceInput() {

	if ($(this).val() === 'Другое место... + 300 ₽') {
		$(`#receiveCustomPlace`).removeClass('customPlace-hidden');
		$(`#receiveCustomPlace`).addClass('customPlace-visible');
	}
	else{

		$(`#receiveCustomPlace`).addClass('customPlace-hidden');
		$(`#receiveCustomPlace`).removeClass('customPlace-visible');
	}

}
/**
 * @function
 * @callback
*/
function showCustomReturnPlaceInput() {
	if ($(this).val() === 'Другое место... + 300 ₽') {
		$(`#returnCustomPlace`).removeClass('customPlace-hidden');
		$(`#returnCustomPlace`).addClass('customPlace-visible');
	}
	else{

		$(`#returnCustomPlace`).addClass('customPlace-hidden');
		$(`#returnCustomPlace`).removeClass('customPlace-visible');
	}
}


function hideCal() {
	$(`.ex-inputs-picker`).removeClass('ex-inputs-picker-visible');
}

let firstDateIsSelect = false;
let secondDateIsSelect = false;
let firstDate = '';
function isDateShouldBeDisabled(timestamp) {

	let dt0 = new Date().toLocaleDateString().split(' ')[0];
	let dt1 = timestamp.toLocaleDateString().split(' ')[0];
	dt0 = dt0.split('.');
	dt0 = new Date(dt0[2], dt0[1], dt0[0]);

	dt1 = dt1.split('.');
	dt1 = new Date(dt1[2], dt1[1], dt1[0]);

	if (dt0 > dt1)
		return true;
	if (firstDateIsSelect) {
		dt0 = firstDate.toLocaleDateString().split(' ')[0];
		dt0 = dt0.split('.');
		dt0 = new Date(dt0[2], dt0[1], dt0[0]);
		if ((dt1 - dt0) > (1000 * 60 * 60 * 24 * 29)) return true;
		if ((dt1 - dt0) < (-1000 * 60 * 60 * 24 * 29)) {
			return true;
		}
	}
}