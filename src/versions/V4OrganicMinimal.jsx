import { useState, useMemo } from "react";
import { CITIES } from "../lib/data.js";
import { formatINR } from "../lib/formatters.js";
import { calculate } from "../lib/calculate.js";
import VersionNav from "../components/VersionNav.jsx";

const CITY_KEYS = Object.keys(CITIES).filter(k => k !== "custom");

export default function V4OrganicMinimal() {
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
  const TERRACOTTA = "#C96E3A";
  const SAGE = "#6B8F5E";
  const SAND = "#F5EFE6";
  const DARK = "#2C1A0E";
  const CREAM = "#EDE5D8";

  return (
    <div style={{ minHeight: "100vh", background: SAND, fontFamily: "'DM Sans', sans-serif", color: DARK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes riseUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rise { animation: riseUp 0.5s ease forwards; }
        .rise-1 { animation-delay: 0.1s; opacity: 0; }
        .rise-2 { animation-delay: 0.2s; opacity: 0; }
        .rise-3 { animation-delay: 0.3s; opacity: 0; }
        .rise-4 { animation-delay: 0.4s; opacity: 0; }
        .rise-5 { animation-delay: 0.5s; opacity: 0; }
        .rise-6 { animation-delay: 0.6s; opacity: 0; }

        .organic-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(44,26,14,0.08);
          padding: 24px;
          transition: all 0.3s ease;
        }

        .organic-card:hover {
          box-shadow: 0 8px 36px rgba(44,26,14,0.13);
          transform: translateY(-2px);
        }

        .pill-input {
          width: 100%;
          border-radius: 50px;
          border: 2px solid #DDD5C5;
          background: ${SAND};
          color: ${DARK};
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          padding: 10px 20px;
          outline: none;
          transition: all 0.3s ease;
        }

        .pill-input:focus {
          border-color: ${TERRACOTTA};
          box-shadow: 0 0 0 3px ${TERRACOTTA}22;
        }

        input[type=range].organic-range {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 50px;
          background: #DDD5C5;
          outline: none;
          border: none;
          transition: background 0.3s;
        }

        input[type=range].organic-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${TERRACOTTA};
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(201,110,58,0.3);
          transition: all 0.2s;
        }

        input[type=range].organic-range::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        .city-pill {
          background: transparent;
          border: 2px solid #DDD5C5;
          border-radius: 50px;
          color: #9E8E7A;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .city-pill:hover {
          border-color: ${TERRACOTTA};
          color: ${TERRACOTTA};
        }

        .city-pill.active {
          background: ${TERRACOTTA};
          border-color: ${TERRACOTTA};
          color: #fff;
        }

        .nav-bar {
          background: ${SAND};
          border-bottom: 1px solid #DDD5C5;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-bar a { color: ${DARK}; text-decoration: none; font-size: 13px; opacity: 0.6; }
        .nav-bar a:hover { opacity: 1; }

        .stat-label {
          font-size: 12px;
          font-weight: 500;
          color: #9E8E7A;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 600;
          color: ${DARK};
          transition: all 0.3s ease;
        }

        .divider {
          height: 1px;
          background: #DDD5C5;
          margin: 16px 0;
        }

        .year-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .year-table th {
          text-align: left;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9E8E7A;
          border-bottom: 1px solid #DDD5C5;
        }

        .year-table td {
          padding: 7px 12px;
          border-bottom: 1px solid #EDE5D8;
        }

        .year-table tr:hover td {
          background: ${SAND};
        }
      `}</style>

      {/* Nav */}
      <div className="nav-bar">
        <span style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 18, color: DARK }}>
          HomeWise
        </span>
        <VersionNav />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div className="rise rise-1" style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: TERRACOTTA, marginBottom: 12 }}>
            Rent vs Buy Calculator
          </p>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 40, fontWeight: 600, fontStyle: "italic", lineHeight: 1.2, color: DARK }}>
            What's right<br />for you in {CITIES[city].name}?
          </h1>
        </div>

        {/* City selector */}
        <div className="organic-card rise rise-2" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#9E8E7A", marginBottom: 14, fontWeight: 600 }}>
            Your City
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CITY_KEYS.map(key => (
              <button
                key={key}
                className={`city-pill ${city === key ? "active" : ""}`}
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

        {/* Inputs */}
        <div className="organic-card rise rise-3" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#9E8E7A", marginBottom: 20, fontWeight: 600 }}>
            Your Numbers
          </p>
          {[
            { label: "Property Price", value: propertyPrice, set: setPropertyPrice, min: 1000000, max: 50000000, step: 500000, fmt: formatINR },
            { label: "Monthly Rent", value: monthlyRent, set: setMonthlyRent, min: 5000, max: 100000, step: 1000, fmt: v => formatINR(v) + "/mo" },
            { label: "Down Payment", value: downPaymentPct, set: setDownPaymentPct, min: 10, max: 80, step: 1, fmt: v => v + "%" },
            { label: "Loan Interest Rate", value: loanRate, set: setLoanRate, min: 6, max: 14, step: 0.1, fmt: v => v + "%" },
            { label: "Time Horizon", value: horizon, set: setHorizon, min: 1, max: 30, step: 1, fmt: v => v + " years" },
            { label: "Investment Return", value: investReturn, set: setInvestReturn, min: 4, max: 20, step: 0.5, fmt: v => v + "%" },
          ].map(({ label, value, set, min, max, step, fmt }) => (
            <div key={label} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#7A6A58" }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: TERRACOTTA }}>{fmt(value)}</span>
              </div>
              <input
                type="range"
                className="organic-range"
                min={min} max={max} step={step}
                value={value}
                onChange={e => set(+e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Result cards */}
        <div className="rise rise-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Buy card */}
          <div style={{
            background: isBuy ? SAGE : "#fff",
            borderRadius: 20,
            boxShadow: `0 4px 24px rgba(44,26,14,${isBuy ? "0.15" : "0.06"})`,
            padding: 24,
            border: isBuy ? `2px solid ${SAGE}` : "2px solid #DDD5C5",
            transition: "all 0.5s ease",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, color: isBuy ? "#fff" : "#9E8E7A" }}>
              {isBuy ? "✓ Better to Buy" : "Buy"}
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 600, color: isBuy ? "#fff" : DARK, marginBottom: 8 }}>
              {formatINR(R.buyNetWealth)}
            </div>
            <div style={{ fontSize: 13, color: isBuy ? "rgba(255,255,255,0.8)" : "#9E8E7A" }}>
              Net wealth after {horizon} yrs
            </div>
            <div className="divider" style={{ background: isBuy ? "rgba(255,255,255,0.3)" : "#DDD5C5" }} />
            <div style={{ fontSize: 13, color: isBuy ? "#fff" : DARK }}>
              EMI: <strong>{formatINR(R.emi)}/mo</strong>
            </div>
          </div>

          {/* Rent card */}
          <div style={{
            background: !isBuy ? TERRACOTTA : "#fff",
            borderRadius: 20,
            boxShadow: `0 4px 24px rgba(44,26,14,${!isBuy ? "0.15" : "0.06"})`,
            padding: 24,
            border: !isBuy ? `2px solid ${TERRACOTTA}` : "2px solid #DDD5C5",
            transition: "all 0.5s ease",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, color: !isBuy ? "#fff" : "#9E8E7A" }}>
              {!isBuy ? "✓ Better to Rent" : "Rent"}
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 600, color: !isBuy ? "#fff" : DARK, marginBottom: 8 }}>
              {formatINR(R.rentNetWealth)}
            </div>
            <div style={{ fontSize: 13, color: !isBuy ? "rgba(255,255,255,0.8)" : "#9E8E7A" }}>
              Net wealth after {horizon} yrs
            </div>
            <div className="divider" style={{ background: !isBuy ? "rgba(255,255,255,0.3)" : "#DDD5C5" }} />
            <div style={{ fontSize: 13, color: !isBuy ? "#fff" : DARK }}>
              Advantage: <strong>{formatINR(R.diff)}</strong>
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="organic-card rise rise-5" style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 20, color: DARK, marginBottom: 20, lineHeight: 1.4 }}>
            "{isBuy ? "Buying" : "Renting"} leaves you {formatINR(R.diff)} wealthier over {horizon} years."
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Monthly EMI", val: formatINR(R.emi) + "/mo" },
              { label: "Down Payment", val: formatINR(R.downPayment) },
              { label: "Breakeven", val: R.breakevenYear ? `Year ${R.breakevenYear}` : "Not in horizon" },
              { label: "Property Value", val: formatINR(R.propValueAtHorizon) },
            ].map(({ label, val }) => (
              <div key={label}>
                <div className="stat-label">{label}</div>
                <div className="stat-value" style={{ fontSize: 18 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Year table */}
        <div className="organic-card rise rise-6">
          <p style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#9E8E7A", marginBottom: 16, fontWeight: 600 }}>
            Year-by-Year
          </p>
          <div style={{ overflowX: "auto" }}>
            <table className="year-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Buyer Wealth</th>
                  <th>Renter Wealth</th>
                  <th>Better</th>
                </tr>
              </thead>
              <tbody>
                {R.buyWealthArr.map((bw, i) => {
                  const rw = R.rentWealthArr[i];
                  const buyWins = bw >= rw;
                  return (
                    <tr key={i}>
                      <td style={{ color: "#9E8E7A", fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ color: SAGE, fontWeight: 500 }}>{formatINR(bw)}</td>
                      <td style={{ color: TERRACOTTA, fontWeight: 500 }}>{formatINR(rw)}</td>
                      <td>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: buyWins ? SAGE : TERRACOTTA,
                          background: buyWins ? `${SAGE}18` : `${TERRACOTTA}18`,
                          borderRadius: 50,
                          padding: "2px 10px",
                        }}>
                          {buyWins ? "Buy" : "Rent"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: 12, color: "#BEB5A8", letterSpacing: 0.5 }}>
          Illustrative projections only · Not financial advice
        </p>
      </div>
    </div>
  );
}
