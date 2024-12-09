import { useState, useEffect } from 'react';
import axios from 'axios';

export const useContentRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/public/pages`
        );

        if (response.data.success) {
          setRoutes(response.data.pages);
        }
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return { routes, loading, error };
};
