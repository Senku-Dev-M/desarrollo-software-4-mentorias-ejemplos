import { randomUUID } from "node:crypto";
import type { ProductPayload } from "./types";

const SAMPLE_CATALOG: readonly ProductPayload[] = [
  { name: "Mechanical Keyboard", price: 350 },
  { name: "Wireless Headset", price: 220 },
  { name: "USB-C Docking Station", price: 480 },
  { name: "Ergonomic Trackball", price: 195 },
  { name: "Monitor Stand", price: 310 }
];

let catalogCursor = 0;

export function buildUniqueProduct(
  overrides: Partial<ProductPayload> = {}
): ProductPayload {
  const sample = SAMPLE_CATALOG[catalogCursor % SAMPLE_CATALOG.length];
  catalogCursor += 1;

  const uniqueSuffix = randomUUID().slice(0, 6);
  const baseName = overrides.name ?? sample.name;

  return {
    name: `${baseName} ${uniqueSuffix}`,
    price: overrides.price ?? sample.price
  };
}
