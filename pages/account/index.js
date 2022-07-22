import React, { useState } from "react";
import Axios from "axios";
import { Button } from "@mui/material";

export default function Account() {
  const [userTransactions, setUserTransactions] = useState(null);
  const [userAddress, setUserAddress] = useState(
    "0x95e2CaE254F4DbFE5fAC181f7a9349bC1E2c0f41"
  );

  // https://api.covalenthq.com/v1/1/address/0xa79E63e78Eec28741e711f89A672A4C40876Ebf3/transactions_v2/?key=ckey_246f815983e449199f996c30d29
  // https://api.covalenthq.com/v1/1/address/[object Ob…sactions_v2/?key=ckey_b689d9025b194a2f89f0651c889

  const getUserTransactions = async () => {
    try {
      const URL = `https://api.covalenthq.com/v1/80001/address/${userAddress}/transactions_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      console.log({ URL });
      const response = await Axios.get(URL);
      console.log({ response });
      setUserTransactions(response?.data?.data?.items);
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <>
      <h1>Your Account</h1>
      <Button onClick={getUserTransactions}>getUserTransactions</Button>
      <p styles={{ fontSize: "0.7rem" }}>{JSON.stringify(userTransactions)}</p>
    </>
  );
}
