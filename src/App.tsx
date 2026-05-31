// @ts-nocheck
import { useState, useEffect, useRef } from "react";

// ─── PALETA WGH ───────────────────────────────────────────────
const C = {
  teal: "#0d6e7a",
  tealDark: "#094f59",
  tealLight: "#1a8fa0",
  lime: "#c8d93a",
  limeDark: "#a8b82e",
  white: "#ffffff",
  offWhite: "#f4f7f6",
  gray100: "#e8eeed",
  gray300: "#b0bfbc",
  gray500: "#6b8480",
  gray700: "#2e4441",
  text: "#1a2e2c",
  error: "#c0392b",
  success: "#27ae60",
};

// ─── DEMO DATA ─────────────────────────────────────────────────
const DEMO_SPEAKERS = [
  {
    id: "1", name: "Dra. Valeria Martínez", province: "Buenos Aires",
    expertise: ["Salud Mental", "Políticas Públicas", "Liderazgo"],
    bio_short: "Psiquiatra y referente en políticas de salud mental. Ex Directora Nacional de Salud Mental.",
    bio_long: "Psiquiatra con 20 años de trayectoria en el sistema público. Doctora en Salud Pública por la UBA. Ex Directora Nacional de Salud Mental y Adicciones. Asesora de OPS/OMS en la región. Autora de 3 libros sobre reforma psiquiátrica.",
    languages: ["Español", "Inglés", "Portugués"],
    travel: true, online: true, honorario: "Negociable",
    email: "valeria@demo.com", phone: "+54 11 1234-5678",
    linkedin: "linkedin.com/in/valeriamartinez",
    video: "https://youtube.com",
    talks: ["Reforma del sistema de salud mental", "Liderazgo femenino en instituciones de salud", "Políticas basadas en evidencia"],
    events: ["Coloquio Líderes 2024", "OPS Regional 2023", "Congreso APSA 2022"],
    avatar: null, approved: true, featured: true,
  },
  {
    id: "2", name: "Lic. Camila Ortega", province: "Córdoba",
    expertise: ["Datos en Salud", "Inteligencia Artificial", "Equidad"],
    bio_short: "Especialista en gobernanza de datos sanitarios y aplicaciones de IA en salud pública.",
    bio_long: "Licenciada en Ciencias de Datos. Maestría en Salud Pública. Lidera el área de analytics en un sistema hospitalario de 12 establecimientos. Consultora del BID en proyectos de digitalización sanitaria en LATAM.",
    languages: ["Español", "Inglés"],
    travel: true, online: true, honorario: "USD 500",
    email: "camila@demo.com", phone: "+54 351 987-6543",
    linkedin: "linkedin.com/in/camilaortega",
    video: "",
    talks: ["IA y equidad en salud", "Gobernanza de datos clínicos", "Cómo construir sistemas de información que funcionen"],
    events: ["BID Health Tech 2025", "HIMSS LATAM 2024"],
    avatar: null, approved: true, featured: false,
  },
  {
    id: "3", name: "Dra. Rosa Fernández", province: "Mendoza",
    expertise: ["Salud Materna", "Medicina Comunitaria", "Federalización"],
    bio_short: "Médica de cabecera y activista por la salud reproductiva en territorios vulnerables del NOA y Cuyo.",
    bio_long: "Médica generalista con 15 años en el primer nivel de atención. Coordinadora de la Red de Salud Comunitaria de Cuyo. Docente universitaria. Premio Nacional de Salud Comunitaria 2022.",
    languages: ["Español"],
    travel: false, online: true, honorario: "Sin honorario",
    email: "rosa@demo.com", phone: "+54 261 456-7890",
    linkedin: "",
    video: "",
    talks: ["Primer nivel de atención: la base que falta", "Salud materna en territorios rurales", "Redes comunitarias de salud"],
    events: ["Congreso SAP 2023", "Jornadas NOA-Cuyo 2024"],
    avatar: null, approved: true, featured: true,
  },
];

const EXPERTISE_OPTIONS = [
  "Salud Mental", "Políticas Públicas", "Liderazgo", "Datos en Salud",
  "Inteligencia Artificial", "Equidad en Salud", "Salud Materna",
  "Medicina Comunitaria", "Federalización", "Oncología", "Salud Cardiovascular",
  "Endocrinología", "Salud Sexual y Reproductiva", "Envejecimiento",
  "Fuerza Laboral en Salud", "Innovación", "Financiamiento", "Comunicación en Salud",
];

const PROVINCES = [
  "Buenos Aires", "CABA", "Córdoba", "Santa Fe", "Mendoza", "Tucumán",
  "Salta", "Entre Ríos", "Misiones", "Chaco", "Corrientes", "Santiago del Estero",
  "San Juan", "Jujuy", "Río Negro", "Neuquén", "Formosa", "Chubut",
  "San Luis", "Catamarca", "La Rioja", "La Pampa", "Santa Cruz", "Tierra del Fuego",
];

