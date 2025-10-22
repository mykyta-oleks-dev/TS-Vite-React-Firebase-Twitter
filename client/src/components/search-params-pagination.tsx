import {
	generateNextPageParamsString,
	generatePageParamsString,
	generatePrevPageParamsString,
} from '@/handlers/pagination';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from './ui/pagination';
import { MAX } from '@/constants/pagination';

type PostsListPaginationProps = Readonly<{
	searchParams: URLSearchParams;
	page: number;
	maxPage?: number;
	neighbours?: number;
}>;

const SearchParamsPagination = ({
	searchParams,
	page,
	maxPage = MAX,
	neighbours = 2,
}: PostsListPaginationProps) => {
	const pages = Array.from(
		{ length: 1 + neighbours * 2 },
		(_, i) => page - neighbours + i
	).filter((i) => i > 0 && i <= maxPage);

	const firstPage = pages[0];

	const lastPage = pages.at(-1);

	const isOnFirstPage = page <= 1;

	const isOnLastPage = page >= maxPage;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationFirst
						to={generatePageParamsString(searchParams, 1)}
						aria-disabled={isOnFirstPage}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationPrevious
						to={generatePrevPageParamsString(searchParams, page)}
						aria-disabled={isOnFirstPage}
					/>
				</PaginationItem>

				{firstPage > 1 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{pages.map((p) => (
					<PaginationItem key={`page-${p}`}>
						<PaginationLink
							to={generatePageParamsString(searchParams, p)}
							isActive={p === page}
						>
							{p}
						</PaginationLink>
					</PaginationItem>
				))}

				{lastPage && lastPage < maxPage && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				<PaginationItem>
					<PaginationNext
						to={generateNextPageParamsString(
							searchParams,
							page,
							maxPage
						)}
						aria-disabled={isOnLastPage}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLast
						to={generatePageParamsString(searchParams, maxPage)}
						aria-disabled={isOnLastPage}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default SearchParamsPagination;
