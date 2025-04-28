import { LogoutButton } from "@/components/logout";
import { authClient } from "@/lib/auth-client";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  vi.mock("@/lib/auth-client", () => ({
    authClient: {
      signOut: vi.fn(),
    },
  }));
});

describe("LogoutButton", () => {
  it("should renders logout button correctly", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: "Logout" })).toBeDefined();
  });

  it("should call signOut when clicked", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Logout" });
    fireEvent.click(button);

    expect(authClient.signOut).toHaveBeenCalled();
  });
});
