// Credits to OpenZeppelin and Santiago Palladino
// https://github.com/OpenZeppelin/workshops/tree/master/01-defender-meta-txs

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
];

function getMetaTxTypeData(chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: "MinimalForwarder",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "ForwardRequest",
  };
}

async function signWithWallet(wallet, data) {
  const types = { ForwardRequest: data.types["ForwardRequest"] };
  console.log({ types });
  const signedMessage = await wallet._signTypedData(
    data.domain,
    types,
    data.message
  );
  console.log({ signedMessage });
  return signedMessage;
}

async function buildRequest(forwarder, input) {
  const nonce = await forwarder
    .getNonce(input.from)
    .then((nonce) => nonce.toString());
  console.log({ nonce });
  return { value: 0, gas: 1e6, nonce, ...input };
}

async function buildTypedData(forwarder, request) {
  const chainId = await forwarder.provider.getNetwork().then((n) => n.chainId);
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

export async function signMetaTxRequest(wallet, forwarder, input) {
  const request = await buildRequest(forwarder, input);
  console.log({ request });
  const toSign = await buildTypedData(forwarder, request);
  console.log({ toSign });
  const signature = await signWithWallet(wallet, toSign);
  console.log({ signature });
  return { signature, request };
}
