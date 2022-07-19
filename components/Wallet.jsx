import { ethers } from "ethers";

function Wallet({ wallet, setWallet }) {
  const createAccount = () => {
    setWallet(ethers.Wallet.createRandom());
  };

  const publicKey = wallet?.address;
  const privateKey = wallet?.privateKey;
  // const mnemonic = wallet?.mnemonic.phrase;

  if (typeof window !== "undefined") {
    localStorage.setItem("publicKey", publicKey);
    localStorage.setItem("privateKey", privateKey);
  }

  return (
    <>
      <h2>Wallet</h2>
      <button onClick={createAccount}>Create Account</button>
      <p>{`publicKey: ${publicKey}`}</p>
      <p>{`privateKey: ${privateKey}`}</p>
    </>
  );
}

export default Wallet;
