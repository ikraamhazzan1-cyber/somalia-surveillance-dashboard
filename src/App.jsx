import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";

const C = {
  bg: "#060d1a",
  panel: "#0d1b2e",
  border: "#1a2d45",
  teal: "#0ea5e9",
  tealDim: "#0369a1",
  green: "#10b981",
  yellow: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  white: "#f0f6ff",
  muted: "#4a6280",
  text: "#c8dff2",
};

const DISEASE_COLORS = {
  Cholera: "#0ea5e9",
  Measles: "#f59e0b",
  Malaria: "#10b981",
  AWD: "#8b5cf6",
};

const REGIONS = [
  { id: "banadir", name: "Banadir (Mogadishu)", cholera: 412, measles: 189, malaria: 94, awd: 321, pop: 2587000, alert: "red" },
  { id: "lower_shabelle", name: "Lower Shabelle", cholera: 287, measles: 143, malaria: 211, awd: 198, pop: 1637000, alert: "yellow" },
  { id: "middle_shabelle", name: "Middle Shabelle", cholera: 198, measles: 98, malaria: 176, awd: 145, pop: 641000, alert: "yellow" },
  { id: "bay", name: "Bay", cholera: 165, measles: 211, malaria: 88, awd: 132, pop: 1127000, alert: "red" },
  { id: "bakool", name: "Bakool", cholera: 143, measles: 167, malaria: 74, awd: 118, pop: 491000, alert: "yellow" },
  { id: "hiraan", name: "Hiraan", cholera: 122, measles: 134, malaria: 198, awd: 109, pop: 641000, alert: "yellow" },
  { id: "galgaduud", name: "Galgaduud", cholera: 98, measles: 87, malaria: 156, awd: 87, pop: 560000, alert: "green" },
  { id: "mudug", name: "Mudug", cholera: 76, measles: 76, malaria: 134, awd: 65, pop: 794000, alert: "green" },
  { id: "nugaal", name: "Nugaal", cholera: 45, measles: 54, malaria: 67, awd: 43, pop: 372000, alert: "green" },
  { id: "bari", name: "Bari", cholera: 34, measles: 43, malaria: 54, awd: 32, pop: 779000, alert: "green" },
  { id: "sool", name: "Sool", cholera: 56, measles: 65, malaria: 87, awd: 54, pop: 491000, alert: "green" },
  { id: "sanaag", name: "Sanaag", cholera: 43, measles: 54, malaria: 76, awd: 41, pop: 597000, alert: "green" },
  { id: "togdheer", name: "Togdheer", cholera: 67, measles: 78, malaria: 98, awd: 58, pop: 709000, alert: "green" },
  { id: "woqooyi", name: "Woqooyi Galbeed", cholera: 54, measles: 67, malaria: 65, awd: 49, pop: 967000, alert: "green" },
  { id: "lower_juba", name: "Lower Juba", cholera: 187, measles: 112, malaria: 243, awd: 154, pop: 530000, alert: "red" },
  { id: "middle_juba", name: "Middle Juba", cholera: 134, measles: 89, malaria: 198, awd: 112, pop: 361000, alert: "yellow" },
  { id: "gedo", name: "Gedo", cholera: 112, measles: 98, malaria: 167, awd: 98, pop: 530000, alert: "yellow" },
  { id: "awdal", name: "Awdal", cholera: 38, measles: 45, malaria: 54, awd: 34, pop: 709000, alert: "green" },
];

const WEEKLY = [
  { week: "W1 Jan", Cholera: 89, Measles: 45, Malaria: 67, AWD: 112 },
  { week: "W2 Jan", Cholera: 102, Measles: 52, Malaria: 71, AWD: 98 },
  { week: "W3 Jan", Cholera: 134, Measles: 61, Malaria: 83, AWD: 134 },
  { week: "W4 Jan", Cholera: 156, Measles: 78, Malaria: 76, AWD: 145 },
  { week: "W1 Feb", Cholera: 178, Measles: 89, Malaria: 91, AWD: 167 },
  { week: "W2 Feb", Cholera: 201, Measles: 112, Malaria: 87, AWD: 189 },
  { week: "W3 Feb", Cholera: 187, Measles: 134, Malaria: 94, AWD: 178 },
  { week: "W4 Feb", Cholera: 212, Measles: 156, Malaria: 102, AWD: 198 },
  { week: "W1 Mar", Cholera: 234, Measles: 143, Malaria: 98, AWD: 212 },
  { week: "W2 Mar", Cholera: 267, Measles: 167, Malaria: 112, AWD: 234 },
  { week: "W3 Mar", Cholera: 289, Measles: 189, Malaria: 108, AWD: 245 },
  { week: "W4 Mar", Cholera: 312, Measles: 201, Malaria: 121, AWD: 267 },
];

