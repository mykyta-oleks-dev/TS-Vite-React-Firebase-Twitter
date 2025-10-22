import type { SetURLSearchParams } from 'react-router';

// Base pagination search params generator

export const generatePageParams = (
	searchParams: URLSearchParams,
	page: number
) => {
	const newSearchParams = new URLSearchParams(searchParams);

	newSearchParams.set('page', page + '');

	return newSearchParams;
};

// Generators for prev and next

export const generatePrevPageParams = (
	searchParams: URLSearchParams,
	page: number
) => generatePageParams(searchParams, Math.max(page - 1, 1));

export const generateNextPageParams = (
	searchParams: URLSearchParams,
	page: number,
	pages = 999
) => generatePageParams(searchParams, Math.min(page + 1, pages ?? 999));

// Generators of hrefs

export const generatePageParamsString = (
	searchParams: URLSearchParams,
	page: number
) => '?' + generatePageParams(searchParams, page).toString();

export const generatePrevPageParamsString = (
	searchParams: URLSearchParams,
	page: number
) => '?' + generatePrevPageParams(searchParams, page).toString();

export const generateNextPageParamsString = (
	searchParams: URLSearchParams,
	page: number,
	pages?: number
) => '?' + generateNextPageParams(searchParams, page, pages).toString();

// Handlers for buttons

export const handlePrevPage = (
	searchParams: URLSearchParams,
	setSearchParams: SetURLSearchParams,
	page: number
) => {
	const newSearchParams = generatePrevPageParams(searchParams, page);

	setSearchParams(newSearchParams);
};

export const handleNextPage = (
	searchParams: URLSearchParams,
	setSearchParams: SetURLSearchParams,
	page: number,
	pages?: number
) => {
	const newSearchParams = generateNextPageParams(searchParams, page, pages);

	setSearchParams(newSearchParams);
};
