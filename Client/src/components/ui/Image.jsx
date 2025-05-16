import React from "react";

const Image = ({ imgSrc, className ,title }) => {
  return <img className={className} src={imgSrc} alt={title}/>;
};

export default Image;
