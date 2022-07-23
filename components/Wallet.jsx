import { ethers } from "ethers";

function Wallet({ wallet, setWallet }) {
  const createAccount = () => {
    setWallet(ethers.Wallet.createRandom());
  };

  const publicKey = wallet?.address;
  const privateKey = wallet?.privateKey;
  const address = wallet?.address;
  // const mnemonic = wallet?.mnemonic.phrase;

  if (typeof window !== "undefined") {
    localStorage.setItem("publicKey", publicKey);
    localStorage.setItem("privateKey", privateKey);
    localStorage.setItem("address", address);
  }

  return (
    <>
      <h2>Wallet</h2>
      <button onClick={createAccount}>Create Account</button>
      <p>{`publicKey: ${publicKey}`}</p>
      <p>{`privateKey: ${privateKey}`}</p>
      <p>{`address: ${address}`}</p>
    </>
  );
}

export default Wallet;
