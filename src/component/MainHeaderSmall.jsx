import { useState } from 'react';
import Container from './layer/Container';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import { IoClose } from 'react-icons/io5';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useContent } from '../hooks/useContent';
import { useLanguage } from '../hooks/useLanguage';

const Li = ({ text, href, children, className, icon, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`text-[13.5px] font-inter text-white relative transition-all duration-300 ${className}`}
    >
      <Link to={href} className="py-2 px-2.5 flex items-center gap-x-2">
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
};

Li.defaultProps = {
  className: '',
  children: null,
  icon: null,
  onClick: () => {},
};

const MainHeaderSmall = () => {
  const { menus, loading } = useContent();
  const { language } = useLanguage();
  const [menu, setMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const renderSubMenu = (children, isNested = false) => {
    if (!children?.length) return null;

    return (
      <ul
        className={`
        pl-4 mt-2 flex flex-col gap-y-2
        ${isNested ? 'border-l border-gray-700' : ''}
      `}
      >
        {children.map((child) => renderMenuItem(child, true))}
      </ul>
    );
  };

  const renderMenuItem = (menu, isChild = false) => {
    if (!menu) return null;

    const hasChildren = menu.children?.length > 0;
    const isActive = activeDropdown === menu._id;

    return (
      <Li
        key={menu._id}
        text={menu.title?.[language] || menu.title?.en || ''}
        href={menu.url || menu.slug || '/'}
        className={`
          ${hasChildren ? 'has-submenu' : ''} 
          ${isActive ? 'active bg-[#303030]' : ''}
          ${isChild ? 'hover:bg-[#303030] rounded-md w-full' : ''}
        `}
        icon={hasChildren ? isChild ? <FaAngleRight /> : <FaAngleDown /> : null}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            toggleDropdown(menu._id);
          }
        }}
      >
        {hasChildren && renderSubMenu(menu.children, isChild)}
      </Li>
    );
  };

  if (loading) {
    return (
      <div className="main bg-black">
        <Container className="flex justify-between items-center px-3 py-3">
          <div className="logo">
            <img className="w-full" src={logo} alt="Logo" />
          </div>
          <div className="loading text-white">Loading menu...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="main bg-black">
      <Container className="flex justify-between items-center px-3 py-3">
        <div className="logo">
          <img className="w-full" src={logo} alt="Logo" />
        </div>
        <div
          onClick={() => setMenu(!menu)}
          className={`menu-icon w-10 h-10 rounded-full bg-[#252525] flex justify-center items-center cursor-pointer ${
            menu ? 'bg-[#303030]' : ''
          }`}
        >
          {menu ? (
            <IoClose className="text-white text-2xl" />
          ) : (
            <div className="flex flex-col gap-y-1">
              <div className="w-5 h-[2px] bg-white"></div>
              <div className="w-5 h-[2px] bg-white"></div>
              <div className="w-5 h-[2px] bg-white"></div>
            </div>
          )}
        </div>
      </Container>
      <div
        className={`menu-items absolute w-full bg-black transition-all duration-300 z-50 ${
          menu
            ? 'min-h-screen opacity-100 visible'
            : 'h-0 opacity-0 invisible overflow-hidden'
        }`}
      >
        <Container className="flex flex-col gap-y-3 py-5">
          {Array.isArray(menus) && menus.map((menu) => renderMenuItem(menu))}
        </Container>
      </div>
    </div>
  );
};

export default MainHeaderSmall;
