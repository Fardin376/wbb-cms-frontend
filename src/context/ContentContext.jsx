import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fetchPublicContent } from '../utils/api';

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [researchPosts, setResearchPosts] = useState([]);
  const [articlePosts, setArticlePosts] = useState([]);
  const [noticePosts, setNoticePosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [menus, setMenus] = useState([]);
  const [footerLinks, setFooterLinks] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [researchAndPublications, setResearchAndPublications] = useState([]);

  const [cache, setCache] = useState({
    timestamp: null,
    data: null,
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const processPost = useCallback(
    (post) => ({
      ...post,
      coverImg: post.coverImg || null,
      category: post.category || null,
      pages: Array.isArray(post.pages) ? post.pages : [],
      pdfs: Array.isArray(post.pdfs)
        ? post.pdfs.map((pdf) => ({
            ...pdf,
            url: pdf.url || `/public/download/pdf/${pdf.id}`,
          }))
        : [],
      createdAt: post.createdAt
        ? new Date(post.createdAt).toISOString()
        : new Date().toISOString(),
      slug: post.slug || '',
      title: {
        en: post.title?.en || '',
        bn: post.title?.bn || '',
      },
      content: {
        en: post.content?.en || '',
        bn: post.content?.bn || '',
      },
    }),
    []
  );
  

  const categorizePost = useCallback((post) => {
    const type = post?.category?.type?.toLowerCase();
    return {
      isFeatured: !!post.isFeatured,
      isResearchOrPublication: ['research', 'publications'].includes(type),
      isArticleOrNews: ['articles', 'news'].includes(type),
      isNotice: ['other'].includes(type),
    };
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      // Check cache first
      if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
        const { posts, pages, menus } = cache.data;
        setPosts(posts);
        setPages(pages);
        setMenus(menus);
        setLoading(false);
        return;
      }

      const [postsRes, pagesRes, menusRes, footerRes] = await Promise.all([
        fetchPublicContent('posts'),
        fetchPublicContent('pages'),
        fetchPublicContent('menu'),
        fetchPublicContent('all-footer-links'),
      ]);

      console.log('Footer API Response:', footerRes); // Debug response

      // Initialize variables at a higher scope
      let processedPosts = [];
      let validPages = [];
      let validMenus = [];

      if (postsRes.success && postsRes.posts) {
        // Debug log raw posts data
        console.log('Raw posts data:', postsRes.posts);

        processedPosts = postsRes.posts.map(processPost);

        // Debug log processed posts
        console.log(
          'Processed posts with pages:',
          processedPosts.map((p) => ({
            id: p._id,
            title: p.title,
            pages: p.pages,
          }))
        );

        // Categorize posts
        const categorizedPosts = processedPosts.reduce(
          (acc, post) => {
            const categories = categorizePost(post);

            if (categories.isFeatured) acc.featured.push(post);
            if (categories.isResearchOrPublication) {
              acc.research.push(post);
              acc.researchAndPubs.push(post);
            }
            if (categories.isArticleOrNews) acc.articles.push(post);
            if (categories.isNotice) acc.notices.push(post);

            return acc;
          },
          {
            featured: [],
            research: [],
            researchAndPubs: [],
            articles: [],
            notices: [],
          }
        );

        if (Array.isArray(footerRes.footers)) {
          setFooterLinks(footerRes.footers);
          console.log('Footer links updated:', footerRes.footers);
        } else {
          console.error('Invalid footer response:', footerRes);
        }

        setPosts(processedPosts);
        setFeaturedPosts(categorizedPosts.featured);
        setResearchPosts(categorizedPosts.research);
        setResearchAndPublications(categorizedPosts.researchAndPubs);
        setArticlePosts(categorizedPosts.articles);
        setNoticePosts(categorizedPosts.notices);
      }

      if (pagesRes.success) {
        validPages = pagesRes.pages.map((page) => ({
          ...page,
          slug: page.slug.replace(/^\/+|\/+$/g, ''),
          hasTemplate: !!page.template,
          layout: page.layout || null,
        }));

        console.log('Valid pages:', validPages);
        setPages(validPages);
      }

      if (menusRes.success) {
        const processMenuItems = (items, parentPath = '') => {
          return items.map((menu) => {
            const normalizedSlug = menu.slug?.replace(/^\/+|\/+$/g, '');
            const fullPath = parentPath
              ? `${parentPath}/${normalizedSlug}`
              : normalizedSlug;

            return {
              ...menu,
              slug: normalizedSlug,
              href: normalizedSlug ? `/pages/${fullPath}` : '/',
              children: menu.children?.length
                ? processMenuItems(menu.children, fullPath)
                : [],
            };
          });
        };

        validMenus = processMenuItems(menusRes.menus);
        console.log('Valid menus:', validMenus);
        setMenus(validMenus);
      }

      // Update cache
      setCache({
        timestamp: Date.now(),
        data: {
          posts: processedPosts,
          pages: validPages,
          menus: validMenus,
        },
      });
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cache, CACHE_DURATION, processPost, categorizePost]);

  const forceRefresh = () => {
    setCache({ timestamp: null, data: null });
    fetchContent();
  };

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Debug logs
  useEffect(() => {
    console.log('All posts:', posts.length);
    console.log('Featured posts:', featuredPosts.length);
    console.log('Research posts:', researchPosts.length, researchPosts);
    console.log('Article posts:', articlePosts.length);
    console.log('Notice posts:', noticePosts.length);
  }, [posts, featuredPosts, researchPosts, articlePosts, noticePosts]);

  return (
    <ContentContext.Provider
      value={{
        posts,
        featuredPosts,
        researchPosts,
        articlePosts,
        noticePosts,
        researchAndPublications,
        pages,
        menus,
        footerLinks,
        loading,
        error,
        refreshContent: fetchContent,
        forceRefresh: forceRefresh,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
ContentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
