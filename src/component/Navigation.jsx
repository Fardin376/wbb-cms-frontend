import { Link } from 'react-router-dom';

// In your navigation component
const renderLink = (item) => {
  if (item.isExternal) {
    return (
      <a 
        href={item.href} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {item.name}
      </a>
    );
  }
  
  return (
    <Link to={item.href}>
      {item.name}
    </Link>
  );
}; 