import { useState, useMemo, useEffect } from "react";

const CITIES = {
  mumbai: { name: "Mumbai", avgRent: 35000, avgPrice: 15000000, appreciation: 4.5, rentIncrease: 7 },
  delhi: { name: "Delhi NCR", avgRent: 25000, avgPrice: 10000000, appreciation: 5.0, rentIncrease: 6 },
  bangalore: { name: "Bengaluru", avgRent: 28000, avgPrice: 9500000, appreciation: 6.5, rentIncrease: 8 },
  chennai: { name: "Chennai", avgRent: 18000, avgPrice: 7500000, appreciation: 5.0, rentIncrease: 6 },
  hyderabad: { name: "Hyderabad", avgRent: 20000, avgPrice: 8000000, appreciation: 7.0, rentIncrease: 7 },
  pune: { name: "Pune", avgRent: 20000, avgPrice: 8500000, appreciation: 5.5, rentIncrease: 6 },
  kolkata: { name: "Kolkata", avgRent: 15000, avgPrice: 6000000, appreciation: 3.5, rentIncrease: 5 },
  ahmedabad: { name: "Ahmedabad", avgRent: 14000, avgPrice: 5500000, appreciation: 5.0, rentIncrease: 5 },
  custom: { name: "Custom", avgRent: 20000, avgPrice: 8000000, appreciation: 5.0, rentIncrease: 6 },
};

const formatINR = (num) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${Math.round(num)}`;
};

const formatINRFull = (num) => {
  return "₹" + Math.round(num).toLocaleString("en-IN");
};

function Slider({ label, value, onChange, min, max, step, format, suffix, info }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <label style={{ fontSize: 13, color: "#8a8f98", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em" }}>
          {label}
          {info && <span style={{ marginLeft: 6, color: "#555", fontSize: 11, fontStyle: "italic" }}>{info}</span>}
        </label>
        <span style={{
          fontSize: 15, fontWeight: 600, color: "#e8eaed",
          fontFamily: "'Space Mono', monospace",
        }}>
          {format ? format(value) : value}{suffix || ""}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: 6, appearance: "none", borderRadius: 3,
          background: `linear-gradient(to right, #c8ff32 0%, #c8ff32 ${pct}%, #2a2d35 ${pct}%, #2a2d35 100%)`,
          cursor: "pointer", outline: "none",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: "#555", fontFamily: "'Space Mono', monospace" }}>
          {format ? format(min) : min}{suffix || ""}
        </span>
        <span style={{ fontSize: 10, color: "#555", fontFamily: "'Space Mono', monospace" }}>
          {format ? format(max) : max}{suffix || ""}
        </span>
      </div>
    </div>
  );
}

