import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fetchPublicContent } from '../utils/axios.config';

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [researchPosts, setResearchPosts] = useState([]);
  const [articlePosts, setArticlePosts] = useState([]);
  const [noticePosts, setNoticePosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [menus, setMenus] = useState([]);
  const [footerLinks, setFooterLinks] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [banners, setBanners] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({
    timestamp: null,
    data: null,
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const CATEGORY_MAPPING = {
    research: ['research', 'publications'],
    articles: ['articles', 'news'],
    notices: ['other'],
  };

  const processPost = useCallback((post) => {
    const isValidDate = (date) => !isNaN(Date.parse(date));

    return {
      ...post,
      category: post.category || null,
      pages: Array.isArray(post.pages) ? post.pages : [],
      pdfs: Array.isArray(post.pdfs)
        ? post.pdfs.map((pdf) => ({
            ...pdf,
            url: pdf.url || `/public/download/pdf/${pdf.id}`,
          }))
        : [],
      createdAt: isValidDate(post.createdAt)
        ? new Date(post.createdAt).toISOString()
        : new Date().toISOString(),
      slug: post.slug || '',
    };
  }, []);

  const categorizePost = useCallback((post, categories) => {
    const postCategory = categories.find((cat) => cat.id === post?.categoryId);
    const type = postCategory?.type?.toLowerCase();
    return {
      isFeatured: !!post.isFeatured,
      isResearchOrPublication:
        CATEGORY_MAPPING.research.includes(type) || false,
      isArticleOrNews: CATEGORY_MAPPING.articles.includes(type) || false,
      isNotice: CATEGORY_MAPPING.notices.includes(type) || false,
    };
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      let processedPosts = [];
      const [
        postsRes,
        pagesRes,
        menusRes,
        footerRes,
        categoryRes,
        socialRes,
        bannerRes,
        galleryRes,
      ] = await Promise.all([
        fetchPublicContent('posts/details'),
        fetchPublicContent('pages'),
        fetchPublicContent('menu'),
        fetchPublicContent('footer-links'),
        fetchPublicContent('categories'),
        fetchPublicContent('social-links'),
        fetchPublicContent('banners'),
        fetchPublicContent('images'),
      ]);

      if (postsRes.success) {
        const processedPosts = postsRes.posts.map(processPost);

        // Categorize posts dynamically
        const categorizedPosts = processedPosts.reduce(
          (acc, post) => {
            const categories = categorizePost(post, categoryRes.categories);
            if (categories.isFeatured) acc.featured.push(post);
            if (categories.isResearchOrPublication) acc.research.push(post);
            if (categories.isArticleOrNews) acc.articles.push(post);
            if (categories.isNotice) acc.notices.push(post);
            return acc;
          },
          { featured: [], research: [], articles: [], notices: [] }
        );

        setPosts(processedPosts);
        setFeaturedPosts(categorizedPosts.featured);
        setResearchPosts(categorizedPosts.research);
        setArticlePosts(categorizedPosts.articles);
        setNoticePosts(categorizedPosts.notices);

        console.log('Processed posts:', processedPosts);
        console.log('Categorized posts:', categorizedPosts);
        console.log('Featured posts:', categorizedPosts.featured);
        console.log('Research posts:', categorizedPosts.research);
        console.log('Article posts:', categorizedPosts.articles);
        console.log('Notice posts:', categorizedPosts.notices);
      }

      if (Array.isArray(footerRes.footerLinks)) {
        setFooterLinks(footerRes.footerLinks);
        console.log('Footer links updated:', footerRes.footerLinks);
      } else {
        console.error('Invalid footer response:', footerRes);
      }
      if (Array.isArray(socialRes.socialLinks)) {
        setSocialLinks(socialRes.socialLinks);
        console.log('Footer links updated:', socialRes.socialLinks);
      } else {
        console.error('Invalid footer response:', socialRes);
      }
      if (Array.isArray(bannerRes.banners)) {
        setBanners(bannerRes.banners);
        console.log('Footer links updated:', bannerRes.banners);
      } else {
        console.error('Invalid footer response:', bannerRes);
      }
      if (Array.isArray(galleryRes.images)) {
        setGallery(galleryRes.images);
        console.log('Footer links updated:', galleryRes.images);
      } else {
        console.error('Invalid footer response:', galleryRes);
      }

      let validPages = [];
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

      if (categoryRes.success) {
        setCategories(categoryRes.categories);
      }

      let validMenus = [];
      if (menusRes.success) {
        const processMenuItems = (items, parentPath = '') => {
          const itemMap = new Map();
          items.forEach((menu) => {
            const normalizedSlug = menu.slug?.replace(/^\/+|\/+$/g, '');
            const fullPath = parentPath
              ? `${parentPath}/${normalizedSlug}`
              : normalizedSlug;

            itemMap.set(menu.id, {
              ...menu,
              slug: normalizedSlug,
              href: normalizedSlug ? `/pages/${fullPath}` : '/',
              children: [],
            });
          });

          const validMenus = [];
          items.forEach((menu) => {
            if (menu.parentId) {
              const parentItem = itemMap.get(menu.parentId);
              if (parentItem) {
                parentItem.children.push(itemMap.get(menu.id));
              }
            } else {
              validMenus.push(itemMap.get(menu.id));
            }
          });

          return validMenus;
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
  }, [processPost, categorizePost]);

  const forceRefresh = () => {
    setCache({ timestamp: null, data: null });
    fetchContent();
  };

  useEffect(() => {
    const now = Date.now();
    if (
      !cache.data ||
      !cache.timestamp ||
      now - cache.timestamp > CACHE_DURATION
    ) {
      fetchContent();
    }
  }, [fetchContent, cache, CACHE_DURATION]);

  return (
    <ContentContext.Provider
      value={{
        posts,
        featuredPosts,
        researchPosts,
        articlePosts,
        noticePosts,
        pages,
        menus,
        footerLinks,
        socialLinks,
        banners,
        gallery,
        categories,
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
