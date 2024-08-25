import { ethereum, Bytes, Address, BigInt, log, crypto, ByteArray } from "@graphprotocol/graph-ts"
import {
  AssetAdded as AssetAddedEvent,
  Commitment as CommitmentEvent,
  NullifierMarked as NullifierMarkedEvent,
  Receipt as ReceiptEvent,
  RevokerRegistered as RevokerRegisteredEvent,
  RevokerStatusUpdated as RevokerStatusUpdatedEvent,
  RegisterAddress as RegisterAddressEvent
} from "../generated/Pool/Pool"
import {
  AssetAdded,
  Commitment,
  Note,
  NullifierMarked,
  Receipt,
  RevokerData,
  History,
  ZTransaction,
  RegisterAddress,
} from "../generated/schema"

// Event handler functions
export function handleAssetAdded(event: AssetAddedEvent): void {
  let asset = new AssetAdded(
    event.params.assetId.toString()
  )
  asset.assetAddress = event.params.assetAddress
  asset.assetId = event.params.assetId
  // asset.blockNumber = event.block.number
  // asset.blockTimestamp = event.block.timestamp
  // asset.transactionHash = event.transaction.hash
  asset.save()
}

export function handleCommitment(event: CommitmentEvent): void {
  let commitment = new Commitment(event.params.leafIndex.toString())
  commitment.leafIndex = event.params.leafIndex.toI32()
  commitment.commitment = event.params.commitment
  commitment.save()
}

export function handleNullifierMarked(event: NullifierMarkedEvent): void {
  let nullifierMarked = new NullifierMarked(event.params.nullifier.toString())
  nullifierMarked.nullifier = event.params.nullifier
  nullifierMarked.markLeafIndex = event.params.markLeafIndex.toI32()
  nullifierMarked.save()
}

// MemoType constants
const FULLY_ENCRYPTED = Bytes.fromHexString('0x00');
const SEMI_ENCRYPTED = Bytes.fromHexString('0x01');

// Helper functions for slicing and concatenating hex data
// function sliceHex(data: Bytes, start: i32, end: i32): Bytes {
//   return data.subarray(start, end) as Bytes;
// }
function sliceHex(hex: string, start: i32, end: i32): Bytes {
  // Remove the '0x' prefix if it exists
  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }

  // Calculate the start and end indices, considering each hex character represents half a byte
  let startIdx = start * 2;
  let endIdx = end * 2;

  // Ensure indices are within bounds
  if (startIdx > hex.length || endIdx > hex.length) {
    log.error("sliceHex out of bounds: startIdx={}, endIdx={}, length={}", [
      startIdx.toString(),
      endIdx.toString(),
      hex.length.toString(),
    ]);
    return Bytes.empty(); // Return an empty Bytes object if out of bounds
  }

  // Slice the string
  let slicedHex = hex.slice(startIdx, endIdx);

  // Convert the sliced hex string back to Bytes and return
  return Bytes.fromHexString("0x" + slicedHex) as Bytes;
}


// function concatHex(parts: Bytes[]): Bytes {
//   let result = new ByteArray(0);
//   for (let i = 0; i < parts.length; i++) {
//     result = result.concat(parts[i]) as Bytes;
//   }
//   return result as Bytes;
// }

function concatHex(hexStrings: string[]): string {
  // Initialize an empty string to store the concatenated result
  let result = "";

  for (let i = 0; i < hexStrings.length; i++) {
    // Remove the '0x' prefix if it exists
    let hex = hexStrings[i].startsWith("0x") ? hexStrings[i].slice(2) : hexStrings[i];

    // Add the hex string to the result
    result += hex;
  }

  // Return the concatenated result with the '0x' prefix
  return "0x" + result;
}

