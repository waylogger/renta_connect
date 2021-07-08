import dotenv from 'dotenv';
import {promises as fs} from 'fs';
import moment from 'moment';
import { resolve } from 'path';
import { getSavedSecret, secretFile, saveSecret, getToken, auth, tokenExpired } from './app';
import * as codes from './app/shared/codes';


describe('testing toprent15.ru API', () => {

	const noExist = "notexist";
	const goodAccessData = {
		UserName: "user",
		PasswordHash: "password",
		LongToken: false,
	}

	const badAccessData = {

	}
	beforeEach(() => {
		return fs.writeFile(secretFile,'');
	});
	test('dotenv should consist env for server, port, login, password', () => {
		expect(dotenv.config()).not.toHaveProperty('error');
		expect(process.env.NODE_ENV).toBeDefined();
		expect(process.env.port).not.toBe('');
		expect(process.env.server).not.toBe('');
		expect(process.env.login).not.toBe('');
		expect(process.env.password).not.toBe('');
		expect(process.env.hashAlg).not.toBe('');
		expect(process.env.digType).not.toBe('');
		expect(process.env.signInEndpoint).not.toBe('');
	});

	test('getSecret should get secret', async () => {
		expect(await getSavedSecret(secretFile)).toBeDefined();
		expect(await getSavedSecret(noExist)).toBeUndefined();
	});

	test('test saveSecret', async () => {
		const s0 = "secret0";
		const s1 = "secret1";
		expect(await saveSecret(s0, secretFile)).toBe(codes.secretSaved);
		expect(await saveSecret(s0, noExist)).toBe(codes.secretSavedError);
	});
	test('test getToken', async () => {


		expect(await getToken(goodAccessData)).toBeDefined();
		expect(await getToken(badAccessData)).not.toHaveProperty('status','500');
	});
	test('test auth', async () => {
		expect(await auth(secretFile,goodAccessData)).toBe(codes.authSuccess);
	});

	test('test token expired', async ()=>{
		expect(await tokenExpired({expires:moment().unix()-250})).toBe(true);
		expect(await tokenExpired({expires:moment().unix()+250})).toBe(false);
	});

});

