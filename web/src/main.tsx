import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
	Navigate,
	RouterProvider,
	createBrowserRouter,
} from 'react-router-dom';
import { Layout } from './layouts/Layout/Layout.tsx';
import { LoginPage } from './pages/Login/Login.tsx';
import { Loader } from './components/ui/Loader/Loader.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { RegisterPage } from './pages/Register/Register.tsx';
import { AccountPage } from './pages/Account/AccountPage.tsx';
import { ResetPage } from './pages/Reset/Reset.tsx';
import { initFirebase } from './helpers/firebase.ts';
import RecipeForm from './components/domain/RecipeForm/RecipeForm.tsx';
import { RecipeNewPage } from './pages/RecipeNew/RecipeNewPage.tsx';
import { RecipePage } from './pages/Recipe/RecipePage.tsx';

const RecipesPage = lazy(() => import('./pages/Recipes/Recipes'));

initFirebase();
const Router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <Navigate to='recipes'></Navigate>,
			},
			{
				path: '/recipes',
				element: (
					<Suspense fallback={<Loader size='big' />}>
						<RecipesPage />
					</Suspense>
				),
			},
			{
				path: '/auth/login',
				element: <LoginPage />,
			},
			{
				path: '/auth/register',
				element: <RegisterPage />,
			},
			{
				path: '/account/',
				element: <AccountPage />,
			},
			{
				path: '/account/:path',
				element: <AccountPage />,
			},
			{
				path: '/account/:path',
				element: <AccountPage />,
			},
			{
				path: '/auth/reset/:link',
				element: <ResetPage />,
			},
			{
				path: '/new',
				element: <RecipeNewPage />,
			},
			{
				path: '/recipes/:id',
				element: <RecipePage />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={Router}></RouterProvider>
		</Provider>
	</React.StrictMode>
);
