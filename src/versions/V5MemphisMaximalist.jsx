import { useState, useMemo } from "react";
import { CITIES } from "../lib/data.js";
import { formatINR } from "../lib/formatters.js";
import { calculate } from "../lib/calculate.js";
import VersionNav from "../components/VersionNav.jsx";

const CITY_KEYS = Object.keys(CITIES).filter(k => k !== "custom");

const PALETTE = {
  yellow: "#FFEB3B",
  pink: "#FF6B9D",
  blue: "#4FC3F7",
  mint: "#A5D6A7",
  navy: "#1A237E",
  coral: "#FF8A65",
  lavender: "#CE93D8",
};

const CARD_COLORS = [PALETTE.yellow, PALETTE.pink, PALETTE.blue, PALETTE.mint, PALETTE.coral, PALETTE.lavender];

export default function V5MemphisMaximalist() {
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
      background: PALETTE.yellow,
      backgroundImage: `radial-gradient(circle, ${PALETTE.navy} 1px, transparent 1px)`,
      backgroundSize: "20px 20px",
      fontFamily: "'Space Grotesk', sans-serif",
      color: PALETTE.navy,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes bounceIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }

        .card-odd {
          transform: rotate(-1.5deg);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card-even {
          transform: rotate(1.5deg);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card-odd:hover, .card-even:hover {
          transform: rotate(0deg) translate(-4px, -4px) !important;
          box-shadow: 10px 10px 0 ${PALETTE.navy} !important;
        }

        .mem-btn {
          background: ${PALETTE.yellow};
          border: 4px solid ${PALETTE.navy};
          box-shadow: 5px 5px 0 ${PALETTE.navy};
          color: ${PALETTE.navy};
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 14px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: transform 0.1s, box-shadow 0.1s;
        }

        .mem-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0 ${PALETTE.navy};
        }

        .mem-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 1px 1px 0 ${PALETTE.navy};
        }

        .mem-btn.active {
          background: ${PALETTE.navy};
          color: ${PALETTE.yellow};
        }

        .mem-input-wrap {
          background: transparent;
          border: 3px solid ${PALETTE.navy};
          border-radius: 0;
          padding: 10px 12px;
        }

        input[type=range].mem-range {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 0;
          background: ${PALETTE.navy};
          outline: none;
          border: 2px solid ${PALETTE.navy};
        }

        input[type=range].mem-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: ${PALETTE.yellow};
          border: 3px solid ${PALETTE.navy};
          cursor: pointer;
          border-radius: 0;
        }

        .verdict-bounce {
          animation: bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        .nav-strip {
          background: ${PALETTE.navy};
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-strip a {
          color: ${PALETTE.yellow};
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 4px 10px;
          border: 2px solid transparent;
        }

        .nav-strip a:hover {
          border-color: ${PALETTE.yellow};
        }

        .year-row:nth-child(odd) td { background: rgba(255,235,59,0.1); }
      `}</style>

      {/* Nav */}
      <div className="nav-strip">
        <span style={{ color: PALETTE.yellow, fontWeight: 800, fontSize: 16, textTransform: "uppercase", letterSpacing: 2 }}>
          HOMEWISE!
        </span>
        <VersionNav />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Hero */}
        <div style={{
          background: PALETTE.pink,
          border: `4px solid ${PALETTE.navy}`,
          boxShadow: `8px 8px 0 ${PALETTE.navy}`,
          padding: "32px 40px",
          marginBottom: 48,
          transform: "rotate(-0.5deg)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 4, marginBottom: 8 }}>
            VERSION 05 · MEMPHIS MAXIMALIST
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, textTransform: "uppercase", lineHeight: 0.9, letterSpacing: -2 }}>
            BUY OR RENT?<br />
            <span style={{ fontSize: 24, letterSpacing: 0, fontWeight: 400 }}>FIND OUT NOW!</span>
          </h1>
        </div>

        {/* City selector */}
        <div style={{
          background: PALETTE.blue,
          border: `4px solid ${PALETTE.navy}`,
          boxShadow: `6px 6px 0 ${PALETTE.navy}`,
          padding: 24,
          marginBottom: 32,
          transform: "rotate(0.8deg)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>
            PICK YOUR CITY
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CITY_KEYS.map(key => (
              <button
                key={key}
                className={`mem-btn ${city === key ? "active" : ""}`}
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
        </div>

        {/* Input cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
          {[
            { label: "Property Price", value: propertyPrice, set: setPropertyPrice, min: 1000000, max: 50000000, step: 500000, fmt: formatINR },
            { label: "Monthly Rent", value: monthlyRent, set: setMonthlyRent, min: 5000, max: 100000, step: 1000, fmt: v => formatINR(v) + "/mo" },
            { label: "Down Payment", value: downPaymentPct, set: setDownPaymentPct, min: 10, max: 80, step: 1, fmt: v => v + "%" },
            { label: "Loan Rate", value: loanRate, set: setLoanRate, min: 6, max: 14, step: 0.1, fmt: v => v + "%" },
            { label: "Time Horizon", value: horizon, set: setHorizon, min: 1, max: 30, step: 1, fmt: v => v + " yrs" },
            { label: "Investment Return", value: investReturn, set: setInvestReturn, min: 4, max: 20, step: 0.5, fmt: v => v + "%" },
          ].map(({ label, value, set, min, max, step, fmt }, i) => (
            <div
              key={label}
              className={i % 2 === 0 ? "card-odd" : "card-even"}
              style={{
                background: CARD_COLORS[i % CARD_COLORS.length],
                border: `4px solid ${PALETTE.navy}`,
                boxShadow: `6px 6px 0 ${PALETTE.navy}`,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, opacity: 0.7 }}>
                {label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
                {fmt(value)}
              </div>
              <input
                type="range"
                className="mem-range"
                min={min} max={max} step={step}
                value={value}
                onChange={e => set(+e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div
          key={R.winner}
          className="verdict-bounce"
          style={{
            background: isBuy ? PALETTE.mint : PALETTE.coral,
            border: `4px solid ${PALETTE.navy}`,
            boxShadow: `8px 8px 0 ${PALETTE.navy}`,
            padding: "40px 48px",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 4, marginBottom: 8 }}>
              THE VERDICT IS:
            </div>
            <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 0.85, textTransform: "uppercase" }}>
              {isBuy ? "BUY!" : "RENT!"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, opacity: 0.7 }}>
              ADVANTAGE OVER {horizon} YRS
            </div>
            <div style={{ fontSize: 48, fontWeight: 800 }}>{formatINR(R.diff)}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>
              {R.breakevenYear ? `Breakeven: Year ${R.breakevenYear}` : "No breakeven in horizon"}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 40 }}>
          {[
            { label: "Monthly EMI", val: formatINR(R.emi) + "/mo", bg: PALETTE.yellow },
            { label: "Down Payment Required", val: formatINR(R.downPayment), bg: PALETTE.lavender },
            { label: `Buyer Wealth @ ${horizon}yr`, val: formatINR(R.buyNetWealth), bg: PALETTE.mint },
            { label: `Renter Wealth @ ${horizon}yr`, val: formatINR(R.rentNetWealth), bg: PALETTE.blue },
          ].map(({ label, val, bg }, i) => (
            <div
              key={label}
              className={i % 2 === 0 ? "card-odd" : "card-even"}
              style={{
                background: bg,
                border: `4px solid ${PALETTE.navy}`,
                boxShadow: `6px 6px 0 ${PALETTE.navy}`,
                padding: "20px 24px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, opacity: 0.7 }}>
                {label}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Year table */}
        <div style={{
          background: "#fff",
          border: `4px solid ${PALETTE.navy}`,
          boxShadow: `6px 6px 0 ${PALETTE.navy}`,
          overflow: "hidden",
        }}>
          <div style={{ background: PALETTE.navy, color: PALETTE.yellow, padding: "14px 20px", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2 }}>
            YEAR-BY-YEAR WEALTH BREAKDOWN
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: PALETTE.yellow }}>
                {["Yr", "Buyer Wealth", "Renter Wealth", "Winner"].map(h => (
                  <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 11, letterSpacing: 1, borderBottom: `3px solid ${PALETTE.navy}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {R.buyWealthArr.map((bw, i) => {
                const rw = R.rentWealthArr[i];
                const buyWins = bw >= rw;
                return (
                  <tr key={i} className="year-row">
                    <td style={{ padding: "6px 16px", borderBottom: `1px solid ${PALETTE.navy}22`, fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ padding: "6px 16px", borderBottom: `1px solid ${PALETTE.navy}22`, color: PALETTE.navy }}>{formatINR(bw)}</td>
                    <td style={{ padding: "6px 16px", borderBottom: `1px solid ${PALETTE.navy}22` }}>{formatINR(rw)}</td>
                    <td style={{ padding: "6px 16px", borderBottom: `1px solid ${PALETTE.navy}22` }}>
                      <span style={{
                        background: buyWins ? PALETTE.mint : PALETTE.coral,
                        border: `2px solid ${PALETTE.navy}`,
                        padding: "2px 8px",
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}>
                        {buyWins ? "BUY" : "RENT"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 40, textAlign: "center", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, opacity: 0.5 }}>
          NOT FINANCIAL ADVICE · ILLUSTRATIVE ONLY · HOMEWISE 2024
        </div>
      </div>
    </div>
  );
}
