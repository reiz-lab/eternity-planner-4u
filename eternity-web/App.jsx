import React, { useState, useEffect } from 'react';
import { 
  Heart, Home, Target, LogOut, Calculator, 
  ListTodo, Plus, QrCode, Menu, 
  Users, TrendingUp, ChevronRight, UserCircle2,
  Calendar
} from 'lucide-react';

// --- DATA PERSISTENCE HELPERS ---
const SAVE_KEY = 'eternity_v6_session';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [userData, setUserData] = useState({
    name: '', 
    partner: '', 
    incomeSelf: 0, 
    incomePartner: 0,
    weddingDate: '', 
    isDataFilled: false, 
    calculatedBudget: null
  });
  
  const [guests, setGuests] = useState([]);

  // Load Session on Start
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(SAVE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setSession(parsed);
        if (parsed.profile) setUserData(parsed.profile);
        if (parsed.guests) setGuests(parsed.guests);
      }
    } catch (e) {
      console.error("Gagal memuat sesi:", e);
    }
    setLoading(false);
  }, []);

  // Save Session whenever data changes
  const updateStore = (newProfile, newGuests) => {
    const updatedProfile = newProfile || userData;
    const updatedGuests = newGuests || guests;
    
    const dataToSave = {
      profile: updatedProfile,
      guests: updatedGuests
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
    if (newProfile) setUserData(newProfile);
    if (newGuests) setGuests(newGuests);
  };

  const handleSimpleLogin = (name, partner) => {
    const newProfile = { ...userData, name, partner };
    const newSession = { profile: newProfile, guests: [] };
    setSession(newSession);
    updateStore(newProfile, []);
  };

  const handleLogout = () => {
    localStorage.removeItem(SAVE_KEY);
    setSession(null);
    window.location.reload();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!session) return <SimpleAuthScreen onLogin={handleSimpleLogin} />;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-800 font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Heart className="text-white fill-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter">ETERNITY.</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Home size={18}/> },
            { id: 'pranikah', label: 'Pranikah', icon: <Calculator size={18}/> },
            { id: 'nikah', label: 'Pernikahan', icon: <ListTodo size={18}/> },
            { id: 'pascanikah', label: 'Pasca Nikah', icon: <TrendingUp size={18}/> },
          ].map(m => (
            <button 
              key={m.id} 
              onClick={() => setActiveMenu(m.id)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeMenu === m.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <div className="flex items-center gap-3 mb-4 p-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <UserCircle2 size={24} className="text-slate-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate">{userData.name}</p>
              <p className="text-[10px] text-slate-400 truncate">& {userData.partner}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-all">
            <LogOut size={14} /> Reset Sesi
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest">
               {activeMenu}
             </span>
          </div>
          <div className="text-xs font-bold text-slate-400 italic">
            Eternity Planner V6 Pro
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
          {activeMenu === 'dashboard' && <Dashboard profile={userData} />}
          {activeMenu === 'pranikah' && <Pranikah profile={userData} onSave={(d) => updateStore(d, null)} />}
          {activeMenu === 'nikah' && <Nikah guests={guests} onUpdate={(g) => updateStore(null, g)} />}
          {activeMenu === 'pascanikah' && <div className="text-center py-20 opacity-30 font-black italic text-4xl uppercase tracking-tighter">Masa Depan Bersama</div>}
        </div>
      </main>
    </div>
  );
}

// --- SUB-SCREEN: SIMPLE LOGIN ---
function SimpleAuthScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [partner, setPartner] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && partner.trim()) onLogin(name, partner);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-xl">
           <Heart className="text-white fill-white w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase italic">Eternity Planner</h2>
        <p className="text-slate-400 text-xs font-bold mb-8 uppercase tracking-widest">Rencana Suci, Langkah Pasti</p>
        
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Kamu</label>
             <input placeholder="Contoh: Andi" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-black font-bold text-sm" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Pasangan</label>
             <input placeholder="Contoh: Bunga" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-black font-bold text-sm" value={partner} onChange={e => setPartner(e.target.value)} required />
          </div>
          <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black shadow-lg uppercase tracking-widest text-xs mt-4 active:scale-95 transition-all">
            Mulai Perencanaan
          </button>
        </form>
        
        <p className="mt-8 text-[10px] text-slate-300 font-bold text-center leading-loose">
          Data disimpan secara lokal di browser Anda untuk keamanan privasi sementara.
        </p>
      </div>
    </div>
  );
}

