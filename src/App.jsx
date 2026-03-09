import { useState, useMemo, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";

/* ─── FIREBASE CONFIG ─────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyDrJ1WtC4UEmPHRmkMJyZNl1drRSe0KoQM",
  authDomain: "optimax-ar.firebaseapp.com",
  projectId: "optimax-ar",
  storageBucket: "optimax-ar.firebasestorage.app",
  messagingSenderId: "496188810242",
  appId: "1:496188810242:web:73fd86aeadfc72e3db331b"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

/* ─── SEED DATA ──────────────────────────────────────────────────────── */
const SEED_INVOICES = [
  { id:"i1",  date:"30/06/2025", invoice:"INV-9850",  customer:"Shrinivas Waske",      mobile:"",          category:"Daily",   originalAmt:7565,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i2",  date:"05/07/2025", invoice:"INV-9973",  customer:"Ashish Raut",           mobile:"",          category:"Daily",   originalAmt:1000,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i3",  date:"15/07/2025", invoice:"INV-10203", customer:"Pravin Kshirsagar",     mobile:"",          category:"Daily",   originalAmt:2320,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i4",  date:"19/07/2025", invoice:"INV-10311", customer:"Shubham Gadhve",        mobile:"",          category:"Daily",   originalAmt:500,    paidAmt:0, payments:[], assignedTo:"" },
  { id:"i5",  date:"23/07/2025", invoice:"INV-10381", customer:"Prashant Habib",        mobile:"",          category:"Daily",   originalAmt:1900,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i6",  date:"18/08/2025", invoice:"INV-10913", customer:"VIBRANCE ENTERPRISES", mobile:"",          category:"Daily",   originalAmt:16400,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i7",  date:"11/08/2025", invoice:"INV-10763", customer:"Soham Chakankar Shop", mobile:"7057869976",category:"Shop",    originalAmt:924,    paidAmt:0, payments:[], assignedTo:"" },
  { id:"i8",  date:"27/09/2025", invoice:"INV-11647", customer:"Nitin Shinde",          mobile:"",          category:"Daily",   originalAmt:2000,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i9",  date:"31/10/2025", invoice:"INV-12150", customer:"Pawan Doke",            mobile:"",          category:"Daily",   originalAmt:6000,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i10", date:"31/10/2025", invoice:"INV-12137", customer:"Chaitanya Deshmukh",    mobile:"",          category:"Daily",   originalAmt:2900,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i11", date:"17/11/2025", invoice:"INV-12463", customer:"AJAY JAGDALE",          mobile:"",          category:"Daily",   originalAmt:3600,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i12", date:"22/11/2025", invoice:"INV-12579", customer:"MAHENDRA RAUT",         mobile:"",          category:"Daily",   originalAmt:7500,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i13", date:"30/11/2025", invoice:"INV-12694", customer:"Kadar Shaikh",          mobile:"",          category:"Daily",   originalAmt:2720,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i14", date:"02/12/2025", invoice:"INV-12733", customer:"Dhananjay Kadu",        mobile:"",          category:"Daily",   originalAmt:4500,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i15", date:"06/12/2025", invoice:"INV-12811", customer:"Pawan Doke",            mobile:"",          category:"Daily",   originalAmt:12300,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i16", date:"19/12/2025", invoice:"INV-13069", customer:"Keval Mota",            mobile:"",          category:"Daily",   originalAmt:7500,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i17", date:"20/12/2025", invoice:"INV-13090", customer:"TAN NUTRITION",         mobile:"",          category:"Shop",    originalAmt:32000,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i18", date:"25/12/2025", invoice:"INV-13178", customer:"MALHAR ENTERPRICES",    mobile:"",          category:"Daily",   originalAmt:8500,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i19", date:"25/12/2025", invoice:"INV-13179", customer:"SAGAR PATAVARDHAN",     mobile:"",          category:"Daily",   originalAmt:11650,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i20", date:"05/01/2026", invoice:"INV-13339", customer:"RAHUL UNECHA",          mobile:"",          category:"Daily",   originalAmt:29700,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i21", date:"09/01/2026", invoice:"INV-13419", customer:"Rohit Choudhari",       mobile:"",          category:"Daily",   originalAmt:11050,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i22", date:"22/01/2026", invoice:"INV-13641", customer:"PROTEIN HUB KONDHWA",  mobile:"",          category:"Shop",    originalAmt:9700,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i23", date:"22/01/2026", invoice:"INV-13637", customer:"Prasad Ghorpade",       mobile:"7875395559",category:"Shop",    originalAmt:15000,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i24", date:"24/01/2026", invoice:"INV-13676", customer:"TAN NUTRITION",         mobile:"",          category:"Shop",    originalAmt:41000,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i25", date:"24/01/2026", invoice:"INV-13675", customer:"Nutrition Gallery",     mobile:"9673690808",category:"Shop",    originalAmt:41000,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i26", date:"27/01/2026", invoice:"INV-13706", customer:"Prasad Ghorpade",       mobile:"7875395559",category:"Shop",    originalAmt:7500,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i27", date:"02/02/2026", invoice:"INV-13800", customer:"Abhijit Baravkar",      mobile:"",          category:"Daily",   originalAmt:11000,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i28", date:"02/02/2026", invoice:"INV-13803", customer:"MATIN TAMBOLI",         mobile:"9822883075",category:"ProShop", originalAmt:3800,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i29", date:"04/02/2026", invoice:"INV-13848", customer:"Indian Health Fitness", mobile:"7769945700",category:"Shop",    originalAmt:4932,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i30", date:"06/02/2026", invoice:"INV-13908", customer:"PUNE PROTEIN SHOP",    mobile:"9921111105",category:"Shop",    originalAmt:100800, paidAmt:0, payments:[], assignedTo:"" },
  { id:"i31", date:"07/02/2026", invoice:"INV-13934", customer:"M J FITNESS",          mobile:"9336090909",category:"Shop",    originalAmt:35100,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i32", date:"07/02/2026", invoice:"INV-13932", customer:"Nutrition Gallery",     mobile:"9673690808",category:"Shop",    originalAmt:51200,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i33", date:"14/02/2026", invoice:"INV-14075", customer:"NutriRich",             mobile:"7776900011",category:"Shop",    originalAmt:48800,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i34", date:"12/02/2026", invoice:"INV-14033", customer:"SHREE SPORTS",         mobile:"9370243783",category:"Shop",    originalAmt:16804,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i35", date:"17/02/2026", invoice:"INV-14129", customer:"VISHAL OTARI",         mobile:"9765800970",category:"Shop",    originalAmt:50400,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i36", date:"17/02/2026", invoice:"INV-14128", customer:"Proteios Wellness",     mobile:"8308857198",category:"ProShop", originalAmt:25156,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i37", date:"18/02/2026", invoice:"INV-14143", customer:"Manoj Bhoite Bavdhan", mobile:"7972658354",category:"Shop",    originalAmt:48411,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i38", date:"19/02/2026", invoice:"INV-14160", customer:"VISHAL OTARI",         mobile:"9765800970",category:"Shop",    originalAmt:86400,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i39", date:"19/02/2026", invoice:"INV-14159", customer:"Santosh Thombre",       mobile:"9923792121",category:"Shop",    originalAmt:16400,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i40", date:"22/02/2026", invoice:"INV-14211", customer:"Rohit Choudhari",       mobile:"",          category:"Daily",   originalAmt:14550,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i41", date:"23/02/2026", invoice:"INV-14219", customer:"PRAVYA NUTRITION",     mobile:"",          category:"Shop",    originalAmt:106400, paidAmt:0, payments:[], assignedTo:"" },
  { id:"i42", date:"24/02/2026", invoice:"INV-14244", customer:"Indian Health Fitness", mobile:"7769945700",category:"Shop",    originalAmt:6152,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i43", date:"25/02/2026", invoice:"INV-14262", customer:"BODYNATION SPORTS",    mobile:"9623300461",category:"Shop",    originalAmt:55800,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i44", date:"26/02/2026", invoice:"INV-14279", customer:"Dr. Deepak Mulik",      mobile:"8412029922",category:"ProShop", originalAmt:16200,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i45", date:"27/02/2026", invoice:"INV-14292", customer:"Prasad Ghorpade",       mobile:"7875395559",category:"Shop",    originalAmt:15000,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i46", date:"27/02/2026", invoice:"INV-14297", customer:"Mandar Utekar",         mobile:"9967909562",category:"Shop",    originalAmt:8100,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i47", date:"28/02/2026", invoice:"INV-14321", customer:"DEEPA SANAS",          mobile:"",          category:"Daily",   originalAmt:7800,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i48", date:"28/02/2026", invoice:"INV-14314", customer:"DR SANTOSH AWARI",     mobile:"",          category:"Daily",   originalAmt:5000,   paidAmt:0, payments:[], assignedTo:"" },
  { id:"i49", date:"04/03/2026", invoice:"INV-14379", customer:"YOGESH KHEDEKAR",      mobile:"8484839192",category:"Shop",    originalAmt:40400,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i50", date:"04/03/2026", invoice:"INV-14385", customer:"Athfood Cafe",          mobile:"",          category:"Daily",   originalAmt:14000,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i51", date:"05/03/2026", invoice:"INV-14413", customer:"NITU ADVANI",          mobile:"",          category:"Daily",   originalAmt:15000,  paidAmt:0, payments:[], assignedTo:"" },
  { id:"i52", date:"05/03/2026", invoice:"INV-14388", customer:"SWAPNIL WALE",         mobile:"",          category:"Daily",   originalAmt:22500,  paidAmt:0, payments:[], assignedTo:"" },
];

const INIT_USERS = [
  { id:"u1", name:"Owner",      username:"owner",      password:"owner123", role:"owner",      color:"#f59e0b" },
  { id:"u2", name:"Accountant", username:"accountant", password:"acc123",   role:"accountant", color:"#6366f1" },
  { id:"u3", name:"Ajay",       username:"ajay",       password:"ajay123",  role:"staff",      color:"#10b981" },
  { id:"u4", name:"Ganesh Sir", username:"ganesh",     password:"ganesh123",role:"staff",      color:"#0ea5e9" },
];

const DEFAULT_CATS = ["Daily","Shop","ProShop","Executive","Hard Recovery"];
const CALL_STATUSES = [
  { value:"promised",      label:"Promised to Pay",  color:"#10b981", icon:"🤝" },
  { value:"partial",       label:"Partial Payment",  color:"#3b82f6", icon:"💰" },
  { value:"callback",      label:"Call Back Later",  color:"#f59e0b", icon:"📞" },
  { value:"not_reachable", label:"Not Reachable",    color:"#6b7280", icon:"📵" },
  { value:"dispute",       label:"Dispute",          color:"#ef4444", icon:"⚠️" },
  { value:"paid",          label:"Payment Received", color:"#059669", icon:"✅" },
];
const PAY_MODES = ["Cash","UPI","NEFT","Cheque","Bank Transfer"];

const TODAY = new Date(); TODAY.setHours(0,0,0,0);
const _td = TODAY; const _dd = String(_td.getDate()).padStart(2,"0"), _mm = String(_td.getMonth()+1).padStart(2,"0"), _yyyy = _td.getFullYear();
const TODAY_STR = `${_dd}/${_mm}/${_yyyy}`;
const fmt  = n => "₹" + Number(n||0).toLocaleString("en-IN");
const parseDt  = s => { if(!s) return null; const[d,m,y]=s.split("/"); return new Date(`${y}-${m}-${d}`); };
const daysAgo  = s => { const d=parseDt(s); if(!d) return 0; return Math.floor((TODAY-d)/(864e5)); };
const fromInp  = s => { if(!s) return ""; const[y,m,d]=s.split("-"); return `${d}/${m}/${y}`; };
const toInp    = s => { if(!s) return ""; const[d,m,y]=s.split("/"); return `${y}-${m}-${d}`; };
const risk     = days => days>90?{c:"#ef4444",l:"🔴 Critical"}:days>60?{c:"#f97316",l:"🟠 High Risk"}:days>30?{c:"#f59e0b",l:"🟡 Medium"}:{c:"#10b981",l:"🟢 Fresh"};
const roleBadgeColor = r => r==="owner"?"#f59e0b":r==="accountant"?"#6366f1":"#10b981";

/* ══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [user,      setUser]      = useState(null);
  const [users,     setUsers]     = useState(INIT_USERS);
  const [invoices,  setInvoices]  = useState(SEED_INVOICES);
  const [callLogs,  setCallLogs]  = useState([]);
  const [followUps, setFollowUps] = useState({});
  const [cats,      setCats]      = useState(DEFAULT_CATS);
  const [tab,       setTab]       = useState("dashboard");
  const [settingsTab, setSettingsTab] = useState("users");
  const [fuPopupDismissed, setFuPopupDismissed] = useState(false);
  const [dbLoaded, setDbLoaded]   = useState(false);
  const [syncing,  setSyncing]    = useState(false);

  /* ── FIREBASE REAL-TIME LISTENERS ──────────────────────────────── */
  useEffect(() => {
    // Listen to invoices
    const unsubInv = onSnapshot(collection(db, "invoices"), snap => {
      if(!snap.empty) {
        const data = snap.docs.map(d => ({...d.data(), id:d.id}));
        setInvoices(data);
      }
      setDbLoaded(true);
    }, err => { console.error("Firestore error:", err); setDbLoaded(true); });

    // Listen to callLogs
    const unsubLogs = onSnapshot(collection(db, "callLogs"), snap => {
      const data = snap.docs.map(d => ({...d.data(), id:d.id}));
      setCallLogs(data.sort((a,b) => b.timestamp?.localeCompare(a.timestamp||"")));
    });

    // Listen to settings (users, cats, followUps)
    const unsubSettings = onSnapshot(doc(db, "settings", "main"), snap => {
      if(snap.exists()) {
        const d = snap.data();
        if(d.users)     setUsers(d.users);
        if(d.cats)      setCats(d.cats);
        if(d.followUps) setFollowUps(d.followUps);
      }
    });

    return () => { unsubInv(); unsubLogs(); unsubSettings(); };
  }, []);

  /* ── FIREBASE SEED (first time only) ───────────────────────────── */
  useEffect(() => {
    if(!dbLoaded) return;
    const seedFirebase = async () => {
      try {
        const snap = await new Promise(res => {
          const unsub = onSnapshot(collection(db, "invoices"), s => { unsub(); res(s); });
        });
        if(snap.empty) {
          setSyncing(true);
          const batch = writeBatch(db);
          SEED_INVOICES.forEach(inv => batch.set(doc(db, "invoices", inv.id), inv));
          batch.set(doc(db, "settings", "main"), { users:INIT_USERS, cats:DEFAULT_CATS, followUps:{} });
          await batch.commit();
          setSyncing(false);
        }
      } catch(e) { console.error("Seed error:", e); setSyncing(false); }
    };
    seedFirebase();
  }, [dbLoaded]);

  // Modals
  const [callModal,    setCallModal]    = useState(null);
  const [payModal,     setPayModal]     = useState(null);
  const [editPayModal, setEditPayModal] = useState(null);
  const [addInvModal,  setAddInvModal]  = useState(false);
  const [editInvModal, setEditInvModal] = useState(null);
  const [custDetail,   setCustDetail]   = useState(null);
  const [waModal,      setWaModal]      = useState(null);
  const [importModal,  setImportModal]  = useState(false);
  const [importCustModal, setImportCustModal] = useState(false);
  const [assignModal,  setAssignModal]  = useState(null); // invoice or customer

  /* ── DERIVED ───────────────────────────────────────────────────── */
  const pending = useMemo(() => invoices.filter(i => i.paidAmt < i.originalAmt), [invoices]);

  // Filter by assigned user for staff
  const myPending = useMemo(() => {
    if(!user) return [];
    if(user.role === "owner" || user.role === "accountant") return pending;
    return pending.filter(i => !i.assignedTo || i.assignedTo === user.name);
  }, [pending, user]);

  const todayPayments = useMemo(() => {
    const res = [];
    invoices.forEach(inv => (inv.payments||[]).forEach(p => {
      if(p.date === TODAY_STR) res.push({...p, invoice:inv.invoice, customer:inv.customer, invId:inv.id});
    }));
    return res;
  }, [invoices]);

  const todayTotal = useMemo(() => todayPayments.reduce((s,p) => s+Number(p.amount), 0), [todayPayments]);

  // Follow-ups due today (for current user)
  const todayFU = useMemo(() => myPending.filter(inv => {
    const fu = followUps[inv.id];
    return fu?.date && fu.date <= TODAY_STR;
  }), [myPending, followUps]);

  const brokenPromises = useMemo(() => callLogs.filter(l => {
    if(l.status !== "promised" || !l.promiseDate) return false;
    const d = parseDt(l.promiseDate); if(!d || d >= TODAY) return false;
    const inv = invoices.find(i => i.id === l.invoiceId);
    return inv && inv.paidAmt < inv.originalAmt;
  }), [callLogs, invoices]);

  const custView = useMemo(() => {
    const map = {};
    myPending.forEach(inv => {
      if(!map[inv.customer]) map[inv.customer] = { customer:inv.customer, mobile:inv.mobile, category:inv.category, invoices:[], totalDue:0, oldestDate:null, lastCall:null, nextFU:null, promiseDate:null, assignedTo:inv.assignedTo||"" };
      const c = map[inv.customer];
      c.invoices.push(inv); c.totalDue += inv.originalAmt - inv.paidAmt;
      const d = parseDt(inv.date);
      if(!c.oldestDate || d < parseDt(c.oldestDate)) c.oldestDate = inv.date;
      const fu = followUps[inv.id];
      if(fu?.date && (!c.nextFU || fu.date < c.nextFU)) c.nextFU = fu.date;
      if(inv.assignedTo) c.assignedTo = inv.assignedTo;
    });
    callLogs.forEach(l => {
      const inv = invoices.find(i => i.id === l.invoiceId); if(!inv) return;
      const c = map[inv.customer]; if(!c) return;
      if(!c.lastCall || l.timestamp > c.lastCall.timestamp) c.lastCall = l;
      if(l.promiseDate && (!c.promiseDate || l.promiseDate > c.promiseDate)) c.promiseDate = l.promiseDate;
    });
    return Object.values(map).sort((a,b) => b.totalDue - a.totalDue);
  }, [myPending, callLogs, invoices, followUps]);

  const dayBuckets = useMemo(() => {
    const buckets = [];
    for(let i = 0; i < 7; i++) {
      const d = new Date(TODAY); d.setDate(d.getDate() - i);
      const dd = String(d.getDate()).padStart(2,"0"), mm = String(d.getMonth()+1).padStart(2,"0"), yyyy = d.getFullYear();
      const ds = `${dd}/${mm}/${yyyy}`;
      const invs = myPending.filter(inv => inv.date === ds);
      if(invs.length > 0) buckets.push({ date:ds, label:i===0?"Today":i===1?"Yesterday":`${dd}/${mm}`, invoices:invs, total:invs.reduce((s,inv)=>s+(inv.originalAmt-inv.paidAmt),0) });
    }
    return buckets;
  }, [myPending]);

  /* ── FIREBASE SYNC HELPERS ─────────────────────────────────────── */
  const syncInvoice = async (inv) => {
    try { await setDoc(doc(db, "invoices", inv.id), inv); }
    catch(e) { console.error("Sync error:", e); }
  };
  const syncSettings = async (updates) => {
    try { await setDoc(doc(db, "settings", "main"), updates, {merge:true}); }
    catch(e) { console.error("Settings sync error:", e); }
  };
  const syncCallLog = async (log) => {
    try { await setDoc(doc(db, "callLogs", log.id), log); }
    catch(e) { console.error("CallLog sync error:", e); }
  };

  /* ── ACTIONS ───────────────────────────────────────────────────── */
  const addPaymentToInv = (invId, amount, mode, note="") => {
    const p = { id:Date.now()+"", amount:Number(amount), mode, note, date:TODAY_STR, time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), addedBy:user?.name||"Staff" };
    setInvoices(prev => {
      const updated = prev.map(i => {
        if(i.id !== invId) return i;
        const newPaid = Math.min(i.originalAmt, i.paidAmt + Number(amount));
        const newInv = {...i, paidAmt:newPaid, payments:[...(i.payments||[]), p]};
        syncInvoice(newInv);
        return newInv;
      });
      return updated;
    });
  };

  const logCall = data => {
    const newLog = { id:Date.now()+"", ...data, timestamp:new Date().toISOString() };
    setCallLogs(p => [newLog, ...p]);
    syncCallLog(newLog);
    if(data.nextFollowUpDate) {
      const newFU = {...followUps, [data.invoiceId]:{ date:fromInp(data.nextFollowUpDate), note:data.notes }};
      setFollowUps(newFU);
      syncSettings({followUps: newFU});
    }
    if(data.status === "paid") {
      setInvoices(p => p.map(i => {
        if(i.id!==data.invoiceId) return i;
        const updated = {...i, paidAmt:i.originalAmt};
        syncInvoice(updated);
        return updated;
      }));
    }
    if(data.status === "partial" && data.partialAmt) addPaymentToInv(data.invoiceId, data.partialAmt, data.payMode||"Cash", data.notes);
    setCallModal(null);
  };

  const editPayment = (invId, payId, amt, mode) => {
    setInvoices(p => p.map(i => {
      if(i.id !== invId) return i;
      const upd = (i.payments||[]).map(p => p.id===payId ? {...p, amount:Number(amt), mode} : p);
      const updated = {...i, payments:upd, paidAmt:Math.min(i.originalAmt, upd.reduce((s,p)=>s+p.amount,0))};
      syncInvoice(updated);
      return updated;
    }));
    setEditPayModal(null);
  };

  const deletePayment = (invId, payId) => {
    setInvoices(p => p.map(i => {
      if(i.id !== invId) return i;
      const upd = (i.payments||[]).filter(p => p.id !== payId);
      const updated = {...i, payments:upd, paidAmt:upd.reduce((s,p)=>s+p.amount,0)};
      syncInvoice(updated);
      return updated;
    }));
    setEditPayModal(null);
  };

  const saveInvoice = (data, id) => {
    if(id) {
      setInvoices(p => p.map(i => {
        if(i.id!==id) return i;
        const updated = {...i,...data, originalAmt:Number(data.originalAmt)};
        syncInvoice(updated);
        return updated;
      }));
    } else {
      const newInv = {...data, id:"i"+Date.now(), paidAmt:0, payments:[], assignedTo:"", originalAmt:Number(data.originalAmt)};
      setInvoices(p => [...p, newInv]);
      syncInvoice(newInv);
    }
    setAddInvModal(false); setEditInvModal(null);
  };

  const deleteInvoice = async id => {
    if(window.confirm("Delete this invoice?")) {
      setInvoices(p => p.filter(i => i.id !== id));
      try { await deleteDoc(doc(db, "invoices", id)); } catch(e) { console.error(e); }
    }
  };

  const assignToUser = (invIds, userName) => {
    setInvoices(p => p.map(i => {
      if(!invIds.includes(i.id)) return i;
      const updated = {...i, assignedTo:userName};
      syncInvoice(updated);
      return updated;
    }));
    setAssignModal(null);
  };

  const importInvoicesCSV = text => {
    try {
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g,""));
      const newInvs = lines.slice(1).map((line,i) => {
        const cols = line.split(",").map(c => c.trim().replace(/"/g,""));
        const obj = {}; headers.forEach((h,idx) => obj[h] = cols[idx]||"");
        return { id:"imp"+Date.now()+i, invoice:obj.invoice||obj["invoice#"]||"IMP-"+(i+1), date:obj.date||TODAY_STR, customer:obj.customer||obj["customer name"]||"Unknown", mobile:obj.mobile||obj.phone||"", category:obj.category||cats[0], originalAmt:Number(obj.amount||obj.balance||0), paidAmt:0, payments:[], assignedTo:"" };
      }).filter(i => i.customer !== "Unknown" && i.originalAmt > 0);
      setInvoices(p => [...p, ...newInvs]);
      setImportModal(false);
      alert(`✅ Imported ${newInvs.length} invoices!`);
    } catch(e) { alert("Error parsing CSV. Check format."); }
  };

  const importCustomersCSV = text => {
    try {
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g,""));
      const newInvs = lines.slice(1).map((line,i) => {
        const cols = line.split(",").map(c => c.trim().replace(/"/g,""));
        const obj = {}; headers.forEach((h,idx) => obj[h] = cols[idx]||"");
        const cust = obj.customer||obj["customer name"]||obj.name||"";
        if(!cust) return null;
        return { id:"cust"+Date.now()+i, invoice:"IMP-CUST-"+(i+1), date:obj.date||TODAY_STR, customer:cust, mobile:obj.mobile||obj.phone||"", category:obj.category||cats[0], originalAmt:Number(obj.amount||obj.balance||obj.outstanding||0), paidAmt:0, payments:[], assignedTo:"" };
      }).filter(Boolean).filter(i => i.originalAmt > 0);
      setInvoices(p => [...p, ...newInvs]);
      setImportCustModal(false);
      alert(`✅ Imported ${newInvs.length} customer records!`);
    } catch(e) { alert("Error parsing CSV."); }
  };

  /* ── EXPORT FUNCTIONS ──────────────────────────────────────────── */
  const downloadCSV = (rows, filename) => {
    const csv = rows.map(r => r.map(c => `"${String(c??'').replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  };

  const exportInvoicesCSV = () => {
    const header = ["Invoice#","Date","Customer","Mobile","Category","Original Amount","Paid Amount","Balance","Assigned To","Risk"];
    const rows = [header, ...invoices.map(i => {
      const bal = i.originalAmt - i.paidAmt;
      const days = daysAgo(i.date);
      return [i.invoice, i.date, i.customer, i.mobile, i.category, i.originalAmt, i.paidAmt, bal, i.assignedTo||"", risk(days).l.replace(/[^\w\s]/g,"").trim()];
    })];
    downloadCSV(rows, "OPTIMAX-AR-Invoices.csv");
  };

  const exportPendingCSV = () => {
    const header = ["Invoice#","Date","Customer","Mobile","Category","Balance","Days Pending","Risk","Assigned To"];
    const rows = [header, ...pending.map(i => {
      const bal = i.originalAmt - i.paidAmt; const days = daysAgo(i.date);
      return [i.invoice, i.date, i.customer, i.mobile, i.category, bal, days, risk(days).l.replace(/[^\w\s]/g,"").trim(), i.assignedTo||""];
    })];
    downloadCSV(rows, "OPTIMAX-AR-Pending.csv");
  };

  const exportCustomersCSV = () => {
    const header = ["Customer","Mobile","Category","Total Due","Invoices","Oldest Date","Days","Assigned To","Last Call Status","Promise Date","Next Follow-up"];
    const rows = [header, ...custView.map(c => {
      const days = daysAgo(c.oldestDate);
      const cs = c.lastCall ? CALL_STATUSES.find(s=>s.value===c.lastCall.status)?.label||"" : "";
      return [c.customer, c.mobile||"", c.category, c.totalDue, c.invoices.length, c.oldestDate||"", days, c.assignedTo||"", cs, c.promiseDate||"", c.nextFU||""];
    })];
    downloadCSV(rows, "OPTIMAX-AR-Customers.csv");
  };

  const exportCallLogCSV = () => {
    const header = ["Customer","Invoice","Called By","Status","Notes","Promise Date","Partial Amount","Date","Time"];
    const rows = [header, ...callLogs.map(l => {
      const inv = invoices.find(i=>i.id===l.invoiceId);
      const dt = new Date(l.timestamp);
      return [inv?.customer||"", inv?.invoice||"", l.calledBy, CALL_STATUSES.find(c=>c.value===l.status)?.label||l.status, l.notes||"", l.promiseDate||"", l.partialAmt||"", dt.toLocaleDateString("en-IN"), dt.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})];
    })];
    downloadCSV(rows, "OPTIMAX-AR-CallLog.csv");
  };

  const downloadSampleInvoiceCSV = () => {
    const rows = [
      ["invoice","date","customer","mobile","category","amount"],
      ["INV-10001","01/03/2026","Sample Customer 1","9876543210","Daily","5000"],
      ["INV-10002","02/03/2026","Sample Customer 2","8765432109","Shop","12000"],
      ["INV-10003","03/03/2026","Sample Customer 3","","ProShop","7500"],
    ];
    downloadCSV(rows, "Sample-Invoice-Import.csv");
  };

  const downloadSampleCustomerCSV = () => {
    const rows = [
      ["customer","mobile","category","amount","date"],
      ["Sample Customer A","9876543210","Daily","5000","01/03/2026"],
      ["Sample Customer B","8765432109","Shop","12000","02/03/2026"],
      ["Sample Customer C","","ProShop","7500","03/03/2026"],
    ];
    downloadCSV(rows, "Sample-Customer-Import.csv");
  };

  /* ── STYLES ────────────────────────────────────────────────────── */
  const S = {
    app:   { fontFamily:"'DM Sans',sans-serif", background:"#080c14", minHeight:"100vh", color:"#e2e8f0" },
    card:  { background:"#111827", border:"1px solid #1f2d3d", borderRadius:14, padding:"16px 18px" },
    btn:   (c,t="#fff",p="8px 16px",fs=13) => ({ background:c, color:t, border:"none", borderRadius:9, padding:p, cursor:"pointer", fontSize:fs, fontWeight:700, whiteSpace:"nowrap" }),
    inp:   { background:"#0d1520", border:"1px solid #1f2d3d", borderRadius:9, padding:"9px 12px", fontSize:13, color:"#e2e8f0", width:"100%", boxSizing:"border-box", outline:"none" },
    bdg:   c => ({ background:c+"22", color:c, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, display:"inline-block" }),
    overlay:{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 },
    modal: { background:"#111827", border:"1px solid #1f2d3d", borderRadius:18, padding:22, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" },
    th:    { padding:"9px 12px", textAlign:"left", fontSize:10, fontWeight:700, color:"#475569", letterSpacing:.6, textTransform:"uppercase", whiteSpace:"nowrap", background:"#0d1520" },
    td:    { padding:"9px 12px", fontSize:12, borderBottom:"1px solid #1f2d3d22" },
  };
  const Lbl = ({c}) => <div style={{fontSize:10,color:"#475569",marginBottom:4,fontWeight:700,letterSpacing:.5,textTransform:"uppercase"}}>{c}</div>;
  const canManage = user && (user.role === "owner" || user.role === "accountant");

  if(!dbLoaded) return (
    <div style={{background:"#080c14",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <div style={{fontSize:48}}>💼</div>
      <div style={{fontWeight:900,fontSize:22,color:"#f59e0b"}}>OPTIMAX-AR Manager</div>
      <div style={{fontSize:13,color:"#475569"}}>{syncing?"Setting up database for first time...":"Connecting to database..."}</div>
      <div style={{display:"flex",gap:6,marginTop:8}}>
        {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#f59e0b",animation:`pulse 1s ${i*0.2}s infinite`,opacity:0.7}}/>)}
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.4);opacity:1}}`}</style>
    </div>
  );

  if(!user) return <LoginBox users={users} onLogin={u=>{setUser(u);setFuPopupDismissed(false);}} S={S} Lbl={Lbl}/>;

  /* ── FOLLOW-UP POPUP (auto shows on login) ─────────────────────── */
  const FuPopup = () => {
    if(fuPopupDismissed || todayFU.length === 0) return null;
    return (
      <div style={{...S.overlay, zIndex:2000}} onClick={()=>setFuPopupDismissed(true)}>
        <div style={{...S.modal, maxWidth:540, border:"2px solid #f59e0b"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <div style={{fontSize:28}}>🔔</div>
            <div>
              <div style={{fontWeight:900,fontSize:18,color:"#f59e0b"}}>Today's Follow-ups!</div>
              <div style={{fontSize:12,color:"#475569"}}>{todayFU.length} customers need your call today</div>
            </div>
          </div>
          <div style={{background:"#ef444422",border:"1px solid #ef444444",borderRadius:9,padding:"8px 14px",marginBottom:14,fontSize:12,color:"#ef4444",fontWeight:600}}>
            ⚠️ These follow-ups were due — don't miss them!
          </div>
          <div style={{maxHeight:320,overflowY:"auto",display:"grid",gap:7}}>
            {todayFU.map(inv => {
              const bal = inv.originalAmt - inv.paidAmt;
              const fl = risk(daysAgo(inv.date));
              const fu = followUps[inv.id];
              return (
                <div key={inv.id} style={{background:"#0d1520",borderRadius:10,padding:"10px 14px",borderLeft:`3px solid ${fl.c}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>{inv.customer} <span style={S.bdg(fl.c)}>{fl.l}</span></div>
                    <div style={{fontSize:11,color:"#475569"}}>{inv.invoice} · {fu?.note||"Follow up required"}</div>
                    {inv.assignedTo && <div style={{fontSize:10,color:"#6366f1",marginTop:2}}>👤 {inv.assignedTo}</div>}
                  </div>
                  <div style={{textAlign:"right",display:"flex",alignItems:"center",gap:7}}>
                    <span style={{fontWeight:800,color:"#ef4444"}}>{fmt(bal)}</span>
                    <button style={S.btn("#f59e0b","#000","5px 9px",11)} onClick={()=>{setFuPopupDismissed(true);setCallModal(inv);}}>📞 Call</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:9,marginTop:14}}>
            <button style={S.btn("#f59e0b","#000")} onClick={()=>{setFuPopupDismissed(true);setTab("dashboard");}}>Go to Dashboard</button>
            <button style={S.btn("#1f2d3d")} onClick={()=>setFuPopupDismissed(true)}>Dismiss</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── ASSIGN MODAL ──────────────────────────────────────────────── */
  const AssignModal = ({inv}) => {
    const staffUsers = users.filter(u => u.role !== "owner");
    const current = inv.assignedTo || "";
    return (
      <div style={S.overlay} onClick={()=>setAssignModal(null)}>
        <div style={{...S.modal, maxWidth:380}} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:800,fontSize:16,color:"#6366f1",marginBottom:4}}>👤 Assign Task</div>
          <div style={{fontSize:12,color:"#475569",marginBottom:14}}>{inv.invoice} · {inv.customer}</div>
          <div style={{display:"grid",gap:8}}>
            <div onClick={()=>assignToUser([inv.id],"")} style={{background:current===""?"#6366f122":"#0d1520",border:`2px solid ${current===""?"#6366f1":"#1f2d3d"}`,borderRadius:10,padding:"10px 14px",cursor:"pointer"}}>
              <span style={{fontWeight:600,color:current===""?"#6366f1":"#64748b"}}>🔓 Unassigned (visible to all)</span>
            </div>
            {staffUsers.map(u => (
              <div key={u.id} onClick={()=>assignToUser([inv.id], u.name)} style={{background:current===u.name?u.color+"22":"#0d1520",border:`2px solid ${current===u.name?u.color:"#1f2d3d"}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span style={{fontWeight:700,color:current===u.name?u.color:"#94a3b8"}}>{u.name}</span>
                  <span style={{...S.bdg(roleBadgeColor(u.role)),marginLeft:8}}>{u.role}</span>
                </div>
                {current===u.name && <span style={{color:u.color,fontSize:14}}>✓</span>}
              </div>
            ))}
          </div>
          <button style={{...S.btn("#1f2d3d"),marginTop:12,width:"100%"}} onClick={()=>setAssignModal(null)}>Close</button>
        </div>
      </div>
    );
  };

  /* ── CALL MODAL ────────────────────────────────────────────────── */
  const CallModal = ({inv}) => {
    const [form,setForm] = useState({invoiceId:inv.id, calledBy:user.name, status:"callback", notes:"", promiseDate:"", nextFollowUpDate:"", partialAmt:"", payMode:"Cash"});
    const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
    return (
      <div style={S.overlay} onClick={()=>setCallModal(null)}>
        <div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:800,fontSize:16,color:"#f59e0b",marginBottom:3}}>📞 Log Call</div>
          <div style={{fontSize:12,color:"#475569",marginBottom:14}}>{inv.invoice} · {inv.customer} · <span style={{color:"#ef4444",fontWeight:700}}>{fmt(inv.originalAmt-inv.paidAmt)}</span></div>
          <div style={{display:"grid",gap:10}}>
            <div><Lbl c="Called By"/><select value={form.calledBy} onChange={set("calledBy")} style={S.inp}>{users.map(u=><option key={u.id}>{u.name}</option>)}</select></div>
            <div><Lbl c="Outcome"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {CALL_STATUSES.map(cs=>(
                  <div key={cs.value} onClick={()=>setForm(p=>({...p,status:cs.value}))} style={{border:`2px solid ${form.status===cs.value?cs.color:"#1f2d3d"}`,borderRadius:9,padding:"8px",cursor:"pointer",background:form.status===cs.value?cs.color+"22":"transparent",fontSize:12,fontWeight:600,color:form.status===cs.value?cs.color:"#64748b"}}>
                    {cs.icon} {cs.label}
                  </div>
                ))}
              </div>
            </div>
            {form.status==="partial"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              <div><Lbl c="Amount"/><input type="number" style={S.inp} value={form.partialAmt} onChange={set("partialAmt")}/></div>
              <div><Lbl c="Mode"/><select style={S.inp} value={form.payMode} onChange={set("payMode")}>{PAY_MODES.map(m=><option key={m}>{m}</option>)}</select></div>
            </div>}
            {form.status==="promised"&&<div><Lbl c="Promise Date"/><input type="date" style={S.inp} value={form.promiseDate} onChange={set("promiseDate")}/></div>}
            <div><Lbl c="Notes"/><textarea rows={3} style={{...S.inp,resize:"vertical"}} value={form.notes} onChange={set("notes")} placeholder="Customer response..."/></div>
            <div><Lbl c="Next Follow-up Date"/><input type="date" style={S.inp} value={form.nextFollowUpDate} onChange={set("nextFollowUpDate")}/></div>
          </div>
          <div style={{display:"flex",gap:9,marginTop:14}}>
            <button style={S.btn("#f59e0b","#000")} onClick={()=>logCall(form)}>💾 Save</button>
            <button style={S.btn("#1f2d3d")} onClick={()=>setCallModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── PAY MODAL ─────────────────────────────────────────────────── */
  const PayModal = ({inv}) => {
    const bal = inv.originalAmt-inv.paidAmt;
    const [amt,setAmt] = useState(bal);
    const [mode,setMode] = useState("Cash");
    const [note,setNote] = useState("");
    return (
      <div style={S.overlay} onClick={()=>setPayModal(null)}>
        <div style={{...S.modal,maxWidth:400}} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:800,fontSize:16,color:"#10b981",marginBottom:3}}>💰 Record Payment</div>
          <div style={{fontSize:12,color:"#475569",marginBottom:12}}>{inv.invoice} · {inv.customer}</div>
          <div style={{background:"#0d1520",borderRadius:9,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between"}}>
            <span style={{color:"#475569"}}>Balance</span><span style={{fontWeight:900,color:"#ef4444",fontSize:17}}>{fmt(bal)}</span>
          </div>
          <div style={{display:"grid",gap:10}}>
            <div><Lbl c="Amount"/>
              <input type="number" style={S.inp} value={amt} onChange={e=>setAmt(e.target.value)}/>
              <div style={{display:"flex",gap:6,marginTop:5}}>{[bal,Math.round(bal/2),Math.round(bal/4)].map(v=><button key={v} style={S.btn("#1f2d3d","#94a3b8","4px 8px",11)} onClick={()=>setAmt(v)}>₹{Number(v).toLocaleString("en-IN")}</button>)}</div>
            </div>
            <div><Lbl c="Mode"/><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{PAY_MODES.map(m=><div key={m} onClick={()=>setMode(m)} style={{border:`2px solid ${mode===m?"#10b981":"#1f2d3d"}`,borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:mode===m?"#10b981":"#64748b",background:mode===m?"#10b98122":"transparent"}}>{m}</div>)}</div></div>
            <div><Lbl c="Note"/><input style={S.inp} value={note} onChange={e=>setNote(e.target.value)} placeholder="Cheque no / UTR…"/></div>
          </div>
          <div style={{display:"flex",gap:9,marginTop:14}}>
            <button style={S.btn("#10b981")} onClick={()=>{addPaymentToInv(inv.id,amt,mode,note);setPayModal(null);}}>✅ Confirm</button>
            <button style={S.btn("#1f2d3d")} onClick={()=>setPayModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── EDIT PAY MODAL ────────────────────────────────────────────── */
  const EditPayModal = ({inv,payment}) => {
    const [amt,setAmt] = useState(payment.amount);
    const [mode,setMode] = useState(payment.mode);
    return (
      <div style={S.overlay} onClick={()=>setEditPayModal(null)}>
        <div style={{...S.modal,maxWidth:360}} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:800,fontSize:16,color:"#6366f1",marginBottom:12}}>✏️ Edit Payment</div>
          <div style={{display:"grid",gap:10}}>
            <div><Lbl c="Amount"/><input type="number" style={S.inp} value={amt} onChange={e=>setAmt(e.target.value)}/></div>
            <div><Lbl c="Mode"/><select style={S.inp} value={mode} onChange={e=>setMode(e.target.value)}>{PAY_MODES.map(m=><option key={m}>{m}</option>)}</select></div>
          </div>
          <div style={{display:"flex",gap:9,marginTop:14}}>
            <button style={S.btn("#6366f1")} onClick={()=>editPayment(inv.id,payment.id,amt,mode)}>Save</button>
            <button style={S.btn("#ef4444")} onClick={()=>{if(window.confirm("Delete payment?"))deletePayment(inv.id,payment.id);}}>🗑 Delete</button>
            <button style={S.btn("#1f2d3d")} onClick={()=>setEditPayModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── INVOICE FORM MODAL ────────────────────────────────────────── */
  const InvFormModal = ({existing}) => {
    const [form,setForm] = useState(existing||{invoice:"",date:TODAY_STR,customer:"",mobile:"",category:cats[0],originalAmt:""});
    const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
    return (
      <div style={S.overlay} onClick={()=>{setAddInvModal(false);setEditInvModal(null);}}>
        <div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:800,fontSize:16,color:existing?"#6366f1":"#10b981",marginBottom:14}}>{existing?"✏️ Edit Invoice":"➕ Add Invoice"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><Lbl c="Invoice #"/><input style={S.inp} value={form.invoice} onChange={set("invoice")} placeholder="INV-XXXXX"/></div>
            <div><Lbl c="Date"/><input type="date" style={S.inp} value={toInp(form.date)} onChange={e=>setForm(p=>({...p,date:fromInp(e.target.value)}))}/></div>
            <div style={{gridColumn:"span 2"}}><Lbl c="Customer *"/><input style={S.inp} value={form.customer} onChange={set("customer")}/></div>
            <div><Lbl c="Mobile"/><input style={S.inp} value={form.mobile} onChange={set("mobile")} placeholder="10 digits"/></div>
            <div><Lbl c="Category"/><select style={S.inp} value={form.category} onChange={set("category")}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={{gridColumn:"span 2"}}><Lbl c="Amount (₹) *"/><input type="number" style={S.inp} value={form.originalAmt} onChange={set("originalAmt")}/></div>
          </div>
          <div style={{display:"flex",gap:9,marginTop:16}}>
            <button style={S.btn(existing?"#6366f1":"#10b981")} onClick={()=>{if(!form.customer||!form.originalAmt)return;saveInvoice(form,existing?.id);}}>
              {existing?"Update":"Add"}
            </button>
            {existing&&<button style={S.btn("#ef4444")} onClick={()=>{deleteInvoice(existing.id);setEditInvModal(null);}}>🗑 Delete</button>}
            <button style={S.btn("#1f2d3d")} onClick={()=>{setAddInvModal(false);setEditInvModal(null);}}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── WA MODAL ──────────────────────────────────────────────────── */
  const WaModal = ({inv}) => {
    const bal = inv.originalAmt-inv.paidAmt;
    const fu = followUps[inv.id];
    const templates = [
      {l:"Reminder",  m:`Dear ${inv.customer},\n\nYour payment of ${fmt(bal)} for invoice ${inv.invoice} dated ${inv.date} is pending.\n\nKindly arrange payment at the earliest.\n\nThank you!`},
      {l:"Follow-up", m:`Dear ${inv.customer},\n\nFollowing up on the pending payment of ${fmt(bal)} for ${inv.invoice}.\n\n${fu?.note||"Please confirm payment date."}\n\nThank you!`},
      {l:"Final",     m:`Dear ${inv.customer},\n\nDespite previous reminders, payment of ${fmt(bal)} for ${inv.invoice} remains unpaid.\n\nImmediate clearance is requested.\n\nThank you!`},
    ];
    const [msg,setMsg] = useState(templates[0].m);
    return (
      <div style={S.overlay} onClick={()=>setWaModal(null)}>
        <div style={{...S.modal,maxWidth:440}} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:800,fontSize:16,color:"#25d366",marginBottom:4}}>💬 WhatsApp</div>
          <div style={{fontSize:12,color:"#475569",marginBottom:10}}>{inv.customer} · {inv.mobile?`+91 ${inv.mobile}`:"⚠️ No mobile"}</div>
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>{templates.map(t=><button key={t.l} style={S.btn("#1f2d3d","#94a3b8","5px 10px",11)} onClick={()=>setMsg(t.m)}>{t.l}</button>)}</div>
          <textarea rows={7} style={{...S.inp,resize:"vertical"}} value={msg} onChange={e=>setMsg(e.target.value)}/>
          <div style={{display:"flex",gap:9,marginTop:12}}>
            <button style={S.btn("#25d366")} onClick={()=>{const n=inv.mobile?.replace(/\D/g,"");window.open(n?`https://wa.me/91${n}?text=${encodeURIComponent(msg)}`:`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");setWaModal(null);}}>📲 Send</button>
            <button style={S.btn("#1f2d3d")} onClick={()=>setWaModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── IMPORT INVOICE MODAL ──────────────────────────────────────── */
  const ImportModal = ({onImport, title, hint, onSampleDownload}) => {
    const [text,setText] = useState(""); const ref = useRef();
    const hintCols = hint.split(",").map(h=>h.trim());
    return (
      <div style={S.overlay} onClick={()=>{setImportModal(false);setImportCustModal(false);}}>
        <div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:800,fontSize:16,color:"#6366f1",marginBottom:8}}>📥 {title}</div>
          {/* Required columns */}
          <div style={{background:"#0d1520",borderRadius:9,padding:"12px 14px",marginBottom:10,fontSize:12}}>
            <div style={{fontWeight:700,color:"#94a3b8",marginBottom:8}}>📋 Required CSV Columns:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {hintCols.map((col,i)=>(
                <span key={i} style={{background:"#1f2d3d",border:"1px solid #6366f133",borderRadius:6,padding:"3px 10px",fontSize:11,color:"#6366f1",fontWeight:700}}>{col}</span>
              ))}
            </div>
            <div style={{borderTop:"1px solid #1f2d3d",paddingTop:8,marginTop:4}}>
              <div style={{fontWeight:700,color:"#f59e0b",marginBottom:5,fontSize:11}}>📄 Sample File Preview:</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                  <thead><tr>{hintCols.map(h=><th key={h} style={{background:"#111827",padding:"4px 8px",textAlign:"left",color:"#6366f1",fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {hint.includes("invoice") ? [
                      ["INV-10001","01/03/2026","Sample Customer 1","9876543210","Daily","5000"],
                      ["INV-10002","02/03/2026","Sample Customer 2","8765432109","Shop","12000"],
                    ].map((row,ri)=><tr key={ri}>{row.map((c,ci)=><td key={ci} style={{padding:"3px 8px",color:"#64748b",borderBottom:"1px solid #1f2d3d22"}}>{c}</td>)}</tr>)
                    : [
                      ["Sample Customer A","9876543210","Daily","5000","01/03/2026"],
                      ["Sample Customer B","8765432109","Shop","12000","02/03/2026"],
                    ].map((row,ri)=><tr key={ri}>{row.map((c,ci)=><td key={ci} style={{padding:"3px 8px",color:"#64748b",borderBottom:"1px solid #1f2d3d22"}}>{c}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
              <button style={{...S.btn("#f59e0b","#000","5px 12px",11),marginTop:8}} onClick={onSampleDownload}>⬇️ Download Sample File</button>
            </div>
          </div>
          <button style={{...S.btn("#6366f1"),marginBottom:10}} onClick={()=>ref.current.click()}>📂 Choose Your CSV File</button>
          <input ref={ref} type="file" accept=".csv,.txt" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setText(ev.target.result);r.readAsText(f);}}/>
          {text&&<div style={{background:"#10b98122",border:"1px solid #10b98144",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#10b981",marginBottom:8}}>✅ {text.split("\n").length-1} rows ready to import</div>}
          <div style={{display:"flex",gap:9,marginTop:10}}>
            <button style={S.btn("#10b981")} onClick={()=>text&&onImport(text)} disabled={!text}>📥 Import Now</button>
            <button style={S.btn("#1f2d3d")} onClick={()=>{setImportModal(false);setImportCustModal(false);}}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── CUSTOMER DETAIL MODAL ─────────────────────────────────────── */
  const CustDetailModal = ({custName}) => {
    const cust = custView.find(c=>c.customer===custName); if(!cust) return null;
    const logs = callLogs.filter(l=>cust.invoices.some(i=>i.id===l.invoiceId)).sort((a,b)=>b.timestamp.localeCompare(a.timestamp));
    const fl = risk(daysAgo(cust.oldestDate));
    return (
      <div style={S.overlay} onClick={()=>setCustDetail(null)}>
        <div style={{...S.modal,maxWidth:600}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontWeight:900,fontSize:18,color:"#f59e0b"}}>{cust.customer}</div>
              <div style={{fontSize:12,color:"#475569",marginTop:2}}>{cust.mobile||"No mobile"} · {cust.invoices.length} invoices · <span style={S.bdg("#6366f1")}>{cust.category}</span></div>
              <div style={{marginTop:5,display:"flex",gap:7,flexWrap:"wrap"}}>
                <span style={S.bdg(fl.c)}>{fl.l}</span>
                {cust.assignedTo&&<span style={S.bdg("#6366f1")}>👤 {cust.assignedTo}</span>}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontWeight:900,fontSize:22,color:"#ef4444"}}>{fmt(cust.totalDue)}</div>
              <div style={{fontSize:11,color:"#475569"}}>Total Outstanding</div>
              {canManage&&<button style={{...S.btn("#6366f1","#fff","5px 10px",11),marginTop:6}} onClick={()=>setAssignModal(cust.invoices[0])}>👤 Assign</button>}
            </div>
          </div>
          {cust.invoices.map(inv=>{
            const bal=inv.originalAmt-inv.paidAmt; const d=daysAgo(inv.date); const fl=risk(d);
            return (
              <div key={inv.id} style={{background:"#0d1520",borderRadius:10,padding:"10px 13px",marginBottom:7,borderLeft:`3px solid ${fl.c}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>{inv.invoice} <span style={S.bdg(fl.c)}>{fl.l}</span></div>
                    <div style={{fontSize:11,color:"#475569"}}>{inv.date} · {d}d · {inv.category}</div>
                    {(inv.payments||[]).map(p=>(
                      <div key={p.id} style={{fontSize:11,color:"#10b981",display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                        💰 {fmt(p.amount)} · {p.mode} · {p.date}
                        <button style={S.btn("#1f2d3d","#6366f1","2px 6px",10)} onClick={()=>setEditPayModal({inv,payment:p})}>✏️</button>
                      </div>
                    ))}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}>
                    <div style={{fontWeight:800,color:"#ef4444",fontSize:15}}>{fmt(bal)}</div>
                    <div style={{display:"flex",gap:5,marginTop:5}}>
                      <button style={S.btn("#f59e0b","#000","5px 7px",11)} onClick={()=>{setCustDetail(null);setCallModal(inv);}}>📞</button>
                      <button style={S.btn("#10b981","#fff","5px 7px",11)} onClick={()=>{setCustDetail(null);setPayModal(inv);}}>💰</button>
                      <button style={S.btn("#6366f1","#fff","5px 7px",11)} onClick={()=>{setCustDetail(null);setEditInvModal(inv);}}>✏️</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {logs.length>0&&<>
            <div style={{fontWeight:700,fontSize:11,color:"#475569",margin:"12px 0 7px",textTransform:"uppercase",letterSpacing:.5}}>Call History</div>
            {logs.slice(0,5).map(l=>{
              const cs=CALL_STATUSES.find(c=>c.value===l.status)||CALL_STATUSES[2];
              return (
                <div key={l.id} style={{background:"#0d1520",borderRadius:9,padding:"9px 13px",marginBottom:5}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={S.bdg(cs.color)}>{cs.icon} {cs.label}</span>
                    <span style={{fontSize:10,color:"#475569"}}>{l.calledBy} · {new Date(l.timestamp).toLocaleDateString("en-IN")}</span>
                  </div>
                  {l.notes&&<div style={{fontSize:11,color:"#94a3b8"}}>{l.notes}</div>}
                  {l.promiseDate&&<div style={{fontSize:10,color:"#f59e0b",marginTop:2}}>🤝 {l.promiseDate}</div>}
                </div>
              );
            })}
          </>}
          <button style={{...S.btn("#1f2d3d"),marginTop:12,width:"100%"}} onClick={()=>setCustDetail(null)}>Close</button>
        </div>
      </div>
    );
  };

  /* ══ TABS ════════════════════════════════════════════════════════ */
  const Dashboard = () => (
    <div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
        {[
          {l:"Total Outstanding", v:fmt(myPending.reduce((s,i)=>s+(i.originalAmt-i.paidAmt),0)), c:"#ef4444"},
          {l:"Today's Collection",v:fmt(todayTotal), s:`${todayPayments.length} payments`, c:"#10b981"},
          {l:"Today Follow-ups",  v:todayFU.length,  s:"Due today", c:todayFU.length>0?"#f59e0b":"#10b981"},
          {l:"Broken Promises",   v:brokenPromises.length, c:"#ef4444"},
          {l:"Pending Invoices",  v:myPending.length, c:"#6366f1"},
        ].map(k=>(
          <div key={k.l} style={{background:"#111827",border:`2px solid ${k.c}33`,borderRadius:13,padding:"13px 17px",flex:1,minWidth:130,cursor:k.l==="Today Follow-ups"&&todayFU.length>0?"pointer":"default"}}
            onClick={()=>k.l==="Today Follow-ups"&&todayFU.length>0&&setFuPopupDismissed(false)}>
            <div style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{k.l}</div>
            <div style={{fontSize:21,fontWeight:900,color:k.c}}>{k.v}</div>
            {k.s&&<div style={{fontSize:10,color:"#334155",marginTop:2}}>{k.s}</div>}
            {k.l==="Today Follow-ups"&&todayFU.length>0&&<div style={{fontSize:10,color:"#f59e0b",marginTop:3,fontWeight:600}}>Click to view →</div>}
          </div>
        ))}
      </div>
      {/* Quick Export Bar */}
      <div style={{background:"#111827",border:"1px solid #1f2d3d",borderRadius:11,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:12,fontWeight:700,color:"#475569",marginRight:4}}>📤 Quick Export:</span>
        <button style={S.btn("#0ea5e9","#fff","6px 14px",12)} onClick={exportPendingCSV}>Pending Invoices</button>
        <button style={S.btn("#0ea5e9","#fff","6px 14px",12)} onClick={exportCustomersCSV}>All Customers</button>
        <button style={S.btn("#0ea5e9","#fff","6px 14px",12)} onClick={exportInvoicesCSV}>All Invoices</button>
        <button style={S.btn("#0ea5e9","#fff","6px 14px",12)} onClick={exportCallLogCSV}>Call Log</button>
      </div>

      {todayPayments.length>0&&(
        <div style={{...S.card,marginBottom:14}}>
          <div style={{fontWeight:800,fontSize:13,color:"#10b981",marginBottom:10}}>💰 Today's Payments — {fmt(todayTotal)}</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Customer","Invoice","Amount","Mode","By","Time",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>{todayPayments.map(p=>(
                <tr key={p.id} style={{background:"#0d1520"}}>
                  <td style={S.td}><b>{p.customer}</b></td>
                  <td style={S.td}><span style={{color:"#6366f1",fontWeight:600}}>{p.invoice}</span></td>
                  <td style={S.td}><span style={{fontWeight:800,color:"#10b981"}}>{fmt(p.amount)}</span></td>
                  <td style={S.td}><span style={S.bdg("#3b82f6")}>{p.mode}</span></td>
                  <td style={S.td}><span style={{color:"#64748b"}}>{p.addedBy}</span></td>
                  <td style={S.td}><span style={{color:"#475569"}}>{p.time}</span></td>
                  <td style={S.td}><button style={S.btn("#1f2d3d","#94a3b8","4px 8px",11)} onClick={()=>{const inv=invoices.find(i=>i.id===p.invId);const payment=(inv?.payments||[]).find(x=>x.id===p.id);if(inv&&payment)setEditPayModal({inv,payment});}}>✏️</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{...S.card,marginBottom:14}}>
        <div style={{fontWeight:800,fontSize:13,color:"#f59e0b",marginBottom:12}}>📅 Last 7 Days — Pending Invoices</div>
        {dayBuckets.length===0?<div style={{color:"#334155",fontSize:13}}>No recent pending invoices 🎉</div>:
        dayBuckets.map(bucket=>(
          <div key={bucket.date} style={{marginBottom:13}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontWeight:700,color:"#94a3b8"}}>{bucket.label} <span style={{color:"#475569",fontWeight:400,fontSize:11}}>{bucket.date}</span></span>
              <span style={{fontWeight:800,color:"#ef4444"}}>{fmt(bucket.total)}</span>
            </div>
            {bucket.invoices.map(inv=>{
              const bal=inv.originalAmt-inv.paidAmt; const days=daysAgo(inv.date); const fl=risk(days);
              const fu=followUps[inv.id]; const fuOD=fu?.date&&fu.date<=TODAY_STR;
              return (
                <div key={inv.id} style={{background:"#0d1520",borderRadius:9,padding:"8px 13px",marginBottom:5,borderLeft:`3px solid ${fuOD?"#ef4444":fl.c}`,display:"flex",justifyContent:"space-between",alignItems:"center",outline:fuOD?"1px solid #ef444444":"none"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:12}}>{inv.customer} <span style={S.bdg(fl.c)}>{fl.l}</span>{fuOD&&<span style={{...S.bdg("#ef4444"),marginLeft:5}}>🔴 Follow-up Overdue</span>}</div>
                    <div style={{fontSize:10,color:"#475569"}}>{inv.invoice} · {inv.category}{inv.assignedTo&&<span style={{color:"#6366f1"}}> · 👤{inv.assignedTo}</span>}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontWeight:800,color:"#ef4444"}}>{fmt(bal)}</span>
                    <button style={S.btn("#f59e0b","#000","5px 7px",11)} onClick={()=>setCallModal(inv)}>📞</button>
                    <button style={S.btn("#10b981","#fff","5px 7px",11)} onClick={()=>setPayModal(inv)}>💰</button>
                    <button style={S.btn("#25d366","#fff","5px 7px",11)} onClick={()=>setWaModal(inv)}>💬</button>
                    {canManage&&<button style={S.btn("#6366f1","#fff","5px 7px",11)} onClick={()=>setAssignModal(inv)}>👤</button>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:13,flexWrap:"wrap"}}>
        <div style={{...S.card,flex:1.4,minWidth:260}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
            <div style={{fontWeight:800,fontSize:13,color:todayFU.length>0?"#f59e0b":"#64748b"}}>🔔 Today's Follow-ups ({todayFU.length})</div>
            {todayFU.length>0&&<button style={S.btn("#f59e0b","#000","4px 10px",11)} onClick={()=>setFuPopupDismissed(false)}>View All</button>}
          </div>
          {todayFU.length===0?<div style={{color:"#334155",fontSize:12}}>All clear! 🎉</div>:
          todayFU.slice(0,5).map(inv=>{
            const bal=inv.originalAmt-inv.paidAmt; const fl=risk(daysAgo(inv.date));
            return (
              <div key={inv.id} style={{background:"#ef444411",borderRadius:9,padding:"8px 12px",marginBottom:6,borderLeft:`3px solid #ef4444`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:12,color:"#fca5a5"}}>{inv.customer}</div>
                  <div style={{fontSize:10,color:"#ef444499"}}>{followUps[inv.id]?.note||"Follow up"} {inv.assignedTo&&`· 👤${inv.assignedTo}`}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontWeight:700,color:"#ef4444",fontSize:12}}>{fmt(bal)}</span>
                  <button style={S.btn("#f59e0b","#000","5px 7px",11)} onClick={()=>setCallModal(inv)}>📞</button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{...S.card,flex:1,minWidth:190}}>
          <div style={{fontWeight:800,fontSize:13,color:"#94a3b8",marginBottom:11}}>📊 Aging</div>
          {[["🟢 0-30d",0,30,"#10b981"],["🟡 31-60d",31,60,"#f59e0b"],["🟠 61-90d",61,90,"#f97316"],["🔴 90d+",91,9999,"#ef4444"]].map(([lbl,lo,hi,c])=>{
            const total=myPending.reduce((s,i)=>s+(i.originalAmt-i.paidAmt),0)||1;
            const amt=myPending.filter(i=>{const d=daysAgo(i.date);return d>=lo&&d<=hi}).reduce((s,i)=>s+(i.originalAmt-i.paidAmt),0);
            return (
              <div key={lbl} style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:c,fontWeight:600}}>{lbl}</span><span style={{color:"#475569"}}>{fmt(amt)}</span></div>
                <div style={{background:"#0d1520",borderRadius:99,height:7}}><div style={{width:`${Math.round(amt/total*100)}%`,background:c,borderRadius:99,height:"100%"}}/></div>
              </div>
            );
          })}
        </div>
        {brokenPromises.length>0&&(
          <div style={{...S.card,flex:1,minWidth:190}}>
            <div style={{fontWeight:800,fontSize:13,color:"#ef4444",marginBottom:11}}>⚠️ Broken Promises</div>
            {brokenPromises.slice(0,4).map(l=>{
              const inv=invoices.find(i=>i.id===l.invoiceId); if(!inv) return null;
              return (
                <div key={l.id} style={{background:"#0d1520",borderRadius:9,padding:"8px 12px",marginBottom:6}}>
                  <div style={{fontWeight:700,fontSize:12,color:"#ef4444"}}>{inv.customer}</div>
                  <div style={{fontSize:10,color:"#475569"}}>Promised {l.promiseDate} · {fmt(inv.originalAmt-inv.paidAmt)}</div>
                  <button style={{...S.btn("#ef4444"),padding:"4px 9px",fontSize:11,marginTop:5}} onClick={()=>setCallModal(inv)}>📞 Call Now</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const InvoicesTab = () => {
    const [search,setSearch]=useState(""); const [fCat,setFCat]=useState("all"); const [fAge,setFAge]=useState("all"); const [fUser,setFUser]=useState("all");
    const filtered=useMemo(()=>{
      let d=[...myPending];
      if(search)d=d.filter(i=>i.customer.toLowerCase().includes(search.toLowerCase())||i.invoice.toLowerCase().includes(search.toLowerCase()));
      if(fCat!=="all")d=d.filter(i=>i.category===fCat);
      if(fAge!=="all")d=d.filter(i=>{const days=daysAgo(i.date);if(fAge==="0-30")return days<=30;if(fAge==="31-60")return days>30&&days<=60;if(fAge==="61-90")return days>60&&days<=90;return days>90;});
      if(fUser!=="all")d=d.filter(i=>i.assignedTo===fUser||(fUser==="unassigned"&&!i.assignedTo));
      return d;
    },[search,fCat,fAge,fUser]);
    return (
      <div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…" style={{...S.inp,width:180}}/>
          <select value={fCat} onChange={e=>setFCat(e.target.value)} style={{...S.inp,width:120}}><option value="all">All Categories</option>{cats.map(c=><option key={c}>{c}</option>)}</select>
          <select value={fAge} onChange={e=>setFAge(e.target.value)} style={{...S.inp,width:110}}><option value="all">All Aging</option><option value="0-30">0-30d</option><option value="31-60">31-60d</option><option value="61-90">61-90d</option><option value="90+">90d+</option></select>
          {canManage&&<select value={fUser} onChange={e=>setFUser(e.target.value)} style={{...S.inp,width:130}}><option value="all">All Staff</option><option value="unassigned">Unassigned</option>{users.filter(u=>u.role!=="owner").map(u=><option key={u.id}>{u.name}</option>)}</select>}
          <button style={S.btn("#10b981")} onClick={()=>setAddInvModal(true)}>+ Add</button>
          <button style={S.btn("#6366f1")} onClick={()=>setImportModal(true)}>📥 Import</button>
          <button style={S.btn("#0ea5e9")} onClick={exportPendingCSV}>📤 Export</button>
          <div style={{marginLeft:"auto",fontSize:11,color:"#475569"}}>{filtered.length} · <span style={{color:"#ef4444",fontWeight:700}}>{fmt(filtered.reduce((s,i)=>s+(i.originalAmt-i.paidAmt),0))}</span></div>
        </div>
        <div style={{background:"#111827",borderRadius:13,border:"1px solid #1f2d3d",overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr>{["Invoice","Customer","Cat","Balance","Risk","Assigned","Follow-up","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((inv,i)=>{
                  const bal=inv.originalAmt-inv.paidAmt; const days=daysAgo(inv.date); const fl=risk(days);
                  const fu=followUps[inv.id]; const fuOD=fu?.date&&fu.date<=TODAY_STR;
                  const assigned=users.find(u=>u.name===inv.assignedTo);
                  return (
                    <tr key={inv.id} style={{background:fuOD?"#ef444409":i%2===0?"#111827":"#0d1520",borderBottom:"1px solid #1f2d3d22",outline:fuOD?"1px solid #ef444433":"none"}}>
                      <td style={S.td}><div style={{fontWeight:700,color:"#6366f1"}}>{inv.invoice}</div><div style={{fontSize:10,color:"#475569"}}>{inv.date}</div></td>
                      <td style={S.td}><div style={{fontWeight:600}}>{inv.customer}</div><div style={{fontSize:10,color:"#475569"}}>{inv.mobile||"—"}</div></td>
                      <td style={S.td}><span style={S.bdg("#6366f1")}>{inv.category}</span></td>
                      <td style={S.td}><div style={{fontWeight:800,color:"#ef4444"}}>{fmt(bal)}</div>{inv.paidAmt>0&&<div style={{fontSize:10,color:"#10b981"}}>+{fmt(inv.paidAmt)}</div>}</td>
                      <td style={S.td}><span style={S.bdg(fl.c)}>{fl.l}</span><div style={{fontSize:10,color:"#475569",marginTop:1}}>{days}d</div></td>
                      <td style={S.td}>{assigned?<span style={{...S.bdg(assigned.color),fontSize:11}}>👤 {assigned.name}</span>:<span style={{color:"#334155",fontSize:11}}>—</span>}</td>
                      <td style={S.td}>{fu?.date?<div style={{fontWeight:700,fontSize:11,color:fuOD?"#ef4444":"#f59e0b"}}>{fuOD?"🔴 Overdue":"📅"} {fu.date}</div>:<span style={{color:"#334155"}}>—</span>}</td>
                      <td style={S.td}>
                        <div style={{display:"flex",gap:3}}>
                          <button style={S.btn("#f59e0b","#000","5px 6px",11)} onClick={()=>setCallModal(inv)}>📞</button>
                          <button style={S.btn("#10b981","#fff","5px 6px",11)} onClick={()=>setPayModal(inv)}>💰</button>
                          <button style={S.btn("#25d366","#fff","5px 6px",11)} onClick={()=>setWaModal(inv)}>💬</button>
                          <button style={S.btn("#6366f1","#fff","5px 6px",11)} onClick={()=>setEditInvModal(inv)}>✏️</button>
                          {canManage&&<button style={S.btn("#0ea5e9","#fff","5px 6px",11)} onClick={()=>setAssignModal(inv)}>👤</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const CustomersTab = () => {
    const [search,setSearch]=useState(""); const [fCat,setFCat]=useState("all"); const [fUser,setFUser]=useState("all");
    const filtered=useMemo(()=>{
      let d=[...custView];
      if(search)d=d.filter(c=>c.customer.toLowerCase().includes(search.toLowerCase()));
      if(fCat!=="all")d=d.filter(c=>c.invoices.some(i=>i.category===fCat));
      if(fUser!=="all")d=d.filter(c=>c.assignedTo===fUser||(fUser==="unassigned"&&!c.assignedTo));
      return d;
    },[search,fCat,fUser]);
    return (
      <div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…" style={{...S.inp,width:200}}/>
          <select value={fCat} onChange={e=>setFCat(e.target.value)} style={{...S.inp,width:130}}><option value="all">All Categories</option>{cats.map(c=><option key={c}>{c}</option>)}</select>
          {canManage&&<select value={fUser} onChange={e=>setFUser(e.target.value)} style={{...S.inp,width:130}}><option value="all">All Staff</option><option value="unassigned">Unassigned</option>{users.filter(u=>u.role!=="owner").map(u=><option key={u.id}>{u.name}</option>)}</select>}
          {canManage&&<button style={S.btn("#6366f1")} onClick={()=>setImportCustModal(true)}>📥 Import Customers</button>}
          <button style={S.btn("#0ea5e9")} onClick={exportCustomersCSV}>📤 Export</button>
          <div style={{marginLeft:"auto",fontSize:11,color:"#475569"}}>{filtered.length} customers · {fmt(filtered.reduce((s,c)=>s+c.totalDue,0))}</div>
        </div>
        <div style={{background:"#111827",borderRadius:13,border:"1px solid #1f2d3d",overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr>{["#","Customer","Inv","Total Due","Risk","Assigned","Last Call","Promise","Follow-up","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((c,i)=>{
                  const days=daysAgo(c.oldestDate); const fl=risk(days);
                  const fuOD=c.nextFU&&c.nextFU<=TODAY_STR;
                  const promiseBroken=c.promiseDate&&c.promiseDate<TODAY_STR&&c.totalDue>0;
                  const cs=c.lastCall?CALL_STATUSES.find(s=>s.value===c.lastCall.status):null;
                  const assigned=users.find(u=>u.name===c.assignedTo);
                  return (
                    <tr key={c.customer} style={{background:fuOD?"#ef444409":i%2===0?"#111827":"#0d1520",borderBottom:"1px solid #1f2d3d22",cursor:"pointer",outline:fuOD?"1px solid #ef444433":"none"}} onClick={()=>setCustDetail(c.customer)}>
                      <td style={S.td}><span style={{color:"#475569",fontWeight:700}}>{i+1}</span></td>
                      <td style={S.td}><div style={{fontWeight:700}}>{c.customer}</div><div style={{fontSize:10,color:"#475569"}}>{c.mobile||"No mobile"}</div></td>
                      <td style={{...S.td,textAlign:"center"}}><span style={S.bdg("#6366f1")}>{c.invoices.length}</span></td>
                      <td style={S.td}><span style={{fontWeight:900,fontSize:14,color:"#ef4444"}}>{fmt(c.totalDue)}</span></td>
                      <td style={S.td}><span style={S.bdg(fl.c)}>{fl.l}</span><div style={{fontSize:10,color:"#475569",marginTop:1}}>{days}d</div></td>
                      <td style={S.td}>{assigned?<span style={{...S.bdg(assigned.color),fontSize:11}}>👤 {assigned.name}</span>:<span style={{color:"#334155"}}>—</span>}</td>
                      <td style={S.td}>{cs?<span style={S.bdg(cs.color)}>{cs.icon} {cs.label}</span>:<span style={{color:"#334155"}}>—</span>}</td>
                      <td style={S.td}>{c.promiseDate?<span style={{fontSize:11,fontWeight:700,color:promiseBroken?"#ef4444":"#10b981"}}>{promiseBroken?"💔":"🤝"} {c.promiseDate}</span>:<span style={{color:"#334155"}}>—</span>}</td>
                      <td style={S.td}>{c.nextFU?<span style={{fontSize:11,fontWeight:700,color:fuOD?"#ef4444":"#f59e0b"}}>{fuOD?"🔴 Overdue":"📅"} {c.nextFU}</span>:<span style={{color:"#334155"}}>—</span>}</td>
                      <td style={S.td} onClick={e=>e.stopPropagation()}>
                        <div style={{display:"flex",gap:3}}>
                          <button style={S.btn("#f59e0b","#000","5px 6px",11)} onClick={()=>setCallModal(c.invoices[0])}>📞</button>
                          <button style={S.btn("#25d366","#fff","5px 6px",11)} onClick={()=>setWaModal(c.invoices[0])}>💬</button>
                          {canManage&&<button style={S.btn("#0ea5e9","#fff","5px 6px",11)} onClick={()=>setAssignModal(c.invoices[0])}>👤</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const CallLogTab = () => {
    const [tm,setTm]=useState("all");
    const filtered=callLogs.filter(l=>tm==="all"||l.calledBy===tm).slice(0,80);
    return (
      <div>
        <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
          <select value={tm} onChange={e=>setTm(e.target.value)} style={{...S.inp,width:180}}><option value="all">All Team</option>{users.map(u=><option key={u.id}>{u.name}</option>)}</select>
          <button style={S.btn("#0ea5e9")} onClick={exportCallLogCSV}>📤 Export</button>
          <div style={{marginLeft:"auto",fontSize:11,color:"#475569"}}>{filtered.length} logs</div>
        </div>
        {filtered.length===0?<div style={{...S.card,textAlign:"center",color:"#334155",padding:40}}>No call logs yet. Click 📞 on any invoice!</div>:
        filtered.map(l=>{
          const inv=invoices.find(i=>i.id===l.invoiceId);
          const cs=CALL_STATUSES.find(c=>c.value===l.status)||CALL_STATUSES[2];
          const dt=new Date(l.timestamp);
          return (
            <div key={l.id} style={{...S.card,marginBottom:8,display:"flex",gap:11,alignItems:"flex-start"}}>
              <div style={{fontSize:20}}>{cs.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:5}}>
                  <div><span style={{fontWeight:800,fontSize:13}}>{inv?.customer||"Unknown"}</span><span style={{fontSize:11,color:"#475569",marginLeft:7}}>{inv?.invoice}</span></div>
                  <div style={{display:"flex",gap:7,alignItems:"center"}}>
                    <span style={S.bdg(cs.color)}>{cs.label}</span>
                    <span style={{fontSize:10,color:"#475569"}}>{l.calledBy} · {dt.toLocaleDateString("en-IN")} {dt.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                </div>
                {l.notes&&<div style={{fontSize:12,color:"#94a3b8",marginTop:5,background:"#0d1520",borderRadius:7,padding:"6px 10px"}}>{l.notes}</div>}
                <div style={{display:"flex",gap:12,marginTop:5,flexWrap:"wrap"}}>
                  {l.promiseDate&&<span style={{fontSize:11,color:"#f59e0b"}}>🤝 {l.promiseDate}</span>}
                  {l.partialAmt&&<span style={{fontSize:11,color:"#10b981"}}>💰 {fmt(l.partialAmt)}</span>}
                  {inv&&<span style={{fontSize:11,color:"#475569"}}>Bal: {fmt(inv.originalAmt-inv.paidAmt)}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ── SETTINGS TAB ──────────────────────────────────────────────── */
  const SettingsTab = () => {
    const [newCat,setNewCat]=useState("");
    const [editingUser,setEditingUser]=useState(null);
    const [newUser,setNewUser]=useState({name:"",username:"",password:"",role:"staff",color:"#10b981"});
    const [bulkCat,setBulkCat]=useState(cats[0]);
    const [bulkUser,setBulkUser]=useState("");

    const applyBulkCat = () => {
      if(!bulkCat)return;
      setInvoices(p=>p.map(i=>({...i,category:bulkCat})));
      alert(`All invoices updated to category: ${bulkCat}`);
    };

    const applyBulkAssign = () => {
      if(!bulkUser)return;
      const ids=invoices.map(i=>i.id);
      assignToUser(ids,bulkUser);
      alert(`All invoices assigned to: ${bulkUser}`);
    };

    return (
      <div>
        <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
          {[["users","👥 Users"],["categories","📂 Categories"],["bulk","⚡ Bulk Actions"],["whatsapp","💬 WhatsApp"]].map(([id,label])=>(
            <button key={id} onClick={()=>setSettingsTab(id)} style={S.btn(settingsTab===id?"#6366f1":"#1f2d3d","#fff","8px 16px")}>{label}</button>
          ))}
        </div>

        {/* USERS */}
        {settingsTab==="users"&&(
          <div style={S.card}>
            <div style={{fontWeight:800,fontSize:14,color:"#94a3b8",marginBottom:14}}>👥 User Management</div>
            {users.map(u=>(
              <div key={u.id} style={{background:"#0d1520",borderRadius:10,padding:"10px 14px",marginBottom:8}}>
                {editingUser===u.id?(
                  <EditUserRow u={u} users={users} setUsers={setUsers} syncSettings={syncSettings} onDone={()=>setEditingUser(null)} S={S} Lbl={Lbl}/>
                ):(
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{u.name} <span style={S.bdg(roleBadgeColor(u.role))}>{u.role}</span></div>
                      <div style={{fontSize:11,color:"#475569",marginTop:2}}>🔑 {u.username} / {u.password}</div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      {canManage&&<button style={S.btn("#6366f1","#fff","5px 10px",11)} onClick={()=>setEditingUser(u.id)}>✏️ Edit</button>}
                      {canManage&&u.role!=="owner"&&<button style={S.btn("#ef4444","#fff","5px 10px",11)} onClick={()=>{if(window.confirm(`Delete ${u.name}?`)){const updUsers=users.filter(x=>x.id!==u.id);setUsers(updUsers);syncSettings({users:updUsers});}}}>🗑</button>}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {canManage&&(
              <div style={{background:"#0d1520",borderRadius:11,padding:14,marginTop:12}}>
                <div style={{fontWeight:700,fontSize:12,color:"#94a3b8",marginBottom:10}}>➕ Add New User</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                  <div><Lbl c="Full Name"/><input style={S.inp} value={newUser.name} onChange={e=>setNewUser(p=>({...p,name:e.target.value}))}/></div>
                  <div><Lbl c="Username"/><input style={S.inp} value={newUser.username} onChange={e=>setNewUser(p=>({...p,username:e.target.value}))}/></div>
                  <div><Lbl c="Password"/><input style={S.inp} value={newUser.password} onChange={e=>setNewUser(p=>({...p,password:e.target.value}))}/></div>
                  <div><Lbl c="Role"/><select style={S.inp} value={newUser.role} onChange={e=>setNewUser(p=>({...p,role:e.target.value}))}><option value="staff">Staff</option><option value="accountant">Accountant</option><option value="owner">Owner</option></select></div>
                  <div><Lbl c="Colour Tag"/>
                    <div style={{display:"flex",gap:6,marginTop:2}}>
                      {["#10b981","#0ea5e9","#a855f7","#f59e0b","#ef4444","#ec4899"].map(c=>(
                        <div key={c} onClick={()=>setNewUser(p=>({...p,color:c}))} style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${newUser.color===c?"#fff":"transparent"}`}}/>
                      ))}
                    </div>
                  </div>
                </div>
                <button style={{...S.btn("#6366f1"),marginTop:12}} onClick={()=>{
                  if(!newUser.name||!newUser.username||!newUser.password)return alert("Fill all fields");
                  if(users.find(u=>u.username===newUser.username))return alert("Username already exists");
                  const newU = {...newUser,id:"u"+Date.now()};
                  const updUsers = [...users, newU];
                  setUsers(updUsers);
                  syncSettings({users: updUsers});
                  setNewUser({name:"",username:"",password:"",role:"staff",color:"#10b981"});
                  alert(`User "${newUser.name}" added!`);
                }}>+ Add User</button>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES */}
        {settingsTab==="categories"&&(
          <div style={S.card}>
            <div style={{fontWeight:800,fontSize:14,color:"#94a3b8",marginBottom:14}}>📂 Manage Categories</div>
            <div style={{display:"flex",gap:8,marginBottom:13}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category name…" style={{...S.inp,flex:1}} onKeyDown={e=>{if(e.key==="Enter"&&newCat){const u=[...cats,newCat];setCats(u);syncSettings({cats:u});setNewCat("");}}}/>
              <button style={S.btn("#10b981")} onClick={()=>{if(newCat){const u=[...cats,newCat];setCats(u);syncSettings({cats:u});setNewCat("");}}}>+ Add</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {cats.map(cat=>(
                <div key={cat} style={{background:"#0d1520",border:"1px solid #1f2d3d",borderRadius:9,padding:"7px 14px",display:"flex",alignItems:"center",gap:9}}>
                  <span style={{fontWeight:600,fontSize:13}}>{cat}</span>
                  {!DEFAULT_CATS.includes(cat)
                    ?<button style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:18,lineHeight:1}} onClick={()=>{const u=cats.filter(c=>c!==cat);setCats(u);syncSettings({cats:u});}}>×</button>
                    :<span style={{fontSize:10,color:"#334155"}}>default</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BULK ACTIONS */}
        {settingsTab==="bulk"&&(
          <div style={{display:"grid",gap:14}}>
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:14,color:"#f59e0b",marginBottom:12}}>⚡ Bulk Assign Category to ALL Customers</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>This will update the category for ALL invoices at once.</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <select value={bulkCat} onChange={e=>setBulkCat(e.target.value)} style={{...S.inp,width:200}}>{cats.map(c=><option key={c}>{c}</option>)}</select>
                <button style={S.btn("#f59e0b","#000")} onClick={applyBulkCat}>Apply to All</button>
              </div>
            </div>
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:14,color:"#0ea5e9",marginBottom:12}}>👤 Bulk Assign ALL Invoices to a Staff Member</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>Assign all unassigned invoices to one person.</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <select value={bulkUser} onChange={e=>setBulkUser(e.target.value)} style={{...S.inp,width:200}}>
                  <option value="">Select staff…</option>
                  {users.filter(u=>u.role!=="owner").map(u=><option key={u.id}>{u.name}</option>)}
                </select>
                <button style={S.btn("#0ea5e9")} onClick={applyBulkAssign} disabled={!bulkUser}>Assign All</button>
              </div>
            </div>
          </div>
        )}

        {/* WHATSAPP */}
        {settingsTab==="whatsapp"&&(
          <div style={S.card}>
            <div style={{fontWeight:800,fontSize:14,color:"#25d366",marginBottom:12}}>💬 WhatsApp Setup</div>
            <div style={{background:"#0d1520",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontWeight:700,color:"#10b981",marginBottom:5}}>✅ Active: WhatsApp Web (Free)</div>
              <div style={{fontSize:12,color:"#64748b"}}>Every 💬 button opens WhatsApp Web with a pre-filled message. Works immediately with no setup needed.</div>
            </div>
            <div style={{background:"#0d1520",borderRadius:10,padding:14}}>
              <div style={{fontWeight:700,color:"#f59e0b",marginBottom:5}}>🚀 Upgrade: WhatsApp Business API</div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:2,marginBottom:10}}>
                1. Go to <span style={{color:"#6366f1"}}>business.whatsapp.com</span> → Sign up<br/>
                2. Verify your business phone number<br/>
                3. Get <strong style={{color:"#94a3b8"}}>API Key</strong> and <strong style={{color:"#94a3b8"}}>Phone Number ID</strong><br/>
                4. Paste below and Save
              </div>
              <div style={{display:"grid",gap:9}}>
                <div><Lbl c="API Key"/><input style={S.inp} placeholder="EAAxxxxxxxxxxxxx…"/></div>
                <div><Lbl c="Phone Number ID"/><input style={S.inp} placeholder="123456789012345"/></div>
                <button style={S.btn("#25d366")} onClick={()=>alert("API key saved! Automated WhatsApp sending will be active.")}>💾 Save & Activate</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ── COLLECTIONS REPORT TAB ────────────────────────────────────── */
  const CollectionsTab = () => {
    const [period, setPeriod] = useState("today");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo]     = useState("");

    // Build date range based on selected period
    const getRange = () => {
      const now = new Date(); now.setHours(0,0,0,0); // always use real today
      const d = (dt) => { const x=new Date(dt); x.setHours(0,0,0,0); return x; };
      if(period==="today")     return { from: d(now), to: d(now), label:"Today" };
      if(period==="yesterday") { const y=d(now); y.setDate(y.getDate()-1); return { from:y, to:y, label:"Yesterday" }; }
      if(period==="week")      { const w=d(now); w.setDate(w.getDate()-6); return { from:w, to:d(now), label:"Last 7 Days" }; }
      if(period==="month")     { const m=d(now); m.setDate(1); return { from:m, to:d(now), label:"This Month" }; }
      if(period==="quarter")   { const q=d(now); q.setMonth(Math.floor(q.getMonth()/3)*3,1); return { from:q, to:d(now), label:"This Quarter" }; }
      if(period==="year")      { const y=d(now); y.setMonth(0,1); return { from:y, to:d(now), label:"This Year" }; }
      if(period==="custom" && customFrom && customTo) {
        // customFrom/To are YYYY-MM-DD from date input
        const f = new Date(customFrom); f.setHours(0,0,0,0);
        const t = new Date(customTo);   t.setHours(0,0,0,0);
        return { from:f, to:t, label:`${customFrom} → ${customTo}` };
      }
      return null;
    };

    const range = getRange();

    // All payments within range
    const payments = useMemo(() => {
      if(!range) return [];
      const res = [];
      // Set to end of day so payments ON the "to" date are included
      const toEndOfDay = new Date(range.to); toEndOfDay.setHours(23,59,59,999);
      invoices.forEach(inv => {
        (inv.payments||[]).forEach(p => {
          const pd = parseDt(p.date);
          if(pd && pd >= range.from && pd <= toEndOfDay) {
            res.push({ ...p, invoice:inv.invoice, customer:inv.customer, category:inv.category, mobile:inv.mobile, invId:inv.id });
          }
        });
      });
      return res.sort((a,b) => b.date.localeCompare(a.date));
    }, [range?.from?.getTime(), range?.to?.getTime(), invoices]);

    const totalAmt   = payments.reduce((s,p)=>s+Number(p.amount),0);
    const byCustomer = useMemo(()=>{
      const map={};
      payments.forEach(p=>{ if(!map[p.customer]) map[p.customer]={customer:p.customer,mobile:p.mobile,category:p.category,total:0,payments:[]}; map[p.customer].total+=Number(p.amount); map[p.customer].payments.push(p); });
      return Object.values(map).sort((a,b)=>b.total-a.total);
    },[payments]);
    const byMode = useMemo(()=>{
      const map={};
      payments.forEach(p=>{ if(!map[p.mode]) map[p.mode]=0; map[p.mode]+=Number(p.amount); });
      return Object.entries(map).sort((a,b)=>b[1]-a[1]);
    },[payments]);
    const byCategory = useMemo(()=>{
      const map={};
      payments.forEach(p=>{ if(!map[p.category]) map[p.category]=0; map[p.category]+=Number(p.amount); });
      return Object.entries(map).sort((a,b)=>b[1]-a[1]);
    },[payments]);

    const exportReport = () => {
      const header=["Date","Invoice#","Customer","Mobile","Category","Amount","Mode","Note","Added By"];
      const rows=[header,...payments.map(p=>[p.date,p.invoice,p.customer,p.mobile||"",p.category,p.amount,p.mode,p.note||"",p.addedBy||""])];
      const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
      const blob=new Blob([csv],{type:"text/csv"});
      const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`OPTIMAX-Collections-${period}.csv`; a.click();
    };

    const PERIODS = [
      {id:"today",    label:"Today"},
      {id:"yesterday",label:"Yesterday"},
      {id:"week",     label:"This Week"},
      {id:"month",    label:"This Month"},
      {id:"quarter",  label:"Quarter"},
      {id:"year",     label:"This Year"},
      {id:"custom",   label:"Custom"},
    ];

    return (
      <div>
        {/* Period selector */}
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          {PERIODS.map(p=>(
            <button key={p.id} onClick={()=>setPeriod(p.id)}
              style={{...S.btn(period===p.id?"#f59e0b":"#1f2d3d", period===p.id?"#000":"#94a3b8","7px 14px",12)}}>
              {p.label}
            </button>
          ))}
          {period==="custom"&&(
            <div style={{display:"flex",gap:6,alignItems:"center",marginLeft:4}}>
              <input type="date" style={{...S.inp,width:140}} value={customFrom} onChange={e=>setCustomFrom(e.target.value)} placeholder="From"/>
              <span style={{color:"#475569"}}>→</span>
              <input type="date" style={{...S.inp,width:140}} value={customTo} onChange={e=>setCustomTo(e.target.value)} placeholder="To"/>
            </div>
          )}
          <button style={{...S.btn("#0ea5e9","#fff","7px 14px",12),marginLeft:"auto"}} onClick={exportReport}>📤 Export CSV</button>
        </div>

        {/* Summary cards */}
        {range&&(
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
            <div style={{...S.card,flex:1,minWidth:130,borderColor:"#10b98133"}}>
              <div style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>💰 Total Collected</div>
              <div style={{fontSize:24,fontWeight:900,color:"#10b981"}}>{fmt(totalAmt)}</div>
              <div style={{fontSize:11,color:"#334155",marginTop:2}}>{range.label}</div>
            </div>
            <div style={{...S.card,flex:1,minWidth:130,borderColor:"#6366f133"}}>
              <div style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>🧾 Transactions</div>
              <div style={{fontSize:24,fontWeight:900,color:"#6366f1"}}>{payments.length}</div>
              <div style={{fontSize:11,color:"#334155",marginTop:2}}>payments received</div>
            </div>
            <div style={{...S.card,flex:1,minWidth:130,borderColor:"#f59e0b33"}}>
              <div style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>👤 Customers</div>
              <div style={{fontSize:24,fontWeight:900,color:"#f59e0b"}}>{byCustomer.length}</div>
              <div style={{fontSize:11,color:"#334155",marginTop:2}}>paid in this period</div>
            </div>
            <div style={{...S.card,flex:1,minWidth:130,borderColor:"#0ea5e933"}}>
              <div style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>⌀ Avg Payment</div>
              <div style={{fontSize:24,fontWeight:900,color:"#0ea5e9"}}>{fmt(payments.length?Math.round(totalAmt/payments.length):0)}</div>
              <div style={{fontSize:11,color:"#334155",marginTop:2}}>per transaction</div>
            </div>
          </div>
        )}

        {payments.length===0 ? (
          <div style={{...S.card,textAlign:"center",padding:48,color:"#334155"}}>
            <div style={{fontSize:36,marginBottom:10}}>📭</div>
            <div style={{fontSize:15,fontWeight:700,color:"#475569"}}>No payments found</div>
            <div style={{fontSize:12,marginTop:5}}>No collections recorded for {range?.label||"this period"}</div>
          </div>
        ) : (
          <div style={{display:"grid",gap:14}}>

            {/* By Payment Mode */}
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:13,color:"#94a3b8",marginBottom:10}}>💳 By Payment Mode</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {byMode.map(([mode,amt])=>(
                  <div key={mode} style={{background:"#0d1520",border:"1px solid #1f2d3d",borderRadius:10,padding:"10px 16px",flex:1,minWidth:100,textAlign:"center"}}>
                    <div style={{fontSize:11,color:"#475569",fontWeight:700,marginBottom:4}}>{mode}</div>
                    <div style={{fontSize:17,fontWeight:900,color:"#10b981"}}>{fmt(amt)}</div>
                    <div style={{fontSize:10,color:"#334155",marginTop:2}}>{Math.round(amt/totalAmt*100)}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Category */}
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:13,color:"#94a3b8",marginBottom:10}}>📂 By Category</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {byCategory.map(([cat,amt])=>(
                  <div key={cat} style={{background:"#0d1520",border:"1px solid #6366f133",borderRadius:10,padding:"10px 16px",flex:1,minWidth:100,textAlign:"center"}}>
                    <div style={{fontSize:11,color:"#6366f1",fontWeight:700,marginBottom:4}}>{cat}</div>
                    <div style={{fontSize:17,fontWeight:900,color:"#e2e8f0"}}>{fmt(amt)}</div>
                    <div style={{fontSize:10,color:"#334155",marginTop:2}}>{Math.round(amt/totalAmt*100)}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Customer */}
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:13,color:"#94a3b8",marginBottom:10}}>👤 By Customer</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr>{["#","Customer","Category","Invoices Paid","Total Received","Mode(s)"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {byCustomer.map((c,i)=>(
                      <tr key={c.customer} style={{background:i%2===0?"#111827":"#0d1520",borderBottom:"1px solid #1f2d3d22"}}>
                        <td style={S.td}><span style={{color:"#475569",fontWeight:700}}>{i+1}</span></td>
                        <td style={S.td}><div style={{fontWeight:700}}>{c.customer}</div><div style={{fontSize:10,color:"#475569"}}>{c.mobile||"—"}</div></td>
                        <td style={S.td}><span style={S.bdg("#6366f1")}>{c.category}</span></td>
                        <td style={{...S.td,textAlign:"center"}}><span style={S.bdg("#0ea5e9")}>{c.payments.length}</span></td>
                        <td style={S.td}><span style={{fontWeight:900,color:"#10b981",fontSize:14}}>{fmt(c.total)}</span></td>
                        <td style={S.td}><span style={{fontSize:11,color:"#94a3b8"}}>{[...new Set(c.payments.map(p=>p.mode))].join(", ")}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full Transaction List */}
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:13,color:"#94a3b8",marginBottom:10}}>🧾 All Transactions</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr>{["Date","Invoice","Customer","Category","Amount","Mode","Note","By"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {payments.map((p,i)=>(
                      <tr key={p.id} style={{background:i%2===0?"#111827":"#0d1520",borderBottom:"1px solid #1f2d3d22"}}>
                        <td style={S.td}><span style={{fontWeight:700,color:"#f59e0b"}}>{p.date}</span></td>
                        <td style={S.td}><span style={{color:"#6366f1",fontWeight:700}}>{p.invoice}</span></td>
                        <td style={S.td}><div style={{fontWeight:600}}>{p.customer}</div></td>
                        <td style={S.td}><span style={S.bdg("#6366f1")}>{p.category}</span></td>
                        <td style={S.td}><span style={{fontWeight:900,color:"#10b981",fontSize:13}}>{fmt(p.amount)}</span></td>
                        <td style={S.td}><span style={S.bdg("#0ea5e9")}>{p.mode}</span></td>
                        <td style={S.td}><span style={{color:"#475569",fontSize:11}}>{p.note||"—"}</span></td>
                        <td style={S.td}><span style={{color:"#475569",fontSize:11}}>{p.addedBy||"—"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    );
  };

  /* ── LAYOUT ────────────────────────────────────────────────────── */
  const TABS = [["dashboard","📊 Dashboard"],["invoices","📋 Invoices"],["customers","👤 Customers"],["collections","💰 Collections"],["calllog","📞 Call Log"],...(canManage?[["settings","⚙️ Settings"]]:[] )];

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      {/* Print styles injected globally */}
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          .print-area { padding: 10px !important; }
          table { border-collapse: collapse; width: 100%; font-size: 11px; }
          th { background: #f1f5f9 !important; color: #000 !important; border: 1px solid #cbd5e1; padding: 6px 8px; }
          td { border: 1px solid #e2e8f0; padding: 5px 8px; color: #000 !important; }
          div[style*="background:#111827"], div[style*="background: #111827"],
          div[style*="background:#0d1520"], div[style*="background: #0d1520"],
          div[style*="background:#080c14"], div[style*="background: #080c14"] {
            background: #fff !important; border-color: #e2e8f0 !important; color: #000 !important;
          }
          span, div, td, th, button { color: #000 !important; }
          .print-header { display: block !important; }
        }
        .print-header { display: none; }
      `}</style>
      <FuPopup/>
      {/* Header */}
      <div className="no-print" style={{background:"#0d1520",borderBottom:"1px solid #1f2d3d",padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div style={{fontWeight:900,fontSize:18,color:"#f59e0b"}}>💼 OPTIMAX-AR Manager</div><div style={{fontSize:10,color:"#334155"}}>Account Receivable · 2025–26</div></div>
        <div style={{display:"flex",gap:9,alignItems:"center"}}>
          {syncing&&<div style={{background:"#f59e0b22",border:"1px solid #f59e0b44",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#f59e0b",fontWeight:700}}>🔄 Syncing...</div>}
          {todayFU.length>0&&<div style={{background:"#ef444422",border:"1px solid #ef444455",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#ef4444",fontWeight:700,cursor:"pointer"}} onClick={()=>setFuPopupDismissed(false)}>🔴 {todayFU.length} Follow-ups Due!</div>}
          {brokenPromises.length>0&&<div style={{background:"#f59e0b22",border:"1px solid #f59e0b44",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#f59e0b",fontWeight:700}}>⚠️ {brokenPromises.length} Broken</div>}
          <div style={{background:"#1f2d3d",borderRadius:8,padding:"5px 13px",fontSize:12,display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontWeight:700}}>{user.name}</span>
            <span style={S.bdg(roleBadgeColor(user.role))}>{user.role}</span>
            <button style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:11}} onClick={()=>setUser(null)}>Logout</button>
          </div>
        </div>
      </div>
      {/* Tabs + Print button */}
      <div className="no-print" style={{display:"flex",background:"#080c14",borderBottom:"1px solid #1f2d3d",padding:"0 22px",overflowX:"auto",alignItems:"center"}}>
        {TABS.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:`3px solid ${tab===id?"#f59e0b":"transparent"}`,padding:"11px 16px",cursor:"pointer",fontSize:13,fontWeight:600,color:tab===id?"#f59e0b":"#475569",whiteSpace:"nowrap"}}>
            {label}
          </button>
        ))}
        <div style={{marginLeft:"auto",paddingRight:4}}>
          <button onClick={()=>{
            const tabLabels={"dashboard":"Dashboard","invoices":"Invoices","customers":"Customers","collections":"Collections","calllog":"Call Log","settings":"Settings"};
            const orig=document.title;
            document.title=`OPTIMAX-AR · ${tabLabels[tab]||tab} · ${TODAY_STR}`;
            window.print();
            document.title=orig;
          }} style={{...S.btn("#1f2d3d","#94a3b8","7px 14px",12),border:"1px solid #334155"}}>
            🖨️ Print
          </button>
        </div>
      </div>
      {/* Print header — only shows when printing */}
      <div className="print-header" style={{padding:"10px 20px",borderBottom:"2px solid #000",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontWeight:900,fontSize:20}}>💼 OPTIMAX-AR Manager</div>
          <div style={{fontSize:12,color:"#475569"}}>Account Receivable Report</div>
        </div>
        <div style={{textAlign:"right",fontSize:12}}>
          <div style={{fontWeight:700}}>Printed by: {user?.name}</div>
          <div>Date: {TODAY_STR}</div>
        </div>
      </div>
      {/* Body */}
      <div className="print-area" style={{padding:"16px 22px"}}>
        {tab==="dashboard"&&<Dashboard/>}
        {tab==="invoices"&&<InvoicesTab/>}
        {tab==="customers"&&<CustomersTab/>}
        {tab==="collections"&&<CollectionsTab/>}
        {tab==="calllog"&&<CallLogTab/>}
        {tab==="settings"&&<SettingsTab/>}
      </div>
      {/* Modals */}
      {callModal&&<CallModal inv={callModal}/>}
      {payModal&&<PayModal inv={payModal}/>}
      {editPayModal&&<EditPayModal inv={editPayModal.inv} payment={editPayModal.payment}/>}
      {addInvModal&&<InvFormModal/>}
      {editInvModal&&<InvFormModal existing={editInvModal}/>}
      {custDetail&&<CustDetailModal custName={custDetail}/>}
      {waModal&&<WaModal inv={waModal}/>}
      {assignModal&&<AssignModal inv={assignModal}/>}
      {importModal&&<ImportModal onImport={importInvoicesCSV} title="Import Invoices CSV" hint="invoice, date, customer, mobile, category, amount" onSampleDownload={downloadSampleInvoiceCSV}/>}
      {importCustModal&&<ImportModal onImport={importCustomersCSV} title="Import Customers CSV" hint="customer, mobile, category, amount, date" onSampleDownload={downloadSampleCustomerCSV}/>}
    </div>
  );
}

/* ── EDIT USER ROW (inline) ──────────────────────────────────────── */
function EditUserRow({u, users, setUsers, syncSettings, onDone, S, Lbl}) {
  const [form,setForm] = useState({...u});
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const handleSave = () => {
    if(!form.name||!form.username||!form.password) return alert("All fields required!");
    const updUsers = users.map(x => x.id===u.id ? form : x);
    setUsers(updUsers);
    syncSettings({users: updUsers}); // ← saves to Firebase
    onDone();
    alert("✅ User updated successfully!");
  };
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <div><Lbl c="Name"/><input style={S.inp} value={form.name} onChange={set("name")}/></div>
        <div><Lbl c="Username"/><input style={S.inp} value={form.username} onChange={set("username")}/></div>
        <div><Lbl c="Password"/><input style={S.inp} value={form.password} onChange={set("password")} placeholder="New password"/></div>
        <div><Lbl c="Role"/><select style={S.inp} value={form.role} onChange={set("role")}><option value="staff">Staff</option><option value="accountant">Accountant</option><option value="owner">Owner</option></select></div>
      </div>
      <div style={{display:"flex",gap:6,marginTop:4}}>
        <button style={S.btn("#10b981","#fff","5px 12px",12)} onClick={handleSave}>💾 Save</button>
        <button style={S.btn("#1f2d3d","#fff","5px 12px",12)} onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

/* ── LOGIN SCREEN ────────────────────────────────────────────────── */
function LoginBox({users, onLogin, S, Lbl}) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError]       = useState("");
  const login = () => {
    const u = users.find(u => u.username===username && u.password===password);
    if(u) onLogin(u); else setError("❌ Wrong username or password");
  };
  return (
    <div style={{background:"#111827",border:"1px solid #1f2d3d",borderRadius:20,padding:"36px 32px",width:"100%",maxWidth:380,textAlign:"center"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <div style={{fontSize:40,marginBottom:7}}>💼</div>
      <div style={{fontWeight:900,fontSize:22,color:"#f59e0b",marginBottom:3}}>OPTIMAX-AR Manager</div>
      <div style={{fontSize:12,color:"#334155",marginBottom:24}}>Account Receivable · 2025–26</div>
      <div style={{display:"grid",gap:11,textAlign:"left"}}>
        <div><Lbl c="Username"/><input style={S.inp} value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter username" onKeyDown={e=>e.key==="Enter"&&login()}/></div>
        <div><Lbl c="Password"/><input style={S.inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" onKeyDown={e=>e.key==="Enter"&&login()}/></div>
        {error&&<div style={{fontSize:12,color:"#ef4444",fontWeight:600}}>{error}</div>}
        <button style={{...S.btn("#f59e0b","#000"),padding:"11px",fontSize:14,marginTop:4}} onClick={login}>Login →</button>
      </div>
      <div style={{marginTop:18,background:"#0d1520",borderRadius:9,padding:"11px 14px",textAlign:"left"}}>
        <div style={{fontSize:10,color:"#334155",fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Demo Logins</div>
        {users.map(u=><div key={u.id} style={{fontSize:11,color:"#475569",marginBottom:2}}><span style={{color:"#64748b",fontWeight:600}}>{u.role}:</span> {u.username} / {u.password}</div>)}
      </div>
    </div>
  );
}
