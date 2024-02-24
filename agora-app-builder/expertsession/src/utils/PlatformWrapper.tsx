import React from 'react';
import {useState} from 'react';
import {isWebInternal} from './common';

const PlatformWrapper = ({children}) => {
  const [isHovered, setIsHovered] = useState(false);
  return isWebInternal() ? (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}>
      {children(isHovered)}
    </div>
  ) : (
    <>{children(false)}</>
  );
};
export default PlatformWrapper;
