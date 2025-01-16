import { useEffect } from "react";

const useCustomHook = () => {
  useEffect(() => {
    console.log("Custom hook called");
  }, []);
};

export default useCustomHook;
