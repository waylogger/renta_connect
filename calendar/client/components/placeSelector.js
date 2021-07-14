
/**
 * @file placeSelector.js
 * @module client/components/placeSelector.js
*/

/**
 * @function
 * @param {string} place
 * @param {number} price
*/
function createOption(data) {
	return `
		<option>
			<span>
				${data}
			</span>
		</option>
	`
}

async function createPlaceSelect(){
	let placeHTML = createOption('');

	dataFromServer.placesToReceiveOrReturnCar = (await getPlaceList()).places;
	dataFromServer.placesToReceiveOrReturnCar.splice(0, 3);

	dataFromServer.placesToReceiveOrReturnCar.forEach((item, el) => {
		const rStr = item.delivery_cost > 0 ? createOption(`${item.title} + ${item.delivery_cost} ₽`) 
		: createOption(`${item.title}`);
		placeHTML += rStr;
	});
	$(`#receivePlaceSelect`).html(placeHTML);
	$(`#returnPlaceSelect`).html(placeHTML);
};