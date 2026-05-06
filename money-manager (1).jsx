import { useState, useEffect, useRef } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const ECATS = ["Housing","Food","Transport","Utilities","Healthcare","Entertainment","Shopping","Party","Savings","Other"];
const ICATS = ["Salary","Freelance","Investments","Other Income"];
const PRESETS = { Housing:0.28,Food:0.12,Transport:0.10,Utilities:0.06,Healthcare:0.05,Entertainment:0.05,Shopping:0.05,Party:0.03,Savings:0.15,Other:0.05 };
const COLORS = { Housing:"#f87171",Food:"#fb923c",Transport:"#fbbf24",Utilities:"#a78bfa",Healthcare:"#60a5fa",Entertainment:"#f472b6",Shopping:"#c084fc",Party:"#fb7185",Savings:"#34d399",Other:"#6b7280",Salary:"#4ade80",Freelance:"#86efac",Investments:"#6ee7b7","Other Income":"#34d399" };
const EMOJI = { Housing:"🏠",Food:"🍔",Transport:"🚗",Utilities:"💡",Healthcare:"💊",Entertainment:"🎬",Shopping:"🛍️",Party:"🎉",Savings:"🏦",Other:"📦",Salary:"💼",Freelance:"💻",Investments:"📈","Other Income":"💰" };

const now = new Date();
const money = function(n) { return n.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 }); };
const short = function(n) { return n >= 1000 ? (n/1000).toFixed(1) + "k" : n.toFixed(0); };
const loadLS = function(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch(e) { return d; } };

function analyzeExpense(amount, category, income, expense, catBudget, catSpent, recBudget) {
  var verdict, emoji, title, advice;
  var pctOfIncome = income > 0 ? amount / income : 0;
  var newTotal = expense + amount;
  var newPct = income > 0 ? newTotal / income : 0;
  if (catBudget && (catSpent + amount) > catBudget) {
    var over = (catSpent + amount) - catBudget;
    verdict = "bad"; emoji = "🚨"; title = "Exceeds " + category + " Budget";
    advice = "This puts you $" + over.toFixed(0) + " over your " + category + " budget of $" + catBudget.toFixed(0) + ". Consider reducing or skipping this expense.";
  } else if (catBudget && (catSpent + amount) > catBudget * 0.8) {
    verdict = "warn"; emoji = "⚠️"; title = "Approaching Budget Limit";
    advice = "This brings you to " + Math.round((catSpent + amount) / catBudget * 100) + "% of your " + category + " budget. Only $" + (catBudget - catSpent - amount).toFixed(0) + " remains for the month.";
  } else if (recBudget && (catSpent + amount) > recBudget) {
    verdict = "warn"; emoji = "⚠️"; title = "Above Recommended Spend";
    advice = "Recommended " + category + " spend is $" + recBudget.toFixed(0) + " based on your income. This exceeds that — make sure it's necessary.";
  } else if (income > 0 && newPct > 0.8) {
    verdict = "warn"; emoji = "⚠️"; title = "High Monthly Spending";
    advice = "After this, total expenses will be " + Math.round(newPct * 100) + "% of your income. Try to keep spending under 80% to maintain healthy savings.";
  } else if (income > 0 && pctOfIncome > 0.2) {
    verdict = "warn"; emoji = "💸"; title = "Large Single Expense";
    advice = "This is " + Math.round(pctOfIncome * 100) + "% of your monthly income. Make sure this is planned or essential before proceeding.";
  } else if (income > 0 && newPct < 0.5) {
    verdict = "good"; emoji = "✅"; title = "Looks Good";
    advice = "This fits well within your budget. After this you'll have spent " + Math.round(newPct * 100) + "% of your income, leaving healthy room for savings.";
  } else {
    verdict = "good"; emoji = "👍"; title = "Within Budget";
    advice = "This expense appears manageable given your current income and spending. You're on track this month.";
  }
  return { verdict: verdict, emoji: emoji, title: title, advice: advice };
}

