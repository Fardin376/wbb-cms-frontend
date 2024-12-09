import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../component/RootLayout';
import DynamicPage from '../component/DynamicPage';
import Home from '../component/pages/Home';
import PostDetails from '../component/PostDetails';
import ViewAllPosts from '../component/layer/ViewAllPosts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'research',
        element: <ViewAllPosts category="research" />,
      },
      {
        path: 'publications',
        element: <ViewAllPosts category="research" />,
      },
      {
        path: 'news-and-articles',
        element: <ViewAllPosts category="article" />,
      },
      {
        path: 'pages/:slug(*)',
        element: <DynamicPage />,
      },
      {
        path: 'posts/:slug',
        element: <PostDetails />,
      },
      {
        path: '*',
        element: <DynamicPage />,
      },
    ],
  },
]);
