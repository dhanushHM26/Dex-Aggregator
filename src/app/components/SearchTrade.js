"use client";

import { Contract } from "ethers";
import { useState } from "react";
import blockchain from "../blockchain.json";

export default function SearchTrade({ dexes, signer, setTrade, setToken }) {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountOut, setAmountOut] = useState("");

  const search = async (e) => {
    e.preventDefault();
    const calls = dexes.map((dex) =>
      dex.contract.getAmountsIn(amountOut, [tokenIn, tokenOut])
    );
    const quotes = await Promise.all(calls);
    const trades = quotes.map((quote, i) => ({
      address: dexes[i].address,
      amountIn: quote[0],
      amountOut,
      tokenIn,
      tokenOut,
    }));
    trades.sort((trade1, trade2) =>
      trade1.amountIn < trade2.amountIn ? -1 : 1
    );
    setTrade(trades[0]);
    const token = new Contract(tokenIn, blockchain.erc20Abi, signer);
    setToken(token);
  };

  return (
    <form onSubmit={search} className="space-y-4">
      <div>
        <span className="block text-xs font-medium text-slate-700">
          Address of token sold
        </span>
        <input
          type="text"
          className="mt-1 border border-red-500 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 w-full"
          id="tokenIn"
          placeholder="0xDi136...."
          onChange={(e) => setTokenIn(e.target.value)}
          value={tokenIn}
        />
      </div>
      <div>
        <span className="block text-xs font-medium text-slate-700">
          Address of token bought
        </span>
        <input
          type="text"
          className="mt-1 border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 w-full"
          id="tokenOut"
          placeholder="0xR1i38...."
          onChange={(e) => setTokenOut(e.target.value)}
          value={tokenOut}
        />
      </div>
      <div>
        <span className="block text-xs font-medium text-slate-700">
          Amount of token bought
        </span>
        <input
          type="text"
          className="mt-1 border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 w-full"
          id="amountOut"
          placeholder="10000...."
          onChange={(e) => setAmountOut(e.target.value)}
          value={amountOut}
        />
      </div>
      <button
        type="submit"
        className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-200"
      >
        Submit
      </button>
    </form>
  );
}
