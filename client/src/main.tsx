import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './config/router.tsx';
import './index.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from './providers/theme';
import { QueryClientProvider } from './providers/query';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<Toaster />
				<RouterProvider router={router} />
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>
);
