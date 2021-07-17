/**
 * @file dataFromServer.js
 * @module clietn/state/dataFromServer.js
*/


/**
 * @constant
*/
const month = {
	[1]: 'Январь',
	[2]: 'Февраль',
	[3]: 'Март',
	[4]: 'Апрель',
	[5]: 'Май',
	[6]: 'Июнь',
	[7]: 'Июль',
	[8]: 'Август',
	[9]: 'Сентябрь',
	[10]: 'Октябрь',
	[11]: 'Ноябрь',
	[12]: 'Декабрь',
}
/**
 * @function
 * @param {string} monthStr
 * @returns {number}
*/
function translateMonth(monthStr) {
	return (Object.keys(month).filter(
		(item) => {
			return month[item] === monthStr
		}
	))[0];
}
/**
 * @constant
 * @property {Array} placeToReceiveOrReturnCar=[]
*/
const dataFromServer = {
	placesToReceiveOrReturnCar: [], //fill by components/placeSelector.js
	carList: [],
	tariffsList: [],
	currentCar: '',
	/**
	 * @property {function} getPlaceId
	 * @returns {number} 
	 * @description фильтруем placeToReceiveOrReturnCar по полученному аргументу, возвращаем Id найденной записи
	*/
	getPlaceId: (place) => {
		if (!place) return undefined;
		place = place.split(' + ');
		if (place.length != 2) {
			return dataFromServer.placesToReceiveOrReturnCar[0].place_id;
		}
		place = place[0];

		const id = dataFromServer.placesToReceiveOrReturnCar.filter(a =>
			a.title === place
		)[0].place_id;
		return id;
	},
	/**
	 * @function
	 * @returns {number} id of place with free delivery cost
	*/
	getFreePlace: () => {
		const freePlace = dataFromServer.placesToReceiveOrReturnCar.filter(
			item => item.delivery_cost === 0
		)[0];
		return freePlace.place_id;

	},
	getDeliveryCost: (id) => {
		const place = dataFromServer.placesToReceiveOrReturnCar.filter(a => a.place_id === id)[0];
		return place ? place.delivery_cost : 0;

	},
	/**
	 * @function
	 * @param {string} carStr
	 * @example
	 * hyundai_creta -> id
	*/
	/**
	 * @function
	 * @param {string} carHashStr
	 * @returns carObject
	*/
	getCurrentCar: () => {
		const carHashStr = location.hash.slice(1, location.hash.length);
		const car = dataFromServer.carList.filter(
			(item) => {
				item = item.model.toString();
				item = item.replace(/\([^\s]+\)/, '');
				item = item.trim();
				item = item.replace(/\s/g, '_');
				item = item.toLocaleLowerCase();
				return item === carHashStr;
			}
		);
		return car;
	},
	/**
	 * @function
	 * @param {number} carId
	 * @returns {object} tarrrifs for it car
	*/
	getTarrifs: () => {

	},
	/**
	 * @constant
	*/
	dataSent: false,
	/**
	 * @function
	*/
	currentMonth: () => {
		const a = $(`#dp-cal-month-text`).text();
		return translateMonth(a);
	},
	/**
	 * @function
	 * @returns {Array}
	*/
	currentMonths: () => {
		const m = dataFromServer.currentMonth();
		const prevMonth = (m-1) === 0 ? 12 : m-1;
		const lastMonth = (m+1) === 13 ? 1 : m+1;
		return [prevMonth,m,lastMonth];
	},
	/**
	 * @function
	*/
	currentDay: () => {
		const d = $(`.dp-current`).text();
		if (d) return parseInt(d, 10);
		return;
	},
	/**
	 * @function
	 * @returns {Array} of days
	*/
	currentDays: () => {
		let days = $(`.dp-day`).toArray();
		days = days.map(
			(item, inx) => {
				return  item.id;
			}
		);
		return days;
	},
	/**
	 * @function
	*/
	currentYear: () => {
		const y = $('.dp-cal-year').text();
		if (y) return parseInt(y, 10);
		return;
	},
	/**
	 * @function
	*/
	currentYears: () => {
		const y = dataFromServer.currentYear();
		return [y-1,y,y+1];
	},
	/**
	 * @function
	 * @param {String} dayId
	 * @return {Boolean}
	*/
	needToDisable: (dayId) => {

		const dt = new Date();
		const year = dt.getFullYear();
		if (!dataFromServer.currentYear()) return undefined;

		if (year > dataFromServer.currentYear()) return true;
		return false;
	}
};








