export type Frequency = "daily" | "weekly" | "monthly";

export interface InvestmentInputs {
  contribution: number;
  frequency: Frequency;
  annualRate: number;
  years: number;
  initialInvestment: number;
  contributionTiming: "beginning" | "end";
}

export interface YearPoint {
  year: number;
  contributions: number;
  portfolioValue: number;
  gain: number;
}

export interface InvestmentResult {
  totalContributions: number;
  endingValue: number;
  totalGain: number;
  schedule: YearPoint[];
  contributionCount: number;
}

const periodsPerYear: Record<Frequency, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12
};

/**
 * Projects recurring contributions using an effective annual return.
 * The annual rate is converted to an equivalent periodic rate.
 * Returns are assumptions, not guarantees.
 */
export function calculateInvestment(input: InvestmentInputs): InvestmentResult {
  const {
    contribution,
    frequency,
    annualRate,
    years,
    initialInvestment,
    contributionTiming
  } = input;

  if (contribution < 0 || initialInvestment < 0) {
    throw new Error("Contribution and initial investment must be non-negative.");
  }
  if (annualRate <= -100) {
    throw new Error("Annual return must be greater than -100%.");
  }
  if (years < 1 || !Number.isFinite(years)) {
    throw new Error("Years must be at least 1.");
  }

  const periodsPerYearValue = periodsPerYear[frequency];
  const totalPeriods = Math.round(years * periodsPerYearValue);
  const periodicRate = Math.pow(1 + annualRate / 100, 1 / periodsPerYearValue) - 1;
  const timingFactor = contributionTiming === "beginning" ? 1 + periodicRate : 1;

  const valueAfterPeriods = (periods: number) => {
    const growth = Math.pow(1 + periodicRate, periods);
    const contributionsValue =
      periodicRate === 0
        ? contribution * periods
        : contribution * ((growth - 1) / periodicRate) * timingFactor;
    return initialInvestment * growth + contributionsValue;
  };

  const schedule: YearPoint[] = [];
  for (let year = 1; year <= years; year++) {
    const periods = Math.min(Math.round(year * periodsPerYearValue), totalPeriods);
    const contributions = initialInvestment + contribution * periods;
    const portfolioValue = valueAfterPeriods(periods);
    schedule.push({
      year,
      contributions,
      portfolioValue,
      gain: portfolioValue - contributions
    });
  }

  const totalContributions = initialInvestment + contribution * totalPeriods;
  const endingValue = valueAfterPeriods(totalPeriods);

  return {
    totalContributions,
    endingValue,
    totalGain: endingValue - totalContributions,
    schedule,
    contributionCount: totalPeriods
  };
}

/**
 * Calculates the recurring contribution needed to reach a target.
 * Uses the same periodic return convention as calculateInvestment.
 */
export function requiredContribution(input: {
  target: number;
  frequency: Frequency;
  annualRate: number;
  years: number;
  initialInvestment?: number;
  contributionTiming?: "beginning" | "end";
}): number {
  const {
    target,
    frequency,
    annualRate,
    years,
    initialInvestment = 0,
    contributionTiming = "end"
  } = input;

  if (target <= 0 || years < 1 || annualRate <= -100 || initialInvestment < 0) {
    throw new Error("Please enter a positive target, valid duration and rate.");
  }

  const periods = Math.round(years * periodsPerYear[frequency]);
  const periodicRate = Math.pow(1 + annualRate / 100, 1 / periodsPerYear[frequency]) - 1;
  const initialFutureValue = initialInvestment * Math.pow(1 + periodicRate, periods);
  const remainingTarget = target - initialFutureValue;

  if (remainingTarget <= 0) return 0;

  const annuityFactor =
    periodicRate === 0
      ? periods
      : ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate) *
        (contributionTiming === "beginning" ? 1 + periodicRate : 1);

  return remainingTarget / annuityFactor;
}
