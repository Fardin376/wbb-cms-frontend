import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Container from '../component/layer/Container';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timeout = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600">Redirecting to home page...</p>
      </div>
    </Container>
  );
};

export default NotFound; 