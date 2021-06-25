

import dotenv from 'dotenv'
dotenv.config();


import { fsync, promises as fs } from 'fs';
import crypto from 'crypto'
import * as codes from './shared/codes.js'
import { nanoid } from 'nanoid';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import fetch from 'node-fetch';
import { deepStrictEqual } from 'assert';


export const secretFile = resolve(__dirname, '../secret');

export async function getSavedSecret(secFile) {
	try {
		await fs.access(secFile);
		return fs.readFile(secFile).then(a => a.toString());
	} catch (error) {
		return undefined;
	}
}
export async function saveSecret(secret, secFile) {
	try {
		await fs.access(secFile);
		await fs.writeFile(secFile, secret);
		return codes.secretSaved;
	} catch (error) {
		throw error;
		return codes.secretSavedError;
	}
}

export async function getToken(accessData) {
	if (!accessData) {
		return undefined;
	}
	const path = `${process.env.server}:${process.env.port}${process.env.signInEndpoint}`;
	console.log(JSON.stringify(accessData));
	const token = await fetch(path, {
		method: 'POST',
		body: JSON.stringify(accessData),
		headers: { 'Content-Type': 'application/json' },
	});

	return token;

}

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
	else {
		token = savedToken;
		return codes.authSuccess;
	}
}


const userName = process.env.login;
const PasswordHash = crypto.createHash(process.env.hashAlg).update(process.env.password).digest(process.env.digType);

const accessData = {
	UserName: userName,
	PasswordHash: PasswordHash,
	LongToken: false,
}

const fetchOpt = {
	method: 'POST',
	body: JSON.stringify(accessData),
}

auth(secretFile, accessData).then(a => {
	console.log(token);
})


