import { ethereum, Bytes, Address, BigInt, log } from "@graphprotocol/graph-ts"
import {
  AssetAdded as AssetAddedEvent,
  Commitment as CommitmentEvent,
  NullifierMarked as NullifierMarkedEvent,
  Receipt as ReceiptEvent,
  RevokerRegistered as RevokerRegisteredEvent,
  RevokerStatusUpdated as RevokerStatusUpdatedEvent,
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
} from "../generated/schema"

// Event handler functions
export function handleAssetAdded(event: AssetAddedEvent): void {
  let entity = new AssetAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.assetAddress = event.params.assetAddress
  entity.assetId = event.params.assetId
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleCommitment(event: CommitmentEvent): void {
  let entity = new Commitment(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.leafIndex = event.params.leafIndex
  entity.commitment = event.params.commitment
  entity.save()
}

export function handleNullifierMarked(event: NullifierMarkedEvent): void {
  let entity = new NullifierMarked(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.nullifier = event.params.nullifier
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleReceipt(event: ReceiptEvent): void {
  let receipt = new Receipt(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  receipt.txType = event.params.txType
  receipt.revokerId = event.params.revokerId
  receipt.lastLeafIndex = event.params.lastLeafIndex
  receipt.target = event.params.target
  receipt.feeAssetId = event.params.feeAssetId
  receipt.feeValue = event.params.feeValue
  receipt.paymaster = event.params.paymaster
  receipt.assetMemo = event.params.assetMemo
  receipt.complianceMemo = event.params.complianceMemo
  receipt.noteMemos = event.params.noteMemos

  receipt.save()

  let ztx = new ZTransaction(event.transaction.hash)
  ztx.blockNumber = event.block.number
  ztx.blockTimestamp = event.block.timestamp
  ztx.transactionHash = event.transaction.hash
  ztx.input = event.transaction.input
  ztx.gasUsed = event.receipt!.gasUsed
  ztx.gasPrice = event.transaction.gasPrice
  ztx.status = event.receipt!.status

  ztx.save()

  let noteMemos = event.params.noteMemos
  let lastLeafIndex = event.params.lastLeafIndex
  let revokerId = event.params.revokerId

  for (let i = 0; i < noteMemos.length; i++) {
    let note = new Note(event.transaction.hash.toHex() + "-" + event.logIndex.toString() + "-" + i.toString())
    note.leafIndex = lastLeafIndex.minus(BigInt.fromI32(i))
    note.revokerId = revokerId
    note.noteMemos = [noteMemos[i]]
    note.save()
  }

  // Create and save the History entity
  let history = new History(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  
  history.txType = event.params.txType as i32
  history.revokerId = event.params.revokerId
  history.lastLeafIndex = event.params.lastLeafIndex
  history.target = event.params.target
  history.feeAssetId = event.params.feeAssetId
  history.feeValue = event.params.feeValue
  history.paymaster = event.params.paymaster
  history.assetMemo = event.params.assetMemo
  history.complianceMemo = event.params.complianceMemo
  history.timestamp = event.block.timestamp
  history.txHash = event.transaction.hash
  history.blockNumber = event.block.number.toI32()
  history.gas = event.receipt!.gasUsed
  
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
  revoker.status = false
  revoker.revokerId = event.params.id
  revoker.save()
}

export function handleRevokerStatusUpdated(event: RevokerStatusUpdatedEvent): void {
  let revoker = RevokerData.load(event.params.id.toString())
  if (revoker) {
    revoker.status = event.params.status
    revoker.save()
  }
}
