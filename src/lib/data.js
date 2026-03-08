export const CITIES = {
  ahmedabad: { name: "Ahmedabad", avgRent: 14000, avgPrice:  5500000, appreciation: 5.0, rentIncrease: 5,  stampDuty: 4.9, isMetro: false },
  bangalore: { name: "Bengaluru", avgRent: 28000, avgPrice:  9500000, appreciation: 6.5, rentIncrease: 8,  stampDuty: 5.6, isMetro: true  },
  chennai:   { name: "Chennai",   avgRent: 18000, avgPrice:  7500000, appreciation: 5.0, rentIncrease: 6,  stampDuty: 7,   isMetro: true  },
  delhi:     { name: "Delhi NCR", avgRent: 25000, avgPrice: 10000000, appreciation: 5.0, rentIncrease: 6,  stampDuty: 6,   isMetro: true  },
  hyderabad: { name: "Hyderabad", avgRent: 20000, avgPrice:  8000000, appreciation: 7.0, rentIncrease: 7,  stampDuty: 7.5, isMetro: false },
  kolkata:   { name: "Kolkata",   avgRent: 15000, avgPrice:  6000000, appreciation: 3.5, rentIncrease: 5,  stampDuty: 6,   isMetro: true  },
  mumbai:    { name: "Mumbai",    avgRent: 35000, avgPrice: 15000000, appreciation: 4.5, rentIncrease: 7,  stampDuty: 6,   isMetro: true  },
  pune:      { name: "Pune",      avgRent: 20000, avgPrice:  8500000, appreciation: 5.5, rentIncrease: 6,  stampDuty: 6,   isMetro: false },
  custom:    { name: "Custom",    avgRent: 20000, avgPrice:  8000000, appreciation: 5.0, rentIncrease: 6,  stampDuty: 7,   isMetro: false },
};

export const STAMP_DUTY_OPTIONS = [
  { label: "Maharashtra (6%)",  value: 6   },
  { label: "Karnataka (5.6%)",  value: 5.6 },
  { label: "Tamil Nadu (7%)",   value: 7   },
  { label: "Telangana (7.5%)",  value: 7.5 },
  { label: "Delhi (6%)",        value: 6   },
  { label: "UP (7%)",           value: 7   },
  { label: "West Bengal (6%)",  value: 6   },
  { label: "Gujarat (4.9%)",    value: 4.9 },
  { label: "Custom",            value: null },
];

