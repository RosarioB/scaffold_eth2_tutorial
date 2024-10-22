"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";

interface NFT {
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const compressAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const fallbackImageUrl = "/images/Image-not-found.png";

const Home: NextPage = () => {
  const { writeContractAsync } = useScaffoldWriteContract("MyNFT");
  const [recipientNftAddress, setRecipientNftAddress] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftImageUrl, setNftImageUrl] = useState("");
  const [nfts, setNfts] = useState<NFT[]>([]);

  const {
    data: allTokensData,
    error,
    refetch: refetchAllTokens,
  } = useScaffoldReadContract({
    contractName: "MyNFT",
    functionName: "getAllTokens",
  });

  useEffect(() => {
    if (allTokensData) {
      setNfts([...allTokensData]);
    }
  }, [allTokensData]);

  const renderedNfts = nfts.map((nft, index) => {
    const handleError = () => {
      setNftImageUrl(fallbackImageUrl);
    };

    return (
      <div className="card bg-base-100 shadow-md shadow-secondary flex flex-grow max-w-xs" key={index}>
        <figure className="mt-8">
          <Image
            src={isValidUrl(nft.imageUrl) ? nft.imageUrl : fallbackImageUrl}
            alt={nft.name}
            width={200}
            height={200}
            onError={handleError}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title font-bold text-lg justify-center">NFT {index + 1}</h2>
          <div className="flex flex-grow items-start space-x-2 -mt-4">
            <p className="text-lg">
              <span className="font-bold">Name:</span> {nft.name}
            </p>
          </div>
          <div className="flex flex-grow items-start space-x-2 -mt-6">
            <p className="text-lg">
              <span className="font-bold">Description:</span> {nft.description}
            </p>
          </div>
          <div className="flex flex-grow items-start space-x-2 -mt-6">
            <p className="text-lg">
              <span className="font-bold">Owner:</span> {compressAddress(nft.owner)}
            </p>
          </div>
        </div>
      </div>
    );
  });

  const handleMint = async () => {
    let tx: `0x${string}` | undefined;
    try {
      tx = await writeContractAsync({
        functionName: "safeMint",
        args: [recipientNftAddress, nftName, nftDescription, nftImageUrl],
      });
      console.log("Transaction successful: ", tx);
      refetchAllTokens();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-center mt-4">
        <form
          className="card bg-base-100 shadow-md shadow-secondary p-4 w-full max-w-xl"
          onSubmit={e => {
            e.preventDefault();
            handleMint();
          }}
        >
          <h1 className="font-bold text-2xl flex flex-col items-center mb-4">Mint New NFT</h1>
          <label className="input input-bordered flex items-center gap-2 mx-2 mb-4">
            Recipient Address
            <input
              type="text"
              className="grow"
              placeholder="0x1234...abcd"
              value={recipientNftAddress}
              onChange={e => setRecipientNftAddress(e.target.value)}
              required={true}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mx-2 mb-4">
            Name
            <input
              type="text"
              className="grow"
              placeholder="Your Name"
              value={nftName}
              onChange={e => setNftName(e.target.value)}
              required={true}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mx-2 mb-4">
            Description
            <input
              type="text"
              className="grow"
              placeholder="Your Description"
              value={nftDescription}
              onChange={e => setNftDescription(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mx-2 mb-4">
            Image URL
            <input
              type="text"
              className="grow"
              placeholder="Your Image URL"
              value={nftImageUrl}
              onChange={e => setNftImageUrl(e.target.value)}
            />
          </label>
          <div className="flex justify-center">
            <button className="btn btn-success btn-md">Mint NFT</button>
          </div>
        </form>
      </div>
      <div className="flex justify-center mt-4">
        <h1 className="font-bold text-3xl flex flex-col items-center mb-8">NFT Collection</h1>
      </div>
      <div className="flex justify-center  gap-4">{renderedNfts}</div>
      {error && <div className="text-red-500 text-xs text-center mt-1">{error.message}</div>}
    </div>
  );
};

export default Home;