function analyzeSummary(income, expense, mBudgets, expByCat) {
  var net = income - expense;
  var savingsRate = income > 0 ? net / income : 0;
  var overCats = [];
  var keys = Object.keys(mBudgets);
  for (var i = 0; i < keys.length; i++) {
    var c = keys[i];
    if ((expByCat[c] || 0) > mBudgets[c]) overCats.push(c);
  }
  var verdict, title, summary;
  if (income === 0) {
    verdict = "info"; title = "Add Income First";
    summary = "Log your income for this month to unlock smart budget recommendations and personalised financial insights.";
  } else if (savingsRate >= 0.2 && overCats.length === 0) {
    verdict = "good"; title = "Excellent Financial Health";
    summary = "You're saving " + Math.round(savingsRate * 100) + "% of your income this month — great work! All spending categories are within budget.";
  } else if (savingsRate >= 0.1 && overCats.length <= 1) {
    verdict = "warn"; title = "Good, Room to Improve";
    summary = "You're saving " + Math.round(savingsRate * 100) + "% of income." + (overCats.length ? " Over budget in: " + overCats.join(", ") + ". Try to rein that in." : " Keep watching your spending.");
  } else if (net < 0) {
    verdict = "bad"; title = "Spending Exceeds Income";
    summary = "You're spending $" + Math.abs(net).toFixed(0) + " more than you earn this month. Review your largest categories and cut non-essentials immediately.";
  } else {
    verdict = "warn"; title = "Budget Needs Attention";
    summary = "Saving " + Math.round(savingsRate * 100) + "% of income." + (overCats.length ? " Over budget in: " + overCats.join(", ") + "." : "") + " Aim for 20%+ savings for long-term financial health.";
  }
  return { verdict: verdict, title: title, summary: summary };
}

