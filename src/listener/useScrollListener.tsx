import { debounce } from "lodash";
import { useEffect } from "react";

const useScrollListener = (handleScroll: () => void) => {
  useEffect(() => {
    const listenToScroll = () => {
      console.log("listenToScroll");
      if (
        window.innerHeight + document.documentElement.scrollTop <=
        Math.floor(document.documentElement.offsetHeight * 0.75)
      ) {
        console.log("handleScroll");
        handleScroll(); // call the handler logic (this is asyncchronous and will not wait for the setTimeout to run!)
      }
    };

    const listenFunction = debounce(listenToScroll, 500, {
      leading: true,
      trailing: false,
    });
    document.addEventListener("scroll", listenFunction);
    return () => {
      document.removeEventListener("scroll", listenFunction);
    };
  }, [handleScroll]);
};

export default useScrollListener;
