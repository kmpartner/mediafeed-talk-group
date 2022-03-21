// import { useState, useEffect } from 'react';

// function getWindowDimensions() {
//   const { innerWidth: width, innerHeight: height } = window;
//   return {
//     width,
//     height,
//   };
// }

// export function useWindowDimensions() {
//   const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

//   useEffect(() => {
//     function handleResize() {
//       setWindowDimensions(getWindowDimensions());
//     }

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return windowDimensions;
// }




import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { 
    innerWidth: width, 
    innerHeight: height, 
    scrollX: scrollX,
    scrollY: scrollY,
  } = window;
  return {
    width,
    height,
    scrollX,
    scrollY,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    // function handleResize() {
    //   setWindowDimensions(getWindowDimensions());
    // }
    window.addEventListener('scroll', handleResize);
    window.addEventListener('resize', handleResize);
    return () => { removeListener() };
  }, []);

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  function removeListener() {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleResize);
  }

  return windowDimensions;
}