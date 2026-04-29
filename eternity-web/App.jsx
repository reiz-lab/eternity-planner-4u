```react
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, Calendar, CheckCircle2, Home, Wallet, Sparkles, 
  ListTodo, Plane, Target, LogOut, BrainCircuit, ArrowRight, 
  Clock, Download, QrCode, Camera, Users, FileText, ChevronRight,
  TrendingUp, AlertCircle, Plus, Edit3, Trash2, MapPin, Phone, 
  DollarSign, PieChart, Info, Save, Menu, X, ChevronLeft
} from 'lucide-react';

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Rizky', partner: 'Aura',
    incomeSelf: 0, incomePartner: 0,
    locationSelf: '', locationPartner: '',
    jobSelf: '', jobPartner: '',
    weddingDate: '',
    isDataFilled: false
  });

  const [budgetPlans, setBudgetPlans] = useState([
    { id: 1, name: 'Standard Wedding', total: 75000000, isActive: true, source: 'Sistem' }
  ]);
  const [actualSavings, setActualSavings] = useState([]);
  const [guests, setGuests] = useState([
    { id: 'G-001', name: 'Keluarga Bpk. Handoko', email: 'handoko@mail.com', qr: 'ETR-8821' }
  ]);
  const [timeline, setTimeline] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex min-h-screen bg-[#FCFCFD] text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-600">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen z-40">
        <LogoSection />
        <Navigation activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <UserFooter user={userProfile} onLogout={() => setIsLoggedIn(false)} />
      </aside>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={toggleMobileMenu}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center pr-6">
              <LogoSection />
              <button onClick={toggleMobileMenu} className="p-2 bg-slate-50 rounded-full"><X size={20}/></button>
            </div>
            <Navigation activeMenu={activeMenu} setActiveMenu={(m) => { setActiveMenu(m); setIsMobileMenuOpen(false); }} />
            <UserFooter user={userProfile} onLogout={() => setIsLoggedIn(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 hover:bg-slate-50 rounded-xl">
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-black text-slate-900 tracking-tight capitalize">
              {activeMenu === 'dashboard' ? 'Overview' : activeMenu}
            </h1>
          </div>
          <div className="flex items-center gap-3 lg:gap-6">
            {userProfile.weddingDate && <Countdown date={userProfile.weddingDate} />}
            <div className="w-10 h-10 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center relative hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></div>
              <Sparkles size={18} className="text-slate-400" />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {activeMenu === 'dashboard' && <Dashboard user={userProfile} setMenu={setActiveMenu} />}
          {activeMenu === 'pranikah' && (
            <Pranikah 
              user={userProfile} setUser={setUserProfile} 
              budgetPlans={budgetPlans} setBudgetPlans={setBudgetPlans}
              actualSavings={actualSavings} setActualSavings={setActualSavings}
              timeline={timeline} setTimeline={setTimeline}
            />
          )}
          {activeMenu === 'nikah' && <Nikah guests={guests} setGuests={setGuests} />}
          {activeMenu === 'pascanikah' && <PascaNikah />}
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function LogoSection() {
  return (
    <div className="p-8 flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl shadow-slate-200">
        <Heart className="text-white fill-white w-5 h-5" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-slate-900">ETERNITY.</span>
    </div>
  );
}

function Navigation({ activeMenu, setActiveMenu }) {
  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20}/> },
    { id: 'pranikah', label: 'Pranikah', icon: <BrainCircuit size={20}/> },
    { id: 'nikah', label: 'Hari Pernikahan', icon: <ListTodo size={20}/> },
    { id: 'pascanikah', label: 'Pasca Nikah', icon: <TrendingUp size={20}/> },
  ];

  return (
    <nav className="flex-1 px-4 space-y-1">
      {menus.map((m) => (
        <button 
          key={m.id}
          onClick={() => setActiveMenu(m.id)}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${
            activeMenu === m.id 
              ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1' 
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
          }`}
        >
          {m.icon} {m.label}
        </button>
      ))}
    </nav>
  );
}

function UserFooter({ user, onLogout }) {
  return (
    <div className="p-6 border-t border-slate-50 mt-auto">
      <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm">RA</div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-slate-900 truncate">{user.name} & {user.partner}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Pair</p>
        </div>
      </div>
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-rose-500 font-bold text-sm transition-colors">
        <LogOut size={16} /> Keluar
      </button>
    </div>
  );
}

