import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page';
import './index.css';
import Index from './routes';
import Contact, { action as contactAction, loader as contactLoader } from './routes/contact';
import { action as destroyAction } from './routes/destroy';
import EditContact, { action as editAction } from './routes/edit';
import Root, { action as rootAction, loader as rootLoader } from './routes/root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <Index />, errorElement: <ErrorPage /> },
      {
        path: 'contacts/:contactId',
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
        errorElement: <ErrorPage />
      },
      {
        path: 'contacts/:contactId/edit',
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
      {
        path: 'contacts/:contactId/destroy',
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
