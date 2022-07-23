import { SiweMessage } from "lit-siwe";
import { getAddress } from '@ethersproject/address';
import { verifyMessage } from "@ethersproject/wallet";
import { toUtf8Bytes } from "@ethersproject/strings";
import naclUtil from "tweetnacl-util";
import nacl from "tweetnacl";

export async function signAndSaveAuthMessage(wallet, window) {
    try {
      // TODO: pull chainId from context
      const chainId = "80001";
      const preparedMessage = {
        domain: window.location.host,
        address: getAddress(wallet.address), // convert to EIP-55 format or else SIWE complains
        uri: window.location.origin,
        version: "1",
        chainId,
      };
      const message = new SiweMessage(preparedMessage);
      const body = message.prepareMessage();
      const signedResult = await signMessage({
          body,
          account: wallet.address,
          wallet
        });
      localStorage.setItem(
        "lit-auth-signature",
        JSON.stringify({
          sig: signedResult.signature,
          derivedVia: "web3.eth.personal.sign",
          signedMessage: body,
          address: getAddress(signedResult.address),
        })
      );
      // store a keypair in localstorage for communication with sgx
      const commsKeyPair = nacl.box.keyPair();
      localStorage.setItem(
        "lit-comms-keypair",
        JSON.stringify({
          publicKey: naclUtil.encodeBase64(commsKeyPair.publicKey),
          secretKey: naclUtil.encodeBase64(commsKeyPair.secretKey),
        })
      );
      console.log("generated and saved lit-comms-keypair");
    } catch (err) {
      console.log(err?.message + err?.data?.message || err);
    } finally {
      console.log("checkLitSignature");
    }
}

async function signMessage({ body, account, wallet }) {
    const messageBytes = toUtf8Bytes(body);
    const signature = await wallet.signMessage(messageBytes);
    const address = verifyMessage(body, signature);
    console.log("Signature: ", signature);
    console.log("address: ", account);
    console.log("recovered address: ", address);
    if (address !== account) {
        const msg = `ruh roh, the user signed with a different address (${address}) then they\'re using with web3 (${account}).  this will lead to confusion.`;
        console.error(msg);
        alert(
        "something seems to be wrong with your wallets message signing.  maybe restart your browser or your wallet.  your recovered sig address does not match your web3 account address"
        );
        throw new Error(msg);
    }
    return { signature, address };
}
