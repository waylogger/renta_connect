import auth from './auth.js';
import queryString from 'query-string'
import fetch from 'node-fetch';
import formData from 'form-data';
import moment from 'moment';




async function getRequestBuilder(urlSuffix, query) {
	let url = '';
	query ? url = `${process.env.server}:${process.env.port}/${process.env.dataApiEndpoint}/${urlSuffix}?${query}`
		:
		url = `${process.env.server}:${process.env.port}/${process.env.dataApiEndpoint}/${urlSuffix}`;
	const token = await auth.getAccess();
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
	});
	return res.json();
}
async function getCityList() {
	return (await getRequestBuilder('city_list', {})).cities;
}
async function getCarList() {
	return getRequestBuilder('car_list', {});
}
async function getServiceTypeList() {
	return getRequestBuilder('service_type_list', {});
}
async function getServiceList() {
	return getRequestBuilder('service_list', {});
}
async function getPlaceList() {
	return getRequestBuilder('place_list', {});
}
async function getCarFreeList(reqObj) {
	return (await getRequestBuilder('car_free_list', queryString.stringify(reqObj))).cars;
}
async function getTarrifs(reqObj) {
	return (await getRequestBuilder('tariff_list', queryString.stringify(reqObj))).cars;
}
async function getCarPeriodList(reqObj) {
	return (await getRequestBuilder('car_period_list', queryString.stringify(reqObj))).car_periods;
}

async function getCost(reqObj) {
	return (await getRequestBuilder('bid_cost', queryString.stringify(reqObj, { arrayFormat: 'bracket' })));
}

async function sendRequest(body){
	const urlSuffix = 'bid_create';
	let url = `${process.env.server}:${process.env.port}/${process.env.dataApiEndpoint}/${urlSuffix}`;
	const token = await auth.getAccess();
	const res = await fetch(url, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
		body: body,
	});
	return res.json();
}



(async () => {

	// const begin = '2021-11-07 00:00';
	// const end = '2021-11-25 23:59';

	const begin = '2021-07-07 00:00';
	const end = '2021-12-31 23:59';
	const include_reserves = true;
	const include_idles = true;
	const car_id = 9;
	const city_id = 1;
	const place_id = 4;
	const services = new Array(18).fill('').map((_, inx) => { return inx + 3 });


	const carFreeListQuery = {
		city_id: city_id,
		begin: begin,
		end: end,
		include_reserves: include_reserves,
		include_idles: include_idles,

	}

	const carPeriodListQuery = {
		car_id: car_id,
		begin: begin,
		end: end,
		include_reserves: include_reserves,
		include_idles: include_idles,
	}

	const costQuery = {
		car_id: car_id,
		begin: begin,
		end: end,
		begin_place_id: place_id,
		end_place_id: place_id,
		services: services,
	}
	
	const requestQuery= {
		fio: "Вот Тестовая Заявка",
		phone: "+71112223344",
		car_id: car_id,
		begin: begin,
		end: end,
		begin_place_id: place_id,
		end_place_id: place_id,
		services: services,
		prepayment: 0,
		files: '',
	}
	const form = new formData();
	form.append('fio','Вот Тестовая Заявка');
	form.append('phone','+71112223344');
	form.append('car_id',car_id);
	form.append('begin',begin);
	form.append('end',end);
	form.append('begin_place_id',place_id);
	form.append('end_place_id',place_id);
	form.append('services',JSON.stringify(services));
	form.append('prepayment',0);
	form.append('file','');
	//{ result_code: 0, bid_id: 7, bid_number: 6, error_message: null }
	// const a = await sendRequest(form);
	// console.log(a);

	
	// const cost = await getCost(costQuery);
	// console.log(cost);
	// сделаем период брони на 1 неделю 07.07.2021 до 14.07.2021
	// направим заявку на 08.07.2021
	// запросим число периодов
	// const car_period_list = await getCarPeriodList(carPeriodListQuery);
	// console.log(car_period_list);
	// const city_list = await getCityList();
	// const tarrifs = await getTarrifs({car_id});
	// const carFree = await getCarFreeList(carFreeListQuery);
	// getCarList().then(a=>console.log(a));
	// getServiceTypeList().then(a=>console.log(a));
	// getServiceList().then(a=>console.log(a));
	 getPlaceList().then(a=>console.log(a));
//	 getCityList().then(a=>console.log(a));
})()
