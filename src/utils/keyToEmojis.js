import "buffer";
import { encode } from "base64-emoji";

const keyToEmojis = (key) => {
  const keyNormalized = String(key).slice(2, 42).toUpperCase();
  return encode(keyNormalized).toString().slice(0, 8);
};

export default keyToEmojis;
