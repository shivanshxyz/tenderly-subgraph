import { ethereum, Bytes, Address, BigInt, log } from "@graphprotocol/graph-ts"
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
  let assetAdded = new AssetAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  assetAdded.assetAddress = event.params.assetAddress
  assetAdded.assetId = event.params.assetId
  assetAdded.blockNumber = event.block.number
  assetAdded.blockTimestamp = event.block.timestamp
  assetAdded.transactionHash = event.transaction.hash
  assetAdded.save()
}

export function handleCommitment(event: CommitmentEvent): void {
  let commitment = new Commitment(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  commitment.leafIndex = event.params.leafIndex
  commitment.commitment = event.params.commitment
  commitment.save()
}

export function handleNullifierMarked(event: NullifierMarkedEvent): void {
  let nullifierMarked = new NullifierMarked(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  nullifierMarked.nullifier = event.params.nullifier
  nullifierMarked.blockNumber = event.block.number
  nullifierMarked.blockTimestamp = event.block.timestamp
  nullifierMarked.transactionHash = event.transaction.hash
  nullifierMarked.save()
}

export function handleReceipt(event: ReceiptEvent): void {
  // let receipt = new Receipt(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  // receipt.txType = event.params.txType
  // receipt.revokerId = event.params.revokerId
  // receipt.lastLeafIndex = event.params.lastLeafIndex
  // receipt.target = event.params.target
  // receipt.feeAssetId = event.params.feeAssetId
  // receipt.feeValue = event.params.feeValue
  // receipt.paymaster = event.params.paymaster
  // receipt.assetMemo = event.params.assetMemo
  // receipt.complianceMemo = event.params.complianceMemo
  // receipt.noteMemos = event.params.noteMemos

  // receipt.save()

  // let ztx = new ZTransaction(event.transaction.hash)
  // ztx.blockNumber = event.block.number
  // ztx.blockTimestamp = event.block.timestamp
  // ztx.transactionHash = event.transaction.hash
  // ztx.input = event.transaction.input
  // ztx.gasUsed = event.receipt!.gasUsed
  // ztx.gasPrice = event.transaction.gasPrice
  // ztx.status = event.receipt!.status

  // ztx.save()

  let noteMemos = event.params.noteMemos
  let lastLeafIndex = event.params.lastLeafIndex
  let revokerId = event.params.revokerId

  for (let i = 0; i < noteMemos.length; i++) {
    let note = new Note(event.transaction.hash.toHex() + "-" + event.logIndex.toString() + "-" + i.toString())
    note.leafIndex = lastLeafIndex.minus(BigInt.fromI32(i))
    note.revokerId = revokerId
    note.noteMemos = noteMemos[i]
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
  revoker.status = true
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

export function handleRegisterAddress(event: RegisterAddressEvent): void {
  let registerAddress = new RegisterAddress(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

  registerAddress.sender = event.params.sender
  registerAddress.addr = event.params.addr
  registerAddress.leafIndex = event.params.leafIndex
  registerAddress.publicKeys = event.params.publicKeys

  registerAddress.save()
}