const VACCINATION = [
  { region: "Banadir", coverage: 78, target: 95 },
  { region: "Bay", coverage: 54, target: 95 },
  { region: "Lower Shabelle", coverage: 61, target: 95 },
  { region: "Hiraan", coverage: 67, target: 95 },
  { region: "Galgaduud", coverage: 72, target: 95 },
  { region: "Bari", coverage: 84, target: 95 },
  { region: "Woqooyi", coverage: 81, target: 95 },
  { region: "Lower Juba", coverage: 48, target: 95 },
];

const ALERTS = [
  { id: 1, level: "red", region: "Banadir", disease: "Cholera", cases: 412, date: "2025-03-28", msg: "Outbreak threshold exceeded — immediate response required" },
  { id: 2, level: "red", region: "Bay", disease: "Measles", cases: 211, date: "2025-03-27", msg: "Measles cluster detected — vaccination campaign needed" },
  { id: 3, level: "red", region: "Lower Juba", disease: "Malaria", cases: 243, date: "2025-03-26", msg: "High malaria transmission — IRS deployment recommended" },
  { id: 4, level: "yellow", region: "Lower Shabelle", disease: "AWD", cases: 198, date: "2025-03-25", msg: "Rising AWD trend — WASH intervention advised" },
  { id: 5, level: "yellow", region: "Hiraan", disease: "Malaria", cases: 198, date: "2025-03-24", msg: "Malaria cases increasing — enhanced surveillance needed" },
];

const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
const alertColor = (l) => ({ red: "#ef4444", yellow: "#f59e0b", green: "#10b981" }[l]);
const alertBg = (l) => ({ red: "#2d0a0a", yellow: "#2d1f0a", green: "#0a2d1a" }[l]);

const StatCard = ({ label, value, sub, color, trend }) => (
  <div style={{ background: "#0d1b2e", border: `1px solid #1a2d45`, borderTop: `3px solid ${color}`, borderRadius: 10, padding: "18px 20px", flex: 1, minWidth: 130 }}>
    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, fontWeight: 600, color: "#4a6280", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#4a6280", marginTop: 3 }}>{sub}</div>}
    {trend && <div style={{ fontSize: 11, color: trend > 0 ? "#ef4444" : "#10b981", marginTop: 4, fontWeight: 600 }}>{trend > 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last week</div>}
  </div>
);

const SectionHead = ({ children, sub }) => (
  <div style={{ marginBottom: 16 }}>
    <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f0f6ff", textTransform: "uppercase", letterSpacing: "0.1em" }}>{children}</h2>
    {sub && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4a6280" }}>{sub}</p>}
  </div>
);

const Panel = ({ children, style = {} }) => (
  <div style={{ background: "#0d1b2e", border: `1px solid #1a2d45`, borderRadius: 10, padding: 20, ...style }}>{children}</div>
);

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0a1628", border: `1px solid #1a2d45`, borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f6ff", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>{p.name}: <b>{p.value}</b></div>)}
    </div>
  );
};

const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{ padding: "7px 18px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, borderRadius: 6, background: active ? "#0ea5e9" : "transparent", color: active ? "#fff" : "#4a6280" }}>
    {children}
  </button>
);

