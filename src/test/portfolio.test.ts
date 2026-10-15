import { describe, expect, it } from "vitest";
import { cleanTitle } from "@/components/site/Portfolio";
describe("cleanTitle", () => {
  it("removes trailer wording", () => expect(cleanTitle("A Book Trailer For The Wife Before")).toBe("The Wife Before"));
  it("removes channel extras", () => expect(cleanTitle("DRAGON CURSED by Elise Kova | Official Book Trailer")).toBe("Dragon Cursed"));
  it("keeps plain names", () => expect(cleanTitle("Blood Root")).toBe("Blood Root"));
  it("returns empty for generic", () => expect(cleanTitle("Book Trailer Video")).toBe(""));
});
