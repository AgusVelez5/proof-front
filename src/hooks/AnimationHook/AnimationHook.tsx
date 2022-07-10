import React, { useEffect, useState } from "react";
import "./style.css";

function useDelayUnmount(isMounted:boolean, delayTime:number) {
  const [showDiv, setShowDiv] = useState(false);
  useEffect(() => {
    let timeoutId:any;
    if (isMounted && !showDiv) {
      setShowDiv(true);
    } else if (!isMounted && showDiv) {
      timeoutId = setTimeout(() => setShowDiv(false), delayTime); 
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, showDiv]);
  return showDiv;
}

interface AnimationHookProps {
  children: React.ReactNode;
  isMounted: boolean;
  delay?: number
}

const AnimationHook = ({ children, isMounted, delay = 450 }: AnimationHookProps) => {
  const showDiv = useDelayUnmount(isMounted, delay);
  const mountedStyle = { animation: "inAnimation 450ms ease-in" };
  const unmountedStyle = {
    animation: "outAnimation 470ms ease-out",
    animationFillMode: "forwards"
  };
  return (
    <div>
      {showDiv && (
        <div style={isMounted ? mountedStyle : unmountedStyle}>{children}</div>
      )}
    </div>
  );
};

export default AnimationHook;
