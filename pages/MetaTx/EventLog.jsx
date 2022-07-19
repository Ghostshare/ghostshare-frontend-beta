import { useState } from "react";
import { ethers } from "ethers";
import contracts from "../../metadata/deployed_contracts.json";
import { FileRegistry } from "../../metadata/contracts_ABI.json";

export default function EventLog({ provider }) {
  console.log({ provider });

  const [registerEvents, setRegisterEvents] = useState([]);
  const [accessEvents, setAccessEvents] = useState([]);
  const [startBlock, setStartBlock] = useState(27244544);
  const [endBlock, setEndBlock] = useState(27248034);

  const queryEvents = () => {
    if (provider?._isProvider) {
      console.log("EventListener");
      console.log({ provider });
      const fileRegistryContract = new ethers.Contract(
        contracts.FileRegistry,
        FileRegistry,
        provider
      );

      fileRegistryContract
        .queryFilter("FileRegistered", startBlock, endBlock)
        .then((events) => setRegisterEvents(events));
      fileRegistryContract
        .queryFilter("AccessGranted", startBlock, endBlock)
        .then((events) => setAccessEvents(events));
    }
  };

  return (
    <>
      <h2>Event Logs</h2>
      <div>
        <label>Query from startBlock</label>
        <input
          value={startBlock}
          placeholder="Query from startBlock"
          style={{ width: "200px" }}
          onChange={(event) => setStartBlock(Number(event.target.value))}
        />
        <br />
        <label>Query to endBlock</label>
        <input
          value={endBlock}
          placeholder="Query to endBlock"
          style={{ width: "200px" }}
          onChange={(event) => setEndBlock(Number(event.target.value))}
        />
        <br />
        <button onClick={queryEvents}>Query Events</button>
      </div>
      <h4>FileRegistered</h4>
      {registerEvents && (
        <table style={{ fontSize: "10px" }}>
          <tr>
            <th>blockNumber</th>
            <th>fileId</th>
            <th>fileOwner</th>
          </tr>
          {registerEvents.map((event, key) => {
            return (
              <tr key={"registerEvents"}>
                <td key={key + "registerEvents"}>{event.blockNumber}</td>
                <td key={key + "registerEvents"}>{event.args[0]}</td>
                <td key={key + "registerEvents"}>{event.args[1]}</td>
              </tr>
            );
          })}
        </table>
      )}
      <h4>AccessGranted</h4>
      {accessEvents && (
        <table style={{ fontSize: "10px" }}>
          <tr>
            <th>blockNumber</th>
            <th>fileId</th>
            <th>fileOwner</th>
          </tr>
          {accessEvents.map((event, key) => {
            return (
              <tr key={"accessEvents"}>
                <td key={key + "accessEvents"}>{event.blockNumber}</td>
                <td key={key + "accessEvents"}>{event.args[0]}</td>
                <td key={key + "accessEvents"}>{event.args[1]}</td>
              </tr>
            );
          })}
        </table>
      )}
    </>
  );
}
