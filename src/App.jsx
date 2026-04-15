import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

const supabase = createClient(
  'https://texozlmjxltvfdznuanm.supabase.co',
  'sb_publishable_zcdJwPRmR2e0_tPXZ35Mtg_3xhwUk6c'
)

const CATEGORIES = ['SC','ST','OBC','General']
const PURPOSES = ['Exam','Regular','Scholarship']
const BANKS = ['Self','Online','Mehsana','Fino']
const SCHOL_STATUSES = ['pending','approved','rejected']
const PAY_BANKS = ['Self/Online','Mehsana','Fino','Gyan Education Current']
const PAY_PERCENT = ['40%','60%','100%']

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:#F7F8FA;color:#18181B;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:10px;}
  .app{display:flex;height:100vh;overflow:hidden;}
  .login-page{min-height:100vh;background:linear-gradient(135deg,#0F172A 0%,#1E3A8A 50%,#0F172A 100%);display:flex;align-items:center;justify-content:center;padding:20px;}
  .login-box{background:#fff;border-radius:16px;padding:40px;width:400px;max-width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.3);}
  .login-logo{text-align:center;margin-bottom:28px;}
  .login-logo-icon{width:64px;height:64px;background:linear-gradient(135deg,#3B82F6,#1D4ED8);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:12px;}
  .login-logo h1{font-size:22px;font-weight:700;color:#0F172A;}
  .login-logo p{font-size:13px;color:#94A3B8;margin-top:4px;}
  .login-form{display:flex;flex-direction:column;gap:16px;}
  .login-label{font-size:12px;font-weight:600;color:#374151;margin-bottom:6px;display:block;}
  .login-input{width:100%;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:all 0.15s;color:#18181B;}
  .login-input:focus{border-color:#3B82F6;box-shadow:0 0 0 3px rgba(59,130,246,0.1);}
  .login-btn{width:100%;padding:12px;background:linear-gradient(135deg,#2563EB,#1D4ED8);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.15s;margin-top:4px;}
  .login-btn:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(37,99,235,0.4);}
  .login-btn:disabled{opacity:0.7;cursor:not-allowed;transform:none;}
  .login-error{background:#FEF2F2;border:1px solid #FECACA;color:#DC2626;padding:10px 14px;border-radius:8px;font-size:13px;text-align:center;}
  .login-footer{text-align:center;margin-top:20px;font-size:12px;color:#94A3B8;}
  .sidebar{width:230px;background:#0F172A;display:flex;flex-direction:column;flex-shrink:0;}
  .sidebar-logo{padding:20px 18px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:10px;}
  .sidebar-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#3B82F6,#1D4ED8);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .sidebar-logo h1{font-size:14px;font-weight:700;color:#fff;}
  .sidebar-logo p{font-size:10px;color:rgba(255,255,255,0.35);margin-top:1px;}
  .nav-group-label{padding:14px 18px 5px;font-size:9px;font-weight:600;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:1.2px;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;margin:1px 8px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,0.5);transition:all 0.15s;user-select:none;}
  .nav-item:hover{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.85);}
  .nav-item.active{background:rgba(59,130,246,0.2);color:#60A5FA;}
  .nav-item .nav-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;background:rgba(255,255,255,0.05);flex-shrink:0;}
  .nav-item.active .nav-icon{background:rgba(59,130,246,0.25);}
  .nav-badge{background:#EF4444;color:#fff;font-size:10px;padding:2px 7px;border-radius:20px;margin-left:auto;font-weight:700;}
  .sidebar-footer{margin-top:auto;padding:14px 18px;border-top:1px solid rgba(255,255,255,0.06);}
  .user-info{display:flex;align-items:center;gap:10px;}
  .user-avatar{width:32px;height:32px;background:linear-gradient(135deg,#3B82F6,#7C3AED);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;}
  .user-name{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);flex:1;}
  .logout-btn{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.3);font-size:16px;padding:4px;transition:all 0.15s;}
  .logout-btn:hover{color:#EF4444;}
  .main{flex:1;overflow-y:auto;display:flex;flex-direction:column;}
  .topbar{background:#fff;border-bottom:1px solid #E4E7EC;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:58px;flex-shrink:0;position:sticky;top:0;z-index:10;}
  .topbar-left h2{font-size:16px;font-weight:700;color:#0F172A;}
  .topbar-left p{font-size:12px;color:#94A3B8;margin-top:1px;}
  .topbar-right{display:flex;gap:8px;align-items:center;}
  .content{padding:20px 24px;flex:1;}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:0 16px;height:36px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 0.15s;white-space:nowrap;}
  .btn-primary{background:#2563EB;color:#fff;}
  .btn-primary:hover{background:#1D4ED8;transform:translateY(-1px);}
  .btn-green{background:#059669;color:#fff;}
  .btn-green:hover{background:#047857;}
  .btn-light{background:#F1F5F9;color:#475569;border:1px solid #E2E8F0;}
  .btn-light:hover{background:#E2E8F0;}
  .btn-blue-soft{background:#EFF6FF;color:#2563EB;}
  .btn-blue-soft:hover{background:#DBEAFE;}
  .btn-red-soft{background:#FEF2F2;color:#DC2626;}
  .btn-red-soft:hover{background:#FEE2E2;}
  .btn-emerald-soft{background:#ECFDF5;color:#059669;}
  .btn-emerald-soft:hover{background:#D1FAE5;}
  .btn-amber-soft{background:#FFFBEB;color:#D97706;}
  .btn-amber-soft:hover{background:#FEF3C7;}
  .btn-purple-soft{background:#F5F3FF;color:#7C3AED;}
  .btn-purple-soft:hover{background:#EDE9FE;}
  .btn-sm{height:30px;padding:0 12px;font-size:12px;border-radius:6px;}
  .btn:disabled{opacity:0.6;cursor:not-allowed;transform:none!important;}
  .search-wrap{position:relative;}
  .search-wrap input{padding:0 12px 0 34px;height:36px;border:1px solid #E2E8F0;border-radius:8px;font-size:13px;width:210px;outline:none;font-family:'DM Sans',sans-serif;color:#18181B;background:#F8FAFC;transition:all 0.15s;}
  .search-wrap input:focus{border-color:#3B82F6;background:#fff;}
  .search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94A3B8;font-size:14px;pointer-events:none;}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
  .stat-card{background:#fff;border-radius:12px;padding:16px 18px;border:1px solid #E4E7EC;position:relative;overflow:hidden;}
  .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:12px 12px 0 0;}
  .stat-card.blue::before{background:linear-gradient(90deg,#3B82F6,#2563EB);}
  .stat-card.purple::before{background:linear-gradient(90deg,#8B5CF6,#7C3AED);}
  .stat-card.green::before{background:linear-gradient(90deg,#10B981,#059669);}
  .stat-card.red::before{background:linear-gradient(90deg,#F87171,#EF4444);}
  .stat-card.amber::before{background:linear-gradient(90deg,#FBBF24,#D97706);}
  .stat-card .s-label{font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;}
  .stat-card .s-value{font-size:28px;font-weight:700;color:#0F172A;line-height:1;}
  .stat-card .s-sub{font-size:11px;color:#CBD5E1;margin-top:4px;}
  .stat-card .s-icon{position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:26px;opacity:0.1;}
  .table-card{background:#fff;border-radius:12px;border:1px solid #E4E7EC;overflow:hidden;margin-bottom:18px;}
  .table-card-header{padding:14px 18px;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
  .table-card-header h3{font-size:14px;font-weight:700;color:#0F172A;}
  .table-card-header p{font-size:12px;color:#94A3B8;margin-top:2px;}
  .table-wrap{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  thead tr{background:#F8FAFC;}
  th{padding:9px 14px;text-align:left;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.8px;border-bottom:1px solid #F1F5F9;white-space:nowrap;}
  td{padding:10px 14px;border-bottom:1px solid #F8FAFC;color:#374151;vertical-align:middle;}
  tr:last-child td{border-bottom:none;}
  tbody tr:hover td{background:#FAFBFF;}
  .td-name{font-weight:600;color:#0F172A;}
  .td-muted{color:#94A3B8;font-size:12px;}
  .td-mono{font-family:'DM Mono',monospace;font-size:12px;}
  .empty-row td{padding:36px 20px;text-align:center;color:#CBD5E1;}
  .empty-icon{font-size:30px;display:block;margin-bottom:8px;}
  .empty-text{font-size:13px;}
  .row-today td{background:#FFFBEB!important;}
  .row-overdue td{background:#FFF1F2!important;}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap;}
  .badge-pending{background:#FEF9C3;color:#854D0E;}
  .badge-completed{background:#DCFCE7;color:#166534;}
  .badge-approved{background:#DBEAFE;color:#1E40AF;}
  .badge-rejected{background:#FEE2E2;color:#991B1B;}
  .badge-yes{background:#DCFCE7;color:#166534;}
  .badge-no{background:#FEE2E2;color:#991B1B;}
  .today-tag{background:#FEF2F2;color:#EF4444;font-size:9px;font-weight:700;padding:2px 6px;border-radius:6px;margin-left:5px;text-transform:uppercase;}
  .overdue-tag{background:#FEE2E2;color:#DC2626;font-size:9px;font-weight:700;padding:2px 6px;border-radius:6px;margin-left:5px;text-transform:uppercase;}
  .wa-btn{display:inline-flex;align-items:center;background:#22C55E;color:#fff;padding:3px 7px;border-radius:6px;font-size:10px;font-weight:700;text-decoration:none;margin-left:5px;}
  .wa-btn:hover{background:#16A34A;}
  .overlay{position:fixed;inset:0;background:rgba(15,23,42,0.6);backdrop-filter:blur(3px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.15s ease;}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  .modal{background:#fff;border-radius:14px;width:600px;max-width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,0.25);animation:slideUp 0.2s ease;}
  .modal-lg{width:800px;}
  @keyframes slideUp{from{transform:translateY(16px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  .modal-header{padding:18px 22px;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1;border-radius:14px 14px 0 0;}
  .modal-header h3{font-size:15px;font-weight:700;color:#0F172A;}
  .modal-close{width:30px;height:30px;border-radius:7px;background:#F1F5F9;border:none;cursor:pointer;font-size:16px;color:#64748B;display:flex;align-items:center;justify-content:center;}
  .modal-close:hover{background:#E2E8F0;}
  .modal-body{padding:22px;}
  .modal-footer{padding:14px 22px;border-top:1px solid #F1F5F9;display:flex;justify-content:flex-end;gap:8px;background:#FAFBFF;border-radius:0 0 14px 14px;}
  .sib{background:linear-gradient(135deg,#EFF6FF,#F0F9FF);border:1px solid #BFDBFE;border-radius:10px;padding:12px 16px;margin-bottom:18px;display:flex;align-items:center;gap:10px;}
  .sib-av{width:38px;height:38px;background:linear-gradient(135deg,#3B82F6,#1D4ED8);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;flex-shrink:0;}
  .sib-inf h4{font-size:14px;font-weight:700;color:#1E40AF;}
  .sib-inf p{font-size:12px;color:#3B82F6;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .form-group{display:flex;flex-direction:column;gap:5px;}
  .form-group.full{grid-column:1/-1;}
  .form-section{grid-column:1/-1;font-size:11px;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.8px;padding-bottom:7px;border-bottom:1px solid #EFF6FF;margin-top:6px;}
  label{font-size:12px;font-weight:600;color:#374151;}
  input[type=text],input[type=email],input[type=number],input[type=date],input[type=password],select,textarea{padding:8px 12px;border:1px solid #E2E8F0;border-radius:8px;font-size:13px;color:#18181B;font-family:'DM Sans',sans-serif;outline:none;background:#fff;transition:all 0.15s;width:100%;}
  input:focus,select:focus,textarea:focus{border-color:#3B82F6;box-shadow:0 0 0 3px rgba(59,130,246,0.1);}
  textarea{resize:vertical;min-height:72px;}
  select{cursor:pointer;}
  .remarks-history{background:#F8FAFC;border-radius:10px;padding:14px;margin-top:16px;border:1px solid #F1F5F9;}
  .remarks-history h4{font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;}
  .remark-item{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #F1F5F9;}
  .remark-item:last-child{border-bottom:none;padding-bottom:0;}
  .remark-dot{width:8px;height:8px;border-radius:50%;background:#3B82F6;flex-shrink:0;margin-top:5px;}
  .remark-date{font-size:11px;color:#94A3B8;margin-bottom:2px;}
  .remark-text{font-size:13px;color:#374151;font-weight:500;}
  .remark-followup{font-size:11px;color:#3B82F6;margin-top:2px;}
  .pass-cell{display:flex;align-items:center;gap:5px;}
  .pass-toggle{background:none;border:none;cursor:pointer;color:#94A3B8;padding:2px;font-size:13px;}
  .actions{display:flex;gap:5px;align-items:center;}
  .flow-card{background:linear-gradient(135deg,#1E3A8A,#2563EB);border-radius:12px;padding:16px 18px;margin-bottom:20px;color:#fff;}
  .flow-card h4{font-size:11px;font-weight:600;opacity:0.7;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;}
  .flow-steps{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .flow-step{background:rgba(255,255,255,0.15);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;}
  .flow-arrow{opacity:0.5;font-size:14px;}
  .dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .info-box{background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#92400E;}
  .backup-bar{background:linear-gradient(135deg,#F0FDF4,#DCFCE7);border:1px solid #86EFAC;border-radius:10px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
  .backup-bar h4{font-size:14px;font-weight:700;color:#166534;}
  .backup-bar p{font-size:12px;color:#16A34A;margin-top:2px;}
`

function StatusBadge({status}){
  const s=status?.toLowerCase()
  const map={pending:'badge-pending',completed:'badge-completed',approved:'badge-approved',rejected:'badge-rejected',yes:'badge-yes',no:'badge-no'}
  const label=status?.charAt(0).toUpperCase()+status?.slice(1)
  return <span className={`badge ${map[s]||'badge-pending'}`}>{label}</span>
}
function WaBtn({number}){
  if(!number) return null
  return <a className="wa-btn" href={`https://wa.me/91${number}`} target="_blank" rel="noreferrer">WA</a>
}
function Avatar({name}){
  const i=(name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#3B82F6,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>{i}</div>
}
function fmtDate(ts){if(!ts) return '';return new Date(ts).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
function fmtDateTime(ts){if(!ts) return '';return new Date(ts).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
function exportExcel(data,name){const ws=XLSX.utils.json_to_sheet(data);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,name);XLSX.writeFile(wb,`${name}_${new Date().toLocaleDateString('en-IN')}.xlsx`)}
function exportAll(i,s,p,f){const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(i),'Inquiries');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(s),'Scholarships');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(p),'Payments');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(f),'Followups');XLSX.writeFile(wb,`GyanEducation_Backup_${new Date().toLocaleDateString('en-IN')}.xlsx`)}

function LoginPage({onLogin}){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  async function handleLogin(){
    if(!username||!password){setError('Please enter username and password');return}
    setLoading(true);setError('')
    const{data}=await supabase.from('users').select('*').eq('username',username).eq('password',password).single()
    if(data){localStorage.setItem('crm_user',JSON.stringify(data));onLogin(data)}
    else setError('Invalid username or password')
    setLoading(false)
  }
  return(
    <>
      <style>{CSS}</style>
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo"><div className="login-logo-icon">🎓</div><h1>Gyan Education CRM</h1><p>Sign in to access your dashboard</p></div>
          <div className="login-form">
            {error&&<div className="login-error">⚠️ {error}</div>}
            <div><label className="login-label">Username</label><input className="login-input" type="text" placeholder="Enter username" value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
            <div><label className="login-label">Password</label><input className="login-input" type="password" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
            <button className="login-btn" onClick={handleLogin} disabled={loading}>{loading?'Signing in...':'Sign In →'}</button>
          </div>
          <div className="login-footer">Gyan Education · Internal Team Only</div>
        </div>
      </div>
    </>
  )
}

export default function App(){
  const [user,setUser]=useState(null)
  const [page,setPage]=useState('dashboard')
  const [inquiries,setInquiries]=useState([])
  const [scholarships,setScholarships]=useState([])
  const [payments,setPayments]=useState([])
  const [inqFollowups,setInqFollowups]=useState([])
  const [loading,setLoading]=useState(true)
  const [modal,setModal]=useState(null)
  const [search,setSearch]=useState('')
  const [form,setForm]=useState({})
  const [showPass,setShowPass]=useState({})
  const [saving,setSaving]=useState(false)
  const [selectedInquiry,setSelectedInquiry]=useState(null)
  const [followupForm,setFollowupForm]=useState({remark:'',followup_date:''})
  const [viewInquiry,setViewInquiry]=useState(null)

  const today=new Date().toISOString().split('T')[0]

  useEffect(()=>{
    const saved=localStorage.getItem('crm_user')
    if(saved) setUser(JSON.parse(saved))
    loadAll()
  },[])

  async function loadAll(){
    setLoading(true)
    const [i,s,p,f]=await Promise.all([
      supabase.from('inquiries').select('*').order('created_at',{ascending:false}),
      supabase.from('scholarships').select('*').order('created_at',{ascending:false}),
      supabase.from('payments').select('*').order('created_at',{ascending:false}),
      supabase.from('inquiry_followups').select('*').order('created_at',{ascending:false}),
    ])
    if(i.data) setInquiries(i.data)
    if(s.data) setScholarships(s.data)
    if(p.data) setPayments(p.data)
    if(f.data) setInqFollowups(f.data)
    setLoading(false)
  }

  function handleLogout(){localStorage.removeItem('crm_user');setUser(null)}
  if(!user) return <LoginPage onLogin={setUser}/>

  function openModal(type,data={}){setForm({...data});setModal(type)}
  function closeModal(){setModal(null);setForm({});setSelectedInquiry(null);setFollowupForm({remark:'',followup_date:''})}
  const fv=f=>form[f]??''
  const sf=(f,v)=>setForm(prev=>({...prev,[f]:v}))

  // SAVE NEW INQUIRY — always starts as pending
  async function saveInquiry(){
    if(!fv('student_name')){alert('Student name is required');return}
    setSaving(true)
    await supabase.from('inquiries').insert({
      student_name:fv('student_name'),contact_number:fv('contact_number'),
      email:fv('email'),last_qualification:fv('last_qualification'),
      university_name:fv('university_name'),course_name:fv('course_name'),
      category:fv('category'),parent_contact:fv('parent_contact'),
      agent_name:fv('agent_name'),purpose:fv('purpose'),
      bank_account:fv('bank_account'),status:'pending',
    })
    setSaving(false);closeModal();loadAll()
  }

  // EDIT INQUIRY — only basic fields, not status
  async function editInquiry(){
    if(!fv('student_name')){alert('Student name is required');return}
    setSaving(true)
    await supabase.from('inquiries').update({
      student_name:fv('student_name'),contact_number:fv('contact_number'),
      email:fv('email'),last_qualification:fv('last_qualification'),
      university_name:fv('university_name'),course_name:fv('course_name'),
      category:fv('category'),parent_contact:fv('parent_contact'),
      agent_name:fv('agent_name'),purpose:fv('purpose'),bank_account:fv('bank_account'),
    }).eq('id',form.id)
    setSaving(false);closeModal();loadAll()
  }

  // MARK INQUIRY AS COMPLETED — auto creates scholarship
  async function markInquiryCompleted(id){
    const inq=inquiries.find(i=>i.id===id)
    if(!inq) return
    await supabase.from('inquiries').update({status:'completed'}).eq('id',id)
    // Auto create scholarship record
    const exists=scholarships.find(s=>s.inquiry_id===id)
    if(!exists){
      await supabase.from('scholarships').insert({
        inquiry_id:id,
        student_name:inq.student_name,
        contact_number:inq.contact_number,
        university_name:inq.university_name,
        course_name:inq.course_name,
        status:'pending',
      })
    }
    loadAll()
  }

  // SAVE FOLLOW-UP — saves remark + date for a pending inquiry
  async function saveFollowup(){
    if(!followupForm.remark&&!followupForm.followup_date){alert('Please enter remark or follow-up date');return}
    setSaving(true)
    await supabase.from('inquiry_followups').insert({
      inquiry_id:selectedInquiry.id,
      remark:followupForm.remark,
      followup_date:followupForm.followup_date||null,
    })
    setFollowupForm({remark:'',followup_date:''})
    setSaving(false)
    loadAll()
  }

  // SAVE SCHOLARSHIP — updates same row, saves approved_date if approved
  async function saveScholarship(){
    setSaving(true)
    const newStatus=fv('status')||'pending'
    const updateData={
      login_id:fv('login_id'),password:fv('password'),
      remark:fv('remark'),followup_date:fv('followup_date')||null,status:newStatus,
    }
    if(newStatus==='approved') updateData.approved_date=today
    await supabase.from('scholarships').update(updateData).eq('id',form.id)
    // Approved → auto create payment record (once only)
    if(newStatus==='approved'){
      const exists=payments.find(p=>p.scholarship_id===form.id)
      if(!exists){
        await supabase.from('payments').insert({
          scholarship_id:form.id,
          student_name:form.student_name,contact_number:form.contact_number,
          university_name:form.university_name,course_name:form.course_name,
          payment_done:'no',
        })
      }
    }
    setSaving(false);closeModal();loadAll()
  }

  // SAVE PAYMENT — updates same row
  async function savePayment(){
    setSaving(true)
    await supabase.from('payments').update({
      payment_percentage:fv('payment_percentage'),bank_option:fv('bank_option'),
      followup_date:fv('followup_date')||null,remarks:fv('remarks'),
      payment_done:fv('payment_done')||'no',final_remarks:fv('final_remarks'),
    }).eq('id',form.id)
    setSaving(false);closeModal();loadAll()
  }

  async function deleteInquiry(id){
    if(window.confirm('Delete this student inquiry?')){
      await supabase.from('inquiries').delete().eq('id',id);loadAll()
    }
  }

  // COMPUTED DATA
  const completedInquiries=inquiries.filter(i=>i.status==='completed')
  const pendingInquiries=inquiries.filter(i=>i.status==='pending')

  // Today's inquiry follow-ups: followup_date = today AND inquiry is pending
  const todayInqFollowups=inqFollowups
    .filter(f=>f.followup_date===today)
    .map(f=>({...f,inquiry:inquiries.find(i=>i.id===f.inquiry_id)}))
    .filter(f=>f.inquiry?.status==='pending')

  // Today's scholarship follow-ups: followup_date = today AND not approved/rejected
  const todayScholFollowups=scholarships.filter(s=>s.followup_date===today&&s.status==='pending')

  // Today's payment follow-ups: followup_date = today AND payment not done
  const todayPayFollowups=payments.filter(p=>p.followup_date===today&&p.payment_done==='no')

  function getInqFollowupsFor(inquiryId){
    return inqFollowups.filter(f=>f.inquiry_id===inquiryId)
      .sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))
  }

  function isToday(d){return d===today}
  function isOverdue(d){return d&&d<today}

  const filtered=arr=>arr.filter(r=>!search||Object.values(r).some(v=>String(v).toLowerCase().includes(search.toLowerCase())))

  const navItems=[
    {id:'dashboard',label:'Dashboard',icon:'📊'},
    {id:'inq-followups',label:'Inquiry Follow-ups',icon:'📌',badge:todayInqFollowups.length||null},
    {id:'inquiry',label:'Inquiry List',icon:'📋'},
    {id:'scholarship',label:'Scholarship',icon:'🎓',badge:todayScholFollowups.length||null},
    {id:'payment',label:'Payments',icon:'💳',badge:todayPayFollowups.length||null},
    {id:'backup',label:'Data Backup',icon:'💾'},
  ]

  const pageInfo={
    dashboard:{title:'Dashboard',sub:'Overview of your student pipeline'},
    'inq-followups':{title:'Inquiry Follow-ups',sub:"Pending inquiries & today's follow-ups"},
    inquiry:{title:'Inquiry List',sub:'Completed inquiries only'},
    scholarship:{title:'Scholarship Module',sub:'Track scholarship applications'},
    payment:{title:'Payment Tracking',sub:'Monitor payment status'},
    backup:{title:'Data Backup',sub:'Download and backup all data'},
  }

  if(loading) return(
    <>
      <style>{CSS}</style>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#F7F8FA',flexDirection:'column',gap:16}}>
        <div style={{width:60,height:60,background:'linear-gradient(135deg,#3B82F6,#1D4ED8)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>🎓</div>
        <div style={{fontSize:16,fontWeight:600,color:'#0F172A'}}>Loading Gyan Education CRM...</div>
      </div>
    </>
  )

  return(
    <>
      <style>{CSS}</style>
      <div className="app">

        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🎓</div>
            <div><h1>Gyan Education</h1><p>Student CRM</p></div>
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
              <h2>{pageInfo[page]?.title}</h2>
              <p>{pageInfo[page]?.sub}</p>
            </div>
            <div className="topbar-right">
              {!['dashboard','backup'].includes(page)&&(
                <div className="search-wrap"><span className="search-icon">🔍</span><input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
              )}
              {['inq-followups','inquiry'].includes(page)&&(
                <button className="btn btn-primary" onClick={()=>openModal('new-inquiry')}>+ New Inquiry</button>
              )}
              {['inquiry','scholarship','payment'].includes(page)&&(
                <button className="btn btn-green" onClick={()=>exportExcel(page==='inquiry'?completedInquiries:page==='scholarship'?scholarships:payments,page)}>⬇ Excel</button>
              )}
            </div>
          </div>

          <div className="content">

            {/* ════ DASHBOARD ════ */}
            {page==='dashboard'&&(
              <>
                <div className="flow-card">
                  <h4>Student Pipeline Flow</h4>
                  <div className="flow-steps">
                    {['📋 New Inquiry','→','📌 Pending → Follow-ups','→','✅ Completed → Scholarship','→','✔ Approved → Payment','→','💳 Payment Done → Complete'].map((s,i)=>
                      s==='→'?<span key={i} className="flow-arrow">→</span>:<span key={i} className="flow-step">{s}</span>
                    )}
                  </div>
                </div>
                <div className="stats-grid">
                  {[
                    {label:'Total Inquiries',value:inquiries.length,sub:`${completedInquiries.length} completed`,cls:'blue',icon:'📋'},
                    {label:"Today's Inquiry Follow-ups",value:todayInqFollowups.length,sub:'pending today',cls:'amber',icon:'📌'},
                    {label:'Scholarships',value:scholarships.length,sub:`${scholarships.filter(s=>s.status==='approved').length} approved`,cls:'purple',icon:'🎓'},
                    {label:"Today's Payment Tasks",value:todayPayFollowups.length,sub:'payment follow-ups',cls:'red',icon:'💳'},
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
                    <div className="table-card-header"><div><h3>Today's Inquiry Follow-ups</h3><p>{todayInqFollowups.length} due today</p></div></div>
                    <table>
                      <thead><tr><th>Student</th><th>Remark</th><th>Contact</th></tr></thead>
                      <tbody>
                        {todayInqFollowups.slice(0,5).map((f,i)=>(
                          <tr key={i} className="row-today">
                            <td className="td-name">{f.inquiry?.student_name||'—'}</td>
                            <td className="td-muted" style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.remark||'—'}</td>
                            <td style={{whiteSpace:'nowrap'}}>{f.inquiry?.contact_number}<WaBtn number={f.inquiry?.contact_number}/></td>
                          </tr>
                        ))}
                        {!todayInqFollowups.length&&<tr className="empty-row"><td colSpan={3}><span className="empty-icon">✅</span><span className="empty-text">No inquiry follow-ups today</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-card">
                    <div className="table-card-header"><div><h3>Today's Scholarship Follow-ups</h3><p>{todayScholFollowups.length} due today</p></div></div>
                    <table>
                      <thead><tr><th>Student</th><th>University</th><th>Contact</th></tr></thead>
                      <tbody>
                        {todayScholFollowups.slice(0,5).map(s=>(
                          <tr key={s.id} className="row-today">
                            <td className="td-name">{s.student_name}</td>
                            <td className="td-muted">{s.university_name||'—'}</td>
                            <td style={{whiteSpace:'nowrap'}}>{s.contact_number}<WaBtn number={s.contact_number}/></td>
                          </tr>
                        ))}
                        {!todayScholFollowups.length&&<tr className="empty-row"><td colSpan={3}><span className="empty-icon">✅</span><span className="empty-text">No scholarship follow-ups today</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ════ INQUIRY FOLLOW-UPS ════ */}
            {/* LOGIC: Show ONLY pending inquiries. Today's follow-ups highlighted. */}
            {page==='inq-followups'&&(
              <>
                <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
                  <div className="stat-card amber"><div className="s-label">Pending Inquiries</div><div className="s-value">{pendingInquiries.length}</div><div className="s-sub">need follow-up</div><div className="s-icon">📌</div></div>
                  <div className="stat-card blue"><div className="s-label">Today's Follow-ups</div><div className="s-value">{todayInqFollowups.length}</div><div className="s-sub">due today</div><div className="s-icon">📅</div></div>
                  <div className="stat-card red"><div className="s-label">Overdue Follow-ups</div><div className="s-value">{inqFollowups.filter(f=>f.followup_date<today&&inquiries.find(i=>i.id===f.inquiry_id)?.status==='pending').length}</div><div className="s-sub">past due</div><div className="s-icon">⚠️</div></div>
                </div>

                {/* TODAY'S FOLLOW-UPS — highlighted section */}
                {todayInqFollowups.length>0&&(
                  <div className="table-card">
                    <div className="table-card-header" style={{background:'#FFFBEB'}}>
                      <div><h3>🔔 Today's Follow-ups</h3><p>{todayInqFollowups.length} records due today</p></div>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Student</th><th>Contact</th><th>University</th><th>Course</th><th>Agent</th><th>Last Remark</th><th>Actions</th></tr></thead>
                        <tbody>
                          {todayInqFollowups.filter(f=>!search||f.inquiry?.student_name?.toLowerCase().includes(search.toLowerCase())).map((f,i)=>(
                            <tr key={i} className="row-today">
                              <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={f.inquiry?.student_name}/><span className="td-name">{f.inquiry?.student_name}</span></div></td>
                              <td style={{whiteSpace:'nowrap'}}>{f.inquiry?.contact_number}<WaBtn number={f.inquiry?.contact_number}/></td>
                              <td>{f.inquiry?.university_name||'—'}</td>
                              <td>{f.inquiry?.course_name||'—'}</td>
                              <td>{f.inquiry?.agent_name||'—'}</td>
                              <td className="td-muted" style={{maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.remark||'—'}</td>
                              <td>
                                <div className="actions">
                                  <button className="btn btn-sm btn-amber-soft" onClick={()=>{setSelectedInquiry(f.inquiry);setFollowupForm({remark:'',followup_date:''});setModal('followup')}}>Follow-up</button>
                                  <button className="btn btn-sm btn-emerald-soft" onClick={()=>markInquiryCompleted(f.inquiry?.id)}>✓ Complete</button>
                                  <button className="btn btn-sm btn-blue-soft" onClick={()=>openModal('edit-inquiry',f.inquiry)}>Edit</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ALL PENDING INQUIRIES */}
                <div className="table-card">
                  <div className="table-card-header">
                    <div><h3>All Pending Inquiries</h3><p>{pendingInquiries.filter(r=>!search||Object.values(r).some(v=>String(v).toLowerCase().includes(search.toLowerCase()))).length} students</p></div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Student</th><th>Contact</th><th>University</th><th>Course</th><th>Purpose</th><th>Agent</th><th>Created</th><th>Actions</th></tr></thead>
                      <tbody>
                        {pendingInquiries.filter(r=>!search||Object.values(r).some(v=>String(v).toLowerCase().includes(search.toLowerCase()))).map(r=>(
                          <tr key={r.id}>
                            <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><div><div className="td-name">{r.student_name}</div><div className="td-muted">{r.email}</div></div></div></td>
                            <td style={{whiteSpace:'nowrap'}}>{r.contact_number}<WaBtn number={r.contact_number}/></td>
                            <td>{r.university_name||'—'}</td>
                            <td>{r.course_name||'—'}</td>
                            <td>{r.purpose||'—'}</td>
                            <td>{r.agent_name||'—'}</td>
                            <td className="td-muted">{fmtDate(r.created_at)}</td>
                            <td>
                              <div className="actions">
                                <button className="btn btn-sm btn-amber-soft" onClick={()=>{setSelectedInquiry(r);setFollowupForm({remark:'',followup_date:''});setModal('followup')}}>Follow-up</button>
                                <button className="btn btn-sm btn-emerald-soft" onClick={()=>markInquiryCompleted(r.id)}>✓ Complete</button>
                                <button className="btn btn-sm btn-blue-soft" onClick={()=>openModal('edit-inquiry',r)}>Edit</button>
                                <button className="btn btn-sm btn-red-soft" onClick={()=>deleteInquiry(r.id)}>Del</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {!pendingInquiries.length&&<tr className="empty-row"><td colSpan={8}><span className="empty-icon">✅</span><span className="empty-text">No pending inquiries</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ════ INQUIRY LIST ════ */}
            {/* LOGIC: Shows ONLY completed inquiries */}
            {page==='inquiry'&&(
              <>
                <div className="info-box">ℹ️ This list shows only <strong>Completed</strong> inquiries. Pending inquiries are in <strong>Inquiry Follow-ups</strong>.</div>
                <div className="table-card">
                  <div className="table-card-header">
                    <div><h3>Completed Inquiries</h3><p>{filtered(completedInquiries).length} students</p></div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Student</th><th>Contact</th><th>University</th><th>Course</th><th>Category</th><th>Agent</th><th>Purpose</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filtered(completedInquiries).map(r=>(
                          <tr key={r.id}>
                            <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><div><div className="td-name">{r.student_name}</div><div className="td-muted">{r.email}</div></div></div></td>
                            <td style={{whiteSpace:'nowrap'}}>{r.contact_number}<WaBtn number={r.contact_number}/></td>
                            <td>{r.university_name||'—'}</td>
                            <td>{r.course_name||'—'}</td>
                            <td>{r.category||'—'}</td>
                            <td>{r.agent_name||'—'}</td>
                            <td>{r.purpose||'—'}</td>
                            <td><StatusBadge status={r.status}/></td>
                            <td>
                              <div className="actions">
                                <button className="btn btn-sm btn-blue-soft" onClick={()=>openModal('edit-inquiry',r)}>Edit</button>
                                <button className="btn btn-sm btn-red-soft" onClick={()=>deleteInquiry(r.id)}>Del</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {!filtered(completedInquiries).length&&<tr className="empty-row"><td colSpan={9}><span className="empty-icon">📋</span><span className="empty-text">No completed inquiries yet. Mark pending inquiries as Complete.</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ════ SCHOLARSHIP ════ */}
            {/* LOGIC: Auto-added when inquiry completed. Same screen for follow-ups. Show today's highlighted. */}
            {page==='scholarship'&&(
              <>
                {todayScholFollowups.length>0&&(
                  <div className="info-box">🔔 <strong>{todayScholFollowups.length}</strong> scholarship follow-up(s) due today — highlighted below in yellow.</div>
                )}
                <div className="table-card">
                  <div className="table-card-header">
                    <div><h3>Scholarship List</h3><p>{filtered(scholarships).length} records · Auto-added when inquiry is marked Complete</p></div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Student</th><th>Contact</th><th>University</th><th>Course</th><th>Login ID</th><th>Password</th><th>Status</th><th>Follow-up Date</th><th>Remark</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filtered(scholarships).map(r=>(
                          <tr key={r.id} className={isToday(r.followup_date)&&r.status==='pending'?'row-today':isOverdue(r.followup_date)&&r.status==='pending'?'row-overdue':''}>
                            <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><span className="td-name">{r.student_name}</span></div></td>
                            <td style={{whiteSpace:'nowrap'}}>{r.contact_number}<WaBtn number={r.contact_number}/></td>
                            <td>{r.university_name||'—'}</td>
                            <td>{r.course_name||'—'}</td>
                            <td className="td-mono">{r.login_id||'—'}</td>
                            <td>
                              {r.password?(
                                <div className="pass-cell">
                                  <span className="td-mono">{showPass[r.id]?r.password:'••••••'}</span>
                                  <button className="pass-toggle" onClick={()=>setShowPass(p=>({...p,[r.id]:!p[r.id]}))}>
                                    {showPass[r.id]?'🙈':'👁'}
                                  </button>
                                </div>
                              ):'—'}
                            </td>
                            <td><StatusBadge status={r.status||'pending'}/></td>
                            <td style={{whiteSpace:'nowrap'}}>
                              {r.followup_date||'—'}
                              {isToday(r.followup_date)&&r.status==='pending'&&<span className="today-tag">TODAY</span>}
                              {isOverdue(r.followup_date)&&r.status==='pending'&&<span className="overdue-tag">OVERDUE</span>}
                            </td>
                            <td className="td-muted" style={{maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.remark||'—'}</td>
                            <td>
                              <div className="actions">
                                <button className="btn btn-sm btn-primary" onClick={()=>openModal('scholarship',r)}>Open</button>
                                <button className="btn btn-sm btn-purple-soft" onClick={()=>{const inq=inquiries.find(i=>i.id===r.inquiry_id);if(inq) setViewInquiry(inq)}}>📋</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {!filtered(scholarships).length&&<tr className="empty-row"><td colSpan={10}><span className="empty-icon">🎓</span><span className="empty-text">No scholarships yet. Mark an inquiry as Complete to add here automatically.</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ════ PAYMENT ════ */}
            {/* LOGIC: Auto-added when scholarship approved. Payment Done=Yes → complete. */}
            {page==='payment'&&(
              <>
                {todayPayFollowups.length>0&&(
                  <div className="info-box">🔔 <strong>{todayPayFollowups.length}</strong> payment follow-up(s) due today — highlighted below.</div>
                )}
                <div className="table-card">
                  <div className="table-card-header">
                    <div><h3>Payment Tracking</h3><p>{filtered(payments).length} records · Auto-added when scholarship is Approved</p></div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Student</th><th>Contact</th><th>University</th><th>Course</th><th>Pay %</th><th>Bank</th><th>Follow-up</th><th>Remarks</th><th>Done</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filtered(payments).map(r=>(
                          <tr key={r.id} className={isToday(r.followup_date)&&r.payment_done==='no'?'row-today':isOverdue(r.followup_date)&&r.payment_done==='no'?'row-overdue':''}>
                            <td><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.student_name}/><span className="td-name">{r.student_name}</span></div></td>
                            <td style={{whiteSpace:'nowrap'}}>{r.contact_number}<WaBtn number={r.contact_number}/></td>
                            <td>{r.university_name||'—'}</td>
                            <td>{r.course_name||'—'}</td>
                            <td>{r.payment_percentage||'—'}</td>
                            <td>{r.bank_option||'—'}</td>
                            <td style={{whiteSpace:'nowrap'}}>
                              {r.followup_date||'—'}
                              {isToday(r.followup_date)&&r.payment_done==='no'&&<span className="today-tag">TODAY</span>}
                              {isOverdue(r.followup_date)&&r.payment_done==='no'&&<span className="overdue-tag">OVERDUE</span>}
                            </td>
                            <td className="td-muted" style={{maxWidth:130,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.remarks||'—'}</td>
                            <td><StatusBadge status={r.payment_done||'no'}/></td>
                            <td>
                              <div className="actions">
                                <button className="btn btn-sm btn-blue-soft" onClick={()=>openModal('payment',r)}>Edit</button>
                                <button className="btn btn-sm btn-purple-soft" onClick={()=>{const sch=scholarships.find(s=>s.id===r.scholarship_id);if(sch){const inq=inquiries.find(i=>i.id===sch.inquiry_id);if(inq) setViewInquiry(inq)}}}>📋</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {!filtered(payments).length&&<tr className="empty-row"><td colSpan={10}><span className="empty-icon">💳</span><span className="empty-text">No payments yet. Approve a scholarship to add here automatically.</span></td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ════ BACKUP ════ */}
            {page==='backup'&&(
              <>
                <div className="backup-bar">
                  <div><h4>💾 Data Backup</h4><p>Download all your data as Excel for backup</p></div>
                  <button className="btn btn-green" onClick={()=>exportAll(inquiries,scholarships,payments,inqFollowups)}>⬇ Full Backup</button>
                </div>
                <div className="stats-grid">
                  {[
                    {label:'Total Inquiries',value:inquiries.length,cls:'blue'},
                    {label:'Scholarships',value:scholarships.length,cls:'purple'},
                    {label:'Payments',value:payments.length,cls:'green'},
                    {label:'Follow-up Records',value:inqFollowups.length,cls:'amber'},
                  ].map(s=>(
                    <div key={s.label} className={`stat-card ${s.cls}`}>
                      <div className="s-label">{s.label}</div>
                      <div className="s-value">{s.value}</div>
                      <div className="s-sub">records</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  {[
                    {label:'📋 Inquiries',data:inquiries,name:'inquiries'},
                    {label:'🎓 Scholarships',data:scholarships,name:'scholarships'},
                    {label:'💳 Payments',data:payments,name:'payments'},
                    {label:'📌 Follow-ups',data:inqFollowups,name:'followups'},
                  ].map(item=>(
                    <div key={item.name} className="table-card" style={{marginBottom:0}}>
                      <div className="table-card-header">
                        <div><h3>{item.label}</h3><p>{item.data.length} records</p></div>
                        <button className="btn btn-sm btn-green" onClick={()=>exportExcel(item.data,item.name)}>⬇ Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>

        {/* ════ NEW INQUIRY MODAL ════ */}
        {modal==='new-inquiry'&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="modal modal-lg">
              <div className="modal-header"><h3>➕ New Student Inquiry</h3><button className="modal-close" onClick={closeModal}>×</button></div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-section">Student Information</div>
                  <div className="form-group"><label>Student Name *</label><input type="text" value={fv('student_name')} onChange={e=>sf('student_name',e.target.value)} placeholder="Full name"/></div>
                  <div className="form-group"><label>Contact Number</label><input type="text" value={fv('contact_number')} onChange={e=>sf('contact_number',e.target.value)} placeholder="Mobile number"/></div>
                  <div className="form-group"><label>Email ID</label><input type="email" value={fv('email')} onChange={e=>sf('email',e.target.value)} placeholder="Email address"/></div>
                  <div className="form-group"><label>Last Qualification</label><input type="text" value={fv('last_qualification')} onChange={e=>sf('last_qualification',e.target.value)} placeholder="e.g. 12th, Graduation"/></div>
                  <div className="form-group"><label>Parent Contact</label><input type="text" value={fv('parent_contact')} onChange={e=>sf('parent_contact',e.target.value)} placeholder="Parent/Guardian"/></div>
                  <div className="form-group"><label>Category</label>
                    <select value={fv('category')} onChange={e=>sf('category',e.target.value)}>
                      <option value="">Select</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-section">Course & Application</div>
                  <div className="form-group"><label>University Name</label><input type="text" value={fv('university_name')} onChange={e=>sf('university_name',e.target.value)} placeholder="Preferred university"/></div>
                  <div className="form-group"><label>Course Name</label><input type="text" value={fv('course_name')} onChange={e=>sf('course_name',e.target.value)} placeholder="Interested course"/></div>
                  <div className="form-group"><label>Agent Name</label><input type="text" value={fv('agent_name')} onChange={e=>sf('agent_name',e.target.value)} placeholder="Agent handling student"/></div>
                  <div className="form-group"><label>Purpose</label>
                    <select value={fv('purpose')} onChange={e=>sf('purpose',e.target.value)}>
                      <option value="">Select</option>{PURPOSES.map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Bank Account</label>
                    <select value={fv('bank_account')} onChange={e=>sf('bank_account',e.target.value)}>
                      <option value="">Select</option>{BANKS.map(b=><option key={b}>{b}</option>)}
                    </select>
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

        {/* ════ EDIT INQUIRY MODAL ════ */}
        {modal==='edit-inquiry'&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="modal modal-lg">
              <div className="modal-header"><h3>✏️ Edit Inquiry</h3><button className="modal-close" onClick={closeModal}>×</button></div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-section">Student Information</div>
                  <div className="form-group"><label>Student Name *</label><input type="text" value={fv('student_name')} onChange={e=>sf('student_name',e.target.value)}/></div>
                  <div className="form-group"><label>Contact Number</label><input type="text" value={fv('contact_number')} onChange={e=>sf('contact_number',e.target.value)}/></div>
                  <div className="form-group"><label>Email ID</label><input type="email" value={fv('email')} onChange={e=>sf('email',e.target.value)}/></div>
                  <div className="form-group"><label>Last Qualification</label><input type="text" value={fv('last_qualification')} onChange={e=>sf('last_qualification',e.target.value)}/></div>
                  <div className="form-group"><label>Parent Contact</label><input type="text" value={fv('parent_contact')} onChange={e=>sf('parent_contact',e.target.value)}/></div>
                  <div className="form-group"><label>Category</label>
                    <select value={fv('category')} onChange={e=>sf('category',e.target.value)}>
                      <option value="">Select</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-section">Course & Application</div>
                  <div className="form-group"><label>University Name</label><input type="text" value={fv('university_name')} onChange={e=>sf('university_name',e.target.value)}/></div>
                  <div className="form-group"><label>Course Name</label><input type="text" value={fv('course_name')} onChange={e=>sf('course_name',e.target.value)}/></div>
                  <div className="form-group"><label>Agent Name</label><input type="text" value={fv('agent_name')} onChange={e=>sf('agent_name',e.target.value)}/></div>
                  <div className="form-group"><label>Purpose</label>
                    <select value={fv('purpose')} onChange={e=>sf('purpose',e.target.value)}>
                      <option value="">Select</option>{PURPOSES.map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Bank Account</label>
                    <select value={fv('bank_account')} onChange={e=>sf('bank_account',e.target.value)}>
                      <option value="">Select</option>{BANKS.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={editInquiry} disabled={saving}>{saving?'Saving...':'Save Changes'}</button>
              </div>
            </div>
          </div>
        )}

        {/* ════ FOLLOW-UP MODAL ════ */}
        {/* LOGIC: Shows previous remarks (latest first) + add new remark + date */}
        {modal==='followup'&&selectedInquiry&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="modal">
              <div className="modal-header">
                <h3>📌 Follow-up — {selectedInquiry.student_name}</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="sib">
                  <div className="sib-av">{(selectedInquiry.student_name||'?')[0].toUpperCase()}</div>
                  <div className="sib-inf">
                    <h4>{selectedInquiry.student_name}</h4>
                    <p>{selectedInquiry.university_name} · {selectedInquiry.course_name} · {selectedInquiry.contact_number}</p>
                  </div>
                </div>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#374151',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.5px'}}>Add New Follow-up</div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea value={followupForm.remark} onChange={e=>setFollowupForm(f=>({...f,remark:e.target.value}))} placeholder="Enter follow-up remark..." style={{minHeight:60}}/>
                    </div>
                    <div className="form-group">
                      <label>Next Follow-up Date</label>
                      <input type="date" value={followupForm.followup_date} onChange={e=>setFollowupForm(f=>({...f,followup_date:e.target.value}))}/>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={saveFollowup} disabled={saving} style={{alignSelf:'flex-start'}}>{saving?'Saving...':'Save Follow-up'}</button>
                  </div>
                </div>

                {/* Previous remarks — latest on top */}
                {(()=>{
                  const hist=getInqFollowupsFor(selectedInquiry.id)
                  if(!hist.length) return <div style={{fontSize:13,color:'#94A3B8',textAlign:'center',padding:'12px 0'}}>No previous remarks yet</div>
                  return(
                    <div className="remarks-history">
                      <h4>📜 Previous Remarks (Latest First)</h4>
                      {hist.map((h,i)=>(
                        <div key={i} className="remark-item">
                          <div className="remark-dot"/>
                          <div>
                            <div className="remark-date">{fmtDateTime(h.created_at)}</div>
                            <div className="remark-text">{h.remark||'—'}</div>
                            {h.followup_date&&<div className="remark-followup">📅 Next follow-up: {h.followup_date}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={closeModal}>Close</button>
                <button className="btn btn-emerald-soft" onClick={()=>{closeModal();markInquiryCompleted(selectedInquiry.id)}}>✓ Mark as Completed</button>
              </div>
            </div>
          </div>
        )}

        {/* ════ SCHOLARSHIP MODAL ════ */}
        {modal==='scholarship'&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="modal modal-lg">
              <div className="modal-header">
                <h3>🎓 Scholarship — {form.student_name}</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="sib">
                  <div className="sib-av">{(form.student_name||'?')[0].toUpperCase()}</div>
                  <div className="sib-inf"><h4>{form.student_name}</h4><p>{form.university_name} · {form.course_name} · {form.contact_number}</p></div>
                </div>
                <div className="form-grid">
                  <div className="form-section">Portal Credentials</div>
                  <div className="form-group"><label>Login ID</label><input type="text" value={fv('login_id')} onChange={e=>sf('login_id',e.target.value)} placeholder="Scholarship portal Login ID"/></div>
                  <div className="form-group"><label>Password</label><input type="text" value={fv('password')} onChange={e=>sf('password',e.target.value)} placeholder="Scholarship portal Password"/></div>
                  <div className="form-section">Status & Follow-up</div>
                  <div className="form-group"><label>Status</label>
                    <select value={fv('status')||'pending'} onChange={e=>sf('status',e.target.value)}>
                      {SCHOL_STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Follow-up Date</label><input type="date" value={fv('followup_date')} onChange={e=>sf('followup_date',e.target.value)}/></div>
                  <div className="form-group full"><label>Remark</label><textarea value={fv('remark')} onChange={e=>sf('remark',e.target.value)} placeholder="Updates, notes, follow-up details..."/></div>
                </div>
                {form.approved_date&&(
                  <div style={{marginTop:12,padding:'10px 14px',background:'#DCFCE7',borderRadius:8,fontSize:13,color:'#166534'}}>
                    ✅ Approved on: <strong>{fmtDate(form.approved_date)}</strong>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={saveScholarship} disabled={saving}>{saving?'Saving...':'Save'}</button>
              </div>
            </div>
          </div>
        )}

        {/* ════ PAYMENT MODAL ════ */}
        {modal==='payment'&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
            <div className="modal modal-lg">
              <div className="modal-header">
                <h3>💳 Payment — {form.student_name}</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="sib">
                  <div className="sib-av">{(form.student_name||'?')[0].toUpperCase()}</div>
                  <div className="sib-inf"><h4>{form.student_name}</h4><p>{form.university_name} · {form.course_name} · {form.contact_number}</p></div>
                </div>
                <div className="form-grid">
                  <div className="form-section">Payment Information</div>
                  <div className="form-group"><label>Payment Percentage</label>
                    <select value={fv('payment_percentage')} onChange={e=>sf('payment_percentage',e.target.value)}>
                      <option value="">Select</option>{PAY_PERCENT.map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Bank Option</label>
                    <select value={fv('bank_option')} onChange={e=>sf('bank_option',e.target.value)}>
                      <option value="">Select</option>{PAY_BANKS.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Follow-up Date</label><input type="date" value={fv('followup_date')} onChange={e=>sf('followup_date',e.target.value)}/></div>
                  <div className="form-group"><label>Payment Done</label>
                    <select value={fv('payment_done')||'no'} onChange={e=>sf('payment_done',e.target.value)}>
                      <option value="no">No</option><option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="form-group full"><label>Remarks</label><textarea value={fv('remarks')} onChange={e=>sf('remarks',e.target.value)} placeholder="Payment notes..."/></div>
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

        {/* ════ VIEW INQUIRY POPUP ════ */}
        {viewInquiry&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setViewInquiry(null)}>
            <div className="modal modal-lg">
              <div className="modal-header">
                <h3>📋 Inquiry Details — {viewInquiry.student_name}</h3>
                <button className="modal-close" onClick={()=>setViewInquiry(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="sib">
                  <div className="sib-av">{(viewInquiry.student_name||'?')[0].toUpperCase()}</div>
                  <div className="sib-inf"><h4>{viewInquiry.student_name}</h4><p>{viewInquiry.university_name} · {viewInquiry.course_name}</p></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {[
                    {l:'Student Name',v:viewInquiry.student_name},{l:'Contact',v:viewInquiry.contact_number},
                    {l:'Email',v:viewInquiry.email},{l:'Last Qualification',v:viewInquiry.last_qualification},
                    {l:'Parent Contact',v:viewInquiry.parent_contact},{l:'Category',v:viewInquiry.category},
                    {l:'University',v:viewInquiry.university_name},{l:'Course',v:viewInquiry.course_name},
                    {l:'Agent',v:viewInquiry.agent_name},{l:'Purpose',v:viewInquiry.purpose},
                    {l:'Bank Account',v:viewInquiry.bank_account},{l:'Status',v:viewInquiry.status},
                  ].map((f,i)=>(
                    <div key={i} style={{background:'#F8FAFC',borderRadius:8,padding:'10px 14px'}}>
                      <div style={{fontSize:10,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:4}}>{f.l}</div>
                      <div style={{fontSize:13,fontWeight:600,color:'#0F172A'}}>{f.v||'—'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={()=>setViewInquiry(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
