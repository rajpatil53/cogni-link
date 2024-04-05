"use client";
import React from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";

const Navbar = () => {
  const { open } = useWeb3Modal();
  const { isConnecting, isConnected, address } = useAuthSessionContext();

  return (
    <div className="navbar fixed bg-base-100 z-10">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl" href="/">
          <div>
            <span className="text-primary">Cogni</span>Link
          </div>
        </a>
      </div>
      <div className="navbar-end">
        <button
          className="btn btn-neutral block overflow-hidden max-w-28 text-ellipsis"
          onClick={() => open()}
          disabled={isConnecting}
        >
          {isConnected ? address : "Connect"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
