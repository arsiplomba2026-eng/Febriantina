/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// User status options during registration
export type UserStatus = 'Rakyat Umum' | 'Penyusun Kebijakan' | 'Akademisi / Ahli' | 'Lembaga Hukum' | 'Mahasiswa';

export interface UserProfile {
  email: string;
  phone: string;
  status: UserStatus;
  avatarUrl: string;
  name: string;
}

// Stage of Legislative creation (RUU Prioritas alur stepper)
export type LegislativeStage = 'Perencanaan' | 'Penyusunan' | 'Pembahasan' | 'Pengesahan' | 'Pengundangan';

export interface LegislativeStageInfo {
  stage: LegislativeStage;
  status: 'completed' | 'active' | 'pending';
  date?: string;
  description: string;
}

export interface LegislationItem {
  id: string;
  title: string;
  category: 'prioritas' | 'terbaru' | 'berlaku';
  number?: string; // e.g. "UU No. 12 Tahun 2024" or "Draft"
  year: number;
  description: string;
  smartSummary: string; // Brief core explanation of the law/bill
  progressStages?: LegislativeStageInfo[];
  currentStage?: LegislativeStage;
  sourceUrl?: string;
  proponents?: string[]; // e.g. "DPR RI", "Presiden"
  viewsCount: number;
  discussCount: number;
}

export interface DiscussionComment {
  id: string;
  userName: string;
  userStatus: UserStatus;
  avatarUrl: string;
  content: string;
  timestamp: string;
  likes: number;
  sentiment?: 'positif' | 'negatif' | 'netral';
}

export interface SentimentSummary {
  overallSentiment: 'positif' | 'negatif' | 'netral';
  positifPercentage: number;
  negatifPercentage: number;
  netralPercentage: number;
  insightsText: string;
  recommendation: string;
  analyzedAt: string;
}

export interface ForumPost {
  id: string;
  ruuId?: string; // associated RUU/law if any
  ruuTitle?: string;
  title: string;
  authorName: string;
  authorStatus: UserStatus;
  authorAvatar: string;
  content: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
  comments: DiscussionComment[];
  timestamp: string;
  category: string;
  sentimentSummary?: SentimentSummary;
}

export interface PollState {
  id: string;
  question: string;
  ruuId?: string;
  ruuTitle?: string;
  agreeCount: number;
  disagreeCount: number;
  totalVotes: number;
  userVote: 'setuju' | 'tidak_setuju' | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  unread: boolean;
  relatedRuuId?: string;
  stageName?: string;
}
