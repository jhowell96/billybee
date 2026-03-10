import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("renders the primary hero message", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /taking the sting out of getting paid\./i
      })
    ).toBeInTheDocument();
  });
});
