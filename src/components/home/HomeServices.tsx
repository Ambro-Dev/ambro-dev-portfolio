import Image from "next/image";
import React from "react";

const HomeServices: React.FC = () => {
  return (
    <Image
      src="/home-services.svg"
      alt="Home Services"
      width={1200}
      height={1200}
    />
  );
};

export default HomeServices;
