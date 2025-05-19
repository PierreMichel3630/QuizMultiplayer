import { debounce } from "lodash";
import { useState, useEffect, useRef } from "react";

const useThrottledEffect = (
  callback: () => void,
  delay: number,
  deps: Array<unknown> = []
) => {
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(function () {
      if (Date.now() - lastRan.current >= delay) {
        callback();
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);
};

const useInfiniteScroll = (callback: () => void) => {
  const [isFetching, setIsFetching] = useState(false);
  const stop = useRef(false); // to stop calling callback once True

  useThrottledEffect(() => {
    // mounts window listener and call debounceScroll, once in every 500ms
    window.addEventListener("scroll", debounceScroll());
    return () => window.removeEventListener("scroll", debounceScroll());
  }, 500);

  useThrottledEffect(
    // execute callback when isFetching becomes true, once in every 500ms
    () => {
      if (!isFetching) {
        return;
      } else {
        // Execute the fetch more data function
        callback();
      }
    },
    500,
    [isFetching]
  );

  function handleScroll() {
    console.log("scroll");
    if (
      window.innerHeight + document.documentElement.scrollTop <=
        Math.floor(document.documentElement.offsetHeight * 0.75) ||
      isFetching
    )
      // return if below 75% scroll or isFetching is false then don't do anything
      return;
    // if stop (meaning last page) then don't set isFetching true
    if (!stop.current) setIsFetching(true);
  }

  function debounceScroll() {
    // execute the last handleScroll function call, in every 100ms
    return debounce(handleScroll, 100);
  }

  // sharing logic
  return [isFetching, setIsFetching, stop];
};

export { useInfiniteScroll };
