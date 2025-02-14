'use client';

import { useContext, useEffect, useState } from 'react';

type ChatMicSvgProps = {
  onMouseDown: () => void;
  onMouseUp: () => void;
};
export const ChatMicSvg = ({ onMouseDown, onMouseUp }: ChatMicSvgProps) => {
  const [color, setColor] = useState('black');

  return (
    <svg
      style={{
        height: 25,
        /* margin-bottom: -15px; */
        position: 'relative',
        bottom: -11,
        right: 35,
      }}
      height={35}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Capa_1"
      x="0px"
      y="0px"
      viewBox="0 0 230.639 230.639"
      // style={{  "enable-background:new 0 0 230.639 230.639;"}}
      xmlSpace="preserve"
      onMouseDown={() => {
        console.log('down');
        setColor('rgb(142, 39, 39)');
        onMouseDown();
      }}
      onMouseUp={() => {
        console.log('up');
        setColor('black');
        onMouseUp();
      }}
    >
      <g>
        <path
          style={{ fill: color }}
          d="M115.32,171.112c23.408,0,42.451-19.043,42.451-42.451v-86.21C157.771,19.043,138.728,0,115.32,0   S72.869,19.043,72.869,42.451v86.21C72.869,152.069,91.912,171.112,115.32,171.112z M87.869,42.451   C87.869,27.314,100.183,15,115.32,15s27.451,12.314,27.451,27.451v86.21c0,15.137-12.314,27.451-27.451,27.451   s-27.451-12.314-27.451-27.451V42.451z"
        />
        <path
          style={{ fill: color }}
          d="M184.777,125.36c0-4.142-3.358-7.5-7.5-7.5s-7.5,3.358-7.5,7.5c0,30.028-24.43,54.458-54.458,54.458   s-54.458-24.43-54.458-54.458c0-4.142-3.358-7.5-7.5-7.5s-7.5,3.358-7.5,7.5c0,35.765,27.174,65.294,61.958,69.047v21.232H89.35   c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h51.939c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5H122.82v-21.232   C157.603,190.654,184.777,161.125,184.777,125.36z"
        />
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  );
};