const SomaliaMap = ({ regions, selectedDisease }) => {
  const [hovered, setHovered] = useState(null);
  const getVal = (r) => r[selectedDisease.toLowerCase()] || 0;
  const maxVal = Math.max(...regions.map(getVal));
  const getColor = (r) => {
    const v = getVal(r) / maxVal;
    if (v > 0.7) return "#ef4444";
    if (v > 0.4) return "#f59e0b";
    if (v > 0.2) return "#1d7a5f";
    return "#0d3d2e";
  };
  const layout = [
    ["woqooyi", 30, 10, 80, 40, "Woqooyi"],
    ["awdal", 10, 10, 18, 40, "Awdal"],
    ["togdheer", 115, 10, 55, 50, "Togdheer"],
    ["sanaag", 175, 5, 80, 45, "Sanaag"],
    ["bari", 260, 5, 65, 55, "Bari"],
    ["sool", 170, 55, 85, 45, "Sool"],
    ["nugaal", 260, 65, 65, 45, "Nugaal"],
    ["mudug", 165, 105, 90, 55, "Mudug"],
    ["galgaduud", 160, 165, 95, 50, "Galgaduud"],
    ["hiraan", 120, 165, 38, 70, "Hiraan"],
    ["middle_shabelle", 120, 105, 38, 58, "Mid Shabelle"],
    ["bay", 55, 175, 62, 60, "Bay"],
    ["bakool", 20, 175, 32, 60, "Bakool"],
    ["banadir", 120, 240, 38, 35, "Banadir"],
    ["lower_shabelle", 80, 225, 38, 55, "Lr Shabelle"],
    ["middle_juba", 55, 240, 23, 55, "Mid Juba"],
    ["gedo", 15, 240, 38, 55, "Gedo"],
    ["lower_juba", 30, 300, 65, 50, "Lr Juba"],
  ];
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 340 365" style={{ width: "100%", maxHeight: 340 }}>
        {layout.map(([id, x, y, w, h, label]) => {
          const region = regions.find(r => r.id === id);
          if (!region) return null;
          const val = getVal(region);
          const isHov = hovered === id;
          return (
            <g key={id} onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <rect x={x} y={y} width={w} height={h} rx={3} fill={getColor(region)} stroke={isHov ? "#f0f6ff" : "#1a2d45"} strokeWidth={isHov ? 2 : 0.5} opacity={isHov ? 1 : 0.85} />
              <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fontSize={w > 45 ? 7 : 6} fill="#f0f6ff" fontWeight="600">{label}</text>
              <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle" fontSize={8} fill="#f0f6ff" fontWeight="800">{val}</text>
            </g>
          );
        })}
      </svg>
      {hovered && (() => {
        const r = regions.find(x => x.id === hovered);
        if (!r) return null;
        return (
          <div style={{ position: "absolute", top: 8, right: 8, background: "#0a1628", border: `1px solid #1a2d45`, borderRadius: 8, padding: "10px 14px", fontSize: 12, minWidth: 150 }}>
            <div style={{ fontWeight: 700, color: "#f0f6ff", marginBottom: 6 }}>{r.name}</div>
            <div style={{ color: "#0ea5e9" }}>Cholera: {r.cholera}</div>
            <div style={{ color: "#f59e0b" }}>Measles: {r.measles}</div>
            <div style={{ color: "#10b981" }}>Malaria: {r.malaria}</div>
            <div style={{ color: "#8b5cf6" }}>AWD: {r.awd}</div>
            <div style={{ color: alertColor(r.alert), marginTop: 6, fontWeight: 700, textTransform: "uppercase", fontSize: 10 }}>● {r.alert} alert</div>
          </div>
        );
      })()}
      <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "center" }}>
        {[["High", "#ef4444"], ["Medium", "#f59e0b"], ["Low", "#1d7a5f"], ["Minimal", "#0d3d2e"]].map(([l, c]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#4a6280" }}>
            <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />{l}
          </div>
        ))}
      </div>
    </div>
  );
};

const exportExcel = (regions) => {
  const header = ["Region", "Cholera", "Measles", "Malaria", "AWD", "Total", "Alert"];
  const rows = regions.map(r => [r.name, r.cholera, r.measles, r.malaria, r.awd, r.cholera + r.measles + r.malaria + r.awd, r.alert.toUpperCase()]);
  const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "somalia_surveillance_data.csv";
  a.click();
};

const exportPDF = () => window.print();

