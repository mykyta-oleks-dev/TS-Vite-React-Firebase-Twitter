import { useEffect, useState } from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import type { SetURLSearchParams } from 'react-router';

const PostsSearch = ({
	delay,
	searchParams,
	setSearchParams,
}: {
	delay: number;
	searchParams: URLSearchParams;
	setSearchParams: SetURLSearchParams;
}) => {
	const [searchValue, setSearchValue] = useState<string>('');

	useEffect(() => {
		const debouncer = setTimeout(() => {
			if (searchValue) {
				const newSearchParams = new URLSearchParams(searchParams);
				newSearchParams.set('search', searchValue);
				setSearchParams(newSearchParams);
			}
		}, delay);

		return () => {
			clearTimeout(debouncer);
		};
	}, [searchValue, delay]);

	return (
		<div className="grid w-full md:max-w-md items-center gap-3">
			<Label htmlFor="search">Search posts</Label>
			<Input
				type="text"
				id="search"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
			/>
		</div>
	);
};

export default PostsSearch;
