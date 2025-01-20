// src/setupTests.ts

import "@testing-library/jest-dom";
import { TextDecoder as NodeTextDecoder, TextEncoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = NodeTextDecoder as typeof TextDecoder;
}
