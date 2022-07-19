import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";

export async function sendMetaTx(mainContract, wallet, method, values) {
  const forwarder = createInstance(wallet?.provider);
  const from = wallet.address;
  const data = mainContract.interface.encodeFunctionData(method, values);
  const to = mainContract.address;
  // console.log({ from, data, to });
  console.log(wallet?.provider);
  console.log({ forwarder });

  const txRequest = await signMetaTxRequest(wallet, forwarder, {
    to,
    from,
    data,
  });

  return fetch(process.env.NEXT_PUBLIC_OZ_AUTOTASK_WEBHOOK, {
    method: "POST",
    body: JSON.stringify(txRequest),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
  });
}
