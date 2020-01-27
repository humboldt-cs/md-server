import React from 'react';

const MdIcon = ({
    style = {},
    fill = 'none',
    width = '100%',
    className = '',
    height = '100%',
    viewBox = '0 0 208 128',
    stroke = '#000',
    stroke_width = '10'
  }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 208 128">
        <rect width="198" height="118" x="5" y="5" ry="10" stroke={stroke} stroke-width={stroke_width} fill={fill}/>
        <path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"/>
    </svg>
);

export default MdIcon;