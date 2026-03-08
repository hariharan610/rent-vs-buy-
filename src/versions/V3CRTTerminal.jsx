import { useState, useMemo } from "react";
import { CITIES } from "../lib/data.js";
import { formatINR } from "../lib/formatters.js";
import { calculate } from "../lib/calculate.js";
import VersionNav from "../components/VersionNav.jsx";

const CITY_KEYS = Object.keys(CITIES).filter(k => k !== "custom");

export default function V3CRTTerminal() {
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

  function asciiBar(value, min, max, width = 20) {
    const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const filled = Math.round(pct * width);
    return "[" + "#".repeat(filled) + ".".repeat(width - filled) + "] " + Math.round(pct * 100) + "%";
  }

  function fmtInput(value, min, max) {
    return asciiBar(value, min, max);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#00FF41",
      fontFamily: "'Share Tech Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .crt-root {
          min-height: 100vh;
          background: #000;
          position: relative;
        }

        .crt-root::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,255,65,0.03) 2px,
            rgba(0,255,65,0.03) 4px
          );
          pointer-events: none;
          z-index: 100;
        }

        .crt-root::after {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          box-shadow: inset 0 0 120px rgba(0,0,0,0.8);
          pointer-events: none;
          z-index: 101;
        }

        .glow {
          text-shadow: 0 0 8px #00FF41, 0 0 2px #00FF41;
        }

        .glow-amber {
          text-shadow: 0 0 8px #FFB300, 0 0 2px #FFB300;
          color: #FFB300;
        }

        .dim {
          color: #006600;
        }

        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.85; }
          97% { opacity: 1; }
          98% { opacity: 0.9; }
        }

        @keyframes blink-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .cursor::after {
          content: '█';
          animation: blink-cursor 1s step-end infinite;
          margin-left: 2px;
          font-size: inherit;
        }

        .terminal-screen {
          animation: flicker 8s infinite;
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }

        .term-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #00FF41;
          color: #00FF41;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          width: 100%;
          outline: none;
          padding: 4px 0;
          text-shadow: 0 0 6px #00FF41;
        }

        .term-input:focus {
          border-bottom-color: #00FF41;
          box-shadow: 0 2px 0 #00FF41;
        }

        .nav-bar {
          background: #001100;
          border-bottom: 1px solid #003300;
          padding: 8px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-bar a {
          color: #00FF41;
          text-shadow: 0 0 6px #00FF41;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .nav-bar a.active {
          color: #FFB300;
          text-shadow: 0 0 8px #FFB300;
        }

        .city-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          margin-top: 8px;
        }

        @media (max-width: 600px) {
          .city-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .city-btn {
          background: transparent;
          border: 1px solid #003300;
          color: #006600;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          padding: 4px 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.1s;
        }

        .city-btn:hover {
          border-color: #00FF41;
          color: #00FF41;
          text-shadow: 0 0 6px #00FF41;
        }

        .city-btn.selected {
          border-color: #00FF41;
          color: #00FF41;
          background: #001a00;
          text-shadow: 0 0 6px #00FF41;
        }

        .section-header {
          font-family: 'VT323', monospace;
          font-size: 22px;
          color: #00FF41;
          text-shadow: 0 0 10px #00FF41;
          border-bottom: 1px solid #003300;
          padding-bottom: 6px;
          margin: 24px 0 12px;
          letter-spacing: 2px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 600px) {
          .input-row { grid-template-columns: 1fr; }
        }

        .input-group {
          margin-bottom: 12px;
        }

        .input-label {
          font-size: 11px;
          color: #006600;
          letter-spacing: 1px;
          margin-bottom: 4px;
          display: block;
        }

        .input-value {
          font-size: 13px;
          color: #00FF41;
          text-shadow: 0 0 6px #00FF41;
          margin-bottom: 4px;
        }

        .ascii-bar {
          font-size: 11px;
          color: #004400;
          letter-spacing: 0;
        }

        .result-panel {
          border: 1px solid #003300;
          background: #000800;
          padding: 16px;
          margin-top: 24px;
        }

        .result-line {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          border-bottom: 1px solid #001500;
          font-size: 13px;
        }

        .result-line:last-child {
          border-bottom: none;
        }

        .verdict-block {
          background: #001a00;
          border: 1px solid #00FF41;
          padding: 20px;
          margin-top: 16px;
          text-align: center;
        }

        .verdict-text {
          font-family: 'VT323', monospace;
          font-size: 64px;
          text-shadow: 0 0 20px #00FF41;
          letter-spacing: 4px;
        }

        .verdict-buy { color: #00FF41; }
        .verdict-rent { color: #FFB300; text-shadow: 0 0 20px #FFB300; }

        .wealth-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          margin-top: 12px;
        }

        .wealth-table th {
          color: #006600;
          font-size: 11px;
          text-align: left;
          padding: 4px 8px;
          border-bottom: 1px solid #003300;
          letter-spacing: 1px;
        }

        .wealth-table td {
          padding: 3px 8px;
          border-bottom: 1px solid #001500;
        }

        .wealth-table tr:hover td {
          background: #001a00;
        }
      `}</style>

      <div className="crt-root">
        {/* Nav */}
        <div className="nav-bar">
          <span className="glow" style={{ fontFamily: "'VT323', monospace", fontSize: 18, paddingLeft: 24, letterSpacing: 2 }}>
            HOMEWISE TERMINAL v3.0
          </span>
          <VersionNav style={{ paddingRight: 16 }} />
        </div>

        <div className="terminal-screen">
          {/* System header */}
          <div style={{ marginBottom: 24, fontSize: 12, color: "#006600" }}>
            <div className="dim">{`> SYSTEM INITIALIZED`}</div>
            <div className="dim">{`> RENT_VS_BUY MODULE LOADED`}</div>
            <div className="dim">{`> AWAITING INPUT...`}</div>
          </div>

          {/* City selection */}
          <div className="section-header">// SELECT_MARKET</div>
          <div style={{ fontSize: 12, color: "#006600", marginBottom: 6 }}>
            {`> USE [N] TO SELECT CITY:`}
          </div>
          <div className="city-grid">
            {CITY_KEYS.map((key, i) => (
              <button
                key={key}
                className={`city-btn ${city === key ? "selected" : ""}`}
                onClick={() => {
                  setCity(key);
                  setPropertyPrice(CITIES[key].avgPrice);
                  setMonthlyRent(CITIES[key].avgRent);
                }}
              >
                [{i + 1}] {CITIES[key].name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="section-header">// INPUT_PARAMETERS</div>

          <div className="input-row">
            <div className="input-group">
              <span className="input-label">PROPERTY_PRICE................:</span>
              <div className="input-value">{formatINR(propertyPrice)}</div>
              <div className="ascii-bar">{asciiBar(propertyPrice, 1000000, 50000000)}</div>
              <input
                type="range"
                min={1000000} max={50000000} step={500000}
                value={propertyPrice}
                onChange={e => setPropertyPrice(+e.target.value)}
                style={{ width: "100%", margin: "6px 0", accentColor: "#00FF41" }}
              />
            </div>

            <div className="input-group">
              <span className="input-label">MONTHLY_RENT..................:</span>
              <div className="input-value">{formatINR(monthlyRent)}/mo</div>
              <div className="ascii-bar">{asciiBar(monthlyRent, 5000, 100000)}</div>
              <input
                type="range"
                min={5000} max={100000} step={1000}
                value={monthlyRent}
                onChange={e => setMonthlyRent(+e.target.value)}
                style={{ width: "100%", margin: "6px 0", accentColor: "#00FF41" }}
              />
            </div>

            <div className="input-group">
              <span className="input-label">DOWN_PAYMENT_PCT..............:</span>
              <div className="input-value">{downPaymentPct}%</div>
              <div className="ascii-bar">{asciiBar(downPaymentPct, 10, 80)}</div>
              <input
                type="range"
                min={10} max={80} step={1}
                value={downPaymentPct}
                onChange={e => setDownPaymentPct(+e.target.value)}
                style={{ width: "100%", margin: "6px 0", accentColor: "#00FF41" }}
              />
            </div>

            <div className="input-group">
              <span className="input-label">LOAN_INTEREST_RATE............:</span>
              <div className="input-value">{loanRate}% p.a.</div>
              <div className="ascii-bar">{asciiBar(loanRate, 6, 14)}</div>
              <input
                type="range"
                min={6} max={14} step={0.1}
                value={loanRate}
                onChange={e => setLoanRate(+e.target.value)}
                style={{ width: "100%", margin: "6px 0", accentColor: "#00FF41" }}
              />
            </div>

            <div className="input-group">
              <span className="input-label">TIME_HORIZON_YRS..............:</span>
              <div className="input-value">{horizon} YRS</div>
              <div className="ascii-bar">{asciiBar(horizon, 1, 30)}</div>
              <input
                type="range"
                min={1} max={30} step={1}
                value={horizon}
                onChange={e => setHorizon(+e.target.value)}
                style={{ width: "100%", margin: "6px 0", accentColor: "#00FF41" }}
              />
            </div>

            <div className="input-group">
              <span className="input-label">INVESTMENT_RETURN_RATE........:</span>
              <div className="input-value">{investReturn}% p.a.</div>
              <div className="ascii-bar">{asciiBar(investReturn, 4, 20)}</div>
              <input
                type="range"
                min={4} max={20} step={0.5}
                value={investReturn}
                onChange={e => setInvestReturn(+e.target.value)}
                style={{ width: "100%", margin: "6px 0", accentColor: "#00FF41" }}
              />
            </div>
          </div>

          {/* Results */}
          <div className="section-header">// COMPUTATION_OUTPUT</div>

          <div className="verdict-block">
            <div style={{ fontSize: 12, color: "#006600", marginBottom: 8 }}>{`> PROCESSING... DONE`}</div>
            <div className={`verdict-text ${R.winner === "buy" ? "verdict-buy" : "verdict-rent"}`}>
              {R.winner === "buy" ? ">>> BUY <<<" : ">>> RENT <<<"}
            </div>
            <div style={{ fontSize: 13, marginTop: 8, color: "#006600" }}>
              ADVANTAGE: <span className="glow">{formatINR(R.diff)}</span> over {horizon} YRS
            </div>
          </div>

          <div className="result-panel" style={{ marginTop: 16 }}>
            <div className="result-line">
              <span className="dim">MONTHLY_EMI</span>
              <span className="glow">{formatINR(R.emi)}/mo</span>
            </div>
            <div className="result-line">
              <span className="dim">DOWN_PAYMENT_REQUIRED</span>
              <span className="glow">{formatINR(R.downPayment)}</span>
            </div>
            <div className="result-line">
              <span className="dim">TOTAL_BUYING_COSTS</span>
              <span className="glow">{formatINR(R.buyingCosts)}</span>
            </div>
            <div className="result-line">
              <span className="dim">BUYER_NET_WEALTH_@_{horizon}YR</span>
              <span style={{ color: "#00FF41", textShadow: "0 0 8px #00FF41" }}>{formatINR(R.buyNetWealth)}</span>
            </div>
            <div className="result-line">
              <span className="dim">RENTER_NET_WEALTH_@_{horizon}YR</span>
              <span style={{ color: "#FFB300", textShadow: "0 0 8px #FFB300" }}>{formatINR(R.rentNetWealth)}</span>
            </div>
            <div className="result-line">
              <span className="dim">BREAKEVEN_YEAR</span>
              <span className={R.breakevenYear ? "glow" : "glow-amber"}>
                {R.breakevenYear ? `YEAR ${R.breakevenYear}` : "NOT_WITHIN_HORIZON"}
              </span>
            </div>
            <div className="result-line">
              <span className="dim">PROPERTY_VALUE_@_{horizon}YR</span>
              <span className="glow">{formatINR(R.propValueAtHorizon)}</span>
            </div>
          </div>

          {/* Wealth table */}
          <div className="section-header">// YEAR_BY_YEAR_ANALYSIS</div>
          <table className="wealth-table">
            <thead>
              <tr>
                <th>YR</th>
                <th>BUYER_WEALTH</th>
                <th>RENTER_WEALTH</th>
                <th>DELTA</th>
                <th>WINNER</th>
              </tr>
            </thead>
            <tbody>
              {R.buyWealthArr.map((bw, i) => {
                const rw = R.rentWealthArr[i];
                const delta = bw - rw;
                return (
                  <tr key={i}>
                    <td className="dim">{i + 1}</td>
                    <td style={{ color: "#00FF41" }}>{formatINR(bw)}</td>
                    <td style={{ color: "#FFB300" }}>{formatINR(rw)}</td>
                    <td style={{ color: delta >= 0 ? "#00FF41" : "#FF4400" }}>
                      {delta >= 0 ? "+" : ""}{formatINR(delta)}
                    </td>
                    <td style={{ color: delta >= 0 ? "#00FF41" : "#FFB300", fontSize: 11 }}>
                      {delta >= 0 ? "[BUY]" : "[RENT]"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: 32, fontSize: 11, color: "#003300", borderTop: "1px solid #002200", paddingTop: 12 }}>
            <div>{`> DISCLAIMER: PROJECTIONS ARE ILLUSTRATIVE ONLY`}</div>
            <div>{`> CONSULT A FINANCIAL ADVISOR BEFORE MAJOR DECISIONS`}</div>
            <div>{`> SESSION ENDED. TERMINAL READY.`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
