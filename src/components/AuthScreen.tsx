/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowLeft } from 'lucide-react';
import { UserProfile, UserStatus } from '../types';

interface AuthScreenProps {
  onAuthComplete: (profile: UserProfile) => void;
}

type AuthStep = 'welcome' | 'register' | 'otp_verify';

const NexusLawLogo = () => (
  <div className="flex flex-col items-center justify-center py-4 select-none">
    <svg width="200" height="150" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
      {/* Background circle network (nodes and lines) */}
      <circle cx="110" cy="85" r="72" stroke="#BACEDF" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="110" cy="85" r="56" stroke="#C9D6E4" strokeWidth="1" />
      
      {/* Connection Nodes */}
      <circle cx="110" cy="13" r="4" fill="#A8CADF" stroke="white" strokeWidth="1" />
      <circle cx="48" cy="48" r="3" fill="#007AFF" stroke="white" strokeWidth="1" />
      <circle cx="172" cy="48" r="3" fill="#007AFF" stroke="white" strokeWidth="1" />
      <circle cx="38" cy="85" r="4" fill="#BACEDF" stroke="white" strokeWidth="1" />
      <circle cx="182" cy="85" r="4" fill="#BACEDF" stroke="white" strokeWidth="1" />
      <circle cx="50" cy="122" r="3.5" fill="#BACEDF" stroke="white" strokeWidth="1" />
      <circle cx="170" cy="122" r="3.5" fill="#BACEDF" stroke="white" strokeWidth="1" />
      
      {/* Connection spider lines */}
      <line x1="110" y1="13" x2="110" y2="85" stroke="#BACEDF" strokeWidth="0.8" />
      <line x1="48" y1="48" x2="110" y2="85" stroke="#BACEDF" strokeWidth="0.8" />
      <line x1="172" y1="48" x2="110" y2="85" stroke="#BACEDF" strokeWidth="0.8" />
      <line x1="38" y1="85" x2="110" y2="85" stroke="#BACEDF" strokeWidth="0.8" />
      <line x1="182" y1="85" x2="110" y2="85" stroke="#BACEDF" strokeWidth="0.8" />
      <line x1="50" y1="122" x2="110" y2="125" stroke="#C3D4E4" strokeWidth="0.8" />
      <line x1="170" y1="122" x2="110" y2="125" stroke="#C3D4E4" strokeWidth="0.8" />
      
      {/* Open Law Book */}
      <path d="M50,110 Q80,118 110,110 Q140,118 170,110 L165,124 Q135,130 110,123 Q85,130 55,124 Z" fill="#E5E5EA" />
      <path d="M50,105 Q80,113 110,105 Q140,113 170,105 L170,120 Q140,128 110,120 Q80,128 50,120 Z" fill="white" stroke="#1C3F75" strokeWidth="1.5" />
      <path d="M53,101 Q81,109 110,101 Q139,109 167,101 L167,116 Q139,124 110,116 Q81,124 53,116 Z" fill="white" stroke="#1C3F75" strokeWidth="1.5" />
      
      {/* Spine seam line */}
      <line x1="110" y1="101" x2="110" y2="118" stroke="#1C3F75" strokeWidth="2" />
      
      {/* Left page lines */}
      <line x1="62" y1="107" x2="98" y2="110" stroke="#8EA2CD" strokeWidth="1.5" />
      <line x1="62" y1="111" x2="94" y2="113" stroke="#8EA2CD" strokeWidth="1.5" />
      <line x1="62" y1="115" x2="90" y2="116" stroke="#8EA2CD" strokeWidth="1.5" />
      
      {/* Right page lines */}
      <line x1="122" y1="110" x2="158" y2="107" stroke="#8EA2CD" strokeWidth="1.5" />
      <line x1="126" y1="113" x2="158" y2="111" stroke="#8EA2CD" strokeWidth="1.5" />
      <line x1="130" y1="116" x2="158" y2="115" stroke="#8EA2CD" strokeWidth="1.5" />
      
      {/* Book base pedestal */}
      <rect x="90" y="122" width="40" height="5" fill="#5C3A21" rx="1.5" />
      <rect x="84" y="127" width="52" height="3.5" fill="#1C1C1E" rx="1" />

      {/* Gavel Head & Handle */}
      <g transform="rotate(28 110 82)">
        {/* Mahogany wood gavel head cylinder shapes */}
        <rect x="94" y="52" width="30" height="17" fill="#882C24" rx="2.5" stroke="#481814" strokeWidth="1.2" />
        {/* Shiny gold band ornament bar in center */}
        <rect x="106" y="52" width="6" height="17" fill="#E6C15C" />
        <ellipse cx="94" cy="60.5" rx="2.5" ry="8.5" fill="#481814" />
        <ellipse cx="124" cy="60.5" rx="2.5" ry="8.5" fill="#481814" />
        
        {/* Handle stem projection */}
        <rect x="108" y="69" width="6.5" height="64" fill="#6A221C" rx="1.5" stroke="#3A120E" strokeWidth="0.8" />
        {/* Handle gold element cap */}
        <rect x="108" y="128" width="6.5" height="4" fill="#E6C15C" rx="0.5" />
      </g>
    </svg>
    <div className="text-center mt-2.5">
      <h2 className="text-[25px] font-black tracking-[0.22em] text-[#1D1D23] font-serif leading-none">NEXUS LAW</h2>
    </div>
  </div>
);