export const PROPERTY_TYPES = {
  ahmedabad: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "2 BHK",          locality: "Naroda, Vastral, Odhav, Nikol, Narol, Vatva, New Ranip, Tragad",                                  size: "750–950 sq ft"   },
    { maxPrice: 8000000,  label: "₹50L–₹80L",     type: "2 BHK",          locality: "South Bopal, Gota, Chandkheda, Shilaj, Shela, Ghuma, Motera, New CG Road",                        size: "950–1150 sq ft"  },
    { maxPrice: 12000000, label: "₹80L–₹1.2Cr",   type: "3 BHK",          locality: "Satellite, Bodakdev, Vastrapur, Jodhpur, Prahladnagar, Gurukul, Navrangpura, Memnagar",           size: "1300–1600 sq ft" },
    { maxPrice: 20000000, label: "₹1.2Cr–₹2Cr",   type: "3 BHK Premium",  locality: "Thaltej, Ambli, SG Highway, Bodakdev (premium), Satellite (premium), CG Road, Ellis Bridge",     size: "1600–2000 sq ft" },
    { maxPrice: Infinity, label: "Above ₹2Cr",     type: "4 BHK / Villa",  locality: "Ambli, Thaltej (premium), Sindhu Bhavan Road, Science City Road, Shilaj",                        size: "2000+ sq ft"     },
  ],
  bangalore: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "1 BHK",          locality: "Electronic City, Hoskote, Anekal, Chandapura, Attibele, Bommasandra, Jigani, Bidadi, Nelamangala", size: "450–600 sq ft"  },
    { maxPrice: 8000000,  label: "₹50L–₹80L",     type: "2 BHK",          locality: "Whitefield, Sarjapur Road, Thanisandra, Hennur, Begur, Hulimavu, Kengeri, Varthur, Harlur",       size: "850–1050 sq ft"  },
    { maxPrice: 12000000, label: "₹80L–₹1.2Cr",   type: "2 BHK Premium",  locality: "HSR Layout, Marathahalli, Bellandur, Hebbal, Yelahanka, Rajajinagar, Banashankari, Basavanagudi", size: "1100–1350 sq ft" },
    { maxPrice: 20000000, label: "₹1.2Cr–₹2Cr",   type: "3 BHK",          locality: "Indiranagar, Koramangala, JP Nagar, Jayanagar, Malleshwaram, Sadashivanagar, Frazer Town",        size: "1400–1800 sq ft" },
    { maxPrice: Infinity, label: "Above ₹2Cr",     type: "4 BHK / Villa",  locality: "Lavelle Road, Vittal Mallya Road, Palace Road, Dollars Colony, HAL 2nd & 3rd Stage",             size: "2000+ sq ft"     },
  ],
  chennai: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "1 BHK",          locality: "Tambaram, Avadi, Chrompet, Poonamallee, Kundrathur, Guduvancheri, Kelambakkam, Ambattur",         size: "500–650 sq ft"   },
    { maxPrice: 8000000,  label: "₹50L–₹80L",     type: "2 BHK",          locality: "OMR, Medavakkam, Perambur, Mogappair, Pallikaranai, Sholinganallur, Kolathur, Vengaivasal",       size: "850–1050 sq ft"  },
    { maxPrice: 12000000, label: "₹80L–₹1.2Cr",   type: "2 BHK Premium",  locality: "Velachery, Anna Nagar, Thoraipakkam, Guindy, Thiruvanmiyur, Kilpauk, Ashok Nagar, Kodambakkam",  size: "1100–1350 sq ft" },
    { maxPrice: 20000000, label: "₹1.2Cr–₹2Cr",   type: "3 BHK",          locality: "T. Nagar, Adyar, Nungambakkam, Mylapore, Besant Nagar, Alwarpet, KK Nagar, Teynampet",           size: "1400–1800 sq ft" },
    { maxPrice: Infinity, label: "Above ₹2Cr",     type: "4 BHK / Villa",  locality: "Boat Club, Poes Garden, RA Puram, MRC Nagar, ECR (Injambakkam–Neelankarai), Gopalapuram",        size: "2000+ sq ft"     },
  ],
  delhi: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "1 BHK",          locality: "Greater Noida West, Bhiwadi, Noida Extension, Raj Nagar Ext. (Ghaziabad), Crossing Republik",    size: "500–650 sq ft"   },
    { maxPrice: 8000000,  label: "₹50L–₹80L",     type: "2 BHK",          locality: "Noida Ext. (Sec 1–16), Faridabad (Sec 75–88), Greater Noida, Sohna Road, Yamuna Expressway",     size: "850–1050 sq ft"  },
    { maxPrice: 12000000, label: "₹80L–₹1.2Cr",   type: "2 BHK Premium",  locality: "Noida Sec 75–150, New Gurgaon, Indirapuram, Vaishali, Dwarka (Sec 19–23), Rohini (Sec 24–37)",  size: "1100–1350 sq ft" },
    { maxPrice: 20000000, label: "₹1.2Cr–₹2Cr",   type: "3 BHK",          locality: "Dwarka (Sec 1–12), Noida Sec 44–62, Sushant Lok, Vasant Kunj, Saket, Janakpuri, Pitampura",     size: "1400–1800 sq ft" },
    { maxPrice: Infinity, label: "Above ₹2Cr",     type: "4 BHK / Villa",  locality: "Golf Course Road, DLF Phase 1–5, Greater Kailash, Defence Colony, Hauz Khas, Vasant Vihar",     size: "2000+ sq ft"     },
  ],
  hyderabad: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "1 BHK",          locality: "Uppal, LB Nagar, Ghatkesar, Kompally, Medchal, Shamshabad, Pocharam, Adibatla, Bolarum",         size: "500–650 sq ft"   },
    { maxPrice: 8000000,  label: "₹50L–₹80L",     type: "2 BHK",          locality: "Miyapur, Kukatpally, Nizampet, Bachupally, Pragathi Nagar, Manikonda, Narsingi, Chandanagar",    size: "900–1100 sq ft"  },
    { maxPrice: 12000000, label: "₹80L–₹1.2Cr",   type: "2 BHK Premium",  locality: "Gachibowli, Kondapur, Madhapur, HITEC City, Kokapet, Begumpet, Habsiguda, AS Rao Nagar",        size: "1100–1400 sq ft" },
    { maxPrice: 20000000, label: "₹1.2Cr–₹2Cr",   type: "3 BHK",          locality: "Jubilee Hills, Banjara Hills, Film Nagar, Somajiguda, Khairatabad, Financial District, Attapur", size: "1500–1900 sq ft" },
    { maxPrice: Infinity, label: "Above ₹2Cr",     type: "4 BHK / Villa",  locality: "Jubilee Hills (Road 36+), Banjara Hills, Gandipet, Mokila, Narsingi (villas)",                  size: "2000+ sq ft"     },
  ],
  kolkata: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "2 BHK",          locality: "Rajarhat, Barasat, Narendrapur, Sonarpur, Madhyamgram, Barrackpore, Joka, Behala outskirts",     size: "700–900 sq ft"   },
    { maxPrice: 8000000,  label: "₹50L–₹80L",     type: "2 BHK",          locality: "New Town, Garia, Tollygunge, Kasba, Mukundapur, Keshtopur, Baguihati, Behala, Jadavpur",         size: "900–1100 sq ft"  },
    { maxPrice: 12000000, label: "₹80L–₹1.2Cr",   type: "3 BHK",          locality: "Salt Lake (Sec 1–5), EM Bypass, Ruby, Jodhpur Park, Lake Gardens, Southern Avenue, Gariahat",   size: "1200–1500 sq ft" },
    { maxPrice: 20000000, label: "₹1.2Cr–₹2Cr",   type: "3 BHK Premium",  locality: "Alipore, Ballygunge, Park Street, Camac Street, Elgin Road, Shakespeare Sarani, Hazra Road",    size: "1500–1900 sq ft" },
    { maxPrice: Infinity, label: "Above ₹2Cr",     type: "4 BHK / Villa",  locality: "Alipore (premium), Ballygunge Circular Road, Rawdon Street, Theatre Road",                      size: "2000+ sq ft"     },
  ],
  mumbai: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "Studio / 1 RK",  locality: "Panvel, Taloja, Ulwe, Vasai-Virar, Bhiwandi, Badlapur, Ambernath, Karjat, Dombivli outskirts",  size: "250–400 sq ft"   },
    { maxPrice: 8000000,  label: "₹50L–₹80L",     type: "1 BHK",          locality: "Thane (Bhiwandi Rd), Kalyan, Dombivli, Kharghar, Kamothe, Mira-Bhayandar, Virar, Nalasopara",  size: "400–550 sq ft"   },
    { maxPrice: 12000000, label: "₹80L–₹1.2Cr",   type: "2 BHK",          locality: "Kandivali, Borivali, Malad East, Dahisar, Thane (Ghodbunder Rd), Mulund, Vikhroli, Bhandup",   size: "600–800 sq ft"   },
    { maxPrice: 20000000, label: "₹1.2Cr–₹2Cr",   type: "2 BHK Premium",  locality: "Andheri East, Goregaon, Powai, Chembur, Wadala, Lower Parel, Matunga, Ghatkopar, Kurla",       size: "700–950 sq ft"   },
    { maxPrice: Infinity, label: "Above ₹2Cr",     type: "3 BHK",          locality: "Andheri West, Bandra, Dadar, Prabhadevi, Worli, Juhu, Khar, Santacruz, Versova, Lokhandwala",  size: "1000+ sq ft"     },
  ],
  pune: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "1 BHK",          locality: "Wagholi, Talegaon, Chakan, Pirangut, Uruli Kanchan, Manjri, Lohegaon, Marunji, Alandi",         size: "450–600 sq ft"   },
    { maxPrice: 8000000,  label: "₹50L–₹80L",     type: "2 BHK",          locality: "Hinjewadi, Kharadi, Undri, Hadapsar, Tathawade, Moshi, Ravet, Wakad outskirts, Dhayari",        size: "850–1050 sq ft"  },
    { maxPrice: 12000000, label: "₹80L–₹1.2Cr",   type: "2 BHK Premium",  locality: "Baner, Wakad, Bavdhan, Kothrud, Aundh, Viman Nagar, Magarpatta, Kondhwa, NIBM Road",            size: "1100–1350 sq ft" },
    { maxPrice: 20000000, label: "₹1.2Cr–₹2Cr",   type: "3 BHK",          locality: "Koregaon Park, Kalyani Nagar, Boat Club Road, Shivajinagar, Prabhat Road, Erandwane, SB Road",  size: "1400–1800 sq ft" },
    { maxPrice: Infinity, label: "Above ₹2Cr",     type: "4 BHK / Villa",  locality: "Koregaon Park Annexe, Boat Club Road, Kalyani Nagar (premium), Lavasa, Baner hilltop",          size: "2000+ sq ft"     },
  ],
  custom: [
    { maxPrice: 5000000,  label: "Under ₹50L",    type: "1 BHK",          locality: "Budget locality",             size: "500–650 sq ft"   },
    { maxPrice: 10000000, label: "₹50L–₹1Cr",     type: "2 BHK",          locality: "Mid-range locality",          size: "850–1100 sq ft"  },
    { maxPrice: 20000000, label: "₹1Cr–₹2Cr",     type: "2–3 BHK",        locality: "Established locality",        size: "1100–1500 sq ft" },
    { maxPrice: 35000000, label: "₹2Cr–₹3.5Cr",   type: "3 BHK Premium",  locality: "Premium locality",            size: "1400–1800 sq ft" },
    { maxPrice: Infinity, label: "Above ₹3.5Cr",  type: "4 BHK / Villa",  locality: "Premium / gated community",   size: "2000+ sq ft"     },
  ],
};

