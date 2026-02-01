import React, { useState, useEffect, useRef } from "react";
import "./MouseStealer.css";

const CONSTANTS = {
  assetPath: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/184729",
};

const ASSETS = {
  head: `${CONSTANTS.assetPath}/head.svg`,
  waiting: `${CONSTANTS.assetPath}/hand.svg`,
  grabbing: `${CONSTANTS.assetPath}/hand.svg`,
  grabbed: `${CONSTANTS.assetPath}/hand-with-cursor.svg`,
};

Object.values(ASSETS).forEach((src) => {
  const img = new Image();
  img.src = src;
});

const GrabZone = ({ cursorGrabbed, onCursorGrabbed }) => {
  const [nearZone, setNearZone] = useState(false);
  const [inZone, setInZone] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const isNear =
        e.clientX > window.innerWidth * 0.6 &&
        e.clientX < window.innerWidth * 0.7 &&
        e.clientY > window.innerHeight - 400;
      const isIn = e.clientX >= window.innerWidth * 0.7 && e.clientY > window.innerHeight - 400;
      setNearZone(isNear);
      setInZone(isIn);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`grab-zone ${
        inZone ? "grab-zone--active" : nearZone ? "grab-zone--peek" : ""
      }`}
    >
      <Grabber
        cursorGrabbed={cursorGrabbed}
        onCursorGrabbed={onCursorGrabbed}
        active={inZone}
        near={nearZone}
      />
    </div>
  );
};

