import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button } from "@mui/material";
import filterTransactions from "../../src/utils/filterTransactions";

export default function Account() {
  const [userAddress, setUserAddress] = useState(
    "0x6Dc72847c5F2f0C07354B89dB336410eEc8bb721"
  );
  const [userTransactions, setUserTransactions] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);

  const getUserTransactions = async () => {
    try {
      const URL = `https://api.covalenthq.com/v1/80001/address/${userAddress}/transactions_v2/?block-signed-at-asc=true&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      console.log({ URL });
      const response = await Axios.get(URL);
      console.log({ response });
      setUserTransactions(response?.data?.data?.items);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (userTransactions) {
      // setFilteredTransactions()
      console.log(filterTransactions(userTransactions, userAddress));
    }
  }, [userTransactions, userAddress]);

  return (
    <>
      <h1>Your Account</h1>
      <Button variant="contained" onClick={getUserTransactions}>
        get User Transactions
      </Button>
    </>
  );
}
