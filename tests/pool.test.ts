import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { Announcement } from "../generated/schema"
import { Announcement as AnnouncementEvent } from "../generated/Pool/Pool"
import { handleAnnouncement } from "../src/pool"
import { createAnnouncementEvent } from "./pool-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let leafIndex = BigInt.fromI32(234)
    let commitment = BigInt.fromI32(234)
    let outMemo = Bytes.fromI32(1234567890)
    let newAnnouncementEvent = createAnnouncementEvent(
      leafIndex,
      commitment,
      outMemo
    )
    handleAnnouncement(newAnnouncementEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Announcement created and stored", () => {
    assert.entityCount("Announcement", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Announcement",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "leafIndex",
      "234"
    )
    assert.fieldEquals(
      "Announcement",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "commitment",
      "234"
    )
    assert.fieldEquals(
      "Announcement",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "outMemo",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