export default function SomaliaSurveillance() {
  const [tab, setTab] = useState("overview");
  const [diseaseFilter, setDiseaseFilter] = useState("All");
  const [alertFilter, setAlertFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [mapDisease, setMapDisease] = useState("Cholera");

  const totalCholera = REGIONS.reduce((s, r) => s + r.cholera, 0);
  const totalMeasles = REGIONS.reduce((s, r) => s + r.measles, 0);
  const totalMalaria = REGIONS.reduce((s, r) => s + r.malaria, 0);
  const totalAWD = REGIONS.reduce((s, r) => s + r.awd, 0);
  const totalCases = totalCholera + totalMeasles + totalMalaria + totalAWD;
  const redAlerts = REGIONS.filter(r => r.alert === "red").length;

  const filteredRegions = useMemo(() => REGIONS.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchAlert = alertFilter === "All" || r.alert === alertFilter.toLowerCase();
    return matchSearch && matchAlert;
  }), [search, alertFilter]);

  const filteredAlerts = useMemo(() => ALERTS.filter(a => {
    const matchDisease = diseaseFilter === "All" || a.disease === diseaseFilter;
    const matchAlert = alertFilter === "All" || a.level === alertFilter.toLowerCase();
    return matchDisease && matchAlert;
  }), [diseaseFilter, alertFilter]);

  const pieData = [
    { name: "Cholera", value: totalCholera, color: "#0ea5e9" },
    { name: "Measles", value: totalMeasles, color: "#f59e0b" },
    { name: "Malaria", value: totalMalaria, color: "#10b981" },
    { name: "AWD", value: totalAWD, color: "#8b5cf6" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#060d1a", minHeight: "100vh", color: "#c8dff2" }}>
      <div style={{ background: "#0d1b2e", borderBottom: `1px solid #1a2d45`, padding: "16px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              <span style={{ fontSize: 10, color: "#10b981", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Live Surveillance · Somalia · 2025</span>
            </div>
            <h1 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: "#f0f6ff" }}>Somalia Public Health Surveillance</h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#4a6280" }}>18 regions · 4 diseases · Real-time monitoring dashboard</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => exportExcel(REGIONS)} style={{ background: "#0d2d1a", border: `1px solid #10b981`, color: "#10b981", padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>⬇ Export CSV</button>
            <button onClick={exportPDF} style={{ background: "#0d1f2d", border: `1px solid #0ea5e9`, color: "#0ea5e9", padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🖨 Print Report</button>
          </div>
        </div>
      </div>

      {redAlerts > 0 && (
        <div style={{ background: "#2d0a0a", borderBottom: `1px solid #ef4444`, padding: "8px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: 12, color: "#ef4444", fontWeight: 700 }}>
            🔴 {redAlerts} ACTIVE OUTBREAK ALERTS — Immediate public health response required
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <StatCard label="Total Cases" value={fmt(totalCases)} sub="All diseases · All regions" color="#0ea5e9" trend={12} />
          <StatCard label="Cholera" value={fmt(totalCholera)} sub="18 regions" color="#0ea5e9" trend={18} />
          <StatCard label="Measles" value={fmt(totalMeasles)} sub="Vaccination gap" color="#f59e0b" trend={24} />
          <StatCard label="Malaria" value={fmt(totalMalaria)} sub="Peak season" color="#10b981" trend={8} />
          <StatCard label="AWD" value={fmt(totalAWD)} sub="WASH-related" color="#8b5cf6" trend={15} />
          <StatCard label="Red Alerts" value={redAlerts} sub="Active outbreaks" color="#ef4444" />
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid #1a2d45`, paddingBottom: 12 }}>
          {["overview", "trends", "map", "alerts", "vaccination", "data"].map(t => (
            <TabBtn key={t} active={tab === t} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</TabBtn>
          ))}
        </div>

        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
            <Panel>
              <SectionHead sub="Weekly reported cases — Jan to Mar 2025">Disease Trends (12 Weeks)</SectionHead>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={WEEKLY}>
                  <defs>
                    {Object.entries(DISEASE_COLORS).map(([d, c]) => (
                      <linearGradient key={d} id={`g${d}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={c} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4a6280" }} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: "#4a6280" }} />
                  <Tooltip content={<Tip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {Object.entries(DISEASE_COLORS).map(([d, c]) => (
                    <Area key={d} type="monotone" dataKey={d} stroke={c} fill={`url(#g${d})`} strokeWidth={2} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </Panel>
            <Panel>
              <SectionHead sub="Case distribution by disease">Disease Burden</SectionHead>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" nameKey="name" label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => v} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 12 }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid #1a2d45` }}>
                    <span style={{ fontSize: 12, color: d.color, fontWeight: 600 }}>{d.name}</span>
                    <span style={{ fontSize: 12, color: "#f0f6ff", fontWeight: 700 }}>{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel style={{ gridColumn: "1 / -1" }}>
              <SectionHead sub="Active outbreak alerts requiring immediate response">Active Alerts</SectionHead>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {ALERTS.slice(0, 3).map(a => (
                  <div key={a.id} style={{ background: alertBg(a.level), border: `1px solid ${alertColor(a.level)}`, borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: alertColor(a.level), textTransform: "uppercase" }}>● {a.level} · {a.disease}</span>
                      <span style={{ fontSize: 10, color: "#4a6280" }}>{a.date}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f6ff" }}>{a.region}</div>
                    <div style={{ fontSize: 11, color: "#4a6280", marginTop: 4 }}>{a.msg}</div>
                    <div style={{ fontSize: 12, color: alertColor(a.level), fontWeight: 700, marginTop: 6 }}>{a.cases} cases</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {tab === "trends" && (
          <div style={{ display: "grid", gap: 16 }}>
            <Panel>
              <SectionHead sub="Weekly case counts — all diseases">12-Week Epidemic Curve</SectionHead>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={WEEKLY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4a6280" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#4a6280" }} />
                  <Tooltip content={<Tip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {Object.entries(DISEASE_COLORS).map(([d, c]) => (
                    <Line key={d} type="monotone" dataKey={d} stroke={c} strokeWidth={2.5} dot={{ r: 3, fill: c }} activeDot={{ r: 5 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Panel>
            <Panel>
              <SectionHead sub="Cases per region — all diseases stacked">Regional Case Load</SectionHead>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={REGIONS.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#4a6280" }} angle={-25} textAnchor="end" height={55} />
                  <YAxis tick={{ fontSize: 10, fill: "#4a6280" }} />
                  <Tooltip content={<Tip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="cholera" name="Cholera" stackId="a" fill="#0ea5e9" />
                  <Bar dataKey="measles" name="Measles" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="malaria" name="Malaria" stackId="a" fill="#10b981" />
                  <Bar dataKey="awd" name="AWD" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        )}

        {tab === "map" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <SectionHead>Somalia Disease Map</SectionHead>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Cholera", "Measles", "Malaria", "AWD"].map(d => (
                    <button key={d} onClick={() => setMapDisease(d)} style={{ padding: "4px 10px", border: `1px solid ${mapDisease === d ? DISEASE_COLORS[d] : "#1a2d45"}`, background: mapDisease === d ? `${DISEASE_COLORS[d]}22` : "transparent", color: mapDisease === d ? DISEASE_COLORS[d] : "#4a6280", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{d}</button>
                  ))}
                </div>
              </div>
              <SomaliaMap regions={REGIONS} selectedDisease={mapDisease} />
            </Panel>
            <Panel>
              <SectionHead sub={`Top regions by ${mapDisease} cases`}>Regional Ranking</SectionHead>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...REGIONS].sort((a, b) => b[mapDisease.toLowerCase()] - a[mapDisease.toLowerCase()]).slice(0, 10).map((r, i) => {
                  const val = r[mapDisease.toLowerCase()];
                  const pct = (val / Math.max(...REGIONS.map(x => x[mapDisease.toLowerCase()]))) * 100;
                  return (
                    <div key={r.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: "#c8dff2" }}>{i + 1}. {r.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: DISEASE_COLORS[mapDisease] }}>{val}</span>
                      </div>
                      <div style={{ background: "#1a2d45", borderRadius: 3, height: 4 }}>
                        <div style={{ width: `${pct}%`, background: DISEASE_COLORS[mapDisease], borderRadius: 3, height: "100%" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        )}

        {tab === "alerts" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["All", "Cholera", "Measles", "Malaria", "AWD"].map(d => (
                <button key={d} onClick={() => setDiseaseFilter(d)} style={{ padding: "6px 14px", border: `1px solid ${diseaseFilter === d ? "#0ea5e9" : "#1a2d45"}`, background: diseaseFilter === d ? "#0ea5e922" : "transparent", color: diseaseFilter === d ? "#0ea5e9" : "#4a6280", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{d}</button>
              ))}
            </div>
            {filteredAlerts.map(a => (
              <div key={a.id} style={{ background: alertBg(a.level), border: `1px solid ${alertColor(a.level)}`, borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ background: alertColor(a.level), color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" }}>{a.level}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f6ff" }}>{a.region}</span>
                    <span style={{ fontSize: 12, color: DISEASE_COLORS[a.disease] }}>· {a.disease}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#c8dff2" }}>{a.msg}</div>
                  <div style={{ fontSize: 11, color: "#4a6280", marginTop: 6 }}>Reported: {a.date}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 80 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: alertColor(a.level) }}>{a.cases}</div>
                  <div style={{ fontSize: 10, color: "#4a6280", textTransform: "uppercase" }}>cases</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "vaccination" && (
          <div style={{ display: "grid", gap: 16 }}>
            <Panel>
              <SectionHead sub="Measles vaccination coverage vs 95% WHO target">EPI Coverage by Region</SectionHead>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={VACCINATION} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: "#4a6280" }} />
                  <YAxis type="category" dataKey="region" width={120} tick={{ fontSize: 12, fill: "#4a6280" }} />
                  <Tooltip content={<Tip />} formatter={v => `${v}%`} />
                  <Bar dataKey="coverage" name="Coverage" radius={[0, 4, 4, 0]}>
                    {VACCINATION.map((e, i) => <Cell key={i} fill={e.coverage >= 80 ? "#10b981" : e.coverage >= 60 ? "#f59e0b" : "#ef4444"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              <StatCard label="Below Target" value={VACCINATION.filter(v => v.coverage < 95).length} color="#ef4444" />
              <StatCard label="Avg Coverage" value={`${Math.round(VACCINATION.reduce((s, v) => s + v.coverage, 0) / VACCINATION.length)}%`} color="#f59e0b" />
              <StatCard label="On Track" value={VACCINATION.filter(v => v.coverage >= 80).length} color="#10b981" />
              <StatCard label="Critical Gap" value={VACCINATION.filter(v => v.coverage < 60).length} color="#ef4444" />
            </div>
          </div>
        )}

        {tab === "data" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search region..." style={{ background: "#0d1b2e", border: `1px solid #1a2d45`, color: "#f0f6ff", padding: "8px 14px", borderRadius: 6, fontSize: 13, outline: "none", minWidth: 220 }} />
              {["All", "Red", "Yellow", "Green"].map(l => (
                <button key={l} onClick={() => setAlertFilter(l)} style={{ padding: "7px 14px", border: `1px solid ${alertFilter === l ? "#0ea5e9" : "#1a2d45"}`, background: alertFilter === l ? "#0ea5e922" : "transparent", color: alertFilter === l ? "#0ea5e9" : "#4a6280", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{l}</button>
              ))}
              <button onClick={() => exportExcel(filteredRegions)} style={{ marginLeft: "auto", background: "#0d2d1a", border: `1px solid #10b981`, color: "#10b981", padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>⬇ Export CSV</button>
            </div>
            <Panel style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0a1628" }}>
                    {["Region", "Cholera", "Measles", "Malaria", "AWD", "Total", "Alert"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: h === "Region" ? "left" : "center", fontSize: 11, fontWeight: 700, color: "#4a6280", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid #1a2d45` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRegions.map((r, i) => {
                    const total = r.cholera + r.measles + r.malaria + r.awd;
                    return (
                      <tr key={r.id} style={{ background: i % 2 === 0 ? "transparent" : "#0a1220" }}>
                        <td style={{ padding: "11px 16px", fontSize: 13, color: "#f0f6ff", fontWeight: 600 }}>{r.name}</td>
                        {[r.cholera, r.measles, r.malaria, r.awd].map((v, j) => (
                          <td key={j} style={{ padding: "11px 16px", textAlign: "center", fontSize: 13, color: "#c8dff2" }}>{v}</td>
                        ))}
                        <td style={{ padding: "11px 16px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#f0f6ff" }}>{total}</td>
                        <td style={{ padding: "11px 16px", textAlign: "center" }}>
                          <span style={{ background: alertBg(r.alert), color: alertColor(r.alert), border: `1px solid ${alertColor(r.alert)}`, padding: "2px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{r.alert}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#0a1628", borderTop: `1px solid #1a2d45` }}>
                    <td style={{ padding: "11px 16px", fontSize: 12, fontWeight: 700, color: "#4a6280" }}>TOTAL ({filteredRegions.length} regions)</td>
                    {["cholera", "measles", "malaria", "awd"].map(d => (
                      <td key={d} style={{ padding: "11px 16px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#0ea5e9" }}>{filteredRegions.reduce((s, r) => s + r[d], 0)}</td>
                    ))}
                    <td style={{ padding: "11px 16px", textAlign: "center", fontSize: 13, fontWeight: 800, color: "#f0f6ff" }}>{filteredRegions.reduce((s, r) => s + r.cholera + r.measles + r.malaria + r.awd, 0)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </Panel>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 32, padding: "14px 0", borderTop: `1px solid #1a2d45` }}>
          <p style={{ fontSize: 11, color: "#4a6280", margin: 0 }}>
            Somalia Public Health Surveillance Dashboard · Built by Ikraam Hassan Abdullahi · MSc Epidemiology · Amoud University · 2025
            <br />Sample data for portfolio demonstration — based on WHO/UNICEF Somalia health parameters
          </p>
        </div>
      </div>
    </div>
  );
}
