import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = (props) => (
  <ContentLoader
    speed={2}
    width={454}
    height={300}
    viewBox="0 0 454 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="48" y="0" rx="3" ry="3" width="185" height="13" />
    <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
    <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
    <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
    <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
    <circle cx="20" cy="20" r="20" />
    <rect x="3" y="108" rx="0" ry="0" width="409" height="45" />
    <rect x="380" y="6" rx="0" ry="0" width="22" height="10" />
  </ContentLoader>
);

export default MyLoader;