function MiniBar({ label, value, maxVal, color, format }) {
  const pct = Math.min((value / maxVal) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "#8a8f98", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
        <span style={{ fontSize: 12, color: "#e8eaed", fontFamily: "'Space Mono', monospace", fontWeight: 600 }}>
          {format ? format(value) : formatINR(value)}
        </span>
      </div>
      <div style={{ height: 4, background: "#1e2028", borderRadius: 2 }}>
        <div style={{ height: 4, width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export default function RentVsBuyCalculator() {
  const [city, setCity] = useState("chennai");
  const [propertyPrice, setPropertyPrice] = useState(CITIES.chennai.avgPrice);
  const [monthlyRent, setMonthlyRent] = useState(CITIES.chennai.avgRent);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [appreciation, setAppreciation] = useState(CITIES.chennai.appreciation);
  const [rentIncrease, setRentIncrease] = useState(CITIES.chennai.rentIncrease);
  const [maintenance, setMaintenance] = useState(5000);
  const [investReturn, setInvestReturn] = useState(12);
  const [horizon, setHorizon] = useState(10);
  const [taxBracket, setTaxBracket] = useState(30);
  const [activeTab, setActiveTab] = useState("inputs");

  useEffect(() => {
    if (city !== "custom") {
      const c = CITIES[city];
      setPropertyPrice(c.avgPrice);
      setMonthlyRent(c.avgRent);
      setAppreciation(c.appreciation);
      setRentIncrease(c.rentIncrease);
    }
  }, [city]);

  const results = useMemo(() => {
    const downPayment = propertyPrice * (downPaymentPct / 100);
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = loanRate / 100 / 12;
    const totalMonths = loanTenure * 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const stampDuty = propertyPrice * 0.07;
    const registration = propertyPrice * 0.01;
    const buyingCosts = stampDuty + registration;

    let totalRentPaid = 0;
    let totalEmiPaid = 0;
    let totalMaintenancePaid = 0;
    let totalTaxSaved = 0;
    let rentInvestmentCorpus = 0;
    let currentRent = monthlyRent;

    const yearlyRent = [];
    const yearlyBuy = [];
    const yearlyCumRent = [];
    const yearlyCumBuy = [];

    let cumRent = 0;
    let cumBuy = buyingCosts;

    for (let year = 1; year <= horizon; year++) {
      const yearRent = currentRent * 12;
      const yearEmi = year <= loanTenure ? emi * 12 : 0;
      const yearMaintenance = maintenance * 12 * Math.pow(1.05, year - 1);

      // Section 80C - principal repayment deduction up to 1.5L
      let principalPaid = 0;
      let interestPaid = 0;
      if (year <= loanTenure) {
        let balance = loanAmount;
        for (let m = 1; m < (year - 1) * 12 + 1; m++) {
          const intPart = balance * monthlyRate;
          balance -= (emi - intPart);
        }
        for (let m = 0; m < 12; m++) {
          const intPart = balance * monthlyRate;
          interestPaid += intPart;
          principalPaid += (emi - intPart);
          balance -= (emi - intPart);
        }
      }

      // Section 24 - interest deduction up to 2L for self-occupied
      const sec24Deduction = Math.min(interestPaid, 200000);
      const sec80CDeduction = Math.min(principalPaid, 150000);
      const totalDeduction = sec24Deduction + sec80CDeduction;
      const taxSaved = totalDeduction * (taxBracket / 100);

      totalTaxSaved += taxSaved;
      totalRentPaid += yearRent;
      totalEmiPaid += yearEmi;
      totalMaintenancePaid += yearMaintenance;

      // Money saved if renting (EMI + maintenance - rent), invested
      const monthlySavings = year <= loanTenure ? (emi + maintenance * Math.pow(1.05, year - 1) - currentRent) : (maintenance * Math.pow(1.05, year - 1) - currentRent);
      if (monthlySavings > 0) {
        for (let m = 0; m < 12; m++) {
          rentInvestmentCorpus = rentInvestmentCorpus * (1 + investReturn / 100 / 12) + monthlySavings;
        }
      } else {
        for (let m = 0; m < 12; m++) {
          rentInvestmentCorpus = rentInvestmentCorpus * (1 + investReturn / 100 / 12);
        }
      }

      // Down payment opportunity cost
      const downPaymentGrowth = (downPayment + buyingCosts) * Math.pow(1 + investReturn / 100, year);

      const yearCostRent = yearRent;
      const yearCostBuy = yearEmi + yearMaintenance - taxSaved;

      cumRent += yearCostRent;
      cumBuy += yearCostBuy;

      yearlyRent.push(yearCostRent);
      yearlyBuy.push(yearCostBuy);
      yearlyCumRent.push(cumRent);
      yearlyCumBuy.push(cumBuy);

      currentRent *= (1 + rentIncrease / 100);
    }

    const propertyValue = propertyPrice * Math.pow(1 + appreciation / 100, horizon);
    const equity = propertyValue;
    const downPaymentOppCost = (downPayment + buyingCosts) * Math.pow(1 + investReturn / 100, horizon);

    // Net wealth: Buy
    let remainingLoan = loanAmount;
    for (let m = 0; m < Math.min(horizon, loanTenure) * 12; m++) {
      const intPart = remainingLoan * monthlyRate;
      remainingLoan -= (emi - intPart);
    }
    remainingLoan = Math.max(0, remainingLoan);

    const buyNetWealth = propertyValue - remainingLoan;
    const rentNetWealth = downPaymentOppCost + rentInvestmentCorpus;
    const winner = buyNetWealth > rentNetWealth ? "buy" : "rent";
    const diff = Math.abs(buyNetWealth - rentNetWealth);

    return {
      emi, downPayment, loanAmount, buyingCosts,
      totalRentPaid, totalEmiPaid, totalMaintenancePaid, totalTaxSaved,
      propertyValue, equity, remainingLoan,
      buyNetWealth, rentNetWealth, winner, diff,
      downPaymentOppCost, rentInvestmentCorpus,
      yearlyRent, yearlyBuy, yearlyCumRent, yearlyCumBuy,
      stampDuty, registration,
    };
  }, [propertyPrice, monthlyRent, downPaymentPct, loanRate, loanTenure, appreciation, rentIncrease, maintenance, investReturn, horizon, taxBracket]);

  const maxCum = Math.max(...results.yearlyCumRent, ...results.yearlyCumBuy);
  const maxWealth = Math.max(results.buyNetWealth, results.rentNetWealth);
  const chartH = 180;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#13151a",
      color: "#e8eaed",
      fontFamily: "'DM Sans', sans-serif",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Outfit:wght@700;800;900&display=swap');
        input[type="range"]::-webkit-slider-thumb {
          appearance: none; width: 16px; height: 16px; border-radius: 50%;
          background: #c8ff32; cursor: pointer; border: 2px solid #13151a;
          box-shadow: 0 0 8px rgba(200,255,50,0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: #c8ff32; cursor: pointer; border: 2px solid #13151a;
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "28px 24px 20px",
        borderBottom: "1px solid #1e2028",
        background: "linear-gradient(180deg, #181a20 0%, #13151a 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#c8ff32",
            boxShadow: "0 0 12px rgba(200,255,50,0.5)",
          }} />
          <span style={{
            fontSize: 11, fontFamily: "'Space Mono', monospace",
            color: "#c8ff32", letterSpacing: "0.15em", textTransform: "uppercase",
          }}>Financial Calculator</span>
        </div>
        <h1 style={{
          fontSize: 28, fontWeight: 900, margin: "8px 0 4px",
          fontFamily: "'Outfit', sans-serif",
          background: "linear-gradient(135deg, #e8eaed 0%, #8a8f98 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.1,
        }}>
          Rent vs Buy
        </h1>
        <p style={{ fontSize: 13, color: "#555", margin: 0, fontFamily: "'Space Mono', monospace" }}>
          India Edition — 80C, 24(b), Stamp Duty & more
        </p>
      </div>

      {/* City Selector */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e2028" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(CITIES).map(([key, c]) => (
            <button key={key} onClick={() => setCity(key)} style={{
              padding: "6px 14px", borderRadius: 20, border: "1px solid",
              borderColor: city === key ? "#c8ff32" : "#2a2d35",
              background: city === key ? "rgba(200,255,50,0.08)" : "transparent",
              color: city === key ? "#c8ff32" : "#8a8f98",
              fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Tabs */}
      <div style={{
        display: "flex", borderBottom: "1px solid #1e2028",
        position: "sticky", top: 0, zIndex: 10, background: "#13151a",
      }}>
        {[
          { id: "inputs", label: "Inputs" },
          { id: "result", label: "Verdict" },
          { id: "breakdown", label: "Breakdown" },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: "12px 0", border: "none",
            borderBottom: `2px solid ${activeTab === tab.id ? "#c8ff32" : "transparent"}`,
            background: "transparent",
            color: activeTab === tab.id ? "#c8ff32" : "#555",
            fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 24px 40px" }}>

        {/* INPUTS TAB */}
        {activeTab === "inputs" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.15em", textTransform: "uppercase",
                marginBottom: 14,
              }}>
                Property & Rent
              </div>
              <Slider label="Property Price" value={propertyPrice} onChange={(v) => { setPropertyPrice(v); setCity("custom"); }}
                min={2000000} max={50000000} step={500000} format={formatINR} />
              <Slider label="Monthly Rent" value={monthlyRent} onChange={(v) => { setMonthlyRent(v); setCity("custom"); }}
                min={5000} max={200000} step={1000} format={formatINRFull} />
              <Slider label="Down Payment" value={downPaymentPct} onChange={setDownPaymentPct}
                min={10} max={50} step={5} suffix="%" />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.15em", textTransform: "uppercase",
                marginBottom: 14,
              }}>
                Loan Details
              </div>
              <Slider label="Home Loan Rate" value={loanRate} onChange={setLoanRate}
                min={6} max={12} step={0.1} suffix="%" />
              <Slider label="Loan Tenure" value={loanTenure} onChange={setLoanTenure}
                min={5} max={30} step={1} suffix=" yrs" />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.15em", textTransform: "uppercase",
                marginBottom: 14,
              }}>
                Growth & Returns
              </div>
              <Slider label="Property Appreciation" value={appreciation} onChange={(v) => { setAppreciation(v); setCity("custom"); }}
                min={0} max={15} step={0.5} suffix="% / yr" />
              <Slider label="Rent Increase" value={rentIncrease} onChange={(v) => { setRentIncrease(v); setCity("custom"); }}
                min={0} max={15} step={0.5} suffix="% / yr" />
              <Slider label="Investment Returns" value={investReturn} onChange={setInvestReturn}
                min={6} max={18} step={0.5} suffix="% / yr" info="(if you rent & invest)" />
              <Slider label="Monthly Maintenance" value={maintenance} onChange={setMaintenance}
                min={0} max={25000} step={500} format={formatINRFull} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.15em", textTransform: "uppercase",
                marginBottom: 14,
              }}>
                Tax & Timeline
              </div>
              <Slider label="Tax Bracket" value={taxBracket} onChange={setTaxBracket}
                min={0} max={30} step={5} suffix="%" info="(for 80C & 24b)" />
              <Slider label="Time Horizon" value={horizon} onChange={setHorizon}
                min={3} max={30} step={1} suffix=" years" />
            </div>

            <button onClick={() => setActiveTab("result")} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              border: "none", background: "#c8ff32", color: "#13151a",
              fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", letterSpacing: "0.02em",
            }}>
              See Verdict →
            </button>
          </div>
        )}

        {/* VERDICT TAB */}
        {activeTab === "result" && (
          <div>
            {/* Winner Card */}
            <div style={{
              background: results.winner === "buy"
                ? "linear-gradient(135deg, rgba(200,255,50,0.06) 0%, rgba(200,255,50,0.02) 100%)"
                : "linear-gradient(135deg, rgba(100,180,255,0.06) 0%, rgba(100,180,255,0.02) 100%)",
              border: `1px solid ${results.winner === "buy" ? "rgba(200,255,50,0.2)" : "rgba(100,180,255,0.2)"}`,
              borderRadius: 16, padding: "28px 24px", textAlign: "center",
              marginBottom: 24,
            }}>
              <div style={{
                fontSize: 11, fontFamily: "'Space Mono', monospace",
                color: "#8a8f98", letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: 8,
              }}>
                After {horizon} years in {CITIES[city]?.name || "your city"}
              </div>
              <div style={{
                fontSize: 42, fontWeight: 900, fontFamily: "'Outfit', sans-serif",
                color: results.winner === "buy" ? "#c8ff32" : "#64b4ff",
                lineHeight: 1, marginBottom: 6,
              }}>
                {results.winner === "buy" ? "BUY" : "RENT"}
              </div>
              <div style={{ fontSize: 14, color: "#8a8f98", marginBottom: 16 }}>
                wins by <strong style={{ color: "#e8eaed" }}>{formatINR(results.diff)}</strong> in net wealth
              </div>

              {/* Wealth comparison */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{
                  flex: 1, background: "rgba(200,255,50,0.06)", borderRadius: 12,
                  padding: "16px 12px", border: "1px solid rgba(200,255,50,0.1)",
                }}>
                  <div style={{ fontSize: 10, color: "#8a8f98", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", marginBottom: 6 }}>
                    IF YOU BUY
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#c8ff32" }}>
                    {formatINR(results.buyNetWealth)}
                  </div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>net wealth</div>
                </div>
                <div style={{
                  flex: 1, background: "rgba(100,180,255,0.06)", borderRadius: 12,
                  padding: "16px 12px", border: "1px solid rgba(100,180,255,0.1)",
                }}>
                  <div style={{ fontSize: 10, color: "#8a8f98", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", marginBottom: 6 }}>
                    IF YOU RENT
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#64b4ff" }}>
                    {formatINR(results.rentNetWealth)}
                  </div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>net wealth</div>
                </div>
              </div>
            </div>

            {/* Wealth Bar Visual */}
            <div style={{
              background: "#181a20", borderRadius: 12, padding: 20,
              border: "1px solid #1e2028", marginBottom: 24,
            }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: 16,
              }}>
                Net Wealth Breakdown
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#c8ff32", marginBottom: 8, fontWeight: 600 }}>🏠 Buy Scenario</div>
                <MiniBar label="Property Value" value={results.propertyValue} maxVal={maxWealth} color="#c8ff32" />
                <MiniBar label="Outstanding Loan" value={results.remainingLoan} maxVal={maxWealth} color="#ff6b6b" />
                <MiniBar label="Tax Saved (80C + 24b)" value={results.totalTaxSaved} maxVal={maxWealth} color="#ffd93d" />
              </div>

              <div style={{ height: 1, background: "#1e2028", margin: "16px 0" }} />

              <div>
                <div style={{ fontSize: 11, color: "#64b4ff", marginBottom: 8, fontWeight: 600 }}>💰 Rent + Invest Scenario</div>
                <MiniBar label="Down Payment Invested" value={results.downPaymentOppCost} maxVal={maxWealth} color="#64b4ff" />
                <MiniBar label="Savings Invested" value={results.rentInvestmentCorpus} maxVal={maxWealth} color="#a78bfa" />
                <MiniBar label="Total Rent Paid" value={results.totalRentPaid} maxVal={maxWealth} color="#ff6b6b" />
              </div>
            </div>

            {/* Key Numbers */}
            <div style={{
              background: "#181a20", borderRadius: 12, padding: 20,
              border: "1px solid #1e2028", marginBottom: 24,
            }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: 14,
              }}>
                Key Numbers
              </div>
              {[
                { label: "Monthly EMI", val: formatINRFull(results.emi) },
                { label: "Loan Amount", val: formatINR(results.loanAmount) },
                { label: "Stamp Duty + Registration", val: formatINR(results.buyingCosts) },
                { label: `Property Value (Yr ${horizon})`, val: formatINR(results.propertyValue) },
                { label: `Total Rent Paid (${horizon} yrs)`, val: formatINR(results.totalRentPaid) },
                { label: `Total EMI Paid (${horizon} yrs)`, val: formatINR(results.totalEmiPaid) },
                { label: "Total Tax Saved", val: formatINR(results.totalTaxSaved) },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "8px 0", borderBottom: i < 6 ? "1px solid #1e2028" : "none",
                }}>
                  <span style={{ fontSize: 12, color: "#8a8f98" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "#e8eaed" }}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => setActiveTab("breakdown")} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              border: "1px solid #2a2d35", background: "transparent", color: "#8a8f98",
              fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
            }}>
              See Year-by-Year Breakdown →
            </button>
          </div>
        )}

        {/* BREAKDOWN TAB */}
        {activeTab === "breakdown" && (
          <div>
            {/* Cumulative Cost Chart */}
            <div style={{
              background: "#181a20", borderRadius: 12, padding: 20,
              border: "1px solid #1e2028", marginBottom: 24,
            }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: 16,
              }}>
                Cumulative Cost Over Time
              </div>
              <svg viewBox={`0 0 ${horizon * 40 + 20} ${chartH + 30}`} style={{ width: "100%", display: "block" }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                  <g key={pct}>
                    <line x1="0" y1={chartH - pct * chartH} x2={horizon * 40} y2={chartH - pct * chartH}
                      stroke="#1e2028" strokeWidth="1" />
                    <text x={horizon * 40 + 4} y={chartH - pct * chartH + 4}
                      fill="#555" fontSize="8" fontFamily="Space Mono, monospace">
                      {formatINR(maxCum * pct)}
                    </text>
                  </g>
                ))}

                {/* Buy line */}
                <polyline
                  points={results.yearlyCumBuy.map((v, i) => `${(i + 1) * 40},${chartH - (v / maxCum) * chartH}`).join(" ")}
                  fill="none" stroke="#c8ff32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                />
                {/* Rent line */}
                <polyline
                  points={results.yearlyCumRent.map((v, i) => `${(i + 1) * 40},${chartH - (v / maxCum) * chartH}`).join(" ")}
                  fill="none" stroke="#64b4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="6,4"
                />

                {/* Dots */}
                {results.yearlyCumBuy.map((v, i) => (
                  <circle key={`b${i}`} cx={(i + 1) * 40} cy={chartH - (v / maxCum) * chartH}
                    r="3" fill="#c8ff32" />
                ))}
                {results.yearlyCumRent.map((v, i) => (
                  <circle key={`r${i}`} cx={(i + 1) * 40} cy={chartH - (v / maxCum) * chartH}
                    r="3" fill="#64b4ff" />
                ))}

                {/* X axis labels */}
                {results.yearlyCumRent.map((_, i) => (
                  <text key={i} x={(i + 1) * 40} y={chartH + 16} textAnchor="middle"
                    fill="#555" fontSize="8" fontFamily="Space Mono, monospace">
                    Y{i + 1}
                  </text>
                ))}
              </svg>

              <div style={{ display: "flex", gap: 20, marginTop: 12, justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 12, height: 3, background: "#c8ff32", borderRadius: 2 }} />
                  <span style={{ fontSize: 11, color: "#8a8f98" }}>Buy (EMI + Maintenance − Tax)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 12, height: 3, background: "#64b4ff", borderRadius: 2, borderTop: "1px dashed #64b4ff" }} />
                  <span style={{ fontSize: 11, color: "#8a8f98" }}>Rent</span>
                </div>
              </div>
            </div>

            {/* Year-by-year table */}
            <div style={{
              background: "#181a20", borderRadius: 12,
              border: "1px solid #1e2028", overflow: "hidden",
            }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "16px 16px 10px",
              }}>
                Year-by-Year Costs
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e2028" }}>
                      {["Yr", "Buy Cost", "Rent Cost", "Cheaper"].map((h) => (
                        <th key={h} style={{
                          padding: "8px 12px", textAlign: "right",
                          color: "#555", fontFamily: "'Space Mono', monospace",
                          fontSize: 10, fontWeight: 400,
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyRent.map((rent, i) => {
                      const buy = results.yearlyBuy[i];
                      const cheaper = buy < rent ? "buy" : "rent";
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #1a1c22" }}>
                          <td style={{ padding: "8px 12px", textAlign: "right", color: "#8a8f98", fontFamily: "'Space Mono', monospace" }}>
                            {i + 1}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'Space Mono', monospace", color: "#c8ff32" }}>
                            {formatINR(buy)}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'Space Mono', monospace", color: "#64b4ff" }}>
                            {formatINR(rent)}
                          </td>
                          <td style={{
                            padding: "8px 12px", textAlign: "right",
                            color: cheaper === "buy" ? "#c8ff32" : "#64b4ff",
                            fontWeight: 600, fontSize: 11,
                          }}>
                            {cheaper === "buy" ? "🏠" : "💰"} {cheaper}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assumptions footer */}
            <div style={{
              marginTop: 24, padding: 16, background: "#181a20",
              borderRadius: 12, border: "1px solid #1e2028",
            }}>
              <div style={{
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: "#555", letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: 10,
              }}>
                Assumptions
              </div>
              <div style={{ fontSize: 11, color: "#555", lineHeight: 1.7 }}>
                • Stamp duty: 7% + Registration: 1% of property value<br />
                • Sec 80C deduction up to ₹1.5L on principal repayment<br />
                • Sec 24(b) deduction up to ₹2L on home loan interest<br />
                • Maintenance increases at 5% annually<br />
                • Rent savings (if renting is cheaper) are invested at your chosen return rate<br />
                • Down payment opportunity cost factored for rent scenario<br />
                • No capital gains tax applied on property sale (simplified)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
