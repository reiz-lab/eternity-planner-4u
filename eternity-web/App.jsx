import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, CheckCircle2, Home, Wallet, Sparkles, 
  ListTodo, Plane, Target, LogOut, Calculator, ArrowRight, 
  Clock, Download, QrCode, Camera, Users, FileText, ChevronRight,
  TrendingUp, AlertCircle, Plus, Edit3, Trash2, MapPin, Phone, 
  DollarSign, PieChart, Info, Save, Menu, X, Mail, Lock, UserPlus
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  collection 
} from 'firebase/firestore';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'eternity-planner-v6';

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [userData, setUserData] = useState({
    name: '', partner: '',
    incomeSelf: 0, incomePartner: 0,
    weddingDate: '',
    isDataFilled: false,
    calculatedBudget: null
  });

  const [budgetPlans, setBudgetPlans] = useState([]);
  const [guests, setGuests] = useState([]);

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync Effect
  useEffect(() => {
    if (!user || (user && !user.emailVerified && !user.providerData.some(p => p.providerId === 'google.com'))) return;

    const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile');
    const unsubProfile = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) setUserData(doc.data());
    }, (err) => console.error(err));

    const guestsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'guests');
    const unsubGuests = onSnapshot(guestsRef, (snapshot) => {
      setGuests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error(err));

    return () => {
      unsubProfile();
      unsubGuests();
    };
  }, [user]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const saveProfile = async (newData) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile'), newData);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Periksa apakah user perlu verifikasi email (kecuali login Google)
  const needsVerification = user && !user.emailVerified && user.providerData.some(p => p.providerId === 'password');

  if (!user) return <AuthScreen onGoogleLogin={handleGoogleLogin} />;
  
  if (needsVerification) return <VerificationScreen user={user} onLogout={handleLogout} />;

  return (
    <div className="flex min-h-screen bg-[#FCFCFD] text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-600">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen z-40">
        <LogoSection />
        <Navigation activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <UserFooter user={user} profile={userData} onLogout={handleLogout} />
      </aside>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">
            <LogoSection />
            <Navigation activeMenu={activeMenu} setActiveMenu={(m) => { setActiveMenu(m); setIsMobileMenuOpen(false); }} />
            <UserFooter user={user} profile={userData} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-slate-50 rounded-xl">
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-black text-slate-900 tracking-tight capitalize">{activeMenu}</h1>
          </div>
          <div className="flex items-center gap-3">
             {userData.weddingDate && <Countdown date={userData.weddingDate} />}
             <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-slate-200 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <Users size={20} className="text-slate-500" />
                )}
             </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {activeMenu === 'dashboard' && <Dashboard user={user} profile={userData} setMenu={setActiveMenu} />}
          {activeMenu === 'pranikah' && (
            <Pranikah profile={userData} onSave={saveProfile} />
          )}
          {activeMenu === 'nikah' && <Nikah guests={guests} userId={user.uid} />}
          {activeMenu === 'pascanikah' && <PascaNikah />}
        </div>
      </main>
    </div>
  );
}

