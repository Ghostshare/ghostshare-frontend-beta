import { ethers } from "ethers";
import contracts from "../../metadata/deployed_contracts.json";
import ABI from "../../metadata/contracts_ABI.json";

export function createInstance(provider) {
  return new ethers.Contract(
    contracts.MinimalForwarder,
    ABI.MinimalForwarder,
    provider
  );
}
