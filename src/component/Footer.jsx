import React from "react";
import MainFooter from "./MainFooter";
import Copyright from "./layer/Copyright";
import MediaFooter from "./MediaFooter";

const Footer = () => {
  return (
    <div className=" pt-16 md:pt-24 lg:pt-32">
      <MainFooter />
      <MediaFooter/>
      <Copyright />
    </div>
  );
};

export default Footer;
