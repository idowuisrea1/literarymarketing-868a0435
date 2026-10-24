import { describe, expect, it } from "vitest";
import { cleanTitle } from "./Portfolio";

describe("cleanTitle", () => {
  it("removes trailer wording and trailing separators", () => {
    expect(cleanTitle("The Rose of Death — Official Book Trailer")).toBe("The Rose of Death");
  });

  it("keeps the author/title separator from adding promotional text", () => {
    expect(cleanTitle("Memoirs of a Time Traveler | Official Trailer by Literary Marketing")).toBe("Memoirs of a Time Traveler");
  });

  it("normalizes all-uppercase titles into readable title case", () => {
    expect(cleanTitle("CLOAK KING: ROYAL BLOOD")).toBe("Cloak King: Royal Blood");
  });
});
