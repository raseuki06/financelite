"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [view, setView] = useState("landing"); // "landing", "login", "register", "app"
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");

  // Finance State
  const [transactions, setTransactions] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Umum");

  useEffect(() => {
    const savedUser = localStorage.getItem("financelite_user");
    if (savedUser) setCurrentUser(savedUser);

    const savedTx = localStorage.getItem("financelite_transactions");
    if (savedTx) {
      try { setTransactions(JSON.parse(savedTx)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("financelite_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    localStorage.setItem("financelite_user", nameInput);
    setCurrentUser(nameInput);
    setView("app");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const dummyName = emailInput.split("@")[0];
    const formattedName = dummyName.charAt(0).toUpperCase() + dummyName.slice(1);
    localStorage.setItem("financelite_user", formattedName);
    setCurrentUser(formattedName);
    setView("app");
  };

  const handleLogout = () => {
    localStorage.removeItem("financelite_user");
    setCurrentUser(null);
    setView("landing");
  };

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    const newTx = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    };
    setTransactions([newTx, ...transactions]);
    setDescription("");
    setAmount("");
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0);
  const totalExpense = transactions.filter((tx) => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"
    }`}>
      
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center transition-colors duration-300 ${
        darkMode ? "bg-slate-950/90 border-slate-800" : "bg-white/90 border-slate-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("landing")}>
            <span className="text-xl">💳</span>
            <span className="font-black tracking-wider text-lg">Finance<span className="text-indigo-500">Lite</span></span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shadow-sm ${
              darkMode ? "bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="Ubah Tema Gelap/Terang"
          >
            <span>{darkMode ? "☀️ Terang" : "🌙 Gelap"}</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => setView("landing")} className="hover:text-indigo-500 transition">Beranda</button>
          <a href="#tentang" className="hover:text-indigo-500 transition">Tentang Proyek</a>
          <a href="#fitur" className="hover:text-indigo-500 transition">Fitur</a>
          <a href="#tim" className="hover:text-indigo-500 transition">Tim</a>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setView("app")} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition">
                Dashboard
              </button>
              <button onClick={handleLogout} className={`text-xs border px-3 py-2 rounded-xl font-semibold transition ${darkMode ? "border-slate-800 hover:bg-slate-900 text-slate-400" : "border-slate-200 hover:bg-slate-100 text-slate-600"}`}>
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setView("login")} className={`text-xs font-bold px-4 py-2 rounded-xl transition ${darkMode ? "text-slate-300 hover:bg-slate-900" : "text-slate-700 hover:bg-slate-100"}`}>
                Masuk
              </button>
              <button onClick={() => setView("register")} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition">
                Daftar
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* VIEW 1: LANDING PAGE */}
      {view === "landing" && (
        <main className="overflow-hidden">
          <section className="relative px-6 pt-24 pb-32 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              ✨ UTS Praktik POPL — Universitas Syiah Kuala
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Kelola Cashflow Keuangan Harian <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">Lebih Cerdas & Profesional</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto mb-10 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Platform pencatatan keuangan modern berbasis web dengan arsitektur reaktif, kontainerisasi Docker, serta dukungan mode gelap & terang instan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setView(currentUser ? "app" : "register")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/30 transition text-base"
              >
                Mulai Sekarang Gratis →
              </button>
              <a
                href="#tentang"
                className={`font-bold px-8 py-4 rounded-xl border transition text-base ${darkMode ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"}`}
              >
                Pelajari Proyek
              </a>
            </div>
          </section>

          {/* SECTION TENTANG */}
          <section id="tentang" className={`py-24 px-6 border-t ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50 border-slate-200/60"}`}>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-indigo-500 text-xs font-bold uppercase tracking-widest">Arsitektur & Sistem</span>
                <h2 className="text-3xl font-black mt-2 mb-4">Fitur Lengkap Standar Industri</h2>
                <p className={`text-sm leading-relaxed mb-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  FinanceLite dirancang memenuhi seluruh rubrik penilaian UTS POPL, menerapkan pola interaksi reaktif, manajemen state yang bersih, dan siap di-deploy via Docker.
                </p>
              </div>
              <div className={`p-6 rounded-2xl border shadow-xl space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <h4 className="font-bold text-sm">🌓 Dynamic Dark/Light Theme</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Kenyamanan visual penuh dengan saklar tema instan.</p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <h4 className="font-bold text-sm">🐳 Docker Containerized (-UTS)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Dibungkus rapi dan siap dipublish ke Docker Hub.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION TIM */}
          <section id="tim" className={`py-20 px-6 border-t text-center ${darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"}`}>
            <h2 className="text-2xl font-bold mb-2">Tim Pengembang Kelompok 17</h2>
            <p className="text-sm text-slate-500 mb-6">Universitas Syiah Kuala — Fakultas MIPA</p>
            <div className="inline-flex flex-wrap justify-center gap-4">
              <span className={`px-4 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "bg-slate-900 border-slate-800 text-indigo-400" : "bg-slate-100 border-slate-200 text-indigo-600"}`}>Muhammad Raseuki (2408107010093)</span>
              <span className={`px-4 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "bg-slate-900 border-slate-800 text-indigo-400" : "bg-slate-100 border-slate-200 text-indigo-600"}`}>M Abid Rahmatillah Z (2408107010090)</span>
            </div>
          </section>
        </main>
      )}

      {/* VIEW 2: LOGIN */}
      {view === "login" && (
        <div className="max-w-md mx-auto py-20 px-4">
          <div className={`p-8 rounded-2xl border shadow-xl ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h2 className="text-2xl font-black mb-2 text-center">Masuk ke Akun</h2>
            <p className="text-xs text-slate-500 text-center mb-6">Kelola keuangan Anda dengan aman.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Email / Username</label>
                <input type="text" placeholder="nama@email.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className={`w-full p-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`} required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Password</label>
                <input type="password" placeholder="••••••••" value={passInput} onChange={(e) => setPassInput(e.target.value)} className={`w-full p-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`} required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 rounded-xl shadow-lg transition text-sm">Masuk</button>
            </form>
            <p className="text-xs text-center mt-6 text-slate-500">Belum punya akun? <button onClick={() => setView("register")} className="text-indigo-500 font-bold hover:underline">Daftar</button></p>
          </div>
        </div>
      )}

      {/* VIEW 3: REGISTER */}
      {view === "register" && (
        <div className="max-w-md mx-auto py-20 px-4">
          <div className={`p-8 rounded-2xl border shadow-xl ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h2 className="text-2xl font-black mb-2 text-center">Daftar Akun Baru</h2>
            <p className="text-xs text-slate-500 text-center mb-6">Mulai pencatatan finansial bersama FinanceLite.</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Nama Lengkap</label>
                <input type="text" placeholder="Muhammad Raseuki" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className={`w-full p-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`} required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Email</label>
                <input type="email" placeholder="nama@email.com" className={`w-full p-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`} required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Password</label>
                <input type="password" placeholder="••••••••" className={`w-full p-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`} required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 rounded-xl shadow-lg transition text-sm">Daftar Sekarang</button>
            </form>
            <p className="text-xs text-center mt-6 text-slate-500">Sudah punya akun? <button onClick={() => setView("login")} className="text-indigo-500 font-bold hover:underline">Masuk</button></p>
          </div>
        </div>
      )}

      {/* VIEW 4: DASHBOARD APLIKASI KEUANGAN */}
      {view === "app" && (
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
          <div className={`p-6 rounded-2xl border flex justify-between items-center ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <div>
              <h1 className="text-2xl font-black">Halo, {currentUser || "Pengguna"} 👋</h1>
              <p className="text-xs text-slate-500">Dashboard Cashflow & Manajemen Keuangan Pribadi</p>
            </div>
            <button onClick={() => setView("landing")} className={`text-xs px-4 py-2 rounded-xl border font-semibold transition ${darkMode ? "border-slate-800 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`}>
              ← Beranda
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border ${darkMode ? "bg-indigo-950/20 border-indigo-500/30" : "bg-indigo-50 border-indigo-200 shadow-sm"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Total Saldo Bersih</p>
              <p className="text-3xl font-black mt-2">Rp {balance.toLocaleString()}</p>
            </div>
            <div className={`p-6 rounded-2xl border ${darkMode ? "bg-emerald-950/20 border-emerald-500/30" : "bg-emerald-50 border-emerald-200 shadow-sm"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Total Pemasukan</p>
              <p className="text-3xl font-black text-emerald-500 mt-2">+ Rp {totalIncome.toLocaleString()}</p>
            </div>
            <div className={`p-6 rounded-2xl border ${darkMode ? "bg-rose-950/20 border-rose-500/30" : "bg-rose-50 border-rose-200 shadow-sm"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Total Pengeluaran</p>
              <p className="text-3xl font-black text-rose-500 mt-2">- Rp {totalExpense.toLocaleString()}</p>
            </div>
          </div>

          {/* Form & History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`p-6 rounded-2xl border h-fit ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
              <h2 className="text-base font-bold mb-4">✍️ Input Transaksi</h2>
              <form onSubmit={addTransaction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Keterangan</label>
                  <input type="text" placeholder="Contoh: Gaji, Makan" value={description} onChange={(e) => setDescription(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nominal (Rp)</label>
                  <input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`} required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tipe</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`}>
                      <option value="income">Pemasukan</option>
                      <option value="expense">Pengeluaran</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Kategori</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"}`}>
                      <option value="Umum">Umum</option>
                      <option value="Gaji">Gaji</option>
                      <option value="Makanan">Makanan</option>
                      <option value="Transport">Transport</option>
                      <option value="Hiburan">Hiburan</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-2.5 rounded-xl transition text-sm shadow-md">
                  Simpan Transaksi
                </button>
              </form>
            </div>

            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} style={{gridColumn: "span 2"}}>
              <div>
                <h2 className="text-base font-bold mb-4">📊 Riwayat Transaksi</h2>
                {transactions.length === 0 ? (
                  <div className={`text-center py-16 rounded-xl border border-dashed text-sm ${darkMode ? "bg-slate-950 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                    Belum ada transaksi tercatat.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {transactions.map((tx) => (
                      <div key={tx.id} className={`flex justify-between items-center p-3.5 rounded-xl border ${darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                        <div>
                          <p className="font-bold text-sm">{tx.description}</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${darkMode ? "bg-slate-900 text-indigo-400" : "bg-indigo-100 text-indigo-700"}`}>{tx.category}</span>
                            <span className="text-xs text-slate-500">{tx.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className={`font-bold text-sm ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                            {tx.type === "income" ? "+" : "-"} Rp {tx.amount.toLocaleString()}
                          </p>
                          <button onClick={() => deleteTransaction(tx.id)} className="bg-rose-500/10 text-rose-500 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-rose-500 hover:text-white transition">
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className={`border-t py-6 text-center text-xs text-slate-500 transition-colors duration-300 ${
        darkMode ? "border-slate-900 bg-slate-950" : "border-slate-200 bg-white"
      }`}>
        © 2026 FinanceLite • Proyek UTS POPL. Containerized with Docker.
      </footer>
    </div>
  );
}