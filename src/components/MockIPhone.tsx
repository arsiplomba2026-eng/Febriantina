/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppNotification } from '../types';

interface MockIPhoneProps {
  children: React.ReactNode;
  activeScreenName: string;
  onGoBack?: () => void;
  showBackButton?: boolean;
  activeNotification?: AppNotification | null;
  onClearActiveNotification?: () => void;
  onNotificationClick?: (ruuId: string) => void;
  hasUnreadNotifications?: boolean;
}

export default function MockIPhone({
  children,
  activeScreenName,
  onGoBack,
  showBackButton = false,
  activeNotification = null,
  onClearActiveNotification,
  onNotificationClick,
  hasUnreadNotifications = false,
}: MockIPhoneProps) {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2F2F7] p-4 font-sans select-none overflow-x-hidden transition-all duration-300">
      
      {/* Subtle modern organic ambient highlights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#007AFF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#34C759]/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-full">
        
        {/* Top Branding Tag for AI Studio Workspace */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-black font-heading tracking-tight text-[#1C1C1E] flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-[#007AFF] to-[#0051A8] text-transparent bg-clip-text">Nexus Law</span>
            <span className="text-[10px] bg-[#007AFF]/10 text-[#007AFF] font-bold py-0.5 px-2.5 rounded-full border border-[#007AFF]/20 uppercase tracking-wider">Sleek Prototype</span>
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1 pr-1 max-w-sm font-medium leading-relaxed">
            Legal Data Integrity & Partisipasi Publik Legislasi Indonesia
          </p>
        </div>

        {/* Outer Phone Shell - Polished Titanium / Dark Silver */}
        <div className="relative w-[390px] h-[844px] rounded-[52px] border-[10px] border-[#2C2C2E] bg-[#F2F2F7] shadow-[0_25px_60px_-15px_rgba(28,28,30,0.18)] ring-1 ring-[#1C1C1E]/10 flex flex-col overflow-hidden max-w-[100vw] sm:max-w-none">
          
          {/* Physical Side Buttons overlay (Visual only) */}
          <div className="absolute -left-[13px] top-[140px] w-[3px] h-[35px] bg-[#2C2C2E] rounded-l" />
          <div className="absolute -left-[13px] top-[195px] w-[3px] h-[60px] bg-[#2C2C2E] rounded-l" />
          <div className="absolute -left-[13px] top-[265px] w-[3px] h-[60px] bg-[#2C2C2E] rounded-l" />
          <div className="absolute -right-[13px] top-[210px] w-[3px] h-[90px] bg-[#2C2C2E] rounded-r" />

          {/* iOS Status Bar with dark label text matching light UI */}
          <div className="relative z-50 h-12 bg-white/40 backdrop-blur-md px-6 flex items-center justify-between text-[#1C1C1E] shrink-0">
            {/* Time with unread notification dot */}
            <div className="flex items-center gap-1.5 justify-start">
              <span className="text-xs font-bold font-heading tracking-tight">{time}</span>
              {hasUnreadNotifications && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9500] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9500]"></span>
                </span>
              )}
            </div>
            
            {/* Morphing Dynamic Island / Notch */}
            <motion.div
              layout
              animate={{
                width: activeNotification ? 240 : 110,
                height: activeNotification ? 32 : 26,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-black rounded-full flex items-center justify-between px-3 shadow-inner overflow-hidden z-20 cursor-pointer"
              onClick={() => {
                if (activeNotification && activeNotification.relatedRuuId && onNotificationClick) {
                  onNotificationClick(activeNotification.relatedRuuId);
                }
              }}
            >
              {activeNotification ? (
                <div className="flex items-center justify-between w-full text-white text-[9px] font-bold">
                  <div className="flex items-center slot gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-[#FF9500] rounded-full" />
                    <span className="text-[#D4AF37]">RUU UPDATE</span>
                  </div>
                  <span className="truncate pr-1 text-white/90 font-mono text-[8.5px] max-w-[120px] font-normal">
                    {activeNotification.stageName || 'Status Baru'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-end w-full">
                  {/* Camera lens specular reflection */}
                  <div className="w-1.5 h-1.5 bg-[#007AFF]/25 rounded-full mr-1.5" />
                  <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-800" />
                </div>
              )}
            </motion.div>

            {/* Quick Status Icons with Dark active styles */}
            <div className="flex items-center gap-1.5 text-[#1C1C1E]">
              <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="text-[9px] font-mono font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
              <Battery className="w-4 h-4 text-[#34C759] rotate-0 fill-[#34C759]/25" strokeWidth={2} />
            </div>
          </div>

          {/* iOS Push Notification Banner Drawer overlay inside the viewport */}
          <div className="relative flex-1 bg-[#F2F2F7] overflow-y-auto flex flex-col no-scrollbar">
            
            <AnimatePresence>
              {activeNotification && (
                <motion.div
                  initial={{ y: -120, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -120, opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                  onClick={() => {
                    if (activeNotification.relatedRuuId && onNotificationClick) {
                      onNotificationClick(activeNotification.relatedRuuId);
                    }
                  }}
                  className="absolute top-2.5 left-3 right-3 z-50 bg-[#1C1C1E] text-white p-3.5 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.35)] border border-white/10 flex gap-3 cursor-pointer select-none ring-1 ring-white/5 pr-8 hover:bg-[#252529] transition-colors"
                >
                  <div className="bg-[#D4AF37] p-2 text-[#0C1E3F] rounded-xl flex items-center justify-center shrink-0 w-9 h-9 shadow-inner">
                    <Bell className="w-4.5 h-4.5 fill-current" />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35 py-0.5 px-2 rounded-full font-bold uppercase font-mono tracking-widest leading-none">
                        NEXUS LAW PUSH
                      </span>
                      <span className="text-[8px] text-[#AEAEB2] font-semibold tracking-tight">
                        {activeNotification.timestamp}
                      </span>
                    </div>
                    <h4 className="text-[10.5px] font-bold mt-1 text-white leading-tight font-heading truncate">
                      {activeNotification.title}
                    </h4>
                    <p className="text-[10px] text-[#AEAEB2] mt-0.5 leading-relaxed font-normal line-clamp-2">
                      {activeNotification.body}
                    </p>
                  </div>

                  {/* Close tap touch container button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearActiveNotification?.();
                    }}
                    className="absolute top-2 right-2.5 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span className="text-[8px] text-white/90 font-bold">✕</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {children}
          </div>

          {/* iOS Home Indicator Bar - Bottom of Phone screen */}
          <div className="relative z-[45] h-6 bg-white/80 border-t border-[#D1D1D6]/40 backdrop-blur-md flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-[#1C1C1E]/30 rounded-full hover:bg-[#1C1C1E]/60 transition-colors duration-200 cursor-pointer" />
          </div>

        </div>

        {/* Bottom Helper instructions */}
        <p className="text-[10px] text-[#8E8E93] mt-3.5 text-center max-w-xs font-medium">
          Didesain dengan presisi Human Interface khas iOS. Gunakan scroll untuk interaksi data langsung.
        </p>

      </div>
    </div>
  );
}
