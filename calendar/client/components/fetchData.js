
const promises = [];
promises.push(createPlaceSelect());
promises.push(getCarsAndTariffs());

Promise.all(promises).then(() => {
}).catch(err => {
	throw (err);
});