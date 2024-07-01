import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  Announcement,
  AssetAdded,
  ComplianceMemo,
  Initialized,
  InputNoteMemos,
  NullifierMarked,
  OwnershipTransferred,
  Upgraded
} from "../generated/Pool/Pool"

export function createAnnouncementEvent(
  leafIndex: BigInt,
  commitment: BigInt,
  outMemo: Bytes
): Announcement {
  let announcementEvent = changetype<Announcement>(newMockEvent())

  announcementEvent.parameters = new Array()

  announcementEvent.parameters.push(
    new ethereum.EventParam(
      "leafIndex",
      ethereum.Value.fromUnsignedBigInt(leafIndex)
    )
  )
  announcementEvent.parameters.push(
    new ethereum.EventParam(
      "commitment",
      ethereum.Value.fromUnsignedBigInt(commitment)
    )
  )
  announcementEvent.parameters.push(
    new ethereum.EventParam("outMemo", ethereum.Value.fromBytes(outMemo))
  )

  return announcementEvent
}

export function createAssetAddedEvent(
  assetAddress: Address,
  assetId: i32
): AssetAdded {
  let assetAddedEvent = changetype<AssetAdded>(newMockEvent())

  assetAddedEvent.parameters = new Array()

  assetAddedEvent.parameters.push(
    new ethereum.EventParam(
      "assetAddress",
      ethereum.Value.fromAddress(assetAddress)
    )
  )
  assetAddedEvent.parameters.push(
    new ethereum.EventParam(
      "assetId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(assetId))
    )
  )

  return assetAddedEvent
}

export function createComplianceMemoEvent(
  complianceMemo: Bytes
): ComplianceMemo {
  let complianceMemoEvent = changetype<ComplianceMemo>(newMockEvent())

  complianceMemoEvent.parameters = new Array()

  complianceMemoEvent.parameters.push(
    new ethereum.EventParam(
      "complianceMemo",
      ethereum.Value.fromBytes(complianceMemo)
    )
  )

  return complianceMemoEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createInputNoteMemosEvent(inMemos: Bytes): InputNoteMemos {
  let inputNoteMemosEvent = changetype<InputNoteMemos>(newMockEvent())

  inputNoteMemosEvent.parameters = new Array()

  inputNoteMemosEvent.parameters.push(
    new ethereum.EventParam("inMemos", ethereum.Value.fromBytes(inMemos))
  )

  return inputNoteMemosEvent
}

export function createNullifierMarkedEvent(nullifier: BigInt): NullifierMarked {
  let nullifierMarkedEvent = changetype<NullifierMarked>(newMockEvent())

  nullifierMarkedEvent.parameters = new Array()

  nullifierMarkedEvent.parameters.push(
    new ethereum.EventParam(
      "nullifier",
      ethereum.Value.fromUnsignedBigInt(nullifier)
    )
  )

  return nullifierMarkedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