// ─── STORAGE HELPERS ──────────────────────────────────────────
async function loadSpeakers() {
  try {
    const r = await window.storage.get("wgh_speakers");
    return r ? JSON.parse(r.value) : DEMO_SPEAKERS;
  } catch { return DEMO_SPEAKERS; }
}
async function saveSpeakers(data) {
  try { await window.storage.set("wgh_speakers", JSON.stringify(data)); } catch {}
}
async function loadUsers() {
  try {
    const r = await window.storage.get("wgh_users");
    return r ? JSON.parse(r.value) : [
      { email: "admin@wghargentina.org", password: "admin2026", role: "admin", name: "Admin WGH" },
    ];
  } catch { return [{ email: "admin@wghargentina.org", password: "admin2026", role: "admin", name: "Admin WGH" }]; }
}
async function saveUsers(data) {
  try { await window.storage.set("wgh_users", JSON.stringify(data)); } catch {}
}

// ─── HELPERS ──────────────────────────────────────────────────
const Avatar = ({ name, size = 56 }) => {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue},45%,35%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700,
      fontSize: size * 0.32, flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>{initials}</div>
  );
};

const Tag = ({ label, color = C.teal }) => (
  <span style={{
    background: color + "18", color: color, border: `1px solid ${color}40`,
    borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600,
    whiteSpace: "nowrap",
  }}>{label}</span>
);

const Btn = ({ children, onClick, variant = "primary", small, disabled, style: s }) => {
  const base = {
    border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    padding: small ? "6px 14px" : "10px 20px",
    fontSize: small ? 13 : 14, transition: "all .18s",
    opacity: disabled ? 0.5 : 1, ...s,
  };
  const variants = {
    primary: { background: C.lime, color: C.tealDark },
    secondary: { background: "transparent", color: C.teal, border: `1.5px solid ${C.teal}` },
    danger: { background: C.error + "15", color: C.error, border: `1.5px solid ${C.error}40` },
    ghost: { background: "transparent", color: C.gray500, border: `1px solid ${C.gray300}` },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Input = ({ label, value, onChange, type = "text", placeholder, required, multi, rows = 3 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.gray700, textTransform: "uppercase", letterSpacing: ".5px" }}>
      {label}{required && <span style={{ color: C.error }}> *</span>}
    </label>}
    {multi
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          style={{ padding: "9px 12px", border: `1.5px solid ${C.gray300}`, borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text, resize: "vertical", outline: "none" }} />
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ padding: "9px 12px", border: `1.5px solid ${C.gray300}`, borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text, outline: "none" }} />}
  </div>
);

