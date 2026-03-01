# Rent vs Buy Calculator — India Edition

A financial calculator that simulates two parallel financial lives — one where you buy a home, one where you rent and invest — and gives a clear, honest verdict over your chosen time horizon.

Built for Indians who want data, not opinions.

---

## What it does

Most people can't mentally compute compound interest, opportunity cost, and tax benefits simultaneously. This tool does that math and presents it as a story, not a spreadsheet.

You enter your city, property price, rent, and a few financial assumptions. The calculator runs both scenarios year by year and tells you which one leaves you wealthier — and by how much.

---

## Features

### Core calculation
- **Buy scenario** — EMI payments, property appreciation, outstanding loan, tax savings under Section 80C and 24(b)
- **Rent + Invest scenario** — down payment invested from day 1, monthly savings invested at your chosen return rate
- **Net wealth comparison** — property value minus remaining loan vs total investment portfolio

### India-specific
- City presets for Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad with realistic local defaults
- Section 80C deduction (up to ₹1.5L/year on principal repayment)
- Section 24(b) deduction (up to ₹2L/year on home loan interest)
- Section 10(13A) HRA exemption for salaried employees (metro/non-metro split)
- State-specific stamp duty rates with manual override
- Based on FY 2025–26 tax laws, old tax regime

### Key insights
- **Breakeven year** — the exact year buying starts beating renting in net wealth
- **Forced savings toggle** — what happens if you don't invest the monthly savings (the verdict often flips)
- **Rent-then-Buy hybrid** — a third scenario where you rent for N years, invest aggressively, then buy at the appreciated price using your portfolio as down payment
- **Savings discipline impact** — shows how much your investing behaviour changes the outcome

### UX
- All inputs via sliders — no typing required
- Animated verdict reveal with count-up animation
- Share any scenario via URL — all inputs encoded in the link
- Tooltips on every input explaining what it means and why it matters
- Year-by-year breakdown table and SVG charts (no chart libraries)

---

## Assumptions

- Stamp duty + registration costs paid upfront and factored into buying cost
- Monthly maintenance for buyers grows at 5% per annum
- Down payment opportunity cost: the down payment amount is assumed to be invested from day 1 in the rent scenario
- No capital gains tax on property sale (simplified)
- No LTCG tax on equity/MF investments (simplified)
- Self-occupied property (not a rental yield scenario)
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
- Compare two scenarios side by side
- LTCG/STCG tax on investment returns (post-tax view)
- GST toggle for under-construction properties
- Pre-payment scenarios
- Inflation-adjusted real returns view
