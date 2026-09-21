import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "./llms";

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt();

  it("opens with the site name and a blockquote summary", () => {
    const lines = text.split("\n");
    expect(lines[0]).toBe("# Paradigm Shift Software Development");
    expect(lines[2].startsWith("> ")).toBe(true);
  });

  it("ends with exactly one trailing newline", () => {
    expect(text).toMatch(/[^\n]\n$/);
  });

  it("lists three services, nine automations, nine demos and a contact link", () => {
    // trimEnd: the file's own trailing newline is not part of the last section.
    const section = (heading: string): string[] =>
      text.trimEnd().split(`## ${heading}\n\n`)[1].split("\n\n")[0].split("\n");
    expect(section("Services")).toHaveLength(3);
    expect(section("Automations")).toHaveLength(9);
    expect(section("Interactive demos")).toHaveLength(9);
    expect(section("Contact")).toHaveLength(1);
  });

  it("uses absolute URLs in markdown links", () => {
    expect(text).toContain(
      "- [AI Integration](https://paradigmshiftdev.io/services/ai-integration): ",
    );
    expect(text).not.toMatch(/\]\(\//);
  });
});
