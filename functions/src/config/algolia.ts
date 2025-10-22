import { algoliasearch, SearchClient } from 'algoliasearch';
import { defineString } from 'firebase-functions/params';

const APP_ID = defineString('ALGOLIA_APP_ID');
const READ_API_KEY = defineString('ALGOLIA_READ_API_KEY');
const WRITE_API_KEY = defineString('ALGOLIA_WRITE_API_KEY');
const INDEX = defineString('ALGOLIA_INDEX');

let algoliaWriteClientInstance: SearchClient | null = null;
let algoliaReadClientInstance: SearchClient | null = null;

/**
 * Lazily initializes and returns the Algolia SearchClient.
 * Parameters are resolved only when this function is called at runtime.
 */
export const getAlgoliaClient = (write?: boolean): SearchClient => {
	// Check if the client is already initialized
	if (write && algoliaWriteClientInstance) {
		return algoliaWriteClientInstance;
	}

	if (algoliaReadClientInstance) {
		return algoliaReadClientInstance;
	}

	// Resolve the parameter values at runtime using .value()
	const appId = APP_ID.value();
	const writeApiKey = WRITE_API_KEY.value();
	const readApiKey = READ_API_KEY.value();

	if (!appId || !writeApiKey || !readApiKey) {
		throw new Error('Algolia credentials are not set in the environment.');
	}

	// Initialize the client and store it
	algoliaReadClientInstance = algoliasearch(appId, readApiKey);
	algoliaWriteClientInstance = algoliasearch(appId, writeApiKey);

	return write ? algoliaWriteClientInstance : algoliaReadClientInstance;
};

export const getIndex = () => INDEX.value();