// ─── PROVINCE MAP (simplified bubble map) ─────────────────────
const ProvinceMap = ({ speakers }) => {
  const counts = {};
  speakers.forEach(s => { counts[s.province] = (counts[s.province] || 0) + 1; });
  const coords = {
    "Buenos Aires": [55, 62], "CABA": [57, 60], "Córdoba": [48, 52],
    "Santa Fe": [52, 48], "Mendoza": [35, 55], "Tucumán": [42, 36],
    "Salta": [38, 28], "Entre Ríos": [56, 50], "Misiones": [62, 30],
    "Chaco": [50, 33], "Corrientes": [58, 36], "Santiago del Estero": [46, 40],
    "San Juan": [32, 48], "Jujuy": [36, 25], "Río Negro": [38, 68],
    "Neuquén": [30, 65], "Formosa": [46, 27], "Chubut": [32, 75],
    "San Luis": [40, 54], "Catamarca": [38, 37], "La Rioja": [36, 43],
    "La Pampa": [42, 62], "Santa Cruz": [28, 83], "Tierra del Fuego": [28, 93],
  };
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 260, margin: "0 auto" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", opacity: .15 }}>
        <rect x="20" y="10" width="60" height="85" rx="8" fill={C.teal} />
      </svg>
      {Object.entries(counts).map(([prov, count]) => {
        const [x, y] = coords[prov] || [50, 50];
        return (
          <div key={prov} title={`${prov}: ${count} speaker${count > 1 ? "s" : ""}`}
            style={{
              position: "absolute", left: `${x}%`, top: `${y}%`,
              transform: "translate(-50%,-50%)",
              width: 8 + count * 6, height: 8 + count * 6,
              borderRadius: "50%", background: C.lime + "cc",
              border: `2px solid ${C.teal}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: C.tealDark,
              cursor: "default", zIndex: 2,
            }}>{count}</div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("public"); // public | login | register | dashboard | admin | profile_form | speaker_detail
  const [user, setUser] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExpertise, setFilterExpertise] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    (async () => {
      const [s, u] = await Promise.all([loadSpeakers(), loadUsers()]);
      setSpeakers(s); setUsers(u); setLoading(false);
    })();
  }, []);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateSpeakers = async (newList) => {
    setSpeakers(newList);
    await saveSpeakers(newList);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.tealDark, fontFamily: "'DM Sans', sans-serif", color: C.white }}>
      Cargando Speaker Bureau…
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.offWhite, minHeight: "100vh", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* NOTIFICATION */}
      {notification && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 9999,
          background: notification.type === "success" ? C.success : C.error,
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,.2)",
          animation: "fadeIn .3s",
        }}>{notification.msg}</div>
      )}

      {/* NAV */}
      <nav style={{
        background: C.tealDark, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60, position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,.25)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => setView("public")}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: C.tealDark, fontWeight: 900, fontSize: 14 }}>W</span>
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14, lineHeight: 1 }}>Speaker Bureau</div>
            <div style={{ color: C.lime, fontSize: 10, letterSpacing: 1 }}>WGH ARGENTINA</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {user ? (
            <>
              {user.role === "admin" && (
                <Btn small variant="ghost" onClick={() => setView("admin")}
                  style={{ color: C.lime, borderColor: C.lime + "60" }}>Panel Admin</Btn>
              )}
              <Btn small variant="ghost" onClick={() => setView("dashboard")}
                style={{ color: C.white, borderColor: C.white + "40" }}>Mi perfil</Btn>
              <Btn small variant="secondary" onClick={() => { setUser(null); setView("public"); }}
                style={{ borderColor: C.white + "60", color: C.white }}>Salir</Btn>
            </>
          ) : (
            <>
              <Btn small variant="ghost" onClick={() => setView("login")}
                style={{ color: C.white, borderColor: C.white + "40" }}>Iniciar sesión</Btn>
              <Btn small variant="primary" onClick={() => setView("register")}>Postularme</Btn>
            </>
          )}
        </div>
      </nav>

      {/* VIEWS */}
      {view === "public" && <PublicView speakers={speakers} onSelect={s => { setSelectedSpeaker(s); setView("speaker_detail"); }}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterExpertise={filterExpertise} setFilterExpertise={setFilterExpertise}
        filterProvince={filterProvince} setFilterProvince={setFilterProvince} />}

      {view === "speaker_detail" && <SpeakerDetail speaker={selectedSpeaker} onBack={() => setView("public")} user={user} />}

      {view === "login" && <LoginView users={users} onLogin={(u) => { setUser(u); setView(u.role === "admin" ? "admin" : "dashboard"); }} onRegister={() => setView("register")} notify={notify} />}

      {view === "register" && <RegisterView users={users} speakers={speakers} onSave={async (newUser, newSpeaker) => {
        const nu = [...users, newUser]; const ns = [...speakers, newSpeaker];
        setUsers(nu); await saveUsers(nu);
        await updateSpeakers(ns);
        setUser(newUser); notify("¡Postulación enviada! El equipo WGH revisará tu perfil."); setView("dashboard");
      }} onLogin={() => setView("login")} />}

      {view === "dashboard" && user && <DashboardView user={user} speakers={speakers} onEdit={(s) => { setSelectedSpeaker(s); setView("profile_form"); }} onSpeakerUpdate={updateSpeakers} notify={notify} />}

      {view === "profile_form" && <ProfileFormView speaker={selectedSpeaker} onSave={async (updated) => {
        const ns = speakers.map(s => s.id === updated.id ? updated : s);
        await updateSpeakers(ns); notify("Perfil actualizado."); setView("dashboard");
      }} onCancel={() => setView("dashboard")} />}

      {view === "admin" && user?.role === "admin" && <AdminView speakers={speakers} users={users} onUpdate={updateSpeakers} notify={notify} />}
    </div>
  );
}

// ─── PUBLIC VIEW ──────────────────────────────────────────────
function PublicView({ speakers, onSelect, searchTerm, setSearchTerm, filterExpertise, setFilterExpertise, filterProvince, setFilterProvince }) {
  const approved = speakers.filter(s => s.approved);
  const featured = approved.filter(s => s.featured);
  const filtered = approved.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.expertise.some(e => e.toLowerCase().includes(q)) || s.province.toLowerCase().includes(q);
    const matchExp = !filterExpertise || s.expertise.includes(filterExpertise);
    const matchProv = !filterProvince || s.province === filterProvince;
    return matchSearch && matchExp && matchProv;
  });

  return (
    <div>
      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${C.tealDark} 0%, ${C.teal} 60%, ${C.tealLight} 100%)`, padding: "52px 24px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: C.lime + "22", border: `1px solid ${C.lime}60`, borderRadius: 20, padding: "4px 14px", fontSize: 11, color: C.lime, letterSpacing: 1.5, marginBottom: 14, fontWeight: 600 }}>
          SPEAKER BUREAU
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: C.white, fontSize: "clamp(24px, 4vw, 38px)", margin: "0 0 12px", lineHeight: 1.2 }}>
          Mujeres expertas en salud<br /><span style={{ color: C.lime }}>listas para hablar.</span>
        </h1>
        <p style={{ color: C.white + "bb", fontSize: 15, maxWidth: 520, margin: "0 auto 28px" }}>
          Líderes, investigadoras y decisoras del sistema de salud argentino disponibles para eventos, paneles y medios.
        </p>
        <div style={{ display: "flex", gap: 8, maxWidth: 520, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, tema o provincia…"
            style={{ flex: 1, minWidth: 200, padding: "10px 16px", border: "none", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
          <select value={filterExpertise} onChange={e => setFilterExpertise(e.target.value)}
            style={{ padding: "10px 12px", border: "none", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.white, color: C.text, cursor: "pointer" }}>
            <option value="">Todos los temas</option>
            {EXPERTISE_OPTIONS.map(e => <option key={e}>{e}</option>)}
          </select>
          <select value={filterProvince} onChange={e => setFilterProvince(e.target.value)}
            style={{ padding: "10px 12px", border: "none", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.white, color: C.text, cursor: "pointer" }}>
            <option value="">Todas las provincias</option>
            {PROVINCES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* STATS ROW */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { n: approved.length, label: "Speakers activas" },
            { n: [...new Set(approved.map(s => s.province))].length, label: "Provincias" },
            { n: [...new Set(approved.flatMap(s => s.expertise))].length, label: "Áreas de expertise" },
            { n: approved.filter(s => s.online).length, label: "Disponibles online" },
          ].map(({ n, label }) => (
            <div key={label} style={{ flex: 1, minWidth: 120, background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,.07)", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.teal, fontFamily: "'Playfair Display', serif" }}>{n}</div>
              <div style={{ fontSize: 12, color: C.gray500, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 28, alignItems: "start" }}>
          <div>
            {/* FEATURED */}
            {!searchTerm && !filterExpertise && !filterProvince && featured.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>✦ Destacadas</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {featured.map(s => <SpeakerCard key={s.id} speaker={s} onClick={() => onSelect(s)} featured />)}
                </div>
              </div>
            )}

            {/* ALL */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 1.5, textTransform: "uppercase" }}>
                {searchTerm || filterExpertise || filterProvince ? `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}` : "Todas las speakers"}
              </div>
              {(searchTerm || filterExpertise || filterProvince) && (
                <Btn small variant="ghost" onClick={() => { setSearchTerm(""); setFilterExpertise(""); setFilterProvince(""); }}>Limpiar filtros</Btn>
              )}
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.gray500 }}>No se encontraron speakers con esos filtros.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {filtered.map(s => <SpeakerCard key={s.id} speaker={s} onClick={() => onSelect(s)} />)}
              </div>
            )}
          </div>

          {/* SIDEBAR MAP */}
          <div style={{ background: C.white, borderRadius: 16, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,.07)", position: "sticky", top: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Distribución federal</div>
            <ProvinceMap speakers={approved} />
            <div style={{ marginTop: 16, borderTop: `1px solid ${C.gray100}`, paddingTop: 14 }}>
              {Object.entries(
                approved.reduce((acc, s) => { acc[s.province] = (acc[s.province] || 0) + 1; return acc; }, {})
              ).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([prov, count]) => (
                <div key={prov} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", color: C.gray700 }}>
                  <span>{prov}</span>
                  <span style={{ fontWeight: 700, color: C.teal }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeakerCard({ speaker, onClick, featured }) {
  return (
    <div onClick={onClick} style={{
      background: C.white, borderRadius: 14, padding: "18px",
      boxShadow: featured ? `0 2px 16px ${C.teal}22` : "0 1px 6px rgba(0,0,0,.07)",
      border: featured ? `1.5px solid ${C.lime}` : `1px solid ${C.gray100}`,
      cursor: "pointer", transition: "transform .15s, box-shadow .15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${C.teal}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = featured ? `0 2px 16px ${C.teal}22` : "0 1px 6px rgba(0,0,0,.07)"; }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
        <Avatar name={speaker.name} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.3 }}>{speaker.name}</div>
          <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>📍 {speaker.province}</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: C.gray700, margin: "0 0 12px", lineHeight: 1.5 }}>{speaker.bio_short}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {speaker.expertise.slice(0, 3).map(e => <Tag key={e} label={e} />)}
        {speaker.expertise.length > 3 && <Tag label={`+${speaker.expertise.length - 3}`} color={C.gray500} />}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {speaker.travel && <span style={{ fontSize: 11, color: C.gray500 }}>✈️ Viaja</span>}
        {speaker.online && <span style={{ fontSize: 11, color: C.gray500 }}>💻 Online</span>}
        {speaker.languages?.length > 1 && <span style={{ fontSize: 11, color: C.gray500 }}>🌐 {speaker.languages.length} idiomas</span>}
      </div>
    </div>
  );
}

// ─── SPEAKER DETAIL ───────────────────────────────────────────
function SpeakerDetail({ speaker, onBack, user }) {
  if (!speaker) return null;
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
      <Btn variant="ghost" small onClick={onBack}>← Volver al directorio</Btn>
      <div style={{ background: C.white, borderRadius: 20, padding: "32px", marginTop: 16, boxShadow: "0 2px 16px rgba(0,0,0,.08)" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
          <Avatar name={speaker.name} size={72} />
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 24, color: C.tealDark }}>{speaker.name}</h2>
            <div style={{ color: C.gray500, fontSize: 14, marginTop: 4 }}>📍 {speaker.province}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {speaker.expertise.map(e => <Tag key={e} label={e} />)}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Sobre</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, margin: 0 }}>{speaker.bio_long || speaker.bio_short}</p>

            {speaker.talks?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Temas de presentación</h3>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {speaker.talks.map((t, i) => <li key={i} style={{ fontSize: 14, color: C.text, marginBottom: 4 }}>{t}</li>)}
                </ul>
              </div>
            )}

            {speaker.events?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Eventos anteriores</h3>
                {speaker.events.map((e, i) => <div key={i} style={{ fontSize: 13, color: C.teal, marginBottom: 3 }}>✓ {e}</div>)}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: C.offWhite, borderRadius: 12, padding: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Disponibilidad</h3>
              {speaker.travel && <div style={{ fontSize: 13, color: C.text, marginBottom: 4 }}>✈️ Disponible para viajar</div>}
              {speaker.online && <div style={{ fontSize: 13, color: C.text, marginBottom: 4 }}>💻 Disponible online</div>}
              {speaker.honorario && <div style={{ fontSize: 13, color: C.text, marginBottom: 4 }}>💰 {speaker.honorario}</div>}
            </div>

            {speaker.languages?.length > 0 && (
              <div style={{ background: C.offWhite, borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Idiomas</h3>
                {speaker.languages.map(l => <div key={l} style={{ fontSize: 13, color: C.text, marginBottom: 3 }}>🌐 {l}</div>)}
              </div>
            )}

            {/* Contact only shown to logged-in users */}
            {user ? (
              <div style={{ background: C.tealDark, borderRadius: 12, padding: 16, color: C.white }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: C.lime, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Contacto</h3>
                {speaker.email && <div style={{ fontSize: 13, marginBottom: 4 }}>✉️ {speaker.email}</div>}
                {speaker.phone && <div style={{ fontSize: 13, marginBottom: 4 }}>📞 {speaker.phone}</div>}
                {speaker.linkedin && <div style={{ fontSize: 13, marginBottom: 4 }}>🔗 {speaker.linkedin}</div>}
                {speaker.video && <a href={speaker.video} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: C.lime, display: "block" }}>▶ Ver video</a>}
              </div>
            ) : (
              <div style={{ background: C.teal + "15", border: `1px solid ${C.teal}40`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, color: C.teal, fontWeight: 600, marginBottom: 8 }}>¿Querés contactar a esta speaker?</div>
                <div style={{ fontSize: 12, color: C.gray500, marginBottom: 12 }}>El contacto directo está disponible para socias WGH.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href="mailto:coloquio@wghargentina.org" style={{ fontSize: 13, background: C.lime, color: C.tealDark, padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontWeight: 700, textAlign: "center" }}>
                    Contactar via WGH
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────
function LoginView({ users, onLogin, onRegister, notify }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const u = users.find(u => u.email === email && u.password === password);
    if (u) { onLogin(u); }
    else notify("Email o contraseña incorrectos.", "error");
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.lime, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: C.tealDark, fontWeight: 900, fontSize: 20 }}>W</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.tealDark, margin: "0 0 4px" }}>Iniciar sesión</h2>
          <p style={{ color: C.gray500, fontSize: 13, margin: 0 }}>Speaker Bureau · WGH Argentina</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="tu@email.com" />
          <Input label="Contraseña" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
          <Btn onClick={handleLogin}>Ingresar</Btn>
          <div style={{ textAlign: "center", fontSize: 13, color: C.gray500 }}>
            ¿No tenés perfil?{" "}
            <span style={{ color: C.teal, cursor: "pointer", fontWeight: 600 }} onClick={onRegister}>Postularme como speaker</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: C.gray300, borderTop: `1px solid ${C.gray100}`, paddingTop: 12 }}>
            Demo admin: admin@wghargentina.org / admin2026
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────
function RegisterView({ users, speakers, onSave, onLogin }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "", password: "", confirmPassword: "", name: "",
    province: "", bio_short: "", bio_long: "",
    expertise: [], languages: [], travel: false, online: true,
    honorario: "", email_contact: "", phone: "", linkedin: "", video: "",
    talks: ["", "", ""], events: ["", ""],
  });
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleExpertise = (e) => set("expertise", form.expertise.includes(e) ? form.expertise.filter(x => x !== e) : [...form.expertise, e]);
  const toggleLang = (l) => set("languages", form.languages.includes(l) ? form.languages.filter(x => x !== l) : [...form.languages, l]);

  const handleSubmit = () => {
    if (!form.email || !form.password || !form.name) { setError("Completá los campos obligatorios."); return; }
    if (form.password !== form.confirmPassword) { setError("Las contraseñas no coinciden."); return; }
    if (users.find(u => u.email === form.email)) { setError("Ese email ya está registrado."); return; }

    const newUser = { email: form.email, password: form.password, role: "speaker", name: form.name };
    const newSpeaker = {
      id: Date.now().toString(), name: form.name, province: form.province,
      expertise: form.expertise, bio_short: form.bio_short, bio_long: form.bio_long,
      languages: form.languages, travel: form.travel, online: form.online,
      honorario: form.honorario, email: form.email_contact || form.email,
      phone: form.phone, linkedin: form.linkedin, video: form.video,
      talks: form.talks.filter(Boolean), events: form.events.filter(Boolean),
      approved: false, featured: false,
    };
    onSave(newUser, newSpeaker);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ background: C.white, borderRadius: 20, padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,.08)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.tealDark, margin: "0 0 4px" }}>Postularme como Speaker</h2>
        <p style={{ color: C.gray500, fontSize: 13, margin: "0 0 24px" }}>Tu perfil será revisado por el equipo WGH antes de publicarse.</p>

        {/* STEP INDICATOR */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? C.lime : C.gray100 }} />
          ))}
        </div>

        {error && <div style={{ background: C.error + "15", color: C.error, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: C.tealDark }}>Cuenta de acceso</h3>
            <Input label="Nombre completo" value={form.name} onChange={v => set("name", v)} required placeholder="Dra. Ana García" />
            <Input label="Email" value={form.email} onChange={v => set("email", v)} type="email" required placeholder="tu@email.com" />
            <Input label="Contraseña" value={form.password} onChange={v => set("password", v)} type="password" required placeholder="Mínimo 6 caracteres" />
            <Input label="Confirmar contraseña" value={form.confirmPassword} onChange={v => set("confirmPassword", v)} type="password" required placeholder="Repetí tu contraseña" />
            <Btn onClick={() => { setError(""); setStep(2); }}>Siguiente →</Btn>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: C.tealDark }}>Tu perfil profesional</h3>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.gray700, textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 6 }}>Provincia <span style={{ color: C.error }}>*</span></label>
              <select value={form.province} onChange={e => set("province", e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${C.gray300}`, borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                <option value="">Seleccioná tu provincia</option>
                {PROVINCES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <Input label="Bio corta (para el directorio)" value={form.bio_short} onChange={v => set("bio_short", v)} multi rows={2} placeholder="Una línea que describa tu experiencia y rol actual." />
            <Input label="Bio completa" value={form.bio_long} onChange={v => set("bio_long", v)} multi rows={4} placeholder="Tu trayectoria, logros, publicaciones, roles." />
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.gray700, textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 8 }}>Áreas de expertise</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {EXPERTISE_OPTIONS.map(e => (
                  <div key={e} onClick={() => toggleExpertise(e)} style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: form.expertise.includes(e) ? C.teal : C.gray100,
                    color: form.expertise.includes(e) ? C.white : C.gray700,
                  }}>{e}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Btn variant="ghost" onClick={() => setStep(1)}>← Atrás</Btn>
              <Btn onClick={() => { setError(""); setStep(3); }}>Siguiente →</Btn>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: C.tealDark }}>Disponibilidad y contacto</h3>
            <div style={{ display: "flex", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={form.travel} onChange={e => set("travel", e.target.checked)} />
                Disponible para viajar
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={form.online} onChange={e => set("online", e.target.checked)} />
                Disponible online
              </label>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.gray700, textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 8 }}>Idiomas</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Español", "Inglés", "Portugués", "Francés"].map(l => (
                  <div key={l} onClick={() => toggleLang(l)} style={{
                    padding: "4px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: 600,
                    background: form.languages.includes(l) ? C.teal : C.gray100,
                    color: form.languages.includes(l) ? C.white : C.gray700,
                  }}>{l}</div>
                ))}
              </div>
            </div>
            <Input label="Honorario / cachet" value={form.honorario} onChange={v => set("honorario", v)} placeholder="Sin honorario / Negociable / USD 500" />
            <Input label="Email de contacto público" value={form.email_contact} onChange={v => set("email_contact", v)} type="email" placeholder="Puede ser el mismo que usás para login" />
            <Input label="Teléfono" value={form.phone} onChange={v => set("phone", v)} placeholder="+54 11 ..." />
            <Input label="LinkedIn" value={form.linkedin} onChange={v => set("linkedin", v)} placeholder="linkedin.com/in/..." />
            <Input label="Video / Charla TED / Keynote (URL)" value={form.video} onChange={v => set("video", v)} placeholder="https://..." />
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.gray700, textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 8 }}>Temas de presentación (hasta 3)</label>
              {form.talks.map((t, i) => (
                <input key={i} value={t} onChange={e => set("talks", form.talks.map((x, j) => j === i ? e.target.value : x))}
                  placeholder={`Tema ${i + 1}`}
                  style={{ width: "100%", padding: "8px 12px", border: `1.5px solid ${C.gray300}`, borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginBottom: 6, boxSizing: "border-box" }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Btn variant="ghost" onClick={() => setStep(2)}>← Atrás</Btn>
              <Btn onClick={handleSubmit}>Enviar postulación</Btn>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.gray500 }}>
          ¿Ya tenés cuenta?{" "}
          <span style={{ color: C.teal, cursor: "pointer", fontWeight: 600 }} onClick={onLogin}>Iniciar sesión</span>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD (speaker) ──────────────────────────────────────
function DashboardView({ user, speakers, onEdit, notify }) {
  const mySpeaker = speakers.find(s => s.email === user.email || s.name === user.name);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.tealDark, margin: "0 0 4px" }}>Mi perfil de Speaker</h2>
      <p style={{ color: C.gray500, fontSize: 13, margin: "0 0 24px" }}>Bienvenida, {user.name}</p>

      {mySpeaker ? (
        <div style={{ background: C.white, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar name={mySpeaker.name} size={52} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{mySpeaker.name}</div>
                <div style={{ fontSize: 13, color: C.gray500 }}>{mySpeaker.province}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: mySpeaker.approved ? C.success + "20" : "#f39c12" + "20",
                color: mySpeaker.approved ? C.success : "#f39c12",
              }}>{mySpeaker.approved ? "✓ Aprobada" : "⏳ En revisión"}</span>
              <Btn small variant="secondary" onClick={() => onEdit(mySpeaker)}>Editar perfil</Btn>
            </div>
          </div>

          {!mySpeaker.approved && (
            <div style={{ background: "#f39c12" + "15", border: `1px solid #f39c1240`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#8a6000", marginBottom: 20 }}>
              Tu perfil está siendo revisado por el equipo de WGH Argentina. Te avisaremos cuando esté publicado.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Expertise</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {mySpeaker.expertise.map(e => <Tag key={e} label={e} />)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Disponibilidad</div>
              {mySpeaker.travel && <div style={{ fontSize: 13 }}>✈️ Disponible para viajar</div>}
              {mySpeaker.online && <div style={{ fontSize: 13 }}>💻 Disponible online</div>}
            </div>
          </div>

          {mySpeaker.talks?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Temas</div>
              {mySpeaker.talks.map((t, i) => <div key={i} style={{ fontSize: 13, color: C.text, padding: "3px 0" }}>• {t}</div>)}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: C.white, borderRadius: 16, padding: 32, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎤</div>
          <p style={{ color: C.gray500 }}>No encontramos tu perfil de speaker. Puede que todavía esté siendo procesado.</p>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE FORM (edit) ──────────────────────────────────────
function ProfileFormView({ speaker, onSave, onCancel }) {
  const [form, setForm] = useState({ ...speaker });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleExpertise = (e) => set("expertise", form.expertise.includes(e) ? form.expertise.filter(x => x !== e) : [...form.expertise, e]);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ background: C.white, borderRadius: 20, padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,.08)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.tealDark, margin: "0 0 24px" }}>Editar perfil</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Nombre" value={form.name} onChange={v => set("name", v)} required />
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.gray700, textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 6 }}>Provincia</label>
            <select value={form.province} onChange={e => set("province", e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${C.gray300}`, borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
              {PROVINCES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <Input label="Bio corta" value={form.bio_short} onChange={v => set("bio_short", v)} multi rows={2} />
          <Input label="Bio completa" value={form.bio_long} onChange={v => set("bio_long", v)} multi rows={5} />
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.gray700, textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 8 }}>Áreas de expertise</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXPERTISE_OPTIONS.map(e => (
                <div key={e} onClick={() => toggleExpertise(e)} style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: form.expertise.includes(e) ? C.teal : C.gray100,
                  color: form.expertise.includes(e) ? C.white : C.gray700,
                }}>{e}</div>
              ))}
            </div>
          </div>
          <Input label="Honorario" value={form.honorario} onChange={v => set("honorario", v)} placeholder="Sin honorario / Negociable / USD 500" />
          <Input label="Teléfono" value={form.phone} onChange={v => set("phone", v)} />
          <Input label="LinkedIn" value={form.linkedin} onChange={v => set("linkedin", v)} />
          <Input label="Video URL" value={form.video} onChange={v => set("video", v)} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
            <Btn onClick={() => onSave(form)}>Guardar cambios</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN VIEW ───────────────────────────────────────────────
function AdminView({ speakers, users, onUpdate, notify }) {
  const [tab, setTab] = useState("pending");
  const pending = speakers.filter(s => !s.approved);
  const approved = speakers.filter(s => s.approved);

  const approve = async (id) => {
    const updated = speakers.map(s => s.id === id ? { ...s, approved: true } : s);
    await onUpdate(updated); notify("Speaker aprobada.");
  };
  const reject = async (id) => {
    const updated = speakers.filter(s => s.id !== id);
    await onUpdate(updated); notify("Speaker eliminada.");
  };
  const toggleFeatured = async (id) => {
    const updated = speakers.map(s => s.id === id ? { ...s, featured: !s.featured } : s);
    await onUpdate(updated); notify("Destacada actualizada.");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.tealDark, margin: "0 0 4px" }}>Panel de Administración</h2>
      <p style={{ color: C.gray500, fontSize: 13, margin: "0 0 20px" }}>Speaker Bureau · WGH Argentina</p>

      {/* STATS */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { n: pending.length, label: "Pendientes", color: "#f39c12" },
          { n: approved.length, label: "Aprobadas", color: C.success },
          { n: speakers.filter(s => s.featured).length, label: "Destacadas", color: C.teal },
          { n: users.length, label: "Usuarios", color: C.gray500 },
        ].map(({ n, label, color }) => (
          <div key={label} style={{ flex: 1, minWidth: 100, background: C.white, borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 6px rgba(0,0,0,.07)", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color }}>{n}</div>
            <div style={{ fontSize: 11, color: C.gray500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: C.gray100, padding: 4, borderRadius: 10, width: "fit-content" }}>
        {[["pending", `Pendientes (${pending.length})`], ["approved", "Aprobadas"], ["export", "Exportar"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 16px", borderRadius: 8, border: "none", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            background: tab === t ? C.white : "transparent",
            color: tab === t ? C.tealDark : C.gray500,
            boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,.1)" : "none",
          }}>{label}</button>
        ))}
      </div>

      {tab === "pending" && (
        pending.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: C.gray500, background: C.white, borderRadius: 12 }}>No hay postulaciones pendientes.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map(s => (
              <AdminCard key={s.id} speaker={s} onApprove={() => approve(s.id)} onReject={() => reject(s.id)} />
            ))}
          </div>
        )
      )}

      {tab === "approved" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {approved.map(s => (
            <div key={s.id} style={{ background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar name={s.name} size={40} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: C.gray500 }}>{s.province} · {s.expertise.slice(0, 2).join(", ")}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn small variant={s.featured ? "primary" : "ghost"} onClick={() => toggleFeatured(s.id)}>
                  {s.featured ? "★ Destacada" : "☆ Destacar"}
                </Btn>
                <Btn small variant="danger" onClick={() => reject(s.id)}>Eliminar</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "export" && <ExportTab speakers={approved} />}
    </div>
  );
}

function AdminCard({ speaker, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,.07)", border: `1px solid #f39c1240` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar name={speaker.name} size={44} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{speaker.name}</div>
            <div style={{ fontSize: 12, color: C.gray500 }}>{speaker.province} · {speaker.email}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
              {speaker.expertise.slice(0, 3).map(e => <Tag key={e} label={e} />)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn small variant="ghost" onClick={() => setExpanded(!expanded)}>{expanded ? "Menos" : "Ver más"}</Btn>
          <Btn small variant="danger" onClick={onReject}>Rechazar</Btn>
          <Btn small onClick={onApprove}>✓ Aprobar</Btn>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: 16, borderTop: `1px solid ${C.gray100}`, paddingTop: 14, fontSize: 13, color: C.gray700, lineHeight: 1.6 }}>
          <strong>Bio:</strong> {speaker.bio_long || speaker.bio_short}<br />
          {speaker.talks?.length > 0 && <><strong>Temas:</strong> {speaker.talks.filter(Boolean).join(" / ")}<br /></>}
          <strong>Disponibilidad:</strong> {[speaker.travel && "Viaja", speaker.online && "Online"].filter(Boolean).join(", ")} · {speaker.honorario || "No indicado"}
        </div>
      )}
    </div>
  );
}

