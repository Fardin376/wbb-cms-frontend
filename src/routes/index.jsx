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
        path: '/home',
        element: <Home />,
      },

      {
        path: '/pages/:slug(*)',
        element: <DynamicPage />,
      },
      {
        path: '/posts/:slug',
        element: <PostDetails />,
      },
      {
        path: '*',
        element: <DynamicPage />,
      },

      {
        path: '/research',
        element: <ViewAllPosts category="research" title="Research" />,
      },
      {
        path: '/publications',
        element: <ViewAllPosts category="research" title="Publications" />,
      },
      {
        path: '/news-and-articles',
        element: <ViewAllPosts category="article" title="News and Articles" />,
      },
      {
        path: '/media-center',
        element: <ViewAllPosts category="notice" title="Media Center" />,
      },
    ],
  },
]);
