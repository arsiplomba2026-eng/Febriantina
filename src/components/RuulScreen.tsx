/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gavel, Calendar, Users, Eye, ArrowRight, Download, CheckCircle, Info, ExternalLink, Bell, BellOff } from 'lucide-react';
import { LegislationItem, LegislativeStage } from '../types';
import { INITIAL_LEGISLATION } from '../data/mockLawData';

interface RuulScreenProps {
  initialSearchQuery?: string;
  selectedLegislationId?: string | null;
  onSelectLegislationId: (id: string | null) => void;
  onNavigateToTab: (tab: 'home' | 'legislasi' | 'partisipasi' | 'statistik') => void;
  legislationList?: LegislationItem[];
  monitoredRuuIds?: string[];
  onToggleMonitorRuu?: (id: string) => void;
}

export default function RuulScreen({
  initialSearchQuery = '',
  selectedLegislationId = null,
  onSelectLegislationId,
  onNavigateToTab,
  legislationList = INITIAL_LEGISLATION,
  monitoredRuuIds = [],
  onToggleMonitorRuu,
}: RuulScreenProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'prioritas' | 'terbaru' | 'berlaku'>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [downloadSuccessful, setDownloadSuccessful] = useState<string | null>(null);

  // Sync internal search state if initial search query changed
  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleDownload = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadSuccessful(id);
    setTimeout(() => {
      setDownloadSuccessful(null);
    }, 3000);
  };

  const filteredLegislation = legislationList.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.number && item.number.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedItem = legislationList.find((item) => item.id === selectedLegislationId);

  return (
    <div className="flex-1 flex flex-col bg-[#F2F2F7] pb-8 text-[#1C1C1E] font-sans">
      
      {/* Title Bar */}
      <div className="bg-white/80 border-b border-[#D1D1D6]/55 p-4 pt-6 sticky top-0 z-20 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <Gavel className="w-5 h-5 text-[#007AFF]" />
          <h2 className="text-sm font-bold text-[#1C1C1E] font-heading">Daftar RUU &amp; Legislasi</h2>
        </div>
        
        {/* Category Tabs */}
        <div className="flex gap-1.5 mt-3.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'Semua draf' },
            { id: 'prioritas', label: 'RUU Prioritas' },
            { id: 'terbaru', label: 'Terbaru' },
            { id: 'berlaku', label: 'Sedang Berlaku' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id as any);
                onSelectLegislationId(null);
              }}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap border shrink-0 transition-all ${
                activeCategory === tab.id
                  ? 'bg-[#007AFF] text-white border-[#007AFF] shadow-sm'
                  : 'bg-white text-[#8E8E93] border-[#D1D1D6] hover:border-[#8E8E93]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Local search bar component */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Cari draf RUU (contoh: Aset, ITE, Darurat)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#E5E5EA]/60 border border-[#D1D1D6]/40 focus:border-[#007AFF] text-[#1C1C1E] pl-9 pr-8 py-2 rounded-xl text-xs focus:outline-none placeholder:text-[#8E8E93] transition-all font-sans"
          />
          <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-[#8E8E93]" />
          
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 w-4 h-4 rounded-full bg-[#AEAEB2]/30 hover:bg-[#8E8E93]/40 flex items-center justify-center text-[8px] font-black text-[#5C5C5F] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Filtering Suggestions */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pr-2">
          <span className="text-[8px] text-[#8E8E93] font-black uppercase font-mono tracking-wider shrink-0">Saran:</span>
          {[
            { tag: 'Aset', label: '💰 Aset' },
            { tag: 'Digital', label: '💻 Digital' },
            { tag: 'ITE', label: '📱 ITE' },
            { tag: 'Kesehatan', label: '🏥 Medis' },
            { tag: 'Cipta', label: '💼 Kerja' },
          ].map((s) => (
            <button
              key={s.tag}
              onClick={() => {
                setSearchQuery(s.tag);
                onSelectLegislationId(null); // Return to list view to inspect results
              }}
              className={`text-[9px] font-bold px-2 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                searchQuery.toLowerCase() === s.tag.toLowerCase()
                  ? 'bg-[#007AFF]/15 text-[#007AFF] border-[#007AFF]'
                  : 'bg-white text-[#5C5C5F] border-[#D1D1D6]/60 hover:bg-[#E5E5EA]/40'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Real-time Result Statistics */}
        {searchQuery && (
          <div className="flex justify-between items-center mt-2 px-0.5 border-t border-[#D1D1D6]/20 pt-1.5">
            <span className="text-[9px] font-medium text-[#8E8E93] flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 bg-[#34C759] rounded-full" />
              Menampilkan {filteredLegislation.length} hasil pencarian
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[9px] font-bold text-[#FF3B30] hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex-1">
        <AnimatePresence mode="wait">
          {selectedItem ? (
            /* Expended Detail screen inside mobile viewport */
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-5"
            >
              {/* Back button */}
              <button
                onClick={() => onSelectLegislationId(null)}
                className="text-xs text-[#007AFF] hover:text-[#0051A8] flex items-center gap-1.5 font-bold mb-2 cursor-pointer"
              >
                ← Kembali ke List Regulasi
              </button>

              <div className="bg-white border border-[#D1D1D6]/60 rounded-2xl p-4.5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] px-2.5 py-0.5 bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/15 rounded-full font-mono uppercase font-bold tracking-wider">
                    {selectedItem.number || selectedItem.category}
                  </span>
                  <span className="text-[10px] text-[#8E8E93] flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#8E8E93]" />
                    Tahun {selectedItem.year}
                  </span>
                </div>

                <div className="space-y-1 text-left">
                  <h3 className="text-base font-bold font-heading text-[#1C1C1E] leading-snug">{selectedItem.title}</h3>
                  {selectedItem.proponents && (
                    <p className="text-[10px] text-[#8E8E93] font-medium mb-2.5">
                      Inisiator: <span className="text-[#1C1C1E] font-bold">{selectedItem.proponents.join(', ')}</span>
                    </p>
                  )}
                  
                  {/* Interactive Pantau RUU Toggle Button */}
                  <button
                    onClick={() => onToggleMonitorRuu?.(selectedItem.id)}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-[10px] rounded-xl font-bold border transition-colors cursor-pointer ${
                      monitoredRuuIds.includes(selectedItem.id)
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#AB8212]'
                        : 'bg-[#007AFF]/5 border-[#007AFF]/20 text-[#007AFF] hover:bg-[#007AFF]/10'
                    }`}
                  >
                    <Bell className={`w-3.5 h-3.5 ${monitoredRuuIds.includes(selectedItem.id) ? 'fill-[#AB8212]' : ''}`} />
                    {monitoredRuuIds.includes(selectedItem.id) 
                      ? 'Sedang Dipantau (Klik Berhenti)' 
                      : 'Mulai Pantau Perubahan RUU Ini'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase font-mono tracking-widest text-[#FF9500]">
                    Smart Summary (Ringkasan Intuitif)
                  </h4>
                  <div className="p-3.5 bg-[#FF9500]/8 border border-[#FF9500]/20 rounded-xl">
                    <p className="text-xs text-[#1C1C1E]/95 mt-0.5 leading-relaxed font-medium italic">
                      "{selectedItem.smartSummary}"
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="text-[10px] font-bold uppercase font-mono tracking-widest text-[#8E8E93]">
                    Deskripsi Lengkap
                  </h4>
                  <p className="text-xs text-[#3A3A3C] leading-relaxed font-normal">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={(e) => handleDownload(selectedItem.id, e)}
                    className={`flex items-center justify-center gap-1.5 text-[11px] py-2 px-3 rounded-lg border font-bold transition-all ${
                      downloadSuccessful === selectedItem.id
                        ? 'bg-[#34C759]/10 border-[#34C759] text-[#34C759]'
                        : 'bg-[#F2F2F7] border-[#D1D1D6]/70 hover:bg-[#E5E5EA] text-[#1C1C1E]'
                    }`}
                  >
                    {downloadSuccessful === selectedItem.id ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-[#34C759]" />
                        Naskah Terunduh
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Unduh Naskah RUU
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onNavigateToTab('partisipasi')}
                    className="bg-[#007AFF] hover:bg-[#0051A8] font-bold text-white text-[11px] py-2 px-3 rounded-lg border border-[#007AFF] flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    Kawal Aspirasi RUU
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>

              {/* STAGES STEPPER - FOR RUU PRIORITAS ONLY */}
              {selectedItem.progressStages && (
                <div className="bg-white border border-[#D1D1D6]/60 rounded-2xl p-4.5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 border-b border-[#D1D1D6]/40 pb-2.5">
                    <Info className="w-4 h-4 text-[#007AFF]" />
                    <h4 className="text-xs font-bold text-[#1C1C1E] font-heading">Alur Penyusunan Legislasi Nasional</h4>
                  </div>

                  <div className="relative pl-5 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#D1D1D6]/50">
                    
                    {selectedItem.progressStages.map((st, idx) => (
                      <div key={idx} className="relative group select-none">
                        {/* Stepper Dot circle wrapper */}
                        <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          st.status === 'completed'
                            ? 'bg-[#34C759] border-[#34C759] text-white'
                            : st.status === 'active'
                            ? 'bg-[#FF9500] border-[#FF9500] text-white animate-pulse'
                            : 'bg-white border-[#D1D1D6]'
                        }`}>
                          {st.status === 'completed' && <div className="w-1 h-1 bg-white rounded-full" />}
                          {st.status === 'active' && <div className="w-1 h-1 bg-white rounded-full" />}
                        </div>

                        {/* Event Content card */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className={`text-[11px] font-bold font-heading ${
                              st.status === 'completed' 
                                ? 'text-[#34C759]' 
                                : st.status === 'active' 
                                ? 'text-[#FF9500] font-black' 
                                : 'text-[#AEAEB2]'
                            }`}>
                              Tahap {idx+1}: {st.stage}
                            </span>
                            {st.date && (
                              <span className="text-[9px] text-[#8E8E93] font-mono italic">
                                {st.date}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#3A3A3C] leading-relaxed font-normal text-left">
                            {st.description}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* Viewers & Discussions details footer */}
              <div className="flex justify-between text-[10px] text-[#8E8E93] font-semibold px-2 py-1">
                <span>Diakses: {selectedItem.viewsCount} x</span>
                <span>Dimonitor Publik: {selectedItem.discussCount} orang</span>
              </div>
            </motion.div>
          ) : (
            /* Standard legislations list */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredLegislation.length > 0 ? (
                filteredLegislation.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectLegislationId(item.id)}
                    className="p-4 bg-white border border-[#D1D1D6]/60 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all active:scale-99 shadow-sm relative overflow-hidden group"
                  >
                    {/* Highlight bar for priority items */}
                    {item.category === 'prioritas' && (
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#007AFF]" />
                    )}

                    <div className="flex justify-between items-start gap-4 text-left">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            item.category === 'prioritas'
                              ? 'bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/25'
                              : item.category === 'terbaru'
                              ? 'bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/25'
                              : 'bg-[#AEAEB2]/10 text-[#3A3A3C]'
                          }`}>
                            {item.number || item.category}
                          </span>
                          
                          {item.currentStage && (
                            <span className="text-[8px] bg-[#007AFF]/8 text-[#007AFF] font-mono font-bold py-0.5 px-1.5 rounded border border-[#007AFF]/15 uppercase tracking-wider">
                              Aktif: {item.currentStage}
                            </span>
                          )}

                          {monitoredRuuIds.includes(item.id) && (
                            <span className="text-[8px] bg-[#D4AF37]/10 text-[#AB8212] font-mono font-bold py-0.5 px-1.5 rounded border border-[#D4AF37]/25 uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
                              Dipantau
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-[#1C1C1E] group-hover:text-[#007AFF] transition-colors font-heading leading-snug">
                          {item.title}
                        </h4>
                        
                        <p className="text-[10px] text-[#3A3A3C] font-normal line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0 flex flex-col justify-between h-auto self-stretch">
                        <span className="text-[10px] text-[#8E8E93] font-bold tracking-tight">Th. {item.year}</span>
                        <div className="flex items-center gap-1.5 justify-end text-[#8E8E93] text-[10px] pt-4 font-semibold">
                          <Eye className="w-3.5 h-3.5 text-[#8E8E93]" />
                          <span>{(item.viewsCount / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#8E8E93] space-y-2">
                  <Info className="w-8 h-8 text-[#D1D1D6] mx-auto" />
                  <p className="text-xs font-medium">Hasil verifikasi pencarian tidak ditemukan.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#007AFF] hover:underline font-bold"
                  >
                    Bersihkan Filter Pencarian
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
