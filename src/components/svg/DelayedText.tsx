import { motion } from "framer-motion";
import React from "react";

type DelayedTextProps = {
  text: string;
  xPosition: number;
  yPosition: number;
  delay?: number;
};

const DelayedText = ({
  text,
  xPosition,
  yPosition,
  delay = 1, // default delay of 1 second
}: DelayedTextProps) => {
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay, duration: 2 },
    },
  };

  return (
    <motion.text
      variants={textVariants}
      initial="hidden"
      animate="visible"
      x={xPosition}
      y={yPosition}
      dominantBaseline="ideographic"
      style={{
        fontStyle: "normal",
        fontVariantCaps: "normal",
        fontWeight: "normal",
        fontStretch: "normal",
        fontSize: 20,
        lineHeight: "normal",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSizeAdjust: "none",
        fontKerning: "auto",
        fontVariantAlternates: "normal",
        fontVariantLigatures: "normal",
        fontVariantNumeric: "normal",
        fontVariantEastAsian: "normal",
        fontVariantPosition: "normal",
        fontVariantEmoji: "normal",
        fontFeatureSettings: "normal",
        fontOpticalSizing: "auto",
        fontVariationSettings: "normal",
        whiteSpace: "pre",
      }}
    >
      {text}
    </motion.text>
  );
};

export default DelayedText;
