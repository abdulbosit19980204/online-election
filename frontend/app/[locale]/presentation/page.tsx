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
  BarChart4,
  Maximize,
  Minimize,
  BookOpen,
  List
} from "lucide-react";

interface SlideData {
  title: string;
  subtitle?: string;
  category: string;
  content: React.ReactNode;
}

export default function PresentationPage() {
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Uzbek Language Slides
  const slidesUz: SlideData[] = [
    {
      category: "KIRISH",
      title: "Mavzu: Onlayn ovoz berish tizimlari uchun zamonaviy veb-interfeyslarni ishlab chiqish va UX optimallashtirish",
      subtitle: "Loyiha maqsadi va dolzarbligi tahlili",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-2">
          <div className="md:col-span-2 text-left space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-primary to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck size={26} className="text-white" />
              </div>
              <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-md border border-primary/20">Loyiha Maqsadi</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-foreground">
              Onlayn Ovoz Berishda <span className="text-primary">UX/UI</span> va Kriptografik Xavfsizlik
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              PF-6079 "Raqamli O'zbekiston - 2030" va PF-158 strategiyalari doirasida Toshkent shahrida 2024-yilda o'tkazilgan elektron saylov tajribasiga asoslangan innovatsion elektron platforma.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider block mb-0.5">Maqsad</span>
                <span className="font-bold text-foreground text-xs block leading-snug">Jarayonni soddalashtirish va UX optimallashtirish</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider block mb-0.5">Vazifalar</span>
                <span className="font-bold text-foreground text-xs block leading-snug">WCAG AA mosligi, xavfsizlik va real vaqtda natijalar</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider block mb-0.5">Yangilik</span>
                <span className="font-bold text-foreground text-xs block leading-snug">O'zbekistonliklar mental modeli asosida interfeys qurish</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img 
              src="/voting_hologram_3d_1777582708776.png" 
              alt="Voting Hologram" 
              className="w-48 h-48 md:w-60 md:h-60 object-contain rounded-3xl drop-shadow-[0_20px_50px_rgba(99,102,241,0.2)] animate-float" 
            />
          </div>
        </div>
      ),
    },
    {
      category: "NAZARIYA",
      title: "Jahon miqyosida elektron saylov tizimlarining rivojlanishi va tahlili",
      subtitle: "Estoniya, Shveytsariya va Braziliya tajribalari taqqoslashi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">EST</div>
            <h4 className="font-bold text-base text-foreground">Estoniya (i-Voting)</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              2005-yildan beri faol. ID-karta + PIN kod. Saylovchilarning 40-50% qismi onlayn ovoz beradi. <strong>Kamchiligi:</strong> Server xavfsizligi va E2E auditning yo'qligi.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 font-bold text-sm">CHE</div>
            <h4 className="font-bold text-base text-foreground">Shveytsariya (e-Voting)</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Individual va universal auditability (End-to-End). Mix-net va zero-knowledge proofs kriptografiyasi ishlatiladi. Tizim ancha ishonchli, lekin juda qimmat.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 font-bold text-sm">BRA</div>
            <h4 className="font-bold text-base text-foreground">Braziliya (EVM)</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Oflayn elektron ovoz berish terminallari (1996-yildan beri). Kiberxavfsizlik va soxtalashtirishga chidamlilik yuqori, biroq masofadan turib ovoz berib bo'lmaydi.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "DIZAYN TAMOYILLARI",
      title: "Veb-Texnologiyalar va UX/UI Dizayn Tamoyillari",
      subtitle: "Foydalanuvchi tajribasini optimallashtirish qoidalari",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Monitor size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-1">Mobile-First va Responsiveness:</strong>
                Foydalanuvchilarning 50% dan ortig'i mobil qurilmalardan kiradi. Interfeys dastlab mobil uchun, keyin desktop uchun optimallashdi.
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                <ListFilter size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-1">Vizual Ierarxiya va White Space:</strong>
                CTA tugmalari kontrastli ranglarda ajratilgan. Ortiqcha ma'lumotlar kognitiv yuklamani (cognitive load) kamaytirish uchun olib tashlandi.
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Activity size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-1">Tipografika va Ranglar:</strong>
                Sans-Serif inter oilasi shrifti o'qish tezligini oshiradi. Ko'k (ishonch) va yashil (tasdiq) ranglardan o'rinli foydalanildi.
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center space-y-4 text-sm">
            <h4 className="font-bold text-foreground text-base">Framer Motion mikro-animatsiyalari:</h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Tizimdagi silliq animatsiyalar saylovchiga har bir harakatini (tugmani bosish, sahifaning yuklanishi, kvitansiya generatsiyasi) vizual tasdiqlab beradi. Bu esa o'z navbatida onlayn tizimlarga bo'lgan ishonchni oshirishga xizmat qiladi.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "XAVFSIZLIK",
      title: "Kriptografik Xavfsizlik va Vizual Ishonch Elementlari",
      subtitle: "Saylovchini tizim shaffofligiga ishontirish",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-2">
          <div className="md:col-span-2 space-y-4 text-left">
            <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Eye size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-0.5">Security Transparency:</strong>
                <p className="text-muted-foreground">Ovoz qanday shifrlanishi (Fernet AES-128) va shaxs qanday anonim qolishi (SHA-256) interfeysda animatsiyalar orqali vizual tushuntirilari.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Zap size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-0.5">Instant Feedback:</strong>
                <p className="text-muted-foreground">Ovoz berilgandan so'ng kvitansiya (receipt hash) darhol ko'rsatiladi va toast bildirishnomalari tezkor qayta aloqa (feedback loop) yaratadi.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Lock size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-0.5">One-time Lockouts:</strong>
                <p className="text-muted-foreground">Foydalanuvchi ovoz berib bo'lgach, tizim uning takroriy ovoz berish imkoniyatini darhol interfeys darajasida yopadi va tugmalarni nofaollashtiradi.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img 
              src="/security_shield_3d_1777582729225.png" 
              alt="Security Shield" 
              className="w-48 h-48 md:w-60 md:h-60 object-contain rounded-3xl drop-shadow-[0_20px_50px_rgba(16,185,129,0.15)] animate-float" 
            />
          </div>
        </div>
      ),
    },
    {
      category: "ARXITEKTURA",
      title: "2.1 - Tizim Arxitekturasi va Talablar Tahlili",
      subtitle: "Funksional va texnik talablar tarkibi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-primary text-sm uppercase tracking-wider">Funksional talablar</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Saylovchilarni xavfsiz ro'yxatdan o'tkazish (Passport va JSHSHIR).</li>
              <li>Saylovlar, nomzodlar va natijalarni toifalash.</li>
              <li>Shifrlangan ovozlarni qabul qilish va saqlash.</li>
              <li>Jonli natijalarni ko'rsatish (real-time).</li>
            </ul>
          </div>
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-primary text-sm uppercase tracking-wider">Funksional bo'lmagan talablar</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li><strong>Xavfsizlik:</strong> Fernet AES-128 va SHA-256 arxitekturasi.</li>
              <li><strong>Accessibility:</strong> WCAG 2.1 AA hamda to'liq klaviatura boshqaruvi.</li>
              <li><strong>Tezlik:</strong> Next.js Server-Side Rendering orqali &lt;1s yuklanish.</li>
              <li><strong>Ishonchlilik:</strong> Katta yuklamalarni ko'taruvchi Redis arxitekturasi.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      category: "MA'LUMOTLAR BAZASI",
      title: "2.2 - Ma'lumotlar Bazasini Loyihalash va Cheklovlar",
      subtitle: "E-voting uchun ma'lumotlar sxemasi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm">
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-foreground text-base">Asosiy Jadvallar:</h4>
            <div className="space-y-2 font-mono text-xs text-muted-foreground">
              <div className="p-2 bg-card rounded border border-border">
                <strong>Users:</strong> id, full_name, email, role, wallet_address, pass_hash
              </div>
              <div className="p-2 bg-card rounded border border-border">
                <strong>Elections:</strong> id, title, start_time, end_time, results_public
              </div>
              <div className="p-2 bg-card rounded border border-border">
                <strong>Candidates:</strong> id, election_id, name, party, photo_url
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-4">
            <h4 className="font-bold text-foreground text-base">Votes Jadvali va Double-Voting Himoyasi:</h4>
            <div className="p-3 bg-card rounded border border-border font-mono text-xs text-muted-foreground">
              <strong>Votes:</strong> id, voter_hash (SHA-256), election_id, encrypted_payload, cast_at
            </div>
            <div className="bg-primary/5 border border-primary/10 p-3 rounded-lg text-xs leading-relaxed text-muted-foreground">
              <strong>UniqueConstraint (voter_hash, election_id):</strong> Bazaviy darajada bir saylovchiga faqat bir marta ovoz berish imkonini beradi. voter_hash saylovchining unikal kalitidan hisoblanib, shaxsni ovoz mazmunidan ajratadi (anonimlik).
            </div>
          </div>
        </div>
      ),
    },
    {
      category: "DASTURIY TA'MINOT",
      title: "2.3 - 2.4 Frontend va Backend Ishlanmasi (Web3 integratsiyasi bilan)",
      subtitle: "Dasturiy kod strukturasi, veb-soketlar va blokcheyn arxitekturasi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm">
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h5 className="font-bold text-primary text-base mb-1.5">React, Next.js & Web3:</h5>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Zustand va Axios interceptors orqali JWT tokenlar boshqariladi. Web3 qismida MetaMask (`eth_requestAccounts`) va kriptografik shaxsni tasdiqlash uchun `personal_sign` ulandi.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h5 className="font-bold text-primary text-base mb-1.5">Django & ECDSA Verification:</h5>
              <p className="text-muted-foreground text-sm leading-relaxed">
                DRF API'lari bilan birga backendda hamyon signaturalarini tekshiruvchi asinxron `Web3LoginView` (ECDSA / `eth-account` yordamida) ishlab chiqildi.
              </p>
            </div>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-foreground text-base mb-2">WebSocket & Solidity Smart Contract:</h5>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Redis va Channels yordamida real vaqtda natijalar uzatiladi. Ovoz berish qismida Merkle Tree isbotlari bilan yozilgan asinxron Solidity (`VoteSecure.sol`) smart-kontrakti loyihalashtirildi.
              </p>
            </div>
            <div className="p-3 bg-card rounded border border-border text-xs font-mono text-muted-foreground mt-4">
              Web3: personal_sign(msg) ➔ eth-account.recover_message()
            </div>
          </div>
        </div>
      ),
    },
    {
      category: "AUTENTIFIKATSIYA",
      title: "2.5 Loyiha Qismi: Autentifikatsiya va Tokenlarni Tozalash (Tuzatilgan Bug)",
      subtitle: "Xavfsizlikni ta'minlash va seans o'g'irlanishiga qarshi choralar",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm">
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-4">
            <h4 className="font-bold text-primary text-base">JWT Tokenlar va MFA oqimi:</h4>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
              <li>Access Token (qisqa muddatli, xotirada saqlanadi).</li>
              <li>Refresh Token (uzoq muddatli, cookie faylda saqlanadi).</li>
              <li>JSHSHIR va shaxsiy pasport biometrikasini o'zaro solishtirish.</li>
            </ul>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-success text-base">Avtomatik Logout va Tozalash (Bug Fix):</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              JWT token eskirganda va refresh to'xtaganda (yoki foydalanuvchi tizimdan chiqqanda), frontend <code>api.ts</code> interceptorlari orqali Zustand store va mahalliy saqlagichni (localStorage) darhol tozalaydi va foydalanuvchini bosh sahifaga (<code>/</code>) yo'naltiradi. Bu seanslarni noqonuniy egallashni butunlay to'xtatadi.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "MONITORING",
      title: "2.6 Loyiha Qismi: Administrator Paneli va Jonli Natijalar Tahlili",
      subtitle: "Ovoz berish jarayonini boshqarish va vizual dashboardlar",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-base text-primary">Saylov Boshqaruvi</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adminlar yangi saylovlar yaratishi, ularga nomzodlar qo'shishi, muddatlarni boshqarishi hamda natijalarni e'lon qilishi mumkin.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-base text-primary">Recharts Diagrammalari</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ovoz berish natijalari bar va pie-chart diagrammalarida real vaqt rejimida aks etadi, har bir nomzod ulushi soniyada yangilanadi.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-base text-primary">Ishtirok Monitoringi</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Saylovchilar qatnashish stavkasi (turnout rate) foiz ko'rinishida doimiy monitoring qilinadi.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "USABILITY",
      title: "3.3 Tadbiq Qismi: Usability UX Sinovlari va Natijalari",
      subtitle: "Tizim samaradorligi va foydalanuvchilar fikri ko'rsatkichlari",
      content: (
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5">
              <span className="text-3xl font-black text-primary block">92.5%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Ishonch koeffitsiyenti</span>
            </div>
            <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5">
              <span className="text-3xl font-black text-success block">&lt; 40s</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Ovoz berish vaqti</span>
            </div>
            <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5">
              <span className="text-3xl font-black text-amber-500 block">98%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Muvaffaqiyatli yakun</span>
            </div>
            <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5">
              <span className="text-3xl font-black text-purple-500 block">A+</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">WCAG AA Mosligi</span>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl text-sm text-muted-foreground leading-relaxed">
            <strong>Samaradorlik xulosasi:</strong> O'tkazilgan UX testlari natijasiga ko'ra, VoteSecure platformasi aholining barcha qatlamlari, jumladan keksalar va imkoniyati cheklangan shaxslar uchun eng sodda va tushunarli ovoz berish modeli ekanligini isbotladi.
          </div>
        </div>
      ),
    },
    {
      category: "WEB3 PRINSIPLARI",
      title: "Web3 Texnologiyasining Ishlash Prinsiplari va Plus/Minuslari",
      subtitle: "Blokcheyn arxitekturasining texnik tahlili va amaliy tushunchasi",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-sm">
          <div className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/5">
            <h4 className="font-bold text-primary flex items-center gap-2 text-base">
              <Cpu size={18} /> Web3 Qanday Ishlaydi?
            </h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Ma'lumotlar bitta markaziy ma'lumotlar bazasida emas, balki bir-biri bilan bog'langan minglab mustaqil kompyuterlar (tugunlar) tarmog'ida saqlanadi. Har bir yangi ma'lumot (ovoz) kriptografik kalitlar orqali imzolanadi va blok zanjiriga qo'shiladi. Bu zanjirni orqaga qaytarib yoki o'zgartirib bo'lmaydi.
            </p>
            <div className="p-3 bg-card rounded-lg border border-border text-xs font-mono">
              Blok Xesh = SHA256(Avvalgi_Xesh + Tranzaksiyalar + Nonce)
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} /> Web3 Texnologiyasining Afzalliklari (Pluslar)
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1.5">
                <li><strong>Shaffoflik:</strong> Har bir tranzaksiya jamoatchilik uchun ochiq va tekshiriluvchan.</li>
                <li><strong>O'zgartirib bo'lmaslik (Immutability):</strong> Kiritilgan ma'lumotni hech kim o'chira olmaydi.</li>
                <li><strong>Markazlashmaganlik:</strong> Server buzib kirilsa ham, tarmoq ishlayveradi.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
              <h5 className="font-bold text-rose-400 flex items-center gap-2 text-sm">
                <XCircle size={16} /> Web3 Texnologiyasining Kamchiliklari (Minuslar)
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1.5">
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
      category: "SAYLOVLARDA WEB3",
      title: "Saylovlarda Web3 ning Rolining Muhimligi va Plus/Minuslari",
      subtitle: "Saylov jarayonlarining demokratik shaffofligini yangi bosqichga olib chiqish",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-sm">
          <div className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/5">
            <h4 className="font-bold text-primary flex items-center gap-2 text-base">
              <ShieldCheck size={18} /> Nima uchun aynan saylovlarda kerak?
            </h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              An'anaviy onlayn saylovlarda tizim admini yoki ma'lumotlar bazasiga kirish huquqiga ega bo'lgan kishi ovozlarni o'zgartirishi yoki soxtalashtirishi mumkin (markaziy xavf). Web3 da smart-kontraktlar ishlashi sababli:
            </p>
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-xs leading-relaxed text-muted-foreground">
              <strong>End-to-End (E2E) Verifiability:</strong> Har bir saylovchi o'z ovozi to'g'ri hisobga olinganini blokcheyn tekshirgichi (explorer) orqali shaxsan nazorat qila oladi.
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} /> Ovoz Berishda Web3 Foydalari
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1.5">
                <li><strong>Soxtalashtirishdan mutlaq himoya:</strong> Ovozlar o'zgarmas bloklarda saqlanadi.</li>
                <li><strong>Ishonchli hisob-kitob:</strong> Inson omilisiz smart-kontrakt avtomatik sanaydi.</li>
                <li><strong>Censorship-resistance:</strong> Saylovni tashqi kuchlar to'xtatib qo'ya olmaydi.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
              <h5 className="font-bold text-rose-400 flex items-center gap-2 text-sm">
                <XCircle size={16} /> Ovoz Berishda Web3 Kamchiliklari
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1.5">
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
      category: "XALQARO TAJRIBA",
      title: "Web3 Ovoz Berishda Xalqaro Tajriba va Bugungi Ehtiyoj",
      subtitle: "Swiss Post, Voatz, Helios kabi xalqaro tizimlar tahlili",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-sm">
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h5 className="font-bold text-primary flex items-center gap-2 text-base">
              <Globe size={16} /> Swiss Post (Shveytsariya)
            </h5>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Shveytsariya e-voting tizimida <strong>universal verifiability</strong>ni joriy etgan. Saylovchilarga o'z ovozlarini kriptografik isbotlar yordamida tekshirish imkonini beradi, bu tizim ochiq kodli auditga asoslangan.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h5 className="font-bold text-primary flex items-center gap-2 text-base">
              <Users size={16} /> Voatz (AQSH)
            </h5>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AQSHda harbiylar va xorijdagi fuqarolar uchun blokcheyn (Hyperledger) hamda biometrik tekshiruvlar yordamida ovoz berish pilot loyihalarini o'tkazdi. Bu mobil qurilmalar orqali ovoz berishni xavfsiz qildi.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h5 className="font-bold text-primary flex items-center gap-2 text-base">
              <TrendingUp size={16} /> Bugungi Kunda Nega Kerak?
            </h5>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Markazlashgan davlat saylov tizimlariga ishonch pasayib borayotgan davrda, blokcheyn ishonchni inson yoki tizim ma'murlariga emas, balki matematik kriptografiyaga bog'laydi. Bu saylov natijalarining legitimligini ta'minlaydi.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "XULOSA",
      title: "Xulosa va Istiqbollar",
      subtitle: "Graduation thesis defense key takeaways",
      content: (
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto pt-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-success to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-success/20">
            <Award size={44} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-foreground">
            E'tiboringiz Uchun Rahmat!
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Tizim muvaffaqiyatli ishlab chiqildi, UX kamchiliklari bartaraf etildi, Web3 modeli loyihalashtirildi va barcha sahifalar real-time rejimga o'tkazildi.
          </p>
          <div className="text-sm font-bold text-primary uppercase tracking-widest mt-4">
            Muallif: Karimjonova Robiyaxon
          </div>
        </div>
      ),
    }
  ];

  // English Language Slides
  const slidesEn: SlideData[] = [
    {
      category: "INTRO",
      title: "Thesis: Development of Modern Web Interfaces for Online Voting Systems and UX Optimization",
      subtitle: "Introduction: Project Objective & Relevance",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-2">
          <div className="md:col-span-2 text-left space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-primary to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck size={26} className="text-white" />
              </div>
              <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-md border border-primary/20">Project Objective</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-foreground">
              UX/UI and Cryptographic Security in E-Voting
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              An innovative election platform aligned with PF-6079 "Digital Uzbekistan - 2030" and the first electronic voting pilots in Tashkent in 2024.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider block mb-0.5">Objective</span>
                <span className="font-bold text-foreground text-xs block leading-snug">Simplify voting process and optimize usability</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider block mb-0.5">Goals</span>
                <span className="font-bold text-foreground text-xs block leading-snug">Accessibility (WCAG AA), security, and real-time tabulation</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider block mb-0.5">Innovation</span>
                <span className="font-bold text-foreground text-xs block leading-snug">Tailored UX model designed for local voters</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img 
              src="/voting_hologram_3d_1777582708776.png" 
              alt="Voting Hologram" 
              className="w-48 h-48 md:w-60 md:h-60 object-contain rounded-3xl drop-shadow-[0_20px_50px_rgba(99,102,241,0.2)] animate-float" 
            />
          </div>
        </div>
      ),
    },
    {
      category: "THEORY",
      title: "Theoretical Part: Global Comparison of Voting Platforms",
      subtitle: "Evolution of digital election systems worldwide",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">EST</div>
            <h4 className="font-bold text-base text-foreground">Estonia (i-Voting)</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Active since 2005. Uses ID-card + PIN. Around 40-50% turnout online. <strong>Disadvantages:</strong> Server-side vulnerabilities and lack of E2E verification.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 font-bold text-sm">CHE</div>
            <h4 className="font-bold text-base text-foreground">Switzerland (e-Voting)</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Provides individual and universal verification (E2E). Advanced cryptography (mix-nets, zero-knowledge proofs). Expensive to maintain.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 font-bold text-sm">BRA</div>
            <h4 className="font-bold text-base text-foreground">Brazil (EVM)</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Offline voting terminals since 1996. High resilience against cyber attacks, but does not allow remote or out-of-district online voting.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "DESIGN",
      title: "Theoretical Part: Web Technologies and UX/UI Design Principles",
      subtitle: "Modern interface design and usability standards",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Monitor size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-1">Mobile-First Approach:</strong>
                More than 50% of traffic comes from mobile phones. Interfaces are optimized for small touch screens, then responsive to desktop.
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                <ListFilter size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-1">Visual Hierarchy and White Space:</strong>
                User eyes read following an F-shaped path. Important CTAs are isolated. Clean layout without distracting components.
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Activity size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-1">Color Psychology & Typography:</strong>
                Blue (trust) and green (success) applied using the 60-30-10 palette rules. Clear, readable Sans-Serif font hierarchy.
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center space-y-4 text-sm">
            <h4 className="font-bold text-foreground text-base">Framer Motion & Micro-interactions:</h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Hover states, progress animations, and page-to-page visual flows reduce cognitive loads and make interactions predictable.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "SECURITY",
      title: "Theoretical Part: Security & Visual Trust Signals",
      subtitle: "Interpreting cryptography and security to the user",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-2">
          <div className="md:col-span-2 space-y-4 text-left">
            <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Eye size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-0.5">Security Transparency:</strong>
                <p className="text-muted-foreground">Visualizes how votes are encrypted and voter identities remain hidden in real time, increasing user confidence.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Zap size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-0.5">Instant Feedback:</strong>
                <p className="text-muted-foreground">Saves a receipt hash immediately upon ballot casting and fires toast notifications to provide quick interaction confirmation.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Lock size={20} />
              </div>
              <div className="text-sm">
                <strong className="text-foreground block text-base mb-0.5">One-time Lockouts:</strong>
                <p className="text-muted-foreground">Once a vote is cast, the interface locks the voting privileges automatically, closing duplicate entry points.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img 
              src="/security_shield_3d_1777582729225.png" 
              alt="Security Shield" 
              className="w-48 h-48 md:w-60 md:h-60 object-contain rounded-3xl drop-shadow-[0_20px_50px_rgba(16,185,129,0.15)] animate-float" 
            />
          </div>
        </div>
      ),
    },
    {
      category: "ARCHITECTURE",
      title: "Project Part: General Architecture & Requirements",
      subtitle: "Functional and technical parameters of the system",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-primary text-sm uppercase tracking-wider">Functional Requirements</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Secure voter sign-in and National ID authentication.</li>
              <li>Elections, candidates, and question classification.</li>
              <li>Turnout and result calculations broadcasted in real time.</li>
              <li>Unique transaction receipt hashes for E2E auditability.</li>
            </ul>
          </div>
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-primary text-sm uppercase tracking-wider">Non-Functional Requirements</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li><strong>Security:</strong> End-to-end encrypted ballots (Fernet AES-128).</li>
              <li><strong>Accessibility:</strong> Fully WCAG 2.1 AA and keyboard accessible.</li>
              <li><strong>Performance:</strong> Sub-second page rendering speed via Next.js.</li>
              <li><strong>Reliability:</strong> High-concurrency support using Redis queues.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      category: "DATABASE",
      title: "Project Part: Database Design",
      subtitle: "Relational database schema for the e-voting platform",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm">
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-foreground text-base">Relational Schema Layout:</h4>
            <div className="space-y-2 font-mono text-xs text-muted-foreground">
              <div className="p-2 bg-card rounded border border-border">
                <strong>Users:</strong> id, full_name, email, role, wallet_address, pass_hash
              </div>
              <div className="p-2 bg-card rounded border border-border">
                <strong>Elections:</strong> id, title, start_time, end_time, results_public
              </div>
              <div className="p-2 bg-card rounded border border-border">
                <strong>Candidates:</strong> id, election_id, name, party, photo_url
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-4">
            <h4 className="font-bold text-foreground text-base">Votes Schema & Constraints:</h4>
            <div className="p-3 bg-card rounded border border-border font-mono text-xs text-muted-foreground">
              <strong>Votes:</strong> id, voter_hash (SHA-256), election_id, encrypted_payload, cast_at
            </div>
            <div className="bg-primary/5 border border-primary/10 p-3 rounded-lg text-xs leading-relaxed text-muted-foreground">
              <strong>UniqueConstraint (voter_hash, election_id):</strong> Prevents double-voting at the database constraint level. Hashing detaches personal info from the vote payload.
            </div>
          </div>
        </div>
      ),
    },
    {
      category: "SOFTWARE",
      title: "2.3 - 2.4 Frontend & Backend Development (with Web3 Integration)",
      subtitle: "Software structure, routing, and Web3 blockchain architecture",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm">
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h5 className="font-bold text-primary text-base mb-1.5">React, Next.js & Web3:</h5>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Zustand and Axios interceptors handle state & JWT tokens. The Web3 client integrates MetaMask (<code>eth_requestAccounts</code>) and cryptographic <code>personal_sign</code> for secure wallet proof.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h5 className="font-bold text-primary text-base mb-1.5">Django & ECDSA Verification:</h5>
              <p className="text-muted-foreground text-sm leading-relaxed">
                DRF APIs run side-by-side with an asynchronous <code>Web3LoginView</code> backend that performs ECDSA signature verification via <code>eth-account</code> package.
              </p>
            </div>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-foreground text-base mb-2">WebSocket & Solidity Smart Contract:</h5>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Redis and Channels enable real-time result broadcasting. The voting protocol is backed by a custom Solidity smart contract (<code>VoteSecure.sol</code>) implementing Merkle Tree root updates.
              </p>
            </div>
            <div className="p-3 bg-card rounded border border-border text-xs font-mono text-muted-foreground mt-4">
              Web3: personal_sign(msg) ➔ eth-account.recover_message()
            </div>
          </div>
        </div>
      ),
    },
    {
      category: "AUTH",
      title: "Project Part: Security & Verification Mechanisms (Resolved Bug)",
      subtitle: "JWT authentication, tokens cleanup, and hashing flow",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm">
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-4">
            <h4 className="font-bold text-primary text-base">Authorization Flow:</h4>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
              <li>JWT token pairing: Short-lived Access token & persistent Refresh token.</li>
              <li>MFA: Secondary verification via National ID checks.</li>
              <li>Securing API requests against replay attacks.</li>
            </ul>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-bold text-success text-base">Token Clearance Routine (Resolved Bug):</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If a 401 Unauthorized error or refresh timeout occurs, the interceptor now immediately purges the Zustand store and local storage, redirecting the voter to the main landing page (<code>/</code>) to eliminate session hijacking threats.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "MONITORING",
      title: "Project Part: Admin Control Panel & Turnout Analytics",
      subtitle: "Election configuration and real-time visualization dashboard",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3 text-sm">
            <h4 className="font-bold text-base text-primary">Election Controls</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Administrators can define parameters, candidates, timing, and publish or close active voting boards.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3 text-sm">
            <h4 className="font-bold text-base text-primary">Recharts Diagrams</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ballot distribution yields are formatted instantly inside pie charts and bar configurations on the dashboard.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3 text-sm">
            <h4 className="font-bold text-base text-primary">Turnout Analysis</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Voter participation rate is calculated dynamically, giving administrative officers exact metrics.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "USABILITY",
      title: "Usability Part: Usability & UX Evaluation Results",
      subtitle: "Real-world usability test metrics and user feedback statistics",
      content: (
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5">
              <span className="text-3xl font-black text-primary block">92.5%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">User confidence score</span>
            </div>
            <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5">
              <span className="text-3xl font-black text-success block">&lt; 40s</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Ballot submit time</span>
            </div>
            <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5">
              <span className="text-3xl font-black text-amber-500 block">98%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Success completion rate</span>
            </div>
            <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5">
              <span className="text-3xl font-black text-purple-500 block">A+</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">WCAG AA accessibility</span>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl text-sm text-muted-foreground leading-relaxed">
            <strong>Usability Summary:</strong> UX tests show that the 3-stage voting workflow reduces confusion and enables seniors and non-technical voters to participate without errors.
          </div>
        </div>
      ),
    },
    {
      category: "WEB3 PRINCIPLES",
      title: "Conclusions: Core Principles, Pros & Cons of Web3 Architecture",
      subtitle: "Technical analysis and practical concept of blockchain technology",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-sm">
          <div className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/5">
            <h4 className="font-bold text-primary flex items-center gap-2 text-base">
              <Cpu size={18} /> How Web3 Works
            </h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Data is stored not in a single centralized database, but across a network of thousands of independent, interconnected computers (nodes). Every new transaction (vote) is cryptographically signed and appended to the ledger chain, which cannot be modified or reversed.
            </p>
            <div className="p-3 bg-card rounded-lg border border-border text-xs font-mono">
              Block Hash = SHA256(Previous_Hash + Transactions + Nonce)
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} /> Advantages of Web3 (Pros)
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1.5">
                <li><strong>Transparency:</strong> Publicly verifiable ledger open to external observers.</li>
                <li><strong>Immutability:</strong> Records once added cannot be modified or deleted.</li>
                <li><strong>Decentralization:</strong> Resilient network operation even if several servers go down.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
              <h5 className="font-bold text-rose-400 flex items-center gap-2 text-sm">
                <XCircle size={16} /> Disadvantages of Web3 (Cons)
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1.5">
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
      category: "WEB3 ELECTIONS",
      title: "Conclusions: Crucial Role of Web3 in Elections (Pros & Cons)",
      subtitle: "Enhancing democratic transparency and trust in online voting",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-sm">
          <div className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/5">
            <h4 className="font-bold text-primary flex items-center gap-2 text-base">
              <ShieldCheck size={18} /> Why is it crucial for elections?
            </h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              In standard online voting, system admins or database operators hold centralized power and can tamper with ballots. Web3 resolves this with smart contracts:
            </p>
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-xs leading-relaxed text-muted-foreground">
              <strong>End-to-End (E2E) Verifiability:</strong> Every voter can independently verify that their ballot was properly recorded and counted in the ledger via public explorers.
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} /> Web3 Voting Benefits
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1.5">
                <li><strong>Absolute Tamper Resistance:</strong> Ballots are cast on-chain and locked.</li>
                <li><strong>Trustless Counting:</strong> Smart contracts sum votes automatically without human bias.</li>
                <li><strong>Censorship Resistance:</strong> No central authority can block or stop the election.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
              <h5 className="font-bold text-rose-400 flex items-center gap-2 text-sm">
                <XCircle size={16} /> Web3 Voting Drawbacks
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1.5">
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
      category: "INT EXPERIENCE",
      title: "Conclusions: International Experience & Modern E-Voting Needs",
      subtitle: "Case studies from Swiss Post, Voatz, Helios and the demand for trust",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-sm">
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h5 className="font-bold text-primary flex items-center gap-2 text-base">
              <Globe size={16} /> Swiss Post (Switzerland)
            </h5>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Switzerland implemented <strong>universal verifiability</strong>. Voters verify that their votes were correctly processed using cryptographic proofs under a fully open-source audited setup.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h5 className="font-bold text-primary flex items-center gap-2 text-base">
              <Users size={16} /> Voatz (USA)
            </h5>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Conducted pilot blockchain (Hyperledger) voting with biometric verification for military personnel and overseas citizens (e.g., Utah and West Virginia pilots) enabling secure mobile voting.
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
            <h5 className="font-bold text-primary flex items-center gap-2 text-base">
              <TrendingUp size={16} /> Why We Need it Today
            </h5>
            <p className="text-muted-foreground text-sm leading-relaxed">
              With declining public trust in centralized voting authorities, blockchain shifts the foundation of trust from fallible human organizations to verifiable mathematical code, guaranteeing election legitimacy.
            </p>
          </div>
        </div>
      ),
    },
    {
      category: "CONCLUSION",
      title: "Conclusion & Future Horizon",
      subtitle: "Graduation thesis defense key takeaways",
      content: (
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto pt-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-success to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-success/20">
            <Award size={44} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-foreground">
            Thank You for Your Attention!
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            The system is fully developed, UX bottlenecks resolved, Web3 model laid out and simulated, and all metrics confirm usability.
          </p>
          <div className="text-sm font-bold text-primary uppercase tracking-widest mt-4">
            Author: Karimjonova Robiyaxon
          </div>
        </div>
      ),
    }
  ];

  const slides = locale === "uz" ? slidesUz : slidesEn;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary/30 flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow flex px-4 md:px-8 pt-24 pb-20 max-w-7xl mx-auto w-full gap-6 items-stretch">
        {/* Table of Contents Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 shrink-0 hidden lg:flex flex-col bg-card/30 border border-white/5 rounded-3xl p-6 justify-between max-h-[660px] sticky top-24 backdrop-blur-md">
            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                <List size={16} />
                <span>{locale === "uz" ? "MUNDARIJA" : "TABLE OF CONTENTS"}</span>
              </div>
              <nav className="flex flex-col gap-1.5 pt-2">
                {slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-full text-left py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-between border ${
                      currentSlide === index
                        ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-sm"
                        : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <span className="truncate max-w-[180px]">{slide.title}</span>
                    <span className="text-[9px] font-mono opacity-60 uppercase">{slide.category}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="border-t border-white/5 pt-4 text-[10px] text-muted-foreground font-mono text-center">
              {locale === "uz" ? "Tezkor O'tish Paneli" : "Quick Jump Panel"}
            </div>
          </aside>
        )}

        {/* Slides Presentation Container */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={14} />
                {locale === "uz" ? "Asosiy Sahifa" : "Back to Home"}
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors bg-white/5 py-1 px-2.5 rounded-lg border border-white/5"
              >
                <BookOpen size={13} />
                {sidebarOpen
                  ? (locale === "uz" ? "Mundarijani yopish" : "Hide Agenda")
                  : (locale === "uz" ? "Mundarijani ochish" : "Show Agenda")}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleFullscreen}
                className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors bg-white/5 py-1 px-2.5 rounded-lg border border-white/5"
              >
                {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
                {locale === "uz"
                  ? (isFullscreen ? "Ekranni kichraytirish" : "To'liq Ekran (F11)")
                  : (isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode (F11)")}
              </button>
              <div className="text-xs font-mono text-muted-foreground">
                {currentSlide + 1} / {slides.length}
              </div>
            </div>
          </div>

          <div className="glass-premium min-h-[520px] md:min-h-[580px] p-8 md:p-12 rounded-[32px] border-white/10 flex flex-col justify-between relative shadow-2xl overflow-hidden bg-gradient-to-b from-card/30 to-background/50 flex-grow">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[11px] font-bold text-primary tracking-widest uppercase bg-primary/10 py-1 px-2.5 rounded-md border border-primary/20">
                      {slides[currentSlide].category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight mt-3">
                      {slides[currentSlide].title}
                    </h2>
                    {slides[currentSlide].subtitle && (
                      <p className="text-sm text-muted-foreground font-semibold mt-2">
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

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/5">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="btn-secondary py-2 px-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold"
              >
                <ArrowLeft size={15} />
                {locale === "uz" ? "Oldingi" : "Previous"}
              </button>

              {/* Progress Indicator */}
              <div className="hidden sm:flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === i ? "bg-primary w-6" : "bg-white/20 w-2"
                    }`}
                  />
                ))}
              </div>

              {currentSlide < slides.length - 1 ? (
                <button
                  onClick={nextSlide}
                  className="btn-primary py-2 px-4 rounded-xl text-xs font-bold"
                >
                  {locale === "uz" ? "Keyingi" : "Next"}
                  <ArrowRight size={15} />
                </button>
              ) : (
                <Link
                  href="/"
                  className="btn-primary py-2 px-4 rounded-xl text-xs font-bold bg-success hover:bg-success/90 animate-bounce"
                >
                  {locale === "uz" ? "Tugatish" : "Finish"}
                  <Award size={15} />
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
