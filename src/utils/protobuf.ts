import protobufjs from 'protobufjs'
import { hexToUint8Array } from './typeTransform';

const OBJECT_PREFIX_BUFFER = hexToUint8Array("0A24747970652E676F6F676C65617069732E636F6D2F71756F72756D2E70622E4F626A65637412");

export const create = ({
  type, payload
}: {
  type: string;
  payload: any;
}): Uint8Array => {
  const root = protobufjs.Root.fromJSON(jsonDescriptor);
  const object = root.lookupType(type);
  const errMsg = object.verify(payload);
  if (errMsg) {
    throw new Error(errMsg)
  }
  const message = object.create(payload);
  const buffer = object.encode(message).finish();
  if (type.includes('Object')) {
    const length1 = OBJECT_PREFIX_BUFFER.length;
    const length2 = 1;
    const length3 = buffer.length;
    const result = new Int8Array(length1 + length2 + length3);
    result.set(OBJECT_PREFIX_BUFFER);
    result.set(new Int8Array([buffer.length]), length1);
    result.set(buffer, length1 + length2);
    return new Uint8Array(result);
  } else {
    return new Uint8Array(buffer)
  }
};

export const toObject = ({
  type, buffer
}: {
  type: string;
  buffer: Uint8Array;
}) => {
  const root = protobufjs.Root.fromJSON(jsonDescriptor);
  const object = root.lookupType(type);
  const message = object.decode(buffer.subarray(OBJECT_PREFIX_BUFFER.length + 1));
  const result = object.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  });
  return result
};

const jsonDescriptor = {
  "nested": {
      "quorum": {
          "nested": {
              "_Object": {
                  "fields": {
                      "id": {
                          "type": "string",
                          "id": 1
                      },
                      "type": {
                          "type": "string",
                          "id": 2
                      },
                      "content": {
                          "type": "string",
                          "id": 6
                      },
                      "name": {
                          "type": "string",
                          "id": 8
                      }
                  }
              },
              "TrxType": {
                  "values": {
                      "POST": 0,
                      "SCHEMA": 2,
                      "PRODUCER": 3,
                      "ANNOUNCE": 4,
                      "REQ_BLOCK_FORWARD": 5,
                      "REQ_BLOCK_BACKWARD": 6,
                      "REQ_BLOCK_RESP": 7,
                      "BLOCK_SYNCED": 8,
                      "BLOCK_PRODUCED": 9,
                      "USER": 10,
                      "ASK_PEERID": 11,
                      "ASK_PEERID_RESP": 12,
                      "CHAIN_CONFIG": 13,
                      "APP_CONFIG": 14
                  }
              },
              "TrxStroageType": {
                  "values": {
                      "CHAIN": 0,
                      "CACHE": 1
                  }
              },
              "Trx": {
                  "fields": {
                      "TrxId": {
                          "type": "string",
                          "id": 1
                      },
                      "Type": {
                          "type": "TrxType",
                          "id": 2
                      },
                      "GroupId": {
                          "type": "string",
                          "id": 3
                      },
                      "Data": {
                          "type": "bytes",
                          "id": 4
                      },
                      "TimeStamp": {
                          "type": "int64",
                          "id": 5
                      },
                      "Version": {
                          "type": "string",
                          "id": 6
                      },
                      "Expired": {
                          "type": "int64",
                          "id": 7
                      },
                      "ResendCount": {
                          "type": "int64",
                          "id": 8
                      },
                      "Nonce": {
                          "type": "int64",
                          "id": 9
                      },
                      "SenderPubkey": {
                          "type": "string",
                          "id": 10
                      },
                      "SenderSign": {
                          "type": "bytes",
                          "id": 11
                      },
                      "StorageType": {
                          "type": "TrxStroageType",
                          "id": 12
                      }
                  }
              }
          }
      }
  }
}