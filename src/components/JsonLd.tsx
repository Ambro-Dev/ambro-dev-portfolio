// components/JsonLd.tsx
import { type FC, useEffect } from "react";

interface JsonLdProps {
  data: string;
}

export const JsonLd: FC<JsonLdProps> = ({ data }) => {
  useEffect(() => {
    // Create script element safely within useEffect
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.textContent = data;
    document.head.appendChild(script);

    // Clean up when component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [data]);

  // Return null as we're directly manipulating the DOM
  return null;
};
