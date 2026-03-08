import { useState, useMemo, useEffect, useRef } from "react";
import { CITIES } from "../lib/data.js";
import { formatINR } from "../lib/formatters.js";
import { calculate } from "../lib/calculate.js";
import VersionNav from "../components/VersionNav.jsx";

const CITY_KEYS = Object.keys(CITIES).filter(k => k !== "custom");

function useCountUp(target) {
  const [val, setVal] = useState(target);
  const prevTarget = useRef(target);
  useEffect(() => {
    if (prevTarget.current === target) return;
    prevTarget.current = target;
    let raf;
    const start = Date.now(), from = val, dur = 800;
    function tick() {
      const t = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (target - from) * ease));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]); // eslint-disable-line
  return val;
}

export default function V2LuxuryEditorial() {
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
  const animDiff = useCountUp(R.diff);
  const animBuyWealth = useCountUp(R.buyNetWealth);
  const animRentWealth = useCountUp(R.rentNetWealth);

  const IVORY = "#FAF7F2";
  const INK = "#1A1009";
  const BROWN = "#6B3A2A";
  const HAIRLINE = "#D4C9B8";
  const BROWN_LIGHT = "#8B5A3A";

  return (
    <div style={{ minHeight: "100vh", background: IVORY, color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.8s ease forwards;
        }

        .editorial-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid ${HAIRLINE};
          color: ${INK};
          font-family: 'DM Mono', monospace;
          font-size: 15px;
          width: 100%;
          padding: 8px 0;
          outline: none;
          transition: border-color 0.4s ease;
        }

        .editorial-input:focus {
          border-bottom-color: ${BROWN};
        }

        input[type=range].editorial-range {
          -webkit-appearance: none;
          width: 100%;
          height: 1px;
          background: ${HAIRLINE};
          outline: none;
          border: none;
          margin-top: 16px;
          transition: background 0.4s ease;
        }

        input[type=range].editorial-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${BROWN};
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }

        input[type=range].editorial-range:hover::-webkit-slider-thumb {
          transform: scale(1.3);
        }

        .city-tab {
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: #9E8E7A;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 16px;
          padding: 6px 0;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-right: 20px;
        }

        .city-tab:hover {
          color: ${BROWN};
          border-bottom-color: ${HAIRLINE};
        }

        .city-tab.active {
          color: ${INK};
          border-bottom-color: ${BROWN};
        }

        .nav-editorial {
          background: ${IVORY};
          border-bottom: 1px solid ${HAIRLINE};
          padding: 14px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-editorial a {
          color: ${INK};
          text-decoration: none;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 15px;
          opacity: 0.6;
          transition: opacity 0.3s;
        }

        .nav-editorial a:hover { opacity: 1; }

        .pullquote {
          border-left: 2px solid ${BROWN};
          padding-left: 24px;
          margin: 24px 0;
        }

        .pullquote-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 28px;
          line-height: 1.4;
          color: ${BROWN};
        }

        .num-callout {
          font-family: 'DM Mono', monospace;
          font-size: 42px;
          font-weight: 300;
          color: ${INK};
          transition: opacity 0.4s ease;
        }

        .hairline {
          height: 1px;
          background: ${HAIRLINE};
          margin: 32px 0;
        }

        .label-sm {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9E8E7A;
          margin-bottom: 6px;
        }

        .year-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .year-table th {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9E8E7A;
          text-align: left;
          padding: 8px 0;
          border-bottom: 1px solid ${HAIRLINE};
        }

        .year-table td {
          padding: 8px 0;
          border-bottom: 1px solid #EDE5D822;
          font-family: 'DM Mono', monospace;
        }

        .year-table tr:hover td {
          background: transparent;
          color: ${BROWN};
        }
      `}</style>

      {/* Nav */}
      <div className="nav-editorial">
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 22, color: INK, letterSpacing: 0.5 }}>
          HomeWise
        </span>
        <VersionNav />
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 48px" }}>

        {/* Hero */}
        <div className="fade-in" style={{ marginBottom: 48 }}>
          <div className="label-sm" style={{ marginBottom: 16 }}>Vol. II · Luxury Editorial</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 60,
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 1.05,
            color: INK,
            letterSpacing: -1,
          }}>
            Is it time to buy<br />in {CITIES[city].name}?
          </h1>
        </div>

        {/* City */}
        <div className="hairline" />
        <div style={{ marginBottom: 40 }}>
          <div className="label-sm" style={{ marginBottom: 16 }}>Select City</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {CITY_KEYS.map(key => (
              <button
                key={key}
                className={`city-tab ${city === key ? "active" : ""}`}
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

        {/* Inputs — two column */}
        <div className="hairline" />
        <div style={{ marginBottom: 40 }}>
          <div className="label-sm" style={{ marginBottom: 24 }}>Your Parameters</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
            {[
              { label: "Property Price", value: propertyPrice, set: setPropertyPrice, min: 1000000, max: 50000000, step: 500000, fmt: formatINR },
              { label: "Monthly Rent", value: monthlyRent, set: setMonthlyRent, min: 5000, max: 100000, step: 1000, fmt: v => formatINR(v) + " /mo" },
              { label: "Down Payment", value: downPaymentPct, set: setDownPaymentPct, min: 10, max: 80, step: 1, fmt: v => v + "%" },
              { label: "Loan Rate", value: loanRate, set: setLoanRate, min: 6, max: 14, step: 0.1, fmt: v => v + "%" },
              { label: "Time Horizon", value: horizon, set: setHorizon, min: 1, max: 30, step: 1, fmt: v => v + " years" },
              { label: "Investment Return", value: investReturn, set: setInvestReturn, min: 4, max: 20, step: 0.5, fmt: v => v + "%" },
            ].map(({ label, value, set, min, max, step, fmt }) => (
              <div key={label} style={{ marginBottom: 32, borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#7A6A58" }}>{label}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: BROWN }}>{fmt(value)}</span>
                </div>
                <input
                  type="range"
                  className="editorial-range"
                  min={min} max={max} step={step}
                  value={value}
                  onChange={e => set(+e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pull-quote verdict */}
        <div className="hairline" />
        <div className="fade-in pullquote" style={{ marginBottom: 40 }}>
          <div className="pullquote-text">
            "{isBuy ? "Buying" : "Renting"} leaves you{" "}
            <span style={{ fontFamily: "'DM Mono', monospace", fontStyle: "normal", fontSize: 22 }}>
              {formatINR(animDiff)}
            </span>{" "}
            wealthier after {horizon} years."
          </div>
        </div>

        {/* Two-column wealth callouts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px", marginBottom: 40 }}>
          <div>
            <div className="label-sm">Buyer Net Wealth</div>
            <div className="num-callout" style={{ color: isBuy ? INK : HAIRLINE }}>
              {formatINR(animBuyWealth)}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "#9E8E7A", marginTop: 4 }}>
              After {horizon} years
            </div>
          </div>
          <div>
            <div className="label-sm">Renter Net Wealth</div>
            <div className="num-callout" style={{ color: !isBuy ? INK : HAIRLINE }}>
              {formatINR(animRentWealth)}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "#9E8E7A", marginTop: 4 }}>
              After {horizon} years
            </div>
          </div>
        </div>

        <div className="hairline" />

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 32px", marginBottom: 40 }}>
          {[
            { label: "Monthly EMI", val: formatINR(R.emi) + "/mo" },
            { label: "Down Payment", val: formatINR(R.downPayment) },
            { label: "Breakeven", val: R.breakevenYear ? `Year ${R.breakevenYear}` : "Beyond horizon" },
            { label: "Total Upfront", val: formatINR(R.buyingCosts) },
            { label: "Property Value", val: formatINR(R.propValueAtHorizon) },
            { label: "Stamp + Reg", val: formatINR(R.stampDutyCost + R.registrationCost) },
          ].map(({ label, val }) => (
            <div key={label} style={{ marginBottom: 28, borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: 20 }}>
              <div className="label-sm">{label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 17, color: INK }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Year table */}
        <div className="hairline" />
        <div className="label-sm" style={{ marginBottom: 20 }}>Wealth by Year</div>
        <table className="year-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Buyer Wealth</th>
              <th>Renter Wealth</th>
              <th>Advantage</th>
            </tr>
          </thead>
          <tbody>
            {R.buyWealthArr.map((bw, i) => {
              const rw = R.rentWealthArr[i];
              const delta = bw - rw;
              return (
                <tr key={i}>
                  <td style={{ color: "#9E8E7A" }}>{i + 1}</td>
                  <td style={{ color: INK }}>{formatINR(bw)}</td>
                  <td style={{ color: INK }}>{formatINR(rw)}</td>
                  <td style={{ color: delta >= 0 ? BROWN : BROWN_LIGHT }}>
                    {delta >= 0 ? "Buy +" : "Rent +"}{formatINR(Math.abs(delta))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="hairline" style={{ marginTop: 48 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: HAIRLINE }}>
          <span style={{ fontFamily: "'DM Mono', monospace" }}>HOMEWISE · VERSION II</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Not financial advice</span>
        </div>
      </div>
    </div>
  );
}
