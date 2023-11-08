import { useState, useEffect } from "react";

interface IWindowSizeReturn {
  width?: number;
  height?: number;
  isMatchWith: boolean;
}

interface IWindowSizeParams {
  matchWith?: number;
}

export const useWindowSize = ({
  matchWith = -1,
}: IWindowSizeParams = {}): IWindowSizeReturn => {
  const [windowSize, setWindowSize] = useState<IWindowSizeReturn>({
    width: window.innerWidth,
    height: window.innerHeight,
    isMatchWith: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMatchWith: window.matchMedia(`(max-width: ${matchWith}px)`).matches,
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [matchWith]);

  return windowSize;
};
