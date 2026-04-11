import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

const supabase = createClient(
  'https://texozlmjxltvfdznuanm.supabase.co',
  'sb_publishable_zcdJwPRmR2e0_tPXZ35Mtg_3xhwUk6c'
)

const CATEGORIES = ['SC', 'ST', 'OBC', 'General']
const PURPOSES = ['Exam', 'Regular', 'Scholarship']
const BANKS = ['Self', 'Online', 'Mehsana', 'Fino']
const SCHOL_STATUSES = ['Edit','View','Final Submit','Submit (Return)','RBP','Office Level','Approved','Rejected']
const PAY_BANKS = ['Self/Online','Mehsana','Fino','Gyan Education Current']
const PAY_PERCENT = ['40%','60%']

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F7F8FA; color: #18181B; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* LOGIN */
  .login-page { min-height: 100vh; background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #0F172A 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .login-box { background: #fff; border-radius: 16px; padding: 40px; width: 400px; max-width: 100%; box-shadow: 0 25px 60px rgba(0,0,0,0.3); }
  .login-logo { text-align: center; margin-bottom: 28px; }
  .login-logo-icon { width: 64px; height: 64px; background: linear-gradient(135deg,#3B82F6,#1D4ED8); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 12px; }
  .login-logo h1 { font-size: 22px; font-weight: 700; color: #0F172A; }
  .login-logo p { font-size: 13px; color: #94A3B8; margin-top: 4px; }
  .login-form { display: flex; flex-direction: column; gap: 16px; }
  .login-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; display: block; }
  .login-input { width: 100%; padding: 11px 14px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 14px; font-family: 'DM Sans',sans-serif; outline: none; transition: all 0.15s; color: #18181B; }
  .login-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .login-btn { width: 100%; padding: 12px; background: linear-gradient(135deg,#2563EB,#1D4ED8); color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; font-family: 'DM Sans',sans-serif; cursor: pointer; transition: all 0.15s; margin-top: 4px; }
  .login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(37,99,235,0.4); }
  .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  .login-error { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; text-align: center; }
  .login-footer { text-align: center; margin-top: 20px; font-size: 12px; color: #94A3B8; }

  /* SIDEBAR */
  .sidebar { width: 230px; background: #0F172A; display: flex; flex-direction: column; flex-shrink: 0; }
  .sidebar-logo { padding: 22px 18px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
  .sidebar-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg,#3B82F6,#1D4ED8); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .sidebar-logo h1 { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.2px; }
  .sidebar-logo p { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 1px; }
  .nav-group-label { padding: 16px 18px 6px; font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1.2px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; margin: 1px 8px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); transition: all 0.15s; user-select: none; }
  .nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
  .nav-item.active { background: rgba(59,130,246,0.2); color: #60A5FA; }
  .nav-item .nav-icon { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; background: rgba(255,255,255,0.05); flex-shrink: 0; }
  .nav-item.active .nav-icon { background: rgba(59,130,246,0.25); }
  .nav-badge { background: #EF4444; color: #fff; font-size: 10px; padding: 2px 7px; border-radius: 20px; margin-left: auto; font-weight: 700; }
  .sidebar-footer { margin-top: auto; padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
  .user-info { display: flex; align-items: center; gap: 10px; }
  .user-avatar { width: 32px; height: 32px; background: linear-gradient(135deg,#3B82F6,#7C3AED); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .user-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); flex: 1; }
  .logout-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3); font-size: 16px; padding: 4px; transition: all 0.15s; }
  .logout-btn:hover { color: #EF4444; }

  /* MAIN */
  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .topbar { background: #fff; border-bottom: 1px solid #E4E7EC; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 58px; flex-shrink: 0; position: sticky; top: 0; z-index: 10; }
  .topbar-left h2 { font-size: 16px; font-weight: 700; color: #0F172A; }
  .topbar-left p { font-size: 12px; color: #94A3B8; margin-top: 1px; }
  .topbar-right { display: flex; gap: 8px; align-items: center; }
  .content { padding: 22px 24px; flex: 1; }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 0 16px; height: 36px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; transition: all 0.15s; white-space: nowrap; }
  .btn-primary { background: #2563EB; color: #fff; }
  .btn-primary:hover { background: #1D4ED8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.35); }
  .btn-green { background: #059669; color: #fff; }
  .btn-green:hover { background: #047857; }
  .btn-light { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
  .btn-light:hover { background: #E2E8F0; }
  .btn-blue-soft { background: #EFF6FF; color: #2563EB; }
  .btn-blue-soft:hover { background: #DBEAFE; }
  .btn-red-soft { background: #FEF2F2; color: #DC2626; }
  .btn-red-soft:hover { background: #FEE2E2; }
  .btn-emerald-soft { background: #ECFDF5; color: #059669; }
  .btn-emerald-soft:hover { background: #D1FAE5; }
  .btn-sm { height: 30px; padding: 0 12px; font-size: 12px; border-radius: 6px; }

  /* SEARCH */
  .search-wrap { position: relative; }
  .search-wrap input { padding: 0 12px 0 34px; height: 36px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 13px; width: 230px; outline: none; font-family: 'DM Sans', sans-serif; color: #18181B; background: #F8FAFC; transition: all 0.15s; }
  .search-wrap input:focus { border-color: #3B82F6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94A3B8; font-size: 14px; pointer-events: none; }

  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
  .stat-card { background: #fff; border-radius: 12px; padding: 16px 18px; border: 1px solid #E4E7EC; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 12px 12px 0 0; }
  .stat-card.blue::before { background: linear-gradient(90deg,#3B82F6,#2563EB); }
  .stat-card.purple::before { background: linear-gradient(90deg,#8B5CF6,#7C3AED); }
  .stat-card.green::before { background: linear-gradient(90deg,#10B981,#059669); }
  .stat-card.red::before { background: linear-gradient(90deg,#F87171,#EF4444); }
  .stat-card .s-label { font-size: 11px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }
  .stat-card .s-value { font-size: 30px; font-weight: 700; color: #0F172A; line-height: 1; }
  .stat-card .s-sub { font-size: 11px; color: #CBD5E1; margin-top: 4px; }
  .stat-card .s-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 28px; opacity: 0.12; }

  /* TABLE CARD */
  .table-card { background: #fff; border-radius: 12px; border: 1px solid #E4E7EC; overflow: hidden; margin-bottom: 20px; }
  .table-card-header { padding: 14px 18px; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .table-card-header h3 { font-size: 14px; font-weight: 700; color: #0F172A; }
  .table-card-header p { font-size: 12px; color: #94A3B8; margin-top: 2px; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead tr { background: #F8FAFC; }
  th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #F1F5F9; white-space: nowrap; }
  td { padding: 11px 14px; border-bottom: 1px solid #F8FAFC; color: #374151; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: #FAFBFF; }
  .td-name { font-weight: 600; color: #0F172A; }
  .td-muted { color: #94A3B8; font-size: 12px; }
  .td-mono { font-family: 'DM Mono', monospace; font-size: 12px; }
  .empty-row td { padding: 40px 20px; text-align: center; color: #CBD5E1; }
  .empty-row .empty-icon { font-size: 32px; display: block; margin-bottom: 8px; }
  .empty-row .empty-text { font-size: 13px; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .badge-pending { background: #FEF9C3; color: #854D0E; }
  .badge-completed { background: #DCFCE7; color: #166534; }
  .badge-approved { background: #DBEAFE; color: #1E40AF; }
  .badge-rejected { background: #FEE2E2; color: #991B1B; }
  .badge-edit { background: #EDE9FE; color: #5B21B6; }
  .badge-rbp { background: #F3E8FF; color: #6B21A8; }
  .badge-final { background: #DCFCE7; color: #166534; }
  .badge-return { background: #FEF9C3; color: #854D0E; }
  .badge-office { background: #E0F2FE; color: #0369A1; }
  .badge-view { background: #F1F5F9; color: #475569; }
  .badge-yes { background: #DCFCE7; color: #166534; }
  .badge-no { background: #FEE2E2; color: #991B1B; }
  .badge-admission { background: #EFF6FF; color: #1D4ED8; }
  .badge-scholarship { background: #F5F3FF; color: #6D28D9; }
  .badge-payment { background: #F0FDF4; color: #15803D; }
  .today-tag { background: #FEF2F2; color: #EF4444; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 6px; margin-left: 5px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* WA BUTTON */
  .wa-btn { display: inline-flex; align-items: center; gap: 3px; background: #22C55E; color: #fff; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-decoration: none; margin-left: 5px; transition: all 0.15s; }
  .wa-btn:hover { background: #16A34A; }

  /* MODAL */
  .overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); backdrop-filter: blur(2px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: #fff; border-radius: 14px; width: 740px; max-width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-header { padding: 18px 22px; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; border-radius: 14px 14px 0 0; }
  .modal-header h3 { font-size: 16px; font-weight: 700; color: #0F172A; }
  .modal-close { width: 30px; height: 30px; border-radius: 7px; background: #F1F5F9; border: none; cursor: pointer; font-size: 16px; color: #64748B; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .modal-close:hover { background: #E2E8F0; }
  .modal-body { padding: 22px; }
  .modal-footer { padding: 16px 22px; border-top: 1px solid #F1F5F9; display: flex; justify-content: flex-end; gap: 8px; background: #FAFBFF; border-radius: 0 0 14px 14px; }
  .student-info-bar { background: linear-gradient(135deg,#EFF6FF,#F0F9FF); border: 1px solid #BFDBFE; border-radius: 10px; padding: 12px 16px; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
  .student-info-bar .avatar { width: 38px; height: 38px; background: linear-gradient(135deg,#3B82F6,#1D4ED8); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .student-info-bar .info h4 { font-size: 14px; font-weight: 700; color: #1E40AF; }
  .student-info-bar .info p { font-size: 12px; color: #3B82F6; }

  /* FORM */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-section { grid-column: 1/-1; font-size: 11px; font-weight: 700; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 8px; border-bottom: 1px solid #EFF6FF; margin-top: 4px; }
  label { font-size: 12px; font-weight: 600; color: #374151; }
  input[type=text], input[type=email], input[type=number], input[type=date], input[type=password], select, textarea {
    padding: 9px 12px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 13px;
    color: #18181B; font-family: 'DM Sans', sans-serif; outline: none; background: #fff;
    transition: all 0.15s; width: 100%;
  }
  input:focus, select:focus, textarea:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  textarea { resize: vertical; min-height: 75px; }
  select { cursor: pointer; }

  /* DASHBOARD */
  .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .flow-card { background: linear-gradient(135deg,#1E3A8A,#2563EB); border-radius: 12px; padding: 16px 18px; margin-bottom: 20px; color: #fff; }
  .flow-card h4 { font-size: 12px; font-weight: 600; opacity: 0.7; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  .flow-steps { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .flow-step { background: rgba(255,255,255,0.15); padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .flow-arrow { opacity: 0.5; font-size: 14px; }
  .pass-cell { display: flex; align-items: center; gap: 5px; }
  .pass-toggle { background: none; border: none; cursor: pointer; color: #94A3B8; padding: 2px; font-size: 13px; }
  .actions { display: flex; gap: 5px; align-items: center; }
  .row-today { background: #FFFBEB !important; }
`

function StatusBadge({ status }) {
  const map = {
    'Pending':'badge-pending','Completed':'badge-completed','Approved':'badge-approved',
    'Rejected':'badge-rejected','Edit':'badge-edit','RBP':'badge-rbp',
    'Final Submit':'badge-final','Submit (Return)':'badge-return',
    'Office Level':'badge-office','View':'badge-view','Yes':'badge-yes','No':'badge-no'
  }
  return <span className={`badge ${map[status]||'badge-view'}`}>{status}</span>
}

function SourceBadge({ source }) {
  const map = { 'Admission':'badge-admission','Scholarship':'badge-scholarship','Payment':'badge-payment' }
  return <span className={`badge ${map[source]||'badge-view'}`}>{source}</span>
}

function WaBtn({ number }) {
  if (!number) return null
  return <a className="wa-btn" href={`https://wa.me/91${number}`} target="_blank" rel="noreferrer">WA</a>
}

function Avatar({ name }) {
  const initials = (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#3B82F6,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>{initials}</div>
}

function exportExcel(data, name) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, name)
  XLSX.writeFile(wb, `${name}_${new Date().toLocaleDateString('en-IN')}.xlsx`)
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!username || !password) { setError('Please enter username and password'); return }
    setLoading(true); setError('')
    const { data } = await supabase.from('users').select('*').eq('username', username).eq('password', password).single()
    if (data) {
      localStorage.setItem('crm_user', JSON.stringify(data))
      onLogin(data)
    } else {
      setError('Invalid username or password')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">
            <div className="login-logo-icon">🎓</div>
            <h1>Gyan Education CRM</h1>
            <p>Sign in to access your dashboard</p>
          </div>
          <div className="login-form">
            {error && <div className="login-error">⚠️ {error}</div>}
            <div>
              <label className="login-label">Username</label>
              <input className="login-input" type="text" placeholder="Enter username" value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
            </div>
            <div>
              <label className="login-label">Password</label>
              <input className="login-input" type="password" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
            </div>
            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </div>
          <div className="login-footer">Gyan Education · Internal Team Only</div>
        </div>
      </div>
    </>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')
  const [inquiries, setInquiries] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [payments, setPayments] = useState([])
  const [followups, setFollowups] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({})
  const [showPass, setShowPass] = useState({})
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const saved = localStorage.getItem('crm_user')
    if (saved) setUser(JSON.parse(saved))
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [i, s, p, f] = await Promise.all([
      supabase.from('inquiries').select('*').order('created_at',{ascending:false}),
      supabase.from('scholarships').select('*').order('created_at',{ascending:false}),
      supabase.from('payments').select('*').order('created_at',{ascending:false}),
      supabase.from('followups').select('*').order('created_at',{ascending:false}),
    ])
    if (i.data) setInquiries(i.data)
    if (s.data) setScholarships(s.data)
    if (p.data) setPayments(p.data)
    if (f.data) setFollowups(f.data)
    setLoading(false)
  }

  function handleLogout() {
    localStorage.removeItem('crm_user')
    setUser(null)
  }

  if (!user) return <LoginPage onLogin={setUser} />

  function openModal(type, data={}) { setForm(data); setModal(type) }
  function closeModal() { setModal(null); setForm({}) }
  const fv = f => form[f] || ''
  const sf = (f,v) => setForm(prev=>({...prev,[f]:v}))

  async function saveInquiry() {
    setSaving(true)
    const data = {
      student_name:fv('student_name'), contact_number:fv('contact_number'),
      email:fv('email'), last_qualification:fv('last_qualification'),
      university_name:fv('university_name'), course_name:fv('course_name'),
      category:fv('category'), parent_contact:fv('parent_contact'),
      agent_name:fv('agent_name'), purpose:fv('purpose'),
      remarks:fv('remarks'), bank_account:fv('bank_account'),
      status:fv('status')||'Pending'
    }
    if (!data.student_name) { alert('Student name is required'); setSaving(false); return }
    if (form.id) {
      await supabase.from('inquiries').update(data).eq('id',form.id)
      if (data.status==='Completed') {
        const exists = scholarships.find(s=>s.inquiry_id===form.id)
        if (!exists) await supabase.from('scholarships').insert({ inquiry_id:form.id, student_name:data.student_name, contact_number:data.contact_number, university_name:data.university_name, course_name:data.course_name })
      }
      if (data.remarks) {
        const exists = followups.find(f=>f.inquiry_id===form.id&&f.remark===data.remarks)
        if (!exists) await supabase.from('followups').insert({ inquiry_id:form.id, student_name:data.student_name, contact_number:data.contact_number, remark:data.remarks, source:'Admission', status:'Pending' })
      }
    } else {
      const {data:ins} = await supabase.from('inquiries').insert(data).select().single()
      if (ins) {
        if (data.remarks) await supabase.from('followups').insert({ inquiry_id:ins.id, student_name:data.student_name, contact_number:data.contact_number, remark:data.remarks, source:'Admission', status:'Pending' })
        if (data.status==='Completed') await supabase.from('scholarships').insert({ inquiry_id:ins.id, student_name:data.student_name, contact_number:data.contact_number, university_name:data.university_name, course_name:data.course_name })
      }
    }
    setSaving(false); closeModal(); loadAll()
  }

  async function saveScholarship() {
    setSaving(true)
    const data = { user_id:fv('user_id'), password:fv('password'), status:fv('status')||'Edit', followup_date:fv('followup_date')||null, remarks:fv('remarks') }
    await supabase.from('scholarships').update(data).eq('id',form.id)
    if (data.followup_date||data.remarks) {
      const exists = followups.find(f=>f.inquiry_id===form.inquiry_id&&f.source==='Scholarship'&&f.remark===data.remarks)
      if (!exists) await supabase.from('followups').insert({ inquiry_id:form.inquiry_id, student_name:form.student_name, contact_number:form.contact_number, remark:data.remarks, followup_date:data.followup_date, source:'Scholarship', status:data.status })
    }
    if (data.status==='Approved') {
      const exists = payments.find(p=>p.scholarship_id===form.id)
      if (!exists) await supabase.from('payments').insert({ scholarship_id:form.id, student_name:form.student_name, contact_number:form.contact_number, university_name:form.university_name, course_name:form.course_name })
    }
    setSaving(false); closeModal(); loadAll()
  }

  async function savePayment() {
    setSaving(true)
    const data = { payment_percentage:fv('payment_percentage'), bank_option:fv('bank_option'), followup_date:fv('followup_date')||null, remarks:fv('remarks'), payment_done:fv('payment_done')||'No', final_remarks:fv('final_remarks') }
    await supabase.from('payments').update(data).eq('id',form.id)
    if (data.followup_date||data.remarks) {
      const exists = followups.find(f=>f.inquiry_id===form.scholarship_id&&f.source==='Payment'&&f.remark===data.remarks)
      if (!exists) await supabase.from('followups').insert({ inquiry_id:form.scholarship_id, student_name:form.student_name, contact_number:form.contact_number, remark:data.remarks, followup_date:data.followup_date, source:'Payment', status:data.payment_done==='Yes'?'Completed':'Pending' })
    }
    setSaving(false); closeModal(); loadAll()
  }

  async function deleteInquiry(id) {
    if (window.confirm('Delete this student inquiry?')) {
      await supabase.from('inquiries').delete().eq('id',id)
      loadAll()
    }
  }

  async function markFollowupDone(id) {
    await supabase.from('followups').update({status:'Completed'}).eq('id',id)
    loadAll()
  }

  const todayFollowups = followups.filter(f=>f.followup_date===today&&f.status==='Pending')
  const filtered = arr => arr.filter(r=>!search||Object.values(r).some(v=>String(v).toLowerCase().includes(search.toLowerCase())))

  const navItems = [
    {id:'dashboard',label:'Dashboard',icon:'📊'},
    {id:'inquiry',label:'Inquiries',icon:'📋'},
    {id:'scholarship',label:'Scholarship',icon:'🎓'},
    {id:'payment',label:'Payments',icon:'💳'},
    {id:'followups',label:'Follow-ups',icon:'🔔',badge:todayFollowups.length||null},
  ]

  const pageInfo = {
    dashboard:{title:'Dashboard',sub:'Overview of your student pipeline'},
    inquiry:{title:'Student Inquiries',sub:'Manage all student inquiry forms'},
    scholarship:{title:'Scholarship Module',sub:'Track scholarship applications & credentials'},
    payment:{title:'Payment Tracking',sub:'Monitor payment status for approved students'},
    followups:{title:'Follow-ups',sub:'Daily tasks and pending follow-ups'},
  }

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#F7F8FA',flexDirection:'column',gap:16}}>
        <div style={{width:60,height:60,background:'linear-gradient(135deg,#3B82F6,#1D4ED8)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>🎓</div>
        <div style={{fontSize:16,fontWeight:600,color:'#0F172A'}}>Loading your data...</div>
      </div>
    </>
  )

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🎓</div>
            <div>
              <h1>Gyan Education</h1>
              <p>Student CRM</p>
            </div>
          </div>
          <div className="nav-group-label">Navigation</div>
          {navItems.map(item=>(
            <div key={item.id} className={`nav-item${page===item.id?' active':''}`} onClick={()=>{setPage(item.id);setSearch('')}}>
              <div className="nav-icon">{item.icon}</div>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge?<span className="nav-badge">{item.badge}</span>:null}
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">{(user.name||'U')[0].toUpperCase()}</div>
              <span className="user-name">{user.name||user.username}</span>
              <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
            </div>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <h2>{pageInfo[page].title}</h2>
              <p>{pageInfo[page].sub}</p>
            </div>
            <div className="topbar-right">
              {page!=='dashboard'&&(
                <div className="search-wrap">
                  <span className="search-icon">🔍</span>
                  <input placeholder="Search students..." value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
              )}
              {page==='inquiry'&&<button className="btn btn-primary" onClick={()=>openModal('inquiry')}>+ Add Student</button>}
              {['inquiry','scholarship','payment'].includes(page)&&(
                <button className="btn btn-green" onClick={()=>exportExcel(
                  page==='inquiry'?inquiries:page==='scholarship'?scholarships:payments, page
                )}>⬇ Excel</button>
              )}
            </div>
          </div>

          <div className="content">
            {page==='dashboard'&&(
              <>
                <div className="flow-card">
                  <h4>Student Pipeline Flow</h4>
                  <div className="flow-steps">
                    {['📋 Inquiry','→','✅ Completed','→','🎓 Scholarship','→','✔ Approved','→','💳 Payment','→','🏁 Done'].map((s,i)=>(
                      s==='→'?<span key={i} className="flow-arrow">→</span>:<span key={i} className="flow-step">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="stats-grid">
                  {[
                    {label:'Total Inquiries',value:inquiries.length,sub:`${inquiries.filter(i=>i.status==='Completed').length} completed`,cls:'blue',icon:'📋'},
                    {label:'Scholarships',value:scholarships.length,sub:`${scholarships.filter(s=>s.status==='Approved').length} approved`,cls:'purple',icon:'🎓'},
                    {label:'Payments',value:payments.length,sub:`${payments.filter(p=>p.payment_done==='Yes').length} done`,cls:'green',icon:'💳'},
                    {label:"Today's Follow-ups",value:todayFollowups.length,sub:'pending tasks',cls:'red',icon:'🔔'},
                  ].map(s=>(
                    <div key={s.label} className={`stat-card ${s.cls}`}>
                      <div className="s-label">{s.label}</div>
                      <div className="s-value">{s.value}</div>
                      <div className="s-sub">{s.sub}</div>
                      <div className="s-icon">{s.icon}</div>
                    </div>
                  ))}
                </div>
                <div className="dash-grid">
                  <div className="table-card">
                    <div className="table-card-header"><div><h3>Recent Inquiries</h3><p>Latest student entries</p></div></div>
                    <table>
                      <thead><tr><th>Student</th><th>Course</th><th>Status</th></tr></thead>
                      <tbody>
                        {inquiries.slice(0,6).map(r=>(
                          <tr key={r.id}>
                            <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><span className="td-name">{r.student_name}</span></div></td>
                            <td className="td-muted">{r.course_name||'—'}</td>
                            <td><StatusBadge status={r.status}/></td>
                          </tr>
                        ))}
                        {inquiries.length===0&&<tr className="empty-row"><td colSpan={3}><span className="empty-icon">📋</span><span className="empty-text">No inquiries yet</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-card">
                    <div className="table-card-header"><div><h3>Today's Follow-ups</h3><p>{todayFollowups.length} pending tasks for today</p></div></div>
                    <table>
                      <thead><tr><th>Student</th><th>Remark</th><th>Type</th></tr></thead>
                      <tbody>
                        {todayFollowups.slice(0,6).map(r=>(
                          <tr key={r.id}>
                            <td className="td-name">{r.student_name}</td>
                            <td className="td-muted" style={{maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.remark}</td>
                            <td><SourceBadge source={r.source}/></td>
                          </tr>
                        ))}
                        {todayFollowups.length===0&&<tr className="empty-row"><td colSpan={3}><span className="empty-icon">✅</span><span className="empty-text">All clear for today!</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {page==='inquiry'&&(
              <div className="table-card">
                <div className="table-card-header">
                  <div><h3>All Inquiries</h3><p>{filtered(inquiries).length} students found</p></div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr>
                      <th>Student</th><th>Contact</th><th>University</th><th>Course</th>
                      <th>Category</th><th>Agent</th><th>Purpose</th><th>Bank</th><th>Status</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                      {filtered(inquiries).map(r=>(
                        <tr key={r.id}>
                          <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><div><div className="td-name">{r.student_name}</div><div className="td-muted">{r.email}</div></div></div></td>
                          <td style={{whiteSpace:'nowrap'}}>{r.contact_number}<WaBtn number={r.contact_number}/></td>
                          <td>{r.university_name||'—'}</td>
                          <td>{r.course_name||'—'}</td>
                          <td>{r.category||'—'}</td>
                          <td>{r.agent_name||'—'}</td>
                          <td>{r.purpose||'—'}</td>
                          <td>{r.bank_account||'—'}</td>
                          <td><StatusBadge status={r.status||'Pending'}/></td>
                          <td>
                            <div className="actions">
                              <button className="btn btn-sm btn-blue-soft" onClick={()=>openModal('inquiry',r)}>Edit</button>
                              <button className="btn btn-sm btn-red-soft" onClick={()=>deleteInquiry(r.id)}>Del</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered(inquiries).length===0&&<tr className="empty-row"><td colSpan={10}><span className="empty-icon">📋</span><span className="empty-text">No inquiries found. Click "+ Add Student" to get started.</span></td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {page==='scholarship'&&(
              <div className="table-card">
                <div className="table-card-header">
                  <div><h3>Scholarship List</h3><p>Students with Completed inquiry — {filtered(scholarships).length} records</p></div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr>
                      <th>Student</th><th>Contact</th><th>University</th><th>Course</th>
                      <th>User ID</th><th>Password</th><th>Status</th><th>Follow-up</th><th>Remarks</th><th>Action</th>
                    </tr></thead>
                    <tbody>
                      {filtered(scholarships).map(r=>(
                        <tr key={r.id}>
                          <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><span className="td-name">{r.student_name}</span></div></td>
                          <td style={{whiteSpace:'nowrap'}}>{r.contact_number}<WaBtn number={r.contact_number}/></td>
                          <td>{r.university_name||'—'}</td>
                          <td>{r.course_name||'—'}</td>
                          <td className="td-mono">{r.user_id||<span className="td-muted">—</span>}</td>
                          <td>
                            {r.password?(
                              <div className="pass-cell">
                                <span className="td-mono">{showPass[r.id]?r.password:'••••••'}</span>
                                <button className="pass-toggle" onClick={()=>setShowPass(p=>({...p,[r.id]:!p[r.id]}))}>
                                  {showPass[r.id]?'🙈':'👁'}
                                </button>
                              </div>
                            ):<span className="td-muted">—</span>}
                          </td>
                          <td><StatusBadge status={r.status||'Edit'}/></td>
                          <td style={{whiteSpace:'nowrap'}}>
                            {r.followup_date||'—'}
                            {r.followup_date===today&&<span className="today-tag">TODAY</span>}
                          </td>
                          <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} className="td-muted">{r.remarks||'—'}</td>
                          <td><button className="btn btn-sm btn-primary" onClick={()=>openModal('scholarship',r)}>Open</button></td>
                        </tr>
                      ))}
                      {filtered(scholarships).length===0&&<tr className="empty-row"><td colSpan={10}><span className="empty-icon">🎓</span><span className="empty-text">No scholarships yet.</span></td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {page==='payment'&&(
              <div className="table-card">
                <div className="table-card-header">
                  <div><h3>Payment Tracking</h3><p>Approved scholarship students — {filtered(payments).length} records</p></div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr>
                      <th>Student</th><th>Contact</th><th>University</th><th>Course</th>
                      <th>Pay %</th><th>Bank</th><th>Follow-up</th><th>Remarks</th><th>Done</th><th>Final Remarks</th><th>Action</th>
                    </tr></thead>
                    <tbody>
                      {filtered(payments).map(r=>(
                        <tr key={r.id}>
                          <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><span className="td-name">{r.student_name}</span></div></td>
                          <td style={{whiteSpace:'nowrap'}}>{r.contact_number}<WaBtn number={r.contact_number}/></td>
                          <td>{r.university_name||'—'}</td>
                          <td>{r.course_name||'—'}</td>
                          <td>{r.payment_percentage||'—'}</td>
                          <td>{r.bank_option||'—'}</td>
                          <td style={{whiteSpace:'nowrap'}}>
                            {r.followup_date||'—'}
                            {r.followup_date===today&&<span className="today-tag">TODAY</span>}
                          </td>
                          <td className="td-muted">{r.remarks||'—'}</td>
                          <td><StatusBadge status={r.payment_done||'No'}/></td>
                          <td className="td-muted">{r.final_remarks||'—'}</td>
                          <td><button className="btn btn-sm btn-blue-soft" onClick={()=>openModal('payment',r)}>Edit</button></td>
                        </tr>
                      ))}
                      {filtered(payments).length===0&&<tr className="empty-row"><td colSpan={11}><span className="empty-icon">💳</span><span className="empty-text">No payments yet.</span></td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {page==='followups'&&(
              <>
                <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
                  {['Admission','Scholarship','Payment'].map(src=>{
                    const count = followups.filter(f=>f.source===src&&f.status==='Pending').length
                    return (
                      <div key={src} className="stat-card blue">
                        <div className="s-label">{src} Follow-ups</div>
                        <div className="s-value">{count}</div>
                        <div className="s-sub">pending</div>
                      </div>
                    )
                  })}
                </div>
                <div className="table-card">
                  <div className="table-card-header">
                    <div><h3>All Follow-ups</h3><p>{filtered(followups).length} records</p></div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr>
                        <th>Student</th><th>Contact</th><th>Remark</th><th>Date</th><th>Source</th><th>Status</th><th>Action</th>
                      </tr></thead>
                      <tbody>
                        {filtered(followups).map(r=>(
                          <tr key={r.id} className={r.followup_date===today&&r.status==='Pending'?'row-today':''}>
                            <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><span className="td-name">{r.student_name}</span></div></td>
                            <td style={{whiteSpace:'nowrap'}}>{r.contact_number}<WaBtn number={r.contact_number}/></td>
                            <td style={{maxWidth:200}} className="td-muted">{r.remark||'—'}</td>
                            <td style={{whiteSpace:'nowrap'}}>
                              <span style={{color:r.followup_date===today?'#EF4444':'inherit',fontWeight:r.followup_date===today?700:400}}>
                                {r.followup_date||'—'}
                              </span>
                              {r.followup_date===today&&<span className="today-tag">TODAY</span>}
                            </td>
                            <td><SourceBadge source={r.source}/></td>
                            <td><StatusBadge status={r.status}/></td>
                            <td>
                              {r.status==='Pending'&&(
                                <button className="btn btn-sm btn-emerald-soft" onClick={()=>markFollowupDone(r.id)}>✓ Done</button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {filtered(followups).length===0&&<tr className="empty-row"><td colSpan={7}><span className="empty-icon">🔔</span><span className="empty-text">No follow-ups yet.</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {modal==='inquiry'&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="modal">
              <div className="modal-header">
                <h3>{form.id?'✏️ Edit Inquiry':'➕ New Student Inquiry'}</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-section">Student Information</div>
                  <div className="form-group"><label>Student Name *</label><input type="text" value={fv('student_name')} onChange={e=>sf('student_name',e.target.value)} placeholder="Full name"/></div>
                  <div className="form-group"><label>Contact Number</label><input type="text" value={fv('contact_number')} onChange={e=>sf('contact_number',e.target.value)} placeholder="Mobile number"/></div>
                  <div className="form-group"><label>Email ID</label><input type="email" value={fv('email')} onChange={e=>sf('email',e.target.value)} placeholder="Email address"/></div>
                  <div className="form-group"><label>Last Qualification</label><input type="text" value={fv('last_qualification')} onChange={e=>sf('last_qualification',e.target.value)} placeholder="e.g. 12th, Graduation"/></div>
                  <div className="form-group"><label>Parent Contact</label><input type="text" value={fv('parent_contact')} onChange={e=>sf('parent_contact',e.target.value)} placeholder="Parent / Guardian number"/></div>
                  <div className="form-group"><label>Category</label>
                    <select value={fv('category')} onChange={e=>sf('category',e.target.value)}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-section">Course & Application</div>
                  <div className="form-group"><label>University Name</label><input type="text" value={fv('university_name')} onChange={e=>sf('university_name',e.target.value)} placeholder="Preferred university"/></div>
                  <div className="form-group"><label>Course Name</label><input type="text" value={fv('course_name')} onChange={e=>sf('course_name',e.target.value)} placeholder="Interested course"/></div>
                  <div className="form-group"><label>Agent Name</label><input type="text" value={fv('agent_name')} onChange={e=>sf('agent_name',e.target.value)} placeholder="Agent handling student"/></div>
                  <div className="form-group"><label>Purpose</label>
                    <select value={fv('purpose')} onChange={e=>sf('purpose',e.target.value)}>
                      <option value="">Select purpose</option>
                      {PURPOSES.map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Bank Account</label>
                    <select value={fv('bank_account')} onChange={e=>sf('bank_account',e.target.value)}>
                      <option value="">Select bank</option>
                      {BANKS.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Status</label>
                    <select value={fv('status')||'Pending'} onChange={e=>sf('status',e.target.value)}>
                      <option>Pending</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div className="form-group full"><label>Documents / Remarks</label>
                    <textarea value={fv('remarks')} onChange={e=>sf('remarks',e.target.value)} placeholder="Notes, pending documents, or follow-up reminders..."/>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={saveInquiry} disabled={saving}>{saving?'Saving...':'Save Inquiry'}</button>
              </div>
            </div>
          </div>
        )}

        {modal==='scholarship'&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="modal">
              <div className="modal-header">
                <h3>🎓 Scholarship Form</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="student-info-bar">
                  <div className="avatar">{(form.student_name||'?')[0].toUpperCase()}</div>
                  <div className="info"><h4>{form.student_name}</h4><p>{form.university_name} · {form.course_name}</p></div>
                </div>
                <div className="form-grid">
                  <div className="form-section">Portal Credentials</div>
                  <div className="form-group"><label>User ID</label><input type="text" value={fv('user_id')} onChange={e=>sf('user_id',e.target.value)} placeholder="Scholarship portal User ID"/></div>
                  <div className="form-group"><label>Password</label><input type="text" value={fv('password')} onChange={e=>sf('password',e.target.value)} placeholder="Scholarship portal Password"/></div>
                  <div className="form-section">Status & Follow-up</div>
                  <div className="form-group"><label>Application Status</label>
                    <select value={fv('status')||'Edit'} onChange={e=>sf('status',e.target.value)}>
                      {SCHOL_STATUSES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Follow-up Date</label><input type="date" value={fv('followup_date')} onChange={e=>sf('followup_date',e.target.value)}/></div>
                  <div className="form-group full"><label>Remarks / Notes</label><textarea value={fv('remarks')} onChange={e=>sf('remarks',e.target.value)} placeholder="Updates, notes, or follow-up details..."/></div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={saveScholarship} disabled={saving}>{saving?'Saving...':'Save'}</button>
              </div>
            </div>
          </div>
        )}

        {modal==='payment'&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="modal">
              <div className="modal-header">
                <h3>💳 Payment Details</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="student-info-bar">
                  <div className="avatar">{(form.student_name||'?')[0].toUpperCase()}</div>
                  <div className="info"><h4>{form.student_name}</h4><p>{form.university_name} · {form.course_name}</p></div>
                </div>
                <div className="form-grid">
                  <div className="form-section">Payment Information</div>
                  <div className="form-group"><label>Payment Percentage</label>
                    <select value={fv('payment_percentage')} onChange={e=>sf('payment_percentage',e.target.value)}>
                      <option value="">Select</option>
                      {PAY_PERCENT.map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Bank Option</label>
                    <select value={fv('bank_option')} onChange={e=>sf('bank_option',e.target.value)}>
                      <option value="">Select</option>
                      {PAY_BANKS.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Follow-up Date</label><input type="date" value={fv('followup_date')} onChange={e=>sf('followup_date',e.target.value)}/></div>
                  <div className="form-group"><label>Payment Done</label>
                    <select value={fv('payment_done')||'No'} onChange={e=>sf('payment_done',e.target.value)}>
                      <option>No</option><option>Yes</option>
                    </select>
                  </div>
                  <div className="form-group full"><label>Remarks</label><textarea value={fv('remarks')} onChange={e=>sf('remarks',e.target.value)} placeholder="Payment pending notes..."/></div>
                  <div className="form-group full"><label>Final Remarks</label><textarea value={fv('final_remarks')} onChange={e=>sf('final_remarks',e.target.value)} placeholder="Final notes after payment completion..."/></div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={savePayment} disabled={saving}>{saving?'Saving...':'Save Payment'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
