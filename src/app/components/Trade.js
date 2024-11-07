"use client";

import { useState } from "react";

const slippageTolerance = 10; //%

export default function Trade({ dexes, trade, token, signer }) {
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(false);

  const dex = dexes.find((dex) => dex.address === trade.address);

  const executeTrade = async () => {
    setProcessing(true);
    try {
      const amountInMax =
        (trade.amountIn * BigInt(100 + slippageTolerance)) / 100n;
      const tx1 = await token.approve(dex.address, amountInMax);
      const receipt1 = await tx1.wait();
      if (receipt1.status !== "1") {
        throw new Error("approve() transaction failed");
      }

      const to = await signer.getAddress();
      const deadline = Math.floor(Date.now() / 1000) + 60 * 60;
      const tx2 = await dex.contract.swapTokensForExactTokens(
        trade.amountOut,
        amountInMax,
        [trade.tokenIn, trade.tokenOut],
        to,
        deadline
      );
      const receipt2 = await tx2.wait();
      if (receipt2.status !== "1") {
        throw new Error("Trade failed");
      }
      setConfirmed(true);
    } catch (e) {
      setError(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <h2 className="font-bold mt-5">The best price was found!</h2>
      <ul className="space-y-2 mb-6">
        <li className="border border-blue-300 bg-gray-100 p-2 rounded-md mt-5">
          Exchange: {dex.name}
        </li>
        <li className="border border-red-400 bg-red-100 p-2 rounded-md">
          Address token sold: {trade.tokenIn}
        </li>
        <li className="border border-red-400 bg-red-100 p-2 rounded-md">
          Amount token sold: {trade.amountIn.toString()}
        </li>
        <li className="border border-green-400 bg-green-200 p-2 rounded-md">
          Address token bought: {trade.tokenOut}
        </li>
        <li className="border border-green-400 bg-green-200 p-2 rounded-md">
          Amount token bought: {trade.amountOut}
        </li>
        <li className="border border-blue-400 bg-blue-200 p-2 rounded-md">
          Slippage tolerance: {slippageTolerance}%
        </li>
      </ul>
      <button
        className={
          "text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-200 ${processing ? 'opacity-50 cursor-not-allowed' : ''}"
        }
        onClick={executeTrade}
        disabled={processing}
      >
        Trade
      </button>
      {processing && (
        <div className="mt-5 text-blue-600">
          Your trade is processing. Please wait until the transaction completes.
        </div>
      )}
      {confirmed && (
        <div className="mt-5 text-green-600">
          Congrats! Your trade was successful.
        </div>
      )}
      {error && (
        <div className="mt-5 text-red-600">
          Oops... Your trade failed. Please try again later.
        </div>
      )}
    </>
  );
}
