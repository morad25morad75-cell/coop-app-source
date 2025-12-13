
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Package, 
  FileBarChart, Users, Video, Image as ImageIcon, 
  Share2, MessageSquare, LogOut, Bell, 
  Menu, X, Download, Printer, Save, Send, Loader2,
  CheckCircle, AlertCircle, ChevronLeft, TrendingUp,
  ArrowRight, Star, Gift, Link as LinkIcon, Facebook, Youtube, Instagram, MonitorPlay, FileText, ClipboardList,
  Mic, MicOff, Volume2, Wand2, UploadCloud, MessageCircle, MapPin, Building2, Phone, Mail, Lock, Globe, User, Clock, Calendar, CalendarDays, BarChart3, Briefcase, ShoppingBag, Coins, Calculator, Search, PhoneCall, HardDrive
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  UserProfile, Sale, Expense, Product, Meeting, Member, NotificationType, AppLanguage, SocialLinks
} from './types';
import { 
  generateBusinessAdvice, summarizeMeetings, generateMarketingImage, generateMarketingVideo, generatePostCaption
} from './services/geminiService';

// --- Data ---
const COUNTRIES_DATA: Record<string, { ar: string; en: string; code: string; cities: { ar: string; en: string }[] }> = {
  "Morocco": { 
    ar: "المغرب", en: "Morocco", code: "+212",
    cities: [
      { ar: "الدار البيضاء", en: "Casablanca" }, { ar: "الرباط", en: "Rabat" }, { ar: "مراكش", en: "Marrakech" }, 
      { ar: "فاس", en: "Fes" }, { ar: "طنجة", en: "Tangier" }, { ar: "أكادير", en: "Agadir" }, 
      { ar: "مكناس", en: "Meknes" }, { ar: "وجدة", en: "Oujda" }, { ar: "القنيطرة", en: "Kenitra" },
      { ar: "تطوان", en: "Tetouan" }, { ar: "سلا", en: "Salé" }, { ar: "تمارة", en: "Temara" },
      { ar: "آسفي", en: "Safi" }, { ar: "المحمدية", en: "Mohammedia" }, { ar: "خريبكة", en: "Khouribga" },
      { ar: "الجديدة", en: "El Jadida" }, { ar: "بني ملال", en: "Beni Mellal" }, { ar: "الناظور", en: "Nador" },
      { ar: "تازة", en: "Taza" }, { ar: "سطات", en: "Settat" }, { ar: "برشيد", en: "Berrechid" },
      { ar: "الخميسات", en: "Khemisset" }, { ar: "كلميم", en: "Guelmim" }, { ar: "العرائش", en: "Larache" },
      { ar: "القصر الكبير", en: "Ksar El Kebir" }, { ar: "خنيفرة", en: "Khenifra" }, { ar: "ورزازات", en: "Ouarzazate" },
      { ar: "تيزنيت", en: "Tiznit" }, { ar: "تارودانت", en: "Taroudant" }, { ar: "الصويرة", en: "Essaouira" },
      { ar: "الحسيمة", en: "Al Hoceima" }, { ar: "الرشيدية", en: "Errachidia" }, { ar: "العيون", en: "Laayoune" },
      { ar: "الداخلة", en: "Dakhla" }, { ar: "السمارة", en: "Smara" }, { ar: "بوجدور", en: "Boujdour" },
      { ar: "زاكورة", en: "Zagora" }, { ar: "شفشاون", en: "Chefchaouen" }, { ar: "إفران", en: "Ifrane" },
      { ar: "أصيلة", en: "Asilah" }, { ar: "أزرو", en: "Azrou" }, { ar: "سيدي إفني", en: "Sidi Ifni" },
      { ar: "طانطان", en: "Tan-Tan" }, { ar: "طرفاية", en: "Tarfaya" }, { ar: "وزان", en: "Ouezzane" },
      { ar: "بركان", en: "Berkane" }, { ar: "تاوريرت", en: "Taourirt" }, { ar: "جرادة", en: "Jerada" },
      { ar: "الفنيدق", en: "Fnideq" }, { ar: "المضيق", en: "M'diq" }, { ar: "مرتيل", en: "Martil" },
      { ar: "سيدي قاسم", en: "Sidi Kacem" }, { ar: "سيدي سليمان", en: "Sidi Slimane" },
      { ar: "ميدلت", en: "Midelt" }, { ar: "تنغير", en: "Tinghir" }, { ar: "قلعة السراغنة", en: "El Kelaa des Sraghna" },
      { ar: "الفقيه بن صالح", en: "Fquih Ben Salah" }, { ar: "واد زم", en: "Oued Zem" }, { ar: "بنسليمان", en: "Benslimane" }
    ] 
  },
  "Saudi Arabia": { ar: "السعودية", en: "Saudi Arabia", code: "+966", cities: [{ ar: "الرياض", en: "Riyadh" }, { ar: "جدة", en: "Jeddah" }, { ar: "مكة المكرمة", en: "Mecca" }, { ar: "المدينة المنورة", en: "Medina" }, { ar: "الدمام", en: "Dammam" }] },
  "Egypt": { ar: "مصر", en: "Egypt", code: "+20", cities: [{ ar: "القاهرة", en: "Cairo" }, { ar: "الإسكندرية", en: "Alexandria" }, { ar: "الجيزة", en: "Giza" }] },
  "UAE": { ar: "الإمارات", en: "UAE", code: "+971", cities: [{ ar: "دبي", en: "Dubai" }, { ar: "أبو ظبي", en: "Abu Dhabi" }, { ar: "الشارقة", en: "Sharjah" }] },
  "Jordan": { ar: "الأردن", en: "Jordan", code: "+962", cities: [{ ar: "عمان", en: "Amman" }, { ar: "الزرقاء", en: "Zarqa" }] },
  "Qatar": { ar: "قطر", en: "Qatar", code: "+974", cities: [{ ar: "الدوحة", en: "Doha" }] },
  "Kuwait": { ar: "الكويت", en: "Kuwait", code: "+965", cities: [{ ar: "مدينة الكويت", en: "Kuwait City" }] },
  "Bahrain": { ar: "البحرين", en: "Bahrain", code: "+973", cities: [{ ar: "المنامة", en: "Manama" }] },
  "Oman": { ar: "عمان", en: "Oman", code: "+968", cities: [{ ar: "مسقط", en: "Muscat" }] },
  "Algeria": { ar: "الجزائر", en: "Algeria", code: "+213", cities: [{ ar: "الجزائر", en: "Algiers" }] },
  "Tunisia": { ar: "تونس", en: "Tunisia", code: "+216", cities: [{ ar: "تونس", en: "Tunis" }] },
  "France": { ar: "فرنسا", en: "France", code: "+33", cities: [{ ar: "باريس", en: "Paris" }, { ar: "مارسيليا", en: "Marseille" }, { ar: "ليون", en: "Lyon" }] },
  "Spain": { ar: "إسبانيا", en: "Spain", code: "+34", cities: [{ ar: "مدريد", en: "Madrid" }, { ar: "برشلونة", en: "Barcelona" }] },
  "USA": { ar: "أمريكا", en: "USA", code: "+1", cities: [{ ar: "نيويورك", en: "New York" }, { ar: "واشنطن", en: "Washington" }] }
};

const PROJECT_TYPES = [
  { value: 'cooperative', labelAr: 'تعاونية', labelEn: 'Cooperative' },
  { value: 'company', labelAr: 'شركة', labelEn: 'Company' },
  { value: 'contractor', labelAr: 'مقاولة', labelEn: 'Contractor' },
  { value: 'commercial', labelAr: 'مشروع تجاري', labelEn: 'Commercial Project' },
];

// --- Helpers ---
const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
});

// Custom hook for live time
const useTime = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
};