export default function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>('welcome');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('085719483329');
  
  // Custom user status selections aligned with standard mockups ("Umum", "Akademisi", "Praktisi")
  const [selectedProfileStatus, setSelectedProfileStatus] = useState<'Umum' | 'Akademisi' | 'Praktisi'>('Umum');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [receivedOtp, setReceivedOtp] = useState('8472'); // Simulator code
  const [countdownSeconds, setCountdownSeconds] = useState(109); // 1 minute 49 seconds
  const [errorMsg, setErrorMsg] = useState('');
  const [showWhatsAppBubble, setShowWhatsAppBubble] = useState(false);

  // Countdown timer simulation for OTPkirim ulang matching ( 1:49 menit)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp_verify' && countdownSeconds > 0) {
      timer = setInterval(() => {
        setCountdownSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdownSeconds]);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')} menit`;
  };

  const handleSocialLogin = (platform: 'google' | 'apple') => {
    setName(platform === 'google' ? 'Aris Setiawan' : 'Aris Setiawan');
    setEmail(platform === 'google' ? 'aris.setiawan@gmail.com' : 'aris.s@icloud.com');
    setPhone('085719328229');
    
    // Simulate immediate WhatsApp SMS trigger for fast experience
    const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
    setReceivedOtp(mockCode);
    setShowWhatsAppBubble(true);
    setStep('otp_verify');
  };

  const handleGoToRegister = () => {
    setStep('register');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Alamat Email wajib diisi.');
      return;
    }
    setErrorMsg('');
    const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
    setReceivedOtp(mockCode);
    setShowWhatsAppBubble(true);
    setStep('otp_verify');
  };

  const handleOtpInput = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto-advance cursor forward
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = () => {
    // Standard validation
    const entered = otpCode.slice(0, 4).join(''); // Mockup 2 suggests a short OTP or full, let's allow either
    // Since we receive a 4 digit mock code or entered digits we will authorize directly
    const finalStatus: UserStatus = 
      selectedProfileStatus === 'Umum' ? 'Rakyat Umum' : 
      selectedProfileStatus === 'Akademisi' ? 'Akademisi / Ahli' : 'Lembaga Hukum';

    const finalProfile: UserProfile = {
      name: name || 'Aris Setiawan',
      email: email || 'aris.setiawan@gmail.com',
      phone: phone,
      status: finalStatus,
      avatarUrl: selectedProfileStatus === 'Akademisi' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        : selectedProfileStatus === 'Praktisi'
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };

    onAuthComplete(finalProfile);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-[#1C1C1E] relative h-full font-sans select-none overflow-y-auto no-scrollbar">
      
      {/* Dynamic WhatsApp OTP simulation message toast */}
      <AnimatePresence>
        {showWhatsAppBubble && (
          <motion.div
            initial={{ opacity: 0, y: -65, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.94 }}
            className="absolute top-4 left-4 right-4 z-50 bg-[#1C1C1E] text-white rounded-2xl p-4 shadow-[0_12px_24px_rgba(0,0,0,0.25)] border border-white/10"
          >
            <div className="flex items-start gap-2.5 text-left">
              <div className="bg-[#34C759] p-1.5 text-white rounded-lg font-bold text-[9px] uppercase tracking-wide tracking-tight">
                Nexus
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#34C759] tracking-wider uppercase font-mono">WhatsApp Verifikasi</span>
                  <span className="text-[9px] text-[#AEAEB2]">Baru saja</span>
                </div>
                <p className="text-[10.5px] font-medium leading-relaxed mt-1 text-zinc-100">
                  Kode OTP Anda adalah <strong className="text-[#FF9500] bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">{receivedOtp}</strong>. Masukkan kode ini untuk mengonfirmasi partisipasi publik.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: ONBOARDING ACCORDING TO TARGET MOCKUP 1 */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-7 text-center py-4"
            >
              {/* Custom High-Fidelity Gavel & Open Law Book Vector Logo with Wide-Spaced NEXUS LAW Title */}
              <NexusLawLogo />

              {/* Subheading in Bold */}
              <div className="py-1">
                <h3 className="text-lg font-extrabold text-[#1C1C1E] tracking-tight">
                  Selamat datang di Nexus Law!
                </h3>
              </div>

              {/* Action Buttons styled like gray and blue pill boxes of Mockup 1 */}
              <div className="space-y-3.5 max-w-[280px] mx-auto">
                
                {/* Lanjutkan dengan Google */}
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="w-full flex items-center justify-center gap-3.5 bg-[#E3E3E8] hover:bg-[#D1D1D6] text-[#1C1C1E] font-semibold py-3 px-5 rounded-full text-xs transition-transform active:scale-[0.98] cursor-pointer shadow-sm"
                >
                  {/* Flat color Google Logo Icon matching layout */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.173-2.763-6.173-6.173s2.763-6.173 6.173-6.173c1.558 0 2.978.579 4.077 1.53l3.074-3.074C19.122 2.158 15.932 1 12.24 1 6.046 1 1 6.046 1 12.24s5.046 11.24 11.24 11.24c5.783 0 10.741-4.144 11.583-9.5H12.24z"
                    />
                  </svg>
                  <span>Lanjutkan dengan Google</span>
                </button>

                {/* Lanjutkan dengan Apple ID */}
                <button
                  onClick={() => handleSocialLogin('apple')}
                  className="w-full flex items-center justify-center gap-3.5 bg-[#E3E3E8] hover:bg-[#D1D1D6] text-[#1C1C1E] font-semibold py-3 px-5 rounded-full text-xs transition-transform active:scale-[0.98] cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current text-[#1C1C1E] shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.55 2.95-1.39z"/>
                  </svg>
                  <span>Lanjutkan dengan Apple ID</span>
                </button>

                {/* Or Divider */}
                <div className="text-[11px] font-bold text-[#8E8E93] uppercase py-1">
                  Or
                </div>

                {/* Daftar dengan Email */}
                <button
                  onClick={handleGoToRegister}
                  className="w-full bg-[#6B84C3] hover:bg-[#5971AB] text-white font-black py-4 px-5 rounded-full text-[13px] tracking-wide transition-all active:scale-[0.97] cursor-pointer shadow-[0_4px_12px_rgba(107,132,195,0.25)]"
                >
                  Daftar dengan Email
                </button>
              </div>

              {/* Suffix link centered */}
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-[#8E8E93]">
                  Sudah punya akun?{' '}
                  <span
                    onClick={() => handleSocialLogin('google')}
                    className="text-[#5971AB] hover:underline hover:text-[#007AFF] cursor-pointer"
                  >
                    Masuk
                  </span>
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: REGISTER FORM INPUT */}
          {step === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left py-2"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <button
                  onClick={() => setStep('welcome')}
                  className="p-1 text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <span className="text-[11px] font-bold text-[#8E8E93] uppercase">Mulai Verifikasi</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#1C1C1E] tracking-tight">Data Partisipan</h3>
                <p className="text-xs text-[#8E8E93] font-medium leading-relaxed pr-8">
                  Konfirmasikan data pribadi Anda sebelum menyalurkan suara / komentar aspirasi draf hukum legislatif.
                </p>
              </div>

              {errorMsg && (
                <p className="text-xs text-[#FF3B30] bg-[#FF3B30]/8 p-2.5 rounded-lg border border-[#FF3B30]/15 text-center font-bold">
                  {errorMsg}
                </p>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wide">Nama Lengkap Partisipan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Aris Setiawan, S.H."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F2F2F7] border border-[#D1D1D6]/60 rounded-xl px-4.5 py-3 text-xs focus:outline-none focus:border-[#40A9FF] font-semibold text-[#1C1C1E] placeholder:text-[#AEAEB2]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wide">Alamat Email Resmi</label>
                  <input
                    type="email"
                    placeholder="contoh@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F2F2F7] border border-[#D1D1D6]/60 rounded-xl px-4.5 py-3 text-xs focus:outline-none focus:border-[#40A9FF] font-semibold text-[#1C1C1E] placeholder:text-[#AEAEB2]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wide">Nomor WhatsApp Seluler</label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-3 text-xs font-bold text-[#8E8E93]">+62</span>
                    <input
                      type="tel"
                      placeholder="85719483329"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#F2F2F7] border border-[#D1D1D6]/60 rounded-xl pl-12 pr-4 py-3 text-xs focus:outline-none focus:border-[#40A9FF] font-semibold text-[#1C1C1E] placeholder:text-[#AEAEB2]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6B84C3] hover:bg-[#5971AB] text-white font-heavy py-3.5 px-6 rounded-full text-xs font-bold transition-all shadow-md active:scale-98"
                >
                  Kirim Kode OTP WhatsApp
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: OTP VERIFICATION AND STATUS SELECTOR ALIGNED WITH TARGET MOCKUP 2 */}
          {step === 'otp_verify' && (
            <motion.div
              key="otp_verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left py-2"
            >
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setStep('register')}
                  className="p-1 text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4.5 h-4.5" strokeWidth={2.5} />
                </button>
                <h3 className="text-[17.5px] font-black tracking-tight text-[#1C1C1E]">
                  Verifikasi Nomor Handphone
                </h3>
              </div>

              {/* Subtitle text ke [phone prefix highlights in pink/purple] */}
              <p className="text-[11.5px] text-[#3A3A3C] font-semibold leading-relaxed">
                Masukkan kode OTP yang telah dikirim melalui WhatsApp ke{' '}
                <span className="text-[#A21CAF] font-black font-mono">
                  {phone.slice(0, 4)}***
                </span>
              </p>

              {/* 5 Indicator square box matrix */}
              <div className="flex justify-between gap-1.5 py-1">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        const prevInput = document.getElementById(`otp-input-${idx - 1}`) as HTMLInputElement;
                        if (prevInput) {
                          prevInput.focus();
                          const newOtp = [...otpCode];
                          newOtp[idx - 1] = '';
                          setOtpCode(newOtp);
                        }
                      }
                    }}
                    placeholder=" "
                    className="w-11 h-12 bg-white border border-[#A6A6A6] text-center text-md font-bold font-mono text-[#1C1C1E] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] rounded-lg shadow-sm"
                  />
                ))}
              </div>

              {/* Timer text simulation for ("Kirim ulang ( 1:49 menit)") */}
              <div className="text-center md:text-left py-0.5">
                <p className="text-[11px] text-[#8E8E93] font-bold">
                  Tidak menerima OTP{' '}
                  <span className="text-[#007AFF] hover:underline cursor-pointer">
                    Kirim ulang
                  </span>{' '}
                  ( {formatCountdown(countdownSeconds)} )
                </p>
              </div>

              {/* Action Button: Verifikasi */}
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full bg-[#8EA2CD] hover:bg-[#6B84C3] hover:shadow-lg text-white font-extrabold py-3.5 rounded-full text-xs transition-all tracking-wide shadow-sm"
                >
                  Verifikasi
                </button>
              </div>

              {/* Chance limits information warning */}
              <div className="text-center py-0.5 text-[10px] text-[#AEAEB2] font-semibold leading-relaxed">
                Kamu memiliki 3 kali kesempatan untuk memasukkan kode OTP
              </div>

              {/* Status Akun header section with 3 Cyan pill switches as requested in Mockup 2 */}
              <div className="pt-2 border-t border-[#D1D1D6]/40 space-y-2.5">
                <h4 className="text-xs font-black text-[#1C1C1E] tracking-tight uppercase">
                  Status Akun
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'Umum', label: 'Umum' },
                    { key: 'Akademisi', label: 'Akademisi' },
                    { key: 'Praktisi', label: 'Praktisi' },
                  ].map((item) => {
                    const isSelected = selectedProfileStatus === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedProfileStatus(item.key as any)}
                        className={`py-3 px-1 rounded-xl text-xs font-black tracking-wide text-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#5EC4FF] text-white border-[#5EC4FF] shadow-[0_3px_10px_rgba(94,196,255,0.3)]'
                            : 'bg-white hover:bg-[#F2F2F7] text-[#5C5C5F] border-[#D1D1D6]/70'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Security badge block */}
      <div className="flex gap-2 items-center justify-center py-2 border-t border-slate-100 mt-2 text-[#8E8E93]">
        <Shield className="w-3.5 h-3.5 text-[#34C759]" />
        <span className="text-[9px] uppercase tracking-wider font-extrabold">Tembok Keamanan Terenkripsi SSL</span>
      </div>

    </div>
  );
}
