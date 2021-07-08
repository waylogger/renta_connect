

import { fsync, promises as fs } from 'fs';
import crypto from 'crypto'
import * as codes from './shared/codes.js'
import { nanoid } from 'nanoid';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import fetch from 'node-fetch';
import moment from 'moment';
// ------------------------------------------------------------------------------------------------
export const secretFile = resolve(__dirname, '../secret');
// ------------------------------------------------------------------------------------------------
export async function getSavedSecret(secFile) {
	try {
		await fs.access(secFile);
		return fs.readFile(secFile).then(a => a).then(a => JSON.parse(a));
	} catch (error) {
		return undefined;
	}
}

// ------------------------------------------------------------------------------------------------
export async function saveSecret(secret, secFile) {
	try {
		await fs.writeFile(secFile, secret);
		return codes.secretSaved;
	} catch (error) {
		return codes.secretSavedError;
	}
}
// ------------------------------------------------------------------------------------------------
export async function getToken(accessData) {
	if (!accessData) {
		return undefined;
	}
	const path = `${process.env.server}:${process.env.port}${process.env.signInEndpoint}`;
	const bdy = JSON.stringify(accessData);
	const token = await fetch(path, {
		method: 'POST',
		body: bdy,
		headers: { 'Content-Type': 'application/json' },
	}).then(res => res.json()).then(res => res);
	return token;

}
// ------------------------------------------------------------------------------------------------
export async function refreshToken(token) {
	if (!token || !token.refreshToken) {
		return undefined;
	}

	const path = `${process.env.server}:${process.env.port}${process.env.refreshEndpoint}`;
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
export async function tokenExpired(token) {
	return token.expires < moment().unix();
}
// ------------------------------------------------------------------------------------------------
export let token = "";
export async function auth(secFile, accessData) {
	const savedToken = await getSavedSecret(secFile);
	if (!savedToken) {
		token = await getToken(accessData);
		if (!token)
			return codes.authFailure;
		await saveSecret(JSON.stringify(token, null, ' '), secFile);
		return codes.authSuccess;
	}
	else if (await tokenExpired(savedToken)) {
		token = await refreshToken(savedToken);
		if (!token)
			return codes.authFailure;
		await saveSecret(JSON.stringify(token, null, ' '), secFile);
		return codes.authSuccess;
	}
	else {
		token = savedToken;
		return codes.authSuccess;
	}
}
// ------------------------------------------------------------------------------------------------
const userName = process.env.login;
// const PasswordHash = crypto.createHash(process.env.hashAlg).update(process.env.password).digest(process.env.digType);
// ------------------------------------------------------------------------------------------------
const accessData = {
	UserName: userName,
	PasswordHash: process.env.passwordHash,
}
// ------------------------------------------------------------------------------------------------
export default {
	getAccess: async () => {
		await auth(secretFile,accessData);
		return token.accessToken;
	}
}