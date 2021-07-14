
const queryString = {
	stringify: (params) => {
		if (!params) return;
		return Object.keys(params).map(key => key + '=' + params[key]).join('&');
	}
}
async function getRequestBuilder(urlSuffix, query) {
	let url = '';
	query ? url = `${server}:${port}/${dataApiEndpoint}/${urlSuffix}?${query}`
		:
		url = `${server}:${port}/${dataApiEndpoint}/${urlSuffix}`;
	const token = await getAccess();
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
	});
	return res.json();
}

async function getTarrifs(reqObj) {
	return (await getRequestBuilder('tariff_list', queryString.stringify(reqObj))).cars;
}

async function getCityList() {
	return (await getRequestBuilder('city_list', {})).cities;
}
async function getCarList() {
	return (await getRequestBuilder('car_list', {})).cars;
}
async function getServiceTypeList() {
	return getRequestBuilder('service_type_list', {});
}
async function getServiceList() {
	return getRequestBuilder('service_list', {});
}
async function getPlaceList() {
	return (await getRequestBuilder('place_list', {}));
}
async function getCarFreeList(reqObj) {
	return (await getRequestBuilder('car_free_list', queryString.stringify(reqObj))).cars;
}
async function getCarPeriodList(reqObj) {
	return (await getRequestBuilder('car_period_list', queryString.stringify(reqObj))).car_periods;
}

async function getCost(reqObj) {
	return (await getRequestBuilder('bid_cost', queryString.stringify(reqObj, { arrayFormat: 'bracket' })));
}

async function sendRequest(body){
	const urlSuffix = 'bid_create';
	let url = `${server}:${port}/${dataApiEndpoint}/${urlSuffix}`;
	const token = await getAccess();
	const res = await fetch(url, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
		body: body,
	});
	return res.json();
}
