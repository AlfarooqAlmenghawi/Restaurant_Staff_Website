import { useState } from "react";

const useStorage = (type, key, defaultVal) => {
  const [storedVal, setStoredVal] = useState(() => {
    const val = window[type].getItem(key);
    if (val) {
      return JSON.parse(val);
    } else {
      window[type].setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
  });
  const setValue = (newVal) => {
    setStoredVal((currValue) => {
      let valToStore = newVal;
      if (typeof newVal === "function") {
        valToStore = newVal(currValue);
      } else if (Array.isArray(newVal)) {
        valToStore = [...newVal];
      } else if (typeof newVal === "object") {
        valToStore = { ...newVal };
      }
      window[type].setItem(key, JSON.stringify(valToStore));
      return valToStore;
    });
  };
  return [storedVal, setValue];
};

export const useLocalStorage = (key, defaultVal) => {
  return useStorage("localStorage", key, defaultVal);
};

export const useSessionStorage = (key, defaultVal) => {
  return useStorage("sessionStorage", key, defaultVal);
};
