"use client";
import { useEffect, useState } from "react";
import Connect from "./components/Connect";
import blockchain from "./blockchain.json";
import { Contract } from "ethers";
import SearchTrade from "./components/SearchTrade";
import Trade from "./components/Trade";

export default function Home() {
  const initialDexes = blockchain.dexes.map((dex) => ({
    ...dex,
    ...{ contract: undefined },
  }));

  const [signer, setSigner] = useState(undefined);
  const [dexes, setDexes] = useState(initialDexes);
  const [trade, setTrade] = useState(undefined);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    if (signer) {
      const newDexes = blockchain.dexes.map((dex) => ({
        ...dex,
        ...{ contract: new Contract(dex.address, blockchain.dexAbi, signer) },
      }));
      setDexes(newDexes);
    }
  }, [signer]);

  return (
    <div className="container mx-auto mt-5 flex justify-center">
      <div id="content" className="flex flex-col items-center w-full">
        <div id="content-inner" className="w-full max-w-lg">
          <div className="text-center">
            <h1 id="title" className="font-bold text-3xl">
              DEX Aggregator
            </h1>
            <p id="sub-title" className="mt-4 font-bold">
              <span>Optimize your trades on DEXes</span>
            </p>
          </div>
          <div className="mt-4 flex flex-col items-center">
            {signer ? (
              <>
                <SearchTrade
                  dexes={dexes}
                  signer={signer}
                  setTrade={setTrade}
                  setToken={setToken}
                />
                {trade && (
                  <Trade
                    dexes={dexes}
                    trade={trade}
                    token={token}
                    signer={signer}
                  />
                )}
              </>
            ) : (
              <Connect setSigner={setSigner} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
