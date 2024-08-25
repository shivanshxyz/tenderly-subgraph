import { Bytes, log } from "@graphprotocol/graph-ts";

// MemoType constants
export const FULLY_ENCRYPTED = Bytes.fromHexString('0x00');
export const SEMI_ENCRYPTED = Bytes.fromHexString('0x01');

export function sliceHex(hex: string, start: i32, end: i32): Bytes {
    if (hex.startsWith("0x")) {
      hex = hex.slice(2);
    }
  
    let startIdx = start * 2;
    let endIdx = end * 2;

    if (startIdx > hex.length || endIdx > hex.length) {
      log.error("sliceHex out of bounds: startIdx={}, endIdx={}, length={}", [
        startIdx.toString(),
        endIdx.toString(),
        hex.length.toString(),
      ]);
      return Bytes.empty(); // Return an empty Bytes object if out of bounds
    }
  
    let slicedHex = hex.slice(startIdx, endIdx);
  
    return Bytes.fromHexString("0x" + slicedHex) as Bytes;
  }
  
export function concatHex(hexStrings: string[]): string {
    let result = "";
  
    for (let i = 0; i < hexStrings.length; i++) {
      let hex = hexStrings[i].startsWith("0x") ? hexStrings[i].slice(2) : hexStrings[i];
  
      result += hex;
    }
  
    return "0x" + result;
  }