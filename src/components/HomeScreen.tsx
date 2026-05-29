/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Flame, ArrowRight, Gavel, Users2, BarChart3, HelpCircle, MessageCircle, FileText, Bell, BellOff, Play, Radio } from 'lucide-react';
import { UserProfile, LegislationItem } from '../types';
import { TRENDING_CASES } from '../data/mockLawData';

interface HomeScreenProps {
  user: UserProfile;
  onNavigateToTab: (tab: 'home' | 'legislasi' | 'partisipasi' | 'statistik') => void;
  onSearchSelect: (searchTerm: string) => void;
  onSelectLegislationId: (id: string | null) => void;
  legislationList?: LegislationItem[];
  monitoredRuuIds?: string[];
  onTriggerSimulatedStatusChange?: (id: string) => void;
}

export default function HomeScreen({
  user,
  onNavigateToTab,
  onSearchSelect,
  onSelectLegislationId,
  legislationList = [],
  monitoredRuuIds = [],
  onTriggerSimulatedStatusChange,
}: HomeScreenProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearchSelect(searchValue);
      onNavigateToTab('legislasi');
    }
  };

  const mapTrendingToId = (term: string): string => {
    if (term.includes('Perampasan Aset')) return 'ruu-perampasan-aset';
    if (term.includes('ITE')) return 'uu-ite-1-2024';
    if (term.includes('KUHP')) return 'ruu-kuhp-edit';
    if (term.includes('Cipta Kerja')) return 'uu-cipta-kerja';
    if (term.includes('PDP')) return 'uu-pdp-27-2022';
    return '';
  };

  const handleTrendingClick = (term: string) => {
    const id = mapTrendingToId(term);
    if (id) {
      onSelectLegislationId(id);
      onNavigateToTab('legislasi');
    } else {
      onSearchSelect(term);
      onNavigateToTab('legislasi');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F2F2F7] pb-8 text-[#1C1C1E] font-sans">
      {/* Top Welcome iOS-styled bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#D1D1D6]/50 p-5 pt-8 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-[#8E8E93] tracking-wider font-mono">SELAMAT DATANG</span>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-[#1C1C1E] font-heading">{user.name}</h2>
              <span className="bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/20 text-[9px] py-0.5 px-2.5 rounded-full font-mono font-bold uppercase tracking-wider">
                {user.status}
              </span>
            </div>
          </div>
          
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full border border-[#D1D1D6] object-cover shadow-sm"
          />
        </div>

        {/* Dynamic Law Search Input */}
        <form onSubmit={handleSearchSubmit} className="mt-4 relative">
          <input
            type="text"
            placeholder="Cari RUU, Nomor UU, pasal, atau isu..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-[#E5E5EA]/60 border border-[#D1D1D6]/40 focus:border-[#007AFF] text-[#1C1C1E] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none transition-colors placeholder:text-[#8E8E93]"
          />
          <Search className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-[#8E8E93]" />
          {searchValue && (
            <button
              type="submit"
              className="absolute right-3 top-2 bg-[#007AFF] text-white px-2.5 py-1 text-[10px] font-bold rounded-lg hover:bg-[#0051A8] transition-colors"
            >
              Cari
            </button>
          )}
        </form>
      </div>

      {/* Main Services Quick Items */}
      <div className="px-5 mt-6">
        <h3 className="text-[10px] font-bold font-mono tracking-widest text-[#8E8E93] uppercase mb-3">
          MENU UTAMA LAYANAN
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          
          {/* Button: RUU & Legislasi */}
          <button
            onClick={() => onNavigateToTab('legislasi')}
            className="bg-white border border-[#D1D1D6]/60 hover:bg-slate-50 rounded-2xl p-3.5 text-left flex flex-col justify-between h-28 transition-all active:scale-95 text-xs select-none group shadow-sm"
          >
            <div className="bg-[#007AFF]/10 text-[#007AFF] p-2 rounded-xl w-fit group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#1C1C1E] block font-heading">RUU &amp;</span>
              <span className="text-[#8E8E93] block mt-0.5 font-semibold text-[11px]">Legislasi</span>
            </div>
          </button>

          {/* Button: Partisipasi Publik */}
          <button
            onClick={() => onNavigateToTab('partisipasi')}
            className="bg-white border border-[#D1D1D6]/60 hover:bg-slate-50 rounded-2xl p-3.5 text-left flex flex-col justify-between h-28 transition-all active:scale-95 text-xs select-none group shadow-sm"
          >
            <div className="bg-[#34C759]/10 text-[#34C759] p-2 rounded-xl w-fit group-hover:bg-[#34C759] group-hover:text-white transition-colors">
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#1C1C1E] block font-heading">Partisipasi</span>
              <span className="text-[#8E8E93] block mt-0.5 font-semibold text-[11px]">Publik</span>
            </div>
          </button>

          {/* Button: Statistik Hukum */}
          <button
            onClick={() => onNavigateToTab('statistik')}
            className="bg-white border border-[#D1D1D6]/60 hover:bg-slate-50 rounded-2xl p-3.5 text-left flex flex-col justify-between h-28 transition-all active:scale-95 text-xs select-none group shadow-sm"
          >
            <div className="bg-[#AF52DE]/10 text-[#AF52DE] p-2 rounded-xl w-fit group-hover:bg-[#AF52DE] group-hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#1C1C1E] block font-heading">Statistik</span>
              <span className="text-[#8E8E93] block mt-0.5 font-semibold text-[11px]">Hukum</span>
            </div>
          </button>

        </div>
      </div>

      {/* Real-time RUU Monitoring & Live Notification Simulation Widget */}
      <div className="px-5 mt-6">
        <div className="bg-white border border-[#D1D1D6]/60 rounded-2xl p-4.5 shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2.5 border-b border-[#D1D1D6]/45">
            <div className="flex items-center gap-1.5 text-[#007AFF] font-bold text-xs font-mono tracking-wider">
              <Radio className="w-4 h-4 text-[#FF3B30] animate-pulse" />
              <span>PEMANTAUAN RUU AKTIF</span>
            </div>
            <span className="text-[9px] bg-[#FF3B30]/10 text-[#FF3B30] font-bold py-0.5 px-2 rounded-full border border-[#FF3B30]/20 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-ping" />
              LIVE FEED
            </span>
          </div>

          <p className="text-[11px] text-[#8E8E93] leading-relaxed text-left">
            Daftar draf legislasi yang Anda pantau sedang tersambung ke jaringan transkripsi parlemen. Tekan tombol <strong className="text-[#1C1C1E]">Simulasikan</strong> untuk mempercepat perubahan status hukum dan memicu alarm iOS Push Banner.
          </p>

          <div className="space-y-2.5 pt-1.5">
            {monitoredRuuIds.length === 0 ? (
              <div className="p-4 bg-[#F2F2F7] rounded-xl text-center border border-dashed border-[#D1D1D6]/70">
                <BellOff className="w-5 h-5 text-[#AEAEB2] mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-[#8E8E93]">Tidak Ada RUU yang Dipantau</p>
                <p className="text-[9px] text-[#AEAEB2] mt-0.5">Kunjungi menu RUU &amp; Legislasi lalu klik tombol Bell untuk memantau.</p>
                <button
                  onClick={() => onNavigateToTab('legislasi')}
                  className="mt-3 inline-flex items-center gap-1 bg-[#007AFF] text-white font-bold text-[9px] py-1.5 px-3 rounded-lg hover:bg-[#0051A8] transition-colors shadow-sm cursor-pointer"
                >
                  Buka RUU &amp; Legislasi
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {monitoredRuuIds.map(ruuId => {
                  const item = legislationList.find(x => x.id === ruuId);
                  if (!item) return null;
                  return (
                    <div
                      key={ruuId}
                      className="p-3 bg-slate-50 border border-[#D1D1D6]/45 rounded-xl flex items-center justify-between gap-3 text-left hover:border-[#007AFF]/20 transition-all cursor-pointer"
                      onClick={() => {
                        onSelectLegislationId(ruuId);
                        onNavigateToTab('legislasi');
                      }}
                    >
                      <div className="flex-1 space-y-1 overflow-hidden pr-2">
                        <div className="flex items-center gap-1.5 leading-none">
                          <span className="text-[7.5px] font-black px-1.5 py-0.5 bg-[#D4AF37]/15 text-[#AB8212] rounded border border-[#D4AF37]/30 font-mono uppercase tracking-wide flex items-center gap-0.5">
                            <Bell className="w-2 h-2 fill-current" />
                            DIPANTAU
                          </span>
                          <span className="text-[8.5px] bg-[#007AFF]/8 text-[#007AFF] font-bold px-1.5 py-0.5 rounded border border-[#007AFF]/15 tracking-tight uppercase">
                            {item.currentStage || 'Pembahasan'}
                          </span>
                        </div>
                        <h4 className="text-[10.5px] font-bold text-[#1C1C1E] truncate font-heading leading-tight mt-0.5">
                          {item.title}
                        </h4>
                      </div>

                      {/* Simulator Trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerSimulatedStatusChange?.(ruuId);
                        }}
                        className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white hover:text-[#D4AF37] font-bold text-[9px] py-1.5 px-2.5 rounded-lg border border-black/10 flex items-center gap-1 shadow-sm shrink-0 transition-all active:scale-95 cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Simulasikan
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trending Case Area */}
      <div className="px-5 mt-6">
        <div className="bg-white border border-[#D1D1D6]/70 rounded-2xl p-4.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#FF9500] font-bold text-xs mb-3 font-mono tracking-wider">
            <Flame className="w-4 h-4 text-[#FF9500] animate-bounce" />
            <span>TRENDING KAMUS HARI INI</span>
          </div>
          
          <div className="space-y-2">
            {TRENDING_CASES.map((term, index) => (
              <button
                key={index}
                onClick={() => handleTrendingClick(term)}
                className="w-full flex items-center justify-between text-left py-2 px-3 bg-[#F2F2F7] hover:bg-[#E5E5EA] hover:border-[#007AFF]/20 rounded-xl border border-[#D1D1D6]/20 text-xs text-[#1C1C1E] transition-all font-medium"
              >
                <span className="truncate pr-4 flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 bg-white border border-[#D1D1D6]/40 rounded font-bold text-[#FF9500] font-mono">
                    #{index + 1}
                  </span>
                  {term}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Law Integrity Education Area */}
      <div className="px-5 mt-6">
        <h3 className="text-[10px] font-bold font-mono tracking-widest text-[#8E8E93] uppercase mb-3 text-left">
          MEKANISME LEGAL DATA INTEGRITY
        </h3>
        
        <div className="bg-white border border-[#D1D1D6]/60 rounded-2xl p-4 text-xs space-y-4 shadow-sm">
          <div className="flex gap-3">
            <div className="bg-[#34C759]/10 text-[#34C759] p-2.5 h-fit rounded-xl border border-[#34C759]/15">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1E] font-heading">Verifikasi Berbasis Data Riil</h4>
              <p className="text-[11px] text-[#3A3A3C] mt-1 leading-relaxed font-normal">
                Setiap draf RUU diselaraskan langsung dari pelapor Biro Hukum Kemenkumham, DPR RI, dan Baleg untuk menghindari penyebaran hoaks berita perundang-undangan.
              </p>
            </div>
          </div>

          <div className="h-px bg-[#D1D1D6]/50" />

          <div className="flex gap-3">
            <div className="bg-[#007AFF]/10 text-[#007AFF] p-2.5 h-fit rounded-xl border border-[#007AFF]/15">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1E] font-heading">Kredibilitas Profil Bergaransi</h4>
              <p className="text-[11px] text-[#3A3A3C] mt-1 leading-relaxed font-normal">
                Opini forum kami validasi berasaskan verifikasi nomor handphone WhatsApp & deklarasi status akun demi mewujudkan debat hukum bermartabat menuju Indonesia Emas 2045.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Banner */}
      <div className="px-5 mt-8 text-center space-y-1">
        <p className="text-[9px] uppercase tracking-wider font-mono text-[#8E8E93]">
          Nexus Law © 2026. Aliansi Transparansi Demokrasi Inklusif
        </p>
        <p className="text-[8px] text-[#AEAEB2]">
          Didukung oleh Universitas Mataram & Kementerian Hukum RI
        </p>
      </div>

    </div>
  );
}