const CSS = [
  "@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap');",
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
  "body{background:#0a0a0a}",
  ".app{min-height:100vh;background:#0a0a0a;color:#ffffff;font-family:'Instrument Sans',sans-serif;max-width:440px;margin:0 auto;overflow-x:hidden}",
  ".syne{font-family:'Syne',sans-serif}",
  ".hdr{padding:28px 22px 0}",
  ".mnav{display:flex;align-items:center;justify-content:space-between}",
  ".mbtn{background:#161616;border:1px solid #242424;color:#888;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .2s}",
  ".mbtn:hover{background:#242424;color:#ffffff}",
  ".mtitle{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;letter-spacing:-.3px;color:#ffffff}",
  /* Balance card — soft indigo/violet tint */
  ".bal-wrap{padding:16px 22px 0}",
  ".bal-card{background:linear-gradient(135deg,#312e81 0%,#1e1b4b 100%);border:1px solid #4338ca;border-radius:22px;padding:22px;position:relative;overflow:hidden}",
  ".bal-card::after{content:'';position:absolute;bottom:-20px;left:-20px;width:200px;height:140px;background:radial-gradient(ellipse,rgba(34,197,94,.15),transparent 70%)}",
  ".bal-tag{font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#ffffff;margin-bottom:8px}",
  ".bal-num{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;letter-spacing:-2px;line-height:1;color:#ffffff}",
  ".bal-num.neg{color:#ff7eb3}",
  ".bal-sub{font-size:12px;color:#888;margin-top:8px}",
  /* Income / Expense cards */
  ".ie-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 22px 0}",
  ".ie-card{background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:14px}",
  ".ie-lbl{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#666;margin-bottom:5px}",
  ".ie-val{font-family:'Syne',sans-serif;font-size:18px;font-weight:700}",
  ".inc{color:#4ade80}.exp{color:#f87171}",
  /* Advisor card */
  ".adv-wrap{padding:14px 22px 0}",
  ".acard{border-radius:16px;padding:14px 16px;border:1px solid;font-size:13px;line-height:1.6;cursor:pointer}",
  ".acard.good{background:rgba(74,222,128,.07);border-color:rgba(74,222,128,.2);color:#86efac}",
  ".acard.warn{background:rgba(251,191,36,.07);border-color:rgba(251,191,36,.2);color:#fde68a}",
  ".acard.bad{background:rgba(248,113,113,.07);border-color:rgba(248,113,113,.2);color:#fca5a5}",
  ".acard.info{background:#161616;border-color:#242424;color:#888}",
  ".ahd{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}",
  /* Smart budget banner */
  ".pbanner{background:#161616;border:1px solid #242424;border-radius:16px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:14px 22px 0}",
  ".ptext{font-size:13px;color:#888;flex:1}",
  ".ptext strong{color:#ffffff}",
  ".pbtn{background:#7c65ff;color:#fff;border:none;border-radius:10px;padding:8px 14px;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:opacity .2s}",
  ".pbtn:hover{opacity:.85}",
  /* Sections */
  ".sec{padding:0 22px;margin-top:20px}",
  ".slbl{font-size:10px;text-transform:uppercase;letter-spacing:2.5px;color:#666;margin-bottom:12px}",
  /* Donut */
  ".donut-wrap{display:flex;align-items:center;gap:16px}",
  ".legend{flex:1;display:flex;flex-direction:column;gap:7px}",
  ".li{display:flex;align-items:center;gap:8px;font-size:12px}",
  ".ldot{width:7px;height:7px;border-radius:2px;flex-shrink:0}",
  ".lname{color:#888;flex:1}.lval{color:#ffffff;font-weight:600;font-size:11px}",
  /* Budget bars */
  ".bbar{margin-bottom:12px}",
  ".bbhd{display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px}",
  ".bbname{color:#888}.bbval{color:#ffffff;font-weight:500}",
  ".bbval.over{color:#f87171}",
  ".bbtrack{height:4px;background:#1e1e1e;border-radius:2px;overflow:hidden}",
  ".bbfill{height:4px;border-radius:2px;transition:width .6s ease}",
  /* Transactions */
  ".txlist{display:flex;flex-direction:column;gap:6px}",
  ".txn{background:#111;border:1px solid #1a1a1a;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background .15s}",
  ".txn:hover{background:#161616}",
  ".tico{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}",
  ".tinfo{flex:1;min-width:0}",
  ".tcat{font-size:13px;font-weight:500;color:#ffffff}",
  ".tnote{font-size:11px;color:#666;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".tr{text-align:right;flex-shrink:0}",
  ".tamt{font-family:'Syne',sans-serif;font-size:14px;font-weight:700}",
  ".tdt{font-size:10px;color:#666;margin-top:2px}",
  ".dbtn{background:none;border:none;color:#2a2a2a;cursor:pointer;font-size:18px;padding:2px 4px;transition:color .2s}",
  ".dbtn:hover{color:#f87171}",
  ".empty{text-align:center;color:#555;padding:40px 0;font-size:13px;line-height:1.8}",
  /* Nav */
  ".navbar{position:sticky;bottom:0;background:rgba(10,10,10,.97);backdrop-filter:blur(16px);border-top:1px solid #1a1a1a;display:flex;align-items:center;padding:12px 22px 24px;gap:8px;z-index:10}",
  ".ntab{flex:1;padding:10px 6px;background:transparent;border:none;color:#ffffff;font-family:'Syne',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;cursor:pointer;border-radius:12px;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px}",
  ".ntab .ni{font-size:18px}",
  ".ntab.active{color:#ffffff;background:#161616}",
  ".nadd{flex:0 0 52px;height:52px;border-radius:50%;background:#22c55e;border:none;color:#fff;font-size:24px;cursor:pointer;transition:transform .2s;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(34,197,94,.4)}",
  ".nadd:hover{transform:scale(1.08)}",
  /* Add form */
  ".fpage{padding:28px 22px}",
  ".fhd{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;margin-bottom:24px;color:#ffffff}",
  ".trow{display:flex;gap:8px;margin-bottom:20px}",
  ".tpill{flex:1;padding:11px;border-radius:12px;border:1px solid #1e1e1e;background:#111;color:#666;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .2s}",
  ".tpill.aexp{background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.35);color:#f87171}",
  ".tpill.ainc{background:rgba(74,222,128,.1);border-color:rgba(74,222,128,.35);color:#4ade80}",
  ".fld{margin-bottom:14px}",
  ".fld label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#666;margin-bottom:8px}",
  ".fld input,.fld select{width:100%;background:#111;border:1px solid #1e1e1e;border-radius:13px;padding:13px 15px;color:#ffffff;font-family:'Instrument Sans',sans-serif;font-size:15px;outline:none;transition:border-color .2s}",
  ".fld input:focus,.fld select:focus{border-color:#7c65ff}",
  ".fld select option{background:#111}",
  ".abig{font-family:'Syne',sans-serif !important;font-size:32px !important;font-weight:800 !important;letter-spacing:-1px}",
  /* Verdict box */
  ".vbox{border-radius:13px;padding:12px 14px;border:1px solid;margin-bottom:14px;font-size:13px;line-height:1.65}",
  ".vbox.good{background:rgba(74,222,128,.07);border-color:rgba(74,222,128,.2);color:#86efac}",
  ".vbox.warn{background:rgba(251,191,36,.07);border-color:rgba(251,191,36,.2);color:#fde68a}",
  ".vbox.bad{background:rgba(248,113,113,.07);border-color:rgba(248,113,113,.2);color:#fca5a5}",
  ".vlbl{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}",
  ".chip{display:inline-flex;align-items:center;gap:4px;background:#111;border:1px solid #1e1e1e;border-radius:20px;padding:4px 10px;font-size:11px;color:#888;margin-bottom:12px}",
  ".subbtn{width:100%;padding:16px;background:#7c65ff;color:#fff;border:none;border-radius:14px;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:opacity .2s;margin-top:4px}",
  ".subbtn:hover{opacity:.88}",
  ".cancbtn{width:100%;padding:13px;background:transparent;color:#666;border:none;font-family:'Instrument Sans',sans-serif;font-size:14px;cursor:pointer;margin-top:6px}",
  ".spacer{height:90px}",
  /* Budget page */
  ".bscard{background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:14px 16px;margin-bottom:16px}",
  ".bssub{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}",
  ".bsdesc{font-size:13px;color:#888;margin-bottom:10px}",
  ".bsdesc strong{color:#ffffff}",
  ".pgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px}",
  ".pgriditem{font-size:11px;color:#666;display:flex;justify-content:space-between;background:#161616;border-radius:8px;padding:5px 8px}",
  ".pgridamt{color:#ffffff;font-weight:600}",
  ".bitem{background:#111;border:1px solid #1a1a1a;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:8px}",
  ".bitem.over{border-color:rgba(248,113,113,.3)}",
  ".bico{font-size:20px;width:28px;text-align:center}",
  ".binfo{flex:1}",
  ".bname{font-size:13px;font-weight:500;color:#ffffff}",
  ".bspent{font-size:11px;color:#666;margin-top:2px}",
  ".binput{width:80px;background:#161616;border:1px solid #242424;border-radius:10px;padding:7px 10px;color:#ffffff;font-family:'Syne',sans-serif;font-size:13px;font-weight:600;outline:none;text-align:right}"
].join("\n");

