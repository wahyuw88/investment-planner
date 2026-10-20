"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Coins,
  Download,
  Info,
  Layers3,
  ShieldCheck,
  Target,
  TrendingUp,
  Wallet
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  calculateInvestment,
  requiredContribution,
  type Frequency,
  type InvestmentInputs
} from "@/lib/calculations";

const currency = (value: number, compact = false) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
    compactDisplay: "short"
  }).format(Math.round(value));

const number = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(value);

const defaultInputs: InvestmentInputs = {
  contribution: 20_000,
  frequency: "daily",
  annualRate: 7,
  years: 10,
  initialInvestment: 0,
  contributionTiming: "end"
};

export default function Home() {
  const [inputs, setInputs] = useState<InvestmentInputs>(defaultInputs);
  const [activeTab, setActiveTab] = useState<"projection" | "target" | "scenarios">("projection");
  const [target, setTarget] = useState(1_000_000_000);
  const [targetRate, setTargetRate] = useState(7);
  const [targetYears, setTargetYears] = useState(15);
  const [scenarioRates, setScenarioRates] = useState([4, 7, 10]);
  const [showAssumptions, setShowAssumptions] = useState(false);

  const result = useMemo(() => calculateInvestment(inputs), [inputs]);
  const neededContribution = useMemo(
    () =>
      requiredContribution({
        target,
        frequency: inputs.frequency,
        annualRate: targetRate,
        years: targetYears,
        initialInvestment: inputs.initialInvestment,
        contributionTiming: inputs.contributionTiming
      }),
    [target, targetRate, targetYears, inputs.frequency, inputs.initialInvestment, inputs.contributionTiming]
  );

  const scenarioData = useMemo(
    () =>
      scenarioRates.map((rate) => ({
        rate,
        value: calculateInvestment({ ...inputs, annualRate: rate }).endingValue
      })),
    [inputs, scenarioRates]
  );

  const update = <K extends keyof InvestmentInputs>(key: K, value: InvestmentInputs[K]) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const downloadCsv = () => {
    const rows = [
      ["Tahun", "Total setoran (IDR)", "Nilai investasi (IDR)", "Keuntungan (IDR)"],
      ...result.schedule.map((point) => [
        point.year,
        Math.round(point.contributions),
        Math.round(point.portfolioValue),
        Math.round(point.gain)
      ])
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "proyeksi-investasi.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const chartData = result.schedule.map((point) => ({
    year: `Tahun ${point.year}`,
    "Total setoran": Math.round(point.contributions),
    "Nilai investasi": Math.round(point.portfolioValue)
  }));

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Rencana beranda">
          <span className="brand-mark"><TrendingUp size={21} strokeWidth={2.5} /></span>
          <span>rencana<span className="brand-dot">.</span></span>
        </a>
        <nav className="top-nav" aria-label="Navigasi utama">
          <a className="nav-active" href="#planner">Planner</a>
          <a href="#insight">Insight</a>
          <a href="#about">Tentang</a>
        </nav>
        <div className="topbar-right"><span className="privacy-pill"><ShieldCheck size={14} /> Simulasi privat</span></div>
      </header>

      <section className="hero" id="planner">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> INVESTMENT PLANNER</div>
          <h1>Rencanakan hari ini.<br /><span>Petik hasilnya nanti.</span></h1>
          <p>Bangun gambaran masa depan finansial Anda dengan simulasi investasi yang sederhana, transparan, dan fleksibel.</p>
        </div>
        <div className="hero-note">
          <div className="hero-note-icon"><Target size={20} /></div>
          <div><strong>Tujuan yang jelas, langkah yang terukur.</strong><span>Mulai dari nominal kecil, pahami potensi pertumbuhannya.</span></div>
        </div>
      </section>

      <section className="workspace">
        <aside className="input-panel panel">
          <div className="panel-heading">
            <div><span className="section-kicker">LANGKAH 01</span><h2>Atur rencana Anda</h2></div>
            <span className="heading-icon"><SlidersIcon /></span>
          </div>

          <div className="field-block">
            <label htmlFor="contribution">Nominal investasi</label>
            <div className="money-input"><span>Rp</span><input id="contribution" type="number" min="0" step="1000" value={inputs.contribution} onChange={(e) => update("contribution", Math.max(0, Number(e.target.value)))} /></div>
            <div className="segmented frequency-control" aria-label="Frekuensi investasi">
              {(["daily", "weekly", "monthly"] as Frequency[]).map((freq) => (
                <button key={freq} className={inputs.frequency === freq ? "selected" : ""} onClick={() => update("frequency", freq)} type="button">
                  {freq === "daily" ? "Harian" : freq === "weekly" ? "Mingguan" : "Bulanan"}
                </button>
              ))}
            </div>
          </div>

          <div className="field-block">
            <div className="label-row"><label htmlFor="rate">Estimasi imbal hasil</label><strong>{number(inputs.annualRate)}% <small>/ tahun</small></strong></div>
            <div className="money-input"><span>%</span><input id="rate" type="number" min="-99.9" max="100" step="0.1" value={inputs.annualRate} onChange={(e) => update("annualRate", Math.max(-99.9, Math.min(100, Number(e.target.value))))} /></div>
            <p className="field-help">Masukkan asumsi imbal hasil rata-rata per tahun.</p>
          </div>

          <div className="field-block">
            <div className="label-row"><label htmlFor="years">Durasi investasi</label><strong>{inputs.years} tahun</strong></div>
            <div className="money-input"><input id="years" type="number" min="1" max="100" step="1" value={inputs.years} onChange={(e) => update("years", Math.max(1, Math.min(100, Number(e.target.value))))} /><span>tahun</span></div>
            <p className="field-help">Berapa lama Anda akan berinvestasi?</p>
          </div>

          <div className="field-block">
            <label htmlFor="initial">Modal awal <span className="optional">opsional</span></label>
            <div className="money-input"><span>Rp</span><input id="initial" type="number" min="0" step="100000" value={inputs.initialInvestment} onChange={(e) => update("initialInvestment", Math.max(0, Number(e.target.value)))} /></div>
          </div>

          <div className="field-block">
            <label>Waktu setoran</label>
            <div className="timing-options">
              <button type="button" className={inputs.contributionTiming === "beginning" ? "timing-option active" : "timing-option"} onClick={() => update("contributionTiming", "beginning")}><span className="radio-dot" />Awal periode</button>
              <button type="button" className={inputs.contributionTiming === "end" ? "timing-option active" : "timing-option"} onClick={() => update("contributionTiming", "end")}><span className="radio-dot" />Akhir periode</button>
            </div>
          </div>

          <button type="button" className="reset-button" onClick={() => setInputs(defaultInputs)}>Kembalikan ke contoh awal</button>
          <p className="panel-footnote"><Info size={14} /> Semua angka adalah asumsi simulasi, bukan janji hasil investasi.</p>
        </aside>

        <div className="results-column">
          <section className="result-hero panel">
            <div className="result-topline"><span className="section-kicker">LANGKAH 02 · HASIL SIMULASI</span><span className="live-pill"><span /> LIVE CALCULATION</span></div>
            <p className="result-label">Estimasi nilai investasi Anda</p>
            <div className="total-value">{currency(result.endingValue)}</div>
            <div className="growth-caption"><span className="growth-icon"><ArrowUpRight size={16} /></span><strong>{currency(result.totalGain)}</strong><span>potensi keuntungan</span></div>
            <div className="result-divider" />
            <div className="metrics-grid">
              <div className="metric"><span className="metric-icon purple"><Wallet size={17} /></span><span className="metric-label">Total modal disetor</span><strong>{currency(result.totalContributions)}</strong><small>Termasuk modal awal</small></div>
              <div className="metric"><span className="metric-icon green"><TrendingUp size={17} /></span><span className="metric-label">Pertumbuhan nilai</span><strong>{result.totalContributions > 0 ? number((result.totalGain / result.totalContributions) * 100) : "0"}%</strong><small>Dibandingkan total setoran</small></div>
              <div className="metric"><span className="metric-icon orange"><CalendarDays size={17} /></span><span className="metric-label">Total periode setoran</span><strong>{number(result.contributionCount)} kali</strong><small>Selama {inputs.years} tahun</small></div>
            </div>
          </section>

          <section className="chart-panel panel" id="insight">
            <div className="chart-header">
              <div><span className="section-kicker">VISUALISASI PERTUMBUHAN</span><h2>Perjalanan aset Anda</h2><p>Perbandingan modal yang disetor dengan nilai investasi.</p></div>
              <button type="button" className="export-button" onClick={downloadCsv}><Download size={15} /> <span>Ekspor CSV</span></button>
            </div>
            <div className="chart-legend"><span><i className="legend-investment" /> Nilai investasi</span><span><i className="legend-contribution" /> Total setoran</span></div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6258e8" stopOpacity={0.23} /><stop offset="95%" stopColor="#6258e8" stopOpacity={0.01} /></linearGradient>
                    <linearGradient id="depositFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9ba4b5" stopOpacity={0.14} /><stop offset="95%" stopColor="#9ba4b5" stopOpacity={0.01} /></linearGradient>
                  </defs>
                  <CartesianGrid stroke="#edf0f5" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#8b93a5" }} axisLine={false} tickLine={false} minTickGap={20} />
                  <YAxis tickFormatter={(v) => currency(v, true)} tick={{ fontSize: 11, fill: "#8b93a5" }} axisLine={false} tickLine={false} width={62} />
                  <Tooltip formatter={(value) => currency(Number(value))} contentStyle={{ border: "1px solid #e9ebf3", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="Total setoran" stroke="#9ba4b5" strokeWidth={2} fill="url(#depositFill)" />
                  <Area type="monotone" dataKey="Nilai investasi" stroke="#6258e8" strokeWidth={2.5} fill="url(#valueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-insight"><span className="insight-icon"><Coins size={17} /></span><p>Dengan asumsi imbal hasil <strong>{number(inputs.annualRate)}% per tahun</strong>, nilai investasi diproyeksikan menjadi <strong>{currency(result.endingValue)}</strong> dalam {inputs.years} tahun.</p></div>
          </section>

          <section className="planner-panel panel">
            <div className="tabs" role="tablist" aria-label="Fitur perencanaan">
              <button role="tab" aria-selected={activeTab === "projection"} className={activeTab === "projection" ? "tab active" : "tab"} onClick={() => setActiveTab("projection")}>Proyeksi tahunan</button>
              <button role="tab" aria-selected={activeTab === "target"} className={activeTab === "target" ? "tab active" : "tab"} onClick={() => setActiveTab("target")}>Target dana</button>
              <button role="tab" aria-selected={activeTab === "scenarios"} className={activeTab === "scenarios" ? "tab active" : "tab"} onClick={() => setActiveTab("scenarios")}>Skenario</button>
            </div>

            {activeTab === "projection" && (
              <div className="tab-content">
                <div className="table-heading"><div><h3>Rincian per tahun</h3><p>Lihat bagaimana nilai aset berkembang dari waktu ke waktu.</p></div><span className="table-unit">IDR · estimasi</span></div>
                <div className="table-scroll"><table><thead><tr><th>Tahun</th><th>Total setoran</th><th>Nilai investasi</th><th>Keuntungan</th></tr></thead><tbody>
                  {result.schedule.map((point) => <tr key={point.year}><td>Tahun {point.year}</td><td>{currency(point.contributions)}</td><td className="value-cell">{currency(point.portfolioValue)}</td><td className={point.gain >= 0 ? "gain-cell" : "loss-cell"}>{point.gain >= 0 ? "+" : ""}{currency(point.gain)}</td></tr>)}
                </tbody></table></div>
              </div>
            )}

            {activeTab === "target" && (
              <div className="tab-content target-content">
                <div className="table-heading"><div><h3>Berapa setoran yang dibutuhkan?</h3><p>Hitung estimasi kontribusi rutin untuk mengejar target nilai akhir.</p></div><span className="target-icon"><Target size={20} /></span></div>
                <div className="target-fields">
                  <div className="field-block"><label htmlFor="target">Target dana (Rp)</label><input className="plain-input" id="target" type="number" min="1" value={target} onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))} /></div>
                  <div className="field-block"><label htmlFor="target-years">Durasi (tahun)</label><input className="plain-input" id="target-years" type="number" min="1" max="60" value={targetYears} onChange={(e) => setTargetYears(Math.max(1, Math.min(60, Number(e.target.value))))} /></div>
                  <div className="field-block"><label htmlFor="target-rate">Imbal hasil (%/tahun)</label><input className="plain-input" id="target-rate" type="number" min="-10" max="30" step="0.5" value={targetRate} onChange={(e) => setTargetRate(Math.max(-10, Math.min(30, Number(e.target.value))))} /></div>
                </div>
                <div className="target-answer"><span>Estimasi setoran {inputs.frequency === "daily" ? "harian" : inputs.frequency === "weekly" ? "mingguan" : "bulanan"} yang dibutuhkan</span><strong>{currency(neededContribution)}</strong><small>Dengan modal awal {currency(inputs.initialInvestment)} dan asumsi imbal hasil konstan.</small></div>
              </div>
            )}

            {activeTab === "scenarios" && (
              <div className="tab-content">
                <div className="table-heading"><div><h3>Bandingkan imbal hasil</h3><p>Nominal setoran dan durasi tetap; hanya tingkat imbal hasil yang berubah.</p></div></div>
                <div className="scenario-controls">{scenarioRates.map((rate, index) => <label key={index}>Skenario {index + 1}<div className="scenario-input-wrap"><input aria-label={`Imbal hasil skenario ${index + 1}`} type="number" min="-10" max="30" step="0.5" value={rate} onChange={(e) => setScenarioRates((current) => current.map((v, i) => i === index ? Math.max(-10, Math.min(30, Number(e.target.value))) : v))} /><span>%</span></div></label>)}</div>
                <div className="scenario-list">{scenarioData.map((scenario, index) => <div className="scenario-row" key={index}><span className={`scenario-dot dot-${index}`} /><div className="scenario-detail"><strong>{number(scenario.rate)}% per tahun</strong><small>Keuntungan {currency(scenario.value - result.totalContributions)}</small></div><strong className="scenario-value">{currency(scenario.value)}</strong></div>)}</div>
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="assumptions-panel panel">
        <button type="button" className="assumptions-toggle" onClick={() => setShowAssumptions((value) => !value)} aria-expanded={showAssumptions}><span className="assumptions-icon"><CircleHelp size={18} /></span><span><strong>Metodologi & asumsi kalkulasi</strong><small>Pahami cara angka proyeksi ini dihitung.</small></span><ChevronDown className={showAssumptions ? "chevron rotate" : "chevron"} size={18} /></button>
        {showAssumptions && <div className="assumptions-body"><p><strong>Konversi imbal hasil:</strong> imbal hasil tahunan efektif dikonversi menjadi tingkat per periode menggunakan (1 + r)^(1/m) − 1, dengan m = 365, 52, atau 12 sesuai frekuensi.</p><p><strong>Setoran rutin:</strong> diasumsikan terjadi secara teratur pada awal atau akhir setiap periode sesuai pilihan. Modal awal tumbuh selama seluruh durasi.</p><p><strong>Batasan:</strong> hasil mengasumsikan tingkat imbal hasil konstan. Volatilitas pasar, inflasi, biaya transaksi, pajak, gagal setor, serta kalender hari bursa belum diperhitungkan.</p></div>}
      </section>

      <footer className="footer" id="about"><a className="brand footer-brand" href="#"><span className="brand-mark"><TrendingUp size={17} /></span><span>rencana<span className="brand-dot">.</span></span></a><span>Alat bantu perencanaan finansial, bukan rekomendasi investasi.</span><a href="#planner">Kembali ke atas ↑</a></footer>
    </main>
  );
}

function SlidersIcon() {
  return <Layers3 size={19} />;
}
