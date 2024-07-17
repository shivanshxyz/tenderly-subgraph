import { ethereum, Bytes, Address, BigInt, log, crypto } from "@graphprotocol/graph-ts"
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

export function handleReceipt(event: ReceiptEvent): void {
  let leafIndex = Bytes.fromBigInt(event.params.lastLeafIndex);
  let txHash = event.transaction.hash;
  let combinedBytes = leafIndex.concat(txHash);

  let id = crypto.keccak256(combinedBytes);

  let receipt = new Receipt(id.toHex());
  receipt.txType = event.params.txType
  receipt.revokerId = event.params.revokerId
  receipt.lastLeafIndex = event.params.lastLeafIndex.toI32()
  receipt.target = event.params.target
  receipt.feeAssetId = event.params.feeAssetId
  receipt.feeValue = event.params.feeValue
  receipt.paymaster = event.params.paymaster
  receipt.assetMemo = event.params.assetMemo
  receipt.complianceMemo = event.params.complianceMemo
  receipt.noteMemos = event.params.noteMemos
  receipt.txHash = event.transaction.hash

  receipt.save()

  let noteMemos = event.params.noteMemos
  let lastLeafIndex = event.params.lastLeafIndex
  let revokerId = event.params.revokerId

  for (let i = 0; i < noteMemos.length; i++) {
    let leafIndex = lastLeafIndex.minus(BigInt.fromI32(noteMemos.length - 1 - i)).toI32();
    // let note = new Note(event.transaction.hash.toHex() + "-" + event.params.lastLeafIndex.toString() + "-" + i.toString())
    let note = new Note(leafIndex.toString())
    note.leafIndex = leafIndex
    // note.leafIndex = lastLeafIndex.toI32() - noteMemos.length + i
    note.revokerId = revokerId
    note.memo = noteMemos[i]
    note.timestamp = event.block.timestamp
    note.save()
  }

  // Create and save the History entity
  // let history = new History(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  let history = new History(id.toHex())
  
  history.txType = event.params.txType as i32
  history.revokerId = event.params.revokerId
  history.lastLeafIndex = event.params.lastLeafIndex.toI32()
  history.target = event.params.target
  history.feeAssetId = event.params.feeAssetId
  history.feeValue = event.params.feeValue
  history.paymaster = event.params.paymaster
  history.assetMemo = event.params.assetMemo
  history.complianceMemo = event.params.complianceMemo
  history.noteMemos = event.params.noteMemos
  history.timestamp = event.block.timestamp
  history.txHash = event.transaction.hash
  history.blockNumber = event.block.number.toI32()
  history.gasUsed = event.receipt!.gasUsed
  history.gasPrice = event.transaction.gasPrice

  
  history.save()
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

  registerAddress.sender = event.params.sender
  registerAddress.rootAddress = event.params.rootAddress
  registerAddress.leafIndex = event.params.leafIndex.toI32()
  registerAddress.shieldedAddress = event.params.shieldedAddress

  registerAddress.save()
}
