import Container from './layer/Container';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import '../App.css';
import { useContent } from '../hooks/useContent';
import { useLanguage } from '../hooks/useLanguage';
import PropTypes from 'prop-types';

const Li = ({ text, href, children, className, icon, onClick, linkClass }) => {
  return (
    <li
      onClick={onClick}
      className={`text-[13.5px] font-inter text-white relative transition-all duration-300 ${className}`}
    >
      <Link
        to={href}
        className={`py-2 px-2.5 flex items-center gap-x-2 ${linkClass}`}
      >
        {text} {icon}
      </Link>
      {children}
    </li>
  );
};

Li.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  linkClass: PropTypes.string,
};

Li.defaultProps = {
  className: '',
  linkClass: '',
  children: null,
  icon: null,
  onClick: () => {},
};

const MainHeader = () => {
  const { menus } = useContent();
  const { language } = useLanguage();

  // Function to sort menu items by 'order' property
  const sortMenus = (menuArray) => {
    return menuArray
      .slice() // Create a shallow copy to avoid mutating the original array
      .sort((a, b) => a.order - b.order)
      .map((menu) => ({
        ...menu,
        children: menu.children ? sortMenus(menu.children) : [],
      }));
  };

  // Sort menus and their children
  const sortedMenus = menus ? sortMenus(menus) : [];

  const renderSubMenu = (children, isNested = false) => {
    if (!children?.length) return null;

    return (
      <ul
        className={`
        absolute duration-300 flex flex-col gap-y-2 z-50 p-2
        bg-[#202020ee] rounded-md
        ${isNested ? 'left-full top-0 w-60' : 'top-full w-60'}
      `}
      >
        {children.map((child) => renderMenuItem(child, true))}
      </ul>
    );
  };

  const renderMenuItem = (menu, isChild = false) => {
    if (!menu) return null;

    const hasChildren = menu.children?.length > 0;

    return (
      <Li
        key={menu.id}
        text={language === 'en' ? menu.titleEn : menu.titleBn}
        href={menu.url || menu.slug || '#'}
        className={`
          ${hasChildren ? 'has-submenu' : ''} 
          
          ${isChild ? 'w-full hover:bg-[#303030] rounded-md' : ''}
        `}
        icon={hasChildren ? isChild ? <FaAngleRight /> : <FaAngleDown /> : null}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
          }
        }}
      >
        {hasChildren && renderSubMenu(menu.children, isChild)}
      </Li>
    );
  };

  // if (loading) {
  //   return (
  //     <div className="main bg-black">
  //       <Container className="flex justify-between items-center px-3 py-3">
  //         <div className="logo">
  //           <img className="w-full" src={logo} alt="Logo" />
  //         </div>
  //         <div className="loading text-white">Loading menu...</div>
  //       </Container>
  //     </div>
  //   );
  // }

  return (
    <div className="main bg-black">
      <Container className="flex justify-between items-center px-3 py-3">
        <Link className="logo" to="/">
          <img className="w-full" src={logo} alt="Logo" />
        </Link>
        <nav className="menu morph font-inter">
          <ul className="xl:flex gap-x-1">
            {Array.isArray(sortedMenus) &&
              sortedMenus.map((menu) => renderMenuItem(menu))}
          </ul>
        </nav>
      </Container>
    </div>
  );
};

export default MainHeader;
