import { useState } from 'react';
import Container from './layer/Container';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import { FaAngleDown, FaBars } from 'react-icons/fa';
import '../App.css';
import { IoClose } from 'react-icons/io5';
import { useContent } from '../hooks/useContent';
import { useLanguage } from '../hooks/useLanguage';
import PropTypes from 'prop-types';

const Li = ({
  text,
  href,
  children,
  className,
  icon,
  onClick,
  collapsible,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <li className="text-base font-inter text-white relative transition-all duration-300 border-b border-gray-700">
      <Link
        to={href}
        className={`flex !flex-row !items-center justify-between gap-x-4 py-3 px-5 ${className}`}
        onClick={onClick}
      >
        {text} {icon}
        {collapsible && (
          <FaAngleDown
            onClick={(e) => {
              e.preventDefault();
              handleCollapse();
            }}
            className={`ml-2 ${collapsed ? '' : 'rotate-180'}`}
          />
        )}
      </Link>
      {children && !collapsed && children}
    </li>
  );
};

Li.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  collapsible: PropTypes.bool,
};

const MainHeaderSmall = () => {
  const { menus } = useContent();
  const { language } = useLanguage();
  const [menu, setMenu] = useState(false);

  const sortedMenus = menus.sort((a, b) => a.order - b.order);

  const parentMenus = sortedMenus.filter((item) => !item.parentId);

  const renderSubMenu = (menuItem) => {
    if (!menuItem.children || menuItem.children.length === 0) return null;

    return (
      <ul className={`pl-6 `}>
        {menuItem.children.map((child) => (
          <Li
            key={child.id}
            text={language === 'en' ? child.titleEn : child.titleBn}
            href={`/${child.slug}`}
            // icon={
            //   child.children && child.children.length > 0 ? (
            //     <FaAngleDown
            //       onClick={(e) => {
            //         e.preventDefault();
            //         handleSubMenuToggle(child.id);
            //       }}
            //       className={`ml-2 ${
            //         openSubMenus[child.id] ? 'rotate-180' : ''
            //       }`}
            //     />
            //   ) : null
            // }
            collapsible={child.children && child.children.length > 0}
          >
            {renderSubMenu(child)}
          </Li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Container className="bg-black flex justify-between items-center py-2 px-3 xl:px-0">
        <Link to="/" className="logo w-1/2 sm:w-1/3">
          <img className="w-full aspect-[335/100]" src={logo} alt={logo} />
        </Link>
        <div className="menu font-inter">
          <button
            className="text-white text-2xl"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <IoClose /> : <FaBars />}
          </button>
          <ul
            className={`absolute top-full right-0 w-full sm:w-1/2 z-50 bg-[#252525ee] flex flex-col duration-300 overflow-y-auto scroll-y-auto scrollbar-hide ${
              menu ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            {parentMenus.map((menuItem) => (
              <Li
                key={menuItem.id}
                text={language === 'en' ? menuItem.titleEn : menuItem.titleBn}
                href={`/${menuItem.slug}`}
                // icon={
                //   menuItem.children && menuItem.children.length > 0 ? (
                //     <FaAngleDown
                //       onClick={(e) => {
                //         e.preventDefault();
                //         handleSubMenuToggle(menuItem.id);
                //       }}
                //       className={`ml-2 ${
                //         openSubMenus[menuItem.id] ? 'rotate-180' : ''
                //       }`}
                //     />
                //   ) : null
                // }
                collapsible={menuItem.children && menuItem.children.length > 0}
              >
                {renderSubMenu(menuItem)}
              </Li>
            ))}
          </ul>
          <div
            onClick={() => setMenu(false)}
            className={`overlay absolute top-full left-0 w-screen h-screen bg-[#0000004d] z-40 ${
              menu ? 'visible' : 'invisible'
            }`}
          ></div>
        </div>
      </Container>
    </div>
  );
};

export default MainHeaderSmall;
