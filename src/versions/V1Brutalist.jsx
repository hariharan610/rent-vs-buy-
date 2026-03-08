import { useState, useMemo } from "react";
import { CITIES } from "../lib/data.js";
import { formatINR } from "../lib/formatters.js";
import { calculate } from "../lib/calculate.js";
import VersionNav from "../components/VersionNav.jsx";

const CITY_KEYS = Object.keys(CITIES).filter(k => k !== "custom");

export default function V1Brutalist() {
  const [city, setCity] = useState("bangalore");
  const [propertyPrice, setPropertyPrice] = useState(CITIES.bangalore.avgPrice);
  const [monthlyRent, setMonthlyRent] = useState(CITIES.bangalore.avgRent);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [horizon, setHorizon] = useState(10);
  const [investReturn, setInvestReturn] = useState(12);

  const R = useMemo(() => calculate({
    propertyPrice, monthlyRent, downPaymentPct, loanRate,
    loanTenure: 20, appreciation: CITIES[city].appreciation,
    rentIncrease: CITIES[city].rentIncrease, maintenance: 5000,
    investReturn, horizon, taxBracket: 30,
    stampDutyPct: CITIES[city].stampDuty,
    forcedSavingsPct: 100, hraExemptionAnnual: 0,
  }), [city, propertyPrice, monthlyRent, downPaymentPct, loanRate, horizon, investReturn]);

  const isBuy = R.winner === "buy";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      fontFamily: "'Space Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .verdict-blink {
          animation: blink 1s step-end infinite;
        }

        .brut-input {
          background: #000;
          border: 3px solid #fff;
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 16px;
          padding: 8px 12px;
          width: 100%;
          outline: none;
        }

        .brut-input:focus {
          border-color: #FFEE00;
          color: #FFEE00;
        }

        .city-btn {
          background: #000;
          border: 3px solid #333;
          color: #666;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          padding: 6px 10px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: none;
        }

        .city-btn:hover {
          border-color: #fff;
          color: #fff;
        }

        .city-btn.active {
          border-color: #FFEE00;
          color: #FFEE00;
          background: #111;
        }

        .nav-link {
          color: #fff;
          text-decoration: none;
          font-size: 11px;
          font-family: 'Space Mono', monospace;
          padding: 4px 10px;
          border: 3px solid transparent;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .nav-link:hover {
          border-color: #fff;
        }

        .nav-link.active {
          border-color: #FFEE00;
          color: #FFEE00;
        }

        .year-row:nth-child(odd) {
          background: #0a0a0a;
        }
        .year-row:hover {
          background: #111;
        }
      `}</style>

      {/* Nav */}
      <div style={{
        background: "#000",
        borderBottom: "3px solid #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 48,
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>
          // VERSION 01 — BRUTALIST
        </span>
        <VersionNav />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ borderBottom: "3px solid #fff", paddingBottom: 24, marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", textTransform: "uppercase", marginBottom: 8 }}>
            HOMEWISE / RENT VS BUY CALCULATOR
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, textTransform: "uppercase", letterSpacing: -1 }}>
            SHOULD YOU<br />BUY OR RENT?
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {/* LEFT: Inputs */}
          <div style={{ borderRight: "3px solid #fff", paddingRight: 32 }}>

            {/* City */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", textTransform: "uppercase", marginBottom: 12 }}>
                CITY
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
                {CITY_KEYS.map(key => (
                  <button
                    key={key}
                    className={`city-btn ${city === key ? "active" : ""}`}
                    style={{ borderRight: "none", borderBottom: "none" }}
                    onClick={() => {
                      setCity(key);
                      setPropertyPrice(CITIES[key].avgPrice);
                      setMonthlyRent(CITIES[key].avgRent);
                    }}
                  >
                    {CITIES[key].name}
                  </button>
                ))}
              </div>
              <div style={{ border: "3px solid #333", borderTop: "none", height: 0 }} />
            </div>

            {/* Inputs */}
            {[
              { label: "PROPERTY PRICE", value: propertyPrice, set: setPropertyPrice, min: 1000000, max: 50000000, step: 500000, fmt: v => formatINR(v) },
              { label: "MONTHLY RENT", value: monthlyRent, set: setMonthlyRent, min: 5000, max: 100000, step: 1000, fmt: v => formatINR(v) + "/mo" },
              { label: "DOWN PAYMENT %", value: downPaymentPct, set: setDownPaymentPct, min: 10, max: 80, step: 1, fmt: v => v + "%" },
              { label: "LOAN RATE % p.a.", value: loanRate, set: setLoanRate, min: 6, max: 14, step: 0.1, fmt: v => v + "%" },
              { label: "TIME HORIZON (YRS)", value: horizon, set: setHorizon, min: 1, max: 30, step: 1, fmt: v => v + " YRS" },
              { label: "INVEST RETURN % p.a.", value: investReturn, set: setInvestReturn, min: 4, max: 20, step: 0.5, fmt: v => v + "%" },
            ].map(({ label, value, set, min, max, step, fmt }) => (
              <div key={label} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, letterSpacing: 2, color: "#666", textTransform: "uppercase" }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{fmt(value)}</span>
                </div>
                <input
                  type="number"
                  className="brut-input"
                  value={value}
                  min={min} max={max} step={step}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) set(Math.max(min, Math.min(max, v)));
                  }}
                />
              </div>
            ))}
          </div>

          {/* RIGHT: Results */}
          <div style={{ paddingLeft: 32 }}>

            {/* Verdict */}
            <div style={{
              background: isBuy ? "#FFEE00" : "#FF0000",
              border: `3px solid ${isBuy ? "#FFEE00" : "#FF0000"}`,
              padding: "32px 24px",
              marginBottom: 32,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 12, letterSpacing: 3, color: "#000", textTransform: "uppercase", marginBottom: 8 }}>
                VERDICT
              </div>
              <div className="verdict-blink" style={{
                fontSize: 96,
                fontWeight: 700,
                color: "#000",
                lineHeight: 0.9,
                textTransform: "uppercase",
              }}>
                {isBuy ? "BUY" : "RENT"}
              </div>
              <div style={{ fontSize: 14, color: "#000", marginTop: 12, fontWeight: 700 }}>
                {formatINR(R.diff)} ADVANTAGE OVER {horizon} YRS
              </div>
            </div>

            {/* Key numbers */}
            {[
              { label: "MONTHLY EMI", val: formatINR(R.emi) + "/mo" },
              { label: "DOWN PAYMENT", val: formatINR(R.downPayment) },
              { label: "TOTAL UPFRONT COSTS", val: formatINR(R.buyingCosts) },
              { label: `BUYER WEALTH @ ${horizon}YR`, val: formatINR(R.buyNetWealth), accent: "#FFEE00" },
              { label: `RENTER WEALTH @ ${horizon}YR`, val: formatINR(R.rentNetWealth) },
              { label: "BREAKEVEN YEAR", val: R.breakevenYear ? `YEAR ${R.breakevenYear}` : "BEYOND HORIZON", accent: R.breakevenYear ? "#FFEE00" : "#FF0000" },
            ].map(({ label, val, accent }) => (
              <div key={label} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "3px solid #111",
              }}>
                <span style={{ fontSize: 11, letterSpacing: 2, color: "#666", textTransform: "uppercase" }}>{label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: accent || "#fff" }}>{val}</span>
              </div>
            ))}

            {/* Year-by-year table */}
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", textTransform: "uppercase", marginBottom: 12 }}>
                YEAR-BY-YEAR WEALTH
              </div>
              <div style={{ border: "3px solid #333", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 80px", gap: 0, background: "#111", padding: "8px 12px", fontSize: 10, letterSpacing: 1, color: "#555", textTransform: "uppercase" }}>
                  <span>YR</span><span>BUYER</span><span>RENTER</span><span>WINNER</span>
                </div>
                {R.buyWealthArr.slice(0, Math.min(horizon, 20)).map((bw, i) => {
                  const rw = R.rentWealthArr[i];
                  const buyWins = bw >= rw;
                  return (
                    <div key={i} className="year-row" style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 80px", gap: 0, padding: "6px 12px", fontSize: 12, borderTop: "1px solid #111" }}>
                      <span style={{ color: "#555" }}>{i + 1}</span>
                      <span style={{ color: "#FFEE00" }}>{formatINR(bw)}</span>
                      <span style={{ color: "#fff" }}>{formatINR(rw)}</span>
                      <span style={{ color: buyWins ? "#FFEE00" : "#FF0000", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>{buyWins ? "BUY" : "RENT"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, borderTop: "3px solid #222", paddingTop: 16, fontSize: 11, color: "#333", letterSpacing: 2, textTransform: "uppercase" }}>
          HOMEWISE — NOT FINANCIAL ADVICE — ILLUSTRATIVE ONLY
        </div>
      </div>
    </div>
  );
}