function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState('0 Hari');

  useEffect(() => {
    if (!date) return;
    const calculate = () => {
      const now = new Date();
      const target = new Date(date);
      const diff = target - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setTimeLeft(`${days > 0 ? days : 0} Hari Lagi`);
    };
    calculate();
    const timer = setInterval(calculate, 60000);
    return () => clearInterval(timer);
  }, [date]);

  return (
    <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-white text-xs font-bold shadow-lg shadow-slate-200">
      <Clock size={14} className="text-rose-400 animate-pulse" />
      <span>{timeLeft}</span>
    </div>
  );
}

// --- SCREEN: LOGIN ---
function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-white lg:bg-[#F9FAFB] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white lg:rounded-[3rem] lg:shadow-2xl lg:shadow-slate-200 p-8 lg:p-14 border border-slate-100 flex flex-col items-center">
        <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-xl mb-10">
          <Heart className="text-white fill-white w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">ETERNITY.</h2>
        <p className="text-center text-slate-400 text-sm font-medium mb-12 italic leading-relaxed">Membangun pondasi rumah tangga yang kuat dengan perencanaan yang matang.</p>
        
        <form onSubmit={onLogin} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Access</label>
            <input type="email" placeholder="contoh@mail.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all font-bold text-sm" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secure Key</label>
            <input type="password" placeholder="••••••••" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all font-bold text-sm" required />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 mt-6 active:scale-95 group">
            Masuk Sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        <p className="text-center mt-10 text-slate-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">Belum punya akun? Daftar</p>
      </div>
    </div>
  );
}

