import { algoliasearch, SearchClient } from 'algoliasearch';
import {
	algoliaAppId,
	algoliaIndex,
	algoliaReadApiKey,
	algoliaWriteApiKey,
} from './secrets.js';

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

	const appId = algoliaAppId.value();
	const writeApiKey = algoliaWriteApiKey.value();
	const readApiKey = algoliaReadApiKey.value();

	if (!appId || !writeApiKey || !readApiKey) {
		throw new Error('Algolia credentials are not set in the environment.');
	}

	// Initialize the client and store it
	algoliaReadClientInstance = algoliasearch(appId, readApiKey);
	algoliaWriteClientInstance = algoliasearch(appId, writeApiKey);

	return write ? algoliaWriteClientInstance : algoliaReadClientInstance;
};

export const getIndex = () => algoliaIndex.value();
