import { motion } from "framer-motion";

type PacketPathProps = {
  path: string;
  packetColor?: string;
};

const PacketPath = ({ path, packetColor = "#ff1493" }: PacketPathProps) => (
  <>
    <defs>
      {/* Optional neon glow filter */}
      <filter id="neon">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g
      id="cu_qoeh7i1j9lafg-stroke"
      fill="none"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="4"
    >
      <path d={path} stroke="#ababab" strokeWidth="1" />
      <motion.path
        d={path}
        stroke={packetColor}
        strokeWidth="2"
        strokeDasharray="15 310"
        filter="url(#neon)"
        animate={{ strokeDashoffset: [0, 310] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </g>
  </>
);

export default PacketPath;