// --- COMPONENT: DASHBOARD ---
function Dashboard({ user, setMenu }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">Halo, {user.name}!</h2>
          <p className="text-slate-400 font-bold mt-2 text-lg italic">Mari buat setiap langkah menuju {user.partner} lebih terarah.</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500"><Sparkles size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress Persiapan</p>
            <p className="text-xl font-black text-slate-900">42% <span className="text-xs text-slate-400 font-bold italic ml-2">Selesai</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatAction icon={<BrainCircuit/>} color="bg-indigo-50" label="Pranikah" onClick={() => setMenu('pranikah')} />
            <StatAction icon={<ListTodo/>} color="bg-rose-50" label="Nikah" onClick={() => setMenu('nikah')} />
            <StatAction icon={<TrendingUp/>} color="bg-emerald-50" label="Pasca Nikah" onClick={() => setMenu('pascanikah')} />
          </div>

          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative group">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Calendar className="text-slate-400" /> Kalender Hari Baik & Cantik
              </h3>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">Mei 2026</div>
            </div>
            
            <div className="grid grid-cols-7 gap-3 mb-8 relative z-10">
              {['S','S','R','K','J','S','M'].map(d => <div key={d} className="text-[10px] font-black text-slate-300 py-1 text-center">{d}</div>)}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isCantik = day === 5 || day === 25;
                const isAgama = day === 12 || day === 19;
                return (
                  <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-xs font-bold transition-all hover:scale-110 cursor-pointer ${
                    isCantik ? 'bg-rose-100 text-rose-600 ring-4 ring-rose-50' : 
                    isAgama ? 'bg-indigo-100 text-indigo-600 ring-4 ring-indigo-50' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}>
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-6 pt-8 border-t border-slate-50 relative z-10">
              <LegendItem color="bg-rose-400" label="Tanggal Cantik" />
              <LegendItem color="bg-indigo-400" label="Hari Baik Agama" />
            </div>
            
            <Sparkles className="absolute -bottom-10 -right-10 text-slate-50 w-60 h-60 opacity-20 pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <Heart size={150} className="absolute -bottom-10 -left-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Current Roadmap</p>
              <h4 className="text-2xl font-black mb-6">"Intimate Modern Wedding"</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium mb-8">Pesta sederhana dengan 200 tamu undangan pilihan di area outdoor pinggir pantai.</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Lihat Detail Konsep</button>
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
            <h4 className="font-black text-indigo-900 flex items-center gap-2 mb-4 italic text-sm">
              <Sparkles size={16}/> Daily Wisdom
            </h4>
            <p className="text-indigo-800/70 text-sm leading-relaxed font-medium italic">
              "Pernikahan yang sukses bukan hanya mencari pasangan yang sempurna, tapi belajar melihat ketidaksempurnaan dengan cara yang sempurna."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatAction({ icon, color, label, onClick }) {
  return (
    <button onClick={onClick} className={`${color} p-6 rounded-[2rem] border border-black/5 flex flex-col items-center gap-4 group hover:scale-105 transition-all shadow-sm`}>
      <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center shadow-sm group-hover:shadow-md transition-all text-slate-900">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{label}</span>
    </button>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// --- SCREEN: PRANIKAH ---
function Pranikah({ user, setUser, budgetPlans, setBudgetPlans, actualSavings, setActualSavings, timeline, setTimeline }) {
  const [activeTab, setActiveTab] = useState('data');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const runAiAnalysis = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const combinedIncome = parseInt(user.incomeSelf) + parseInt(user.incomePartner);
      const recommendedBudget = combinedIncome * 6; // Asumsi 6x pendapatan bulanan
      
      const aiTemplate = {
        id: Date.now(),
        name: 'AI Smart Budget',
        total: recommendedBudget,
        isActive: true,
        source: 'AI Agent'
      };

      setBudgetPlans(prev => prev.map(p => ({ ...p, isActive: false })).concat(aiTemplate));
      
      // Auto-generate Timeline
      const initialTimeline = [
        { id: 1, title: 'Lamaran & Pertemuan Keluarga', date: '6 Bulan Sebelum', status: 'Pending' },
        { id: 2, title: 'Booking Venue & Catering', date: '5 Bulan Sebelum', status: 'Pending' },
        { id: 3, title: 'Sesi Pre-Wedding', date: '4 Bulan Sebelum', status: 'Pending' },
        { id: 4, title: 'Pengajian & Siraman', date: '1 Minggu Sebelum', status: 'Pending' }
      ];
      setTimeline(initialTimeline);
      
      setUser({...user, isDataFilled: true});
      setIsAiLoading(false);
      setActiveTab('budgeting');
    }, 2500);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-10">
        <TabBtn label="Data & AI Input" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
        <TabBtn label="Budgeting" active={activeTab === 'budgeting'} onClick={() => setActiveTab('budgeting')} />
        <TabBtn label="Timeline" active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
        <TabBtn label="Vendor" active={activeTab === 'vendor'} onClick={() => setActiveTab('vendor')} />
        <TabBtn label="Moodboard AI" active={activeTab === 'moodboard'} onClick={() => setActiveTab('moodboard')} />
      </div>

      <div className="bg-white p-6 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[600px]">
        {activeTab === 'data' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight italic underline decoration-rose-200 underline-offset-8">Input Data Pondasi</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed italic">Semakin akurat data yang Anda berikan, semakin presisi kalkulasi AI Agent kami dalam merancang roadmap Anda.</p>
              
              <div className="space-y-6">
                <InputGroup label="Pendapatan Bulanan Anda" type="number" icon={<DollarSign size={16}/>} value={user.incomeSelf} onChange={(v) => setUser({...user, incomeSelf: v})} />
                <InputGroup label="Pendapatan Bulanan Pasangan" type="number" icon={<DollarSign size={16}/>} value={user.incomePartner} onChange={(v) => setUser({...user, incomePartner: v})} />
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Pekerjaan Anda" value={user.jobSelf} onChange={(v) => setUser({...user, jobSelf: v})} />
                  <InputGroup label="Pekerjaan Pasangan" value={user.jobPartner} onChange={(v) => setUser({...user, jobPartner: v})} />
                </div>
                <InputGroup label="Rencana Waktu Nikah" type="month" value={user.weddingDate} onChange={(v) => setUser({...user, weddingDate: v})} />
              </div>
              
              <button 
                onClick={runAiAnalysis}
                disabled={isAiLoading}
                className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
              >
                {isAiLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>AI sedang menghitung...</span>
                  </div>
                ) : (
                  <>
                    <BrainCircuit size={20} />
                    <span>Jalankan Analisis AI</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center border-2 border-white border-dashed">
               <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-sm mb-6 text-slate-300">
                 <Info size={32} />
               </div>
               <h4 className="text-lg font-black text-slate-900 mb-4">Kenapa Data Finansial?</h4>
               <p className="text-xs text-slate-400 leading-loose font-medium italic">Kalkulasi Wedding Dream bukan hanya soal angka hari ini, tapi kemampuan menabung berdua setiap bulan tanpa mengabaikan biaya hidup setelah menikah.</p>
            </div>
          </div>
        )}

        {activeTab === 'budgeting' && (
          <BudgetSection plans={budgetPlans} setPlans={setBudgetPlans} savings={actualSavings} setSavings={setActualSavings} />
        )}

        {activeTab === 'timeline' && (
          <TimelineSection timeline={timeline} setTimeline={setTimeline} />
        )}

        {activeTab === 'vendor' && <VendorSection />}
        
        {activeTab === 'moodboard' && <MoodboardWizard />}
      </div>
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm ${
      active ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-50'
    }`}>
      {label}
    </button>
  );
}

function InputGroup({ label, value, onChange, type = "text", icon }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
        <input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? 'pl-14' : 'px-6'} py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all font-bold text-sm`}
          placeholder="..."
        />
      </div>
    </div>
  );
}

