/**
 * @file carSelector.js
 * @module client/components/carSelector.js
*/






async function getCarsAndTariffs (){
	dataFromServer.carList = await getCarList();

	for (let i = 0; i < dataFromServer.carList.length; ++i) {
		const tarifObj = {
			car_id: dataFromServer.carList[i].car_id,
		}
		dataFromServer.tariffsList.push(await getTarrifs(tarifObj));
	}
}