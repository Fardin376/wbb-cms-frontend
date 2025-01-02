import React from 'react';

const ActivitySlider = React.lazy(() => import('./ActivitySlider'));
const Banner = React.lazy(() => import('./Banner'));
const DynamicPage = React.lazy(() => import('./DynamicPage'));
const Footer = React.lazy(() => import('./Footer'));
const History = React.lazy(() => import('./History'));
const LangSwitcher = React.lazy(() => import('./LangSwitcher'));
const MainFooter = React.lazy(() => import('./MainFooter'));
const MainHeader = React.lazy(() => import('./MainHeader'));
const MainHeaderSmall = React.lazy(() => import('./MainHeaderSmall'));
const Media = React.lazy(() => import('./Media'));
const MediaFooter = React.lazy(() => import('./MediaFooter'));
const Navbar = React.lazy(() => import('./Navbar'));
const Navigation = React.lazy(() => import('./Navigation'));
const NotFound = React.lazy(() => import('./NotFound'));
const PostDetails = React.lazy(() => import('./PostDetails'));
const Research = React.lazy(() => import('./Research'));
const RootLayout = React.lazy(() => import('./RootLayout'));
const TopHeader = React.lazy(() => import('./TopHeader'));

const Container = React.lazy(() => import('./layer/Container'));
const Copyright = React.lazy(() => import('./layer/Copyright'));
const CustomBtn = React.lazy(() => import('./layer/CustomBtn'));
const HeadingText = React.lazy(() => import('./layer/HeadingText'));
const MediaLink = React.lazy(() => import('./layer/MediaLink'));
const MediaSlider = React.lazy(() => import('./layer/MediaSlider'));
const SliderCard = React.lazy(() => import('./layer/SliderCard'));
const ViewAllPosts = React.lazy(() => import('./layer/ViewAllPosts'));

export {
  ActivitySlider,
  Banner,
  DynamicPage,
  Footer,
  History,
  LangSwitcher,
  MainFooter,
  MainHeader,
  MainHeaderSmall,
  Media,
  MediaFooter,
  Navbar,
  Navigation,
  NotFound,
  PostDetails,
  Research,
  RootLayout,
  TopHeader,
  Container,
  Copyright,
  CustomBtn,
  HeadingText,
  MediaLink,
  MediaSlider,
  SliderCard,
  ViewAllPosts,
};