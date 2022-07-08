import protobufjs from 'protobufjs'
import { hexToUint8Array } from './typeTransform';

const OBJECT_PREFIX_BUFFER = hexToUint8Array("0A24747970652E676F6F676C65617069732E636F6D2F71756F72756D2E70622E4F626A65637412");

export const create = ({
  protoFileName, type, payload
}: {
  protoFileName: string;
  type: string;
  payload: any;
}) => new Promise((resolve, reject) => {
  protobufjs.load(protoFileName, function(err, root: any) {
    if (err) {
      reject(err);
    }
    const object = root.lookupType(type);
    const errMsg = object.verify(payload);
    if (errMsg) {
      reject(errMsg);
      return;
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
      resolve(new Uint8Array(result));
    } else {
      resolve(new Uint8Array(buffer));
    }
  });
}) as Promise<Uint8Array>;

export const toObject = ({
  protoFileName, type, buffer
}: {
  protoFileName: string;
  type: string;
  buffer: Uint8Array;
}) => new Promise((resolve, reject) => {
  protobufjs.load(protoFileName, function(err, root: any) {
    if (err) {
      reject(err);
    }
    const object = root.lookupType(type);
    const message = object.decode(buffer.subarray(OBJECT_PREFIX_BUFFER.length + 1));
    const result = object.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
    });
    resolve(result);
  });
});