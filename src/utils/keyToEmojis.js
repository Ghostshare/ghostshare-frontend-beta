import "buffer";
import { encode } from "base64-emoji";

const keyToEmojis = (key) => {
  let keyNormalized = String(key).toUpperCase();
  return encode(keyNormalized).toString();
};

export default keyToEmojis;