// --- DASHBOARD ---
function Dashboard({ profile }) {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h2 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Halo, {profile.name}!</h2>
        <p className="text-slate-400 font-bold italic text-sm">Mari susun masa depan indah bersama {profile.partner}.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-300 mb-6 tracking-widest">Status Persiapan</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-sm font-black italic">Target Keuangan</span>
                  <span className="text-lg font-black">{profile.isDataFilled ? '100%' : '0%'}</span>
               </div>
               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-black transition-all duration-1000 ${profile.isDataFilled ? 'w-full' : 'w-0'}`}></div>
               </div>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-6 italic">Lengkapi data di menu Pranikah untuk kalkulasi otomatis.</p>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start">
             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Rencana Tanggal</p>
             <Calendar size={20} className="text-slate-600" />
          </div>
          <h4 className="text-3xl font-black italic mt-4">{profile.weddingDate ? new Date(profile.weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum Ditentukan'}</h4>
          <div className="mt-4 flex items-center gap-2 text-rose-400 font-bold text-xs">
             <Heart size={14} fill="currentColor" /> {profile.name} & {profile.partner}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PRANIKAH LOGIC ---
function Pranikah({ profile, onSave }) {
  const [formData, setFormData] = useState(profile);
  const totalIncome = (Number(formData.incomeSelf) || 0) + (Number(formData.incomePartner) || 0);

  const calculate = () => {
    const target = totalIncome * 12 * 0.4;
    const budget = {
      total: target,
      items: [
        { name: 'Katering (35%)', value: target * 0.35 },
        { name: 'Gedung & Venue (25%)', value: target * 0.25 },
        { name: 'Dekorasi (20%)', value: target * 0.20 },
        { name: 'MUA & Baju (10%)', value: target * 0.10 },
        { name: 'Lain-lain (10%)', value: target * 0.10 },
      ]
    };
    onSave({ ...formData, isDataFilled: true, calculatedBudget: budget });
  };

  return (
    <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in duration-500">
      <h3 className="text-xl font-black mb-8 italic border-b pb-4 border-slate-50">Kalkulator Budget Aman</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Gaji Bulanan Anda</label>
          <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-black outline-none" value={formData.incomeSelf} onChange={e => setFormData({...formData, incomeSelf: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Gaji Bulanan {profile.partner}</label>
          <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-black outline-none" value={formData.incomePartner} onChange={e => setFormData({...formData, incomePartner: e.target.value})} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Rencana Tanggal</label>
          <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-black outline-none" value={formData.weddingDate || ''} onChange={e => setFormData({...formData, weddingDate: e.target.value})} />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Hitung Berdasarkan Gaji Gabungan</button>

      {profile.calculatedBudget && (
        <div className="mt-12 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Estimasi Budget Pernikahan</p>
            <h4 className="text-4xl font-black italic tracking-tighter">Rp {profile.calculatedBudget.total.toLocaleString('id-ID')}</h4>
            <p className="text-[10px] font-bold text-slate-400 mt-4 italic">*Hasil tabungan 40% gaji gabungan selama 12 bulan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.calculatedBudget.items.map((item, idx) => (
              <div key={idx} className="p-6 border border-slate-50 bg-slate-50/50 rounded-[1.5rem] hover:border-slate-900 transition-all group">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 group-hover:text-slate-900">{item.name}</p>
                <p className="font-black text-slate-900 italic text-lg">Rp {item.value.toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- GUEST LIST ---
function Nikah({ guests, onUpdate }) {
  const [name, setName] = useState('');
  
  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newGuest = {
      id: Date.now(),
      name, 
      status: 'pending', 
      code: Math.random().toString(36).substr(2, 6).toUpperCase()
    };
    onUpdate([...guests, newGuest]);
    setName('');
  };

  const remove = (id) => {
    onUpdate(guests.filter(g => g.id !== id));
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <h3 className="text-xl font-black mb-8 italic border-b pb-4 border-slate-50">Daftar Tamu Undangan</h3>
      <form onSubmit={add} className="flex gap-3 mb-10">
        <input className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-black" placeholder="Masukkan nama tamu..." value={name} onChange={e => setName(e.target.value)} />
        <button type="submit" className="px-8 bg-black text-white rounded-2xl font-black uppercase text-[10px] active:scale-95 transition-all">Tambah</button>
      </form>
      
      {guests.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
           <Users size={40} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-300 font-bold italic">Belum ada tamu yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guests.map(g => (
            <div key={g.id} className="p-6 border border-slate-100 bg-white rounded-2xl flex justify-between items-center group hover:border-slate-900 transition-all">
              <div className="overflow-hidden">
                <span className="font-black italic text-sm block truncate">{g.name}</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{g.code}</span>
              </div>
              <button onClick={() => remove(g.id)} className="p-2 opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-all">
                 <Plus size={20} className="rotate-45" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
