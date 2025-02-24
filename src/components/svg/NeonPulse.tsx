import { motion } from "framer-motion";

interface NeonShiningPathProps {
  pathData: string;
  color?: string;
  interval?: number;
}

const NeonShiningPath: React.FC<NeonShiningPathProps> = ({
  pathData,
  color = "#b7b7b7",
  interval = 6,
}) => {
  return (
    <motion.g
      fill="none"
      stroke={color}
      strokeWidth="1"
      initial={{ filter: `drop-shadow(0px 0px 0px ${color})` }}
      animate={{
        filter: [
          `drop-shadow(0px 0px 0px ${color})`,
          `drop-shadow(0px 0px 10px ${color})`,
          `drop-shadow(0px 0px 20px ${color})`,
          `drop-shadow(0px 0px 10px ${color})`,
          `drop-shadow(0px 0px 0px ${color})`,
        ],
      }}
      transition={{
        duration: interval,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.path
        d={pathData}
        initial={{ opacity: 0.4 }}
        animate={{
          opacity: [0.4, 1, 0.4],
          stroke: ["#b7b7b7", color, "#b7b7b7"],
        }}
        transition={{
          duration: interval,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.g>
  );
};

export default NeonShiningPath;
