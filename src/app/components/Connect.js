"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function Connect({ setSigner }) {
  const [error, setError] = useState(undefined);

  const connect = async () => {
    if (!window.ethereum) {
      setError("Please install Metamask before using this app");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
    } catch {
      setError(
        "Please accept the connection request from Metamask to use this app"
      );
    }
  };

  return (
    <div className="text-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        onClick={connect}
      >
        Connect
      </button>
      {error && (
        <div className="mt-3 mb-0 text-red-600 font-semibold">{error}</div>
      )}
    </div>
  );
}
