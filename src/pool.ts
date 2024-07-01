import { ethereum, Bytes, Address, BigInt, log } from "@graphprotocol/graph-ts"
import {
  AssetAdded as AssetAddedEvent,
  Commitment as CommitmentEvent,
  Initialized as InitializedEvent,
  NullifierMarked as NullifierMarkedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Receipt as ReceiptEvent,
  RevokerRegistered as RevokerRegisteredEvent,
  RevokerStatusUpdated as RevokerStatusUpdatedEvent,
  Upgraded as UpgradedEvent,
} from "../generated/Pool/Pool"
import {
  AssetAdded,
  Commitment,
  Initialized,
  Note,
  NullifierMarked,
  OwnershipTransferred,
  Receipt,
  RevokerData,
  Upgraded,
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

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.version = event.params.version
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
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

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

// Define a type for the tuple structure
class UserOperation extends ethereum.Tuple {
  get sender(): Address {
    return this[0].toAddress()
  }

  get nonce(): BigInt {
    return this[1].toBigInt()
  }

  get initCode(): Bytes {
    return this[2].toBytes()
  }

  get callData(): Bytes {
    return this[3].toBytes()
  }

  get accountGasLimits(): Bytes {
    return this[4].toBytes()
  }

  get preVerificationGas(): BigInt {
    return this[5].toBigInt()
  }

  get gasFees(): Bytes {
    return this[6].toBytes()
  }

  get paymasterAndData(): Bytes {
    return this[7].toBytes()
  }

  get signature(): Bytes {
    return this[8].toBytes()
  }
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

  // Decode the transaction input
  let methodId = event.transaction.input.toHexString().slice(0, 10)
  ztx.methodId = methodId

  let txinput = event.transaction.input.toHexString()
    let inputString = txinput.slice(10)
    let inputBytes = Bytes.fromHexString("0x" + inputString)

  if (methodId == '0x765e827f') {
    let decoded = ethereum.decode(
      "(address,uint256,bytes,bytes,bytes32,uint256,bytes32,bytes,bytes)[]",
      inputBytes
    )

  
    if (decoded !== null) {
      let decodedArray = decoded.toTupleArray<UserOperation>()
      if (decodedArray.length > 0) {
        for (let i = 0; i < decodedArray.length; i++) {
          let element = decodedArray[i]
          if(element.sender.toHex() == "0xe47C253391b0cD1Dcb7A9d231F0e1646833F49be".toLowerCase()) {
            ztx.sender = element.sender
            ztx.nonce = element.nonce
            ztx.initCode = element.initCode
            ztx.callData = element.callData
            ztx.accountGasLimits = element.accountGasLimits
            ztx.preVerificationGas = element.preVerificationGas
            ztx.gasFees = element.gasFees
            ztx.paymasterAndData = element.paymasterAndData
            ztx.signature = element.signature
            break
          }
        }

        let inputLength = inputString.length

        let chunks: Bytes[] = []
        for (let i = 0; i < inputLength; i += 64) {
          let chunkString = inputString.slice(i, i + 64)
          let chunk = Bytes.fromHexString('0x'+chunkString)
          chunks.push(chunk)
        }

        ztx.beneficiary = chunks[1]

      } else {
        log.info('calldata not decoded: {}', [
          event.transaction.input.toHexString()
        ]);
      }

    } 

  }

  ztx.save()

  let note = new Note(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  note.leafIndex = event.params.lastLeafIndex
  note.revokerId = event.params.revokerId
  note.noteMemos = event.params.noteMemos

  note.save()

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
  let revoker = Revoker.load(event.params.id.toString())
  if (revoker) {
    revoker.status = event.params.status
    revoker.save()
  }
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.implementation = event.params.implementation
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

