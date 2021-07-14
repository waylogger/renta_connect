/**
 * @file dataFromServer.js
 * @module clietn/state/dataFromServer.js
*/

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

};