export const TOOLTIPS = {
  sec80c:      "Section 80C: deduct principal repaid on your home loan, up to ₹1.5L/year from taxable income. Shared with PF, ELSS, PPF etc.",
  sec24b:      "Section 24(b): deduct home loan interest up to ₹2L/year on a self-occupied property. Directly reduces tax payable.",
  hra:         "Section 10(13A): Salaried employees can claim HRA exemption — the least of: actual HRA received, rent paid minus 10% of basic, or 50%/40% of basic (metro/non-metro).",
  invest:      "Expected annual return if savings are invested in mutual funds / index funds / FDs. Indian equity index has returned ~13% historically.",
  maint:       "Monthly society charges + maintenance + repairs. Grows at 5% p.a. Only buyers pay this — renters don't.",
  downPayment: "The upfront amount you pay from your own savings. The remaining amount is taken as a home loan. Minimum is usually 10–20% of the property price.",
  tenure:      "The number of years over which you repay your home loan. Longer tenure = lower monthly EMI, but you pay more interest overall.",
  appreciation:"The expected annual increase in your property's market value. Historically 3–7% p.a. in Indian cities. Higher appreciation favors buying.",
  rentIncrease:"How much your rent goes up each year, typically when you renew your lease. Usually 5–10% in Indian metros.",
  taxBracket:  "Your income tax slab rate under the old regime. Check your Form 16 or salary slip. Most salaried professionals above ₹10L/year are in the 30% slab.",
  horizon:     "How many years you plan to stay in this city and hold the property. The single most important input — a short horizon almost always favors renting.",
  stampDuty:   "A one-time government tax paid when you register a property purchase. Varies by state (4–8% of property value). Paid upfront and not recoverable.",
};
