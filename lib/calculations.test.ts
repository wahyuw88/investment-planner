import { describe, expect, it } from "vitest";
import { calculateInvestment, requiredContribution } from "./calculations";

describe("calculateInvestment", () => {
  it("calculates contributions correctly when return is zero", () => {
    const result = calculateInvestment({
      contribution: 20_000,
      frequency: "daily",
      annualRate: 0,
      years: 1,
      initialInvestment: 0,
      contributionTiming: "end"
    });
    expect(result.totalContributions).toBe(7_300_000);
    expect(result.endingValue).toBe(7_300_000);
    expect(result.totalGain).toBe(0);
  });

  it("produces a value greater than contributions for a positive return", () => {
    const result = calculateInvestment({
      contribution: 20_000,
      frequency: "daily",
      annualRate: 7,
      years: 10,
      initialInvestment: 0,
      contributionTiming: "end"
    });
    expect(result.totalContributions).toBe(73_000_000);
    expect(result.endingValue).toBeGreaterThan(result.totalContributions);
    expect(result.schedule).toHaveLength(10);
  });

  it("calculates a contribution that reaches the target", () => {
    const contribution = requiredContribution({
      target: 100_000_000,
      frequency: "monthly",
      annualRate: 7,
      years: 10
    });
    const result = calculateInvestment({
      contribution,
      frequency: "monthly",
      annualRate: 7,
      years: 10,
      initialInvestment: 0,
      contributionTiming: "end"
    });
    expect(result.endingValue).toBeCloseTo(100_000_000, 3);
  });
});
