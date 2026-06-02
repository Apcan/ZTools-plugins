import { describe, expect, it } from "vitest";
import path from "node:path";
import { buildOutputPath, normalizeExtension } from "../src/preload/paths";

describe("output path helpers", () => {
  it("normalizes jpeg extension to jpg for filenames", () => {
    expect(normalizeExtension("jpeg")).toBe("jpg");
    expect(normalizeExtension("webp")).toBe("webp");
  });

  it("builds collision-resistant output paths from naming patterns", () => {
    const output = buildOutputPath({
      inputPath: "/tmp/Product Hero.PNG",
      outputDirectory: "/tmp/out",
      targetFormat: "webp",
      namingPattern: "{name}-{index}-{width}x{height}.{ext}",
      index: 3,
      width: 1200,
      height: 800,
      existingPaths: new Set([path.join("/tmp/out", "Product Hero-3-1200x800.webp")])
    });

    expect(output).toBe(path.join("/tmp/out", "Product Hero-3-1200x800-1.webp"));
  });
});
