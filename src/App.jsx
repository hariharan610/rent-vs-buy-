import { useState, useMemo, useEffect, useRef } from "react";
import { CITIES, STAMP_DUTY_OPTIONS, PROPERTY_TYPES, TOOLTIPS } from "./lib/data.js";
import { formatINR, formatINRFull } from "./lib/formatters.js";
import { calculate, calculateRentThenBuy } from "./lib/calculate.js";

/* ─── URL HELPERS ───────────────────────────────────────────────────── */

function readHash() {
  const h = window.location.hash.slice(1);
  if (!h) return null;
  const out = {};
  h.split("&").forEach(s => {
    const eq = s.indexOf("=");
    if (eq > 0) out[s.slice(0, eq)] = decodeURIComponent(s.slice(eq + 1));
  });
  return Object.keys(out).length ? out : null;
}

function writeHash(obj) {
  const str = Object.entries(obj)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  window.history.replaceState(null, "", "#" + str);
}

/* ─── HOOKS ─────────────────────────────────────────────────────────── */

function useCountUp(target, triggerKey) {
  const [val, setVal] = useState(target);
  useEffect(() => {
    let raf;
    const start = Date.now(), dur = 900;
    function tick() {
      const t = Math.min((Date.now() - start) / dur, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, triggerKey]); // eslint-disable-line react-hooks/exhaustive-deps
  return val;
}

/* ─── TOOLTIP ───────────────────────────────────────────────────────── */

function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", marginLeft: 5, verticalAlign: "middle" }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(s => !s)}
        style={{ color: "#555", cursor: "help", fontSize: 14, lineHeight: 1, userSelect: "none" }}
      >ⓘ</span>
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#1e2028", border: "1px solid #2a2d35",
          borderRadius: 8, padding: "9px 11px",
          fontSize: 13, color: "#8a8f98", lineHeight: 1.65,
          width: 220, whiteSpace: "normal", zIndex: 9999,
          boxShadow: "0 8px 28px rgba(0,0,0,0.55)",
          pointerEvents: "none",
        }}>
          {text}
          <span style={{
            position: "absolute", top: "100%", left: "50%",
            transform: "translateX(-50%)",
            borderWidth: 5, borderStyle: "solid",
            borderColor: "#2a2d35 transparent transparent transparent",
          }} />
        </span>
      )}
    </span>
  );
}

/* ─── SUBCOMPONENTS ─────────────────────────────────────────────────── */

function Slider({ label, value, onChange, min, max, step, format, suffix, info, tooltip, color = "#c8ff32" }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <label style={{ fontSize: 15, color: "#8a8f98", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center" }}>
          {label}
          {tooltip && <Tooltip text={tooltip} />}
          {info && <span style={{ marginLeft: 6, color: "#555", fontSize: 13 }}>{info}</span>}
        </label>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>
          {format ? format(value) : value}{suffix || ""}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: 6, appearance: "none", borderRadius: 3,
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #2a2d35 ${pct}%, #2a2d35 100%)`,
          cursor: "pointer", outline: "none",
          "--thumb-color": color,
          "--thumb-glow": `${color}80`,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 12, color: "#555", fontFamily: "'Space Mono', monospace" }}>
          {format ? format(min) : min}{suffix || ""}
        </span>
        <span style={{ fontSize: 12, color: "#555", fontFamily: "'Space Mono', monospace" }}>
          {format ? format(max) : max}{suffix || ""}
        </span>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 12, fontFamily: "'Space Mono', monospace",
      color: "#555", letterSpacing: "0.15em", textTransform: "uppercase",
      marginBottom: 16, marginTop: 4,
    }}>
      {children}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#181a20", borderRadius: 12, padding: 20,
      border: "1px solid #1e2028", marginBottom: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}

function MiniBar({ label, value, maxVal, color }) {
  const pct = Math.min((Math.abs(value) / Math.max(maxVal, 1)) * 100, 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 14, color: "#8a8f98" }}>{label}</span>
        <span style={{ fontSize: 14, color: "#e8eaed", fontFamily: "'Space Mono', monospace", fontWeight: 600 }}>
          {formatINR(value)}
        </span>
      </div>
      <div style={{ height: 5, background: "#1e2028", borderRadius: 3 }}>
        <div style={{
          height: 5, width: `${pct}%`, background: color, borderRadius: 3,
          transition: "width 0.5s ease",
          boxShadow: pct > 30 ? `0 0 6px ${color}40` : "none",
        }} />
      </div>
    </div>
  );
}

function KeyRow({ label, value, last = false, highlight }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0", borderBottom: last ? "none" : "1px solid #1e2028",
    }}>
      <span style={{ fontSize: 14, color: "#8a8f98" }}>{label}</span>
      <span style={{
        fontSize: 15, fontWeight: 600, fontFamily: "'Space Mono', monospace",
        color: highlight || "#e8eaed",
      }}>
        {value}
      </span>
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", background: "#1e2028", borderRadius: 8, padding: 3 }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1, padding: "7px 4px", border: "none", borderRadius: 6,
            background: value === opt.value ? "#c8ff32" : "transparent",
            color: value === opt.value ? "#13151a" : "#8a8f98",
            fontSize: 13, fontWeight: value === opt.value ? 700 : 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer", transition: "all 0.2s", lineHeight: 1.3, textAlign: "center",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── NET WEALTH SVG CHART ──────────────────────────────────────────── */

function WealthChart({ buyWealth, rentWealth, hybridWealth, horizon, breakevenYear }) {
  const W = 320, H = 210, PAD = { t: 16, r: 8, b: 28, l: 58 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const allVals = [...buyWealth, ...rentWealth, ...(hybridWealth || [])].filter(isFinite);
  const minY = Math.min(0, ...allVals);
  const maxY = Math.max(...allVals, 1);

  const toX = (i) => PAD.l + (i / horizon) * innerW;
  const toY = (v) => PAD.t + innerH - ((v - minY) / (maxY - minY)) * innerH;

  const buyPts  = buyWealth.map((v, i)  => `${toX(i + 1)},${toY(v)}`).join(" ");
  const rentPts = rentWealth.map((v, i) => `${toX(i + 1)},${toY(v)}`).join(" ");
  const hybrPts = hybridWealth ? hybridWealth.map((v, i) => `${toX(i + 1)},${toY(v)}`).join(" ") : "";

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(p => minY + (maxY - minY) * p);

  let bkX = null, bkY = null;
  if (breakevenYear && breakevenYear <= horizon) {
    bkX = toX(breakevenYear);
    bkY = toY(buyWealth[breakevenYear - 1]);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      {minY < 0 && (
        <line x1={PAD.l} y1={toY(0)} x2={W - PAD.r} y2={toY(0)}
          stroke="#2a2d35" strokeWidth="1" strokeDasharray="4,3" />
      )}
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)} stroke="#1e2028" strokeWidth="1" />
          <text x={PAD.l - 4} y={toY(v) + 4} textAnchor="end"
            fill="#555" fontSize="7.5" fontFamily="Space Mono, monospace">
            {formatINR(v)}
          </text>
        </g>
      ))}

      {/* Area fills */}
      <polyline points={`${toX(1)},${toY(0)} ${buyPts} ${toX(horizon)},${toY(0)}`} fill="rgba(200,255,50,0.05)" stroke="none" />
      <polyline points={`${toX(1)},${toY(0)} ${rentPts} ${toX(horizon)},${toY(0)}`} fill="rgba(100,180,255,0.05)" stroke="none" />
      {hybrPts && <polyline points={`${toX(1)},${toY(0)} ${hybrPts} ${toX(horizon)},${toY(0)}`} fill="rgba(255,159,67,0.05)" stroke="none" />}

      {/* Hybrid line (behind) */}
      {hybrPts && (
        <polyline points={hybrPts} fill="none" stroke="#ff9f43" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8,4" />
      )}

      {/* Main lines */}
      <polyline points={buyPts} fill="none" stroke="#c8ff32" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={rentPts} fill="none" stroke="#64b4ff" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,4" />

      {/* Dots */}
      {buyWealth.map((v, i) => (
        ((i + 1) % 5 === 0 || i === horizon - 1) && (
          <circle key={`b${i}`} cx={toX(i + 1)} cy={toY(v)} r="3" fill="#c8ff32" />
        )
      ))}
      {rentWealth.map((v, i) => (
        ((i + 1) % 5 === 0 || i === horizon - 1) && (
          <circle key={`r${i}`} cx={toX(i + 1)} cy={toY(v)} r="3" fill="#64b4ff" />
        )
      ))}
      {hybridWealth && hybridWealth.map((v, i) => (
        ((i + 1) % 5 === 0 || i === horizon - 1) && (
          <circle key={`h${i}`} cx={toX(i + 1)} cy={toY(v)} r="2.5" fill="#ff9f43" />
        )
      ))}

      {/* Breakeven marker */}
      {bkX && (
        <g>
          <circle cx={bkX} cy={bkY} r="7" fill="none" stroke="#ffd93d" strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,217,61,0.7))" }} />
          <circle cx={bkX} cy={bkY} r="3" fill="#ffd93d" />
          <text x={bkX} y={bkY - 12} textAnchor="middle"
            fill="#ffd93d" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">
            Y{breakevenYear}
          </text>
        </g>
      )}

      {Array.from({ length: horizon }, (_, i) => i + 1)
        .filter(y => y === 1 || y % 5 === 0 || y === horizon)
        .map(y => (
          <text key={y} x={toX(y)} y={H - 6} textAnchor="middle"
            fill="#555" fontSize="8" fontFamily="Space Mono, monospace">
            Y{y}
          </text>
        ))}
    </svg>
  );
}