export default function App() {
  var blankForm = { type: "expense", amount: "", category: "Food", note: "", date: now.toISOString().slice(0, 10) };

  const [month,   setMonth]   = useState(now.getMonth());
  const [year,    setYear]    = useState(now.getFullYear());
  const [txns,    setTxns]    = useState(function() { return loadLS("smm_txns", []); });
  const [budgets, setBudgets] = useState(function() { return loadLS("smm_budgets", {}); });
  const [view,    setView]    = useState("dash");
  const [editId,  setEditId]  = useState(null);
  const [form,    setForm]    = useState(blankForm);
  const [verdict, setVerdict] = useState(null);
  const [vLoading, setVL]     = useState(false);
  const [summary, setSummary] = useState(null);
  const vTimer = useRef(null);

  useEffect(function() { try { localStorage.setItem("smm_txns", JSON.stringify(txns)); } catch(e) {} }, [txns]);
  useEffect(function() { try { localStorage.setItem("smm_budgets", JSON.stringify(budgets)); } catch(e) {} }, [budgets]);

  var mk = year + "-" + month;
  var mTxns = txns.filter(function(t) { var d = new Date(t.date); return d.getMonth() === month && d.getFullYear() === year; });
  var income  = mTxns.filter(function(t) { return t.type === "income"; }).reduce(function(s, t) { return s + t.amount; }, 0);
  var expense = mTxns.filter(function(t) { return t.type === "expense"; }).reduce(function(s, t) { return s + t.amount; }, 0);
  var balance = income - expense;

  var expByCat = ECATS.reduce(function(a, c) {
    a[c] = mTxns.filter(function(t) { return t.type === "expense" && t.category === c; }).reduce(function(s, t) { return s + t.amount; }, 0);
    return a;
  }, {});

  var mBudgets = ECATS.reduce(function(a, c) {
    var v = budgets[mk + "_" + c];
    if (v) a[c] = v;
    return a;
  }, {});

  function applyPreset() {
    if (!income) return;
    var next = Object.assign({}, budgets);
    ECATS.forEach(function(c) { if (PRESETS[c]) next[mk + "_" + c] = parseFloat((income * PRESETS[c]).toFixed(2)); });
    setBudgets(next);
  }

  useEffect(function() {
    if (form.type !== "expense" || !form.amount || isNaN(parseFloat(form.amount))) { setVerdict(null); return; }
    clearTimeout(vTimer.current);
    setVL(true);
    vTimer.current = setTimeout(function() {
      var amt    = parseFloat(form.amount);
      var cat    = form.category;
      var catB   = mBudgets[cat];
      var recB   = income > 0 ? income * (PRESETS[cat] || 0) : null;
      var catSp  = expByCat[cat] || 0;
      setVerdict(analyzeExpense(amt, cat, income, expense, catB, catSp, recB));
      setVL(false);
    }, 300);
    return function() { clearTimeout(vTimer.current); };
  }, [form.amount, form.category, form.type]); // eslint-disable-line

  function fetchSummary() { setSummary(analyzeSummary(income, expense, mBudgets, expByCat)); }

  function prevM() { if (month === 0) { setMonth(11); setYear(function(y) { return y - 1; }); } else setMonth(function(m) { return m - 1; }); setSummary(null); }
  function nextM() { if (month === 11) { setMonth(0);  setYear(function(y) { return y + 1; }); } else setMonth(function(m) { return m + 1; }); setSummary(null); }

  function submit() {
    if (!form.amount || isNaN(parseFloat(form.amount))) return;
    var t = Object.assign({}, form, { amount: parseFloat(form.amount), id: editId || Date.now() });
    if (editId) { setTxns(function(p) { return p.map(function(x) { return x.id === editId ? t : x; }); }); setEditId(null); }
    else setTxns(function(p) { return [t].concat(p); });
    setForm(blankForm); setVerdict(null); setView("dash");
  }
  function openAdd()  { setEditId(null); setForm(blankForm); setVerdict(null); setView("add"); }
  function editTxn(t) { setForm({ type:t.type, amount:String(t.amount), category:t.category, note:t.note, date:t.date }); setEditId(t.id); setVerdict(null); setView("add"); }
  function delTxn(id) { setTxns(function(p) { return p.filter(function(t) { return t.id !== id; }); }); }
  function cancel()   { setView("dash"); setEditId(null); setForm(blankForm); setVerdict(null); }

  var expTotal = Object.values(expByCat).reduce(function(a, b) { return a + b; }, 0);
  var cum = 0;
  var segs = ECATS.filter(function(c) { return expByCat[c] > 0; }).map(function(c) {
    var pct = expByCat[c] / (expTotal || 1); var s = cum; cum += pct; return { c:c, pct:pct, s:s };
  });
  function arc(s, e) {
    var r=66, cx=85, cy=85;
    var a1=(s*360-90)*Math.PI/180, a2=(e*360-90)*Math.PI/180;
    var x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1), x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2);
    return "M"+cx+" "+cy+" L"+x1+" "+y1+" A"+r+" "+r+" 0 "+((e-s)>.5?1:0)+" 1 "+x2+" "+y2+"Z";
  }
  var budgetCats = ECATS.filter(function(c) { return mBudgets[c]; });

  return (
    <div>
      <style>{CSS}</style>
      <div className="app">

        <div className="hdr">
          <div className="mnav">
            <button className="mbtn" onClick={prevM}>{"‹"}</button>
            <span className="mtitle syne">{MONTHS[month]} {year}</span>
            <button className="mbtn" onClick={nextM}>{"›"}</button>
          </div>
        </div>

        {view === "dash" && (
          <div>
            <div className="bal-wrap">
              <div className="bal-card">
                <div className="bal-tag">Net Balance</div>
                <div className={"bal-num syne" + (balance < 0 ? " neg" : "")}>
                  {balance < 0 ? "-$" : "$"}{money(Math.abs(balance))}
                </div>
                <div className="bal-sub">{MONTHS[month]} {year} {"·"} {mTxns.length} transaction{mTxns.length !== 1 ? "s" : ""}</div>
              </div>
            </div>

            <div className="ie-row">
              <div className="ie-card">
                <div className="ie-lbl">Income</div>
                <div className="ie-val inc syne">{"$"}{money(income)}</div>
              </div>
              <div className="ie-card">
                <div className="ie-lbl">Expenses</div>
                <div className="ie-val exp syne">{"$"}{money(expense)}</div>
              </div>
            </div>

            <div className="adv-wrap">
              {summary ? (
                <div className={"acard " + summary.verdict}>
                  <div className="ahd">{"💡"} Monthly Insight</div>
                  <strong>{summary.title}</strong>
                  <div style={{marginTop:4}}>{summary.summary}</div>
                  <button onClick={fetchSummary} style={{marginTop:8,background:"none",border:"none",color:"inherit",fontSize:11,cursor:"pointer",opacity:.6,padding:0}}>{"↻ Refresh"}</button>
                </div>
              ) : (income > 0 || expense > 0) ? (
                <div className="acard info" onClick={fetchSummary}>
                  <div className="ahd">{"💡"} Advisor</div>
                  Tap for your AI financial summary for {MONTHS[month]}.
                </div>
              ) : null}
            </div>

            {income > 0 && Object.keys(mBudgets).length === 0 && (
              <div className="pbanner">
                <div className="ptext"><strong>Smart budgets ready.</strong> Allocate your {"$"}{short(income)} income across all categories.</div>
                <button className="pbtn" onClick={applyPreset}>Apply</button>
              </div>
            )}

            {expTotal > 0 && (
              <div className="sec">
                <div className="slbl">Spending Breakdown</div>
                <div className="donut-wrap">
                  <svg width="170" height="170" viewBox="0 0 170 170">
                    {segs.map(function(sg, i) { return <path key={i} d={arc(sg.s, sg.s + sg.pct)} fill={COLORS[sg.c]} opacity={0.88} />; })}
                    <circle cx="85" cy="85" r="38" fill="#0a0a0a" />
                    <text x="85" y="81" textAnchor="middle" fill="#444" fontSize="9" fontFamily="Instrument Sans">spent</text>
                    <text x="85" y="97" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="700" fontFamily="Syne">{"$"}{short(expTotal)}</text>
                  </svg>
                  <div className="legend">
                    {segs.map(function(sg, i) {
                      return (
                        <div className="li" key={i}>
                          <div className="ldot" style={{background:COLORS[sg.c]}} />
                          <span className="lname">{sg.c}</span>
                          <span className="lval">{"$"}{expByCat[sg.c].toFixed(0)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {budgetCats.length > 0 && (
              <div className="sec">
                <div className="slbl">Budget Tracker</div>
                {budgetCats.map(function(c) {
                  var lim = mBudgets[c], spent = expByCat[c] || 0, pct = Math.min(spent / lim, 1), over = spent > lim;
                  return (
                    <div className="bbar" key={c}>
                      <div className="bbhd">
                        <span className="bbname">{EMOJI[c]} {c}</span>
                        <span className={"bbval" + (over ? " over" : "")}>{"$"}{spent.toFixed(0)}{" / $"}{lim.toFixed(0)}{over ? " 🚨" : ""}</span>
                      </div>
                      <div className="bbtrack">
                        <div className="bbfill" style={{width:(pct*100)+"%", background: over ? "#f87171" : pct > 0.8 ? "#fbbf24" : "#7c65ff"}} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="sec">
              <div className="slbl">Recent Transactions</div>
              {mTxns.length === 0 ? (
                <div className="empty">No transactions yet.<br />Tap <strong>+</strong> to add your first one.</div>
              ) : (
                <div className="txlist">
                  {mTxns.slice(0, 12).map(function(t) {
                    return (
                      <div className="txn" key={t.id} onClick={function() { editTxn(t); }}>
                        <div className="tico" style={{background:(COLORS[t.category] || "#333") + "20"}}>{EMOJI[t.category] || "💸"}</div>
                        <div className="tinfo">
                          <div className="tcat">{t.category}</div>
                          {t.note && <div className="tnote">{t.note}</div>}
                        </div>
                        <div className="tr">
                          <div className={"tamt syne " + (t.type === "income" ? "inc" : "exp")}>
                            {t.type === "income" ? "+$" : "-$"}{t.amount.toFixed(2)}
                          </div>
                          <div className="tdt">{new Date(t.date + "T00:00:00").toLocaleDateString("en-US", {month:"short", day:"numeric"})}</div>
                        </div>
                        <button className="dbtn" onClick={function(e) { e.stopPropagation(); delTxn(t.id); }}>{"×"}</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="spacer" />
          </div>
        )}

        {view === "budget" && (
          <div className="sec" style={{marginTop:22}}>
            <div className="slbl">Budget Settings — {MONTHS[month]}</div>

            {income > 0 && (
              <div className="bscard">
                <div className="bssub">Smart Preset · 50/30/20 Rule</div>
                <div className="bsdesc">Allocates your <strong>{"$"}{money(income)}</strong> income across all categories.</div>
                <div className="pgrid">
                  {ECATS.map(function(c) {
                    return (
                      <div className="pgriditem" key={c}>
                        <span>{EMOJI[c]} {c}</span>
                        <span className="pgridamt">{"$"}{(income * (PRESETS[c] || 0)).toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>
                <button className="pbtn" onClick={applyPreset} style={{width:"100%"}}>Apply Smart Budgets</button>
              </div>
            )}

            {income === 0 && (
              <div className="acard info" style={{marginBottom:16}}>
                <div className="ahd">{"💡"} Add Income First</div>
                Log an income transaction this month to unlock smart budget presets.
              </div>
            )}

            {ECATS.map(function(c) {
              var key = mk + "_" + c;
              var rawVal = budgets[key];
              var val = rawVal !== undefined ? rawVal : "";
              var spent = expByCat[c] || 0;
              var isOver = val !== "" && spent > Number(val);
              return (
                <div className={"bitem" + (isOver ? " over" : "")} key={c}>
                  <span className="bico">{EMOJI[c]}</span>
                  <div className="binfo">
                    <div className="bname">{c}</div>
                    <div className="bspent">Spent: {"$"}{spent.toFixed(0)}{isOver ? " 🚨" : ""}</div>
                  </div>
                  <div style={{display:"flex", alignItems:"center", gap:4}}>
                    <span style={{fontSize:13, color:"#888"}}>$</span>
                    <input
                      className="binput"
                      type="number"
                      placeholder="Limit"
                      value={val}
                      onChange={function(e) {
                        var v = e.target.value;
                        setBudgets(function(b) {
                          var next = Object.assign({}, b);
                          if (v === "" || v === null) { delete next[key]; } else { next[key] = parseFloat(v); }
                          return next;
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="spacer" />
          </div>
        )}

        {view === "add" && (
          <div className="fpage">
            <div className="fhd syne">{editId ? "Edit" : "Log"} Transaction</div>

            <div className="trow">
              <button className={"tpill" + (form.type === "expense" ? " aexp" : "")} onClick={function() { setForm(function(f) { return Object.assign({}, f, {type:"expense", category:"Food"}); }); }}>Expense</button>
              <button className={"tpill" + (form.type === "income"  ? " ainc" : "")} onClick={function() { setForm(function(f) { return Object.assign({}, f, {type:"income",  category:"Salary"}); }); }}>Income</button>
            </div>

            <div className="fld">
              <label>Amount</label>
              <input className="abig" type="number" placeholder="0.00" value={form.amount}
                onChange={function(e) { setForm(function(f) { return Object.assign({}, f, {amount: e.target.value}); }); }} autoFocus />
            </div>
            <div className="fld">
              <label>Category</label>
              <select value={form.category} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, {category: e.target.value}); }); }}>
                {(form.type === "expense" ? ECATS : ICATS).map(function(c) { return <option key={c}>{c}</option>; })}
              </select>
            </div>
            <div className="fld">
              <label>Date</label>
              <input type="date" value={form.date} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, {date: e.target.value}); }); }} />
            </div>
            <div className="fld">
              <label>Note (optional)</label>
              <input type="text" placeholder="What was this for?" value={form.note}
                onChange={function(e) { setForm(function(f) { return Object.assign({}, f, {note: e.target.value}); }); }} />
            </div>

            {form.type === "expense" && verdict && (
              <div className={"vbox " + verdict.verdict}>
                <div className="vlbl">{verdict.emoji} {verdict.title}</div>
                {verdict.advice}
              </div>
            )}

            {form.type === "expense" && mBudgets[form.category] && (
              <div className="chip">
                {"📊"} {form.category} budget: {"$"}{mBudgets[form.category].toFixed(0)}{" · spent $"}{(expByCat[form.category] || 0).toFixed(0)}
              </div>
            )}

            <button className="subbtn" onClick={submit}>{editId ? "Save Changes" : "Add Transaction"}</button>
            <button className="cancbtn" onClick={cancel}>Cancel</button>
          </div>
        )}

        {view !== "add" && (
          <div className="navbar">
            <button className={"ntab" + (view === "dash" ? " active" : "")} onClick={function() { setView("dash"); }}>
              <span className="ni">{"📊"}</span>
              Overview
            </button>
            <button className="nadd" onClick={openAdd}>+</button>
            <button className={"ntab" + (view === "budget" ? " active" : "")} onClick={function() { setView("budget"); }}>
              <span className="ni">{"🎯"}</span>
              Budget
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
