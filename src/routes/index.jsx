import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../component/RootLayout';
import { Suspense, lazy } from 'react';

import { DynamicPage } from '../component';
const Home = lazy(() => import('../component/pages/Home'));
const PostDetails = lazy(() => import('../component/PostDetails'));
const ViewAllPosts = lazy(() => import('../component/layer/ViewAllPosts'));
const Gallery = lazy(() => import('../component/Gallery'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/home',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/pages/:slug(*)',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicPage />
          </Suspense>
        ),
      },
      {
        path: '/posts/:slug',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PostDetails />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicPage />
          </Suspense>
        ),
      },

      {
        path: '/research',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ViewAllPosts
              category="research"
              titleEn="Research"
              titleBn="গবেষণা"
            />
          </Suspense>
        ),
      },
      {
        path: '/publications',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ViewAllPosts
              category="research"
              titleEn="Publications"
              titleBn="প্রকাশনা"
            />
          </Suspense>
        ),
      },
      {
        path: '/news-and-articles',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ViewAllPosts
              category="article"
              titleEn="News and Articles"
              titleBn="সংবাদ এবং নিবন্ধ"
            />
          </Suspense>
        ),
      },
      {
        path: '/media-center',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ViewAllPosts
              category="notice"
              titleEn="Media Center"
              titleBn="মিডিয়া সেন্টার"
            />
          </Suspense>
        ),
      },
      {
        path: '/photo',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Gallery />
          </Suspense>
        ),
      },
      {
        path: '/video',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Gallery />
          </Suspense>
        ),
      },
    ],
  },
]);
