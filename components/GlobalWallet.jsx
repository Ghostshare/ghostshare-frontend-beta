import React from "react";
import { ethers } from "ethers";
import useLocalStorage from "../src/hooks/localStorage";

function GlobalWallet(props) {
  const wallet = ethers.Wallet.createRandom();

  const [privateKey, setPrivateKey] = useLocalStorage(
    "privateKey",
    wallet?.privateKey
  );

  const [publicKey, setPublicKey] = useLocalStorage(
    "publicKey",
    wallet?.address
  );

  return <>{props.children}</>;
}

export default GlobalWallet;