// --- Components ---
const Logo = ({ className = "", variant = 'dark', showText = true }: { className?: string, variant?: 'light' | 'dark', showText?: boolean }) => {
  const logoBase64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgODUiIGZpbGw9Im5vbmUiPg0KICA8dGV4dCB4PSIxMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjkwMCIgZm9udC1zaXplPSI2MCIgZmlsbD0iIzAwMkI1QiI+Q1JFPC90ZXh0Pg0KICA8Y2lyY2xlIGN4PSI1NSIgY3k9IjMyIiByPSIzIiBmaWxsPSIjMDA3NUZGIi8+DQogIDxwYXRoIGQ9Ik01NSAzMiBMODUgMzIgTDk1IDIyIiBzdHJva2U9IiMwMDc1RkYiIHN0cm9rZS13aWR0aD0iMiIvPg0KICA8Y2lyY2xlIGN4PSI5NSIgY3k9IjIyIiByPSIzIiBmaWxsPSIjMDA3NUZGIi8+DQogIDxjaXJjbGUgY3g9IjYwIiB5PSI0NSIgcj0iMyIgZmlsbD0iIzAwNzVGRiIvPg0KICA8cGF0aCBkPSJNNjAgNDUgTDkwIDQ1IEwxMTAgNTUiIHN0cm9rZT0iIzAwNzVGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDxjaXJjbGUgY3g9IjExMCIgY3k9IjU1IiByPSIzIiBmaWxsPSIjMDA3NUZGIi8+DQogIDxwYXRoIGQ9Ik0xMzAgMzggTDE2MCAzOCIgc3Ryb2tlPSIjMDA3NUZGIiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPGNpcmNsZSBjeD0iMTMwIiBjeT0iMzgiIHI9IjMiIGZpbGw9IiMwMDc1RkYiLz4NCiAgPGNpcmNsZSBjeD0iMTYwIiBjeT0iMzgiIHI9IjMiIGZpbGw9IiMwMDc1RkYiLz4NCiAgPHRleHQgeD0iMTAiIHk9Ijc1IiBmb250LWZhbWlseT0iQ2Fpcm8sIEFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNzAwIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDAyQjVCIj5jb29wLnJhcy5lbC5tYTwvdGV4dD4NCjwvc3ZnPg==`;
  return (
    <div className="flex flex-col items-center justify-center">
      <img src={logoBase64} alt="CRE Logo" className={`object-contain transition-all duration-300 ${variant === 'dark' ? 'brightness-0 invert opacity-100' : 'mix-blend-multiply'} ${className}`} />
      {showText && <span className={`text-[10px] font-bold tracking-widest mt-1 uppercase ${variant === 'dark' ? 'text-white/80' : 'text-slate-900'}`}>COOP. RAS EL MA</span>}
    </div>
  );
};

const PrintHeader = ({ user, title }: { user: UserProfile, title: string }) => (
  <div className="hidden print:flex flex-row justify-between items-center mb-6 border-b-2 border-slate-800 pb-4 w-full">
    <div className="flex flex-col space-y-1 text-right">
      <h1 className="text-2xl font-black text-slate-900">{user.companyName}</h1>
      <div className="text-slate-700 font-medium text-sm">
         <p>{user.projectType === 'cooperative' ? 'تعاونية' : user.projectType === 'company' ? 'شركة' : 'مقاولة'}</p>
         <p>{user.address}</p>
         <p>{user.city}, {user.country}</p>
         <p dir="ltr">{user.phone}</p>
      </div>
    </div>
    <div className="text-center flex flex-col items-center">
      <h2 className="text-xl font-bold border px-6 py-2 rounded-lg border-slate-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-600">تاريخ الطباعة: {new Date().toLocaleString('ar-MA')}</p>
    </div>
    <div className="w-32 flex flex-col items-center">
      <Logo variant="light" className="w-full" showText={false} />
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, isActive, onClick, isOpen }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 transition-all duration-200 group relative ${isActive ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-500' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-r-4 border-transparent'} ${!isOpen && 'justify-center px-2'}`} title={!isOpen ? label : ''}>
    <Icon size={20} className={`${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
    {isOpen && <span className="font-medium text-sm tracking-wide">{label}</span>}
  </button>
);

const Card = ({ children, title, className = "", icon: Icon, action }: any) => (
  <div className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300 ${className}`}>
    {(title || Icon) && (
      <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
        <div className="flex items-center gap-3">
          {Icon && <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Icon size={20} /></div>}
          {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);

const Input = ({ label, error, success, icon: Icon, required, ...props }: any) => (
  <div className="mb-5 group">
    <label className="block text-sm font-semibold text-slate-600 mb-1.5 transition-colors group-focus-within:text-emerald-600">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input required={required} {...props} className={`w-full ${Icon ? 'pl-4 pr-10' : 'pl-4 pr-4'} py-3 border-2 rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 bg-slate-50 focus:bg-white ${error ? 'border-red-200 focus:border-red-500' : success ? 'border-green-200 focus:border-emerald-500' : 'border-slate-200 focus:border-emerald-500'}`} />
      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
        {Icon && <Icon size={18} />}
      </div>
      <div className="absolute left-3 top-3.5 pointer-events-none">
        {success && <CheckCircle className="text-emerald-500" size={18} />}
        {error && <AlertCircle className="text-red-500" size={18} />}
      </div>
    </div>
  </div>
);

const Select = ({ label, options, value, onChange, placeholder, success, icon: Icon, required, ...props }: any) => (
  <div className="mb-5 group">
    <label className="block text-sm font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select required={required} value={value} onChange={onChange} className={`w-full ${Icon ? 'pl-4 pr-10' : 'pl-4 pr-10'} py-3 border-2 rounded-xl text-slate-800 outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer ${success ? 'border-green-200 focus:border-emerald-500' : 'border-slate-200 focus:border-emerald-500'}`} {...props}>
        <option value="">{placeholder}</option>
        {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
          {Icon ? <Icon size={18} /> : null}
      </div>
      <div className="absolute left-3 top-3.5 pointer-events-none text-slate-400"><ChevronLeft size={18} className="-rotate-90" /></div>
    </div>
  </div>
);

const Button = ({ children, variant = 'primary', isLoading, className, ...props }: any) => {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5",
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
  };
  return (
    <button className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant as keyof typeof variants]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="animate-spin" size={18} />}
      {children}
    </button>
  );
};

const ClockWidget = () => {
  const time = useTime();
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-mono text-sm print:hidden">
      <Clock size={16} className="text-emerald-600" />
      <span className="font-bold">{time.toLocaleTimeString('ar-MA')}</span>
      <span className="w-px h-4 bg-slate-300 mx-1"></span>
      <Calendar size={16} className="text-emerald-600" />
      <span>{time.toLocaleDateString('ar-MA')}</span>
    </div>
  );
}

// --- Page Components ---

