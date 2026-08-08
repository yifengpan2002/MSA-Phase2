import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ColorModeProvider } from "../src/components/ColorModeProvider";
import { useColorMode } from "../src/components/colorMode";

function ThemeProbe() {
  const { mode, toggleMode } = useColorMode();

  return (
    <button type="button" onClick={toggleMode}>
      {mode}
    </button>
  );
}

describe("ColorModeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts in dark mode by default", () => {
    render(
      <ColorModeProvider>
        <ThemeProbe />
      </ColorModeProvider>,
    );

    expect(screen.getByRole("button", { name: "dark" })).toBeInTheDocument();
  });

  it("respects a saved light-mode preference", () => {
    localStorage.setItem("orbit.themeMode", "light");

    render(
      <ColorModeProvider>
        <ThemeProbe />
      </ColorModeProvider>,
    );

    expect(screen.getByRole("button", { name: "light" })).toBeInTheDocument();
  });

  it("toggles and saves the selected mode", async () => {
    const user = userEvent.setup();

    render(
      <ColorModeProvider>
        <ThemeProbe />
      </ColorModeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "dark" }));

    expect(screen.getByRole("button", { name: "light" })).toBeInTheDocument();
    expect(localStorage.getItem("orbit.themeMode")).toBe("light");
  });
});
