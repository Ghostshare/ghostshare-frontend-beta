import "buffer";
import { encode } from "base64-emoji";

const keyToEmojis = (key) => {
  return encode(key).toString();
};

export default keyToEmojis;
