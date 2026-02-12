
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const { login, loading } = useAuth();
    const { language, changeLanguage, dir } = useLanguage();
    const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row font-sans selection:bg-blue-100 bg-[#F1F5F9]">

            {/* LEFT SIDE - BRANDING */}
            <div className="hidden lg:flex lg:w-[45%] relative p-12 flex-col justify-between text-white overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/warehouse-bg.jpg')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a2e5c]/95 via-[#061a33]/90 to-[#030d1a]/95"></div>
                </div>

                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center mb-6 shadow-xl">
                        <svg className="w-8 h-8 text-[#00A3E1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight leading-tight">Production<br /><span className="font-light opacity-80 text-3xl">Reporting System</span></h1>
                    <div className="h-1 w-16 bg-[#00A3E1] mt-4 rounded-full"></div>

                    <div className="mt-10">
                        <p className="text-3xl font-medium mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>پروڈکشن رپورٹنگ سسٹم</p>
                        <p className="text-gray-300 text-sm max-w-sm leading-relaxed opacity-80">Seamlessly manage production metrics, track efficiency, and generate real-time reports.</p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - COMPACT LOGIN CARD */}
            <div className="w-full lg:w-[55%] flex flex-col justify-center items-center relative py-10 px-6" dir={dir}>

                {/* Language Switcher */}
                <div className="absolute top-6 right-6 flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 scale-90">
                    <button onClick={() => changeLanguage('en')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'en' ? 'bg-[#00A3E1] text-white shadow-md' : 'text-gray-400'}`}>ENG</button>
                    <button onClick={() => changeLanguage('ur')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'ur' ? 'bg-[#00A3E1] text-white shadow-md' : 'text-gray-400'}`}>اردو</button>
                </div>

                {/* --- COMPACT CARD START --- */}
                <div className="w-full max-w-[440px] bg-white rounded-[32px] px-8 py-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] border border-white/50">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Welcome Back</h2>
                        <p className="text-[#00A3E1] text-2xl font-medium mt-1" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>خوش آمدید</p>
                        <p className="text-gray-400 text-xs mt-1">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end px-1">
                                <Label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Email Address</Label>
                                <span className="text-gray-300 text-[10px]">ای میل پتہ</span>
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                <Input
                                    type="email"
                                    placeholder="user@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="pl-11 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end px-1">
                                <Label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Password</Label>
                                <span className="text-gray-300 text-[10px]">پاس ورڈ</span>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="pl-11 pr-11 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#00A3E1]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot - Tight Spacing */}
                        <div className="flex justify-between items-center text-xs px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                                    className="w-4 h-4 rounded border-gray-300 text-[#00A3E1]" />
                                <span className="text-gray-500 font-bold">Remember me</span>
                            </label>
                            <div className="text-right">
                                <Link href="#" className="text-[#00A3E1] font-bold hover:underline">Forgot password?</Link>
                                <p className="text-[#00A3E1] text-[9px]" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>پاس ورڈ بھول گئے؟</p>
                            </div>
                        </div>

                        {/* LOGIN BUTTON - Fixed Height */}
                        <Button type="submit" disabled={loading} className="w-full h-14 bg-[#00A3E1] hover:bg-[#0089bd] text-white rounded-xl shadow-lg shadow-blue-100 mt-2 disabled:opacity-50">
                            <div className="flex flex-col items-center leading-tight">
                                <span className="text-sm font-black tracking-widest">LOGIN TO DASHBOARD</span>
                                <span className="text-xs font-medium opacity-90" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>ڈیش بورڈ میں لاگ ان کریں</span>
                            </div>
                        </Button>
                    </form>

                    {/* Footer - Reduced Margin */}
                    <div className="mt-8 pt-6 border-t border-gray-50 text-center space-y-2">
                        <p className="text-gray-400 text-[11px] font-medium flex items-center justify-center gap-2">
                            Contact Admin for Access <span className="text-gray-500" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>ایڈمن سے رابطہ کریں</span>
                        </p>
                        <p className="text-gray-200 text-[9px] font-black tracking-[0.2em] uppercase">
                            V2.4.0 © 2023 PRODUCTION SYSTEMS
                        </p>
                    </div>
                </div>
                {/* --- COMPACT CARD END --- */}

            </div>
        </div>
    );
}