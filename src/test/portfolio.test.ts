import { describe, expect, it } from "vitest";
import { cleanTitle } from "@/components/site/Portfolio";
describe("cleanTitle", () => {
  it("removes trailer wording", () => expect(cleanTitle("A Book Trailer For The Wife Before")).toBe("The Wife Before"));
  it("removes channel extras", () => expect(cleanTitle("DRAGON CURSED by Elise Kova | Official Book Trailer")).toBe("Dragon Cursed"));
  it("keeps plain names", () => expect(cleanTitle("Blood Root")).toBe("Blood Root"));
  it("returns empty for generic", () => expect(cleanTitle("Book Trailer Video")).toBe(""));
});
import { recommendTier } from "@/components/site/Quiz";
describe("recommendTier", () => {
  it("low answers → Debut", () => expect(recommendTier([0, 0, 1])).toBe(0));
  it("middle → Bestseller", () => expect(recommendTier([1, 1, 1])).toBe(1));
  it("high → Empire", () => expect(recommendTier([2, 2, 1])).toBe(2));
});