// --- SCREEN: AUTH (Login & Register) ---
function AuthScreen({ onGoogleLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: displayName });
        await sendEmailVerification(userCredential.user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      let message = "Terjadi kesalahan.";
      if (err.code === 'auth/user-not-found') message = "Pengguna tidak ditemukan.";
      if (err.code === 'auth/wrong-password') message = "Kata sandi salah.";
      if (err.code === 'auth/email-already-in-use') message = "Email sudah digunakan.";
      if (err.code === 'auth/weak-password') message = "Kata sandi terlalu lemah (min. 6 karakter).";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-slate-200 p-10 lg:p-14 flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-xl mb-8">
          <Heart className="text-white fill-white w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">ETERNITY.</h2>
        <p className="text-center text-slate-400 text-sm font-medium mb-8 italic leading-relaxed">
          {isRegister ? 'Mulai perjalanan cinta terencana Anda hari ini.' : 'Selamat datang kembali di perencanaan cerdas Anda.'}
        </p>

        {error && (
          <div className="w-full p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold mb-6">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
          {isRegister && (
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Users size={18} /></span>
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none font-bold text-sm transition-all"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
            <input 
              type="email" 
              placeholder="Alamat Email" 
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none font-bold text-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
            <input 
              type="password" 
              placeholder="Kata Sandi" 
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none font-bold text-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk Dashboard')}
          </button>
        </form>

        <div className="flex items-center gap-4 w-full mb-6">
          <div className="h-px bg-slate-100 flex-1"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Atau</span>
          <div className="h-px bg-slate-100 flex-1"></div>
        </div>

        <button 
          onClick={onGoogleLogin}
          className="w-full bg-white border-2 border-slate-100 hover:border-slate-900 text-slate-900 font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-4 shadow-sm active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" width="20" alt="Google" />
          Lanjutkan dengan Google
        </button>

        <p className="mt-10 text-center text-sm font-bold text-slate-400">
          {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} {' '}
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-slate-900 underline underline-offset-4 decoration-rose-300 decoration-2"
          >
            {isRegister ? 'Masuk di sini' : 'Daftar gratis'}
          </button>
        </p>
      </div>
    </div>
  );
}

// --- SCREEN: VERIFICATION ---
function VerificationScreen({ user, onLogout }) {
  const [sent, setSent] = useState(false);

  const resendEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail className="text-rose-500" size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter italic">Verifikasi Email Anda</h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          Kami telah mengirimkan link verifikasi ke <strong>{user.email}</strong>. Mohon periksa kotak masuk (atau spam) Anda dan klik link tersebut untuk mulai menggunakan Eternity Planner.
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl"
          >
            Saya Sudah Verifikasi
          </button>
          <button 
            onClick={resendEmail}
            disabled={sent}
            className="text-slate-400 font-bold text-sm hover:text-slate-900 disabled:opacity-50"
          >
            {sent ? 'Email Terkirim!' : 'Kirim Ulang Email Verifikasi'}
          </button>
          <button 
            onClick={onLogout}
            className="text-rose-500 font-bold text-xs uppercase tracking-widest mt-4"
          >
            Gunakan Akun Lain
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: PRANIKAH (Logic Engine) ---
function Pranikah({ profile, onSave }) {
  const [activeTab, setActiveTab] = useState('input');
  const [formData, setFormData] = useState(profile);

  const calculateBudget = () => {
    const totalIncome = (Number(formData.incomeSelf) || 0) + (Number(formData.incomePartner) || 0);
    const targetTotal = totalIncome * 12 * 0.4;
    
    const breakdown = {
      total: targetTotal,
      catering: targetTotal * 0.35,
      venue: targetTotal * 0.25,
      decor: targetTotal * 0.15,
      wardrobe: targetTotal * 0.10,
      other: targetTotal * 0.15
    };

    const newProfile = { 
      ...formData, 
      isDataFilled: true, 
      calculatedBudget: breakdown 
    };
    
    onSave(newProfile);
    setActiveTab('result');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('input')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'input' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-50'}`}>Input Data</button>
        {profile.isDataFilled && (
          <button onClick={() => setActiveTab('result')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'result' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-50'}`}>Hasil Kalkulasi</button>
        )}
      </div>

      <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px]">
        {activeTab === 'input' ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-2xl font-black text-slate-900 italic underline decoration-rose-200 underline-offset-8">Pondasi Finansial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Anda</label>
                <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Pasangan</label>
                <input value={formData.partner || ''} onChange={e => setFormData({...formData, partner: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gaji Bulanan Anda</label>
                <input type="number" value={formData.incomeSelf || 0} onChange={e => setFormData({...formData, incomeSelf: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gaji Pasangan</label>
                <input type="number" value={formData.incomePartner || 0} onChange={e => setFormData({...formData, incomePartner: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rencana Tanggal Menikah</label>
                <input type="date" value={formData.weddingDate || ''} onChange={e => setFormData({...formData, weddingDate: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
              </div>
            </div>
            <button onClick={calculateBudget} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
              <Calculator size={20} /> Hitung Kalkulasi Akurat
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-700">
             <div className="bg-slate-900 p-10 rounded-[3rem] text-white mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Estimasi Budget Aman (Berdasarkan Tabungan 12 Bulan)</p>
                <h4 className="text-4xl font-black tracking-tighter">Rp {profile.calculatedBudget?.total.toLocaleString('id-ID')}</h4>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BreakdownCard label="Katering (35%)" value={profile.calculatedBudget?.catering} />
                <BreakdownCard label="Gedung/Venue (25%)" value={profile.calculatedBudget?.venue} />
                <BreakdownCard label="Dekorasi (15%)" value={profile.calculatedBudget?.decor} />
                <BreakdownCard label="Baju & MUA (10%)" value={profile.calculatedBudget?.wardrobe} />
                <BreakdownCard label="Biaya Tak Terduga (15%)" value={profile.calculatedBudget?.other} />
                <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 flex flex-col justify-center items-center text-center">
                   <Target className="text-rose-500 mb-2" size={32} />
                   <p className="text-[10px] font-black text-rose-900 uppercase">Target Tabungan</p>
                   <p className="text-lg font-black text-rose-900 italic">Rp {((Number(profile.incomeSelf) + Number(profile.incomePartner)) * 0.4).toLocaleString('id-ID')}/Bulan</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BreakdownCard({ label, value }) {
  return (
    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-slate-900 transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-900">{label}</p>
      <p className="text-xl font-black text-slate-900">Rp {value?.toLocaleString('id-ID')}</p>
    </div>
  );
}

// --- SUB-COMPONENT: NIKAH (Guest Manager) ---
function Nikah({ guests, userId }) {
  const [name, setName] = useState('');

  const addGuest = async () => {
    if (!name) return;
    const guestRef = doc(collection(db, 'artifacts', appId, 'users', userId, 'guests'));
    await setDoc(guestRef, {
      name: name,
      status: 'pending',
      code: 'ETRN-' + Math.random().toString(36).substring(7).toUpperCase(),
      createdAt: Date.now()
    });
    setName('');
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
       <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h4 className="text-2xl font-black text-slate-900 italic mb-8">Daftar Tamu & Buku Tamu Digital</h4>
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
             <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama Tamu / Keluarga..." className="flex-1 px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
             <button onClick={addGuest} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black shadow-lg flex items-center justify-center gap-2">
                <Plus size={18}/> Tambah Tamu
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {guests.map(g => (
               <div key={g.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-slate-900 transition-all">
                  <div>
                    <p className="text-sm font-black text-slate-900">{g.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 italic">{g.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-900"><QrCode size={18}/></button>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
}

// --- SHARED UI COMPONENTS ---
function LogoSection() {
  return (
    <div className="p-8 flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
        <Heart className="text-white fill-white w-5 h-5" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-slate-900">ETERNITY.</span>
    </div>
  );
}

function Navigation({ activeMenu, setActiveMenu }) {
  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20}/> },
    { id: 'pranikah', label: 'Pranikah', icon: <Calculator size={20}/> },
    { id: 'nikah', label: 'Hari Pernikahan', icon: <ListTodo size={20}/> },
    { id: 'pascanikah', label: 'Pasca Nikah', icon: <TrendingUp size={20}/> },
  ];
  return (
    <nav className="flex-1 px-4 space-y-1">
      {menus.map((m) => (
        <button key={m.id} onClick={() => setActiveMenu(m.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeMenu === m.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
          {m.icon} {m.label}
        </button>
      ))}
    </nav>
  );
}

function UserFooter({ user, profile, onLogout }) {
  return (
    <div className="p-6 border-t border-slate-50 mt-auto">
      <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full border border-white bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
                <Users size={18} className="text-slate-400" />
            )}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold text-slate-900 truncate">{user.displayName || profile.name || 'User'}</p>
          <p className="text-[10px] text-slate-400 font-bold truncate lowercase">{user.email}</p>
        </div>
      </div>
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-rose-500 font-bold text-sm transition-colors">
        <LogOut size={16} /> Keluar
      </button>
    </div>
  );
}

function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState('...');
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(date) - new Date();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setTimeLeft(`${days > 0 ? days : 0} Hari Lagi`);
    }, 1000);
    return () => clearInterval(timer);
  }, [date]);
  return <div className="hidden sm:block px-4 py-2 bg-slate-900 rounded-full text-white text-[10px] font-black uppercase">{timeLeft}</div>;
}

function Dashboard({ user, profile, setMenu }) {
  return (
    <div className="animate-in fade-in duration-700">
       <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tight">Halo, {user.displayName || profile.name || 'User'}!</h2>
          <p className="text-slate-400 font-bold mt-2 italic">Siap melangkah menuju masa depan bersama {profile.partner || 'pasangan'}?</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black italic">Kalender Hari Baik</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase">Mei 2026</span>
             </div>
             <div className="grid grid-cols-7 gap-2">
                {[...Array(31)].map((_, i) => (
                  <div key={i} className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold ${[5, 12, 19, 25].includes(i+1) ? 'bg-rose-100 text-rose-500' : 'bg-slate-50 text-slate-300'}`}>
                    {i+1}
                  </div>
                ))}
             </div>
          </div>
          <div className="space-y-6">
             <div className="bg-indigo-900 p-8 rounded-[3rem] text-white">
                <p className="text-[10px] font-black text-indigo-300 uppercase mb-2">Roadmap Aktif</p>
                <h4 className="text-xl font-black italic">Smart Financial Wedding</h4>
                <button onClick={() => setMenu('pranikah')} className="mt-6 w-full py-3 bg-white/10 rounded-xl text-xs font-black">Detail Kalkulasi</button>
             </div>
             <div className="bg-rose-50 p-8 rounded-[3rem] border border-rose-100">
                <p className="text-rose-900 text-sm italic font-bold">"Rencana yang matang adalah separuh dari keberhasilan."</p>
             </div>
          </div>
       </div>
    </div>
  );
}

function PascaNikah() {
  return (
    <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-20 text-center">
       <Home size={64} className="text-slate-100 mb-6" />
       <h3 className="text-2xl font-black text-slate-900 italic mb-2">Halaman Pasca Nikah</h3>
       <p className="text-slate-400 max-w-md font-medium italic">Bagian ini akan terbuka setelah Anda menyelesaikan fase persiapan. Fokus pada tabungan rumah pertama dan dana pendidikan.</p>
    </div>
  );
}
