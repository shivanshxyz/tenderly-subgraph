import { Bytes, crypto } from "@graphprotocol/graph-ts";
import {
  AssetAdded as AssetAddedEvent,
  Commitment as CommitmentEvent,
  NullifierMarked as NullifierMarkedEvent,
  Receipt as ReceiptEvent,
  RevokerRegistered as RevokerRegisteredEvent,
  RevokerStatusUpdated as RevokerStatusUpdatedEvent,
  RegisterAddress as RegisterAddressEvent,
} from "../generated/Pool/Pool";
import {
  Asset,
  Commitment,
  NoteMemo,
  NullifierMarked,
  Receipt,
  RevokerData,
  History,
  RegisteredAddress,
} from "../generated/schema";

import { FULLY_ENCRYPTED, SEMI_ENCRYPTED, sliceHex, concatHex } from "./utils";

// Event handler functions
export function handleAssetAdded(event: AssetAddedEvent): void {
  let asset = new Asset(event.params.assetId.toString());
  asset.assetId = event.params.assetId;
  asset.assetAddress = event.params.assetAddress;
  asset.isActive = true;
  asset.save();
}

export function handleCommitment(event: CommitmentEvent): void {
  let id = event.params.leafIndex.toString();
  
  // Check if a Commitment entity with this ID already exists
  let commitment = Commitment.load(id);
  
  // Only create a new entity if it doesn't already exist
  if (!commitment) {
    commitment = new Commitment(id);
    commitment.leafIndex = event.params.leafIndex.toI32();
    commitment.commitment = event.params.commitment;
    commitment.save();
  }
}

export function handleNullifierMarked(event: NullifierMarkedEvent): void {
  let nullifierMarked = new NullifierMarked(event.params.nullifier.toString());
  nullifierMarked.nullifier = event.params.nullifier;
  nullifierMarked.markLeafIndex = event.params.markLeafIndex.toI32();
  nullifierMarked.save();
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

  ////////////////////////////////////////
  ///       Parse notes memo           //
  ////////////////////////////////////////

  // First 3, 32-byte chunks are the encrypted data decryption key seed
  let encryptedDataEncryptionKeySeed = sliceHex(
    event.params.notesMemo.toHexString(),
    0,
    32 * 3
  );

  // Next 4, 32-byte chunks are the encrypted refund data
  let encryptedRefundData = sliceHex(event.params.notesMemo.toHexString(), 32 * 3, 32 * 7);

  // The next bytes are the encrypted notes: 4, 32-byte chunks per note
  let encryptedNotes: Bytes[] = [];
  for (let i = 32 * 7; i < event.params.notesMemo.length; i += 32 * 4) {
    encryptedNotes.push(sliceHex(event.params.notesMemo.toHexString(), i, i + 32 * 4));
  }

  ////////////////////////////////////////
  ///       Parse keys memo             //
  ////////////////////////////////////////

  // First 80 bytes are the encrypted refund data decryption key
  let encryptedRefundDataDecryptionKey = sliceHex(event.params.keysMemo.toHexString(), 0, 80);

  // The next 80 bytes chunks are the encrypted notes decryption keys
  const encryptedNotesDecryptionKeys: Bytes[] = [];
  for (let i = 80; i < event.params.keysMemo.length; i += 80) {
    encryptedNotesDecryptionKeys.push(
      sliceHex(event.params.keysMemo.toHexString(), i, i + 80)
    );
  }

  let lastLeafIndex = event.params.lastLeafIndex.toI32();

  ////////////////////////////////////////
  ///       Process any refund notes    //
  ////////////////////////////////////////
  let semiEncryptedNotes: NoteMemo[] = [];

  // For adaptor transactions (where semi-encrypted notes are created), refundMemo
  // is non-empty. It contains adaptor-output asset info and refund address.
  if (event.params.refundMemo.length > 0) {
    // First 32 bytes are the refund address
    let refundAddress = sliceHex(event.params.refundMemo.toHexString(), 0, 32);

    // Next words are adaptor-output assets info (i.e. assetId + value)
    let assetData = sliceHex(
      event.params.refundMemo.toHexString(),
      32,
      event.params.refundMemo.length
    );

    // Each asset info is 31 bytes (3 bytes assetId + 28 bytes value)
    let assets: Bytes[] = [];
    for (let i = 0; i < assetData.length; i += 31) {
      assets.push(sliceHex(assetData.toHexString(), i, i + 31));
    }

    // Adaptor-output notes are appended last, so get the last indices when inserted into tree
    for (let i = 0; i < assets.length; i++) {
      let leafIndex = lastLeafIndex - assets.length + 1 + i;

      let note = new NoteMemo(leafIndex.toString());
      note.leafIndex = leafIndex;
      note.memoType = SEMI_ENCRYPTED.toU32();
      note.encryptedKey = encryptedRefundDataDecryptionKey;
      let encryptedNote: string = concatHex([
        assets[i].toHexString(),
        refundAddress.toHexString(),
        encryptedRefundData.toHexString(),
      ]);
      note.encryptedNote = Bytes.fromHexString(encryptedNote)
      note.timestamp = event.block.timestamp;
      note.revokerId = event.params.revokerId;

      note.save();

      semiEncryptedNotes.push(note);
    }
  }

  ////////////////////////////////////////
  ///       Process any tx notes        //
  ////////////////////////////////////////
  let fullyEncryptedNotes: NoteMemo[] = [];

  // Parse fully encrypted notes
  for (let i = 0; i < encryptedNotes.length; i++) {
    let leafIndex =
      lastLeafIndex - semiEncryptedNotes.length - encryptedNotes.length + 1 + i;

    let note = new NoteMemo(leafIndex.toString());
    note.leafIndex = leafIndex;
    note.memoType = FULLY_ENCRYPTED.toU32();
    note.encryptedKey = encryptedNotesDecryptionKeys[i];
    note.encryptedNote = encryptedNotes[i];
    note.timestamp = event.block.timestamp;
    note.revokerId = event.params.revokerId;
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
  let revoker = new RevokerData(event.params.id.toString());
  revoker.revokerPublicKey = [
    event.params.revokerPublicKey[0],
    event.params.revokerPublicKey[1],
  ];
  revoker.encryptionPublicKey = [
    event.params.encryptionPublicKey[0],
    event.params.encryptionPublicKey[1],
  ];
  revoker.metadata = event.params.metadata;
  revoker.status = true;
  revoker.revokerId = event.params.id.toI32();
  revoker.save();
}

export function handleRevokerStatusUpdated(
  event: RevokerStatusUpdatedEvent
): void {
  let revoker = RevokerData.load(event.params.id.toString());
  if (revoker) {
    revoker.status = event.params.status;
    revoker.save();
  }
}

export function handleRegisterAddress(event: RegisterAddressEvent): void {
  let registerAddress = new RegisteredAddress(event.transaction.hash.toHex());

  registerAddress.publicAddress = event.params.publicAddress;
  registerAddress.rootAddress = event.params.rootAddress;
  registerAddress.leafIndex = event.params.leafIndex.toI32();
  registerAddress.shieldedAddress = event.params.shieldedAddress;

  registerAddress.save();
}