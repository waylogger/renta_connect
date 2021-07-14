const server = 'http://81.177.48.80';
const port = '50500';
const passwordHash = 'f7f8e967f2756082ada759e8e189e772e00a1deb13583e9beee02ad9a5420fda5ce2069e942cdc22a8cae4ecb90ace005737c6c96dd655330f0f1ae6a0ffd8fc';
const login = 'USER_FOR_SITE';
const signInEndpoint = '/api/v1/tokens/signin';
const refreshEndpoint = '/api/v1/tokens/refresh';
const dataApiEndpoint = 'data_api'
/**
 * @namespace
*/

sessionKeys = {
	expires: 'expires',
	accessToken: 'accessToken',
	refreshToken: 'refreshToken',
}
/**
 * @function
 * @param {object}
 * @description wrap over localstorage for saving js objects
*/
function saveInSessionStorage(someObject) {
	someObject = JSON.parse(someObject);
	const keys = Object.keys(someObject);
	keys.forEach((key, el) => {
		sessionStorage.setItem(key, someObject[key]);
	});
}
/**
 * @function
 * @param {array} keys 
 * @returns {object}
 * @description convert sessionStorage to JSObject
*/
function readFromSessionStorage(keys) {
	const resObj = {};
	keys.forEach((el) => {
		const a = sessionStorage.getItem(el);
		resObj[el] = a;
	});
	return resObj;
}
// ------------------------------------------------------------------------------------------------
/**
 * @function
 * @returns sessionKeys from SessionStorage
*/
async function getSavedSecret() {
	const savedToken = readFromSessionStorage(Object.keys(sessionKeys));
	if (!savedToken.accessToken || !savedToken.refreshToken || !savedToken.expires)
	return undefined;
	else
	return savedToken;
}

// ------------------------------------------------------------------------------------------------
async function saveSecret(secret) {
	return saveInSessionStorage(secret);
}
// ------------------------------------------------------------------------------------------------
async function getToken(accessData) {
	if (!accessData) {
		return undefined;
	}

	const path = `${server}:${port}${signInEndpoint}`;
	const bdy = JSON.stringify(accessData);
	const token = await fetch(path, {
		method: 'POST',
		body: bdy,
		headers: { 'Content-Type': 'application/json' }
	}).then(res => res.json()).then(res => res);
	return token;

}
// ------------------------------------------------------------------------------------------------
async function refreshToken(token) {
	if (!token || !token.refreshToken) {
		return undefined;
	}

	const path = `${server}:${port}${refreshEndpoint}`;
	const bdy = JSON.stringify({
		Token: token.refreshToken,
	});
	const newToken = await fetch(path, {
		method: 'POST',
		body: bdy,
		headers: { 'Content-Type': 'application/json' },
	}).then(res => res.json()).then(res => res);
	return newToken;

}
// ------------------------------------------------------------------------------------------------
async function tokenExpired(token) {
	return token.expires < Math.floor(Date.now() / 1000);
}
// ------------------------------------------------------------------------------------------------
let token = "";
async function auth(accessData) {
	const savedToken = await getSavedSecret();
	if (!savedToken) {
		token = await getToken(accessData);
		if (!token)
			return 'codes.authFailure'
		await saveSecret(JSON.stringify(token, null, ' '));
		return 'codes.authSuccess';

	}
	else if (await tokenExpired(savedToken)) {
		token = await refreshToken(savedToken);
		if (!token)
			return 'codes.authFailure';
		await saveSecret(JSON.stringify(token, null, ' '));
		return 'codes.authSuccess'
	}
	else {
		token = savedToken;
		return 'codes.authSuccess'
	}
}
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
const accessData = {
	UserName: login,
	PasswordHash: passwordHash,
}
// ------------------------------------------------------------------------------------------------
async function getAccess() {
	await auth(accessData);
	return token.accessToken;
}