function ExportTab({ speakers }) {
  const exportCSV = () => {
    const headers = ["Nombre", "Provincia", "Expertise", "Bio corta", "Email", "Teléfono", "LinkedIn", "Viaja", "Online", "Honorario", "Temas"];
    const rows = speakers.map(s => [
      s.name, s.province, s.expertise.join("; "), s.bio_short,
      s.email, s.phone || "", s.linkedin || "",
      s.travel ? "Sí" : "No", s.online ? "Sí" : "No",
      s.honorario || "", (s.talks || []).filter(Boolean).join("; "),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "wgh_speakers.csv"; a.click();
  };

  return (
    <div style={{ background: C.white, borderRadius: 16, padding: 28, boxShadow: "0 1px 6px rgba(0,0,0,.07)" }}>
      <h3 style={{ margin: "0 0 12px", color: C.tealDark }}>Exportar directorio</h3>
      <p style={{ fontSize: 14, color: C.gray500, margin: "0 0 20px" }}>
        Descargá el listado completo de speakers aprobadas para presentar a sponsors, organizadores de eventos o equipos internos.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Btn onClick={exportCSV}>⬇ Exportar CSV ({speakers.length} speakers)</Btn>
      </div>
      <div style={{ marginTop: 20, padding: 16, background: C.offWhite, borderRadius: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 8 }}>INCLUYE EN EL EXPORT</div>
        {["Nombre completo", "Provincia", "Áreas de expertise", "Bio profesional", "Datos de contacto", "Disponibilidad y honorario", "Temas de presentación"].map(f => (
          <div key={f} style={{ fontSize: 13, color: C.text, padding: "2px 0" }}>✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
