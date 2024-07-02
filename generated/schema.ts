// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export class Receipt extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Receipt entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Receipt must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Receipt", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Receipt | null {
    return changetype<Receipt | null>(store.get_in_block("Receipt", id));
  }

  static load(id: string): Receipt | null {
    return changetype<Receipt | null>(store.get("Receipt", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get txType(): i32 {
    let value = this.get("txType");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set txType(value: i32) {
    this.set("txType", Value.fromI32(value));
  }

  get revokerId(): i32 {
    let value = this.get("revokerId");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set revokerId(value: i32) {
    this.set("revokerId", Value.fromI32(value));
  }

  get lastLeafIndex(): BigInt {
    let value = this.get("lastLeafIndex");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set lastLeafIndex(value: BigInt) {
    this.set("lastLeafIndex", Value.fromBigInt(value));
  }

  get target(): Bytes {
    let value = this.get("target");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set target(value: Bytes) {
    this.set("target", Value.fromBytes(value));
  }

  get feeAssetId(): i32 {
    let value = this.get("feeAssetId");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set feeAssetId(value: i32) {
    this.set("feeAssetId", Value.fromI32(value));
  }

  get feeValue(): BigInt {
    let value = this.get("feeValue");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set feeValue(value: BigInt) {
    this.set("feeValue", Value.fromBigInt(value));
  }

  get paymaster(): Bytes {
    let value = this.get("paymaster");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set paymaster(value: Bytes) {
    this.set("paymaster", Value.fromBytes(value));
  }

  get assetMemo(): Bytes {
    let value = this.get("assetMemo");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set assetMemo(value: Bytes) {
    this.set("assetMemo", Value.fromBytes(value));
  }

  get complianceMemo(): Bytes {
    let value = this.get("complianceMemo");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set complianceMemo(value: Bytes) {
    this.set("complianceMemo", Value.fromBytes(value));
  }

  get noteMemos(): Array<Bytes> {
    let value = this.get("noteMemos");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytesArray();
    }
  }

  set noteMemos(value: Array<Bytes>) {
    this.set("noteMemos", Value.fromBytesArray(value));
  }
}

export class Note extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Note entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Note must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Note", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Note | null {
    return changetype<Note | null>(store.get_in_block("Note", id));
  }

  static load(id: string): Note | null {
    return changetype<Note | null>(store.get("Note", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get leafIndex(): BigInt {
    let value = this.get("leafIndex");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set leafIndex(value: BigInt) {
    this.set("leafIndex", Value.fromBigInt(value));
  }

  get revokerId(): i32 {
    let value = this.get("revokerId");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set revokerId(value: i32) {
    this.set("revokerId", Value.fromI32(value));
  }

  get noteMemos(): Array<Bytes> {
    let value = this.get("noteMemos");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytesArray();
    }
  }

  set noteMemos(value: Array<Bytes>) {
    this.set("noteMemos", Value.fromBytesArray(value));
  }
}

export class History extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save History entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type History must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("History", id.toString(), this);
    }
  }

  static loadInBlock(id: string): History | null {
    return changetype<History | null>(store.get_in_block("History", id));
  }

  static load(id: string): History | null {
    return changetype<History | null>(store.get("History", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get txType(): i32 {
    let value = this.get("txType");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set txType(value: i32) {
    this.set("txType", Value.fromI32(value));
  }

  get revokerId(): i32 {
    let value = this.get("revokerId");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set revokerId(value: i32) {
    this.set("revokerId", Value.fromI32(value));
  }

  get lastLeafIndex(): BigInt {
    let value = this.get("lastLeafIndex");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set lastLeafIndex(value: BigInt) {
    this.set("lastLeafIndex", Value.fromBigInt(value));
  }

  get target(): Bytes {
    let value = this.get("target");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set target(value: Bytes) {
    this.set("target", Value.fromBytes(value));
  }

  get feeAssetId(): i32 {
    let value = this.get("feeAssetId");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set feeAssetId(value: i32) {
    this.set("feeAssetId", Value.fromI32(value));
  }

  get feeValue(): BigInt {
    let value = this.get("feeValue");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set feeValue(value: BigInt) {
    this.set("feeValue", Value.fromBigInt(value));
  }

  get paymaster(): Bytes {
    let value = this.get("paymaster");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set paymaster(value: Bytes) {
    this.set("paymaster", Value.fromBytes(value));
  }

  get assetMemo(): Bytes {
    let value = this.get("assetMemo");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set assetMemo(value: Bytes) {
    this.set("assetMemo", Value.fromBytes(value));
  }

  get complianceMemo(): Bytes {
    let value = this.get("complianceMemo");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set complianceMemo(value: Bytes) {
    this.set("complianceMemo", Value.fromBytes(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }

  get blockNumber(): i32 {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set blockNumber(value: i32) {
    this.set("blockNumber", Value.fromI32(value));
  }

  get gas(): BigInt {
    let value = this.get("gas");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set gas(value: BigInt) {
    this.set("gas", Value.fromBigInt(value));
  }
}

export class Commitment extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Commitment entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Commitment must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Commitment", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Commitment | null {
    return changetype<Commitment | null>(store.get_in_block("Commitment", id));
  }

  static load(id: string): Commitment | null {
    return changetype<Commitment | null>(store.get("Commitment", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get leafIndex(): BigInt {
    let value = this.get("leafIndex");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set leafIndex(value: BigInt) {
    this.set("leafIndex", Value.fromBigInt(value));
  }

  get commitment(): BigInt {
    let value = this.get("commitment");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set commitment(value: BigInt) {
    this.set("commitment", Value.fromBigInt(value));
  }
}

export class RevokerData extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save RevokerData entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type RevokerData must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("RevokerData", id.toString(), this);
    }
  }

  static loadInBlock(id: string): RevokerData | null {
    return changetype<RevokerData | null>(
      store.get_in_block("RevokerData", id),
    );
  }

  static load(id: string): RevokerData | null {
    return changetype<RevokerData | null>(store.get("RevokerData", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get revokerId(): BigInt {
    let value = this.get("revokerId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set revokerId(value: BigInt) {
    this.set("revokerId", Value.fromBigInt(value));
  }

  get revokerPublicKey(): Array<BigInt> {
    let value = this.get("revokerPublicKey");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigIntArray();
    }
  }

  set revokerPublicKey(value: Array<BigInt>) {
    this.set("revokerPublicKey", Value.fromBigIntArray(value));
  }

  get encryptionPublicKey(): Array<BigInt> {
    let value = this.get("encryptionPublicKey");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigIntArray();
    }
  }

  set encryptionPublicKey(value: Array<BigInt>) {
    this.set("encryptionPublicKey", Value.fromBigIntArray(value));
  }

  get metadata(): Bytes | null {
    let value = this.get("metadata");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set metadata(value: Bytes | null) {
    if (!value) {
      this.unset("metadata");
    } else {
      this.set("metadata", Value.fromBytes(<Bytes>value));
    }
  }

  get status(): boolean {
    let value = this.get("status");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set status(value: boolean) {
    this.set("status", Value.fromBoolean(value));
  }
}

export class AssetAdded extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save AssetAdded entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type AssetAdded must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("AssetAdded", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): AssetAdded | null {
    return changetype<AssetAdded | null>(
      store.get_in_block("AssetAdded", id.toHexString()),
    );
  }

  static load(id: Bytes): AssetAdded | null {
    return changetype<AssetAdded | null>(
      store.get("AssetAdded", id.toHexString()),
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get assetAddress(): Bytes {
    let value = this.get("assetAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set assetAddress(value: Bytes) {
    this.set("assetAddress", Value.fromBytes(value));
  }

  get assetId(): i32 {
    let value = this.get("assetId");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set assetId(value: i32) {
    this.set("assetId", Value.fromI32(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class NullifierMarked extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save NullifierMarked entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type NullifierMarked must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("NullifierMarked", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): NullifierMarked | null {
    return changetype<NullifierMarked | null>(
      store.get_in_block("NullifierMarked", id.toHexString()),
    );
  }

  static load(id: Bytes): NullifierMarked | null {
    return changetype<NullifierMarked | null>(
      store.get("NullifierMarked", id.toHexString()),
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get nullifier(): BigInt {
    let value = this.get("nullifier");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set nullifier(value: BigInt) {
    this.set("nullifier", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class ZTransaction extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ZTransaction entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type ZTransaction must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("ZTransaction", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): ZTransaction | null {
    return changetype<ZTransaction | null>(
      store.get_in_block("ZTransaction", id.toHexString()),
    );
  }

  static load(id: Bytes): ZTransaction | null {
    return changetype<ZTransaction | null>(
      store.get("ZTransaction", id.toHexString()),
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }

  get input(): Bytes {
    let value = this.get("input");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set input(value: Bytes) {
    this.set("input", Value.fromBytes(value));
  }

  get gasUsed(): BigInt {
    let value = this.get("gasUsed");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set gasUsed(value: BigInt) {
    this.set("gasUsed", Value.fromBigInt(value));
  }

  get gasPrice(): BigInt {
    let value = this.get("gasPrice");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set gasPrice(value: BigInt) {
    this.set("gasPrice", Value.fromBigInt(value));
  }

  get status(): BigInt {
    let value = this.get("status");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set status(value: BigInt) {
    this.set("status", Value.fromBigInt(value));
  }

  get sender(): Bytes | null {
    let value = this.get("sender");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set sender(value: Bytes | null) {
    if (!value) {
      this.unset("sender");
    } else {
      this.set("sender", Value.fromBytes(<Bytes>value));
    }
  }

  get nonce(): BigInt | null {
    let value = this.get("nonce");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set nonce(value: BigInt | null) {
    if (!value) {
      this.unset("nonce");
    } else {
      this.set("nonce", Value.fromBigInt(<BigInt>value));
    }
  }

  get initCode(): Bytes | null {
    let value = this.get("initCode");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set initCode(value: Bytes | null) {
    if (!value) {
      this.unset("initCode");
    } else {
      this.set("initCode", Value.fromBytes(<Bytes>value));
    }
  }

  get callData(): Bytes | null {
    let value = this.get("callData");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set callData(value: Bytes | null) {
    if (!value) {
      this.unset("callData");
    } else {
      this.set("callData", Value.fromBytes(<Bytes>value));
    }
  }

  get accountGasLimits(): Bytes | null {
    let value = this.get("accountGasLimits");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set accountGasLimits(value: Bytes | null) {
    if (!value) {
      this.unset("accountGasLimits");
    } else {
      this.set("accountGasLimits", Value.fromBytes(<Bytes>value));
    }
  }

  get preVerificationGas(): BigInt | null {
    let value = this.get("preVerificationGas");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set preVerificationGas(value: BigInt | null) {
    if (!value) {
      this.unset("preVerificationGas");
    } else {
      this.set("preVerificationGas", Value.fromBigInt(<BigInt>value));
    }
  }

  get gasFees(): Bytes | null {
    let value = this.get("gasFees");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set gasFees(value: Bytes | null) {
    if (!value) {
      this.unset("gasFees");
    } else {
      this.set("gasFees", Value.fromBytes(<Bytes>value));
    }
  }

  get paymasterAndData(): Bytes | null {
    let value = this.get("paymasterAndData");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set paymasterAndData(value: Bytes | null) {
    if (!value) {
      this.unset("paymasterAndData");
    } else {
      this.set("paymasterAndData", Value.fromBytes(<Bytes>value));
    }
  }

  get signature(): Bytes | null {
    let value = this.get("signature");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set signature(value: Bytes | null) {
    if (!value) {
      this.unset("signature");
    } else {
      this.set("signature", Value.fromBytes(<Bytes>value));
    }
  }

  get beneficiary(): Bytes | null {
    let value = this.get("beneficiary");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set beneficiary(value: Bytes | null) {
    if (!value) {
      this.unset("beneficiary");
    } else {
      this.set("beneficiary", Value.fromBytes(<Bytes>value));
    }
  }

  get methodId(): string {
    let value = this.get("methodId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set methodId(value: string) {
    this.set("methodId", Value.fromString(value));
  }
}
