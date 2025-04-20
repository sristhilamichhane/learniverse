import React from "react";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <>
      
        <main className="flex items-center justify-center ">{children}</main>
      
    </>
  );
}

export default Layout;