// --- SECTION: BUDGETING ---
function BudgetSection({ plans, setPlans, savings, setSavings }) {
  const [budgetTab, setBudgetTab] = useState('templates');
  const activePlan = plans.find(p => p.isActive);

  return (
    <div className="animate-in fade-in space-y-10">
      <div className="flex gap-4 border-b border-slate-50 pb-6 overflow-x-auto no-scrollbar">
        <button onClick={() => setBudgetTab('templates')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${budgetTab === 'templates' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <FileText size={16}/> 1. Budget Plan
        </button>
        <button onClick={() => setBudgetTab('actual')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${budgetTab === 'actual' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <Wallet size={16}/> 2. Budget Actual
        </button>
        <button onClick={() => setBudgetTab('ai-reminder')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${budgetTab === 'ai-reminder' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <Sparkles size={16}/> 3. AI Reminder
        </button>
      </div>

      {budgetTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.id} className={`p-8 rounded-[2.5rem] border-2 transition-all relative ${p.isActive ? 'border-slate-900 bg-white shadow-xl scale-[1.02]' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${p.source === 'AI Agent' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-500'}`}>
                  {p.source}
                </span>
                {p.isActive && <CheckCircle2 className="text-emerald-500" size={24} />}
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">{p.name}</h4>
              <p className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">Rp {p.total.toLocaleString('id-ID')}</p>
              <button 
                onClick={() => setPlans(plans.map(pl => ({...pl, isActive: pl.id === p.id})))}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${p.isActive ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}
              >
                {p.isActive ? 'Template Aktif' : 'Pilih Template'}
              </button>
            </div>
          ))}
          <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-8 group hover:border-slate-300 transition-all cursor-pointer">
            <Plus className="text-slate-200 mb-4 group-hover:scale-110 transition-transform" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tambah Custom Plan</p>
          </div>
        </div>
      )}

      {budgetTab === 'actual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Target Budget Aktif</p>
              <h4 className="text-4xl font-black mb-8 tracking-tighter">Rp {activePlan?.total.toLocaleString('id-ID')}</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-300 italic">
                  <span>Realisasi Tabungan</span>
                  <span>12%</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[12%]"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 italic">Input Tabungan Bulan Ini</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="number" placeholder="Rp 0" className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-slate-900 font-bold" />
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2"><Save size={18}/> Simpan</button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 border-dashed">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 italic">Riwayat Pemasukan</h4>
            <div className="space-y-4">
              {[
                { m: 'Mei 2026', a: 7500000, s: 'Success' },
                { m: 'April 2026', a: 5000000, s: 'Success' }
              ].map((h, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">{h.m}</span>
                  <span className="text-sm font-black text-slate-900">Rp {h.a.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {budgetTab === 'ai-reminder' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 p-10 rounded-[3rem] flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group">
            <Sparkles className="absolute -top-10 -right-10 text-indigo-100 w-40 h-40 group-hover:scale-125 transition-transform duration-700" />
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-500 shrink-0">
              <BrainCircuit size={32} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-black text-indigo-900 mb-4 italic">Analisis AI Agent Hari Ini</h4>
              <p className="text-sm text-indigo-800 leading-loose font-medium italic">
                "Berdasarkan pendapatan gabungan Anda, tabungan saat ini masih di bawah target 15% per bulan. Disarankan untuk menunda pengeluaran wishlist non-primer sebesar Rp 2.000.000 bulan ini untuk menjaga timeline dana gedung tetap aman."
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="px-5 py-2 bg-white rounded-full text-[10px] font-black text-indigo-900 shadow-sm uppercase italic">Strategi 50/30/20</span>
                <span className="px-5 py-2 bg-white rounded-full text-[10px] font-black text-rose-500 shadow-sm uppercase italic">High Inflation Alert</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SECTION: TIMELINE ---
function TimelineSection({ timeline }) {
  if (timeline.length === 0) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <Clock className="text-slate-100 mb-4" size={60} />
      <p className="text-slate-400 font-bold italic">Timeline akan terbuat secara otomatis setelah Anda menjalankan Analisis AI di tab pertama.</p>
    </div>
  );

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight italic underline decoration-rose-200 underline-offset-8">Roadmap & Timeline</h3>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-2"><Plus size={14}/> Add Milestone</button>
      </div>

      <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
        {timeline.map((item) => (
          <div key={item.id} className="relative pl-14 group">
            <div className="absolute left-0 top-1 w-10 h-10 bg-white rounded-full border-4 border-slate-50 shadow-sm flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={16} className={item.status === 'Done' ? 'text-emerald-500' : 'text-slate-200'} />
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group-hover:border-slate-900 group-hover:translate-x-2 transition-all shadow-sm">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{item.date}</p>
                <h4 className="text-lg font-black text-slate-900">{item.title}</h4>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"><Edit3 size={16}/></button>
                <button className="flex-1 md:flex-none p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SECTION: VENDOR ---
function VendorSection() {
  const vendors = [
    { id: 1, name: 'Palace of Arts', cat: 'Venue', loc: 'Bandung', price: 'Rp 65jt++', phone: '0812-xxx-xxx', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Dapur Estetik', cat: 'Catering', loc: 'Jakarta', price: 'Rp 120rb/pax', phone: '0811-xxx-xxx', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Lumina Photo', cat: 'Photography', loc: 'Bali', price: 'Rp 15jt', phone: '0857-xxx-xxx', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=300' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
      {vendors.map(v => (
        <div key={v.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all">
          <div className="h-56 overflow-hidden relative">
            <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-5 left-5 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900">{v.cat}</div>
          </div>
          <div className="p-8 space-y-4">
            <h4 className="text-xl font-black text-slate-900">{v.name}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic"><MapPin size={14}/> {v.loc}</div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic"><Phone size={14}/> {v.phone}</div>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
              <span className="text-sm font-black text-emerald-600">{v.price}</span>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:underline">Detail Vendor</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- SECTION: MOODBOARD ---
function MoodboardWizard() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ vibe: '', palette: '', theme: '' });

  return (
    <div className="max-w-xl mx-auto py-10">
      {step === 1 && (
        <div className="space-y-10 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm text-slate-900"><Sparkles size={32}/></div>
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-slate-900 italic tracking-tight underline decoration-rose-200 underline-offset-8">Apa Vibe Impian Anda?</h4>
            <div className="grid grid-cols-2 gap-4">
              {['Minimalist', 'Boho', 'Grand Royal', 'Coastal'].map(v => (
                <button key={v} onClick={() => {setAnswers({...answers, vibe: v}); setStep(2)}} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-slate-900 hover:bg-white transition-all font-bold text-sm text-slate-500 hover:text-slate-900">{v}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-10 text-center animate-in slide-in-from-right">
          <h4 className="text-2xl font-black text-slate-900 italic tracking-tight underline decoration-rose-200 underline-offset-8">Dominasi Warna?</h4>
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => setStep(3)} className="p-8 rounded-[2rem] bg-slate-900 text-white font-black text-sm uppercase italic tracking-widest">Earth Tones</button>
             <button onClick={() => setStep(3)} className="p-8 rounded-[2rem] bg-rose-50 text-rose-500 font-black text-sm uppercase italic tracking-widest border border-rose-100">Soft Pastel</button>
          </div>
          <button onClick={() => setStep(1)} className="text-xs font-black text-slate-300 uppercase italic">Kembali</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-10 animate-in zoom-in duration-700">
           <div className="flex justify-between items-end border-b border-slate-100 pb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated Moodboard</p>
                <h4 className="text-3xl font-black text-slate-900 italic tracking-tight">"{answers.vibe} Dream"</h4>
              </div>
              <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"><Download size={14}/> Download PDF</button>
           </div>
           
           <div className="grid grid-cols-3 gap-4 auto-rows-[150px]">
              <div className="col-span-2 row-span-2 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-[10px] text-slate-300 font-black uppercase italic">Main Visual Concept</div>
              <div className="bg-[#D4A373] rounded-3xl"></div>
              <div className="bg-[#E9EDC9] rounded-3xl"></div>
              <div className="col-span-3 bg-slate-50 rounded-[2rem] p-8 flex items-center gap-6">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-indigo-500"><BrainCircuit size={24}/></div>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"Gunakan material alami seperti rotan dan linen untuk memperkuat kesan {answers.vibe} pada area dekorasi utama."</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

// --- SCREEN: NIKAH ---
function Nikah({ guests, setGuests }) {
  const [subTab, setSubTab] = useState('checklist');

  return (
    <div className="animate-in fade-in duration-500">
       <div className="flex gap-4 border-b border-slate-50 mb-10 overflow-x-auto no-scrollbar">
         <button onClick={() => setSubTab('checklist')} className={`px-8 py-4 rounded-t-2xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'checklist' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Checklist Acara</button>
         <button onClick={() => setSubTab('rundown')} className={`px-8 py-4 rounded-t-2xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'rundown' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Rundown Digital</button>
         <button onClick={() => setSubTab('guests')} className={`px-8 py-4 rounded-t-2xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'guests' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Daftar Tamu & QR</button>
       </div>

       <div className="bg-white p-6 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
         {subTab === 'checklist' && (
           <div className="space-y-6">
              <h4 className="text-2xl font-black text-slate-900 italic mb-8">Pengecekan Terakhir</h4>
              {[
                'Cek Mahar & Mas Kawin', 'Distribusi Seragam Keluarga', 
                'Final Check Catering Sesi 1', 'Briefing Team Wedding Organizer',
                'Pengecekan Sound System & List Lagu'
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-900 transition-colors">
                  <input type="checkbox" className="w-6 h-6 rounded-xl border-slate-200" />
                  <span className="text-sm font-black text-slate-700 italic">{t}</span>
                </div>
              ))}
           </div>
         )}

         {subTab === 'rundown' && (
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 italic">
                   <th className="pb-6">Waktu</th>
                   <th className="pb-6">Aktivitas</th>
                   <th className="pb-6">PIC / Penanggung Jawab</th>
                   <th className="pb-6 text-right">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {[
                   { t: '08:00 - 09:30', e: 'Akad Nikah & Ijab Qobul', p: 'Keluarga Pria' },
                   { t: '09:30 - 10:30', e: 'Sesi Foto Keluarga', p: 'Wedding Organizer' },
                   { t: '11:00 - 13:00', e: 'Resepsi Sesi Utama', p: 'Catering & WO' }
                 ].map((row, i) => (
                   <tr key={i} className="group hover:bg-slate-50 transition-colors">
                     <td className="py-6 text-sm font-black text-slate-900 italic">{row.t}</td>
                     <td className="py-6 text-sm font-bold text-slate-600 underline underline-offset-4 decoration-transparent group-hover:decoration-rose-200 transition-all">{row.e}</td>
                     <td className="py-6"><span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest italic">{row.p}</span></td>
                     <td className="py-6 text-right"><button className="p-3 text-slate-300 hover:text-slate-900"><Edit3 size={16}/></button></td>
                   </tr>
                 ))}
               </tbody>
             </table>
             <button className="w-full py-5 border-2 border-dashed border-slate-50 rounded-[2rem] mt-8 text-xs font-black text-slate-300 uppercase tracking-widest italic">+ Tambah Baris Rundown</button>
           </div>
         )}

         {subTab === 'guests' && (
           <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900 p-10 rounded-[3rem] text-white">
                 <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400"><Users size={32}/></div>
                   <div>
                     <h4 className="text-xl font-black italic">Buku Tamu Digital</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Terintegrasi Scan & Photo Library</p>
                   </div>
                 </div>
                 <button onClick={() => setGuests([...guests, { id: Date.now(), name: 'Tamu Baru', email: '-', qr: 'ETR-'+Math.floor(Math.random()*9000) }])} className="w-full md:w-auto bg-white text-slate-900 px-8 py-4 rounded-2xl font-black shadow-xl shadow-white/5 active:scale-95 transition-all text-xs uppercase tracking-widest">+ Add New Guest</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guests.map(g => (
                  <div key={g.id} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:border-slate-900 transition-all shadow-sm">
                    <div>
                      <p className="text-sm font-black text-slate-900">{g.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 italic">Code: {g.qr}</p>
                    </div>
                    <div className="flex gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 bg-slate-50 rounded-xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all"><QrCode size={18}/></button>
                      <button className="p-3 bg-slate-50 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-indigo-50 border border-indigo-100 rounded-[3rem] flex flex-col md:flex-row gap-8 items-center">
                 <Camera size={48} className="text-indigo-400 shrink-0" />
                 <p className="text-xs text-indigo-900 font-bold leading-loose italic">"Setiap tamu yang terdaftar akan otomatis mendapatkan SMS/WhatsApp berisi link QR Code. Saat di-scan di venue, tamu akan otomatis mendapatkan link folder foto bersama pengantin setelah sesi foto selesai."</p>
              </div>
           </div>
         )}
       </div>
    </div>
  );
}

// --- SCREEN: PASCA NIKAH ---
function PascaNikah() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
       <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden group">
          <Home size={200} className="absolute -bottom-20 -left-20 text-slate-50 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 max-w-xl">
             <h3 className="text-4xl font-black text-slate-900 italic tracking-tight mb-4">Pondasi Baru Berdua</h3>
             <p className="text-slate-400 text-sm font-medium leading-relaxed italic">Roadmap setelah pernikahan tidak kalah penting. Eternity membantu Anda menyelaraskan visi finansial dan mimpi-mimpi besar bersama pasangan.</p>
          </div>
          <div className="relative z-10 bg-slate-900 p-8 rounded-[2.5rem] text-white min-w-[240px] text-center shadow-2xl">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Tabungan Rumah Tangga</p>
             <h4 className="text-2xl font-black italic">Rp 12.500.000</h4>
             <button className="mt-6 w-full py-3 bg-white/10 rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-white/20 transition-all">Atur Alokasi</button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PostCard title="Honeymoon Planning" icon={<Plane className="text-sky-500"/>} color="bg-sky-50" target="Rp 45.000.000" current="Rp 12.000.000" />
          <PostCard title="Wishlist: Rumah Pertama" icon={<Home className="text-emerald-500"/>} color="bg-emerald-50" target="Rp 800.000.000" current="Rp 50.000.000" />
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group">
             <h4 className="text-lg font-black text-slate-900 italic mb-8">Monthly Checklist</h4>
             <div className="space-y-4">
                {['Bayar Listrik & Air', 'Alokasi Dana Darurat', 'Belanja Bulanan Berdua'].map((l, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-widest italic group-hover:border-slate-900 transition-all cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-rose-400 transition-all"></div> {l}
                  </div>
                ))}
             </div>
             <button className="mt-8 py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-300 uppercase italic">+ Add Goal</button>
          </div>
       </div>
    </div>
  );
}

function PostCard({ title, icon, color, target, current }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 group hover:border-slate-900 transition-all">
       <div className="flex justify-between items-center">
          <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm`}>
            {React.cloneElement(icon, { size: 24 })}
          </div>
          <button className="p-3 bg-slate-50 rounded-xl text-slate-300 hover:text-slate-900 transition-colors"><Edit3 size={16}/></button>
       </div>
       <div>
          <h4 className="text-xl font-black text-slate-900 italic mb-1">{title}</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Target: {target}</p>
       </div>
       <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black text-slate-900 italic">
             <span>Progress Tabungan</span>
             <span>18%</span>
          </div>
          <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
             <div className="h-full bg-slate-900 w-[18%] group-hover:bg-rose-400 transition-all"></div>
          </div>
       </div>
       <p className="text-sm font-black text-slate-900">{current} <span className="text-xs text-slate-400 font-bold italic ml-2">terkumpul</span></p>
    </div>
  );
}

```