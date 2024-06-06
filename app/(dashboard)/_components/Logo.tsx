import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image height={150} width={150} alt="logo" src="/logo.png" priority />
      <hr className="mt-6"/>
    </>
  );
  
};

export default Logo;
