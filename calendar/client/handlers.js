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
	let [dt, time] = date.split(' ');
	dt = dt.split('.').reverse().join('-');

	return `${dt} ${time}`;
}
/**
 * @function
 * @description "book" button handler the function should collect data from the fields, transform the data and send it to the server
 * 
*/
function bookCar() {
	let badBit = false;
	state.forEach((el, inx) => {
		if (!el) {
			coloringBorder(inx, fieldClasses.validationFailed);
			console.log(inx);
			badBit = true;
		}
		else {
			coloringBorder(inx, fieldClasses.validationPassed);
		}
	})
	// const begin = '2021-07-07 00:00';

	const custName = `${$(`#${customerName.id}`).val()} -`
	const custPhone = `${$(`#${customerPhone.id}`).val()}`;
	const car_id = 9;
	const begin = reformDate($(`#leftDate`).val());
	const end = reformDate($(`#rightDate`).val());
	const place_id = 4;
	const include_reserves = true;
	const include_idles = true;
	const city_id = 1;


	if (badBit) return false;

	$(`#${customerPhone.id}`).val();
	$(`#${proofOfAgeAndExperience.id}`).val();
	$(`#${agreementWithPolicy.id}`).val();
	$(`#receivePlaceSelect`).val();
	$(`#returnPlaceSelect`).val();

	const form = new FormData();
	form.append('fio', custName);
	form.append('phone', custPhone);
	form.append('car_id', car_id);
	form.append('begin', begin);
	form.append('end', end);
	form.append('begin_place_id', place_id);
	form.append('end_place_id', place_id);
	form.append('services', JSON.stringify([]));
	form.append('prepayment', 0);
	form.append('file', '');



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