# HomeWise — Every Home Decision, One Place

India's all-in-one home buying calculator. Plan your affordability, compare renting vs buying, and make smarter property decisions.

Built for Indians who want data, not opinions.

**Live at [homewise-ind.vercel.app](https://homewise-ind.vercel.app)**

---

## What it does

Two modules, one tool:

**Affordability Calculator** — Enter your income, savings, and EMI obligations. Get your max loan eligibility, total budget, upfront cash required, and a verdict on whether you're ready to buy now, almost there, or need more time. Paired with a city-level property guide showing what your budget actually gets you.

**Rent vs Buy Calculator** — Simulates two parallel financial lives — one where you buy a home, one where you rent and invest — and gives a clear, honest verdict over your chosen time horizon. Most people can't mentally compute compound interest, opportunity cost, and tax benefits simultaneously. This tool does that math and presents it as a story, not a spreadsheet.

---

## Features

### Affordability Calculator
- **Loan eligibility** — based on FOIR (40% max, 30% comfortable) minus existing EMIs
- **Budget from loan** — property price derived from loan + down payment percentage
- **Upfront cash requirement** — down payment + stamp duty + 1% registration
- **Savings verdict** — YES / STRETCH / NOT YET with timeline to target
- **What Can You Buy** — city-level property guide across 5 budget tiers (8 cities)

### Rent vs Buy Calculator
- **Buy scenario** — EMI payments, property appreciation, outstanding loan, tax savings under Section 80C and 24(b)
- **Rent + Invest scenario** — down payment invested from day 1, monthly savings invested at your chosen return rate
- **Net wealth comparison** — property value minus remaining loan vs total investment portfolio
- **Breakeven year** — the exact year buying starts beating renting in net wealth
- **Forced savings toggle** — what happens if you don't invest the monthly savings (the verdict often flips)
- **Rent-then-Buy hybrid** — rent for N years, invest aggressively, then buy at the appreciated price
- **Year-by-year breakdown** — table and SVG charts (no chart libraries)

### India-specific
- City presets: Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad
- Section 80C deduction (up to ₹1.5L/year on principal repayment)
- Section 24(b) deduction (up to ₹2L/year on home loan interest)
- Section 10(13A) HRA exemption for salaried employees (metro/non-metro split)
- State-specific stamp duty rates with manual override
- FY 2025–26 tax laws, old tax regime

### UX
- All inputs via sliders — no typing required
- Shared state across modules (city, loan rate, tenure, down payment carry over)
- Animated verdict reveal with count-up animation
- Share any scenario via URL — all inputs encoded in the link
- Tooltips on every input explaining what it means and why it matters

---

## Assumptions

- Stamp duty + registration costs paid upfront
- Down payment opportunity cost: invested from day 1 in the rent scenario
- No capital gains tax on property sale (simplified)
- No LTCG tax on equity/MF investments (simplified)
- Self-occupied property only (not a rental yield scenario)
- Loan uses standard reducing balance EMI method

---

## Tech stack

- **React** + **Vite** (JavaScript, no TypeScript)
- **Zero UI libraries** — all components hand-built with inline styles
- **Google Fonts** — Outfit (headings), DM Sans (body), Space Mono (numbers)
- **SVG charts** — no chart libraries, rendered directly in JSX
- Client-side only — no backend, no API calls

---

## Running locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Roadmap

- PDF report download
- LTCG/STCG tax on investment returns (post-tax view)
- GST toggle for under-construction properties
- Pre-payment scenarios
- Inflation-adjusted real returns view
- Mobile layout optimisation

---

Made with ❤️ by [Hariharan Ganesh S](https://www.linkedin.com/in/hariharan-ganesh-s/)
