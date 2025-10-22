import {
	QueryClientProvider as BaseQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { PropsWithChildren } from 'react';
import queryClient from './queryClient';

const QueryClientProvider = ({ children }: PropsWithChildren) => {
	return (
		<BaseQueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools />
		</BaseQueryClientProvider>
	);
};

export default QueryClientProvider;
