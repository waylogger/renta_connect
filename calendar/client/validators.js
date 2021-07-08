/**
 * @file validators.js
 * @module validators.js
 * @description include function to validate somes fields
*/
// ------------------------------------------------------------------------------------------------
/**
 * @function
 * @param {string} phoneNumber
*/
function validationPhone(phone) {
	phone = phone.replace(/[^\d]/g, '');
	phone = '+' + phone;
	if (phone.length === 12)
		return true;
	return false;
}
// ------------------------------------------------------------------------------------------------
/**
 * @function
 * @param {string} name 
 * @returns {boolean}
 * @description if name is valid - return true;
*/
function validationName(name) {
	name = name.trim();
	const names = name.split(' ');
	if (names.length != 2)
		return false;

	let badName = false;
	names.forEach((el,inx)=>{

	if (el.match(/\d|[!@#$%^&*()_+=1234567890\[\]\{\}:;\'\"\\\|<>,\./]/))
		{
			badName = true;
			return;
		}
	})
	return badName ? false : true;
}



