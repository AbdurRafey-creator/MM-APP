# MM-APP
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>Money Manager</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0a;
      --surface: #111;
      --surface2: #161616;
      --border: #1e1e1e;
      --border2: #242424;
      --text: #ffffff;
      --muted: #888;
      --muted2: #666;
      --green: #4ade80;
      --green-btn: #22c55e;
      --red: #f87171;
      --purple: #7c65ff;
      --purple-dark: #312e81;
      --purple-deeper: #1e1b4b;
    }

    body {
      background: var(--bg);
      font-family: 'Instrument Sans', sans-serif;
      color: var(--text);
      min-height: 100vh;
    }

    .app {
      max-width: 440px;
      margin: 0 auto;
      min-height: 100vh;
      background: var(--bg);
      overflow-x: hidden;
      position: relative;
    }

    /* ── HEADER ── */
    .hdr { padding: 28px 22px 0; }
    .mnav { display: flex; align-items: center; justify-content: space-between; }
    .mbtn {
      background: var(--surface2); border: 1px solid var(--border2); color: var(--muted);
      width: 34px; height: 34px; border-radius: 50%; cursor: pointer; font-size: 15px;
      display: flex; align-items: center; justify-content: center; transition: all .2s;
    }
    .mbtn:hover { background: var(--border2); color: var(--text); }
    .mtitle { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: -.3px; }

    /* ── BALANCE CARD ── */
    .bal-wrap { padding: 16px 22px 0; }
    .bal-card {
      background: linear-gradient(135deg, var(--purple-dark) 0%, var(--purple-deeper) 100%);
      border: 1px solid #4338ca; border-radius: 22px; padding: 22px;
      position: relative; overflow: hidden;
    }
    .bal-card::after {
      content: ''; position: absolute; bottom: -20px; left: -20px;
      width: 200px; height: 140px;
      background: radial-gradient(ellipse, rgba(34,197,94,.15), transparent 70%);
    }
    .bal-tag { font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: var(--text); margin-bottom: 8px; }
    .bal-num { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; letter-spacing: -2px; line-height: 1; color: var(--text); }
    .bal-num.neg { color: #ff7eb3; }
    .bal-sub { font-size: 12px; color: var(--muted); margin-top: 8px; }

    /* ── INCOME / EXPENSE ── */
    .ie-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px 22px 0; }
    .ie-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 14px; }
    .ie-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted2); margin-bottom: 5px; }
    .ie-val { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
    .inc { color: var(--green); }
    .exp { color: var(--red); }

    /* ── ADVISOR CARD ── */
    .adv-wrap { padding: 14px 22px 0; }
    .acard {
      border-radius: 16px; padding: 14px 16px; border: 1px solid;
      font-size: 13px; line-height: 1.6; cursor: pointer;
    }
    .acard.good { background: rgba(74,222,128,.07); border-color: rgba(74,222,128,.2); color: #86efac; }
    .acard.warn { background: rgba(251,191,36,.07); border-color: rgba(251,191,36,.2); color: #fde68a; }
    .acard.bad  { background: rgba(248,113,113,.07); border-color: rgba(248,113,113,.2); color: #fca5a5; }
    .acard.info { background: var(--surface2); border-color: var(--border2); color: var(--muted); }
    .ahd { font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
    .acard-refresh { margin-top: 8px; background: none; border: none; color: inherit; font-size: 11px; cursor: pointer; opacity: .6; padding: 0; }

    /* ── SMART BUDGET BANNER ── */
    .pbanner {
      background: var(--surface2); border: 1px solid var(--border2); border-radius: 16px;
      padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;
      gap: 12px; margin: 14px 22px 0;
    }
    .ptext { font-size: 13px; color: var(--muted); flex: 1; }
    .ptext strong { color: var(--text); }
    .pbtn {
      background: var(--purple); color: #fff; border: none; border-radius: 10px;
      padding: 8px 14px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
      cursor: pointer; white-space: nowrap; transition: opacity .2s;
    }
    .pbtn:hover { opacity: .85; }

    /* ── SECTIONS ── */
    .sec { padding: 0 22px; margin-top: 20px; }
    .slbl { font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: var(--text); margin-bottom: 12px; }

    /* ── DONUT ── */
    .donut-wrap { display: flex; align-items: center; gap: 16px; }
    .legend { flex: 1; display: flex; flex-direction: column; gap: 7px; }
    .li { display: flex; align-items: center; gap: 8px; font-size: 12px; }
    .ldot { width: 7px; height: 7px; border-radius: 2px; flex-shrink: 0; }
    .lname { color: var(--muted); flex: 1; }
    .lval { color: var(--text); font-weight: 600; font-size: 11px; }

    /* ── BUDGET BARS ── */
    .bbar { margin-bottom: 12px; }
    .bbhd { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
    .bbname { color: var(--muted); }
    .bbval { color: var(--text); font-weight: 500; }
    .bbval.over { color: var(--red); }
    .bbtrack { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
    .bbfill { height: 4px; border-radius: 2px; transition: width .6s ease; }

    /* ── TRANSACTIONS ── */
    .txlist { display: flex; flex-direction: column; gap: 6px; }
    .txn {
      background: var(--surface); border: 1px solid #1a1a1a; border-radius: 14px;
      padding: 12px 14px; display: flex; align-items: center; gap: 12px;
      cursor: pointer; transition: background .15s;
    }
    .txn:hover { background: var(--surface2); }
    .tico { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
    .tinfo { flex: 1; min-width: 0; }
    .tcat { font-size: 13px; font-weight: 500; }
    .tnote { font-size: 11px; color: var(--muted2); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tr { text-align: right; flex-shrink: 0; }
    .tamt { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
    .tdt { font-size: 10px; color: var(--muted2); margin-top: 2px; }
    .dbtn { background: none; border: none; color: #2a2a2a; cursor: pointer; font-size: 18px; padding: 2px 4px; transition: color .2s; flex-shrink: 0; }
    .dbtn:hover { color: var(--red); }
    .empty { text-align: center; color: #555; padding: 40px 0; font-size: 13px; line-height: 1.8; }

    /* ── NAV BAR ── */
    .navbar {
      position: sticky; bottom: 0;
      background: rgba(10,10,10,.97); backdrop-filter: blur(16px);
      border-top: 1px solid #1a1a1a;
      display: flex; align-items: center; padding: 12px 22px 28px; gap: 8px; z-index: 10;
    }
    .ntab {
      flex: 1; padding: 10px 6px; background: transparent; border: none; color: var(--text);
      font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 1.5px; cursor: pointer;
      border-radius: 12px; transition: all .2s;
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .ntab .ni { font-size: 18px; }
    .ntab.active { color: var(--text); background: var(--surface2); }
    .nadd {
      flex: 0 0 52px; height: 52px; border-radius: 50%;
      background: var(--green-btn); border: none; color: #fff; font-size: 24px;
      cursor: pointer; transition: transform .2s;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 24px rgba(34,197,94,.4);
    }
    .nadd:hover { transform: scale(1.08); }

    /* ── ADD / EDIT FORM ── */
    .fpage { padding: 28px 22px; display: none; }
    .fpage.active { display: block; }
    .fhd { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; margin-bottom: 24px; }
    .trow { display: flex; gap: 8px; margin-bottom: 20px; }
    .tpill {
      flex: 1; padding: 11px; border-radius: 12px; border: 1px solid var(--border);
      background: var(--surface); color: var(--muted2);
      font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all .2s;
    }
    .tpill.aexp { background: rgba(248,113,113,.1); border-color: rgba(248,113,113,.35); color: var(--red); }
    .tpill.ainc { background: rgba(74,222,128,.1); border-color: rgba(74,222,128,.35); color: var(--green); }
    .fld { margin-bottom: 14px; }
    .fld label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted2); margin-bottom: 8px; }
    .fld input, .fld select {
      width: 100%; background: var(--surface); border: 1px solid var(--border);
      border-radius: 13px; padding: 13px 15px; color: var(--text);
      font-family: 'Instrument Sans', sans-serif; font-size: 15px; outline: none; transition: border-color .2s;
    }
    .fld input:focus, .fld select:focus { border-color: var(--purple); }
    .fld select option { background: var(--surface); }
    .abig { font-family: 'Syne', sans-serif !important; font-size: 32px !important; font-weight: 800 !important; letter-spacing: -1px; }
    .vbox { border-radius: 13px; padding: 12px 14px; border: 1px solid; margin-bottom: 14px; font-size: 13px; line-height: 1.65; display: none; }
    .vbox.show { display: block; }
    .vbox.good { background: rgba(74,222,128,.07); border-color: rgba(74,222,128,.2); color: #86efac; }
    .vbox.warn { background: rgba(251,191,36,.07); border-color: rgba(251,191,36,.2); color: #fde68a; }
    .vbox.bad  { background: rgba(248,113,113,.07); border-color: rgba(248,113,113,.2); color: #fca5a5; }
    .vlbl { font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
    .chip { display: inline-flex; align-items: center; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 4px 10px; font-size: 11px; color: var(--muted); margin-bottom: 12px; }
    .subbtn {
      width: 100%; padding: 16px; background: var(--purple); color: #fff; border: none;
      border-radius: 14px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800;
      cursor: pointer; transition: opacity .2s; margin-top: 4px;
    }
    .subbtn:hover { opacity: .88; }
    .cancbtn { width: 100%; padding: 13px; background: transparent; color: var(--muted2); border: none; font-family: 'Instrument Sans', sans-serif; font-size: 14px; cursor: pointer; margin-top: 6px; }

    /* ── BUDGET PAGE ── */
    .bscard { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 14px 16px; margin-bottom: 16px; }
    .bssub { font-size: 11px; color: var(--muted2); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .bsdesc { font-size: 13px; color: var(--muted); margin-bottom: 10px; }
    .bsdesc strong { color: var(--text); }
    .pgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 12px; }
    .pgriditem { font-size: 11px; color: var(--muted2); display: flex; justify-content: space-between; background: var(--surface2); border-radius: 8px; padding: 5px 8px; }
    .pgridamt { color: var(--text); font-weight: 600; }
    .bitem { background: var(--surface); border: 1px solid #1a1a1a; border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .bitem.over { border-color: rgba(248,113,113,.3); }
    .bico { font-size: 20px; width: 28px; text-align: center; }
    .binfo { flex: 1; }
    .bname { font-size: 13px; font-weight: 500; }
    .bspent { font-size: 11px; color: var(--muted2); margin-top: 2px; }
    .binput {
      width: 80px; background: var(--surface2); border: 1px solid var(--border2);
      border-radius: 10px; padding: 7px 10px; color: var(--text);
      font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; outline: none; text-align: right;
    }
    .dollar-prefix { font-size: 13px; color: var(--muted); }

    /* ── VIEWS ── */
    .view { display: none; }
    .view.active { display: block; }
    .spacer { height: 90px; }
  </style>
</head>
<body>
<div class="app">

  <!-- HEADER -->
  <div class="hdr">
    <div class="mnav">
      <button class="mbtn" onclick="changeMonth(-1)">&#8249;</button>
      <span class="mtitle syne" id="month-title" style="font-family:'Syne',sans-serif"></span>
      <button class="mbtn" onclick="changeMonth(1)">&#8250;</button>
    </div>
  </div>

  <!-- DASHBOARD VIEW -->
  <div id="view-dash" class="view active">
    <div class="bal-wrap">
      <div class="bal-card">
        <div class="bal-tag">Net Balance</div>
        <div class="bal-num syne" id="bal-num" style="font-family:'Syne',sans-serif">$0.00</div>
        <div class="bal-sub" id="bal-sub"></div>
      </div>
    </div>

    <div class="ie-row">
      <div class="ie-card">
        <div class="ie-lbl">Income</div>
        <div class="ie-val inc syne" id="inc-val" style="font-family:'Syne',sans-serif">$0.00</div>
      </div>
      <div class="ie-card">
        <div class="ie-lbl">Expenses</div>
        <div class="ie-val exp syne" id="exp-val" style="font-family:'Syne',sans-serif">$0.00</div>
      </div>
    </div>

    <div class="adv-wrap" id="adv-wrap"></div>
    <div id="preset-banner"></div>

    <div class="sec" id="donut-sec" style="display:none">
      <div class="slbl">Spending Breakdown</div>
      <div class="donut-wrap">
        <svg width="170" height="170" viewBox="0 0 170 170" id="donut-svg"></svg>
        <div class="legend" id="donut-legend"></div>
      </div>
    </div>

    <div class="sec" id="budget-tracker-sec" style="display:none">
      <div class="slbl">Budget Tracker</div>
      <div id="budget-bars"></div>
    </div>

    <div class="sec">
      <div class="slbl">Recent Transactions</div>
      <div id="txn-list"></div>
    </div>
    <div class="spacer"></div>
  </div>

  <!-- BUDGET VIEW -->
  <div id="view-budget" class="view">
    <div class="sec" style="margin-top:22px">
      <div class="slbl" id="budget-title"></div>
      <div id="budget-preset-card"></div>
      <div id="budget-items"></div>
      <div class="spacer"></div>
    </div>
  </div>

  <!-- ADD/EDIT VIEW -->
  <div id="view-add" class="view">
    <div class="fpage active">
      <div class="fhd syne" id="form-title" style="font-family:'Syne',sans-serif">Log Transaction</div>
      <div class="trow">
        <button class="tpill aexp" id="btn-expense" onclick="setType('expense')">Expense</button>
        <button class="tpill" id="btn-income" onclick="setType('income')">Income</button>
      </div>
      <div class="fld">
        <label>Amount</label>
        <input class="abig" type="number" id="inp-amount" placeholder="0.00" oninput="onAmountChange()" style="font-family:'Syne',sans-serif;font-size:32px;font-weight:800;letter-spacing:-1px" />
      </div>
      <div class="fld">
        <label>Category</label>
        <select id="inp-cat" onchange="onAmountChange()"></select>
      </div>
      <div class="fld">
        <label>Date</label>
        <input type="date" id="inp-date" />
      </div>
      <div class="fld">
        <label>Note (optional)</label>
        <input type="text" id="inp-note" placeholder="What was this for?" />
      </div>
      <div class="vbox" id="verdict-box">
        <div class="vlbl" id="verdict-lbl"></div>
        <span id="verdict-text"></span>
      </div>
      <div id="budget-chip"></div>
      <button class="subbtn" onclick="submitTxn()" id="submit-btn">Add Transaction</button>
      <button class="cancbtn" onclick="showView('dash')">Cancel</button>
    </div>
  </div>

  <!-- NAV BAR -->
  <div class="navbar" id="navbar">
    <button class="ntab active" id="nav-dash" onclick="showView('dash')">
      <span class="ni">📊</span>Overview
    </button>
    <button class="nadd" onclick="openAdd()">+</button>
    <button class="ntab" id="nav-budget" onclick="showView('budget')">
      <span class="ni">🎯</span>Budget
    </button>
  </div>

</div>

<script>
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const ECATS  = ["Housing","Food","Transport","Utilities","Healthcare","Entertainment","Shopping","Party","Savings","Other"];
  const ICATS  = ["Salary","Freelance","Investments","Other Income"];
  const PRESETS = { Housing:.28,Food:.12,Transport:.10,Utilities:.06,Healthcare:.05,Entertainment:.05,Shopping:.05,Party:.03,Savings:.15,Other:.05 };
  const COLORS  = { Housing:"#f87171",Food:"#fb923c",Transport:"#fbbf24",Utilities:"#a78bfa",Healthcare:"#60a5fa",Entertainment:"#f472b6",Shopping:"#c084fc",Party:"#fb7185",Savings:"#34d399",Other:"#6b7280" };
  const EMOJI   = { Housing:"🏠",Food:"🍔",Transport:"🚗",Utilities:"💡",Healthcare:"💊",Entertainment:"🎬",Shopping:"🛍️",Party:"🎉",Savings:"🏦",Other:"📦",Salary:"💼",Freelance:"💻",Investments:"📈","Other Income":"💰" };

  const now = new Date();
  let curMonth = now.getMonth();
  let curYear  = now.getFullYear();
  let txns     = loadLS("smm_txns", []);
  let budgets  = loadLS("smm_budgets", {});
  let editId   = null;
  let formType = "expense";
  let verdictTimer = null;
  let curSummary   = null;

  function loadLS(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch(e) { return d; } }
  function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} }
  function money(n) { return n.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 }); }
  function short(n) { return n >= 1000 ? (n/1000).toFixed(1) + "k" : n.toFixed(0); }
  function mk() { return curYear + "-" + curMonth; }

  function getMonthTxns() {
    return txns.filter(function(t) {
      var d = new Date(t.date);
      return d.getMonth() === curMonth && d.getFullYear() === curYear;
    });
  }

  function getIncome(mTxns) { return mTxns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0); }
  function getExpense(mTxns){ return mTxns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0); }

  function getExpByCat(mTxns) {
    var r = {};
    ECATS.forEach(function(c) { r[c] = mTxns.filter(t=>t.type==="expense"&&t.category===c).reduce((s,t)=>s+t.amount,0); });
    return r;
  }

  function getMBudgets() {
    var r = {};
    ECATS.forEach(function(c) { var v = budgets[mk()+"_"+c]; if(v) r[c] = v; });
    return r;
  }

  function analyzeExpense(amount, category, income, expense, catBudget, catSpent, recBudget) {
    var pctOfIncome = income > 0 ? amount / income : 0;
    var newTotal = expense + amount;
    var newPct = income > 0 ? newTotal / income : 0;
    if (catBudget && (catSpent + amount) > catBudget) {
      var over = (catSpent + amount) - catBudget;
      return { verdict:"bad", emoji:"🚨", title:"Exceeds "+category+" Budget", advice:"This puts you $"+over.toFixed(0)+" over your "+category+" budget of $"+catBudget.toFixed(0)+". Consider reducing or skipping this expense." };
    } else if (catBudget && (catSpent + amount) > catBudget * 0.8) {
      return { verdict:"warn", emoji:"⚠️", title:"Approaching Budget Limit", advice:"This brings you to "+Math.round((catSpent+amount)/catBudget*100)+"% of your "+category+" budget. Only $"+(catBudget-catSpent-amount).toFixed(0)+" remains for the month." };
    } else if (recBudget && (catSpent + amount) > recBudget) {
      return { verdict:"warn", emoji:"⚠️", title:"Above Recommended Spend", advice:"Recommended "+category+" spend is $"+recBudget.toFixed(0)+" based on your income. This exceeds that — make sure it's necessary." };
    } else if (income > 0 && newPct > 0.8) {
      return { verdict:"warn", emoji:"⚠️", title:"High Monthly Spending", advice:"After this, total expenses will be "+Math.round(newPct*100)+"% of your income. Try to keep spending under 80% to maintain healthy savings." };
    } else if (income > 0 && pctOfIncome > 0.2) {
      return { verdict:"warn", emoji:"💸", title:"Large Single Expense", advice:"This is "+Math.round(pctOfIncome*100)+"% of your monthly income. Make sure this is planned or essential before proceeding." };
    } else if (income > 0 && newPct < 0.5) {
      return { verdict:"good", emoji:"✅", title:"Looks Good", advice:"This fits well within your budget. After this you'll have spent "+Math.round(newPct*100)+"% of your income, leaving healthy room for savings." };
    } else {
      return { verdict:"good", emoji:"👍", title:"Within Budget", advice:"This expense appears manageable given your current income and spending. You're on track this month." };
    }
  }

  function analyzeSummary(income, expense, mBudgets, expByCat) {
    var net = income - expense;
    var sr  = income > 0 ? net / income : 0;
    var overCats = Object.keys(mBudgets).filter(c => (expByCat[c]||0) > mBudgets[c]);
    if (income === 0) return { verdict:"info", title:"Add Income First", summary:"Log your income for this month to unlock smart budget recommendations and personalised financial insights." };
    if (sr >= 0.2 && overCats.length === 0) return { verdict:"good", title:"Excellent Financial Health", summary:"You're saving "+Math.round(sr*100)+"% of your income this month — great work! All spending categories are within budget." };
    if (sr >= 0.1 && overCats.length <= 1) return { verdict:"warn", title:"Good, Room to Improve", summary:"You're saving "+Math.round(sr*100)+"% of income."+(overCats.length?" Over budget in: "+overCats.join(", ")+". Try to rein that in.":" Keep watching your spending.") };
    if (net < 0) return { verdict:"bad", title:"Spending Exceeds Income", summary:"You're spending $"+Math.abs(net).toFixed(0)+" more than you earn this month. Review your largest categories and cut non-essentials immediately." };
    return { verdict:"warn", title:"Budget Needs Attention", summary:"Saving "+Math.round(sr*100)+"% of income."+(overCats.length?" Over budget in: "+overCats.join(", ")+".":" ")+" Aim for 20%+ savings for long-term financial health." };
  }

  // ── Donut chart ──
  function drawDonut(expByCat) {
    var expTotal = ECATS.reduce((s,c)=>s+(expByCat[c]||0),0);
    var svg = document.getElementById("donut-svg");
    var legend = document.getElementById("donut-legend");
    svg.innerHTML = ""; legend.innerHTML = "";
    if (expTotal === 0) return;
    document.getElementById("donut-sec").style.display = "";
    var r=66, cx=85, cy=85, cum=0;
    ECATS.filter(c=>expByCat[c]>0).forEach(function(c) {
      var pct = expByCat[c] / expTotal;
      var a1  = (cum*360-90)*Math.PI/180;
      var a2  = ((cum+pct)*360-90)*Math.PI/180;
      var x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
      var x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2);
      var large = pct > 0.5 ? 1 : 0;
      var path = document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d","M"+cx+" "+cy+" L"+x1+" "+y1+" A"+r+" "+r+" 0 "+large+" 1 "+x2+" "+y2+"Z");
      path.setAttribute("fill", COLORS[c]||"#888");
      path.setAttribute("opacity","0.88");
      svg.appendChild(path);
      cum += pct;
      var li = document.createElement("div"); li.className = "li";
      li.innerHTML = '<div class="ldot" style="background:'+COLORS[c]+'"></div><span class="lname">'+c+'</span><span class="lval">$'+expByCat[c].toFixed(0)+'</span>';
      legend.appendChild(li);
    });
    // Center circle
    var circ = document.createElementNS("http://www.w3.org/2000/svg","circle");
    circ.setAttribute("cx",85); circ.setAttribute("cy",85); circ.setAttribute("r",38); circ.setAttribute("fill","#0a0a0a");
    svg.appendChild(circ);
    var t1 = document.createElementNS("http://www.w3.org/2000/svg","text");
    t1.setAttribute("x",85); t1.setAttribute("y",81); t1.setAttribute("text-anchor","middle"); t1.setAttribute("fill","#888"); t1.setAttribute("font-size","9"); t1.setAttribute("font-family","Instrument Sans"); t1.textContent = "spent";
    svg.appendChild(t1);
    var t2 = document.createElementNS("http://www.w3.org/2000/svg","text");
    t2.setAttribute("x",85); t2.setAttribute("y",97); t2.setAttribute("text-anchor","middle"); t2.setAttribute("fill","#fff"); t2.setAttribute("font-size","15"); t2.setAttribute("font-weight","700"); t2.setAttribute("font-family","Syne"); t2.textContent = "$"+short(expTotal);
    svg.appendChild(t2);
  }

  // ── Render dashboard ──
  function renderDash() {
    var mTxns   = getMonthTxns();
    var income  = getIncome(mTxns);
    var expense = getExpense(mTxns);
    var balance = income - expense;
    var expByCat = getExpByCat(mTxns);
    var mBudgets = getMBudgets();

    // Header
    document.getElementById("month-title").textContent = MONTHS[curMonth] + " " + curYear;
    // Balance
    var bn = document.getElementById("bal-num");
    bn.textContent = (balance < 0 ? "-$" : "$") + money(Math.abs(balance));
    bn.className = "bal-num syne" + (balance < 0 ? " neg" : "");
    document.getElementById("bal-sub").textContent = MONTHS[curMonth] + " " + curYear + " · " + mTxns.length + " transaction" + (mTxns.length !== 1 ? "s" : "");
    document.getElementById("inc-val").textContent = "$" + money(income);
    document.getElementById("exp-val").textContent = "$" + money(expense);

    // Advisor summary
    var advWrap = document.getElementById("adv-wrap");
    if (curSummary) {
      advWrap.innerHTML = '<div class="acard '+curSummary.verdict+'"><div class="ahd">💡 Monthly Insight</div><strong>'+curSummary.title+'</strong><div style="margin-top:4px">'+curSummary.summary+'</div><button class="acard-refresh" onclick="refreshSummary()">↻ Refresh</button></div>';
    } else if (income > 0 || expense > 0) {
      advWrap.innerHTML = '<div class="acard info" onclick="refreshSummary()"><div class="ahd">💡 Advisor</div>Tap for your AI financial summary for ' + MONTHS[curMonth] + '.</div>';
    } else { advWrap.innerHTML = ""; }

    // Preset banner
    var pb = document.getElementById("preset-banner");
    if (income > 0 && Object.keys(mBudgets).length === 0) {
      pb.innerHTML = '<div class="pbanner"><div class="ptext"><strong>Smart budgets ready.</strong> Allocate your $'+short(income)+' income across all categories.</div><button class="pbtn" onclick="applyPreset()">Apply</button></div>';
    } else { pb.innerHTML = ""; }

    // Donut
    document.getElementById("donut-sec").style.display = "none";
    drawDonut(expByCat);

    // Budget bars
    var btSec = document.getElementById("budget-tracker-sec");
    var btBars = document.getElementById("budget-bars");
    var budgetCats = ECATS.filter(c => mBudgets[c]);
    if (budgetCats.length > 0) {
      btSec.style.display = "";
      btBars.innerHTML = budgetCats.map(function(c) {
        var lim = mBudgets[c], spent = expByCat[c]||0, pct = Math.min(spent/lim,1), over = spent > lim;
        var barColor = over ? "#f87171" : pct > 0.8 ? "#fbbf24" : "#7c65ff";
        return '<div class="bbar"><div class="bbhd"><span class="bbname">'+EMOJI[c]+' '+c+'</span><span class="bbval'+(over?' over':'')+'">$'+spent.toFixed(0)+' / $'+lim.toFixed(0)+(over?' 🚨':'')+'</span></div><div class="bbtrack"><div class="bbfill" style="width:'+(pct*100)+'%;background:'+barColor+'"></div></div></div>';
      }).join("");
    } else { btSec.style.display = "none"; }

    // Transactions
    var txList = document.getElementById("txn-list");
    if (mTxns.length === 0) {
      txList.innerHTML = '<div class="empty">No transactions yet.<br><strong>Tap + to add your first one.</strong></div>';
    } else {
      txList.innerHTML = '<div class="txlist">' + mTxns.slice(0,12).map(function(t) {
        var color = COLORS[t.category] || "#888";
        var dateStr = new Date(t.date + "T00:00:00").toLocaleDateString("en-US", {month:"short", day:"numeric"});
        return '<div class="txn" onclick="editTxn(\''+t.id+'\')">'
          + '<div class="tico" style="background:'+color+'22">'+(EMOJI[t.category]||'💸')+'</div>'
          + '<div class="tinfo"><div class="tcat">'+t.category+'</div>'+(t.note?'<div class="tnote">'+t.note+'</div>':'')+'</div>'
          + '<div class="tr"><div class="tamt '+(t.type==="income"?"inc":"exp")+'" style="font-family:\'Syne\',sans-serif">'+(t.type==="income"?"+$":"-$")+t.amount.toFixed(2)+'</div><div class="tdt">'+dateStr+'</div></div>'
          + '<button class="dbtn" onclick="event.stopPropagation();deleteTxn(\''+t.id+'\')">×</button>'
          + '</div>';
      }).join("") + '</div>';
    }
  }

  // ── Budget page ──
  function renderBudget() {
    var mTxns    = getMonthTxns();
    var income   = getIncome(mTxns);
    var expByCat = getExpByCat(mTxns);
    document.getElementById("budget-title").textContent = "Budget Settings — " + MONTHS[curMonth];

    var presetCard = document.getElementById("budget-preset-card");
    if (income > 0) {
      var rows = ECATS.map(function(c) {
        return '<div class="pgriditem"><span>'+EMOJI[c]+' '+c+'</span><span class="pgridamt">$'+(income*(PRESETS[c]||0)).toFixed(0)+'</span></div>';
      }).join("");
      presetCard.innerHTML = '<div class="bscard"><div class="bssub">Smart Preset · 50/30/20 Rule</div><div class="bsdesc">Allocates your <strong>$'+money(income)+'</strong> income across all categories.</div><div class="pgrid">'+rows+'</div><button class="pbtn" onclick="applyPreset()" style="width:100%">Apply Smart Budgets</button></div>';
    } else {
      presetCard.innerHTML = '<div class="acard info" style="margin-bottom:16px"><div class="ahd">💡 Add Income First</div>Log an income transaction this month to unlock smart budget presets.</div>';
    }

    var items = document.getElementById("budget-items");
    items.innerHTML = ECATS.map(function(c) {
      var key = mk() + "_" + c;
      var val = budgets[key] !== undefined ? budgets[key] : "";
      var spent = expByCat[c] || 0;
      var isOver = val !== "" && spent > Number(val);
      return '<div class="bitem'+(isOver?' over':'')+'">'
        + '<span class="bico">'+EMOJI[c]+'</span>'
        + '<div class="binfo"><div class="bname">'+c+'</div><div class="bspent">Spent: $'+spent.toFixed(0)+(isOver?' 🚨':'')+'</div></div>'
        + '<div style="display:flex;align-items:center;gap:4px"><span class="dollar-prefix">$</span>'
        + '<input class="binput" type="number" placeholder="Limit" value="'+val+'" data-key="'+key+'" oninput="setBudget(this)" style="font-family:\'Syne\',sans-serif"></div>'
        + '</div>';
    }).join("");
  }

  function setBudget(inp) {
    var key = inp.getAttribute("data-key");
    var v = inp.value;
    if (v === "") { delete budgets[key]; } else { budgets[key] = parseFloat(v); }
    saveLS("smm_budgets", budgets);
    renderDash();
  }

  // ── Navigation ──
  function showView(v) {
    ["dash","budget","add"].forEach(function(id) {
      document.getElementById("view-"+id).classList.toggle("active", id === v);
    });
    document.getElementById("navbar").style.display = v === "add" ? "none" : "";
    document.getElementById("nav-dash").classList.toggle("active", v === "dash");
    document.getElementById("nav-budget").classList.toggle("active", v === "budget");
    if (v === "dash")   renderDash();
    if (v === "budget") renderBudget();
  }

  function changeMonth(dir) {
    curMonth += dir;
    if (curMonth < 0)  { curMonth = 11; curYear--; }
    if (curMonth > 11) { curMonth = 0;  curYear++; }
    curSummary = null;
    renderDash();
  }

  // ── Add / Edit ──
  function openAdd() {
    editId = null;
    formType = "expense";
    document.getElementById("form-title").textContent = "Log Transaction";
    document.getElementById("submit-btn").textContent = "Add Transaction";
    document.getElementById("inp-amount").value = "";
    document.getElementById("inp-note").value = "";
    document.getElementById("inp-date").value = now.toISOString().slice(0,10);
    setType("expense");
    hideVerdict();
    showView("add");
    setTimeout(function(){ document.getElementById("inp-amount").focus(); }, 100);
  }

  function editTxn(id) {
    var t = txns.find(function(x){ return String(x.id) === String(id); });
    if (!t) return;
    editId = t.id;
    formType = t.type;
    document.getElementById("form-title").textContent = "Edit Transaction";
    document.getElementById("submit-btn").textContent = "Save Changes";
    document.getElementById("inp-amount").value = t.amount;
    document.getElementById("inp-note").value = t.note || "";
    document.getElementById("inp-date").value = t.date;
    setType(t.type, t.category);
    hideVerdict();
    showView("add");
  }

  function setType(type, cat) {
    formType = type;
    document.getElementById("btn-expense").className = "tpill" + (type === "expense" ? " aexp" : "");
    document.getElementById("btn-income").className  = "tpill" + (type === "income"  ? " ainc" : "");
    var sel = document.getElementById("inp-cat");
    var cats = type === "expense" ? ECATS : ICATS;
    sel.innerHTML = cats.map(function(c){ return '<option value="'+c+'"'+(c===(cat||cats[0])?' selected':'')+'>'+c+'</option>'; }).join("");
    onAmountChange();
  }

  function submitTxn() {
    var amt = parseFloat(document.getElementById("inp-amount").value);
    if (!amt || isNaN(amt)) return;
    var t = {
      id:       editId || Date.now(),
      type:     formType,
      amount:   amt,
      category: document.getElementById("inp-cat").value,
      note:     document.getElementById("inp-note").value,
      date:     document.getElementById("inp-date").value
    };
    if (editId) { txns = txns.map(function(x){ return x.id === editId ? t : x; }); editId = null; }
    else txns.unshift(t);
    saveLS("smm_txns", txns);
    showView("dash");
  }

  function deleteTxn(id) {
    txns = txns.filter(function(t){ return String(t.id) !== String(id); });
    saveLS("smm_txns", txns);
    renderDash();
  }

  // ── Advisor ──
  function onAmountChange() {
    clearTimeout(verdictTimer);
    hideVerdict();
    if (formType !== "expense") return;
    var amt = parseFloat(document.getElementById("inp-amount").value);
    if (!amt || isNaN(amt)) return;
    verdictTimer = setTimeout(function() {
      var mTxns    = getMonthTxns();
      var income   = getIncome(mTxns);
      var expense  = getExpense(mTxns);
      var expByCat = getExpByCat(mTxns);
      var mBudgets = getMBudgets();
      var cat      = document.getElementById("inp-cat").value;
      var catB     = mBudgets[cat];
      var recB     = income > 0 ? income * (PRESETS[cat] || 0) : null;
      var v        = analyzeExpense(amt, cat, income, expense, catB, expByCat[cat]||0, recB);
      showVerdict(v);
      // Budget chip
      var chip = document.getElementById("budget-chip");
      if (catB) { chip.innerHTML = '<div class="chip">📊 '+cat+' budget: $'+catB.toFixed(0)+' · spent $'+(expByCat[cat]||0).toFixed(0)+'</div>'; }
      else chip.innerHTML = "";
    }, 300);
  }

  function showVerdict(v) {
    var box = document.getElementById("verdict-box");
    box.className = "vbox show " + v.verdict;
    document.getElementById("verdict-lbl").textContent = v.emoji + " " + v.title;
    document.getElementById("verdict-text").textContent = v.advice;
  }

  function hideVerdict() {
    document.getElementById("verdict-box").className = "vbox";
    document.getElementById("budget-chip").innerHTML = "";
  }

  function refreshSummary() {
    var mTxns    = getMonthTxns();
    var income   = getIncome(mTxns);
    var expense  = getExpense(mTxns);
    var expByCat = getExpByCat(mTxns);
    var mBudgets = getMBudgets();
    curSummary   = analyzeSummary(income, expense, mBudgets, expByCat);
    renderDash();
  }

  function applyPreset() {
    var mTxns  = getMonthTxns();
    var income = getIncome(mTxns);
    if (!income) return;
    ECATS.forEach(function(c) { if (PRESETS[c]) budgets[mk()+"_"+c] = parseFloat((income*PRESETS[c]).toFixed(2)); });
    saveLS("smm_budgets", budgets);
    renderDash();
    renderBudget();
  }

  // ── Init ──
  document.getElementById("navbar").style.display = "";
  setType("expense");
  renderDash();
</script>
</body>
</html>
