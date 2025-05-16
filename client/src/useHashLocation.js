import { useState, useEffect } from "react";

export default function useHashLocation() {
  const getHashPath = () => window.location.hash.replace(/^#/, "") || "/";
  const [loc, setLoc] = useState(getHashPath());

  useEffect(() => {
    const handler = () => setLoc(getHashPath());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return [
    loc,
    (to) => {
      window.location.hash = to;
    }
  ];
} 