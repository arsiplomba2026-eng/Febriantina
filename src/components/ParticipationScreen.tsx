/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send, PenSquare, Users, X, BrainCircuit, BarChart, ShieldCheck, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { ForumPost, PollState, UserProfile, DiscussionComment } from '../types';
import { INITIAL_POLLS, INITIAL_FORUM_POSTS } from '../data/mockLawData';

interface ParticipationScreenProps {
  user: UserProfile;
}

// Client-side quick Indonesian keyword heuristic helper for zero-latency preview
function classifyHeuristic(content: string): 'positif' | 'negatif' | 'netral' {
  const norm = content.toLowerCase();
  
  const positiveWords = [
    'setuju', 'bagus', 'dukung', 'baik', 'sepakat', 'mantap', 'apresiasi', 'solusi',
    'tepat', 'pro', 'setujuu', 'keren', 'bermanfaat', 'melindungi', 'keadilan', 'maju', 'keberhasilan'
  ];
  
  const negativeWords = [
    'menolak', 'tolak', 'kecewa', 'rugi', 'dirugikan', 'buruk', 'cacat', 'benturan', 'kepentingan',
    'ditunda', 'tunda', 'gantung', 'mencurigakan', 'lemah', 'kelemahan', 'kontra', 'tidak adil', 'karet', 'bermasalah'
  ];
  
  let posCount = 0;
  let negCount = 0;
  
  positiveWords.forEach(w => {
    if (norm.includes(w)) posCount++;
  });
  
  negativeWords.forEach(w => {
    if (norm.includes(w)) negCount++;
  });
  
  if (posCount > negCount) return 'positif';
  if (negCount > posCount) return 'negatif';
  return 'netral';
}

