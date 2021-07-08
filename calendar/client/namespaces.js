
/**
 * @file namespaces.js
 * @module namespaces.js
 * @author wlr961 wayloggerman@gmail.com for toprent15.ru

/**
 * @global
 * @namespace
 */
const dateObj = {
	id: 'dateListener',
	inx: 0,
	handler: () => {
	},
	errMess: 'Не выбрана начальная дата бронирования'
};

/**
 * @global
 * @namespace
 */
const receivePlace = {
	id: 'receivePlace',
	inx: 1,
	handler: () => {},
	errMess: 'Не выбрано место получения авто'
};
/**
 * @global
 * @namespace
 */
const returnPlace = {
	id: 'returnPlace',
	inx: 2,
	handler: () => {},
	errMess: 'Не выбрано место возврата авто'
};
/**
 * @global
 * @namespace
 */
const customerName = {
	id: 'customerName',
	inx: 3,
	handler: () => {},
	errMess: 'Введено некорректное имя',
};
/**
 * @global
 * @namespace
 */
const customerPhone = {
	id: 'customerPhone',
	inx: 4,
	handler: () => {},
	errMess: 'Введен некорректный номер телефона',
};
/**
 * @global
 * @namespace
 */
const proofOfAgeAndExperience = {
	id: 'proofOfAgeAndExperience',
	inx: 5,
	handler: () => {},
	errMess: 'Не подтверждены возраст и водительский стаж',
};
/**
 * @global
 * @namespace
 */
const agreementWithPolicy = {
	id: 'agreementWithPolicy',
	inx: 6,
	handler: () => {},
	errMess: 'Отсутствует согласие с политикой обработки данных',
};


/**
 * @namespace
 * @global
*/

const lawAgreementNamespace = {
	id: 'lawAgreement',
	inx: 5,
}


/**
 * @global
 * @namespace
 */

const fieldClasses = {
	validationFailed: 'validationFailed',
	validationPassed: 'validationPassed',
	validationPartedPassed: 'validationPartedPassed',
}