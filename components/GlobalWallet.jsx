import React from "react";
import useLocalStorageState from "use-local-storage-state";
import { ethers } from "ethers";

function GlobalWallet(props) {
  const wallet = ethers.Wallet.createRandom();

  const [privateKey, setPrivateKey, { isPersistent }] = useLocalStorageState(
    "privateKey",
    {
      defaultValue: wallet?.privateKey,
    }
  );

  const [publicKey, setPublicKey] = useLocalStorageState("publicKey", {
    defaultValue: wallet?.address,
  });

  const [isStoragePersistent, setIsStoragePersistent] = useLocalStorageState(
    "isStoragePersistent",
    {
      defaultValue: isPersistent,
    }
  );

  return <>{props.children}</>;
}

export default GlobalWallet;
