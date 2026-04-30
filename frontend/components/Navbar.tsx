"use client";
import { useAuthStore } from "@/store/authStore";
import { ShieldCheck, LogOut, LayoutDashboard, Vote, Moon, Sun, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const authT = useTranslations("Auth");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const changeLanguage = (newLocale: "uz" | "ru" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 glass border-b border-border">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck size={18} className="text-white" />
        </div>
        <span className="font-bold text-base tracking-tight text-foreground hidden sm:block">
          Vote<span className="text-primary">Secure</span>
        </span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <div className="relative group">
          <button className="flex items-center gap-1 p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <Globe size={16} />
            <span className="text-xs font-medium uppercase">{locale}</span>
          </button>
          <div className="absolute right-0 mt-1 w-24 py-1 glass rounded-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => changeLanguage(l)}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary transition-colors ${
                  locale === l ? "text-primary font-bold" : "text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title={theme === "dark" ? t("light_mode") : t("dark_mode")}
        >
          {mounted && theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

        {isAuthenticated ? (
          <>
            {user?.role === "admin" ? (
              <Link href="/admin" className="btn-secondary text-xs py-2 px-3 sm:px-4">
                <LayoutDashboard size={14} className="hidden sm:block" />
                <span className="hidden sm:inline">{t("admin")}</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            ) : (
              <Link href="/dashboard" className="btn-secondary text-xs py-2 px-3 sm:px-4">
                <Vote size={14} className="hidden sm:block" />
                <span className="hidden sm:inline">{t("dashboard")}</span>
                <span className="sm:hidden">Dash</span>
              </Link>
            )}
            
            <div className="flex items-center gap-2 sm:gap-3 ml-1">
              <div className="text-right hidden md:block">
                <p className="text-xs font-medium text-foreground">{user?.full_name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-lg bg-secondary hover:bg-danger/10 hover:text-danger flex items-center justify-center transition-colors text-muted-foreground"
                title={t("logout")}
              >
                <LogOut size={14} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-secondary text-xs py-2 px-3 sm:px-4">
              {t("login")}
            </Link>
            <Link href="/register" className="btn-primary text-xs py-2 px-3 sm:px-4 hidden sm:inline-flex">
              {authT("register_btn")}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
