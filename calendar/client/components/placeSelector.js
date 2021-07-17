
/**
 * @file placeSelector.js
 * @module client/components/placeSelector.js
*/

/**
 * @function
 * @param {string} place
 * @param {number} price
*/
function createOption(data, cost) {

	const freeHTML = `
	<option>
	<span>
		${data} 
	</span>
</option>
	`;

	const defHTML = `
	<option>
		<span>
			${data} <span class="book__field-cost-option"> + ${cost} ₽</span>
		</span>
	</option>
`;
	const unDefHTML =`
	<option>
		<span>
		</span>
	</option>
`;

if (data && cost){
return defHTML;
}
else if (data)
return freeHTML;
else
return unDefHTML;
}

async function createPlaceSelect(){
	let placeHTML = '';
	dataFromServer.placesToReceiveOrReturnCar = (await getPlaceList()).places;
	dataFromServer.placesToReceiveOrReturnCar.splice(0, 3);
	dataFromServer.placesToReceiveOrReturnCar.push({place_id: 164, title: "Другое место...", city_id: 4, delivery_cost: 300, archive: false});
	
	dataFromServer.placesToReceiveOrReturnCar.forEach((item, el) => {
		const rStr = item.delivery_cost > 0 ? createOption(item.title, item.delivery_cost)
		: createOption(item.title);
		placeHTML += rStr;
	});
	$(`#receivePlaceSelect`).html(placeHTML);
	$(`#returnPlaceSelect`).html(placeHTML);
};