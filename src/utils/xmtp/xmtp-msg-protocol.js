export const GHOSTSHARE_FILE_ACCESS_REQUEST_PREFIX = "#Ghostshare:request-access:"; // "#Ghostshare:request-accesss:" + cid + "$" + requester-address
export const GHOSTSHARE_FILE_ACCESS_GRANTED_PREFIX = "#Ghostshare:access-granted:"; // "#Ghostshare:accesss-granted:" + cid + "$" + requester-address
export const GHOSTSHARE_FILE_ACCESS_DENIED_PREFIX = "#Ghostshare:access-denied:"; // "#Ghostshare:accesss-denied:" + cid + "$" + requester-address

const FIELD_SEPARATOR = "$";

export const isFileAccessRequestMessage = (message) => {
  return isMessageOf(GHOSTSHARE_FILE_ACCESS_REQUEST_PREFIX, message);
}

export const isFileAccessGrantedMessage = (message) => {
  return isMessageOf(GHOSTSHARE_FILE_ACCESS_GRANTED_PREFIX, message);
}

export const isFileAccessDeniedMessage = (message) => {
  return isMessageOf(GHOSTSHARE_FILE_ACCESS_DENIED_PREFIX, message);
}

const isMessageOf = (msgPrefix, message) => {
  return message.content.startsWith(msgPrefix);
}

export const buildFileAccessRequestMessage = (requestedFileCID, requesterAddress) => {
  return buildMessage(GHOSTSHARE_FILE_ACCESS_REQUEST_PREFIX, requestedFileCID, requesterAddress);
};

export const buildFileAccessGrantedMessage = (requestedFileCID, requesterAddress) => {
  return buildMessage(GHOSTSHARE_FILE_ACCESS_GRANTED_PREFIX, requestedFileCID, requesterAddress);
};

export const buildFileAccessDeniedMessage = (requestedFileCID, requesterAddress) => {
  return buildMessage(GHOSTSHARE_FILE_ACCESS_DENIED_PREFIX, requestedFileCID, requesterAddress);
};

const buildMessage = (msgPrefix, requestedFileCID, requesterAddress) => {
  return msgPrefix + requestedFileCID + FIELD_SEPARATOR + requesterAddress;
};

export const extractFileAccessRequestData = (message) => {
  return extractData(GHOSTSHARE_FILE_ACCESS_REQUEST_PREFIX, message);
}

export const extractFileAccessGrantedData = (message) => {
  return extractData(GHOSTSHARE_FILE_ACCESS_GRANTED_PREFIX, message);
}

export const extractFileAccessDeniedData = (message) => {
  return extractData(GHOSTSHARE_FILE_ACCESS_DENIED_PREFIX, message);
}

const extractData = (msgPrefix, message) => {
  const payload = message.content
          .slice(msgPrefix.length)
          .split(FIELD_SEPARATOR);
  return {
    requestedFileCID: payload[0],
    requesterAddress: payload[1],
  }
}
