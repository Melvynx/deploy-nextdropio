import { cleanup } from "@testing-library/react";
import { beforeAll, beforeEach, vi } from "vitest";

beforeAll(() => {
  vi.mock("next/navigation", () => ({
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      refresh: vi.fn(),
    })),
  }));
});

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});