/* ─── CUMULATIVE COST CHART ─────────────────────────────────────────── */

function CostChart({ yearlyCumBuy, yearlyCumRent, yearlyCumHybrid, horizon, costCrossoverYear }) {
  const W = 320, H = 190, PAD = { t: 10, r: 8, b: 28, l: 58 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const allVals = [...yearlyCumBuy, ...yearlyCumRent, ...(yearlyCumHybrid || [])];
  const maxCum = Math.max(...allVals, 1);
  const toX = (i) => PAD.l + (i / horizon) * innerW;
  const toY = (v) => PAD.t + innerH - (v / maxCum) * innerH;
  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(p => maxCum * p);

  let cckX = null, cckY = null;
  if (costCrossoverYear && costCrossoverYear <= horizon) {
    cckX = toX(costCrossoverYear);
    cckY = toY(yearlyCumRent[costCrossoverYear - 1]);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)} stroke="#1e2028" strokeWidth="1" />
          <text x={PAD.l - 4} y={toY(v) + 4} textAnchor="end"
            fill="#555" fontSize="7.5" fontFamily="Space Mono, monospace">
            {formatINR(v)}
          </text>
        </g>
      ))}

      {yearlyCumHybrid && (
        <polyline
          points={yearlyCumHybrid.map((v, i) => `${toX(i + 1)},${toY(v)}`).join(" ")}
          fill="none" stroke="#ff9f43" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8,4"
        />
      )}
      <polyline
        points={yearlyCumBuy.map((v, i) => `${toX(i + 1)},${toY(v)}`).join(" ")}
        fill="none" stroke="#c8ff32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <polyline
        points={yearlyCumRent.map((v, i) => `${toX(i + 1)},${toY(v)}`).join(" ")}
        fill="none" stroke="#64b4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="6,4"
      />

      {yearlyCumBuy.map((v, i) => (
        ((i + 1) % 5 === 0 || i === horizon - 1) ? (
          <circle key={i} cx={toX(i + 1)} cy={toY(v)} r="3" fill="#c8ff32" />
        ) : null
      ))}
      {yearlyCumRent.map((v, i) => (
        ((i + 1) % 5 === 0 || i === horizon - 1) ? (
          <circle key={i} cx={toX(i + 1)} cy={toY(v)} r="3" fill="#64b4ff" />
        ) : null
      ))}

      {/* Cost crossover marker */}
      {cckX && (
        <g>
          <circle cx={cckX} cy={cckY} r="7" fill="none" stroke="#ffd93d" strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,217,61,0.6))" }} />
          <circle cx={cckX} cy={cckY} r="3" fill="#ffd93d" />
          <text x={cckX} y={cckY - 12} textAnchor="middle"
            fill="#ffd93d" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">
            Y{costCrossoverYear}
          </text>
        </g>
      )}

      {Array.from({ length: horizon }, (_, i) => i + 1)
        .filter(y => y === 1 || y % 5 === 0 || y === horizon)
        .map(y => (
          <text key={y} x={toX(y)} y={H - 6} textAnchor="middle"
            fill="#555" fontSize="8" fontFamily="Space Mono, monospace">
            Y{y}
          </text>
        ))}
    </svg>
  );
}

/* ─── HRA COLLAPSIBLE ───────────────────────────────────────────────── */