export default function ParticipationScreen({ user }: ParticipationScreenProps) {
  const [activeTab, setActiveTab] = useState<'polling' | 'forum'>('polling');
  const [polls, setPolls] = useState<PollState[]>(() => {
    const cached = localStorage.getItem('nexus_polls');
    return cached ? JSON.parse(cached) : INITIAL_POLLS;
  });
  
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const cached = localStorage.getItem('nexus_forum_posts');
    const posts = cached ? JSON.parse(cached) : INITIAL_FORUM_POSTS;
    
    // Auto-seed sentiment classifications on existing comments if they don't have them
    return posts.map((post: ForumPost) => {
      const updatedComments = post.comments.map((comm) => {
        if (!comm.sentiment) {
          return { ...comm, sentiment: classifyHeuristic(comm.content) };
        }
        return comm;
      });
      return { ...post, comments: updatedComments };
    });
  });

  const [activeForumCategory, setActiveForumCategory] = useState<string>('Semua');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  
  // Create New Post Form state
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Kritik Kebijakan');
  const [newPostRuu, setNewPostRuu] = useState('RUU Perampasan Aset');

  // New Comment state
  const [commentInput, setCommentInput] = useState<string>('');

  // Speech Recognition / voice input States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [unsupportedSpeech, setUnsupportedSpeech] = useState(false);

  // Toggle Speech Recognition helper for dictation and voice commands
  const toggleSpeechRecognition = (postId: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setUnsupportedSpeech(true);
      setSpeechError('Web Speech API tidak didukung di browser ini.');
      return;
    }

    if (isListening) {
      if ((window as any).speechRecognitionInstance) {
        try {
          (window as any).speechRecognitionInstance.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      (window as any).speechRecognitionInstance = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'id-ID';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Akses mikrofon ditolak oleh browser.');
        } else {
          setSpeechError(`Perekaman gagal: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        const lowerTranscript = transcript.toLowerCase();

        // 🎙️ VOICE COMMANDS RECOGNITION
        if (lowerTranscript === 'kirim' || lowerTranscript === 'kirim komentar') {
          setIsListening(false);
          const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
          handleCommentSubmit(postId, syntheticEvent);
        } else if (lowerTranscript === 'hapus' || lowerTranscript === 'hapus komentar' || lowerTranscript === 'bersihkan') {
          setCommentInput('');
        } else if (lowerTranscript === 'tutup' || lowerTranscript === 'batal' || lowerTranscript === 'kembali') {
          setExpandedPostId(null);
        } else {
          setCommentInput((prev) => {
            const separator = prev ? ' ' : '';
            return `${prev}${separator}${transcript}`;
          });
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setSpeechError('Gagal memulai perekaman suara.');
      setIsListening(false);
    }
  };

  // AI Sentiment Aggregate Analysis processing state
  const [analyzingPostIds, setAnalyzingPostIds] = useState<Record<string, boolean>>({});

  const savePolls = (updatedPolls: PollState[]) => {
    setPolls(updatedPolls);
    localStorage.setItem('nexus_polls', JSON.stringify(updatedPolls));
  };

  const saveForum = (updatedForum: ForumPost[]) => {
    setForumPosts(updatedForum);
    localStorage.setItem('nexus_forum_posts', JSON.stringify(updatedForum));
  };

  // Human vote logic on Polling
  const handlePollVote = (pollId: string, choice: 'setuju' | 'tidak_setuju') => {
    const updated = polls.map((p) => {
      if (p.id === pollId) {
        if (p.userVote) return p; // prevent double vote
         const agreeInc = choice === 'setuju' ? 1 : 0;
         const disagreeInc = choice === 'tidak_setuju' ? 1 : 0;
        return {
          ...p,
          agreeCount: p.agreeCount + agreeInc,
          disagreeCount: p.disagreeCount + disagreeInc,
          totalVotes: p.totalVotes + 1,
          userVote: choice,
        };
      }
      return p;
    });
    savePolls(updated);
  };

  // Forum Like/Dislike logic
  const handleForumVote = (postId: string, direction: 'like' | 'dislike') => {
    const updated = forumPosts.map((p) => {
      if (p.id === postId) {
        let lDiff = 0, dlDiff = 0;
        if (p.userVote === direction) {
          // undo same vote
          lDiff = direction === 'like' ? -1 : 0;
          dlDiff = direction === 'dislike' ? -1 : 0;
          return { ...p, likes: p.likes + lDiff, dislikes: p.dislikes + dlDiff, userVote: null };
        } else {
          // change vote or first vote
          if (p.userVote === 'like') lDiff = -1;
          if (p.userVote === 'dislike') dlDiff = -1;
          
          if (direction === 'like') lDiff += 1;
          if (direction === 'dislike') dlDiff += 1;

          return { ...p, likes: p.likes + lDiff, dislikes: p.dislikes + dlDiff, userVote: direction };
        }
      }
      return p;
    });
    saveForum(updated);
  };

  // Submit dynamic comment to forum list
  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const txt = commentInput.trim();
    if (!txt) return;

    const tempCommentId = `comment-${Date.now()}`;
    const newComment: DiscussionComment = {
      id: tempCommentId,
      userName: user.name,
      userStatus: user.status,
      avatarUrl: user.avatarUrl,
      content: txt,
      timestamp: 'Baru saja',
      likes: 0,
      sentiment: classifyHeuristic(txt), // optimistic immediate local preview
    };

    const updated = forumPosts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      }
      return p;
    });

    saveForum(updated);
    setCommentInput('');

    // Classify sentiment using Backend API (Gemini with local fallback)
    fetch('/api/sentiment/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: txt }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data && data.sentiment) {
          setForumPosts((prevPosts) => {
            const reUpdated = prevPosts.map((p) => {
              if (p.id === postId) {
                const updatedComments = p.comments.map((c) => {
                  if (c.id === tempCommentId) {
                    return { ...c, sentiment: data.sentiment };
                  }
                  return c;
                });
                return { ...p, comments: updatedComments };
              }
              return p;
            });
            localStorage.setItem('nexus_forum_posts', JSON.stringify(reUpdated));
            return reUpdated;
          });
        }
      })
      .catch((err) => {
        console.warn('Silent fallback for real-time classification:', err);
      });
  };

  // Trigger aggregate AI summarization for a specific post
  const handleAnalyzePostOverview = async (postId: string) => {
    setAnalyzingPostIds((prev) => ({ ...prev, [postId]: true }));
    try {
      const targetPost = forumPosts.find((p) => p.id === postId);
      if (!targetPost) return;

      const response = await fetch('/api/sentiment/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetPost.title,
          comments: targetPost.comments,
        }),
      });

      if (!response.ok) throw new Error('Aggregation analysis failed.');
      const data = await response.json();

      const updated = forumPosts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            sentimentSummary: {
              overallSentiment: data.overallSentiment,
              positifPercentage: data.positifPercentage,
              negatifPercentage: data.negatifPercentage,
              netralPercentage: data.netralPercentage,
              insightsText: data.insightsText,
              recommendation: data.recommendation,
              analyzedAt: data.analyzedAt,
            },
          };
        }
        return p;
      });

      saveForum(updated);
    } catch (err) {
      console.error('Sentiment aggregation fetch error:', err);
    } finally {
      setAnalyzingPostIds((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Submit completely new post
  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: `forum-post-${Date.now()}`,
      ruuTitle: newPostRuu,
      title: newPostTitle,
      authorName: user.name,
      authorStatus: user.status,
      authorAvatar: user.avatarUrl,
      content: newPostContent,
      likes: 0,
      dislikes: 0,
      userVote: null,
      timestamp: 'Baru saja',
      category: newPostCategory,
      comments: [],
    };

    saveForum([newPost, ...forumPosts]);
    
    // reset form
    setNewPostTitle('');
    setNewPostContent('');
    setShowCreatePost(false);
  };

  const getSentimentBadge = (sentiment?: 'positif' | 'negatif' | 'netral') => {
    if (sentiment === 'positif') {
      return (
        <span className="bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] text-[8px] py-0.5 px-2 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
          <span className="w-1 h-1 rounded-full bg-[#34C759]" />
          Positif
        </span>
      );
    }
    if (sentiment === 'negatif') {
      return (
        <span className="bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] text-[8px] py-0.5 px-2 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
          <span className="w-1 h-1 rounded-full bg-[#FF3B30]" />
          Negatif
        </span>
      );
    }
    if (sentiment === 'netral') {
      return (
        <span className="bg-[#59595E]/10 border border-[#59595E]/20 text-[#59595E] text-[8px] py-0.5 px-2 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
          <span className="w-1 h-1 rounded-full bg-[#8E8E93]" />
          Netral
        </span>
      );
    }
    return null;
  };

  const categories = ['Semua', 'Kritik Kebijakan', 'Ulasan Yuridis', 'Dampak Sosial'];
  
  const filteredForumPosts = activeForumCategory === 'Semua' 
    ? forumPosts 
    : forumPosts.filter((p) => p.category === activeForumCategory);

  // Let's create beautiful mock avatar pictures with SVGs representing the people in mockup 3
  const AvatarSVG1 = () => (
    <svg width="42" height="42" viewBox="0 0 100 100" className="shrink-0">
      <circle cx="50" cy="50" r="48" fill="#DCE9FE" stroke="#4a86e8" strokeWidth="2" />
      <circle cx="50" cy="40" r="18" fill="#1A3F75" />
      <path d="M22,76 C22,60 32,54 50,54 C68,54 78,60 78,76 L22,76 Z" fill="#1A3F75" />
      <rect x="42" y="58" width="16" height="10" fill="#E6A817" />
    </svg>
  );

  const AvatarSVG2 = () => (
    <svg width="42" height="42" viewBox="0 0 100 100" className="shrink-0">
      <circle cx="50" cy="50" r="48" fill="#FEF3C7" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="50" cy="38" r="16" fill="#78350F" />
      <path d="M25,74 C25,58 35,52 50,52 C65,52 75,58 75,74 L25,74 Z" fill="#78350F" />
    </svg>
  );

  const AvatarSVG3 = () => (
    <svg width="42" height="42" viewBox="0 0 100 100" className="shrink-0">
      <circle cx="50" cy="50" r="48" fill="#F1F5F9" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="50" cy="40" r="18" fill="#1e293b" />
      <path d="M20,78 C20,62 30,55 50,55 C70,55 80,62 80,78 L20,78 Z" fill="#1e293b" />
    </svg>
  );

  const initialForumFeedMock = [
    {
      id: "fk-1",
      avatar: <AvatarSVG1 />,
      title: "RUU Cipta kerja: Dampak terhadap Lingkungan",
      author: "Oleh : Prof Kurniawan SH. HUM ( Praktisi )",
      comments: 123,
      likes: "500",
    },
    {
      id: "fk-2",
      avatar: <AvatarSVG2 />,
      title: "RUU Cipta kerja: Dampak terhadap Lingkungan",
      author: "Oleh : Prof Galang Asmara SH. MH ( Akademisi )",
      comments: 250,
      likes: "6k",
    },
    {
      id: "fk-3",
      avatar: <AvatarSVG3 />,
      title: "RUU Cipta kerja: Dampak terhadap Lingkungan",
      author: "Oleh : Riska Amlia SH. MH ( Umum )",
      comments: 123,
      likes: "500",
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-white pb-8 text-[#1C1C1E] relative font-sans overflow-y-auto no-scrollbar">
      
      {/* Top Banner with Indonesian State/National Theme matching PDF colors */}
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
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[8px] font-bold text-white/90">BPHN Verified</span>
        </div>
      </div>

      {/* Main Top Navigation Header with Back Arrow exactly matching mockup 3 */}
      <div className="bg-white border-b border-[#D1D1D6]/40 p-4 sticky top-0 z-20 shadow-sm flex items-center gap-3">
        <button 
          onClick={() => {
            // Smoothly go to index screen if requested, otherwise acts as standard back header
            const homeTab = document.getElementById('tab-home');
            if (homeTab) homeTab.click();
          }}
          className="p-1 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-[#1C1C1E] font-extrabold" />
        </button>
        <span className="text-lg font-black font-serif text-[#1D1D23] uppercase tracking-normal">
          Partisipasi Publik
        </span>
      </div>

      <div className="p-4 space-y-6 flex-1 text-left">
        
        {/* SECTION: Polling Publik card box as in mockup 3 */}
        <div className="space-y-3.5">
          <h3 className="text-[16px] font-black text-[#1D1D23] tracking-tight">
            Polling Publik
          </h3>

          {/* Interactive Poll container with thick blue border */}
          <div className="border-[2.5px] border-[#0A4BB3] rounded-[22px] p-5.5 bg-white shadow-sm space-y-5 text-center">
            <h4 className="text-[16px] text-center font-bold font-serif leading-relaxed text-[#1F2025] px-1 py-1">
              Setuju kah Anda dengan Revisi UU ITE Terkait Pencemaran Nama Baik?
            </h4>

            {/* Cyan/Blue styled voting buttons matching design size and colors */}
            <div className="grid grid-cols-2 gap-3.5 max-w-[310px] mx-auto">
              <button
                onClick={() => {
                  savePolls(polls.map(p => p.id === 'uu-ite' ? { ...p, agreeCount: p.agreeCount + 1, totalVotes: p.totalVotes + 1, userVote: 'setuju' } : p));
                }}
                className="py-3 bg-[#42B0FF] active:bg-[#1E95EE] text-white text-[12px] font-black tracking-wide rounded-xl transition-all cursor-pointer shadow-md hover:opacity-90 uppercase text-center"
              >
                SETUJU
              </button>
              <button
                onClick={() => {
                  savePolls(polls.map(p => p.id === 'uu-ite' ? { ...p, disagreeCount: p.disagreeCount + 1, totalVotes: p.totalVotes + 1, userVote: 'tidak_setuju' } : p));
                }}
                className="py-3 bg-[#42B0FF] active:bg-[#1E95EE] text-white text-[12px] font-black tracking-wide rounded-xl transition-all cursor-pointer shadow-md hover:opacity-90 uppercase text-center"
              >
                TIDAK SETUJU
              </button>
            </div>

            {/* Symmetrical percentage metric loader and count label */}
            <div className="space-y-3 px-1">
              <div className="h-2 rounded-full bg-[#E5E5EA] overflow-hidden flex ring-1 ring-[#D1D1D6]/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "67%" }}
                  className="bg-[#42B0FF]"
                  transition={{ duration: 0.8 }}
                />
                <div className="flex-1 bg-[#E2E8F0]" />
              </div>

              <p className="text-stone-500 font-serif font-semibold text-xs tracking-wide">
                Total 15.432 Suara
              </p>
            </div>
          </div>
        </div>

        {/* SECTION: Forum Diskusi as in mockup 3 */}
        <div className="space-y-4 pt-1">
          <div className="flex justify-between items-center">
            <h3 className="text-[16px] font-black text-[#1D1D23] tracking-tight">
              Forum Diskusi
            </h3>
            
            <button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="bg-[#42B0FF] hover:bg-[#1E95EE] text-white flex items-center gap-1 text-[9px] py-1 px-2.5 rounded-lg font-black border border-transparent shadow-sm transition-colors cursor-pointer"
            >
              <PenSquare className="w-3 h-3" />
              TULIS KRITIK
            </button>
          </div>

          <AnimatePresence>
            {showCreatePost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-4 space-y-3.5 overflow-hidden shadow-inner text-xs"
              >
                <div className="flex justify-between items-center border-b border-[#CBD5E1] pb-1.5">
                  <span className="font-bold flex items-center gap-1 text-[#0C1E3F]">
                    <PenSquare className="w-3.5 h-3.5 text-[#42B0FF]" />
                    Suarakan Aspirasi Konstitusi
                  </span>
                  <button onClick={() => setShowCreatePost(false)}>
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Judul Analisis Anda..."
                    className="w-full bg-white border border-slate-300 p-2 rounded-xl focus:outline-none"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <textarea
                    rows={2.5}
                    placeholder="Berikan kritik pendukung secara konstruktif..."
                    className="w-full bg-white border border-slate-300 p-2 rounded-xl focus:outline-none"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setNewPostTitle('');
                      setNewPostContent('');
                      setShowCreatePost(false);
                    }}
                    className="w-full py-2 bg-[#42B0FF] hover:bg-[#1E95EE] text-white font-bold rounded-xl"
                  >
                    Kirim Post
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category tabs under Forum Diskusi */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveForumCategory(cat)}
                className={`text-[9.5px] font-bold px-3 py-1.5 rounded-full border whitespace-nowrap transition-all cursor-pointer ${
                  activeForumCategory === cat
                    ? 'bg-[#42B0FF] text-white border-[#42B0FF] shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List layout replication of Mockup 3 with interactive expansions */}
          <div className="space-y-4">
            {filteredForumPosts.map((post, idx) => {
              const staticMock = initialForumFeedMock[idx % initialForumFeedMock.length];
              return (
                <div
                  key={post.id}
                  className="bg-white border-2 border-[#102B5C] rounded-[20px] p-4 flex flex-col gap-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                >
                  <div className="flex gap-3.5 items-start">
                    {/* Left Side: Avatar illustration */}
                    {staticMock ? staticMock.avatar : <AvatarSVG3 />}

                    {/* Right Side: Title, Author, Counters */}
                    <div className="flex-1 space-y-1.5 overflow-hidden">
                      <div className="flex justify-between items-center gap-1 text-[9px] font-bold">
                        <span className="text-[#007AFF] uppercase font-mono">
                          {post.category || 'Opinion'}
                        </span>
                        <span className="text-slate-400 font-mono text-[8px] truncate max-w-[120px]">
                          {post.ruuTitle}
                        </span>
                      </div>

                      <h4 className="text-[13px] font-black text-[#1F2025] font-serif leading-tight">
                        {post.title}
                      </h4>
                      
                      <p className="text-[11px] text-stone-500 font-semibold truncate leading-none">
                        Oleh : {post.authorName} ({post.authorStatus || 'Rakyat Umum'})
                      </p>

                      {/* Comments & Likes metadata align */}
                      <div className="flex items-center gap-4 text-slate-500 font-mono text-[10.5px] pt-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{post.comments.length} Komentar</span>
                        </div>

                        <div 
                          className="flex items-center gap-1.5 hover:text-[#42B0FF] active:scale-95 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleForumVote(post.id, 'like');
                          }}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${post.userVote === 'like' ? 'text-[#007AFF] fill-[#007AFF]' : ''}`} />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments Panel (Animated inline shelf) */}
                  <AnimatePresence>
                    {expandedPostId === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-100 pt-4 space-y-4 text-left overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Post full body content */}
                        <p className="text-xs text-[#3A3A3C] leading-relaxed font-normal whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                          {post.content}
                        </p>

                        {/* AI Sentiment Analysis trigger & result */}
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-center bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                            <span className="text-[10px] font-bold text-[#102B5C] flex items-center gap-1.5 font-sans leading-none">
                              <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
                              ANALISIS AGREGAT SENTIMEN AI
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAnalyzePostOverview(post.id)}
                              disabled={analyzingPostIds[post.id]}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
                            >
                              <BrainCircuit className="w-3 h-3 animate-pulse" />
                              {analyzingPostIds[post.id] ? 'Menganalisis...' : 'Analisis AI'}
                            </button>
                          </div>

                          {/* If AI Summary output is loaded */}
                          {post.sentimentSummary && (
                            <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-3 text-xs space-y-2.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="font-bold text-indigo-700 uppercase">
                                  Hasil Sentimen: {post.sentimentSummary.overallSentiment}
                                </span>
                                <span className="text-slate-400 font-mono text-[8px]">
                                  Sinkron: {post.sentimentSummary.analyzedAt}
                                </span>
                              </div>
                              
                              {/* Sentiment Bars bar component */}
                              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold font-mono">
                                <div className="bg-emerald-500/10 text-emerald-600 p-1 rounded border border-emerald-500/10">
                                  Positif: {post.sentimentSummary.positifPercentage}%
                                </div>
                                <div className="bg-rose-500/10 text-rose-600 p-1 rounded border border-rose-500/10">
                                  Negatif: {post.sentimentSummary.negatifPercentage}%
                                </div>
                                <div className="bg-slate-400/10 text-slate-500 p-1 rounded border border-slate-400/10">
                                  Netral: {post.sentimentSummary.netralPercentage}%
                                </div>
                              </div>
                              
                              <p className="text-[11px] text-[#3A3A3C] leading-normal font-sans">
                                <strong>Analisis Intisari:</strong> {post.sentimentSummary.insightsText}
                              </p>
                              
                              {post.sentimentSummary.recommendation && (
                                <div className="bg-[#D4AF37]/8 border border-[#D4AF37]/20 p-2.5 rounded-lg text-[10.5px] text-[#AB8212] font-medium leading-relaxed">
                                  <strong>Rekomendasi BPHN:</strong> {post.sentimentSummary.recommendation}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Comments Section */}
                        <div className="space-y-3 pt-1">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                            Saluran Komentar ({post.comments.length})
                          </h5>

                          <div className="space-y-2.5 max-h-[180px] overflow-y-auto no-scrollbar pr-1">
                            {post.comments.length === 0 ? (
                              <p className="text-[11px] italic text-slate-400 text-center py-2">Belum ada komentar. Berikan aspirasi Anda pertama kali!</p>
                            ) : (
                              post.comments.map((comment) => (
                                <div key={comment.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                                  <div className="flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                      {comment.avatarUrl ? (
                                        <img
                                          src={comment.avatarUrl}
                                          alt={comment.userName}
                                          className="w-5 h-5 rounded-full border border-slate-200 object-cover shrink-0"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0" />
                                      )}
                                      <span className="text-[10px] font-bold text-slate-700">{comment.userName}</span>
                                      <span className="text-[8px] bg-slate-200/60 font-semibold px-1 py-0.2 rounded text-slate-500 scale-90">{comment.userStatus}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {getSentimentBadge(comment.sentiment)}
                                      <span className="text-[8px] text-slate-400 font-mono">{comment.timestamp}</span>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-normal pl-6">
                                    {comment.content}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Interactive Comment Input with Voice Capabilities */}
                          <div className="space-y-2 pt-2 border-t border-slate-150">
                            {/* Microphone Listening Status Banner overlay */}
                            <AnimatePresence>
                              {isListening && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="bg-red-500/10 border border-red-500/20 text-red-600 p-2 rounded-xl text-[10px] flex items-center justify-between gap-2"
                                >
                                  <div className="flex items-center gap-1.5 font-sans">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <span className="font-bold animate-pulse">🎙️ Sedang mendengarkan... Bicara sekarang!</span>
                                  </div>
                                  <span className="font-semibold text-red-500 uppercase text-[8px] tracking-wider">Katakan 'Kirim'</span>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {speechError && (
                              <p className="text-[10px] text-red-500 bg-red-50 p-1.5 rounded-lg border border-red-100 font-medium">
                                ❌ {speechError}
                              </p>
                            )}

                            {unsupportedSpeech && (
                              <p className="text-[9.5px] text-[#FF9500] bg-[#FF9500]/5 p-2 rounded border border-[#FF9500]/10 font-medium leading-relaxed">
                                ⚠️ Web Speech API tidak didukung pada peramban/iframe Anda. Untuk interaksi penuh, buka proyek di tab baru atau pastikan hak akses mikrofon aktif.
                              </p>
                            )}

                            {/* Guide for commands when microphone is focused or active */}
                            <div className="flex gap-2.5 items-center justify-between text-[8px] text-slate-400 font-semibold px-0.5">
                              <span className="uppercase text-slate-400 font-mono">Dikte Suara &amp; Perintah:</span>
                              <div className="flex gap-2 font-mono">
                                <span>🗣️ "kirim"</span>
                                <span>🗣️ "hapus"</span>
                                <span>🗣️ "tutup"</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 relative">
                              {/* Voice Dictation Trigger Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSpeechRecognition(post.id);
                                }}
                                className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all cursor-pointer ${
                                  isListening
                                    ? 'bg-red-500 border-red-500 text-white animate-pulse'
                                    : 'bg-[#F2F2F7] border-slate-300 text-slate-600 hover:bg-slate-200'
                                }`}
                                title="Tulis dengan Suara (Voice Command)"
                              >
                                {isListening ? (
                                  <MicOff className="w-4 h-4" />
                                ) : (
                                  <Mic className="w-4 h-4" />
                                )}
                              </button>

                              <input
                                type="text"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                placeholder={isListening ? "Mendikte masukan suara..." : "Tulis komentar / aspirasi..."}
                                className="flex-1 bg-white border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#42B0FF] focus:ring-1 focus:ring-[#42B0FF]"
                              />

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentSubmit(post.id, { preventDefault: () => {} } as any);
                                }}
                                disabled={!commentInput.trim()}
                                className="bg-[#42B0FF] text-white hover:bg-[#1E95EE] disabled:opacity-50 p-2.5 rounded-xl border border-transparent flex items-center justify-center shrink-0 shadow-sm transition-colors cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
