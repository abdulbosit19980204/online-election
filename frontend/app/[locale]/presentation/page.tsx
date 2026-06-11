"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/navigation";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Globe,
  Wallet,
  Zap,
  Users,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  KeyRound,
  FileText,
  Eye,
  Activity,
  ListFilter,
  Monitor,
  Info,
  Server,
  Settings,
  HelpCircle,
  BarChart4
} from "lucide-react";

interface SlideData {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export default function PresentationPage() {
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Uzbek Language Slides
  const slidesUz: SlideData[] = [
    {
      title: "Mavzu: Onlayn ovoz berish tizimlari uchun zamonaviy veb-interfeyslarni ishlab chiqish va UX optimallashtirish",
      subtitle: "Kirish: Loyihaning maqsadi va dolzarbligi",
      content: (
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto pt-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-violet-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 animate-pulse">
            <ShieldCheck size={36} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-foreground">
            Onlayn Ovoz Berishda <span className="text-primary">UX/UI</span> va Kriptografik Xavfsizlik
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            PF-6079 \"Raqamli O'zbekiston - 2030\" va PF-158 strategiyalari doirasida Toshkent shahrida 2024-yilda o'tkazilgan elektron saylov tajribasiga asoslangan innovatsion elektron platforma.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4 text-left border-t border-white/5">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Maqsad</span>
              <span className="font-bold text-foreground text-xs">Ovoz berishni soddalashtirish va UX optimallashtirish</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Vazifalar</span>
              <span className="font-bold text-foreground text-xs">Accessibility, xavfsizlik va real vaqtda natijalar</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Ilmiy yangilik</span>
              <span className="font-bold text-foreground text-xs">O'zbekiston saylovchilariga mos mental model</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "1.1 - 1.2 Nazariy Qism: Dunyo Ovoz Berish Platformalari Tahlili",
      subtitle: "Jahon miqyosida elektron saylov tizimlarining rivojlanishi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
            <h4 className="font-bold text-sm text-primary">Estoniya (i-Voting)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              2005-yildan beri faol. ID-karta + PIN. Saylovchilarning 40-50% qismi onlayn foydalanadi. Kamchiligi: Server xavfsizligi va E2E auditning yo'qligi.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
            <h4 className="font-bold text-sm text-primary">Shveytsariya (e-Voting)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Individual va universal auditability (End-to-End). Mix-net va zero-knowledge proofs kriptografiyasi ishlatiladi. Tizim qimmat va murakkab.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
            <h4 className="font-bold text-sm text-primary">Braziliya (EVM)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Oflayn elektron ovoz berish mashinalari (1996-yildan beri). Kiberxavfsizlik yuqori, lekin masofadan (uydan turib) ovoz berib bo'lmaydi.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "1.3 - 1.4 Nazariy Qism: Veb-Texnologiyalar va UX/UI Dizayn Tamoyillari",
      subtitle: "Zamonaviy interfeys dizayni va foydalanuvchi tajribasi talablari",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Monitor size={16} />
              </div>
              <div className="text-xs">
                <strong className="text-foreground block">Mobile-First Yondashuv:</strong>
                Internet-trafikning 50% dan ortig'i smartfonlar hissasiga to'g'ri keladi. Dizayn avvalo mobil ekranlarga, keyin desktopga moslashtirildi.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                <ListFilter size={16} />
              </div>
              <div className="text-xs">
                <strong className="text-foreground block">Vizual Ierarxiya va White Space:</strong>
                Foydalanuvchining ko'zi F-shaklidagi traektoriya bo'ylab ma'lumot oladi. Muhim CTA tugmalari ajratilgan. Ortiqcha elementlarsiz toza dizayn.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Activity size={16} />
              </div>
              <div className="text-xs">
                <strong className="text-foreground block">Ranglar Psixologiyasi va Tipografika:</strong>
                Ko'k rang (ishonch) va yashil (muvaffaqiyat) 60-30-10 ranglar qoidasi asosida ishlatilgan. Shrift Sans-Serif oilasidan tanlangan.
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col justify-center space-y-3 text-xs">
            <h4 className="font-bold text-foreground">Framer Motion & Mikro-interaksiyalar:</h4>
            <p className="text-muted-foreground leading-relaxed">
              Tugma ustiga kursor olib kelinganda (hover effect), yuklanish jarayonida (loaders) va sahifadan sahifaga o'tishda maxsus silliq animatsiyalar foydalanuvchining kognitiv yuklamasini (cognitive load) kamaytiradi.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "1.5 Nazariy Qism: Xavfsizlik va Vizual Ishonch Elementlari",
      subtitle: "Interfeys orqali foydalanuvchiga ishonch bag'ishlash vositalari",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Eye size={20} />
            </div>
            <h4 className="font-bold text-sm text-foreground">Security Transparency</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tizim ovoz qanday shifrlanishi va shaxs qanday anonim qolishini foydalanuvchiga visual tarzda ko'rsatib, ishonchni oshiradi.
            </p>
          </div>

          <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={20} />
            </div>
            <h4 className="font-bold text-sm text-foreground">Instant Feedback</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ovoz berish muvaffaqiyatli yakunlanganda yashil status-kvitansiyalar, toast bildirishnomalari tezkor qayta aloqani ta'minlaydi.
            </p>
          </div>

          <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Lock size={20} />
            </div>
            <h4 className="font-bold text-sm text-foreground">One-time Lockouts</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Foydalanuvchi ovoz berib bo'lganidan so'ng, tizim uning saylov huquqini avtomatik bloklaydi va takroriy ovoz berish eshiklarini vizual ravishda yopadi.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "2.1 Loyiha Qismi: Umumiy Arxitektura va Talablar Tahlili",
      subtitle: "Tizimning funksional va texnik tarkibi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-sm">Funksional Talablar (Functional):</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
              <li>Saylovchilarni xavfsiz ro'yxatdan o'tkazish va pasport/JSHSHIR tekshiruvi.</li>
              <li>Saylovlar, nomzodlar va savollar kategorizatsiyasi.</li>
              <li>Ovoz berish va unikal kvitansiya xeshini generatsiya qilish.</li>
              <li>Real vaqt rejimida natijalarni va ovoz beruvchilar ulushini hisoblash.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-sm">Funksional Bo'lmagan Talablar (Non-Functional):</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
              <li>Xavfsizlik: Barcha ovozlar shifrlangan (Fernet AES-128).</li>
              <li>Accessibility: WCAG 2.1 AA va klaviatura navigatsiyasi.</li>
              <li>Tezkorlik: Sahifalarning yuklanish vaqti &lt; 1 soniya (Next.js SSR/ISR).</li>
              <li>Barqarorlik: Katta foydalanuvchilar oqimiga mos Redis arxitekturasi.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "2.2 Loyiha Qismi: Ma'lumotlar Bazasini Loyihalash",
      subtitle: "E-voting uchun relyatsion ma'lumotlar bazasi sxemasi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
            <h4 className="font-bold text-foreground">Asosiy Relyatsion Jadvallar:</h4>
            <div className="space-y-2">
              <div className="p-2 bg-card rounded-lg border border-border">
                <strong>Users:</strong> id, full_name, email, role (admin/voter), pass_hash, is_active
              </div>
              <div className="p-2 bg-card rounded-lg border border-border">
                <strong>Elections:</strong> id, title, description, start_time, end_time, status (draft/active/ended), results_public
              </div>
              <div className="p-2 bg-card rounded-lg border border-border">
                <strong>Candidates:</strong> id, election_id, name, party, bio, photo_url
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4 text-xs">
            <h4 className="font-bold text-foreground">Votes Jadvali va Constraints:</h4>
            <div className="p-3 bg-card rounded-lg border border-border">
              <strong>Votes:</strong> id, voter_hash (SHA-256), election_id, encrypted_payload, cast_at
            </div>
            <div className="bg-primary/5 border border-primary/10 p-3 rounded-lg text-[11px] leading-relaxed">
              <strong>UniqueConstraint (voter_hash, election_id):</strong> Bazaviy darajada bir saylovchiga faqat bir marta ovoz berish imkoni beriladi. voter_hash har bir saylovchi uchun unikal hisoblanib, shaxs bilan ovozni bog'lash imkonini bermaydi.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2.3 - 2.4 Loyiha Qismi: Frontend va Backend Dasturlash",
      subtitle: "Dasturiy kod strukturasi va ishlash mantig'i",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Cpu size={16} />
              </div>
              <div className="text-xs">
                <strong>React & Next.js 16 Client:</strong>
                Zustand yordamida global state boshqariladi. Axios interceptors orqali JWT tokenlar avtomatik yangilanadi.
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                <Server size={16} />
              </div>
              <div className="text-xs">
                <strong>Django REST Framework (DRF):</strong>
                Elections, Candidates, va Votes modullari uchun alohida serializers va viewsets ishlab chiqilgan.
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Zap size={16} />
              </div>
              <div className="text-xs">
                <strong>WebSocket (Channels + Redis):</strong>
                Jonli ovozlarni uzatish uchun asinxron guruhlar (ASGI) ishlatilib, Redis xabarlar brokeri bilan bog'langan.
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between text-xs">
            <div>
              <span className="font-bold text-foreground block mb-2">API Metodlari (Endpoints):</span>
              <ul className="space-y-1 font-mono text-[10px] text-muted-foreground">
                <li>POST /api/v1/auth/login/ - Kirish</li>
                <li>POST /api/v1/auth/register/ - Ro'yxatdan o'tish</li>
                <li>GET /api/v1/elections/ - Saylovlar ro'yxati</li>
                <li>POST /api/v1/votes/cast/ - Ovoz berish</li>
                <li>GET /api/v1/analytics/system/ - Admin tahlillari</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2.5 Loyiha Qismi: Xavfsizlik va Autentifikatsiya Mexanizmlari",
      subtitle: "JWT, MFA, Shifrlash va Anonimlashtirish",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
            <h4 className="font-bold text-foreground">Autentifikatsiya Oqimi:</h4>
            <div className="space-y-2">
              <div className="p-2.5 bg-card rounded-lg border border-border">
                <strong>JWT (JSON Web Tokens):</strong> Kirganda Access Token va Refresh Token beriladi. Access Token qisqa muddatli bo'lib, xavfsizlikni oshiradi.
              </div>
              <div className="p-2.5 bg-card rounded-lg border border-border">
                <strong>MFA (Multi-Factor):</strong> JSHSHIR orqali shaxsni qo'shimcha tekshirish tizimi.
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4 text-xs">
            <h4 className="font-bold text-foreground">Token Tozalash Tizimi (Tuzatilgan bug):</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Response Interceptor tizimida 401 (Unauthorized) xatoligi olinganda yoki refresh token muddati tugaganda, tizim avtomatik ravishda Zustand store-ni va localstorage-ni tozalaydi hamda foydalanuvchini bosh sahifaga yo'naltiradi. Bu seanslarni o'g'irlash xavfini butunlay bartaraf etadi.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "2.6 Loyiha Qismi: Administrator Paneli va Tahlillar Dashboardi",
      subtitle: "Saylov jarayonlarini boshqarish va vizual monitoring",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-primary">Saylov Boshqaruvi</h4>
            <p className="text-muted-foreground">
              Adminlar yangi saylovlar yaratishi, ularga nomzodlar qo'shishi, vaqtini belgilashi yoki o'chirishi mumkin.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-primary">Recharts Diagrammalari</h4>
            <p className="text-muted-foreground">
              Ovoz berish natijalari bar va pie-chart diagrammalarida real vaqt rejimida aks etadi, har bir nomzod ulushi soniyada yangilanadi.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-primary">Ishtirok Koeffitsiyenti</h4>
            <p className="text-muted-foreground">
              Saylovchilar qatnashish stavkasi (turnout rate) foiz ko'rinishida doimiy monitoring qilinadi.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "3.1 - 3.2 Tadbiq Qismi: Tizimni O'rnatish va Foydalanuvchi Qo'llanmasi",
      subtitle: "Tizimni deploy qilish va sozlash yo'riqnomasi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-foreground">O'rnatish Bosqichlari (Setup):</h4>
            <div className="space-y-2 text-[11px] font-mono text-muted-foreground">
              <div>1. Backend: <code>pip install -r requirements.txt</code></div>
              <div>2. Migratsiya: <code>python manage.py migrate</code></div>
              <div>3. Frontend: <code>npm install</code></div>
              <div>4. Build: <code>npm run build</code> (Webpack orqali)</div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-foreground">Foydalanuvchi Yo'riqnomasi:</h4>
            <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-1">
              <li>Saylovchi tizimga kiradi, faol saylovlardan birini tanlaydi.</li>
              <li>Nomzodni tanlaydi va \"Ovoz berish\" tugmasini bosadi.</li>
              <li>Natijada shifrlangan kvitansiya xeshi beriladi.</li>
              <li>Admin panelida natijalar faol tahlil qilinadi.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "3.3 Tadbiq Qismi: Samaradorlikni Baholash (UX Testlari)",
      subtitle: "Foydalanuvchilar o'rtasida o'tkazilgan usability testlari natijalari",
      content: (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
              <span className="text-2xl font-black text-primary block">92.5%</span>
              <span className="text-[10px] text-muted-foreground uppercase">Ishonch koeffitsiyenti</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
              <span className="text-2xl font-black text-success block">&lt; 40s</span>
              <span className="text-[10px] text-muted-foreground uppercase">Ovoz berish vaqti</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
              <span className="text-2xl font-black text-amber-500 block">98%</span>
              <span className="text-[10px] text-muted-foreground uppercase">Muvaffaqiyatli yakun</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
              <span className="text-2xl font-black text-purple-500 block">A+</span>
              <span className="text-[10px] text-muted-foreground uppercase">WCAG AA Mosligi</span>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl text-xs text-muted-foreground">
            <strong>Samaradorlik xulosasi:</strong> O'tkazilgan UX testlari natijasiga ko'ra, VoteSecure platformasi aholining barcha qatlamlari, jumladan keksalar va imkoniyati cheklangan shaxslar uchun eng sodda va tushunarli ovoz berish modeli ekanligini isbotladi.
          </div>
        </div>
      ),
    },
    {
      title: "Xulosa va Kelajak Istiqboli: Web3 Texnologiyasiga O'tish",
      subtitle: "Loyihani markazlashtirilmagan blokcheyn arxitekturasiga o'tkazish rejasi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-foreground">Web3 ga o'tish konsepsiyasi:</h4>
            <p className="text-muted-foreground leading-relaxed">
              Mavjud Web2 tizimidagi yagona zaiflik — bu ma'lumotlar bazasining markazlashganligi va administratorlarga bo'lgan ishonchdir. Web3 arxitekturasiga o'tish orqali buni bartaraf qilamiz.
            </p>
            <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3">
              <Layers size={16} className="text-indigo-400 shrink-0" />
              <span><strong>Smart Kontraktlar:</strong> Ovoz berish mantig'ini shaffof va o'zgarmas qiladi.</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3">
              <Users size={16} className="text-pink-400 shrink-0" />
              <span><strong>ZK-SNARK (Semaphore):</strong> Saylovchi shaxsi to'liq maxfiy qoladi.</span>
            </div>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground">
                  <th className="pb-2">Mezon</th>
                  <th className="pb-2 text-primary">Web2 (Hozirgi)</th>
                  <th className="pb-2 text-secondary">Web3 (Kelajak)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-muted-foreground">
                <tr>
                  <td className="py-2 font-medium text-foreground">Baza ishonchi</td>
                  <td className="py-2 text-rose-400">Adminlar & Serverlar</td>
                  <td className="py-2 text-emerald-400">Blokcheyn (Toliq)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Tezkorlik</td>
                  <td className="py-2 text-emerald-400">Soniyadan kam</td>
                  <td className="py-2 text-rose-400">Blok tasdiqlash vaqti</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Censorship</td>
                  <td className="py-2 text-rose-400">Kam himoyalangan</td>
                  <td className="py-2 text-emerald-400">Mutlaq chidamli</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Anonimlik</td>
                  <td className="py-2 text-rose-400">Cheklangan</td>
                  <td className="py-2 text-emerald-400">Kriptografik (ZK)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      title: "Xulosa: Web3 Texnologiyasining Ishlash Prinsiplari va Plus/Minuslari",
      subtitle: "Blokcheyn arxitekturasining texnik tahlili va amaliy tushunchasi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <Cpu size={16} /> Web3 Qanday Ishlaydi?
            </h4>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              Ma'lumotlar bitta markaziy ma'lumotlar bazasida emas, balki bir-biri bilan bog'langan minglab mustaqil kompyuterlar (tugunlar) tarmog'ida saqlanadi. Har bir yangi ma'lumot (ovoz) kriptografik kalitlar orqali imzolanadi va blok zanjiriga qo'shiladi. Bu zanjirni orqaga qaytarib yoki o'zgartirib bo'lmaydi.
            </p>
            <div className="p-2.5 bg-card rounded-lg border border-border text-[10px] font-mono">
              Blok Xesh = SHA256(Avvalgi_Xesh + Tranzaksiyalar + Nonce)
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-[11px]">
                <CheckCircle2 size={14} /> Web3 Texnologiyasining Afzalliklari (Pluslar)
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] space-y-1">
                <li><strong>Shaffoflik:</strong> Har bir tranzaksiya jamoatchilik uchun ochiq va tekshiriluvchan.</li>
                <li><strong>O'zgartirib bo'lmaslik (Immutability):</strong> Kiritilgan ma'lumotni hech kim o'chira olmaydi.</li>
                <li><strong>Markazlashmaganlik:</strong> Server buzib kirilsa ham, tarmoq ishlayveradi.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <h5 className="font-bold text-rose-400 flex items-center gap-2 text-[11px]">
                <XCircle size={14} /> Web3 Texnologiyasining Kamchiliklari (Minuslar)
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] space-y-1">
                <li><strong>Tranzaksiya to'lovlari (Gas fees):</strong> Tarmoqdan foydalanish uchun haq to'lanadi.</li>
                <li><strong>Tezlikning cheklanganligi:</strong> Har bir blok tasdiqlanishi vaqt talab etadi.</li>
                <li><strong>Foydalanish qiyinligi:</strong> Hamyonlarni ochish va kalitlarni saqlash murakkab.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Xulosa: Saylovlarda Web3 ning Rolining Muhimligi va Plus/Minuslari",
      subtitle: "Saylov jarayonlarining demokratik shaffofligini yangi bosqichga olib chiqish",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <ShieldCheck size={16} /> Nima uchun aynan saylovlarda kerak?
            </h4>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              An'anaviy onlayn saylovlarda tizim admini yoki ma'lumotlar bazasiga kirish huquqiga ega bo'lgan kishi ovozlarni o'zgartirishi yoki soxtalashtirishi mumkin (markaziy xavf). Web3 da smart-kontraktlar ishlashi sababli:
            </p>
            <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/10 text-[10px] leading-relaxed text-muted-foreground">
              <strong>End-to-End (E2E) Verifiability:</strong> Har bir saylovchi o'z ovozi to'g'ri hisobga olinganini blokcheyn tekshirgichi (explorer) orqali shaxsan nazorat qila oladi.
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-[11px]">
                <CheckCircle2 size={14} /> Ovoz Berishda Web3 Foydalari
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] space-y-1">
                <li><strong>Soxtalashtirishdan mutlaq himoya:</strong> Ovozlar o'zgarmas bloklarda saqlanadi.</li>
                <li><strong>Ishonchli hisob-kitob:</strong> Inson omilisiz smart-kontrakt avtomatik sanaydi.</li>
                <li><strong>Censorship-resistance:</strong> Saylovni tashqi kuchlar to'xtatib qo'ya olmaydi.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <h5 className="font-bold text-rose-400 flex items-center gap-2 text-[11px]">
                <XCircle size={14} /> Ovoz Berishda Web3 Kamchiliklari
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] space-y-1">
                <li><strong>Anonimlik xavfi:</strong> Blokcheyn ochiqligi sababli, ZK-SNARKs-siz shaxs fosh bo'lishi mumkin.</li>
                <li><strong>Kalitlarni yo'qotish:</strong> Kalit yo'qolsa, saylovchi qayta ovoz bera olmaydi.</li>
                <li><strong>Huquqiy tartibga solish:</strong> Qonunchilikda blokcheyn ovozini tan olish qiyinligi.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Xulosa: Web3 Ovoz Berishda Xalqaro Tajriba va Bugungi Ehtiyoj",
      subtitle: "Swiss Post, Voatz, Helios kabi xalqaro tizimlar tahlili",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="font-bold text-primary flex items-center gap-2">
              <Globe size={14} /> Swiss Post (Shveytsariya)
            </h5>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              Shveytsariya e-voting tizimida <strong>universal verifiability</strong>ni joriy etgan. Saylovchilarga o'z ovozlarini kriptografik isbotlar yordamida tekshirish imkonini beradi, bu tizim ochiq kodli auditga asoslangan.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="font-bold text-primary flex items-center gap-2">
              <Users size={14} /> Voatz (AQSH)
            </h5>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              AQSHda harbiylar va xorijdagi fuqarolar uchun blokcheyn (Hyperledger) hamda biometrik tekshiruvlar yordamida ovoz berish pilot loyihalarini o'tkazdi. Bu mobil qurilmalar orqali ovoz berishni xavfsiz qildi.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="font-bold text-primary flex items-center gap-2">
              <TrendingUp size={14} /> Bugungi Kunda Nega Kerak?
            </h5>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              Markazlashgan davlat saylov tizimlariga ishonch pasayib borayotgan davrda, blokcheyn ishonchni inson yoki tizim ma'murlariga emas, balki matematik kriptografiyaga bog'laydi. Bu saylov natijalarining legitimligini ta'minlaydi.
            </p>
          </div>
        </div>
      ),
    },
  ];

  // English Language Slides
  const slidesEn: SlideData[] = [
    {
      title: "Thesis: Development of Modern Web Interfaces for Online Voting Systems and UX Optimization",
      subtitle: "Introduction: Project Objective & Relevance",
      content: (
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto pt-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-violet-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 animate-pulse">
            <ShieldCheck size={36} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-foreground">
            UX/UI and Cryptographic Security in E-Voting
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            An innovative election platform aligned with PF-6079 \"Digital Uzbekistan - 2030\" and the first electronic voting pilots in Tashkent in 2024.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4 text-left border-t border-white/5">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Objective</span>
              <span className="font-bold text-foreground text-xs">Simplify voting process and optimize usability</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Goals</span>
              <span className="font-bold text-foreground text-xs">Accessibility, security and real-time tabulation</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Innovation</span>
              <span className="font-bold text-foreground text-xs">Tailored UX model for local voters</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "1.1 - 1.2 Theoretical Part: Global Comparison of Voting Platforms",
      subtitle: "Evolution of digital election systems worldwide",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
            <h4 className="font-bold text-sm text-primary">Estonia (i-Voting)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Active since 2005. Uses ID-card + PIN. Around 40-50% turnout online. Disadvantages: Server side vulnerabilities and lack of E2E verification.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
            <h4 className="font-bold text-sm text-primary">Switzerland (e-Voting)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Provides individual and universal verification (E2E). Advanced cryptography (mix-nets, zero-knowledge proofs). Expensive to maintain.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
            <h4 className="font-bold text-sm text-primary">Brazil (EVM)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Offline voting terminals since 1996. High resilience against cyber attacks, but does not allow remote or out-of-district online voting.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "1.3 - 1.4 Theoretical Part: Web Technologies and UX/UI Design Principles",
      subtitle: "Modern interface design and usability standards",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Monitor size={16} />
              </div>
              <div className="text-xs">
                <strong className="text-foreground block">Mobile-First Approach:</strong>
                More than 50% of traffic comes from mobile phones. Interfaces are optimized for small touch screens, then responsive to desktop.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                <ListFilter size={16} />
              </div>
              <div className="text-xs">
                <strong className="text-foreground block">Visual Hierarchy and White Space:</strong>
                User eyes read following an F-shaped path. Important CTAs are isolated. Clean layout without distracting components.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Activity size={16} />
              </div>
              <div className="text-xs">
                <strong className="text-foreground block">Color Psychology & Typography:</strong>
                Blue (trust) and green (success) applied using the 60-30-10 palette rules. Clear, readable Sans-Serif font hierarchy.
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col justify-center space-y-3 text-xs">
            <h4 className="font-bold text-foreground">Framer Motion & Micro-interactions:</h4>
            <p className="text-muted-foreground leading-relaxed">
              Hover states, progress animations, and page-to-page visual flows reduce cognitive loads and make interactions predictable.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "1.5 Theoretical Part: Security & Visual Trust Signals",
      subtitle: "Interpreting cryptography and security to the user",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Eye size={20} />
            </div>
            <h4 className="font-bold text-sm text-foreground">Security Transparency</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Visualizes how votes are encrypted and voter identities remain hidden in real time, increasing user confidence.
            </p>
          </div>

          <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={20} />
            </div>
            <h4 className="font-bold text-sm text-foreground">Instant Feedback</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Saves a receipt hash immediately upon ballot casting and fires toast notifications to provide quick interaction confirmation.
            </p>
          </div>

          <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Lock size={20} />
            </div>
            <h4 className="font-bold text-sm text-foreground">One-time Lockouts</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Once a vote is cast, the interface locks the voting privileges automatically, closing duplicate entry points.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "2.1 Project Part: General Architecture & Requirements",
      subtitle: "Functional and technical parameters of the system",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-sm">Functional Requirements:</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
              <li>Secure voter sign-in and National ID authentication.</li>
              <li>Elections, candidates, and question classification.</li>
              <li>Turnout and result calculations broadcasted in real time.</li>
              <li>Unique transaction receipt hashes for E2E auditability.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-sm">Non-Functional Requirements:</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
              <li>Security: End-to-end encrypted ballots (Fernet AES-128).</li>
              <li>Accessibility: Fully WCAG 2.1 AA and keyboard accessible.</li>
              <li>Performance: Sub-second page rendering speed via Next.js.</li>
              <li>Reliability: High-concurrency support using Redis queues.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "2.2 Project Part: Database Design",
      subtitle: "Relational database schema for the e-voting platform",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
            <h4 className="font-bold text-foreground">Relational Schema Layout:</h4>
            <div className="space-y-2">
              <div className="p-2 bg-card rounded-lg border border-border">
                <strong>Users:</strong> id, full_name, email, role, pass_hash, is_active
              </div>
              <div className="p-2 bg-card rounded-lg border border-border">
                <strong>Elections:</strong> id, title, description, start_time, end_time, status, results_public
              </div>
              <div className="p-2 bg-card rounded-lg border border-border">
                <strong>Candidates:</strong> id, election_id, name, party, bio, photo_url
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4 text-xs">
            <h4 className="font-bold text-foreground">Votes Schema & Constraints:</h4>
            <div className="p-3 bg-card rounded-lg border border-border">
              <strong>Votes:</strong> id, voter_hash (SHA-256), election_id, encrypted_payload, cast_at
            </div>
            <div className="bg-primary/5 border border-primary/10 p-3 rounded-lg text-[11px] leading-relaxed">
              <strong>UniqueConstraint (voter_hash, election_id):</strong> Prevents double-voting at the database constraint level. Hashing detaches personal info from the vote payload.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2.3 - 2.4 Project Part: Frontend & Backend Development",
      subtitle: "Software structure, routing, and APIs",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Cpu size={16} />
              </div>
              <div className="text-xs">
                <strong>React & Next.js Client:</strong>
                Zustand manages the state. Axios interceptors inject/renew JWT tokens automatically.
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                <Server size={16} />
              </div>
              <div className="text-xs">
                <strong>Django REST Framework (DRF):</strong>
                Provides secure API controllers and models for elections and candidate profiles.
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Zap size={16} />
              </div>
              <div className="text-xs">
                <strong>WebSocket (Channels + Redis):</strong>
                Powers async broadcasts using Redis pub/sub to synchronize client views immediately.
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between text-xs">
            <div>
              <span className="font-bold text-foreground block mb-2">Primary API Endpoints:</span>
              <ul className="space-y-1 font-mono text-[10px] text-muted-foreground">
                <li>POST /api/v1/auth/login/ - Auth Token</li>
                <li>POST /api/v1/auth/register/ - Sign Up</li>
                <li>GET /api/v1/elections/ - Fetch list</li>
                <li>POST /api/v1/votes/cast/ - Record ballot</li>
                <li>GET /api/v1/analytics/system/ - Statistics</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2.5 Project Part: Security & Verification Mechanisms",
      subtitle: "JWT authentication, tokens cleanup, and hashing flow",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
            <h4 className="font-bold text-foreground">Authorization Flow:</h4>
            <div className="space-y-2">
              <div className="p-2.5 bg-card rounded-lg border border-border">
                <strong>JWT token pairing:</strong> Short-lived Access token and persistent Refresh token are stored to keep connections safe and seamless.
              </div>
              <div className="p-2.5 bg-card rounded-lg border border-border">
                <strong>MFA:</strong> Secondary verification via National ID checks.
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4 text-xs">
            <h4 className="font-bold text-foreground">Token Clearance Routine (Resolved Bug):</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              If a 401 Unauthorized error or refresh timeout occurs, the interceptor now immediately purges the Zustand store and local storage, redirecting the voter to the main landing page to eliminate session hijacking threats.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "2.6 Project Part: Admin Control Panel & Turnout Analytics",
      subtitle: "Election configuration and real-time visualization dashboard",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-primary">Election Controls</h4>
            <p className="text-muted-foreground">
              Administrators can define parameters, candidates, timing, and publish or close active voting boards.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-primary">Recharts Diagrams</h4>
            <p className="text-muted-foreground">
              Ballot distribution yields are formatted instantly inside pie charts and bar configurations on the dashboard.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-primary">Turnout Analysis</h4>
            <p className="text-muted-foreground">
              Voter participation rate is calculated dynamically, giving administrative officers exact metrics.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "3.1 - 3.2 Deployment Part: Setup & Operations Manual",
      subtitle: "Deployment checklist and end-user guides",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-foreground">Installation Checklist:</h4>
            <div className="space-y-2 text-[11px] font-mono text-muted-foreground">
              <div>1. Backend: <code>pip install -r requirements.txt</code></div>
              <div>2. Database: <code>python manage.py migrate</code></div>
              <div>3. Frontend: <code>npm install</code></div>
              <div>4. Production build: <code>npm run build --webpack</code></div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-foreground">User Manual:</h4>
            <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-1">
              <li>Voter signs in, selects an active election card from dashboard.</li>
              <li>Picks candidate and clicks "Cast Vote".</li>
              <li>Stores the cryptographic receipt hash printed on screen.</li>
              <li>Admin monitors results and closes/publishes statistics.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "3.3 Deployment Part: Usability & UX Evaluation Results",
      subtitle: "Real-world usability test metrics and user feedback statistics",
      content: (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
              <span className="text-2xl font-black text-primary block">92.5%</span>
              <span className="text-[10px] text-muted-foreground uppercase">User confidence score</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
              <span className="text-2xl font-black text-success block">&lt; 40s</span>
              <span className="text-[10px] text-muted-foreground uppercase">Ballot submit time</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
              <span className="text-2xl font-black text-amber-500 block">98%</span>
              <span className="text-[10px] text-muted-foreground uppercase">Success completion rate</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
              <span className="text-2xl font-black text-purple-500 block">A+</span>
              <span className="text-[10px] text-muted-foreground uppercase">WCAG AA accessibility</span>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl text-xs text-muted-foreground">
            <strong>Usability Summary:</strong> UX tests show that the 3-stage voting workflow reduces confusion and enables seniors and non-technical voters to participate without errors.
          </div>
        </div>
      ),
    },
    {
      title: "Conclusions & Future Outlook: Web3 Transition Roadmap",
      subtitle: "Integrating smart contracts and zero-knowledge proofs",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-foreground">Web3 Transition Plan:</h4>
            <p className="text-muted-foreground leading-relaxed">
              Moving from centralized databases to blockchain addresses the remaining admin trust vulnerabilities, ensuring absolute censorship resistance.
            </p>
            <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3">
              <Layers size={16} className="text-indigo-400 shrink-0" />
              <span><strong>Smart Contracts:</strong> Tabulate votes trustlessly.</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3">
              <Users size={16} className="text-pink-400 shrink-0" />
              <span><strong>ZK-SNARK (Semaphore):</strong> Anonymize wallet identities.</span>
            </div>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground">
                  <th className="pb-2">Metric</th>
                  <th className="pb-2 text-primary">Web2 (Current)</th>
                  <th className="pb-2 text-secondary">Web3 (Future)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-muted-foreground">
                <tr>
                  <td className="py-2 font-medium text-foreground">Trust Model</td>
                  <td className="py-2 text-rose-400">Admins & Servers</td>
                  <td className="py-2 text-emerald-400">Blockchain Network</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Performance</td>
                  <td className="py-2 text-emerald-400">Immediate</td>
                  <td className="py-2 text-rose-400">Block confirmation time</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Censorship</td>
                  <td className="py-2 text-rose-400">Vulnerable</td>
                  <td className="py-2 text-emerald-400">Resilient</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Anonymity</td>
                  <td className="py-2 text-rose-400">Database level</td>
                  <td className="py-2 text-emerald-400">Cryptographic (ZK)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      title: "Conclusions: Core Principles, Pros & Cons of Web3 Architecture",
      subtitle: "Technical analysis and practical concept of blockchain technology",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <Cpu size={16} /> How Web3 Works
            </h4>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              Data is stored not in a single centralized database, but across a network of thousands of independent, interconnected computers (nodes). Every new transaction (vote) is cryptographically signed and appended to the ledger chain, which cannot be modified or reversed.
            </p>
            <div className="p-2.5 bg-card rounded-lg border border-border text-[10px] font-mono">
              Block Hash = SHA256(Previous_Hash + Transactions + Nonce)
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-[11px]">
                <CheckCircle2 size={14} /> Advantages of Web3 (Pros)
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] space-y-1">
                <li><strong>Transparency:</strong> Publicly verifiable ledger open to external observers.</li>
                <li><strong>Immutability:</strong> Records once added cannot be modified or deleted.</li>
                <li><strong>Decentralization:</strong> Resilient network operation even if several servers go down.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <h5 className="font-bold text-rose-400 flex items-center gap-2 text-[11px]">
                <XCircle size={14} /> Disadvantages of Web3 (Cons)
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] space-y-1">
                <li><strong>Transaction Fees (Gas):</strong> Network usage costs gas fee per transaction.</li>
                <li><strong>Limited Throughput:</strong> Every block requires distributed validator consensus.</li>
                <li><strong>Complex Onboarding:</strong> Navigating wallets and private key security can be tough.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Conclusions: Crucial Role of Web3 in Elections (Pros & Cons)",
      subtitle: "Enhancing democratic transparency and trust in online voting",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <ShieldCheck size={16} /> Why is it crucial for elections?
            </h4>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              In standard online voting, system admins or database operators hold centralized power and can tamper with ballots. Web3 resolves this with smart contracts:
            </p>
            <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/10 text-[10px] leading-relaxed text-muted-foreground">
              <strong>End-to-End (E2E) Verifiability:</strong> Every voter can independently verify that their ballot was properly recorded and counted in the ledger via public explorers.
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-[11px]">
                <CheckCircle2 size={14} /> Web3 Voting Benefits
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] space-y-1">
                <li><strong>Absolute Tamper Resistance:</strong> Ballots are cast on-chain and locked.</li>
                <li><strong>Trustless Counting:</strong> Smart contracts sum votes automatically without human bias.</li>
                <li><strong>Censorship Resistance:</strong> No central authority can block or stop the election.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <h5 className="font-bold text-rose-400 flex items-center gap-2 text-[11px]">
                <XCircle size={14} /> Web3 Voting Drawbacks
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] space-y-1">
                <li><strong>Anonymity Risk:</strong> Without ZK-SNARKs, wallet addresses can be mapped to users.</li>
                <li><strong>No Key Recovery:</strong> Losing wallet seed phrase makes casting ballot impossible.</li>
                <li><strong>Legal Frameworks:</strong> Blockchain ballots struggle with regulatory recognition.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Conclusions: International Experience & Modern E-Voting Needs",
      subtitle: "Case studies from Swiss Post, Voatz, Helios and the demand for trust",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="font-bold text-primary flex items-center gap-2">
              <Globe size={14} /> Swiss Post (Switzerland)
            </h5>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              Switzerland implemented <strong>universal verifiability</strong>. Voters verify that their votes were correctly processed using cryptographic proofs under a fully open-source audited setup.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="font-bold text-primary flex items-center gap-2">
              <Users size={14} /> Voatz (USA)
            </h5>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              Conducted pilot blockchain (Hyperledger) voting with biometric verification for military personnel and overseas citizens (e.g., Utah and West Virginia pilots) enabling secure mobile voting.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="font-bold text-primary flex items-center gap-2">
              <TrendingUp size={14} /> Why We Need it Today
            </h5>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              With declining public trust in centralized voting authorities, blockchain shifts the foundation of trust from fallible human organizations to verifiable mathematical code, guaranteeing election legitimacy.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const slides = locale === "uz" ? slidesUz : slidesEn;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary/30 overflow-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 md:px-8 pt-24 pb-20 max-w-7xl mx-auto w-full">
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <Link
              href="/"
              className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={14} />
              {locale === "uz" ? "Asosiy Sahifa" : "Back to Home"}
            </Link>
            <div className="text-xs font-mono text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>

          <div className="glass-premium min-h-[520px] md:min-h-[560px] p-8 md:p-12 rounded-[32px] border-white/10 flex flex-col justify-between relative shadow-2xl overflow-hidden bg-gradient-to-b from-card/30 to-background/50">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                      {slides[currentSlide].title}
                    </h2>
                    {slides[currentSlide].subtitle && (
                      <p className="text-xs text-primary/80 font-bold mt-1.5 uppercase tracking-wider">
                        {slides[currentSlide].subtitle}
                      </p>
                    )}
                  </div>

                  <div className="text-base text-foreground leading-relaxed pt-2">
                    {slides[currentSlide].content}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="btn-secondary py-2.5 px-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold"
              >
                <ArrowLeft size={16} />
                {locale === "uz" ? "Oldingi" : "Previous"}
              </button>

              {/* Progress Dots */}
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === i ? "bg-primary w-6" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {currentSlide < slides.length - 1 ? (
                <button
                  onClick={nextSlide}
                  className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold"
                >
                  {locale === "uz" ? "Keyingi" : "Next"}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <Link
                  href="/"
                  className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold bg-success hover:bg-success/90 animate-bounce"
                >
                  {locale === "uz" ? "Tugatish" : "Finish"}
                  <Award size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-white/5 text-center text-[10px] text-muted-foreground tracking-widest uppercase bg-card/10">
        {locale === "uz"
          ? "Karimjonova Robiyaxon Diplom Ishi Taqdimoti © 2026"
          : "Karimjonova Robiyaxon Graduation Work Presentation © 2026"}
      </footer>
    </div>
  );
}
