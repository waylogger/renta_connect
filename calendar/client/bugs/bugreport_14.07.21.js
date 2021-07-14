/**
 * @file bugreport_14.07.21.js
 * @module client/bugs/bugreport_14.07.21.js
 * @author wlr986 <waylogger@mail.ru>
*/

/*стек вызовов*/

/**
 * вспомогательные функции для направления запроса
*/
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

async function getCarList() {
	return (await getRequestBuilder('car_list', {})).cars;
}

async function getTarrifs(reqObj) {
	return (await getRequestBuilder('tariff_list', queryString.stringify(reqObj))).cars;
}

/*обращение к серверу в синхронном стиле*/
(async () => {

	console.log("СИНХРОННЫЙ ТЕСТ:");
	let cars = await getCarList();

	for (let i = 0; i < cars.length; ++i) {
		const tarifObj = {
			car_id: cars[i].car_id,
		}
		//цикл ожидает
		const res = await getTarrifs(tarifObj);
		if (res[0].car_id != tarifObj.car_id)
			console.error(`Ошибка: ожидание тарифов для авто с id ${tarifObj.car_id}, получен тариф для авто вcid ${res[0].car_id}`);
		else
			console.log(`Результат корректен: ожидание тарифов для авто с id ${tarifObj.car_id}, получен тариф для авто c id ${res[0].car_id}`)
	}
})().then(() => {
	/*обращение к серверу в асинхронном стиле*/
	(async () => {

		console.log("АСИНХРОННЫЙ ТЕСТ:");
		let cars = await getCarList();
		const promises = []

		for (let i = 0; i < cars.length; ++i) {
			const tarifObj = {
				car_id: cars[i].car_id,
			}
			const res = getTarrifs(tarifObj);
			promises.push(res);

		}

		const res = await Promise.all(promises);

		res.forEach((item, inx) => {
			if (item[0].car_id != cars[inx].car_id)
				console.error(`Ошибка: ожидание тарифов для авто с id ${cars[inx].car_id}, получен тариф для авто c id ${item[0].car_id}`);
			else
				console.log(`Результат корректен: ожидание тарифов для авто с id ${cars[inx].car_id}, получен тариф для авто c id ${item[0].car_id}`)
		})

	})();
})

