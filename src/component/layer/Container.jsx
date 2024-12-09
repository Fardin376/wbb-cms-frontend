import React from "react";

const Container = ({ children, className }) => {
  return (
    <div
      className={`font-inter max-w-[1280px] mx-auto relative px-3 2xl:px-0 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