const DashboardHome = ({ user, setActiveTab }: { user: UserProfile, setActiveTab: (t: string) => void }) => {
  const time = useTime();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative rounded-3xl overflow-hidden bg-emerald-900 text-white shadow-2xl border border-white/10">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-800 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-emerald-100 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Star size={12} className="fill-current" /> التطبيق الإداري الشامل
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-lg">أهلاً بعودتك، <br/><span className="text-emerald-200">{user.companyName}</span></h2>
            <div className="flex items-center gap-3 text-emerald-100 font-medium text-lg drop-shadow-md">
               <span className="bg-white/10 px-3 py-1 rounded-lg">{new Date().toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <p className="text-emerald-100 font-medium text-lg drop-shadow-md">{user.projectType === 'cooperative' ? 'تعاونية' : user.projectType === 'company' ? 'شركة' : 'مشروع'} مسجل في {user.city}, {user.country}</p>
            <button onClick={() => setActiveTab('sales')} className="bg-white hover:bg-emerald-50 text-emerald-900 px-8 py-3 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1 inline-flex items-center gap-2 mt-4">ابدأ العمل الآن <ArrowRight size={18} /></button>
          </div>
          <div className="hidden md:block w-72 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-3 transform hover:rotate-0 transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Business Woman" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[{id: 'sales', label: 'المبيعات', icon: ShoppingCart}, {id: 'expenses', label: 'المصاريف', icon: Wallet}, {id: 'inventory', label: 'المخزون', icon: Package}, {id: 'chat', label: 'الفريق', icon: MessageCircle}, {id: 'social', label: 'الترويج', icon: Share2}, {id: 'video', label: 'فيديو AI', icon: Video}].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-4 rounded-full bg-slate-100 text-slate-600 mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors"><item.icon size={28} /></div>
            <span className="font-bold text-slate-700">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const SalesPage = ({ sales, onAddSale, user }: { sales: Sale[], onAddSale: (n: string, p: number, q: number) => void, user: UserProfile }) => {
  const [pName, setPName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [view, setView] = useState<'daily'|'monthly'|'yearly'>('daily');

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    onAddSale(pName, Number(price), Number(qty)); 
    setPName(''); setPrice(''); setQty(''); 
  };

  const getAggregatedSales = () => {
    if (view === 'daily') {
       const todayStr = new Date().toDateString();
       return sales.filter(s => new Date(s.date).toDateString() === todayStr);
    } else if (view === 'monthly') {
       const grouped: Record<string, { total: number, count: number, date: string }> = {};
       sales.forEach(s => {
          const date = new Date(s.date);
          const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}`;
          if (!grouped[key]) grouped[key] = { total: 0, count: 0, date: key };
          grouped[key].total += s.total;
          grouped[key].count += 1;
       });
       return Object.values(grouped).sort((a,b) => b.date.localeCompare(a.date));
    } else {
       const grouped: Record<string, { total: number, count: number, date: string }> = {};
       sales.forEach(s => {
          const date = new Date(s.date);
          const key = `${date.getFullYear()}`;
          if (!grouped[key]) grouped[key] = { total: 0, count: 0, date: key };
          grouped[key].total += s.total;
          grouped[key].count += 1;
       });
       return Object.values(grouped).sort((a,b) => b.date.localeCompare(a.date));
    }
  };

  const data = getAggregatedSales();
  const totalPeriod = data.reduce((sum: number, item: any) => sum + (view === 'daily' ? item.total : item.total), 0);
  
  const handlePrint = () => window.print();

  return (
    <div className="relative min-h-full">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none z-0 rounded-3xl" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=2000)'}}></div>
        
        <div className="relative z-10 flex gap-6 flex-col lg:flex-row p-4">
          <div className="w-full flex justify-between items-center mb-6 lg:hidden">
             <PrintHeader user={user} title={`تقرير المبيعات`} />
          </div>
          <div className="hidden lg:block w-full absolute -top-4 left-0 right-0">
             <PrintHeader user={user} title={`تقرير المبيعات - ${view === 'daily' ? 'اليومي' : view === 'monthly' ? 'الشهري' : 'السنوي'}`} />
          </div>

          <Card title="تسجيل مبيعات اليوم" className="flex-1 print:hidden h-fit mt-12 !bg-white/80" icon={ShoppingCart} action={<ClockWidget />}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="اسم المنتج" value={pName} onChange={(e:any) => setPName(e.target.value)} required placeholder="مثال: قميص" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="الثمن" type="number" value={price} onChange={(e:any) => setPrice(e.target.value)} required placeholder="0.00" />
                <Input label="الكمية" type="number" value={qty} onChange={(e:any) => setQty(e.target.value)} required placeholder="0" />
              </div>
              <Button type="submit" className="w-full">إتمام البيع</Button>
            </form>
          </Card>

          <Card title="السجلات والتقارير" className="flex-[1.5] mt-12 !bg-white/80" icon={TrendingUp}>
            <div className="flex justify-between items-center mb-4 print:hidden">
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setView('daily')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${view==='daily'?'bg-white shadow text-emerald-600':'text-slate-500 hover:bg-slate-200'}`}>اليومي</button>
                    <button onClick={() => setView('monthly')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${view==='monthly'?'bg-white shadow text-emerald-600':'text-slate-500 hover:bg-slate-200'}`}>الشهري</button>
                    <button onClick={() => setView('yearly')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${view==='yearly'?'bg-white shadow text-emerald-600':'text-slate-500 hover:bg-slate-200'}`}>السنوي</button>
                </div>
                <Button variant="secondary" onClick={handlePrint} className="!px-3"><Printer size={18}/></Button>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-6 flex justify-between items-center">
                <div>
                    <p className="text-sm text-emerald-800 font-bold mb-1">إجمالي {view === 'daily' ? 'اليوم' : view === 'monthly' ? 'الشهر' : 'السنة'}</p>
                    <p className="text-3xl font-black text-emerald-600">{totalPeriod.toLocaleString()}</p>
                </div>
                <div className="bg-white p-3 rounded-full text-emerald-500 shadow-sm">
                    {view === 'daily' ? <Clock size={24}/> : view === 'monthly' ? <CalendarDays size={24}/> : <BarChart3 size={24}/>}
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-slate-500 font-medium bg-slate-50/50">
                    <tr>
                        {view === 'daily' ? (
                            <>
                                <th className="pb-3 pr-2">المنتج</th>
                                <th className="pb-3">الثمن</th>
                                <th className="pb-3">العدد</th>
                                <th className="pb-3">الوقت</th>
                                <th className="pb-3">الإجمالي</th>
                            </>
                        ) : (
                            <>
                                <th className="pb-3 pr-2">{view === 'monthly' ? 'الشهر' : 'السنة'}</th>
                                <th className="pb-3">عدد العمليات</th>
                                <th className="pb-3">إجمالي المبيعات</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-slate-400">لا توجد سجلات لهذه الفترة</td></tr>
                  ) : (
                      data.map((item: any, idx) => {
                          if (view === 'daily') {
                              const sale = item as Sale;
                              return (
                                <tr key={sale.id} className="group hover:bg-slate-50">
                                    <td className="py-3 pr-2 font-medium">{sale.productName}</td>
                                    <td>{sale.price}</td>
                                    <td>{sale.quantity}</td>
                                    <td className="text-xs text-slate-400" dir="ltr">{new Date(sale.date).toLocaleTimeString('ar-MA', {hour:'2-digit', minute:'2-digit'})}</td>
                                    <td className="font-bold text-emerald-600">{sale.total}</td>
                                </tr>
                              );
                          } else {
                              return (
                                <tr key={idx} className="group hover:bg-slate-50">
                                    <td className="py-3 pr-2 font-bold text-slate-700" dir="ltr">{item.date}</td>
                                    <td>{item.count} عملية</td>
                                    <td className="font-bold text-emerald-600 text-lg">{item.total.toLocaleString()}</td>
                                </tr>
                              );
                          }
                      })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
    </div>
  );
};

const ExpensePage = ({ expenses, onAddExpense, user }: { expenses: Expense[], onAddExpense: (d: string, a: number, c: 'service' | 'purchase') => void, user?: UserProfile }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'service'|'purchase'>('purchase');
  const [view, setView] = useState<'daily'|'monthly'|'yearly'>('daily');

  const handleSubmit = (e: React.FormEvent) => { 
      e.preventDefault(); 
      onAddExpense(desc, Number(amount), category); 
      setDesc(''); setAmount(''); 
  };

  const getAggregatedExpenses = () => {
    if (view === 'daily') {
       const todayStr = new Date().toDateString();
       return expenses.filter(s => new Date(s.date).toDateString() === todayStr);
    } else if (view === 'monthly') {
       const grouped: Record<string, { total: number, count: number, date: string }> = {};
       expenses.forEach(s => {
          const date = new Date(s.date);
          const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}`;
          if (!grouped[key]) grouped[key] = { total: 0, count: 0, date: key };
          grouped[key].total += s.amount;
          grouped[key].count += 1;
       });
       return Object.values(grouped).sort((a,b) => b.date.localeCompare(a.date));
    } else {
       const grouped: Record<string, { total: number, count: number, date: string }> = {};
       expenses.forEach(s => {
          const date = new Date(s.date);
          const key = `${date.getFullYear()}`;
          if (!grouped[key]) grouped[key] = { total: 0, count: 0, date: key };
          grouped[key].total += s.amount;
          grouped[key].count += 1;
       });
       return Object.values(grouped).sort((a,b) => b.date.localeCompare(a.date));
    }
  };

  const data = getAggregatedExpenses();
  const totalPeriod = data.reduce((sum: number, item: any) => sum + (view === 'daily' ? item.amount : item.total), 0);
  
  const handlePrint = () => window.print();

  return (
    <div className="relative min-h-full">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none z-0 rounded-3xl" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000)'}}></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
            <div className="hidden lg:block lg:col-span-3">
                 {user && <PrintHeader user={user} title={`تقرير المصاريف - ${view === 'daily' ? 'اليومي' : view === 'monthly' ? 'الشهري' : 'السنوي'}`} />}
            </div>

            <Card title="تسجيل مصروف جديد" icon={Wallet} action={<ClockWidget />} className="h-fit !bg-white/80">
                <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="البيان (الوصف)" value={desc} onChange={(e:any) => setDesc(e.target.value)} required placeholder="مثال: فاتورة كهرباء" />
                <Select 
                    label="نوع المصروف" 
                    value={category} 
                    onChange={(e:any) => setCategory(e.target.value)} 
                    options={[{label: 'خدماتي (فواتير، كراء...)', value: 'service'}, {label: 'مشتريات (سلع، مواد...)', value: 'purchase'}]}
                    required 
                    icon={Briefcase}
                />
                <Input label="المبلغ" type="number" value={amount} onChange={(e:any) => setAmount(e.target.value)} required placeholder="0.00" />
                <Button type="submit" className="w-full" variant="danger">تسجيل المصروف</Button>
                </form>
            </Card>

            <Card title="سجل المصاريف والتقارير" className="lg:col-span-2 !bg-white/80">
                <div className="flex justify-between items-center mb-4 print:hidden">
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setView('daily')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${view==='daily'?'bg-white shadow text-red-600':'text-slate-500 hover:bg-slate-200'}`}>اليومي</button>
                        <button onClick={() => setView('monthly')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${view==='monthly'?'bg-white shadow text-red-600':'text-slate-500 hover:bg-slate-200'}`}>الشهري</button>
                        <button onClick={() => setView('yearly')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${view==='yearly'?'bg-white shadow text-red-600':'text-slate-500 hover:bg-slate-200'}`}>السنوي</button>
                    </div>
                    <Button variant="secondary" onClick={handlePrint} className="!px-3"><Printer size={18}/></Button>
                </div>

                <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-red-800 font-bold mb-1">إجمالي مصاريف {view === 'daily' ? 'اليوم' : view === 'monthly' ? 'الشهر' : 'السنة'}</p>
                        <p className="text-3xl font-black text-red-600">-{totalPeriod.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded-full text-red-500 shadow-sm">
                        <Wallet size={24}/>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[600px]">
                     <table className="w-full text-sm text-right">
                        <thead className="text-slate-500 font-medium bg-slate-50/50">
                            <tr>
                                {view === 'daily' ? (
                                    <>
                                        <th className="pb-3 pr-2">البيان</th>
                                        <th className="pb-3">النوع</th>
                                        <th className="pb-3">الوقت</th>
                                        <th className="pb-3">المبلغ</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="pb-3 pr-2">{view === 'monthly' ? 'الشهر' : 'السنة'}</th>
                                        <th className="pb-3">عدد العمليات</th>
                                        <th className="pb-3">إجمالي المصاريف</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                             {data.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-slate-400">لا توجد سجلات لهذه الفترة</td></tr>
                            ) : (
                                data.map((item: any, idx) => {
                                    if (view === 'daily') {
                                        const exp = item as Expense;
                                        return (
                                            <tr key={exp.id} className="group hover:bg-slate-50">
                                                <td className="py-3 pr-2 font-bold">{exp.description}</td>
                                                <td>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${exp.category === 'service' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {exp.category === 'service' ? 'خدماتي' : 'مشتريات'}
                                                    </span>
                                                </td>
                                                <td className="text-xs text-slate-400" dir="ltr">{new Date(exp.date).toLocaleTimeString('ar-MA', {hour:'2-digit', minute:'2-digit'})}</td>
                                                <td className="font-black text-red-500">-{exp.amount}</td>
                                            </tr>
                                        );
                                    } else {
                                        return (
                                            <tr key={idx} className="group hover:bg-slate-50">
                                                <td className="py-3 pr-2 font-bold text-slate-700" dir="ltr">{item.date}</td>
                                                <td>{item.count} عملية</td>
                                                <td className="font-bold text-red-600 text-lg">-{item.total.toLocaleString()}</td>
                                            </tr>
                                        );
                                    }
                                })
                            )}
                        </tbody>
                     </table>
                </div>
            </Card>
        </div>
    </div>
    );
};

const FinancePage = ({ sales, expenses, user }: { sales: Sale[], expenses: Expense[], user: UserProfile }) => {
    const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalSales - totalExpenses;

    const chartData = [
        { name: 'المداخيل', amount: totalSales },
        { name: 'المصاريف', amount: totalExpenses }
    ];

    const handlePrint = () => window.print();

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="hidden lg:block w-full">
                 <PrintHeader user={user} title="التقرير المالي العام" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
                <Card className="bg-emerald-50 border-emerald-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-emerald-800 font-bold mb-1 text-sm">إجمالي المداخيل</p>
                            <p className="text-3xl font-black text-emerald-600">{totalSales.toLocaleString()}</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm"><TrendingUp size={20}/></div>
                    </div>
                </Card>
                <Card className="bg-red-50 border-red-100">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="text-red-800 font-bold mb-1 text-sm">إجمالي المصاريف</p>
                            <p className="text-3xl font-black text-red-600">{totalExpenses.toLocaleString()}</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg text-red-500 shadow-sm"><TrendingUp size={20} className="rotate-180"/></div>
                    </div>
                </Card>
                <Card className={`border ${netProfit >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
                     <div className="flex justify-between items-start">
                        <div>
                            <p className={`${netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'} font-bold mb-1 text-sm`}>الربح الصافي</p>
                            <p className={`text-3xl font-black ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{netProfit.toLocaleString()}</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm"><Calculator size={20}/></div>
                    </div>
                </Card>
            </div>

            <Card title="الرسم البياني المالي" icon={BarChart3} className="h-96 print:hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={60}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
             <div className="flex justify-end print:hidden">
                 <Button onClick={handlePrint} variant="secondary"><Printer size={18}/> طباعة التقرير</Button>
             </div>
        </div>
    );
};

const InventoryPage = ({ inventory, onUpdateInventory }: { inventory: Product[], onUpdateInventory: (n: string, q: number) => void }) => {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(name && qty) {
      onUpdateInventory(name, Number(qty));
      setName(''); setQty('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="إدارة المخزون" icon={Package}>
         <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="اسم المنتج" value={name} onChange={(e:any)=>setName(e.target.value)} required placeholder="مثال: زيت زيتون" />
            <Input label="الكمية المضافة/المسحوبة" type="number" value={qty} onChange={(e:any)=>setQty(e.target.value)} required placeholder="10 (استخدم - للنقصان)" />
            <Button type="submit" className="w-full">تحديث المخزون</Button>
         </form>
      </Card>
      <Card title="حالة المستودع" className="md:col-span-2" icon={Package}>
         <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                    <tr><th className="p-3 pr-4">المنتج</th><th className="p-3">الكمية الحالية</th><th className="p-3">الحالة</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {inventory.map((p, i) => (
                        <tr key={i} className="group hover:bg-slate-50">
                            <td className="p-3 pr-4 font-bold text-slate-700">{p.name}</td>
                            <td className="p-3 font-mono text-emerald-600 font-bold" dir="ltr">{p.quantity}</td>
                            <td className="p-3">
                                {p.quantity < 10 ? 
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><AlertCircle size={10}/> منخفض</span> : 
                                    <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><CheckCircle size={10}/> متوفر</span>
                                }
                            </td>
                        </tr>
                    ))}
                    {inventory.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-slate-400">المخزون فارغ</td></tr>}
                </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

const MeetingsPage = ({ meetings, setMeetings, user }: { meetings: Meeting[], setMeetings: any, user: UserProfile }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [participants, setParticipants] = useState('');
    const [notes, setNotes] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setMeetings([...meetings, { id: Date.now().toString(), title, date, participants, notes }]);
        setTitle(''); setDate(''); setParticipants(''); setNotes('');
    };

    const handleSummarize = async () => {
        if(meetings.length === 0) return;
        setLoading(true);
        const text = meetings.map(m => `عنوان: ${m.title} - تاريخ: ${m.date} - ملاحظات: ${m.notes}`).join('\n\n');
        const summary = await summarizeMeetings(text);
        setAiSummary(summary);
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="توثيق اجتماع جديد" icon={Calendar}>
                <form onSubmit={handleAdd} className="space-y-4">
                    <Input label="موضوع الاجتماع" value={title} onChange={(e:any)=>setTitle(e.target.value)} required />
                    <Input label="التاريخ" type="date" value={date} onChange={(e:any)=>setDate(e.target.value)} required />
                    <Input label="الحاضرون" value={participants} onChange={(e:any)=>setParticipants(e.target.value)} placeholder="فلان، فلان..." />
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5">محضر الاجتماع / القرارات</label>
                        <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 h-32 focus:border-emerald-500 outline-none" placeholder="اكتب أهم النقاط..."></textarea>
                    </div>
                    <Button type="submit" className="w-full">حفظ المحضر</Button>
                </form>
            </Card>

            <div className="space-y-6">
                <Card title="توليد التقرير الأدبي (AI)" icon={FileText} className="!bg-purple-50 border-purple-100">
                    <p className="text-sm text-purple-800 mb-4 font-medium">استخدم الذكاء الاصطناعي لصياغة التقرير الأدبي السنوي بناءً على جميع الاجتماعات المسجلة في النظام.</p>
                    <Button onClick={handleSummarize} isLoading={loading} className="w-full bg-purple-600 hover:bg-purple-700 shadow-purple-200 !shadow-lg">
                         {loading ? 'جاري التحليل والصياغة...' : 'توليد التقرير الأدبي'} <Wand2 size={16}/>
                    </Button>
                    {aiSummary && (
                        <div className="mt-4 bg-white p-6 rounded-xl border border-purple-100 whitespace-pre-wrap text-sm leading-relaxed max-h-80 overflow-y-auto shadow-inner relative">
                             <button onClick={()=>navigator.clipboard.writeText(aiSummary)} className="absolute top-2 left-2 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500"><ClipboardList size={14}/></button>
                            {aiSummary}
                        </div>
                    )}
                </Card>

                <Card title="أرشيف الاجتماعات" icon={ClipboardList} className="max-h-[500px] overflow-y-auto">
                    {meetings.length === 0 && <p className="text-center text-slate-400 py-8">لا توجد اجتماعات مسجلة</p>}
                    {meetings.map(m => (
                        <div key={m.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 mb-4 last:mb-0 group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                            <h4 className="font-bold text-slate-800">{m.title}</h4>
                            <p className="text-xs text-slate-500 mb-2 flex items-center gap-2"><Calendar size={12}/> {m.date} | <Users size={12}/> {m.participants}</p>
                            <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-lg group-hover:bg-white">{m.notes}</p>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};

const ImageGeneratorPage = ({ setMarketingContent }: { setMarketingContent: any }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [refImage, setRefImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await generateMarketingImage(prompt, refImage || undefined);
            setResult(res);
            if(res) setMarketingContent((prev:any) => ({ ...prev, image: res }));
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء التوليد. الرجاء المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setRefImage(base64);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <Card className="lg:col-span-1 h-full overflow-y-auto" title="استوديو الصور (AI)" icon={ImageIcon}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5">وصف المشهد (Prompt)</label>
                        <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 h-32 focus:border-emerald-500 outline-none resize-none" placeholder="صف الصورة التي تريد..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5">صورة مرجعية (اختياري)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            {refImage ? (
                                <div className="relative h-32 w-full">
                                    <img src={refImage} className="h-full w-full object-contain" />
                                    <button onClick={(e)=>{e.preventDefault(); setRefImage(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
                                </div>
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center gap-2">
                                    <UploadCloud size={32}/>
                                    <span className="text-xs">اضغط لرفع صورة</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button onClick={handleGenerate} isLoading={loading} className="w-full">
                        {loading ? 'جاري التوليد...' : 'توليد الصورة'} <Wand2 size={18} />
                    </Button>
                </div>
            </Card>

            <div className="lg:col-span-2 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner min-h-[400px]">
                <div className="absolute inset-0 opacity-50" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                
                {loading ? (
                    <div className="text-center text-slate-600 space-y-4 z-10">
                        <Loader2 size={48} className="animate-spin mx-auto text-emerald-500" />
                        <p className="animate-pulse font-mono">الذكاء الاصطناعي يرسم الآن...</p>
                    </div>
                ) : result ? (
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                         <img src={result} className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white" />
                         <div className="absolute bottom-8 flex gap-4">
                             <a href={result} download={`generated-image-${Date.now()}`} className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-lg border border-slate-200"><Download size={18}/> تحميل</a>
                         </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-400 z-10">
                        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                             <ImageIcon size={40} className="opacity-50 text-slate-500"/>
                        </div>
                        <p>المساحة جاهزة لعرض إبداعاتك</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MembersPage = ({ members, setMembers }: { members: Member[], setMembers: any }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('employee');
    const [phone, setPhone] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setMembers([...members, { id: Date.now().toString(), name, role, phone }]);
        setName(''); setPhone('');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="إضافة عضو جديد" icon={Users}>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm mb-4">
                    <p className="font-bold mb-1">هام:</p>
                    <p>تسجيل رقم الهاتف ضروري لربط العضو بنظام المراسلة والمكالمات في غرفة الفريق.</p>
                </div>
                <form onSubmit={handleAdd} className="space-y-4">
                    <Input label="الاسم الكامل" value={name} onChange={(e:any)=>setName(e.target.value)} required />
                    <Input label="رقم الهاتف (للتواصل)" value={phone} onChange={(e:any)=>setPhone(e.target.value)} required icon={Phone} placeholder="+212 6..." dir="ltr" className="text-right" />
                    <Select label="الصفة" value={role} onChange={(e:any)=>setRole(e.target.value)} options={[{value:'partner', label:'شريك (Partner)'}, {value:'employee', label:'أجير (Employee)'}]} />
                    <Button type="submit" className="w-full">تسجيل العضو</Button>
                </form>
            </Card>
            <Card title="قائمة الأعضاء" icon={Users}>
                <div className="space-y-2">
                    {members.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${m.role==='partner'?'bg-purple-500':'bg-blue-500'}`}>{m.name.charAt(0)}</div>
                                <div>
                                    <p className="font-bold text-slate-800">{m.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10}/> {m.phone}</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <span className={`text-[10px] px-2 py-1 rounded font-bold ${m.role==='partner'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>{m.role === 'partner' ? 'شريك' : 'مستخدم'}</span>
                            </div>
                        </div>
                    ))}
                    {members.length === 0 && <p className="text-center text-slate-400 py-6">لا يوجد أعضاء مسجلين</p>}
                </div>
            </Card>
        </div>
    );
};

const TeamChatPage = ({ user, members, messages, setMessages }: { user: UserProfile, members: Member[], messages: any[], setMessages: any }) => {
    const [msg, setMsg] = useState('');
    const [activeMember, setActiveMember] = useState<Member | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if(!msg.trim() || !activeMember) return;
        
        // Add message with recipient ID (simulating internal chat with that member)
        setMessages([...messages, { 
            id: Date.now(), 
            sender: user.fullName || 'Admin', 
            recipientId: activeMember.id, // Store who this message is for
            text: msg, 
            time: new Date().toISOString(), 
            isMe: true 
        }]);
        setMsg('');
    };

    // Filter messages for the active conversation
    const activeMessages = activeMember 
        ? messages.filter(m => m.recipientId === activeMember.id || m.senderId === activeMember.id) 
        : [];

    useEffect(() => {
        if(listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [activeMessages, activeMember]);

    return (
        <Card className="h-[calc(100vh-140px)] flex flex-col !p-0 overflow-hidden" title="غرفة الفريق">
             <div className="flex h-full">
                 {/* Sidebar List */}
                 <div className="w-1/3 border-l border-slate-100 bg-slate-50/50 flex flex-col">
                     <div className="p-4 border-b border-slate-100">
                         <h4 className="font-bold text-slate-700 mb-2">الأعضاء</h4>
                         <div className="relative">
                             <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
                             <input className="w-full bg-white border rounded-lg py-2 pr-10 pl-2 text-sm outline-none focus:border-emerald-500" placeholder="بحث..." />
                         </div>
                     </div>
                     <div className="overflow-y-auto flex-1">
                         {members.map(m => (
                             <div 
                                key={m.id} 
                                onClick={() => setActiveMember(m)}
                                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-white flex items-center gap-3 ${activeMember?.id === m.id ? 'bg-white border-r-4 border-r-emerald-500' : ''}`}
                             >
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${m.role==='partner'?'bg-purple-500':'bg-blue-500'}`}>
                                     {m.name.charAt(0)}
                                 </div>
                                 <div className="overflow-hidden">
                                     <p className="font-bold text-slate-800 text-sm truncate">{m.name}</p>
                                     <p className="text-xs text-slate-500 font-mono truncate" dir="ltr">{m.phone}</p>
                                 </div>
                             </div>
                         ))}
                         {members.length === 0 && <div className="p-4 text-center text-xs text-slate-400">لا يوجد أعضاء. أضفهم من صفحة الأعضاء.</div>}
                     </div>
                 </div>

                 {/* Chat Area */}
                 <div className="flex-1 flex flex-col bg-white">
                     {activeMember ? (
                         <>
                             {/* Active Chat Header */}
                             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                 <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${activeMember.role==='partner'?'bg-purple-500':'bg-blue-500'}`}>
                                         {activeMember.name.charAt(0)}
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-slate-800">{activeMember.name}</h3>
                                         <p className="text-xs text-slate-500 flex items-center gap-1"><span className={`w-2 h-2 rounded-full bg-green-500 inline-block`}></span> متصل (داخلي)</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-2">
                                     <a href={`tel:${activeMember.phone}`} className="p-2 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 transition-colors" title="اتصال هاتفي">
                                         <PhoneCall size={20}/>
                                     </a>
                                     <a href={`https://wa.me/${activeMember.phone.replace(/\s+/g, '').replace('+', '')}`} target="_blank" rel="noreferrer" className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors flex items-center gap-1 font-bold text-sm px-4" title="فتح واتساب">
                                         <MessageCircle size={20}/> واتساب
                                     </a>
                                 </div>
                             </div>

                             {/* Messages Area */}
                             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50" ref={listRef}>
                                 {activeMessages.length === 0 && (
                                     <div className="text-center text-slate-400 mt-10">
                                         <p className="text-sm">ابدأ المحادثة مع {activeMember.name}</p>
                                         <p className="text-xs mt-1">هذه المحادثة مخزنة داخل التطبيق</p>
                                     </div>
                                 )}
                                 {activeMessages.map((m:any) => (
                                     <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                                         <div className={`max-w-[70%] p-3 rounded-2xl ${m.isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 rounded-bl-none text-slate-800'}`}>
                                             <p className="text-sm">{m.text}</p>
                                             <p className={`text-[10px] mt-1 text-right ${m.isMe ? 'text-emerald-100' : 'text-slate-400'}`}>{new Date(m.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             {/* Input Area */}
                             <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                                 <input value={msg} onChange={(e)=>setMsg(e.target.value)} className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 focus:ring-2 ring-emerald-500 outline-none transition-all" placeholder="اكتب رسالة داخلية..." />
                                 <Button type="submit" className="!w-12 !h-12 !p-0 rounded-xl flex items-center justify-center"><Send size={20} className={document.dir==='rtl'?'rotate-180':''}/></Button>
                             </form>
                         </>
                     ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60">
                             <MessageSquare size={64} strokeWidth={1} className="mb-4"/>
                             <p className="text-lg font-medium">اختر عضواً لبدء المحادثة</p>
                             <p className="text-sm">أو للتواصل عبر الهاتف/واتساب</p>
                         </div>
                     )}
                 </div>
             </div>
        </Card>
    );
};

const SocialPage = ({ user, socialLinks, setSocialLinks, marketingContent, setMarketingContent }: any) => {
    const [platform, setPlatform] = useState('Instagram');
    const [context, setContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedCaption, setGeneratedCaption] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        const caption = await generatePostCaption(context, platform, 'image', marketingContent?.image);
        setGeneratedCaption(caption);
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="إعدادات التواصل الاجتماعي" icon={Share2}>
                <div className="space-y-4">
                     <Input icon={Facebook} label="Facebook Link" value={socialLinks.facebook} onChange={(e:any)=>setSocialLinks({...socialLinks, facebook:e.target.value})} placeholder="https://facebook.com/..." />
                     <Input icon={Instagram} label="Instagram Link" value={socialLinks.instagram} onChange={(e:any)=>setSocialLinks({...socialLinks, instagram:e.target.value})} placeholder="https://instagram.com/..." />
                     <Input icon={Youtube} label="Youtube Channel" value={socialLinks.youtube} onChange={(e:any)=>setSocialLinks({...socialLinks, youtube:e.target.value})} placeholder="https://youtube.com/..." />
                     <Button className="w-full">حفظ الروابط</Button>
                </div>
            </Card>

            <Card title="مولد المحتوى (AI Caption)" icon={Wand2}>
                <div className="space-y-4">
                    <Select label="المنصة" value={platform} onChange={(e:any)=>setPlatform(e.target.value)} options={[{value:'Facebook', label:'Facebook'}, {value:'Instagram', label:'Instagram'}, {value:'TikTok', label:'TikTok'}]} />
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5">عن ماذا تريد أن تتحدث؟</label>
                        <textarea value={context} onChange={(e)=>setContext(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 h-24 focus:border-emerald-500 outline-none" placeholder="مثال: تخفيضات بنسبة 50% على المنتجات الصيفية..."></textarea>
                    </div>
                    <Button onClick={handleGenerate} isLoading={loading} className="w-full" variant="primary">كتابة المنشور</Button>
                    
                    {generatedCaption && (
                        <div className="mt-4 p-4 bg-slate-50 border rounded-xl relative group">
                            <p className="whitespace-pre-wrap text-sm">{generatedCaption}</p>
                            <button onClick={()=>{navigator.clipboard.writeText(generatedCaption)}} className="absolute top-2 left-2 p-2 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-emerald-600" title="نسخ"><ClipboardList size={16}/></button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

const ConsultantPage = ({ user }: { user: UserProfile }) => {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<{role:'user'|'ai', text:string}[]>([]);
    const [loading, setLoading] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!query.trim()) return;
        const q = query;
        setQuery('');
        setHistory(prev => [...prev, {role:'user', text:q}]);
        setLoading(true);
        
        const answer = await generateBusinessAdvice(q, user.country);
        
        setHistory(prev => [...prev, {role:'ai', text: answer}]);
        setLoading(false);
    };
    
    useEffect(() => {
        if(listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [history]);

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="bg-emerald-800 text-white p-4 flex items-center gap-3">
                 <div className="p-2 bg-emerald-500 rounded-lg"><MessageSquare size={20}/></div>
                 <div>
                     <h3 className="font-bold">المستشار الذكي</h3>
                     <p className="text-xs text-emerald-100">خبير أعمال متخصص في السوق العربي</p>
                 </div>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50" ref={listRef}>
                 {history.length === 0 && (
                     <div className="text-center space-y-4 mt-10">
                         <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><MessageSquare size={32}/></div>
                         <h3 className="text-xl font-bold text-slate-800">كيف يمكنني مساعدتك اليوم؟</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg mx-auto">
                             <button onClick={()=>setQuery('كيف أزيد مبيعاتي في موسم الأعياد؟')} className="text-sm p-3 bg-white border hover:border-emerald-500 rounded-xl transition-all">كيف أزيد مبيعاتي في موسم الأعياد؟</button>
                             <button onClick={()=>setQuery('أفضل طريقة لتسعير المنتجات اليدوية')} className="text-sm p-3 bg-white border hover:border-emerald-500 rounded-xl transition-all">أفضل طريقة لتسعير المنتجات؟</button>
                         </div>
                     </div>
                 )}
                 {history.map((msg, i) => (
                     <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'}`}>
                             {msg.role === 'ai' && <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-xs"><Star size={12}/> المستشار</div>}
                             <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                         </div>
                     </div>
                 ))}
                 {loading && <div className="flex justify-start"><div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div></div></div>}
             </div>
             <form onSubmit={handleAsk} className="p-4 bg-white border-t border-slate-100">
                 <div className="relative">
                    <input value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full bg-slate-100 border-2 border-transparent focus:border-emerald-500 rounded-xl py-3 pl-12 pr-4 outline-none transition-all" placeholder="اطلب نصيحة، خطة تسويقية، أو استفسار قانوني..." disabled={loading} />
                    <button type="submit" disabled={loading || !query.trim()} className="absolute left-2 top-2 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ArrowRight size={20} className={document.dir==='rtl'?'rotate-180':''}/></button>
                 </div>
             </form>
        </div>
    );
};

const LoginPage = ({ user, setUser, handleLogin, lang, setLang }: any) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    // Initialize with safe defaults to prevent undefined errors in validation
    const [formData, setFormData] = useState<UserProfile>({
        fullName: '',
        companyName: '',
        projectType: '',
        country: 'Morocco',
        city: '',
        address: '',
        phone: '',
        email: '',
        password: ''
    });
    const [selectedCountry, setSelectedCountry] = useState('Morocco');
    const [isSaving, setIsSaving] = useState(false);
    const [errorField, setErrorField] = useState<string | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setIsLoginMode(true);
            try {
                setFormData(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        } else {
            setIsLoginMode(false);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorField(null);
        
        if (!isLoginMode) {
            // Strict Validation for Registration
            const requiredFields: (keyof UserProfile)[] = ['projectType', 'companyName', 'fullName', 'country', 'city', 'address', 'phone', 'email', 'password'];
            
            for (const field of requiredFields) {
                if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
                    setErrorField(field);
                    alert(`عذراً، حقل "${field}" إلزامي. جميع المعلومات ضرورية للتسجيل.`);
                    return;
                }
            }
        }

        if (!isLoginMode) {
            setIsSaving(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setUser(formData);
            localStorage.setItem('user', JSON.stringify(formData));
            setIsSaving(false);
        } else {
            if(!formData.password) {
                 setErrorField('password');
                 alert("يرجى إدخال كلمة المرور");
                 return;
            }
            // Ensure we use the loaded data + password
            setUser(formData);
        }
        
        handleLogin(e);
    };

    const updateForm = (key: string, val: any) => {
        setFormData({ ...formData, [key]: val });
        if (errorField === key) setErrorField(null);
    };

    const currentCountryData = COUNTRIES_DATA[selectedCountry];

    if (isSaving) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 p-4" dir={lang === AppLanguage.AR ? 'rtl' : 'ltr'}>
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <HardDrive size={32} className="text-emerald-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-2">جاري حفظ البيانات...</h2>
                <p className="text-slate-500 text-center max-w-md">يتم الآن تأمين معلوماتك وإرسال نسخة احتياطية إلى Google Drive الخاص بك.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden isolate" dir={lang === AppLanguage.AR ? 'rtl' : 'ltr'}>
             {/* Background Image */}
             <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-40" alt="Office Background" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 backdrop-blur-[2px]"></div>
             </div>

             {/* Background Effects */}
             <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] z-0 animate-pulse"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] z-0 animate-pulse delay-1000"></div>

             <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl flex overflow-hidden min-h-[650px] relative z-10 border border-white/20">
                 {/* Left Side (Image - Desktop Only) */}
                 <div className="hidden lg:flex w-2/5 bg-slate-100 flex-col items-center justify-center p-12 relative text-center border-l border-slate-200">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale opacity-10"></div>
                      <Logo className="w-40 mb-8 relative z-10" />
                      <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight relative z-10">منصة الإدارة الذكية <br/> <span className="text-emerald-600">للتعاونيات والمقاولات</span></h1>
                      <p className="text-slate-600 text-lg mb-8 max-w-sm relative z-10">حل متكامل يجمع بين المحاسبة، إدارة الفريق، والذكاء الاصطناعي لنمو مشروعك.</p>
                      
                      <div className="grid grid-cols-2 gap-4 w-full max-w-sm relative z-10">
                          <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2"><Briefcase className="text-emerald-500" size={24}/><p className="font-bold text-sm">إدارة شاملة</p></div>
                          <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2"><Wand2 className="text-purple-500" size={24}/><p className="font-bold text-sm">ذكاء اصطناعي</p></div>
                      </div>
                 </div>

                 {/* Right Side (Form) */}
                 <div className="w-full lg:w-3/5 p-6 md:p-12 overflow-y-auto max-h-[100vh]">
                      <div className="lg:hidden flex justify-center mb-6">
                          <Logo variant="light" className="w-32" />
                      </div>

                      <div className="flex justify-between items-center mb-8">
                          <div>
                              <h2 className="text-3xl font-black text-slate-800">{isLoginMode ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}</h2>
                              <p className="text-slate-500 mt-1">{isLoginMode ? 'أدخل كلمة المرور للمتابعة' : 'أدخل كافة بيانات مؤسستك للبدء'}</p>
                          </div>
                          <button 
                              onClick={() => setLang(lang === AppLanguage.AR ? AppLanguage.EN : AppLanguage.AR)}
                              className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors flex items-center gap-2"
                          >
                              <Globe size={18}/> <span className="text-xs font-bold uppercase">{lang}</span>
                          </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                          {!isLoginMode && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4">
                                  <div className="md:col-span-2">
                                      <Select 
                                        label="نوع المشروع" 
                                        value={formData.projectType || ''} 
                                        onChange={(e:any)=>updateForm('projectType', e.target.value)} 
                                        options={PROJECT_TYPES.map(t => ({value: t.value, label: lang === 'ar' ? t.labelAr : t.labelEn}))} 
                                        required 
                                        icon={Building2} 
                                        error={errorField === 'projectType'}
                                      />
                                  </div>
                                  
                                  <Input label="اسم المشروع / التعاونية" value={formData.companyName} onChange={(e:any)=>updateForm('companyName', e.target.value)} required icon={Briefcase} placeholder="اسم المقاولة الرسمي" error={errorField === 'companyName'} />
                                  <Input label="الاسم الكامل للمسير (اسم المستخدم)" value={formData.fullName} onChange={(e:any)=>updateForm('fullName', e.target.value)} required icon={User} placeholder="اسمك الكامل" error={errorField === 'fullName'} />

                                  <Select 
                                    label="الدولة" 
                                    value={selectedCountry} 
                                    onChange={(e:any)=>{setSelectedCountry(e.target.value); updateForm('country', e.target.value);}} 
                                    options={Object.keys(COUNTRIES_DATA).map(k => ({value: k, label: lang === 'ar' ? COUNTRIES_DATA[k].ar : COUNTRIES_DATA[k].en}))} 
                                    icon={Globe} 
                                    required 
                                    error={errorField === 'country'}
                                  />
                                  <Select 
                                    label="المدينة" 
                                    value={formData.city} 
                                    onChange={(e:any)=>updateForm('city', e.target.value)} 
                                    options={currentCountryData?.cities?.map(c => ({value: c.ar, label: lang === 'ar' ? c.ar : c.en})) || []} 
                                    disabled={!selectedCountry} 
                                    icon={MapPin} 
                                    required 
                                    error={errorField === 'city'}
                                  />

                                  <div className="md:col-span-2">
                                      <Input label="العنوان المحلي لمقر المقاولة" value={formData.address} onChange={(e:any)=>updateForm('address', e.target.value)} required icon={MapPin} placeholder="رقم المتجر، الشارع، الحي..." error={errorField === 'address'} />
                                  </div>

                                  <Input label="رقم الهاتف" value={formData.phone} onChange={(e:any)=>updateForm('phone', e.target.value)} required icon={Phone} dir="ltr" className="text-right" error={errorField === 'phone'} />
                                  <Input label="البريد الإلكتروني" type="email" value={formData.email} onChange={(e:any)=>updateForm('email', e.target.value)} required icon={Mail} dir="ltr" placeholder="example@gmail.com" error={errorField === 'email'} />
                              </div>
                          )}

                          {isLoginMode && (
                              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                                  {formData.companyName ? formData.companyName.charAt(0) : 'U'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">{formData.companyName || 'المستخدم'}</p>
                                  <p className="text-sm text-slate-500">{formData.projectType === 'cooperative' ? 'تعاونية' : 'مقاولة'}</p>
                                </div>
                              </div>
                          )}

                          <Input label="كلمة المرور" type="password" value={formData.password} onChange={(e:any)=>updateForm('password', e.target.value)} required icon={Lock} placeholder="********" error={errorField === 'password'} />
                          
                          <Button type="submit" className="w-full py-4 text-lg mt-6 shadow-xl shadow-emerald-500/20">{isLoginMode ? 'دخول' : 'تسجيل البيانات'}</Button>
                          
                          <div className="text-center mt-6">
                              <button 
                                  type="button" 
                                  onClick={() => { 
                                      setIsLoginMode(!isLoginMode); 
                                      if(isLoginMode) {
                                          // Switching to Register: Reset form for fresh entry
                                          setFormData({
                                              fullName: '', companyName: '', projectType: '', 
                                              country: 'Morocco', city: '', address: '', 
                                              phone: '', email: '', password: ''
                                          });
                                          setSelectedCountry('Morocco');
                                      } else {
                                          // Switching back to Login: Try to reload saved user if exists
                                          const savedUser = localStorage.getItem('user');
                                          if (savedUser) setFormData(JSON.parse(savedUser));
                                      }
                                  }} 
                                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
                              >
                                  {isLoginMode ? 'ليس لديك حساب؟ سجل مقاولتك الآن' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
                              </button>
                          </div>
                      </form>
                 </div>
             </div>
        </div>
    );
};

const VideoGeneratorPage = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [imageInput, setImageInput] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            if (window.aistudio && window.aistudio.hasSelectedApiKey) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                if (!hasKey) {
                    await window.aistudio.openSelectKey();
                }
            }
            const url = await generateMarketingVideo(prompt, imageInput || undefined);
            if (url) {
                const finalUrl = `${url}&key=${process.env.API_KEY}`;
                setVideoUrl(finalUrl);
            }
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء إنشاء الفيديو.");
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setImageInput(base64);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card title="استوديو الفيديو (AI Video)" icon={Video}>
                <div className="space-y-6">
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-purple-900 text-sm">
                        <p className="font-bold flex items-center gap-2"><Star size={16}/> ملاحظة هامة:</p>
                        <p>توليد الفيديو يتطلب استخدام مفتاح API مدفوع (Google Cloud Project) لأن نموذج Veo متقدم.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">وصف الفيديو</label>
                        <textarea 
                            value={prompt} 
                            onChange={(e) => setPrompt(e.target.value)} 
                            className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-emerald-500 outline-none h-32"
                            placeholder="صف الفيديو الذي تريد إنشاءه بدقة..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">صورة مرجعية (اختياري)</label>
                        <div className="flex items-center gap-4">
                            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2">
                                <UploadCloud size={20}/> رفع صورة
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            {imageInput && (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                                    <img src={imageInput} className="w-full h-full object-cover" />
                                    <button onClick={() => setImageInput(null)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"><X size={12}/></button>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button onClick={handleGenerate} isLoading={loading} className="w-full" variant="primary">
                        {loading ? 'جاري إنشاء الفيديو (قد يستغرق بضع دقائق)...' : 'إنشاء الفيديو'}
                    </Button>
                    {videoUrl && (
                        <div className="mt-8">
                            <h3 className="font-bold text-slate-800 mb-4">الفيديو الناتج:</h3>
                            <video controls className="w-full rounded-xl shadow-lg bg-black aspect-video" src={videoUrl}></video>
                            <a href={videoUrl} download className="block text-center mt-2 text-emerald-600 hover:underline">تحميل الفيديو</a>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState<AppLanguage>(AppLanguage.AR);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // State for PWA install prompt
  
  // Data States
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ facebook: '', instagram: '', youtube: '', tiktok: '' });
  const [marketingContent, setMarketingContent] = useState<any>(null);

  // Initialize from LocalStorage with error handling
  useEffect(() => {
    const safeParse = (key: string, fallback: any = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.error(`Error parsing ${key} from localStorage`, e);
            return fallback;
        }
    };

    const savedUser = safeParse('user');
    if (savedUser) setUser(savedUser);
    
    setSales(safeParse('sales', []));
    setExpenses(safeParse('expenses', []));
    setInventory(safeParse('inventory', []));
    setMeetings(safeParse('meetings', []));
    setMembers(safeParse('members', []));
  }, []);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  // Save to LocalStorage on change
  useEffect(() => { if(sales.length) localStorage.setItem('sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { if(expenses.length) localStorage.setItem('expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { if(inventory.length) localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { if(meetings.length) localStorage.setItem('meetings', JSON.stringify(meetings)); }, [meetings]);
  useEffect(() => { if(members.length) localStorage.setItem('members', JSON.stringify(members)); }, [members]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // User is already set in LoginPage via setUser, just need to re-render or handle post-login logic if any
    // Logic is handled in LoginPage mostly
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setActiveTab('home');
  };

  const addSale = (productName: string, price: number, quantity: number) => {
    const newSale: Sale = {
      id: Date.now().toString(),
      productName,
      price,
      quantity,
      total: price * quantity,
      date: new Date().toISOString()
    };
    setSales([newSale, ...sales]);
    alert("تم حفظ عملية البيع بنجاح ✅");
  };

  const addExpense = (description: string, amount: number, category: 'service' | 'purchase') => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      category,
      date: new Date().toISOString()
    };
    setExpenses([newExpense, ...expenses]);
    alert("تم حفظ المصروف بنجاح ✅");
  };

  if (!user) {
    return <LoginPage user={user || {}} setUser={setUser} handleLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardHome user={user} setActiveTab={setActiveTab} />;
      case 'sales': return <SalesPage sales={sales} onAddSale={addSale} user={user} />;
      case 'expenses': return <ExpensePage expenses={expenses} onAddExpense={addExpense} user={user} />;
      case 'finance': return <FinancePage sales={sales} expenses={expenses} user={user} />;
      case 'inventory': return <InventoryPage inventory={inventory} onUpdateInventory={(n,q)=>{ const i = inventory.findIndex(p=>p.name===n); if(i>-1){ const copy=[...inventory]; copy[i].quantity+=q; setInventory(copy); } else { setInventory([...inventory, {id:Date.now().toString(), name:n, quantity:q}]); } alert("تم تحديث المخزون ✅"); }} />;
      case 'meetings': return <MeetingsPage meetings={meetings} setMeetings={setMeetings} user={user} />;
      case 'chat': return <TeamChatPage user={user} members={members} messages={messages} setMessages={setMessages} />;
      case 'members': return <MembersPage members={members} setMembers={setMembers} />;
      case 'social': return <SocialPage user={user} socialLinks={socialLinks} setSocialLinks={setSocialLinks} marketingContent={marketingContent} setMarketingContent={setMarketingContent} />;
      case 'consultant': return <ConsultantPage user={user} />;
      case 'video': return <VideoGeneratorPage />;
      case 'image': return <ImageGeneratorPage setMarketingContent={setMarketingContent} />;
      default: return <DashboardHome user={user} setActiveTab={setActiveTab} />;
    }
  };
  
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans" dir={lang === AppLanguage.AR ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`bg-white text-slate-600 transition-all duration-300 flex flex-col border-r border-slate-200 ${isSidebarOpen ? 'w-64' : 'w-20'} print:hidden shadow-lg shadow-slate-200/50 z-30`}>
        <div className="p-4 flex justify-between items-center border-b border-slate-100">
           {isSidebarOpen && <Logo variant="light" className="w-10" />}
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
           <SidebarItem icon={LayoutDashboard} label="الرئيسية" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} isOpen={isSidebarOpen} />
           <SidebarItem icon={ShoppingCart} label="المبيعات" isActive={activeTab === 'sales'} onClick={() => setActiveTab('sales')} isOpen={isSidebarOpen} />
           <SidebarItem icon={Wallet} label="المصاريف" isActive={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} isOpen={isSidebarOpen} />
           <SidebarItem icon={FileBarChart} label="المالية" isActive={activeTab === 'finance'} onClick={() => setActiveTab('finance')} isOpen={isSidebarOpen} />
           <SidebarItem icon={Package} label="المخزون" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} isOpen={isSidebarOpen} />
           <div className="my-4 border-t border-slate-100 mx-4"></div>
           <SidebarItem icon={ClipboardList} label="الاجتماعات" isActive={activeTab === 'meetings'} onClick={() => setActiveTab('meetings')} isOpen={isSidebarOpen} />
           <SidebarItem icon={Users} label="الأعضاء" isActive={activeTab === 'members'} onClick={() => setActiveTab('members')} isOpen={isSidebarOpen} />
           <SidebarItem icon={MessageCircle} label="غرفة الفريق" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} isOpen={isSidebarOpen} />
           <div className="my-4 border-t border-slate-100 mx-4"></div>
           <SidebarItem icon={Share2} label="التسويق والنشر" isActive={activeTab === 'social'} onClick={() => setActiveTab('social')} isOpen={isSidebarOpen} />
           <SidebarItem icon={Video} label="فيديو AI" isActive={activeTab === 'video'} onClick={() => setActiveTab('video')} isOpen={isSidebarOpen} />
           <SidebarItem icon={ImageIcon} label="صور AI" isActive={activeTab === 'image'} onClick={() => setActiveTab('image')} isOpen={isSidebarOpen} />
           <SidebarItem icon={MessageSquare} label="المستشار الذكي" isActive={activeTab === 'consultant'} onClick={() => setActiveTab('consultant')} isOpen={isSidebarOpen} />
        </div>

        <div className="p-4 border-t border-slate-100">
           {deferredPrompt && (
              <button onClick={handleInstallClick} className={`flex items-center gap-3 w-full p-2 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors mb-2 ${!isSidebarOpen && 'justify-center'}`}>
                  <Download size={20} />
                  {isSidebarOpen && <span className="font-bold">تثبيت التطبيق</span>}
              </button>
           )}
           <button onClick={handleLogout} className={`flex items-center gap-3 w-full p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors ${!isSidebarOpen && 'justify-center'}`}>
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-bold">تسجيل الخروج</span>}
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden h-screen bg-[#f8fafc]">
         {/* Header */}
         <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shadow-sm print:hidden z-20">
            <div>
               <h2 className="text-xl font-black text-slate-800">{
                  activeTab === 'home' ? 'لوحة القيادة' : 
                  activeTab === 'sales' ? 'إدارة المبيعات' : 
                  activeTab === 'expenses' ? 'المصاريف والفواتير' : 
                  activeTab === 'finance' ? 'التقارير المالية' :
                  activeTab === 'inventory' ? 'إدارة المخزون' :
                  activeTab === 'meetings' ? 'محاضر الاجتماعات' :
                  activeTab === 'members' ? 'أعضاء المؤسسة' : 
                  activeTab === 'chat' ? 'تواصل الفريق' :
                  activeTab === 'consultant' ? 'الذكاء الاصطناعي' : 
                  activeTab === 'video' ? 'إنشاء فيديو' :
                  activeTab === 'image' ? 'تصميم صور' :
                  'الصفحة الرئيسية'
               }</h2>
               <p className="text-xs text-slate-500">{new Date().toLocaleDateString('ar-MA', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user.projectType === 'cooperative' ? 'تعاونية' : 'مقاولة'} نشطة
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-emerald-600 transition-colors">
                  {user.companyName.charAt(0)}
               </div>
            </div>
         </header>

         {/* Scrollable Area */}
         <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
             <div className="max-w-7xl mx-auto h-full">
                {renderContent()}
             </div>
         </main>
      </div>
    </div>
  );
};

export default App;
