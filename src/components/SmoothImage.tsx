import { useState, type ImgHTMLAttributes } from "react";

type SmoothImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function SmoothImage({ className = "", onLoad, onError, ...props }: SmoothImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      decoding="async"
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      onError={(event) => {
        setLoaded(true);
        onError?.(event);
      }}
      className={`${className} transition-opacity duration-700 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
      {...props}
    />
  );
}
