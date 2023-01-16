import fs from 'fs';
import { join } from 'path';

export const onPreBuild = async function ({ netlifyConfig, packageJson, inputs, utils }) {
	netlifyConfig.build.environment.REACT_APP_NAME = packageJson.name;
	netlifyConfig.build.environment.REACT_APP_VERSION = packageJson.version;

	const BASE_PATH = inputs.base;
	const REDIRECTS_SOURCE_FILE_NAME = inputs.source;
	const REDIRECTS_TARGET_FILE_NAME = `_redirects`;

	const SOURCE_PATH = join(BASE_PATH, REDIRECTS_SOURCE_FILE_NAME);
	const TARGET_PATH = join(BASE_PATH, REDIRECTS_TARGET_FILE_NAME);

	console.log(`Source path: ${SOURCE_PATH}`);
	console.log(`Target path: ${TARGET_PATH}`);

	// Read source file
	let data;
	try {
		data = await fs.readFileSync(SOURCE_PATH, 'utf8');
	} catch (error) {
		console.log(error);
		return utils.build.failBuild(`Source file is not found: ${SOURCE_PATH}`);
	}

	// Parse placeholders
	const matches = [...data.matchAll(/{{env:(\w+)\}}/gm)];

	// Replace placeholders
	for (let match of matches) {
		const nameValue = match[1];
		const defaultValue = match[2];
		const placeholder = defaultValue ? `${nameValue}\|${defaultValue}` : nameValue;
		const value = process.env[nameValue] || defaultValue;
		data = data.replace(`{{env:${placeholder}}}`, value);
		console.log(`Replacing _redirects placeholder ${placeholder} with ${value}`);
	}

	// Create empty file if target doesn't exist
	try {
		await fs.readFileSync(TARGET_PATH);
	} catch (error) {
		await fs.writeFileSync(TARGET_PATH, '');
	}

	// Write to target file
	await fs.writeFileSync(TARGET_PATH, data);
};
