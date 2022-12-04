import React from "react";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="bg-[#202F33] px-3 w-full pt-5 min-h-screen">{children}</div>
  );
};
