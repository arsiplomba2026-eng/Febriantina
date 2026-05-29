/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MockIPhone from './components/MockIPhone';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import RuulScreen from './components/RuulScreen';
import ParticipationScreen from './components/ParticipationScreen';
import StatsScreen from './components/StatsScreen';
import { UserProfile, LegislationItem, AppNotification } from './types';
import { INITIAL_LEGISLATION } from './data/mockLawData';
import { Home, Gavel, Users2, BarChart3, User, LogOut, ShieldAlert, Bell, MessageSquare, ChevronRight } from 'lucide-react';

type TabType = 'home' | 'legislasi' | 'partisipasi' | 'statistik' | 'profile';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('nexus_user_profile');
    return cached ? JSON.parse(cached) : null;
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [legislativeSearchQuery, setLegislativeSearchQuery] = useState('');
  const [selectedLegislationId, setSelectedLegislationId] = useState<string | null>(null);

  // Consolidated source of truth for legislations
  const [legislationList, setLegislationList] = useState<LegislationItem[]>(() => {
    const cached = localStorage.getItem('nexus_legislation');
    return cached ? JSON.parse(cached) : INITIAL_LEGISLATION;
  });

  // Consolidated source of truth for monitored RUUs (Default monitor 'ruu-perampasan-aset' for a stellar out-of-box experience!)
  const [monitoredRuuIds, setMonitoredRuuIds] = useState<string[]>(() => {
    const cached = localStorage.getItem('nexus_monitored_ruu_ids');
    return cached ? JSON.parse(cached) : ['ruu-perampasan-aset'];
  });

  // Archival Notification history
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const cached = localStorage.getItem('nexus_notifications');
    return cached ? JSON.parse(cached) : [
      {
        id: 'welcome-notif',
        title: 'Sistem Pemantauan Aktif',
        body: 'Selamat! Akun Anda kini tersambung ke jaringan audit draf hukum nasional Nexus Law.',
        timestamp: '1 jam yang lalu',
        unread: false,
        stageName: 'Sirkulasi'
      }
    ];
  });

  // Current active sliding push banner notification
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);
  
  const bannerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync user profile to localStorage
  const handleAuthComplete = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('nexus_user_profile', JSON.stringify(profile));
    setActiveTab('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user_profile');
    setActiveTab('home');
  };

  const handleSearchSelect = (searchTerm: string) => {
    setLegislativeSearchQuery(searchTerm);
    setSelectedLegislationId(null);
  };

  const selectTabFromHome = (tab: 'home' | 'legislasi' | 'partisipasi' | 'statistik') => {
    setActiveTab(tab);
  };

  // Toggle monitor follow/unfollow for RUU item
  const handleToggleMonitorRuu = (id: string) => {
    const current = [...monitoredRuuIds];
    const idx = current.indexOf(id);
    let updated: string[];
    if (idx !== -1) {
      updated = current.filter((x) => x !== id);
    } else {
      updated = [...current, id];
    }
    setMonitoredRuuIds(updated);
    localStorage.setItem('nexus_monitored_ruu_ids', JSON.stringify(updated));
  };

  // Trigger simulated status change event for a monitored RUU
  const triggerSimulatedStatusChange = (ruuId: string) => {
    const item = legislationList.find((x) => x.id === ruuId);
    if (!item) return;

    // We can shift progressStages or just change status organically
    let nextStageName = 'Pengundangan';
    let updatedStages = item.progressStages ? [...item.progressStages] : [];

    if (item.progressStages && item.progressStages.length > 0) {
      const activeIdx = item.progressStages.findIndex((s) => s.status === 'active');
      
      if (activeIdx !== -1) {
        // Find next stage index (cannot exceed array length)
        const nextIdx = (activeIdx + 1) % item.progressStages.length;
        
        updatedStages = item.progressStages.map((s, idx) => {
          if (idx === activeIdx) {
            return { ...s, status: 'completed' as const, date: '29 Mei 2026' };
          }
          if (idx === nextIdx) {
            return { ...s, status: 'active' as const, date: 'Hari ini' };
          }
          // Reset other upcoming parts to pending
          if (idx > nextIdx) {
            return { ...s, status: 'pending' as const, date: undefined };
          }
          return s;
        });
        nextStageName = item.progressStages[nextIdx].stage;
      } else {
        // Default first stage active
        updatedStages = item.progressStages.map((s, idx) => {
          if (idx === 0) return { ...s, status: 'active' as const, date: 'Hari ini' };
          return s;
        });
        nextStageName = item.progressStages[0].stage;
      }
    }

    // Update entire lists
    const updatedLegislationList = legislationList.map((x) => {
      if (x.id === ruuId) {
        return {
          ...x,
          currentStage: nextStageName as any,
          progressStages: updatedStages,
          discussCount: x.discussCount + Math.floor(Math.random() * 24) + 12,
        };
      }
      return x;
    });

    setLegislationList(updatedLegislationList);
    localStorage.setItem('nexus_legislation', JSON.stringify(updatedLegislationList));

    // Construct new iOS Push alert
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Sirkulasi Legislasi Terkini`,
      body: `${item.title} kini resmi memasuki babak [${nextStageName}]. Suarakan aspirasi Anda langsung!`,
      timestamp: 'Baru saja',
      unread: true,
      relatedRuuId: ruuId,
      stageName: nextStageName,
    };

    const newNotifications = [newNotif, ...notifications];
    setNotifications(newNotifications);
    localStorage.setItem('nexus_notifications', JSON.stringify(newNotifications));

    // Animate active dropdown banner
    setActiveNotification(newNotif);

    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current);
    }
    bannerTimeoutRef.current = setTimeout(() => {
      setActiveNotification(null);
    }, 6000);
  };

  // Live Deep link handler
  const handleNotificationClick = (ruuId: string) => {
    setSelectedLegislationId(ruuId);
    setActiveTab('legislasi');
    setActiveNotification(null);

    // Mark that clicked/navigated notification as read
    const markedRead = notifications.map((notif) => {
      if (notif.relatedRuuId === ruuId) {
        return { ...notif, unread: false };
      }
      return notif;
    });
    setNotifications(markedRead);
    localStorage.setItem('nexus_notifications', JSON.stringify(markedRead));
  };

  // Periodic automatic event update trigger (Simulates real-world Parliamentary updates on monitored bills)
  useEffect(() => {
    const backgroundTimer = setInterval(() => {
      if (monitoredRuuIds.length > 0 && user) {
        const randomIndex = Math.floor(Math.random() * monitoredRuuIds.length);
        const targetRuuId = monitoredRuuIds[randomIndex];
        triggerSimulatedStatusChange(targetRuuId);
      }
    }, 75000); // Organic interval updates every ~75 seconds

    return () => clearInterval(backgroundTimer);
  }, [monitoredRuuIds, legislationList, notifications, user]);

  const renderActiveScreenContent = () => {
    if (!user) {
      return <AuthScreen onAuthComplete={handleAuthComplete} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            user={user}
            onNavigateToTab={selectTabFromHome}
            onSearchSelect={handleSearchSelect}
            onSelectLegislationId={(id) => setSelectedLegislationId(id)}
            legislationList={legislationList}
            monitoredRuuIds={monitoredRuuIds}
            onTriggerSimulatedStatusChange={triggerSimulatedStatusChange}
          />
        );
      case 'legislasi':
        return (
          <RuulScreen
            initialSearchQuery={legislativeSearchQuery}
            selectedLegislationId={selectedLegislationId}
            onSelectLegislationId={(id) => setSelectedLegislationId(id)}
            onNavigateToTab={selectTabFromHome}
            legislationList={legislationList}
            monitoredRuuIds={monitoredRuuIds}
            onToggleMonitorRuu={handleToggleMonitorRuu}
          />
        );
      case 'partisipasi':
        return <ParticipationScreen user={user} />;
      case 'statistik':
        return <StatsScreen />;
      case 'profile':
        return (
          <div className="flex-1 flex flex-col bg-[#F2F2F7] text-[#1C1C1E] p-5 justify-between font-sans">
            <div className="space-y-6">
              
              {/* Profile Card Header */}
              <div className="bg-white border border-[#D1D1D6]/60 rounded-2xl p-5 text-center space-y-3 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#007AFF]" />
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border border-[#D1D1D6] object-cover mx-auto"
                />
                <div>
                  <h3 className="text-base font-bold font-heading text-[#1C1C1E]">{user.name}</h3>
                  <span className="inline-block bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/20 text-[9px] py-0.5 px-2.5 rounded-full mt-1.5 font-bold uppercase tracking-wider font-mono">
                    {user.status}
                  </span>
                </div>
              </div>

              {/* LIVE NOTIFICATIONS DIRECT logs feed */}
              <div className="bg-white border border-[#D1D1D6]/60 rounded-2xl p-4 text-xs space-y-3 shadow-sm text-left">
                <div className="flex justify-between items-center border-b border-[#D1D1D6]/50 pb-2">
                  <h4 className="font-semibold text-[#8E8E93] font-mono text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                    <Bell className="w-3 h-3 text-[#FF9500]" />
                    Pusat Kotak Masuk Notifikasi
                  </h4>
                  {notifications.filter((n) => n.unread).length > 0 && (
                    <span className="bg-[#FF9500] text-white text-[8px] py-0.5 px-2 rounded-full font-bold">
                      {notifications.filter((n) => n.unread).length} Baru
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-[10px] text-[#8E8E93] italic text-center py-4">Belum ada pembaruan status legislatif.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => notif.relatedRuuId && handleNotificationClick(notif.relatedRuuId)}
                        className={`p-2.5 border rounded-xl text-left transition-all cursor-pointer ${
                          notif.unread
                            ? 'bg-[#007AFF]/5 border-[#007AFF]/25 shadow-sm hover:bg-[#007AFF]/10'
                            : 'bg-zinc-50 border-[#D1D1D6]/40 hover:bg-[#E5E5EA]/45'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[7.5px] leading-none mb-1 text-[#8E8E93] font-semibold">
                          <span className={`px-1 py-0.2 rounded font-mono font-bold uppercase scale-95 origin-left ${
                            notif.unread ? 'bg-[#FF9500]/15 text-[#AB8212] border border-[#D4AF37]/20' : 'bg-[#AEAEB2]/15 text-[#3A3A3C]'
                          }`}>
                            {notif.stageName || 'Undang'}
                          </span>
                          <span>{notif.timestamp}</span>
                        </div>
                        <h5 className="text-[10px] font-bold text-[#1C1C1E] leading-tight truncate">{notif.title}</h5>
                        <p className="text-[9.5px] text-[#3A3A3C]/90 mt-0.5 line-clamp-1">{notif.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Profile details */}
              <div className="bg-white border border-[#D1D1D6]/60 rounded-2xl p-4 text-xs space-y-3.5 shadow-sm text-left">
                <h4 className="font-semibold border-b border-[#D1D1D6]/50 pb-2 text-[#8E8E93] font-mono text-[9px] uppercase tracking-widest">
                  Konfirmasi Akun Verifikasi
                </h4>
                
                <div className="space-y-1">
                  <span className="text-[#8E8E93] block font-medium">Alamat Email</span>
                  <span className="text-[#1C1C1E] font-medium block">{user.email || 'aris.setiawan@gmail.com'}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#8E8E93] block font-medium">Nomor WhatsApp Verified</span>
                  <span className="text-[#1C1C1E] font-mono block">+62 {user.phone || '81298457223'}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#8E8E93] block font-medium">Sertifikasi Keterlibatan</span>
                  <span className="text-[#34C759] font-bold block flex items-center gap-1 text-[11px]">
                    ✓ Aktif Berkontribusi Demokrasi
                  </span>
                </div>
              </div>

              {/* Platform Info */}
              <div className="bg-white border border-[#D1D1D6]/60 rounded-2xl p-4 text-xs space-y-3 shadow-sm text-left">
                <h4 className="font-semibold border-b border-[#D1D1D6]/50 pb-2 text-[#8E8E93] font-mono text-[9px] uppercase tracking-widest">
                  Misi Indonesia Emas 2045
                </h4>
                <p className="text-[11px] text-[#3A3A3C] leading-relaxed font-normal">
                  Nexus Law bertekad memberantas defisit kepercayaan publik terhadap legislatur dengan menyediakan portal sirkulasi draf perundang-undangan termonitor berasaskan Legal Data Integrity.
                </p>
              </div>
            </div>

            {/* Logout button */}
            <div className="space-y-3 pt-6 shrink-0">
              <button
                onClick={handleLogout}
                className="w-full bg-white hover:bg-[#F2F2F7] border border-[#D1D1D6]/80 text-[#FF3B30] hover:text-[#FF3B30]/80 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Keluar / Ganti Akun
              </button>
              
              <div className="flex gap-1.5 items-center justify-center text-[#8E8E93] pr-2">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#8E8E93]" />
                <span className="text-[8px] uppercase tracking-widest font-bold">Autentikasi Terenkripsi Kemenkumham</span>
              </div>
            </div>
          </div>
        );
    }
  };

  const getActiveTabTitle = (): string => {
    if (!user) return 'Registrasi';
    switch (activeTab) {
      case 'home':
        return 'Beranda';
      case 'legislasi':
        return 'Legislasi';
      case 'partisipasi':
        return 'Partisipasi';
      case 'statistik':
        return 'Statistik';
      case 'profile':
        return 'Profil';
    }
  };

  const hasUnread = notifications.some((n) => n.unread);

  return (
    <MockIPhone
      activeScreenName={getActiveTabTitle()}
      activeNotification={activeNotification}
      onClearActiveNotification={() => setActiveNotification(null)}
      onNotificationClick={handleNotificationClick}
      hasUnreadNotifications={hasUnread}
    >
      
      {/* Scrollable Content Pane */}
      <div className="flex-1 flex flex-col no-scrollbar relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.04, 0.88, 0.49, 1] }}
            className="flex-1 flex flex-col"
          >
            {renderActiveScreenContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistent iOS Bottom Bar Navigation - Visible Only when Authenticated */}
      {user && (
        <div className="sticky bottom-0 z-40 bg-white/94 backdrop-blur-md border-t border-[#D1D1D6]/50 py-2.5 px-3 flex justify-around items-center shrink-0 shadow-sm">
          
          <button
            onClick={() => {
              setActiveTab('home');
              setLegislativeSearchQuery('');
              setSelectedLegislationId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-colors relative ${
              activeTab === 'home' ? 'text-[#007AFF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <Home className="w-[18px] h-[18px]" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[8px] font-bold">Beranda</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('legislasi');
              setLegislativeSearchQuery('');
              setSelectedLegislationId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'legislasi' ? 'text-[#007AFF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <Gavel className="w-[18px] h-[18px]" strokeWidth={activeTab === 'legislasi' ? 2.5 : 2} />
            <span className="text-[8px] font-bold">RUU &amp; Leg</span>
          </button>

          <button
            onClick={() => setActiveTab('partisipasi')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'partisipasi' ? 'text-[#007AFF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <Users2 className="w-[18px] h-[18px]" strokeWidth={activeTab === 'partisipasi' ? 2.5 : 2} />
            <span className="text-[8px] font-bold">Partisipasi</span>
          </button>

          <button
            onClick={() => setActiveTab('statistik')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'statistik' ? 'text-[#007AFF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <BarChart3 className="w-[18px] h-[18px]" strokeWidth={activeTab === 'statistik' ? 2.5 : 2} />
            <span className="text-[8px] font-bold">Statistik</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors relative ${
              activeTab === 'profile' ? 'text-[#007AFF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            {hasUnread && (
              <span className="absolute top-0 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9500] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9500]"></span>
              </span>
            )}
            <User className="w-[18px] h-[18px]" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[8px] font-bold">Profil</span>
          </button>

        </div>
      )}

    </MockIPhone>
  );
}