const Grabber = ({ cursorGrabbed, onCursorGrabbed, active, near }) => {
  const ref = useRef(null);
  const [stealing, setStealing] = useState(false);

  const handleMouseEnter = () => {
    if (!cursorGrabbed && active) {
      onCursorGrabbed();
      setStealing(true);
    }
  };

  useEffect(() => {
    if (stealing) {
      const timer = setTimeout(() => setStealing(false), 8000); // Reset after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [stealing]);

  return (
    <div
      className={`grabber ${
        stealing
          ? "grabber--stealing"
          : cursorGrabbed
          ? "grabber--grabbed"
          : near
          ? "grabber--near"
          : "grabber--waiting"
      }`}
      ref={ref}
      onMouseEnter={handleMouseEnter}
    >
      <div className="grabber__eyes">
        <div className="grabber__eye grabber__eye--left" />
        <div className="grabber__eye grabber__eye--right" />
      </div>
      <img className="grabber__face" src={ASSETS.head} alt="head" />
      <img
        className="grabber__hand"
        src={ASSETS[cursorGrabbed ? "grabbed" : "waiting"]}
        alt="hand"
      />
    </div>
  );
};

const App = () => {
  const [cursorGrabbed, setCursorGrabbed] = useState(false);

  const handleCursorGrabbed = () => {
    setCursorGrabbed(true);
    document.body.style.cursor = "none"; // Hide cursor globally
    const grabberElement = document.querySelector(".grabber");
    if (grabberElement) {
      grabberElement.style.cursor = "none"; // Hide cursor on grabber
    }
  
    setTimeout(() => {
      setCursorGrabbed(false);
      document.body.style.cursor = ""; 
      if (grabberElement) {
        grabberElement.style.cursor = ""; 
      }
    }, 8000); // Release the grab after 8 seconds
  };
  
  return (
    <div>
      <GrabZone cursorGrabbed={cursorGrabbed} onCursorGrabbed={handleCursorGrabbed} />
    </div>
  );
};

export default App;


// Todo: Original Perfect Code 
// import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
// import "./mouse.css";

// const CONSTANTS = {
//   assetPath: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/184729"
// };

// const ASSETS = {
//   head: `${CONSTANTS.assetPath}/head.svg`,
//   waiting: `${CONSTANTS.assetPath}/hand.svg`,
//   stalking: `${CONSTANTS.assetPath}/hand-waiting.svg`,
//   grabbing: `${CONSTANTS.assetPath}/hand.svg`,
//   grabbed: `${CONSTANTS.assetPath}/hand-with-cursor.svg`,
//   shaka: `${CONSTANTS.assetPath}/hand-surfs-up.svg`
// };

// // Preload images
// Object.values(ASSETS).forEach((src) => {
//   const img = new Image();
//   img.src = src;
// });

// const useHover = () => {
//   const ref = useRef(null);
//   const [hovered, setHovered] = useState(false);

//   useEffect(() => {
//     const node = ref.current;
//     if (node) {
//       const onEnter = () => setHovered(true);
//       const onLeave = () => setHovered(false);
//       node.addEventListener("mouseenter", onEnter);
//       node.addEventListener("mouseleave", onLeave);

//       return () => {
//         node.removeEventListener("mouseenter", onEnter);
//         node.removeEventListener("mouseleave", onLeave);
//       };
//     }
//   }, []);

//   return [ref, hovered];
// };

// const useMousePosition = () => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setPosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   return position;
// };

// const usePosition = () => {
//   const ref = useRef(null);
//   const [position, setPosition] = useState({});

//   useLayoutEffect(() => {
//     const updatePosition = () => {
//       if (ref.current) {
//         setPosition(ref.current.getBoundingClientRect());
//       }
//     };

//     updatePosition();
//     window.addEventListener("resize", updatePosition);

//     return () => {
//       window.removeEventListener("resize", updatePosition);
//     };
//   }, []);

//   return [ref, position];
// };

// const App = () => {
//   const [debug, setDebug] = useState(false);
//   const [cursorGrabbed, setCursorGrabbed] = useState(false);
//   const [gameOver, setGameOver] = useState(false);

//   const toggleDebug = () => setDebug((prev) => !prev);

//   const handleButtonClick = () => {
//     setGameOver(true);
//     setTimeout(() => setGameOver(false), 4000);
//   };

//   const handleCursorGrabbed = () => {
//     setCursorGrabbed(true);
//     setTimeout(() => setCursorGrabbed(false), 2000);
//   };

//   useEffect(() => {
//     if (cursorGrabbed) {
//       document.body.requestPointerLock?.();
//     } else {
//       document.exitPointerLock?.();
//     }

//     return () => {
//       if (document.pointerLockElement) {
//         document.exitPointerLock?.();
//       }
//     };
//   }, [cursorGrabbed]);

//   return (
//     <div className={`app ${debug ? "app--debug" : ""}`}>
//       <section className="container">
//         <h1>Hello!</h1>
//         <h2>Welcome to the internet.</h2>
//         <p>This is a classic website, no traps or weird stuff!</p>
//         <p>Feel free to browse, relax, and click the button below if you’d like!</p>
//         <button className="debug-button" onClick={toggleDebug}>
//           Debug
//         </button>
//       </section>

//       <button className="trap-button" onClick={handleButtonClick}>
//         {gameOver ? "Nice one" : cursorGrabbed ? "Gotcha!" : "Button!"}
//       </button>

//       <div className="grab-zone-wrapper">
//         <GrabZone
//           cursorGrabbed={cursorGrabbed}
//           gameOver={gameOver}
//           onCursorGrabbed={handleCursorGrabbed}
//         />
//       </div>
//     </div>
//   );
// };

// const GrabZone = ({ cursorGrabbed, gameOver, onCursorGrabbed }) => {
//   const [outerRef, outerHovered] = useHover();
//   const [innerRef, innerHovered] = useHover();
//   const [extended, setExtended] = useState(false);

//   const state = gameOver
//     ? "shaka"
//     : cursorGrabbed
//     ? "grabbed"
//     : innerHovered
//     ? "grabbing"
//     : outerHovered
//     ? "stalking"
//     : "waiting";

//   useEffect(() => {
//     let timer;
//     if (state === "grabbing") {
//       timer = setTimeout(() => setExtended(true), 2000);
//     }
//     return () => {
//       setExtended(false);
//       clearTimeout(timer);
//     };
//   }, [state]);

//   return (
//     <div className="grab-zone" ref={outerRef}>
//       <div className="grab-zone__debug">
//         <strong>Debug info:</strong>
//         <p>State: {state}</p>
//         <p>Extended: {extended ? "Yes" : "No"}</p>
//       </div>
//       <div className="grab-zone__danger" ref={innerRef}>
//         <Grabber
//           state={state}
//           extended={extended}
//           onCursorGrabbed={onCursorGrabbed}
//         />
//       </div>
//     </div>
//   );
// };

// const Grabber = ({ state, extended, onCursorGrabbed }) => {
//   const mousePos = useMousePosition();
//   const [ref, position] = usePosition();

//   const centerX = position.left + position.width / 2 || 0;
//   const centerY = position.top + position.height / 2 || 0;

//   const angle = Math.atan2(mousePos.x - centerX, -(mousePos.y - centerY)) * (180 / Math.PI);
//   const rotation = Math.max(-79, Math.min(angle, 79));

//   return (
//     <div className={`grabber grabber--${state} ${extended ? "grabber--extended" : ""}`}>
//       <div className="grabber__body"></div>
//       <img className="grabber__face" src={ASSETS.head} alt="head" />
//       <div className="grabber__arm-wrapper" ref={ref} style={{ transform: `rotate(${rotation}deg)` }}>
//         <div className="grabber__arm">
//           <img
//             className="grabber__hand"
//             src={ASSETS[state]}
//             alt="hand"
//             style={{ pointerEvents: "none" }}
//             onMouseEnter={onCursorGrabbed}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;



