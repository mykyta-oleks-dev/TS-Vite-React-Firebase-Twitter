import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './config/router.tsx';
import './index.css';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Toaster />
		<RouterProvider router={router} />
	</StrictMode>
);
