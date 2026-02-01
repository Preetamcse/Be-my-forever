import React, { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import Swal from "sweetalert2";
import { BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";

import MouseStealing from './MouseStealer.jsx';
import lovesvg from "./assets/All You Need Is Love SVG Cut File.svg";
import Lovegif from "./assets/GifData/main_temp.gif";
import heartGif from "./assets/GifData/happy.gif";
import sadGif from "./assets/GifData/sad.gif";
import WordMareque from './MarqueeProposal.jsx';
import purposerose from './assets/GifData/RoseCute.gif';
import swalbg from './assets/Lovingbg2_main.jpg';
import loveu from './assets/GifData/cutieSwal4.gif';

//! yes - Gifs Importing
import yesgif0 from "./assets/GifData/Yes/lovecutie0.gif";
import yesgif1 from "./assets/GifData/Yes/love2.gif";
import yesgif2 from "./assets/GifData/Yes/love3.gif";
import yesgif3 from "./assets/GifData/Yes/love1.gif";
import yesgif4 from "./assets/GifData/Yes/lovecutie1.gif";
import yesgif5 from "./assets/GifData/Yes/lovecutie5.gif";
import yesgif6 from "./assets/GifData/Yes/lovecutie7.gif";
import yesgif7 from "./assets/GifData/Yes/lovecutie8.gif";
import yesgif8 from "./assets/GifData/Yes/lovecutie3.gif";
import yesgif9 from "./assets/GifData/Yes/lovecutie9.gif";
import yesgif10 from "./assets/GifData/Yes/lovecutie6.gif";
import yesgif11 from "./assets/GifData/Yes/lovecutie4.gif";
//! no - Gifs Importing
import nogif0 from "./assets/GifData/No/breakRej0.gif";
import nogif0_1 from "./assets/GifData/No/breakRej0_1.gif";
import nogif1 from "./assets/GifData/No/breakRej1.gif";
import nogif2 from "./assets/GifData/No/breakRej2.gif";
import nogif3 from "./assets/GifData/No/breakRej3.gif";
import nogif4 from "./assets/GifData/No/breakRej4.gif";
import nogif5 from "./assets/GifData/No/breakRej5.gif";
import nogif6 from "./assets/GifData/No/breakRej6.gif";
import nogif7 from "./assets/GifData/No/RejectNo.gif";
import nogif8 from "./assets/GifData/No/breakRej7.gif";

//! yes - Music Importing
import yesmusic1 from "./assets/AudioTracks/Love_LoveMeLikeYouDo.mp3";
import yesmusic2 from "./assets/AudioTracks/Love_EDPerfect.mp3";
import yesmusic3 from "./assets/AudioTracks/Love_Nadaaniyan.mp3";
import yesmusic4 from "./assets/AudioTracks/Love_JoTumMereHo.mp3";
//! no - Music Importing
import nomusic1 from "./assets/AudioTracks/Rejection_WeDontTalkAnyMore.mp3";
import nomusic2 from "./assets/AudioTracks/Rejection_LoseYouToLoveMe.mp3";
import nomusic3 from "./assets/AudioTracks/Reject_withoutMe.mp3";
import nomusic4 from "./assets/AudioTracks/Neutral_Base_IHateU.mp3";
import nomusic5 from "./assets/AudioTracks/Reject1_TooGood.mp3";

const YesGifs = [yesgif0, yesgif1, yesgif2, yesgif3, yesgif4, yesgif5, yesgif6, yesgif7, yesgif8, yesgif9, yesgif10, yesgif11];
const NoGifs = [nogif0, nogif0_1, nogif1, nogif2, nogif3, nogif4, nogif5, nogif6, nogif7, nogif8];
const YesMusic = [yesmusic1, yesmusic3, yesmusic4, yesmusic2];
const NoMusic = [nomusic1, nomusic2, nomusic3, nomusic4, nomusic5];

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null); // Tracks the currently playing song
  const [currentGifIndex, setCurrentGifIndex] = useState(0); // Track the current gif index
  const [isMuted, setIsMuted] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [yespopupShown, setYesPopupShown] = useState(false);

  const gifRef = useRef(null); // Ref to ensure gif plays infinitely
  const yesButtonSize = noCount * 16 + 16;

  const [floatingGifs, setFloatingGifs] = useState([]); // Array to store active floating GIFs
  const generateRandomPositionWithSpacing = (existingPositions) => {
    let position;
    let tooClose;
    const minDistance = 15; // Minimum distance in 'vw' or 'vh'
  
    do {
      position = {
        top: `${Math.random() * 90}vh`, // Keep within 90% of viewport height
        left: `${Math.random() * 90}vw`, // Keep within 90% of viewport width
      };
  
      tooClose = existingPositions.some((p) => {
        const dx = Math.abs(parseFloat(p.left) - parseFloat(position.left));
        const dy = Math.abs(parseFloat(p.top) - parseFloat(position.top));
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });
    } while (tooClose);
  
    return position;
  };
  
  const handleMouseEnterYes = () => {
    const gifs = [];
    const positions = [];
  
    for (let i = 0; i < 10; i++) {
      const newPosition = generateRandomPositionWithSpacing(positions);
      positions.push(newPosition);
  
      gifs.push({
        id: `heart-${i}`,
        src: heartGif,
        style: {
          ...newPosition,
          animationDuration: `${Math.random() * 2 + 1}s`,
        },
      });
    }
  
    setFloatingGifs(gifs);
  };
  
  const handleMouseEnterNo = () => {
    const gifs = [];
    const positions = [];
  
    for (let i = 0; i < 10; i++) {
      const newPosition = generateRandomPositionWithSpacing(positions);
      positions.push(newPosition);
  
      gifs.push({
        id: `sad-${i}`,
        src: sadGif,
        style: {
          ...newPosition,
          animationDuration: `${Math.random() * 2 + 1}s`,
        },
      });
    }
  
    setFloatingGifs(gifs);
  };
  
  const handleMouseLeave = () => {
    setFloatingGifs([]); // floating GIFs on mouse leave
  };

  // This ensures the "Yes" gif keeps restarting and playing infinitely
  useEffect(() => {
    if (gifRef.current && yesPressed && noCount>3) {
      gifRef.current.src = YesGifs[currentGifIndex];
    }
  }, [yesPressed, currentGifIndex]);

  // Use effect to change the Yes gif every 5 seconds
  useEffect(() => {
    if (yesPressed && noCount>3) {
      const intervalId = setInterval(() => {
        setCurrentGifIndex((prevIndex) => (prevIndex + 1) % YesGifs.length);
      }, 5000); // Change gif every 5 seconds

      // Clear the interval
      return () => clearInterval(intervalId);
    }
  }, [yesPressed]);

  useEffect(() => {
    if (gifRef.current) {
      gifRef.current.src = gifRef.current.src; // Reset gif to ensure it loops infinitely
    }
  }, [noCount]);

  const handleNoClick = () => {
    const nextCount = noCount + 1;
    setNoCount(nextCount);

    if (nextCount >= 4) {
      const nextGifIndex = (nextCount - 4) % NoGifs.length; // Start cycling through NoGifs
      if (gifRef.current) {
        gifRef.current.src = NoGifs[nextGifIndex];
      }
    }

    // Play song on first press or every 7th press after
    if (nextCount === 1 || (nextCount - 1) % 7 === 0) {
      const nextSongIndex = Math.floor(nextCount / 7) % NoMusic.length;
      playMusic(NoMusic[nextSongIndex], NoMusic);
    }
  };
  
  const handleYesClick = () => {
    if(!popupShown){ // Only for Swal Fire Popup
      setYesPressed(true);
    }
    if(noCount>3){
      setYesPressed(true);
      playMusic(YesMusic[0], YesMusic); // Play the first "Yes" music by default
    }
  };
  
  const playMusic = (url, musicArray) => {
    if (currentAudio) {
      currentAudio.pause(); // Stop the currently playing song
      currentAudio.currentTime = 0; // Reset to the start
    }
    const audio = new Audio(url);
    audio.muted = isMuted;
    setCurrentAudio(audio); // Set the new audio as the current one
    audio.addEventListener('ended', () => {
      const currentIndex = musicArray.indexOf(url);
      const nextIndex = (currentIndex + 1) % musicArray.length;
      playMusic(musicArray[nextIndex], musicArray); // Play the next song in the correct array
    });
    audio.play();
  };

  const toggleMute = () => {
    if (currentAudio) {
      currentAudio.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const getNoButtonText = () => {

    const phrases = [
      "No",
      "Are you sure?",
      "Really sure?",
      "Think again!",
      "Last chance!",
      "Surely not?",
      "You might regret this!",
      "Give it another thought!",
      "Are you absolutely certain?",
      "This could be a mistake!",
      "U Have a heart!💕",
      "Don't be so cold!",
      "Wouldn't you reconsider?",
      "Is that your final answer?",
      "You're breaking my heart ;(",
      "But... why? 😢",
      "Please, pretty please? 💖",
      "I can't take this! 😫",
      "Are you sure you want to do this to me? 😢",
      "You're gonna hurt my feelings! 😥",
      "I need you to reconsider, like now! 😓",
      "I believe in you, don't disappoint me! 💔",
      "My heart says yes, what about yours? ❤️",
      "Don't leave me hanging! 😬",
      "Plsss? :( You're breaking my heart 💔",
    ];
    
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  useEffect(() => {
    if (yesPressed && noCount < 4 && !popupShown) {
      Swal.fire({
        title: "I love you sooo Much!!!❤️, You’ve stolen my heart completely!!! 🥰💖 But itni pyaari ladki aur itni jaldi haan? Thoda aur nakhre karke mujhe tarpaao na! 🥰✨",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        width: 700,
        padding: "2em",
        color: "#716add",
        background: `#fff url(${swalbg})`,
        backdrop: `
          rgba(0,0,123,0.2)
          url(${loveu})
          right
          no-repeat
        `,
      });
      setPopupShown(true);
      setYesPressed(false);
    }
  }, [yesPressed, noCount, popupShown]);
  
  useEffect(() => {
    if (yesPressed && noCount > 3 && !yespopupShown) {
      Swal.fire({
        title: "I love you so much!! ❤️ You are my everything, my joy, my forever. Every moment with you is a memory I’ll cherish forever, and my heart beats only for you.</br> Will you be the love of my life forever?",
        width: 800,
        padding: "2em",
        color: "#716add",
        background: `#fff url(${swalbg})`,
        backdrop: `
          rgba(0,0,123,0.7)
          url(${purposerose})
          right
          no-repeat
        `,
      });
      setYesPopupShown(true);
      setYesPressed(true);
    }
  }, [yesPressed, noCount, yespopupShown]);

  useEffect(() => {
    if (noCount == 25) {
      Swal.fire({
        title: "My love for you is endless, like the stars in the sky—shining for you every night, even if you don’t always notice. 🌟 I’ll wait patiently, proving every day that you’re my everything. ❤️ Please press ‘Yes’ and let’s make this a forever story. 🥰✨<br/>'True love never gives up; it grows stronger with time.'",
        width: 850,
        padding: "2em",
        color: "#716add",
        background: `#fff url(${swalbg})`,
        backdrop: `
          rgba(0, 104, 123, 0.7)
          url(${nogif1})
          right
          no-repeat
        `,
      });
    }
  }, [noCount]);

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Spline scene="https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode" />
        {/* <Spline scene="https://prod.spline.design/ZU2qkrU9Eyt1PHBx/scene.splinecode" /> */}
      </div>

      {noCount > 16 && noCount < 25 && yesPressed == false && <MouseStealing />}

      <div className="overflow-hidden flex flex-col items-center justify-center pt-4 h-screen -mt-16 selection:bg-rose-600 selection:text-white text-zinc-900">
        {yesPressed && noCount>3 ? (
          <>
            <img
              ref={gifRef}
              className="h-[230px] rounded-lg"
              src={YesGifs[currentGifIndex]}
              alt="Yes Response"
            />
            <div className="text-4xl md:text-6xl font-bold my-2" style={{ fontFamily: "Charm, serif", fontWeight: "700", fontStyle: "normal" }}>I Love You !!!</div>
            <div  className="text-4xl md:text-4xl font-bold my-1" style={{ fontFamily: "Beau Rivage, serif", fontWeight: "500", fontStyle: "normal" }}> You’re the love of my life. </div> 
            <WordMareque />
          </>
        ) : (
          <>
            <img
              src={lovesvg}
              className="fixed animate-pulse top-10 md:left-15 left-6 md:w-40 w-28"
              alt="Love SVG"
            />
            <img
              ref={gifRef}
              className="h-[230px] rounded-lg"
              src={Lovegif}
              alt="Love Animation"
            />
            <h1 className="text-4xl md:text-6xl my-4 text-center">
              Will you be my Valentine?
            </h1>
            <div className="flex flex-wrap justify-center gap-2 items-center">
              <button
                onMouseEnter={handleMouseEnterYes}
                onMouseLeave={handleMouseLeave}
                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-4`}
                style={{ fontSize: yesButtonSize }}
                onClick={handleYesClick}
              >
                Yes
              </button>
              <button
                onMouseEnter={handleMouseEnterNo}
                onMouseLeave={handleMouseLeave}
                onClick={handleNoClick}
                className="bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-bold py-2 px-4"
              >
                {noCount === 0 ? "No" : getNoButtonText()}
              </button>
            </div>
            {floatingGifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.src}
                alt="Floating Animation"
                className="absolute w-12 h-12 animate-bounce"
                style={gif.style}
              />
            ))}
          </>
        )}
        <button
          className="fixed bottom-10 right-10 bg-gray-200 p-1 mb-2 rounded-full hover:bg-gray-300"
          onClick={toggleMute}
        >
          {isMuted ? <BsVolumeMuteFill size={26} /> : <BsVolumeUpFill size={26} />}
        </button>
        <Footer />
      </div>
    </>
  );
}

const Footer = () => {
  return (
    <a
      className="fixed bottom-2 right-2 backdrop-blur-md opacity-80 hover:opacity-95 border p-1 rounded border-rose-300"
      
      target="_blank"
      rel="noopener noreferrer"
    >
      Made with{" "}
      <span role="img" aria-label="heart">
        ❤️
      </span>
      {" "}by Mr Gupta
    </a>
  );
};








// ! Pathways-
// https://app.spline.design/file/48a9d880-40c9-4239-bd97-973aae012ee0
// https://app.spline.design/file/72e6aee2-57ed-4698-afa7-430f8ed7bd87
