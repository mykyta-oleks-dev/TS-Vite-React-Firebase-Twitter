import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import type { SetURLSearchParams } from 'react-router';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

const PostsSearch = ({
	searchParams,
	setSearchParams,
}: {
	searchParams: URLSearchParams;
	setSearchParams: SetURLSearchParams;
}) => {
	const [searchValue, setSearchValue] = useState<string>('');

	const handleSearch = () => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('search', searchValue);
		setSearchParams(newSearchParams);
	};

	return (
		<div className="grid w-full md:max-w-md items-center gap-3">
			<Label htmlFor="search">Search posts</Label>
			<div className="flex items-center gap-2">
				<Input
					type="text"
					id="search"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleSearch();
					}}
				/>
				<Button size="icon" variant="outline" onClick={handleSearch}>
					<SearchIcon />
				</Button>
			</div>
		</div>
	);
};

export default PostsSearch;