// Modified handleReceipt function
export function handleReceipt(event: ReceiptEvent): void {
  let leafIndex = Bytes.fromBigInt(event.params.lastLeafIndex);
  let txHash = event.transaction.hash;
  let combinedBytes = leafIndex.concat(txHash);

  let id = crypto.keccak256(combinedBytes);

  let receipt = new Receipt(id.toHex());
  receipt.txType = event.params.txType;
  receipt.revokerId = event.params.revokerId;
  receipt.lastLeafIndex = event.params.lastLeafIndex.toI32();
  receipt.target = event.params.target;
  receipt.feeAssetId = event.params.feeAssetId;
  receipt.feeValue = event.params.feeValue;
  receipt.paymaster = event.params.paymaster;
  receipt.assetsMemo = event.params.assetsMemo;
  receipt.refundMemo = event.params.refundMemo;
  receipt.notesMemo = event.params.notesMemo;
  receipt.txHash = event.transaction.hash;

  receipt.save();

  // Parsing receipt to notes
  let encryptedDataEncryptionKeySeed = sliceHex(event.params.notesMemo.toHexString(), 0, 32 * 3);
  let encryptedRefundData = sliceHex(event.params.notesMemo.toHexString(), 32 * 3, 32 * 7);

  let encryptedNotes: Bytes[] = [];
  for (let i = 32 * 7; i < event.params.notesMemo.length; i += 32 * 4) {
    encryptedNotes.push(sliceHex(event.params.notesMemo.toHexString(), i, i + 32 * 4));
  }

  let semiEncryptedNotes: Note[] = [];
  let lastLeafIndex = event.params.lastLeafIndex.toI32();

  // Handle semi-encrypted notes
  if (event.params.refundMemo.length > 0) {
    let refundAddress = sliceHex(event.params.refundMemo.toHexString(), 0, 32);
    let assetData = sliceHex(event.params.refundMemo.toHexString(), 32, 64);

    let assets: Bytes[] = [];
    for (let i = 0; i < assetData.length; i += 32) {
      assets.push(sliceHex(assetData.toHexString(), i, i + 32));
    }

    for (let i = assets.length - 1; i >= 0; i--) {
      let memo = concatHex([
        SEMI_ENCRYPTED.toHexString(),
        assets[i].toHexString(),
        refundAddress.toHexString(),
        encryptedRefundData.toHexString(),
      ]);

      let note = new Note((lastLeafIndex - i).toString());
      note.leafIndex = lastLeafIndex - i;
      note.revokerId = event.params.revokerId;
      note.memo = Bytes.fromHexString(memo);
      note.timestamp = event.block.timestamp;
      note.save();

      semiEncryptedNotes.push(note);
    }
  }

  let fullyEncryptedNotes: Note[] = [];

  // Parse fully encrypted notes
  for (let i = encryptedNotes.length - 1; i >= 0; i--) {
    let memo = concatHex([FULLY_ENCRYPTED.toHexString(), encryptedNotes[i].toHexString()]);
    let note = new Note((lastLeafIndex - semiEncryptedNotes.length - i).toString());
    note.leafIndex = lastLeafIndex - semiEncryptedNotes.length - i;
    note.memo = Bytes.fromHexString(memo);
    note.revokerId = event.params.revokerId;
    note.timestamp = event.block.timestamp;
    note.save();

    fullyEncryptedNotes.push(note);
  }

  // Create and save the History entity
  let history = new History(id.toHex());

  history.txType = event.params.txType as i32;
  history.revokerId = event.params.revokerId;
  history.lastLeafIndex = event.params.lastLeafIndex.toI32();
  history.target = event.params.target;
  history.feeAssetId = event.params.feeAssetId;
  history.feeValue = event.params.feeValue;
  history.paymaster = event.params.paymaster;
  history.assetsMemo = event.params.assetsMemo;
  // history.complianceMemo = event.params.complianceMemo;
  history.notesMemo = event.params.notesMemo;
  history.refundMemo = event.params.refundMemo;
  history.keysMemo = event.params.keysMemo;
  history.timestamp = event.block.timestamp;
  history.txHash = event.transaction.hash;
  history.blockNumber = event.block.number.toI32();
  history.gasUsed = event.receipt!.gasUsed;
  history.gasPrice = event.transaction.gasPrice;

  history.save();
}

export function handleRevokerRegistered(event: RevokerRegisteredEvent): void {
  let revoker = new RevokerData(event.params.id.toString())
  revoker.revokerPublicKey = [
    event.params.revokerPublicKey[0],
    event.params.revokerPublicKey[1]
  ]
  revoker.encryptionPublicKey = [
    event.params.encryptionPublicKey[0],
    event.params.encryptionPublicKey[1]
  ]
  revoker.metadata = event.params.metadata
  revoker.status = true
  revoker.revokerId = event.params.id.toI32()
  revoker.save()
}

export function handleRevokerStatusUpdated(event: RevokerStatusUpdatedEvent): void {
  let revoker = RevokerData.load(event.params.id.toString())
  if (revoker) {
    revoker.status = event.params.status
    revoker.save()
  }
}

export function handleRegisterAddress(event: RegisterAddressEvent): void {
  let registerAddress = new RegisterAddress(event.transaction.hash.toHex())

  registerAddress.publicAddress = event.params.publicAddress
  registerAddress.rootAddress = event.params.rootAddress
  registerAddress.leafIndex = event.params.leafIndex.toI32()
  registerAddress.shieldedAddress = event.params.shieldedAddress

  registerAddress.save()
}