function HRASection({ isMetro, hraInputs, setHraInputs }) {
  const [open, setOpen] = useState(false);
  const { basicSalary, hraReceived, monthlyRentForHRA } = hraInputs;

  let hraExemption = 0;
  if (basicSalary > 0 && hraReceived > 0 && monthlyRentForHRA > 0) {
    const rentMinusBasic = monthlyRentForHRA * 12 - 0.1 * basicSalary;
    const pctBasic = (isMetro ? 0.5 : 0.4) * basicSalary;
    hraExemption = Math.max(0, Math.min(hraReceived, Math.max(0, rentMinusBasic), pctBasic));
  }

  const inputStyle = {
    width: "100%", padding: "9px 12px", background: "#13151a",
    border: "1px solid #2a2d35", borderRadius: 8, color: "#e8eaed",
    fontSize: 15, fontFamily: "'Space Mono', monospace", outline: "none",
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 16px", background: "#181a20", border: "1px solid #1e2028",
        borderRadius: open ? "12px 12px 0 0" : 12, color: "#8a8f98",
        fontSize: 15, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
      }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          HRA Tax Benefit
          <Tooltip text={TOOLTIPS.hra} />
          <span style={{ fontSize: 13, color: "#555", marginLeft: 6 }}>(optional)</span>
        </span>
        <span style={{
          fontSize: 16, color: "#555", display: "inline-block",
          transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none",
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          background: "#181a20", border: "1px solid #1e2028", borderTop: "none",
          borderRadius: "0 0 12px 12px", padding: 16,
        }}>
          {[
            { key: "basicSalary",       label: "Basic Salary (Annual)",        placeholder: "e.g. 600000" },
            { key: "hraReceived",        label: "HRA Received (Annual)",        placeholder: "e.g. 240000" },
            { key: "monthlyRentForHRA",  label: "Monthly Rent for HRA Claim",   placeholder: "e.g. 25000"  },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 14, color: "#8a8f98", display: "block", marginBottom: 6 }}>{label}</label>
              <input
                type="number" placeholder={placeholder}
                value={hraInputs[key] || ""}
                onChange={e => setHraInputs(h => ({ ...h, [key]: Number(e.target.value) }))}
                style={inputStyle}
              />
            </div>
          ))}
          {hraExemption > 0 && (
            <div style={{
              background: "rgba(255,217,61,0.06)", border: "1px solid rgba(255,217,61,0.15)",
              borderRadius: 8, padding: "10px 12px",
            }}>
              <div style={{ fontSize: 13, color: "#8a8f98" }}>Annual HRA Exemption (Sec 10(13A))</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ffd93d", fontFamily: "'Space Mono', monospace", marginTop: 2 }}>
                {formatINRFull(hraExemption)}
              </div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                {isMetro ? "Metro city — 50% of basic" : "Non-metro — 40% of basic"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────────────────── */

export default function RentVsBuyCalculator() {
  // Core inputs
  const [city,            setCity]            = useState("chennai");
  const [propertyPrice,   setPropertyPrice]   = useState(CITIES.chennai.avgPrice);
  const [monthlyRent,     setMonthlyRent]     = useState(CITIES.chennai.avgRent);
  const [downPaymentPct,  setDownPaymentPct]  = useState(20);
  const [loanRate,        setLoanRate]        = useState(8.5);
  const [loanTenure,      setLoanTenure]      = useState(20);
  const [appreciation,    setAppreciation]    = useState(CITIES.chennai.appreciation);
  const [rentIncrease,    setRentIncrease]    = useState(CITIES.chennai.rentIncrease);
  const [maintenance,     setMaintenance]     = useState(5000);
  const [investReturn,    setInvestReturn]    = useState(12);
  const [horizon,         setHorizon]         = useState(10);
  const [taxBracket,      setTaxBracket]      = useState(30);
  const [stampDutyPct,    setStampDutyPct]    = useState(CITIES.chennai.stampDuty);
  const [stampDutyCustom, setStampDutyCustom] = useState(false);
  const [forcedSavings,   setForcedSavings]   = useState(100);
  const [hraInputs,       setHraInputs]       = useState({ basicSalary: 0, hraReceived: 0, monthlyRentForHRA: 0 });
  // Rent-then-buy
  const [rtbEnabled,      setRtbEnabled]      = useState(false);
  const [switchYear,      setSwitchYear]      = useState(5);
  // Affordability module
  const [module,           setModule]          = useState("affordability");
  const [afActiveTab,      setAfActiveTab]      = useState("income");
  const [afMonthlyIncome,  setAfMonthlyIncome]  = useState(100000);
  const [afExistingEMIs,   setAfExistingEMIs]   = useState(0);
  const [afCurrentRent,    setAfCurrentRent]    = useState(CITIES.chennai.avgRent);
  const [afCurrentSavings, setAfCurrentSavings] = useState(0);
  // UI
  const [activeTab,       setActiveTab]       = useState("inputs");
  const [copied,          setCopied]          = useState(false);
  const [animKey,         setAnimKey]         = useState(0);
  const tabRef  = useRef(null);
  const urlLoading   = useRef(false);
  const isFirstRender = useRef(true);

  // ── City auto-fill (skip when loading from URL)
  useEffect(() => {
    if (urlLoading.current) { urlLoading.current = false; return; }
    if (city !== "custom") {
      const c = CITIES[city];
      setPropertyPrice(c.avgPrice);
      setMonthlyRent(c.avgRent);
      setAppreciation(c.appreciation);
      setRentIncrease(c.rentIncrease);
      if (!stampDutyCustom) setStampDutyPct(c.stampDuty);
      setAfCurrentRent(c.avgRent);
    }
  }, [city]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load from URL hash on mount
  useEffect(() => {
    const p = readHash();
    if (!p) return;
    urlLoading.current = true;
    if (p.c  && CITIES[p.c])      setCity(p.c);
    if (p.p)  setPropertyPrice(Number(p.p));
    if (p.r)  setMonthlyRent(Number(p.r));
    if (p.dp) setDownPaymentPct(Number(p.dp));
    if (p.lr) setLoanRate(Number(p.lr));
    if (p.lt) setLoanTenure(Number(p.lt));
    if (p.ap) setAppreciation(Number(p.ap));
    if (p.ri) setRentIncrease(Number(p.ri));
    if (p.mn) setMaintenance(Number(p.mn));
    if (p.ir) setInvestReturn(Number(p.ir));
    if (p.h)  setHorizon(Number(p.h));
    if (p.tb) setTaxBracket(Number(p.tb));
    if (p.sd) { const sdVal = Number(p.sd); setStampDutyPct(sdVal); setStampDutyCustom(!STAMP_DUTY_OPTIONS.some(o => o.value === sdVal)); }
    if (p.fs) setForcedSavings(Number(p.fs));
    if (p.sy) setSwitchYear(Number(p.sy));
    if (p.rtb === "1") setRtbEnabled(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Write URL hash on any input change (skip first render)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    writeHash({
      c: city, p: propertyPrice, r: monthlyRent, dp: downPaymentPct,
      lr: loanRate, lt: loanTenure, ap: appreciation, ri: rentIncrease,
      mn: maintenance, ir: investReturn, h: horizon, tb: taxBracket,
      sd: stampDutyPct, fs: forcedSavings, sy: switchYear, rtb: rtbEnabled ? 1 : 0,
    });
  }, [city, propertyPrice, monthlyRent, downPaymentPct, loanRate, loanTenure,
      appreciation, rentIncrease, maintenance, investReturn, horizon, taxBracket,
      stampDutyPct, forcedSavings, switchYear, rtbEnabled]);

  // ── Animate verdict on tab switch
  useEffect(() => {
    if (activeTab === "verdict") setAnimKey(k => k + 1);
  }, [activeTab]);

  // ── HRA exemption
  const hraExemptionAnnual = useMemo(() => {
    const { basicSalary, hraReceived, monthlyRentForHRA } = hraInputs;
    if (!basicSalary || !hraReceived || !monthlyRentForHRA) return 0;
    const isMetro = city !== "custom" ? CITIES[city].isMetro : false;
    const rentMinusBasic = monthlyRentForHRA * 12 - 0.1 * basicSalary;
    const pctBasic = (isMetro ? 0.5 : 0.4) * basicSalary;
    return Math.max(0, Math.min(hraReceived, Math.max(0, rentMinusBasic), pctBasic));
  }, [hraInputs, city]);

  // ── Main calculation
  const R = useMemo(() => calculate({
    propertyPrice, monthlyRent, downPaymentPct, loanRate, loanTenure,
    appreciation, rentIncrease, maintenance, investReturn, horizon,
    taxBracket, stampDutyPct, forcedSavingsPct: forcedSavings, hraExemptionAnnual,
  }), [propertyPrice, monthlyRent, downPaymentPct, loanRate, loanTenure,
       appreciation, rentIncrease, maintenance, investReturn, horizon,
       taxBracket, stampDutyPct, forcedSavings, hraExemptionAnnual]);

  // ── Zero-savings comparison (for forced savings impact callout)
  const R0 = useMemo(() => {
    if (forcedSavings === 0) return null;
    return calculate({
      propertyPrice, monthlyRent, downPaymentPct, loanRate, loanTenure,
      appreciation, rentIncrease, maintenance, investReturn, horizon,
      taxBracket, stampDutyPct, forcedSavingsPct: 0, hraExemptionAnnual,
    });
  }, [propertyPrice, monthlyRent, downPaymentPct, loanRate, loanTenure,
      appreciation, rentIncrease, maintenance, investReturn, horizon,
      taxBracket, stampDutyPct, hraExemptionAnnual, forcedSavings]);

  // ── Rent-then-buy calculation
  const RTB = useMemo(() => {
    if (!rtbEnabled) return null;
    return calculateRentThenBuy({
      propertyPrice, monthlyRent, downPaymentPct, loanRate, loanTenure,
      appreciation, rentIncrease, maintenance, investReturn, horizon,
      taxBracket, stampDutyPct, forcedSavingsPct: forcedSavings, hraExemptionAnnual,
      switchYear: Math.min(switchYear, horizon - 1),
    });
  }, [propertyPrice, monthlyRent, downPaymentPct, loanRate, loanTenure,
      appreciation, rentIncrease, maintenance, investReturn, horizon,
      taxBracket, stampDutyPct, forcedSavings, hraExemptionAnnual, switchYear, rtbEnabled]);

  // ── Derived
  const isMetro  = city !== "custom" ? CITIES[city].isMetro : false;
  const cityName = CITIES[city]?.name || "your city";
  const maxWealth = Math.max(R.propValueAtHorizon, R.rentNetWealth, R.buyNetWealth, RTB?.netWealth || 0, 1);
  const clampedSwitch = Math.min(switchYear, horizon - 1);

  // True winning margin: gap between #1 and #2 across all active scenarios
  const displayDiff = useMemo(() => {
    const vals = [R.buyNetWealth, R.rentNetWealth, ...(rtbEnabled && RTB ? [RTB.netWealth] : [])];
    vals.sort((a, b) => b - a);
    return Math.abs(vals[0] - vals[1]);
  }, [R.buyNetWealth, R.rentNetWealth, RTB, rtbEnabled]);

  // Count-up on the diff amount
  const animatedDiff = useCountUp(displayDiff, animKey);

  // ── Affordability calculation
  const AF = useMemo(() => {
    const r = loanRate / 100 / 12;
    const n = loanTenure * 12;
    const loanFactor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));

    const maxEmi        = Math.max(0, afMonthlyIncome * 0.40 - afExistingEMIs);
    const comfortEmi    = Math.max(0, afMonthlyIncome * 0.30 - afExistingEMIs);
    const maxLoan       = maxEmi * loanFactor;
    const comfortLoan   = comfortEmi * loanFactor;

    const dpRate        = downPaymentPct / 100;
    const maxBudget     = maxLoan / (1 - dpRate);
    const comfortBudget = comfortLoan / (1 - dpRate);

    const upfrontRate      = dpRate + stampDutyPct / 100 + 0.01;
    const maxUpfront       = maxBudget * upfrontRate;
    const comfortUpfront   = comfortBudget * upfrontRate;

    const savingsGap  = Math.max(0, maxUpfront - afCurrentSavings);
    const savingsFill = Math.min(1, afCurrentSavings / Math.max(maxUpfront, 1));

    let verdict = "NOT_YET";
    if (afCurrentSavings >= maxUpfront) verdict = "YES";
    else if (savingsFill >= 0.5)        verdict = "STRETCH";

    const disposable         = Math.max(0, afMonthlyIncome - afExistingEMIs - afCurrentRent);
    const monthlySavingsRate = disposable * 0.5;
    const monthsToTarget     = savingsGap > 0 && monthlySavingsRate > 0
      ? Math.ceil(savingsGap / monthlySavingsRate) : 0;

    const cityTypes  = PROPERTY_TYPES[city] || PROPERTY_TYPES.custom;
    const bandIdx    = cityTypes.findIndex(b => maxBudget <= b.maxPrice);
    const matchIndex = bandIdx === -1 ? cityTypes.length - 1 : bandIdx;

    return {
      maxBudget, comfortBudget,
      maxEmi, comfortEmi,
      maxUpfront, comfortUpfront,
      savingsGap, savingsFill,
      verdict, monthsToTarget, monthlySavingsRate,
      matchIndex, cityTypes,
    };
  }, [afMonthlyIncome, afExistingEMIs, afCurrentSavings, afCurrentRent,
      loanRate, loanTenure, downPaymentPct, stampDutyPct, city]);

  // ── Copy URL
  const copyURL = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetToCity = () => {
    const c = CITIES[city];
    setPropertyPrice(c.avgPrice);
    setMonthlyRent(c.avgRent);
    setAppreciation(c.appreciation);
    setRentIncrease(c.rentIncrease);
    setStampDutyPct(c.stampDuty);
    setStampDutyCustom(false);
    setDownPaymentPct(20);
    setLoanRate(8.5);
    setLoanTenure(20);
    setMaintenance(5000);
    setInvestReturn(12);
    setHorizon(10);
    setTaxBracket(30);
    setForcedSavings(100);
    setHraInputs({ basicSalary: 0, hraReceived: 0, monthlyRentForHRA: 0 });
    setRtbEnabled(false);
    setSwitchYear(5);
  };

  const resetAffordability = () => {
    setAfMonthlyIncome(100000);
    setAfExistingEMIs(0);
    setAfCurrentRent(CITIES[city]?.avgRent || 18000);
    setAfCurrentSavings(0);
    setDownPaymentPct(20);
    setLoanRate(8.5);
    setLoanTenure(20);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const handleModuleChange = (mod) => {
    setModule(mod);
    if (mod === "affordability") setAfActiveTab("income");
    else setActiveTab("inputs");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const afHandleTabChange = (tab) => {
    setAfActiveTab(tab);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  /* ── RTB winner label */
  const allWinnerLabel = () => {
    const vals = { buy: R.buyNetWealth, rent: R.rentNetWealth };
    if (RTB) vals.hybrid = RTB.netWealth;
    const best = Object.entries(vals).sort((a, b) => b[1] - a[1])[0];
    return best[0];
  };

  /* ══════════════════════════════════════════════════════════════════
      RENDER
  ══════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "#13151a", color: "#e8eaed", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@700;800;900&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type="range"] { -webkit-appearance: none; appearance: none; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: var(--thumb-color, #c8ff32); cursor: pointer; border: 2px solid #13151a;
          box-shadow: 0 0 10px var(--thumb-glow, rgba(200,255,50,0.5));
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--thumb-color, #c8ff32); cursor: pointer; border: 2px solid #13151a;
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 2px; }
        input[type="number"] { -moz-appearance: textfield; }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
        select option { background: #181a20; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .verdict-animate { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        padding: "24px 24px 18px",
        borderBottom: "1px solid #1e2028",
        background: "linear-gradient(180deg, #181a20 0%, #13151a 100%)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#c8ff32",
                boxShadow: "0 0 14px rgba(200,255,50,0.8)",
              }} />
              <span style={{ fontSize: 13, fontFamily: "'Space Mono', monospace", color: "#c8ff32", letterSpacing: "0.15em" }}>
                EVERY HOME DECISION, ONE PLACE
              </span>
            </div>
            <h1 style={{
              fontSize: 30, fontWeight: 900, fontFamily: "'Outfit', sans-serif",
              background: "linear-gradient(135deg, #e8eaed 0%, #8a8f98 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              lineHeight: 1.1, marginBottom: 4,
            }}>
              HomeWise
            </h1>
            <p style={{ fontSize: 13, color: "#555", fontFamily: "'Space Mono', monospace", letterSpacing: "0.03em" }}>
              India Edition · FY 2025–26
            </p>
          </div>
          {/* Copy URL button */}
          <button onClick={copyURL} style={{
            padding: "8px 14px", background: copied ? "rgba(200,255,50,0.12)" : "#1e2028",
            border: `1px solid ${copied ? "rgba(200,255,50,0.3)" : "#2a2d35"}`,
            borderRadius: 8, color: copied ? "#c8ff32" : "#8a8f98",
            fontSize: 13, fontFamily: "'Space Mono', monospace", cursor: "pointer",
            transition: "all 0.2s", whiteSpace: "nowrap", marginTop: 4,
          }}>
            {copied ? "✓ Copied!" : (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy Link
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── MODULE SELECTOR ── */}
      <div style={{ padding: "12px 24px", borderBottom: "1px solid #1e2028", display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "inline-flex", background: "#0e1014",
          borderRadius: 100, padding: 4, border: "1px solid #2a2d35",
        }}>
          {[
            {
              id: "affordability", label: "Affordability", activeColor: "#13151a", activeBg: "#ffd93d",
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
            },
            {
              id: "rvb", label: "Rent vs Buy", activeColor: "#13151a", activeBg: "#c8ff32",
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
            },
          ].map(m => (
            <button key={m.id} onClick={() => handleModuleChange(m.id)} style={{
              padding: "9px 22px", borderRadius: 100, border: "none",
              background: module === m.id ? m.activeBg : "transparent",
              color: module === m.id ? m.activeColor : "#555",
              fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", transition: "all 0.25s",
              whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 7,
            }}>
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CITY PILLS ── */}
      <div style={{ padding: "12px 24px", borderBottom: "1px solid #1e2028", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, overflowX: "auto", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", gap: 6 }}>
          {Object.entries(CITIES).map(([key, c]) => {
            const accent = module === "affordability" ? "#ffd93d" : "#c8ff32";
            const glow   = module === "affordability" ? "255,217,61" : "200,255,50";
            return (
              <button key={key} onClick={() => setCity(key)} style={{
                padding: "6px 14px", borderRadius: 20,
                border: `1px solid ${city === key ? accent : "#2a2d35"}`,
                background: city === key ? `rgba(${glow},0.1)` : "transparent",
                color: city === key ? accent : "#8a8f98",
                fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: city === key ? 700 : 500,
                cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                boxShadow: city === key ? `0 0 10px rgba(${glow},0.12)` : "none",
              }}>
                {c.name}
              </button>
            );
          })}
        </div>
        </div>
        <button onClick={module === "rvb" ? resetToCity : resetAffordability} style={{
          padding: "6px 14px", borderRadius: 20, flexShrink: 0,
          border: "1px dashed #3a3d45", background: "transparent", color: "#8a8f98",
          fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
        }}>
          ↺ Reset
        </button>
      </div>

      {/* ── TAB BAR ── */}
      <div ref={tabRef} style={{
        display: "flex", borderBottom: "1px solid #1e2028",
        position: "sticky", top: 0, zIndex: 100, background: "#13151a",
      }}>
        {module === "rvb" ? (
          [
            { id: "inputs",    label: "Your Scenario" },
            { id: "verdict",   label: "The Verdict"   },
            { id: "breakdown", label: "Year by Year"  },
          ].map((tab) => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
              flex: 1, padding: "13px 0", border: "none",
              borderBottom: `2px solid ${activeTab === tab.id ? "#c8ff32" : "transparent"}`,
              background: "transparent",
              color: activeTab === tab.id ? "#c8ff32" : "#555",
              fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {tab.label}
            </button>
          ))
        ) : (
          [
            { id: "income", label: "Income & Savings" },
            { id: "budget", label: "Your Budget"      },
            { id: "buy",    label: "What Can You Buy" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => afHandleTabChange(tab.id)} style={{
              flex: 1, padding: "13px 0", border: "none",
              borderBottom: `2px solid ${afActiveTab === tab.id ? "#ffd93d" : "transparent"}`,
              background: "transparent",
              color: afActiveTab === tab.id ? "#ffd93d" : "#555",
              fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {tab.label}
            </button>
          ))
        )}
      </div>

      <div style={{ padding: "20px 24px 60px", maxWidth: 640, margin: "0 auto" }}>

        {/* ════════════════════════════
            TAB 1 — INPUTS
        ════════════════════════════ */}
        {module === "rvb" && activeTab === "inputs" && (
          <div>
            <Card>
              <SectionLabel>Property &amp; Rent</SectionLabel>
              <Slider label="Property Price" value={propertyPrice}
                onChange={v => { setPropertyPrice(v); setCity("custom"); }}
                min={2000000} max={50000000} step={500000} format={formatINR} />
              <Slider label="Monthly Rent" value={monthlyRent}
                onChange={v => { setMonthlyRent(v); setCity("custom"); }}
                min={5000} max={200000} step={1000} format={formatINRFull} />
              <Slider label="Down Payment" value={downPaymentPct} onChange={setDownPaymentPct}
                min={10} max={50} step={5} suffix="%" tooltip={TOOLTIPS.downPayment} />
            </Card>

            <Card>
              <SectionLabel>Loan Details</SectionLabel>
              <Slider label="Home Loan Rate" value={loanRate} onChange={setLoanRate}
                min={6} max={12} step={0.1} suffix="%" />
              <Slider label="Loan Tenure" value={loanTenure} onChange={setLoanTenure}
                min={5} max={30} step={1} suffix=" yrs" tooltip={TOOLTIPS.tenure} />
              {/* Stamp Duty */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                  <label style={{ fontSize: 15, color: "#8a8f98", display: "flex", alignItems: "center" }}>Stamp Duty<Tooltip text={TOOLTIPS.stampDuty} /></label>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>
                    {stampDutyPct}%
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <select
                    value={stampDutyCustom ? "custom" : String(stampDutyPct)}
                    onChange={e => {
                      if (e.target.value === "custom") { setStampDutyCustom(true); }
                      else { setStampDutyCustom(false); setStampDutyPct(Number(e.target.value)); }
                    }}
                    style={{
                      width: "100%", padding: "9px 36px 9px 12px", background: "#13151a",
                      border: "1px solid #2a2d35", borderRadius: 8, color: "#e8eaed",
                      fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none",
                      marginBottom: stampDutyCustom ? 8 : 0, cursor: "pointer",
                      appearance: "none", WebkitAppearance: "none",
                    }}
                  >
                    {STAMP_DUTY_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.value === null ? "custom" : String(opt.value)}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                {stampDutyCustom && (
                  <input
                    type="number" min={0} max={15} step={0.1} placeholder="Enter stamp duty %"
                    value={stampDutyPct}
                    onChange={e => setStampDutyPct(Number(e.target.value))}
                    style={{
                      width: "100%", padding: "9px 12px", background: "#13151a",
                      border: "1px solid #2a2d35", borderRadius: 8, color: "#e8eaed",
                      fontSize: 15, fontFamily: "'Space Mono', monospace", outline: "none",
                    }}
                  />
                )}
              </div>
            </Card>

            <Card>
              <SectionLabel>Growth &amp; Returns</SectionLabel>
              <Slider label="Property Appreciation" value={appreciation}
                onChange={v => { setAppreciation(v); setCity("custom"); }}
                min={0} max={15} step={0.5} suffix="% / yr" tooltip={TOOLTIPS.appreciation} />
              <Slider label="Rent Increase" value={rentIncrease}
                onChange={v => { setRentIncrease(v); setCity("custom"); }}
                min={0} max={15} step={0.5} suffix="% / yr" tooltip={TOOLTIPS.rentIncrease} />
              <Slider label="Investment Returns" value={investReturn} onChange={setInvestReturn}
                min={6} max={18} step={0.5} suffix="% / yr"
                tooltip={TOOLTIPS.invest} color="#64b4ff" />
              <Slider label="Monthly Maintenance" value={maintenance} onChange={setMaintenance}
                min={0} max={25000} step={500} format={formatINRFull}
                tooltip={TOOLTIPS.maint} />
            </Card>

            <Card>
              <SectionLabel>Tax &amp; Timeline</SectionLabel>
              <Slider label="Tax Bracket" value={taxBracket} onChange={setTaxBracket}
                min={0} max={30} step={5} suffix="%" color="#ffd93d"
                tooltip={TOOLTIPS.taxBracket} />
              <Slider label="Time Horizon" value={horizon} onChange={setHorizon}
                min={3} max={30} step={1} suffix=" years" tooltip={TOOLTIPS.horizon} />
              {/* Tax info pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {[
                  { label: "Sec 80C", tip: TOOLTIPS.sec80c },
                  { label: "Sec 24(b)", tip: TOOLTIPS.sec24b },
                ].map(({ label, tip }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", background: "rgba(255,217,61,0.06)",
                    border: "1px solid rgba(255,217,61,0.12)", borderRadius: 20,
                    fontSize: 13, color: "#ffd93d",
                  }}>
                    {label} <Tooltip text={tip} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionLabel>Savings Discipline</SectionLabel>
              <div style={{ fontSize: 15, color: "#8a8f98", marginBottom: 4, lineHeight: 1.5 }}>
                If you rent, your monthly outflow is lower than an EMI. Will you invest that difference?
              </div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 12, lineHeight: 1.5 }}>
                This is the key assumption behind "renting is smarter" — if you don't invest the savings, the math changes significantly.
              </div>
              <SegmentedControl
                value={forcedSavings}
                onChange={setForcedSavings}
                options={[
                  { label: "Yes (100%)", value: 100 },
                  { label: "Half (50%)", value: 50  },
                  { label: "Nope (0%)",  value: 0   },
                ]}
              />
              {forcedSavings < 100 && (
                <div style={{ marginTop: 10, fontSize: 13, color: "#555", fontStyle: "italic" }}>
                  {forcedSavings === 0
                    ? "Savings not invested — renting loses its biggest financial advantage."
                    : "Only 50% of monthly savings get invested."}
                </div>
              )}
            </Card>

            <HRASection isMetro={isMetro} hraInputs={hraInputs} setHraInputs={setHraInputs} />

            {/* Rent-then-Buy section */}
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => setRtbEnabled(!rtbEnabled)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", background: "#181a20", border: "1px solid #1e2028",
                borderRadius: rtbEnabled ? "12px 12px 0 0" : 12, color: rtbEnabled ? "#ff9f43" : "#8a8f98",
                fontSize: 15, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              }}>
                <span>
                  Rent-then-Buy Scenario
                  <span style={{ fontSize: 13, color: "#555", marginLeft: 6 }}>(3rd path)</span>
                </span>
                <span style={{
                  fontSize: 13, padding: "3px 8px", borderRadius: 6,
                  background: rtbEnabled ? "rgba(255,159,67,0.15)" : "#1e2028",
                  color: rtbEnabled ? "#ff9f43" : "#555", fontWeight: 700, border: "none",
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {rtbEnabled ? "ON" : "OFF"}
                </span>
              </button>
              {rtbEnabled && (
                <div style={{
                  background: "#181a20", border: "1px solid #1e2028", borderTop: "1px solid #2a2d35",
                  borderRadius: "0 0 12px 12px", padding: 16,
                }}>
                  <div style={{ fontSize: 14, color: "#555", marginBottom: 14, lineHeight: 1.65 }}>
                    Rent aggressively for <strong style={{ color: "#ff9f43" }}>{clampedSwitch} years</strong>, invest the savings, then buy the house at its appreciated price using the accumulated investment portfolio as down payment.
                  </div>
                  <Slider label="Switch to Buy at Year" value={switchYear}
                    onChange={v => setSwitchYear(Math.min(v, horizon - 1))}
                    min={1} max={Math.max(horizon - 1, 1)} step={1} suffix=" yrs"
                    color="#ff9f43" />
                  {RTB && (
                    <div style={{
                      background: "rgba(255,159,67,0.06)", border: "1px solid rgba(255,159,67,0.15)",
                      borderRadius: 8, padding: "10px 12px",
                    }}>
                      <div style={{ fontSize: 12, color: "#8a8f98", marginBottom: 4 }}>HYBRID NET WEALTH AT YEAR {horizon}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#ff9f43", fontFamily: "'Space Mono', monospace" }}>
                        {formatINR(RTB.netWealth)}
                      </div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
                        Buys at {formatINR(RTB.newPrice)} in year {clampedSwitch} · New EMI {formatINRFull(RTB.newEmi)}/mo
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => handleTabChange("verdict")} style={{
              width: "100%", padding: "15px", borderRadius: 12, border: "none",
              background: "#b8e82a", color: "#1a1d14", fontSize: 15, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: "0.02em",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)", marginTop: 8,
            }}>
              See Verdict →
            </button>
          </div>
        )}

        {/* ════════════════════════════
            TAB 2 — VERDICT
        ════════════════════════════ */}
        {module === "rvb" && activeTab === "verdict" && (
          <div>
            {/* Hero Card */}
            {(() => {
              const winner = rtbEnabled && RTB ? allWinnerLabel() : R.winner;
              const winColor = winner === "buy" ? "#c8ff32" : winner === "hybrid" ? "#ff9f43" : "#64b4ff";
              const winLabel = winner === "buy" ? "BUY" : winner === "hybrid" ? "RENT→BUY" : "RENT";
              const winGrad  = winner === "buy"
                ? "linear-gradient(135deg, rgba(200,255,50,0.07), rgba(200,255,50,0.02))"
                : winner === "hybrid"
                ? "linear-gradient(135deg, rgba(255,159,67,0.07), rgba(255,159,67,0.02))"
                : "linear-gradient(135deg, rgba(100,180,255,0.07), rgba(100,180,255,0.02))";
              const winBorder = winner === "buy"
                ? "rgba(200,255,50,0.25)" : winner === "hybrid"
                ? "rgba(255,159,67,0.25)" : "rgba(100,180,255,0.25)";
              return (
                <div className="verdict-animate" style={{
                  background: winGrad, border: `1px solid ${winBorder}`,
                  borderRadius: 16, padding: "28px 20px", textAlign: "center", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 13, fontFamily: "'Space Mono', monospace", color: "#8a8f98", letterSpacing: "0.12em", marginBottom: 8 }}>
                    AFTER {horizon} YEARS IN {cityName.toUpperCase()}
                  </div>
                  <div style={{
                    fontSize: 52, fontWeight: 900, fontFamily: "'Outfit', sans-serif",
                    color: winColor, lineHeight: 1, marginBottom: 8,
                    textShadow: `0 0 40px ${winColor}60`,
                  }}>
                    {winLabel}
                  </div>
                  <div style={{ fontSize: 14, color: "#8a8f98", marginBottom: 20 }}>
                    wins by{" "}
                    <strong style={{ color: "#e8eaed", fontSize: 17, fontFamily: "'Space Mono', monospace" }}>
                      {formatINR(animatedDiff)}
                    </strong>
                    {" "}in net wealth
                  </div>

                  {/* Wealth cards grid */}
                  <div style={{ display: "grid", gridTemplateColumns: rtbEnabled && RTB ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8, marginBottom: 16 }}>
                    <div style={{
                      background: "rgba(200,255,50,0.06)", borderRadius: 10,
                      padding: "12px 8px", border: "1px solid rgba(200,255,50,0.12)",
                    }}>
                      <div style={{ fontSize: 11, color: "#8a8f98", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>
                        🏠 BUY
                      </div>
                      <div style={{ fontSize: rtbEnabled && RTB ? 15 : 20, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#c8ff32" }}>
                        {formatINR(R.buyNetWealth)}
                      </div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>property − loan</div>
                    </div>
                    <div style={{
                      background: "rgba(100,180,255,0.06)", borderRadius: 10,
                      padding: "12px 8px", border: "1px solid rgba(100,180,255,0.12)",
                    }}>
                      <div style={{ fontSize: 11, color: "#8a8f98", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>
                        💰 RENT
                      </div>
                      <div style={{ fontSize: rtbEnabled && RTB ? 15 : 20, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#64b4ff" }}>
                        {formatINR(R.rentNetWealth)}
                      </div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>investments grown</div>
                    </div>
                    {rtbEnabled && RTB && (
                      <div style={{
                        background: "rgba(255,159,67,0.06)", borderRadius: 10,
                        padding: "12px 8px", border: "1px solid rgba(255,159,67,0.2)",
                      }}>
                        <div style={{ fontSize: 11, color: "#8a8f98", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>
                          🔄 Y{clampedSwitch}→BUY
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#ff9f43" }}>
                          {formatINR(RTB.netWealth)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Breakeven callout */}
                  <div style={{
                    background: R.breakevenYear ? "rgba(255,217,61,0.08)" : "rgba(167,139,250,0.08)",
                    border: `1px solid ${R.breakevenYear ? "rgba(255,217,61,0.2)" : "rgba(167,139,250,0.2)"}`,
                    borderRadius: 10, padding: "10px 14px",
                  }}>
                    {R.breakevenYear ? (
                      <span style={{ fontSize: 14, color: "#8a8f98" }}>
                        Buying beats renting after{" "}
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#ffd93d", fontFamily: "'Space Mono', monospace" }}>
                          Year {R.breakevenYear}
                        </span>
                        {" "}— marked on the chart ↓
                      </span>
                    ) : (
                      <span style={{ fontSize: 14, color: "#a78bfa" }}>
                        Renting wins all {horizon} years — no wealth breakeven in this scenario
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Forced savings impact callout */}
            {forcedSavings > 0 && R0 && (
              <div style={{
                background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.18)",
                borderRadius: 12, padding: "14px 16px", marginBottom: 16,
              }}>
                <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 6 }}>
                  💡 SAVINGS DISCIPLINE IMPACT
                </div>
                {R0.winner === "buy" && R.winner === "rent" ? (
                  <div style={{ fontSize: 15, color: "#8a8f98", lineHeight: 1.6 }}>
                    If you <strong style={{ color: "#ff6b6b" }}>don't invest the savings</strong>, the verdict flips —{" "}
                    <strong style={{ color: "#c8ff32" }}>Buy wins by {formatINR(R0.diff)}</strong>.
                    {" "}Your investing discipline is what makes renting the smarter choice.
                  </div>
                ) : R0.winner === "rent" && R.winner === "rent" ? (
                  <div style={{ fontSize: 15, color: "#8a8f98", lineHeight: 1.6 }}>
                    Even if you <strong style={{ color: "#ff6b6b" }}>don't invest the savings</strong>, Rent still leads —
                    though by a smaller margin: <strong style={{ color: "#64b4ff" }}>{formatINR(R0.diff)}</strong>{" "}
                    vs <strong style={{ color: "#64b4ff" }}>{formatINR(R.diff)}</strong> with full investment.
                  </div>
                ) : R0.winner === "buy" && R.winner === "buy" ? (
                  <div style={{ fontSize: 15, color: "#8a8f98", lineHeight: 1.6 }}>
                    Investing your savings ({forcedSavings}%) narrows the Buy advantage from{" "}
                    <strong style={{ color: "#c8ff32" }}>{formatINR(R0.diff)}</strong> to{" "}
                    <strong style={{ color: "#c8ff32" }}>{formatINR(R.diff)}</strong>.
                  </div>
                ) : (
                  <div style={{ fontSize: 15, color: "#8a8f98", lineHeight: 1.6 }}>
                    Investing your savings turned the verdict from Buy → Rent.
                    Without investing: Buy leads by <strong style={{ color: "#c8ff32" }}>{formatINR(R0.diff)}</strong>.
                  </div>
                )}
              </div>
            )}

            {/* Net Wealth Chart */}
            <Card>
              <SectionLabel>Net Wealth Over Time</SectionLabel>
              <WealthChart
                buyWealth={R.buyWealthArr}
                rentWealth={R.rentWealthArr}
                hybridWealth={RTB?.wealthArr}
                horizon={horizon}
                breakevenYear={R.breakevenYear}
              />
              <div style={{ display: "flex", gap: 14, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 14, height: 3, background: "#c8ff32", borderRadius: 2 }} />
                  <span style={{ fontSize: 13, color: "#8a8f98" }}>Buy</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 14, height: 3, background: "#64b4ff", borderRadius: 2 }} />
                  <span style={{ fontSize: 13, color: "#8a8f98" }}>Rent + Invest</span>
                </div>
                {RTB && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 14, height: 3, background: "#ff9f43", borderRadius: 2 }} />
                    <span style={{ fontSize: 13, color: "#8a8f98" }}>Rent→Buy (Y{clampedSwitch})</span>
                  </div>
                )}
                {R.breakevenYear && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffd93d" }} />
                    <span style={{ fontSize: 13, color: "#8a8f98" }}>Breakeven Y{R.breakevenYear}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Wealth Breakdown bars */}
            <Card>
              <SectionLabel>Net Wealth Breakdown</SectionLabel>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: "#c8ff32", marginBottom: 10, fontWeight: 700 }}>🏠 BUY</div>
                <MiniBar label="Property Value"        value={R.propValueAtHorizon} maxVal={maxWealth} color="#c8ff32" />
                <MiniBar label="Outstanding Loan"      value={R.outstandingLoan}    maxVal={maxWealth} color="#ff6b6b" />
                <MiniBar label="Tax Saved (80C + 24b)" value={R.totalTaxSaved}      maxVal={maxWealth} color="#ffd93d" />
              </div>
              <div style={{ height: 1, background: "#1e2028", margin: "14px 0" }} />
              <div style={{ marginBottom: RTB ? 14 : 0 }}>
                <div style={{ fontSize: 13, color: "#64b4ff", marginBottom: 10, fontWeight: 700 }}>💰 RENT + INVEST</div>
                <MiniBar label="Down Payment Invested"    value={R.downPaymentCorpus} maxVal={maxWealth} color="#64b4ff" />
                <MiniBar label="Monthly Savings Invested" value={R.savingsCorpus}      maxVal={maxWealth} color="#a78bfa" />
                <MiniBar label="Total Rent Paid"          value={R.totalRentPaid}      maxVal={maxWealth} color="#ff6b6b" />
                {hraExemptionAnnual > 0 && (
                  <MiniBar label="HRA Tax Saved" value={R.totalHraTaxSaved} maxVal={maxWealth} color="#ffd93d" />
                )}
              </div>
              {RTB && (
                <>
                  <div style={{ height: 1, background: "#1e2028", margin: "14px 0" }} />
                  <div>
                    <div style={{ fontSize: 13, color: "#ff9f43", marginBottom: 10, fontWeight: 700 }}>🔄 RENT-THEN-BUY (switches Y{clampedSwitch})</div>
                    <MiniBar label={`Portfolio at Year ${clampedSwitch}`} value={RTB.corpusAtSwitch}    maxVal={maxWealth} color="#ff9f43" />
                    <MiniBar label="Used as Down Payment"              value={RTB.usedFromCorpus}    maxVal={maxWealth} color="#ffd93d" />
                    <MiniBar label="Total Rent Paid (phase 1)"         value={RTB.totalRentPaidRTB}  maxVal={maxWealth} color="#ff6b6b" />
                  </div>
                </>
              )}
            </Card>

            {/* Key Numbers */}
            <Card>
              <SectionLabel>Key Numbers</SectionLabel>
              <KeyRow label="Monthly EMI"                        value={formatINRFull(R.emi)} />
              <KeyRow label="Loan Amount"                        value={formatINR(R.loanAmount)} />
              <KeyRow label={`Stamp Duty (${stampDutyPct}%)`}   value={formatINR(R.stampDutyCost)} />
              <KeyRow label="Registration (1%)"                  value={formatINR(R.registrationCost)} />
              <KeyRow label={`Property Value (Yr ${horizon})`}  value={formatINR(R.propValueAtHorizon)} />
              <KeyRow label={`Total Rent Paid (${horizon} yrs)`} value={formatINR(R.totalRentPaid)} />
              <KeyRow label={`Total EMI Paid (${horizon} yrs)`} value={formatINR(R.totalEmiPaid)} />
              <KeyRow label="Total Tax Saved (80C + 24b)"       value={formatINR(R.totalTaxSaved)} highlight="#ffd93d" />
              {hraExemptionAnnual > 0 && (
                <KeyRow label="Annual HRA Exemption"            value={formatINR(hraExemptionAnnual)} highlight="#ffd93d" />
              )}
              {RTB && (
                <>
                  <KeyRow label={`RTB: Buys at (Yr ${clampedSwitch})`} value={formatINR(RTB.newPrice)} highlight="#ff9f43" />
                  <KeyRow label="RTB: New Loan"                         value={formatINR(RTB.newLoanAmount)} highlight="#ff9f43" />
                  <KeyRow label="RTB: New EMI"                          value={formatINRFull(RTB.newEmi)} highlight="#ff9f43" />
                </>
              )}
              <KeyRow last label="Savings Invested" value={`${forcedSavings}% of savings`} />
            </Card>

            <button onClick={() => handleTabChange("breakdown")} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              border: "1px solid #2a2d35", background: "transparent", color: "#8a8f98",
              fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>
              See Year-by-Year Breakdown →
            </button>
          </div>
        )}

        {/* ════════════════════════════
            TAB 3 — BREAKDOWN
        ════════════════════════════ */}
        {module === "rvb" && activeTab === "breakdown" && (
          <div>
            <Card>
              <SectionLabel>Cumulative Cost Over Time</SectionLabel>
              <CostChart
                yearlyCumBuy={R.yearlyCumBuy}
                yearlyCumRent={R.yearlyCumRent}
                yearlyCumHybrid={RTB?.yearlyCum}
                horizon={horizon}
                costCrossoverYear={R.costCrossoverYear}
              />
              {R.costCrossoverYear && (
                <div style={{
                  marginTop: 10, padding: "8px 12px",
                  background: "rgba(255,217,61,0.06)", border: "1px solid rgba(255,217,61,0.15)",
                  borderRadius: 8, fontSize: 13, color: "#8a8f98",
                }}>
                  ⚡ Cumulative rent paid exceeds buy costs after{" "}
                  <strong style={{ color: "#ffd93d" }}>Year {R.costCrossoverYear}</strong>
                </div>
              )}
              <div style={{ display: "flex", gap: 16, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 14, height: 3, background: "#c8ff32", borderRadius: 2 }} />
                  <span style={{ fontSize: 13, color: "#8a8f98" }}>Buy (EMI + Maint − Tax)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 14, height: 3, background: "#64b4ff", borderRadius: 2 }} />
                  <span style={{ fontSize: 13, color: "#8a8f98" }}>Rent paid</span>
                </div>
                {RTB && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 14, height: 3, background: "#ff9f43", borderRadius: 2 }} />
                    <span style={{ fontSize: 13, color: "#8a8f98" }}>Rent→Buy</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Year-by-Year Table */}
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "16px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Year-by-Year Net Wealth
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#555" }}>🏠 Buy ahead</span>
                  <span style={{ fontSize: 12, color: "#555" }}>💰 Rent ahead</span>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e2028" }}>
                      {["Yr", "Buy", "Rent", ...(RTB ? ["R→B"] : []), ""].map((h, i) => (
                        <th key={i} style={{
                          padding: "8px 10px", textAlign: "right",
                          color: "#555", fontFamily: "'Space Mono', monospace",
                          fontSize: 12, fontWeight: 400, whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {R.buyWealthArr.map((bw, i) => {
                      const rw = R.rentWealthArr[i];
                      const hw = RTB?.wealthArr[i];
                      const vals = { buy: bw, rent: rw, ...(hw !== undefined ? { hybrid: hw } : {}) };
                      const leader = Object.entries(vals).sort((a, b) => b[1] - a[1])[0][0];
                      const isBreak = R.breakevenYear === i + 1;
                      const isSwitch = rtbEnabled && clampedSwitch === i + 1;
                      return (
                        <tr key={i} style={{
                          borderBottom: "1px solid #1a1c22",
                          background: isBreak ? "rgba(255,217,61,0.04)" : isSwitch ? "rgba(255,159,67,0.04)" : "transparent",
                        }}>
                          <td style={{ padding: "8px 10px", textAlign: "right", color: "#8a8f98", fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
                            {isBreak ? "⚡" : isSwitch ? "🔄" : ""}{i + 1}
                          </td>
                          <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono', monospace", color: "#c8ff32", fontSize: 13 }}>
                            {formatINR(bw)}
                          </td>
                          <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono', monospace", color: "#64b4ff", fontSize: 13 }}>
                            {formatINR(rw)}
                          </td>
                          {RTB && (
                            <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono', monospace", color: "#ff9f43", fontSize: 13 }}>
                              {hw !== undefined ? formatINR(hw) : "—"}
                            </td>
                          )}
                          <td style={{ padding: "8px 10px", textAlign: "right", fontSize: 15 }}>
                            {leader === "buy" ? "🏠" : leader === "hybrid" ? "🔄" : "💰"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Assumptions */}
            <Card>
              <SectionLabel>Assumptions &amp; Limitations</SectionLabel>
              <div style={{ fontSize: 14, color: "#555", lineHeight: 2 }}>
                <div>• Stamp duty: {stampDutyPct}% + Registration: 1% (upfront, included in buying cost)</div>
                <div>• Sec 80C deduction capped at ₹1,50,000 on annual principal repayment</div>
                <div>• Sec 24(b) deduction capped at ₹2,00,000 on annual home loan interest</div>
                <div>• Monthly maintenance grows at 5% per annum</div>
                <div>• Down payment + buying costs invested from day 1 in rent scenario</div>
                <div>• Monthly savings ({forcedSavings}% invested) = EMI + maintenance − rent</div>
                <div>• No capital gains tax on property sale (simplified)</div>
                <div>• No LTCG tax on equity/MF investments (simplified)</div>
                <div>• HRA exemption: min(actual HRA, rent−10% basic, {isMetro ? "50%" : "40%"} of basic)</div>
                <div>• Rent-then-Buy: at switch year, investment portfolio used as down payment; new loan on appreciated price</div>
                <div>• Loan uses reducing balance (standard EMI) method</div>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════
            AFFORDABILITY — TAB 1: INCOME & SAVINGS
        ════════════════════════════════════════════ */}
        {module === "affordability" && afActiveTab === "income" && (
          <div>
            <Card>
              <SectionLabel>Income &amp; Obligations</SectionLabel>
              <Slider label="Monthly Take-Home Income" value={afMonthlyIncome} onChange={setAfMonthlyIncome}
                min={30000} max={1000000} step={5000} format={formatINR} color="#ffd93d"
                tooltip="Your monthly in-hand (post-tax) salary. This is what hits your bank account each month." />
              <Slider label="Existing EMIs" value={afExistingEMIs} onChange={setAfExistingEMIs}
                min={0} max={200000} step={1000} format={formatINR} color="#ffd93d"
                tooltip="Total of all existing loan EMIs you pay today (car, personal loan, etc.). Lenders allow up to 40% of income for all EMIs combined — this is called FOIR." />
              <Slider label="Current Monthly Rent" value={afCurrentRent} onChange={setAfCurrentRent}
                min={0} max={150000} step={1000} format={formatINR} color="#ffd93d"
                tooltip="What you pay as rent right now. After buying, this stops — but your EMI will likely be higher." />
            </Card>

            <Card>
              <SectionLabel>Savings Available</SectionLabel>
              <Slider label="Savings Ready to Deploy" value={afCurrentSavings} onChange={setAfCurrentSavings}
                min={0} max={10000000} step={50000} format={formatINR} color="#ffd93d"
                tooltip="Total liquid savings — bank accounts, FDs, liquid funds — that you can use for the down payment and buying costs right now." />
            </Card>

            <Card>
              <SectionLabel>Loan Parameters</SectionLabel>
              <Slider label="Down Payment" value={downPaymentPct} onChange={setDownPaymentPct}
                min={10} max={50} step={5} suffix="%" tooltip={TOOLTIPS.downPayment} color="#ffd93d" />
              <Slider label="Loan Tenure" value={loanTenure} onChange={setLoanTenure}
                min={5} max={30} step={1} suffix=" yrs" tooltip={TOOLTIPS.tenure} color="#ffd93d" />
              <Slider label="Home Loan Rate" value={loanRate} onChange={setLoanRate}
                min={6} max={12} step={0.1} suffix="%" color="#ffd93d" />
            </Card>

            <button onClick={() => afHandleTabChange("budget")} style={{
              width: "100%", padding: "14px 0", borderRadius: 12, marginTop: 4,
              background: "linear-gradient(135deg, #ffd93d, #ffb700)",
              border: "none", color: "#13151a",
              fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>
              See My Budget →
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════
            AFFORDABILITY — TAB 2: YOUR BUDGET
        ════════════════════════════════════════════ */}
        {module === "affordability" && afActiveTab === "budget" && (
          <div>
            {/* Verdict */}
            <div className="verdict-animate" style={{
              textAlign: "center", padding: "28px 20px", borderRadius: 16, marginBottom: 20,
              background: AF.verdict === "YES" ? "rgba(200,255,50,0.06)" : AF.verdict === "STRETCH" ? "rgba(255,217,61,0.06)" : "rgba(255,80,80,0.06)",
              border: `1px solid ${AF.verdict === "YES" ? "rgba(200,255,50,0.25)" : AF.verdict === "STRETCH" ? "rgba(255,217,61,0.25)" : "rgba(255,80,80,0.25)"}`,
            }}>
              <div style={{
                fontSize: 42, fontWeight: 900, fontFamily: "'Outfit', sans-serif",
                color: AF.verdict === "YES" ? "#c8ff32" : AF.verdict === "STRETCH" ? "#ffd93d" : "#ff5050",
              }}>
                {AF.verdict === "YES" ? "✓ YES" : AF.verdict === "STRETCH" ? "⚡ STRETCH" : "✗ NOT YET"}
              </div>
              <div style={{ fontSize: 16, color: "#8a8f98", marginTop: 8 }}>
                {AF.verdict === "YES"
                  ? "You have enough saved to buy comfortably."
                  : AF.verdict === "STRETCH"
                  ? "You're close — a bit more savings and you're there."
                  : "You need to build more savings before buying."}
              </div>
            </div>

            {/* Budget cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#1a1c22", borderRadius: 12, padding: "16px 14px", border: "1px solid #2a2d35" }}>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 6, fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>MAX BUDGET</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>{formatINR(AF.maxBudget)}</div>
                <div style={{ fontSize: 14, color: "#8a8f98", marginTop: 6 }}>EMI ≈ {formatINR(AF.maxEmi)}/mo</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>40% FOIR</div>
              </div>
              <div style={{ background: "#1a1c22", borderRadius: 12, padding: "16px 14px", border: "1px solid #ffd93d33" }}>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 6, fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>COMFORTABLE</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#ffd93d", fontFamily: "'Space Mono', monospace" }}>{formatINR(AF.comfortBudget)}</div>
                <div style={{ fontSize: 14, color: "#8a8f98", marginTop: 6 }}>EMI ≈ {formatINR(AF.comfortEmi)}/mo</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>30% FOIR</div>
              </div>
            </div>

            {/* EMI gauge */}
            <Card>
              <SectionLabel>EMI as % of Income</SectionLabel>
              {[
                { label: "Max budget EMI", emi: AF.maxEmi, color: AF.maxEmi / afMonthlyIncome > 0.45 ? "#ff5050" : "#c8ff32" },
                { label: "Comfortable EMI", emi: AF.comfortEmi, color: "#ffd93d" },
              ].map(({ label, emi, color }) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 15 }}>
                    <span style={{ color: "#8a8f98" }}>{label}</span>
                    <span style={{ color, fontFamily: "'Space Mono', monospace" }}>
                      {Math.round(emi / afMonthlyIncome * 100)}%
                    </span>
                  </div>
                  <div style={{ height: 8, background: "#1e2028", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4, background: color, transition: "width 0.5s ease",
                      width: `${Math.min(100, emi / afMonthlyIncome * 100)}%`,
                    }} />
                  </div>
                </div>
              ))}
            </Card>

            {/* Savings readiness */}
            <Card>
              <SectionLabel>Savings Readiness</SectionLabel>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 8 }}>
                <span style={{ color: "#8a8f98" }}>You have</span>
                <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>{formatINR(afCurrentSavings)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 12 }}>
                <span style={{ color: "#8a8f98" }}>Needed upfront (DP + stamp duty + reg)</span>
                <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>{formatINR(AF.maxUpfront)}</span>
              </div>
              <div style={{ height: 8, background: "#1e2028", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                <div style={{
                  height: "100%", borderRadius: 4, transition: "width 0.5s ease",
                  width: `${AF.savingsFill * 100}%`,
                  background: AF.verdict === "YES" ? "#c8ff32" : AF.verdict === "STRETCH" ? "#ffd93d" : "#ff5050",
                }} />
              </div>
              {AF.savingsGap > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "#ff5050" }}>Gap remaining</span>
                  <span style={{ color: "#ff5050", fontFamily: "'Space Mono', monospace" }}>−{formatINR(AF.savingsGap)}</span>
                </div>
              )}
            </Card>

            {/* Timeline to readiness */}
            {AF.verdict !== "YES" && AF.monthsToTarget > 0 && (
              <Card>
                <SectionLabel>Timeline to Readiness</SectionLabel>
                <div style={{ fontSize: 15, color: "#8a8f98", lineHeight: 1.9 }}>
                  If you save ~<span style={{ color: "#ffd93d", fontWeight: 700 }}>{formatINR(Math.round(AF.monthlySavingsRate))}/month</span> toward your goal, you could be ready in{" "}
                  <span style={{ color: "#ffd93d", fontWeight: 700 }}>
                    {AF.monthsToTarget >= 12
                      ? `${Math.ceil(AF.monthsToTarget / 12)} yr${Math.ceil(AF.monthsToTarget / 12) > 1 ? "s" : ""}`
                      : `${AF.monthsToTarget} months`}
                  </span>.
                </div>
              </Card>
            )}

            {/* Monthly impact */}
            <Card>
              <SectionLabel>Monthly Cash Flow Impact</SectionLabel>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                  <span style={{ color: "#8a8f98" }}>Current rent</span>
                  <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>−{formatINR(afCurrentRent)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                  <span style={{ color: "#8a8f98" }}>Max budget EMI</span>
                  <span style={{ color: AF.maxEmi > afCurrentRent ? "#ff9966" : "#c8ff32", fontFamily: "'Space Mono', monospace" }}>−{formatINR(AF.maxEmi)}</span>
                </div>
                <div style={{ height: 1, background: "#2a2d35" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                  <span style={{ color: "#8a8f98" }}>Monthly difference</span>
                  <span style={{
                    fontFamily: "'Space Mono', monospace", fontWeight: 700,
                    color: AF.maxEmi > afCurrentRent ? "#ff5050" : "#c8ff32",
                  }}>
                    {AF.maxEmi > afCurrentRent
                      ? `+${formatINR(AF.maxEmi - afCurrentRent)} more/mo`
                      : `${formatINR(afCurrentRent - AF.maxEmi)} saved/mo`}
                  </span>
                </div>
              </div>
            </Card>

            <button onClick={() => afHandleTabChange("buy")} style={{
              width: "100%", padding: "14px 0", borderRadius: 12, marginTop: 4,
              background: "linear-gradient(135deg, #ffd93d, #ffb700)",
              border: "none", color: "#13151a",
              fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>
              What Can I Buy? →
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════
            AFFORDABILITY — TAB 3: WHAT CAN YOU BUY
        ════════════════════════════════════════════ */}
        {module === "affordability" && afActiveTab === "buy" && (
          <div>
            {/* Max budget hero */}
            <div style={{
              textAlign: "center", padding: "22px 20px", marginBottom: 24,
              background: "rgba(255,217,61,0.07)", border: "1px solid rgba(255,217,61,0.25)",
              borderRadius: 16,
            }}>
              <div style={{ fontSize: 13, color: "#8a8f98", marginBottom: 8, fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
                YOUR MAX BUDGET IN {cityName.toUpperCase()}
              </div>
              <div style={{
                fontSize: 40, fontWeight: 900, fontFamily: "'Outfit', sans-serif",
                color: "#ffd93d", lineHeight: 1,
              }}>
                {formatINR(AF.maxBudget)}
              </div>
              <div style={{ fontSize: 13, color: "#8a8f98", marginTop: 8 }}>
                Comfortable: <span style={{ color: "#e8eaed", fontWeight: 600 }}>{formatINR(AF.comfortBudget)}</span>
              </div>
            </div>

            {AF.cityTypes.map((band, i) => {
              const isMatch = i === AF.matchIndex;
              return (
                <div key={i} style={{
                  background: isMatch ? "rgba(255,217,61,0.07)" : "#1a1c22",
                  border: `1px solid ${isMatch ? "#ffd93d" : "#2a2d35"}`,
                  borderRadius: 16, padding: "16px 20px", marginBottom: 12,
                  position: "relative", transition: "all 0.2s",
                }}>
                  {isMatch && (
                    <div style={{
                      position: "absolute", top: -10, left: 20,
                      background: "#ffd93d", color: "#13151a",
                      fontSize: 11, fontWeight: 700, padding: "2px 10px",
                      borderRadius: 20, fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em",
                    }}>
                      YOUR RANGE
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: isMatch ? "#ffd93d" : "#e8eaed" }}>
                      {band.type}
                    </div>
                    <div style={{
                      fontSize: 13, fontFamily: "'Space Mono', monospace",
                      color: isMatch ? "#ffd93d" : "#555",
                      textAlign: "right", flexShrink: 0, marginLeft: 12,
                    }}>
                      {band.label}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 14, lineHeight: 1.8,
                    color: isMatch ? "#e8c84a" : "#6a6f7a",
                    marginBottom: 8,
                  }}>
                    {band.locality}
                  </div>
                  <div style={{ fontSize: 12, color: "#555" }}>{band.size}</div>
                </div>
              );
            })}

            <button onClick={() => {
              setPropertyPrice(Math.round(AF.maxBudget / 500000) * 500000);
              setModule("rvb");
              setActiveTab("inputs");
              setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
            }} style={{
              width: "100%", padding: "14px 0", borderRadius: 12, marginTop: 8,
              background: "linear-gradient(135deg, #c8ff32, #a8df20)",
              border: "none", color: "#13151a",
              fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>
              Compare on Rent vs Buy →
            </button>
            <div style={{ textAlign: "center", marginTop: 8, fontSize: 13, color: "#555" }}>
              Sets your max budget as the property price in Rent vs Buy
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER DISCLAIMER ── */}
      <div style={{
        padding: "16px 24px", borderTop: "1px solid #1e2028",
        textAlign: "center", fontSize: 12, color: "#555",
        fontFamily: "'Space Mono', monospace", lineHeight: 1.8,
      }}>
        <div>For self-occupied residential homes only · FY 2025–26 tax laws · Old tax regime (80C + 24b applicable)</div>
        <div>For informational purposes only — not financial advice. Consult a qualified financial advisor.</div>
      </div>
    </div>
  );
}
