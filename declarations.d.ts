// declare module '*.svg' {
//     import React from 'react';
//     import { SvgProps } from 'react-native-svg';
//     const content: React.FC<SvgProps>;
//     export default content;
//   }
  

// Declaration for SVG files (your existing code)
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Declaration for react-native-svg-circular-progress
declare module 'react-native-svg-circular-progress';
