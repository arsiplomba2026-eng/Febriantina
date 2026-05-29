/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Scale, CheckCircle2, MapPin, Inbox, BarChart, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

type StatsTab = 'ruu' | 'wilayah' | 'waktu';

interface ChartItem {
  label: string;
  value: number; // percentage
}

export default function StatsScreen() {
  const [activeTab, setActiveTab] = useState<StatsTab>('ruu');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Exact mockup 4 datasets conforming to PDF visual metrics
  const ruuDataset: ChartItem[] = [
    { label: 'RUU Perampasan Aset', value: 90 },
    { label: 'UU ITE No. 1/2024', value: 75 },
    { label: 'UU No 16/2025', value: 25 },
    { label: 'RUU KUHAP', value: 10 },
  ];

  const wilayahDataset: ChartItem[] = [
    { label: 'DKI Jakarta', value: 92 },
    { label: 'Jawa Barat', value: 84 },
    { label: 'Jawa Timur', value: 78 },
    { label: 'Sumatera Utara', value: 61 },
  ];

  const waktuDataset: ChartItem[] = [
    { label: 'Kuartal I 2024', value: 45 },
    { label: 'Kuartal II 2024', value: 58 },
    { label: 'Kuartal III 2024', value: 70 },
    { label: 'Kuartal IV 2024', value: 82 },
  ];

  const generatePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Colors
      const primaryColor = [12, 30, 63]; // #0C1E3F Deep Indigo
      const secondaryColor = [94, 196, 255]; // #5EC4FF Cyan Accent
      const goldColor = [212, 175, 55]; // #D4AF37 Royal Gold
      const darkGray = [29, 29, 35]; // #1D1D23 Charcoal
      const lightGray = [142, 142, 147]; // #8E8E93 Silver

      // 1. Header Frame & Border Design
      // Outer border
      doc.setDrawColor(212, 175, 55); // Gold border
      doc.setLineWidth(0.5);
      doc.rect(5, 5, 200, 287); // Page boundary border

      // Double line accent at top
      doc.setDrawColor(12, 30, 63); 
      doc.setLineWidth(1);
      doc.line(10, 28, 200, 28);
      doc.setLineWidth(0.25);
      doc.line(10, 29.5, 200, 29.5);

      // Logo/Emblem Simulation (National Flag Accent)
      doc.setFillColor(212, 175, 55); // Gold badge round rect
      doc.roundedRect(12, 10, 8, 8, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("印", 14.5, 16);

      // Header Text
      doc.setTextColor(12, 30, 63);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("PORTAL KAJIAN KONSTITUSI INDONESIA", 24, 13);
      doc.setTextColor(142, 142, 147);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.text("Kementerian Hukum RI & Universitas Mataram | BPHN Verified", 24, 17);

      doc.setTextColor(12, 30, 63);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7);
      doc.text("LAPORAN RESMI - NEGARA RI", 145, 13);
      doc.setFontSize(6);
      doc.setTextColor(142, 142, 147);
      doc.text("Tanggal Unduh: 29 Mei 2026", 145, 17);

      // 2. Report Main Title
      doc.setTextColor(12, 30, 63);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text("LAPORAN ANALISIS STATISTIK LEGISLASI", 105, 39, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(29, 29, 35);
      doc.text("Dokumen resmi yang memuat data tren atensi publik dan sebaran wilayah kepercayaan hukum.", 105, 45, { align: "center" });

      // 3. Section I: Ringkasan Eksekutif (Executive Summary)
      doc.setFillColor(242, 242, 247); // Light background card
      doc.roundedRect(12, 53, 186, 25, 2, 2, "F");
      
      doc.setTextColor(12, 30, 63);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.text("I. RINGKASAN EKSEKUTIF", 15, 59);

      // Total Kasus Box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(16, 62, 85, 12, 1.5, 1.5, "F");
      doc.setTextColor(142, 142, 147);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7);
      doc.text("TOTAL DRAF LEGISLASI", 20, 66);
      doc.setTextColor(12, 30, 63);
      doc.setFontSize(10);
      doc.text("15.432 Kasus Terdaftar", 20, 71);

      // Penyelesaian Box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(109, 62, 85, 12, 1.5, 1.5, "F");
      doc.setTextColor(142, 142, 147);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7);
      doc.text("RATIO PENYELESAIAN REKOMENDASI", 113, 66);
      doc.setTextColor(12, 30, 63);
      doc.setFontSize(10);
      doc.text("78% Diterima Nasional", 113, 71);

      // 4. Section II: Tren Atensi Publik (berdasarkan Tab Aktif)
      doc.setTextColor(12, 30, 63);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.text("II. DETAIL METRIK TREN LEGISLASI (" + activeTab.toUpperCase() + ")", 12, 88);

      // Decorative Line
      doc.setDrawColor(94, 196, 255);
      doc.setLineWidth(0.5);
      doc.line(12, 91, 198, 91);

      // Table Header
      doc.setFillColor(12, 30, 63);
      doc.rect(12, 94, 186, 7, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("No", 15, 99);
      doc.text("Kategori / Label Indikator", 25, 99);
      doc.text("Persentase Atensi Publik (%)", 135, 99);
      doc.text("Status Evaluasi", 170, 99);

      // Table Row Data
      let currentY = 101;
      const dataToPrint = activeTab === 'ruu' ? ruuDataset : activeTab === 'wilayah' ? wilayahDataset : waktuDataset;
      
      dataToPrint.forEach((item, index) => {
        // Alternating background colors
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(12, currentY, 186, 7.5, "F");
        }

        doc.setTextColor(29, 29, 35);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.text((index + 1).toString(), 15, currentY + 5);
        
        doc.setFont("Helvetica", "bold");
        doc.text(item.label, 25, currentY + 5);

        doc.setFont("Helvetica", "bold");
        doc.setTextColor(10, 75, 179);
        doc.text(item.value + "%", 135, currentY + 5);

        // Status Based on value
        let statusStr = "Atensi Rendah";
        doc.setTextColor(142, 142, 147);
        if (item.value >= 75) {
          statusStr = "Atensi Tinggi";
          doc.setTextColor(220, 53, 69); // Red alert
        } else if (item.value >= 40) {
          statusStr = "Atensi Sedang";
          doc.setTextColor(255, 149, 0); // Orange
        }
        doc.text(statusStr, 170, currentY + 5);

        currentY += 7.5;
      });

      // Simple Table Border
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.2);
      doc.rect(12, 94, 186, (dataToPrint.length * 7.5) + 7);

      // Notes
      doc.setTextColor(142, 142, 147);
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(7);
      doc.text("*Tingkat atensi publik diukur berdasarkan akumulasi sengketa draf pada direktori kajian nasional.", 12, currentY + 11);

      // 5. Section III: Peta Sebaran Kepercayaan Hukum Regional
      doc.setTextColor(12, 30, 63);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.text("III. LAPORAN SEBARAN SINKRONISASI BPHN REGIONAL", 12, currentY + 20);
      
      doc.setDrawColor(12, 30, 63);
      doc.setLineWidth(0.5);
      doc.line(12, currentY + 23, 198, currentY + 23);

      // Regional Status Grid
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(12, currentY + 26, 186, 30, 1.5, 1.5, "F");
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.25);
      doc.roundedRect(12, currentY + 26, 186, 30, 1.5, 1.5, "S");

      doc.setTextColor(12, 30, 63);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("KANTOR WILAYAH (KANWIL)", 16, currentY + 31);
      doc.text("KODE NODE SINKRONISASI", 85, currentY + 31);
      doc.text("STATUS SISTEM SINKRON", 145, currentY + 31);

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(29, 29, 35);
      doc.text("1. Kanwil DKI Jakarta & Sumatera Utara", 16, currentY + 37);
      doc.setFont("Courier", "bold");
      doc.text("NODE-ID 1284-BPHN-A", 85, currentY + 37);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(52, 199, 89); // green
      doc.text("AKTIF - REALTIME", 145, currentY + 37);

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(29, 29, 35);
      doc.text("2. Kanwil Jawa Timur & Jawa Barat", 16, currentY + 43);
      doc.setFont("Courier", "bold");
      doc.text("NODE-ID 5693-BPHN-B", 85, currentY + 43);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(52, 199, 89); // green
      doc.text("AKTIF - REALTIME", 145, currentY + 43);

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(29, 29, 35);
      doc.text("3. Komando Hubungan Timur/Papua", 16, currentY + 49);
      doc.setFont("Courier", "bold");
      doc.text("NODE-ID 9002-BPHN-C", 85, currentY + 49);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(52, 199, 89); // green
      doc.text("AKTIF - REALTIME", 145, currentY + 49);

      // 6. Security & Legal Adherence Banner
      doc.setFillColor(12, 30, 63);
      doc.rect(12, currentY + 62, 186, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("DEKLARASI INTEGRITAS HUKUM & DATA SENSUS NASIONAL", 16, currentY + 67);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(212, 175, 55);
      doc.text("Seluruh data laporan resmi di atas di-sinkronisasikan di bawah tanggung jawab Aliansi Transparansi Demokrasi Republik Indonesia.", 16, currentY + 71);

      // 7. Signatures / Verification Stamp
      // Stamp circle
      doc.setDrawColor(12, 30, 63);
      doc.setLineWidth(0.4);
      doc.circle(50, currentY + 95, 10, "S");
      doc.setTextColor(12, 30, 63);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(5);
      doc.text("NEXUS LAW", 44, currentY + 94);
      doc.text("VERIFIED", 45, currentY + 97);
      
      // Signature text
      doc.setTextColor(29, 29, 35);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Aliansi Transparansi Konstitusi", 130, currentY + 85);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(142, 142, 147);
      doc.text("Badan Pembinaan Hukum Nasional RI", 130, currentY + 90);
      doc.setDrawColor(142, 142, 147);
      doc.setLineWidth(0.25);
      doc.line(130, currentY + 98, 188, currentY + 98);
      doc.setFontSize(6.5);
      doc.text("Sistem Keamanan SSL Digital Terenkripsi", 130, currentY + 102);

      // Save PDF
      doc.save(`Laporan_Statistik_NexusLaw_${activeTab.toUpperCase()}_2026.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  const getActiveDataset = () => {
    if (activeTab === 'wilayah') return wilayahDataset;
    if (activeTab === 'waktu') return waktuDataset;
    return ruuDataset;
  };

  const currentDataset = getActiveDataset();

  return (
    <div className="flex-1 flex flex-col bg-white pb-8 text-[#1D1D23] relative font-sans overflow-y-auto no-scrollbar">
      
      {/* Top Banner with Indonesian National Emblem/Portal Kajian */}
      <div className="bg-gradient-to-r from-[#0C1E3F] via-[#102B5C] to-[#0A1A36] px-4 py-2.5 text-white flex items-center justify-between shadow-sm border-b border-[#D4AF37]/35 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center">
            <span className="text-[10px] text-[#D4AF37] font-serif font-bold">印</span>
          </div>
          <span className="text-[9px] font-bold tracking-widest font-mono uppercase text-[#D4AF37]">
            Portal Kajian Konstitusi Indonesia
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-bold text-white/90">Statistik Real-time</span>
        </div>
      </div>

      {/* Navigation Header with Back Arrow matching mockup 4 */}
      <div className="bg-white border-b border-[#D1D1D6]/40 p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const homeTab = document.getElementById('tab-home');
              if (homeTab) homeTab.click();
            }}
            className="p-1 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-[#1C1C1E] font-extrabold" />
          </button>
          <span className="text-lg font-black font-serif text-[#1D1D23] uppercase tracking-normal">
            Statistik Hukum
          </span>
        </div>
        
        {/* Header PDF Export Button */}
        <button
          onClick={generatePDF}
          className="bg-[#0A4BB3] hover:bg-[#083A8C] text-white flex items-center gap-1.5 text-[10px] font-black py-2 px-3 rounded-xl shadow-sm border border-transparent transition-all hover:scale-102 active:scale-98 cursor-pointer uppercase"
          title="Ekspor Laporan PDF"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ekspor PDF</span>
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 text-left">
        
        {/* PDF EXPORT DETAILED EXPLANATORY CARD */}
        <div className="bg-[#FAF8F5] border-2 border-[#D4AF37]/40 rounded-[20px] p-4 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full pointer-events-none" />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#102B5C] flex items-center gap-1.5 font-serif uppercase">
              <span className="text-[#D4AF37]">★</span> Laporan Kajian Konstitusi Indonesia
            </h4>
            <p className="text-[10px] text-slate-600 leading-relaxed font-sans max-w-[280px]">
              Unduh hasil analisis statistik komprehensif, indeks atensi publik {activeTab.toUpperCase()}, dan log regional BPHN dalam format PDF resmi.
            </p>
          </div>
          <button
            onClick={generatePDF}
            className="bg-[#102B5C] hover:bg-[#081C3D] text-white flex items-center justify-center gap-1.5 text-[10px] font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all hover:scale-103 cursor-pointer shrink-0 border border-[#D4AF37]/35 uppercase"
          >
            <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Ekspor Resmi (PDF)</span>
          </button>
        </div>
        
        {/* TAB SWITCHES ALIGNED WITH DESIGN MOCKUP 4 */}
        {/* RUU & Legislasi (cyan active), Wilayah/Waktu thin-bordered button styles */}
        <div className="flex gap-2.5 max-w-[340px]">
          <button
            onClick={() => setActiveTab('ruu')}
            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-black tracking-wide text-center uppercase border transition-all cursor-pointer ${
              activeTab === 'ruu'
                ? 'bg-[#5EC4FF] text-white border-[#5EC4FF] shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-300'
            }`}
          >
            RUU &amp; Legislasi
          </button>
          
          <button
            onClick={() => setActiveTab('wilayah')}
            className={`flex-grow py-2.5 px-4 rounded-full text-xs font-black tracking-wide text-center uppercase border transition-all cursor-pointer ${
              activeTab === 'wilayah'
                ? 'bg-[#5EC4FF] text-white border-[#5EC4FF] shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-300'
            }`}
          >
            Wilayah
          </button>

          <button
            onClick={() => setActiveTab('waktu')}
            className={`flex-grow py-2.5 px-4 rounded-full text-xs font-black tracking-wide text-center uppercase border transition-all cursor-pointer ${
              activeTab === 'waktu'
                ? 'bg-[#5EC4FF] text-white border-[#5EC4FF] shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-300'
            }`}
          >
            Waktu
          </button>
        </div>

        {/* CHART SECTION: Trend Legislasi with Royal Blue Outline card container */}
        <div className="space-y-3">
          <h3 className="text-[17px] font-black text-[#1D1D23] tracking-tight">
            Trend Legislasi (2023-2025)
          </h3>

          <div className="border-[2.5px] border-[#0A4BB3] rounded-[24px] p-5 bg-white shadow-sm space-y-3">
            
            {/* Custom SVG Bar Chart aligning precisely with design mockup 4 */}
            <div className="h-60 flex gap-4 pr-1 relative pt-4">
              
              {/* Y-axis percentage line ticks overlay */}
              <div className="w-10 flex flex-col justify-between text-[11px] font-black text-slate-400 font-sans text-right select-none pr-1">
                <span>90%</span>
                <span>75%</span>
                <span>25%</span>
                <span>10%</span>
                <span>5%</span>
                <span>0%</span>
              </div>

              {/* Chart Core with visual alignment lines */}
              <div className="flex-1 flex items-end justify-between px-2 h-full relative border-b border-l border-slate-200">
                
                {/* Horizontal reference lines for standard indicators */}
                <div className="absolute bottom-[10%] left-0 right-0 h-[1.2px] bg-slate-100 border-b border-dashed" />
                <div className="absolute bottom-[25%] left-0 right-0 h-[1.2px] bg-slate-100 border-b border-dashed" />
                <div className="absolute bottom-[75%] left-0 right-0 h-[1.2px] bg-slate-100 border-b border-dashed" />
                <div className="absolute bottom-[90%] left-0 right-0 h-[1.2px] bg-slate-100 border-b border-dashed" />

                {currentDataset.map((item, idx) => {
                  const barHeight = `${item.value}%`;
                  const isHovered = hoveredBar === idx;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer group"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                      onClick={() => setHoveredBar(isHovered ? null : idx)}
                    >
                      {/* Active floating indicator tooltip popup block */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: -4 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="absolute -top-6 bg-[#0C1E3F] text-white font-mono text-[9px] font-bold py-1 px-2 rounded-md shadow-md z-30 whitespace-nowrap"
                          >
                            Atensi: {item.value}%
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Stone-colored visual bar representing the custom model */}
                      <motion.div
                        className={`w-7.5 rounded-t-sm transition-all ${
                          isHovered 
                            ? 'bg-[#7A8A99] shadow-inner' 
                            : 'bg-[#A8B3BD]'
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: barHeight }}
                        transition={{ duration: 0.6, type: 'spring' }}
                      />

                      {/* Horizontal label indicator at bottom */}
                      <span className="absolute top-[102%] text-[9px] font-bold text-stone-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[65px] leading-tight text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })}

              </div>

            </div>

            {/* Empty space helper to prevent label overlay overflow */}
            <div className="h-6" />

            <p className="text-[10px] text-gray-400 text-center leading-relaxed italic font-medium px-4">
              *Tingkat atensi publik diukur berdasarkan akumulasi sengketa draf pada direktori kajian nasional.
            </p>
          </div>
        </div>

        {/* DUAL METRIC ROW WITH DEEP INDIGO/BLUE BORDERS AND SERIF DESIGN */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          
          <div className="bg-white border-2 border-[#102B5C] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider font-mono">
              TOTAL KASUS
            </span>
            <div className="mt-3">
              <span className="text-2xl font-black font-serif text-[#102B5C] tracking-tight block">
                15.432
              </span>
              <span className="text-[9px] font-bold text-stone-500 block mt-1">Draf legislasi terdaftar</span>
            </div>
          </div>

          <div className="bg-white border-2 border-[#102B5C] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider font-mono">
              PENYELESAIAN
            </span>
            <div className="mt-3">
              <span className="text-2xl font-black font-serif text-[#102B5C] tracking-tight block">
                78%
              </span>
              <span className="text-[9px] font-bold text-stone-500 block mt-1">Hasil rekomendasi diterima</span>
            </div>
          </div>

        </div>

        {/* INDONESIAN ARCHIPELAGO HIGH-FIDELITY MAP DESIGN SECTION */}
        <div className="space-y-3.5">
          <h3 className="text-[15px] font-black text-[#1D1D23] tracking-tight uppercase">
            Peta Sebaran Kepercayaan Hukum Regional
          </h3>

          <div className="bg-[#0C1E3F] rounded-2xl p-4.5 text-white flex flex-col space-y-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-[10px] font-black tracking-widest text-sky-200 uppercase font-mono">
                  SINKRONISASI BPHN SE-INDONESIA
                </span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[8px] py-0.5 px-2 rounded font-mono font-bold border border-emerald-500/20 uppercase">
                Aktif
              </span>
            </div>

            {/* High fidelity outline clean SVG representing physical contours of Sumatra, Java, Borneo, Celebes, Papua */}
            <div className="relative h-28 w-full bg-[#0a1a36]/50 rounded-xl flex items-center justify-center p-1 border border-white/5 shadow-inner">
              <svg viewBox="0 0 450 180" className="w-full h-full opacity-85 select-none" fill="none">
                
                {/* Sumatra Archipelago contour geometry */}
                <path d="M40,55 L80,25 L105,45 L135,75 L125,95 L100,90 L70,85 Z" fill="#1C3F75" stroke="#4dabf7" strokeWidth="1.2" />
                
                {/* Java Island structure */}
                <path d="M120,115 L195,115 L245,110 L242,120 L185,123 L120,121 Z" fill="#1C3F75" stroke="#4dabf7" strokeWidth="1.2" />
                
                {/* Borneo/Kalimantan */}
                <path d="M175,35 L225,25 L248,50 L240,82 L198,88 L170,72 Z" fill="#1C3F75" stroke="#4dabf7" strokeWidth="1.2" />
                
                {/* Sulawesi/Celebes orchid geometry */}
                <path d="M265,45 Q295,40 285,60 Q265,65 272,82 L290,82 Q285,92 270,95 L260,78 Z" fill="#1C3F75" stroke="#4dabf7" strokeWidth="1.2" />
                
                {/* Lesser Sunda Islands/Bali-NTT */}
                <path d="M255,114 L305,118 M315,120 L350,119" stroke="#4dabf7" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Moluccas Archipelago cluster */}
                <circle cx="315" cy="50" r="1.5" fill="#4dabf7" />
                <circle cx="328" cy="65" r="2" fill="#4dabf7" />
                <circle cx="310" cy="78" r="1" fill="#4dabf7" />
                
                {/* West Papua & Papua clean polygon block */}
                <path d="M345,65 L372,40 L395,48 L418,65 L415,95 L378,92 L345,85 Z" fill="#1C3F75" stroke="#4dabf7" strokeWidth="1.2" />

                {/* Sparkling cyan beacon dot coordinates on regional nodes */}
                <circle cx="75" cy="45" r="3.5" fill="#5EC4FF" className="animate-ping" />
                <circle cx="75" cy="45" r="2" fill="#5EC4FF" />
                
                <circle cx="165" cy="118" r="3.5" fill="#5EC4FF" className="animate-ping" />
                <circle cx="165" cy="118" r="2" fill="#5EC4FF" />
                
                <circle cx="215" cy="62" r="3.5" fill="#5EC4FF" />
                <circle cx="215" cy="62" r="2" fill="#5EC4FF" />

                <circle cx="272" cy="70" r="3.5" fill="#5EC4FF" />
                <circle cx="272" cy="70" r="2" fill="#5EC4FF" />

                <circle cx="375" cy="72" r="3.5" fill="#5EC4FF" />
                <circle cx="375" cy="72" r="2" fill="#5EC4FF" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[9px] text-[#A2B6D4] font-mono leading-none">
              <span>*Data ter-update langsung dari 5 Kanwil BPHN</span>
              <span>Terakhir Sinkron: Q4 2024</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
