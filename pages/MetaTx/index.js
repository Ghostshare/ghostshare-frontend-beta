import contracts from "../../deployed_contracts.json";

export default function MetaTx() {
  return (
    <div style={{ padding: "50px 100px" }}>
      <h2> Meta Transactions for FileRegistry.sol</h2>
      <p>
        FileRegistry deployed at:{" "}
        <a
          href={`https://mumbai.polygonscan.com/address/${contracts.FileRegistry}`}
        >
          {contracts.FileRegistry}
        </a>
      </p>
      <p>
        Forwarding Contract deployed at:{" "}
        <a
          href={`https://mumbai.polygonscan.com/address/${contracts.MinimalForwarder}`}
        >
          {contracts.MinimalForwarder}
        </a>
      </p>
    </div>
  );
}
