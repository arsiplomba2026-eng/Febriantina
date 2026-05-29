/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegislationItem, ForumPost, PollState } from '../types';

export const TRENDING_CASES = [
  'UU ITE Pasal Pencemaran Nama Baik',
  'RUU Perampasan Aset Tindak Pidana',
  'RUU KUHP Amandemen Baru',
  'UU Cipta Kerja Sektor Ketenagakerjaan',
  'RUU Pelindungan Data Pribadi (PDP)',
  'UU Kesehatan Regulasi Kedokteran'
];

export const INITIAL_LEGISLATION: LegislationItem[] = [
  {
    id: 'ruu-perampasan-aset',
    title: 'RUU Perampasan Aset Tindak Pidana',
    category: 'prioritas',
    number: 'RUU Prioritas 2025/2026',
    year: 2025,
    description: 'Rancangan Undang-Undang tentang penegakan hukum dalam merampas aset hasil tindak pidana korupsi dan kejahatan ekonomi lainnya yang berada di dalam maupun di luar negeri tanpa menunggu putusan pidana pelaku (Non-Conviction Based Asset Forfeiture).',
    smartSummary: 'Memungkinkan negara menyita aset haram (korupsi/narkoba) yang tidak wajar langsung melalui hukum perdata, memotong birokrasi pembuktian pidana yang sering kali memakan waktu bertahun-tahun.',
    proponents: ['Presiden RI', 'Pemerintah (Kemenkumham)', 'KPK'],
    viewsCount: 14520,
    discussCount: 384,
    currentStage: 'Pembahasan',
    progressStages: [
      {
        stage: 'Perencanaan',
        status: 'completed',
        date: '12 Jan 2024',
        description: 'Penyusunan naskah akademik dan harmonisasi kepentingan nasional oleh BPHN Kemenkumham.'
      },
      {
        stage: 'Penyusunan',
        status: 'completed',
        date: '18 Mei 2024',
        description: 'Penyelarasan antar kementerian dan penandatanganan Surat Presiden (Surpres) untuk diajukan ke DPR.'
      },
      {
        stage: 'Pembahasan',
        status: 'active',
        date: '10 Feb 2025',
        description: 'Sedang digodok secara intensif di Komisi III DPR RI bersama Panja (Panitia Kerja) Pemerintah.'
      },
      {
        stage: 'Pengesahan',
        status: 'pending',
        description: 'Persetujuan bersama dalam Rapat Paripurna DPR RI.'
      },
      {
        stage: 'Pengundangan',
        status: 'pending',
        description: 'Penandatanganan oleh Presiden dan registrasi di Lembaran Negara oleh Kementerian Sekretariat Negara.'
      }
    ]
  },
  {
    id: 'ruu-kuhp-edit',
    title: 'RUU KUHP (Revisi Tindak Pidana Khusus)',
    category: 'prioritas',
    number: 'RUU Amandemen',
    year: 2025,
    description: 'Penyelarasan bab tindak pidana khusus dalam Kitab Undang-Undang Hukum Pidana baru untuk menguatkan pemberantasan tindak pencucian uang dan regulasi siber.',
    smartSummary: 'Amandemen penyelarasan KUHP Nasional dengan dinamika teknologi mutakhir, memperjelas batasan kejahatan pencucian uang kripto serta aksi peretasan canggih.',
    proponents: ['DPR RI (Baleg)', 'Akademisi Hukum'],
    viewsCount: 8930,
    discussCount: 192,
    currentStage: 'Penyusunan',
    progressStages: [
      {
        stage: 'Perencanaan',
        status: 'completed',
        date: '4 Mar 2024',
        description: 'Usulan inisiatif Baleg DPR RI berdasarkan masukan asosiasi pakar hukum pidana.'
      },
      {
        stage: 'Penyusunan',
        status: 'active',
        date: '28 Jul 2024',
        description: 'Penyusunan rancangan pasal-pasal komparatif sanksi pidana minimum.'
      },
      {
        stage: 'Pembahasan',
        status: 'pending',
        description: 'Menunggu pembahasan tingkat I di DPR.'
      },
      {
        stage: 'Pengesahan',
        status: 'pending',
        description: 'Persetujuan Rapat Paripurna.'
      },
      {
        stage: 'Pengundangan',
        status: 'pending',
        description: 'Lembaran Negara RI.'
      }
    ]
  },
  {
    id: 'ruu-pdp',
    title: 'RUU Amandemen Perlindungan Konsumen Digital',
    category: 'prioritas',
    number: 'RUU Perlindungan Konsumen',
    year: 2026,
    description: 'Penguatan jaminan ganti rugi dalam transaksi e-commerce dan perlindungan data sensitif konsumen dari kebocoran korporasi pihak ketiga.',
    smartSummary: 'Memberikan denda administratif mutlak serta hak gugatan massal (Class Action) bagi korban kebocoran data belanja online.',
    proponents: ['Kementerian Perdagangan', 'YLKI'],
    viewsCount: 6540,
    discussCount: 112,
    currentStage: 'Perencanaan',
    progressStages: [
      {
        stage: 'Perencanaan',
        status: 'active',
        date: '02 Apr 2025',
        description: 'Penyusunan Naskah Akademik draf revisi undang-undang perlindungan konsumen era e-commerce.'
      },
      {
        stage: 'Penyusunan',
        status: 'pending',
        description: 'Harmonisasi draf draf rancangan.'
      },
      {
        stage: 'Pembahasan',
        status: 'pending',
        description: 'Pembahasan Rapat Dengar Pendapat Umum.'
      },
      {
        stage: 'Pengesahan',
        status: 'pending',
        description: 'Pengesahan Paripurna.'
      },
      {
        stage: 'Pengundangan',
        status: 'pending',
        description: 'Pengundangan Resmi.'
      }
    ]
  },
  // Peraturan Terbaru (Terbaru)
  {
    id: 'uu-ite-1-2024',
    title: 'UU No. 1 Tahun 2024 tentang Perubahan Kedua UU ITE',
    category: 'terbaru',
    number: 'UU No. 1 Tahun 2024',
    year: 2024,
    description: 'Undang-Undang penyesuaian pasal-pasal bermasalah (pasal karet) fitnah, pencemaran nama baik, dan penyebaran berita bohong agar tidak mencederai kebebasan berekspresi demokratis di media sosial.',
    smartSummary: 'Melonggarkan jeratan hukum pidana pencemaran nama baik dengan mengutamakan "restorative justice" (keadilan restoratif), dan memperjelas hak koreksi informasi.',
    proponents: ['Presiden RI', 'DPR RI (Komisi I)'],
    viewsCount: 23110,
    discussCount: 540
  },
  {
    id: 'uu-kesehatan-2023',
    title: 'UU No. 17 Tahun 2023 tentang Kesehatan',
    category: 'terbaru',
    number: 'UU No. 17 Tahun 2023',
    year: 2023,
    description: 'Penerapan metode Omnibus Law di bidang kesehatan untuk reformasi sistem ketahanan medis, izin praktik dokter (STR seumur hidup), dan pemerataan faskes di seluruh pelosok Indonesia.',
    smartSummary: 'Penyederhanaan regulasi kedokteran nasional, menetapkan registrasi dokter menjadi seumur hidup, dan mendesentralisasikan anggaran kesehatan daerah.',
    proponents: ['Pemerintah (Kemenkes)'],
    viewsCount: 19800,
    discussCount: 412
  },
  // Peraturan yang Sedang Berlaku (Berlaku)
  {
    id: 'uu-cipta-kerja',
    title: 'UU No. 6 Tahun 2023 tentang Penetapan Perppu Cipta Kerja',
    category: 'berlaku',
    number: 'UU No. 6 Tahun 2023',
    year: 2023,
    description: 'Regulasi komprehensif (Omnibus Law) penciptaan lapangan kerja, kemudahan investasi, penyederhanaan perizinan berusaha, reformasi ketenagakerjaan, dan dukungan UMKM.',
    smartSummary: 'Mengonsolidasikan lebih dari 70 undang-undang investasi dan ketenagakerjaan menjadi satu payung hukum tunggal untuk memacu kompetisi ekonomi nasional.',
    proponents: ['Presiden RI', 'Pemerintah RI'],
    viewsCount: 42100,
    discussCount: 890
  },
  {
    id: 'uu-pdp-27-2022',
    title: 'UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi',
    category: 'berlaku',
    number: 'UU No. 27 Tahun 2022',
    year: 2022,
    description: 'Kerangka hukum pelindungan data siber pribadi masyarakat umum, hak subjek data, kewajiban pengendali data (korporasi/pemerintah), serta pembentukan lembaga pengawas independen.',
    smartSummary: 'Menetapkan denda gila-gilaan bagi korporasi yang membiarkan data bocor, serta mendefinisikan hak warga negara untuk minta datanya dihapus selamanya.',
    proponents: ['Kemenkominfo', 'DPR RI'],
    viewsCount: 31200,
    discussCount: 295
  }
];

export const INITIAL_POLLS: PollState[] = [
  {
    id: 'poll-perampasan-aset',
    question: 'Apakah Anda mendukung RUU Perampasan Aset disahkan tanpa menunggu vonis pidana pelaku (sitaan langsung non-conviction)?',
    ruuId: 'ruu-perampasan-aset',
    ruuTitle: 'RUU Perampasan Aset',
    agreeCount: 4290,
    disagreeCount: 142,
    totalVotes: 4432,
    userVote: null
  },
  {
    id: 'poll-restorative-ite',
    question: 'Setujukah Anda dengan penerapan Restorative Justice untuk kasus dugaan pencemaran nama baik di bawah UU ITE?',
    ruuId: 'uu-ite-1-2024',
    ruuTitle: 'UU ITE Amandemen 2024',
    agreeCount: 2810,
    disagreeCount: 654,
    totalVotes: 3464,
    userVote: null
  },
  {
    id: 'poll-ciptaker-kontrak',
    question: 'Apakah durasi kerja kontrak (PKWT) yang diperpanjang hingga maksimum 5 tahun dalam UU Cipta Kerja sudah adil bagi para buruh?',
    ruuId: 'uu-cipta-kerja',
    ruuTitle: 'UU Cipta Kerja',
    agreeCount: 432,
    disagreeCount: 3980,
    totalVotes: 4412,
    userVote: null
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    ruuId: 'ruu-perampasan-aset',
    ruuTitle: 'RUU Perampasan Aset',
    title: 'Mengapa RUU Perampasan Aset Selalu Tertunda di DPR?',
    authorName: 'Prof. Rudi Hermawan',
    authorStatus: 'Akademisi / Ahli',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    content: 'Sebagai akademisi hukum, saya melihat ada benturan kepentingan yang sangat tebal dalam pembahasan RUU ini di parlemen. Mekanisme "Non-Conviction Based Asset Forfeiture" ini ditakuti karena memindahkan beban pembuktian kepada terlapor (terdakwa korupsi harus membuktikan harta mereka sah, bukan jaksa yang membuktikan haram). Tanpa desakan publik yang revolusioner, RUU ini akan terus digantung di Komisi III.',
    likes: 840,
    dislikes: 12,
    userVote: null,
    timestamp: '2 jam yang lalu',
    category: 'Kritik Kebijakan',
    comments: [
      {
        id: 'comment-1-1',
        userName: 'Siti Rahmawati',
        userStatus: 'Mahasiswa',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        content: 'Betul Prof! Kami di kampus terus mengawal ini dengan audiensi dan kajian akademis. Penting bagi pemilih muda untuk melihat partai mana saja yang enggan meloloskan RUU ini.',
        likes: 184,
        timestamp: '1 jam yang lalu'
      },
      {
        id: 'comment-1-2',
        userName: 'Bagus S.',
        userStatus: 'Rakyat Umum',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        content: 'Presiden juga harus bersikap tegas dan tidak melakukan kompromi politik demi stabilitas koalisi semata. Demi masa depan Indonesia Emas 2045 kelak.',
        likes: 95,
        timestamp: '45 menit yang lalu'
      }
    ]
  },
  {
    id: 'post-2',
    ruuId: 'uu-ite-1-2024',
    ruuTitle: 'UU No. 1 Tahun 2024',
    title: 'Reformasi Pasal Karet UU ITE Harus Menyasar Platform Media Sosial',
    authorName: 'Aditya Perkasa',
    authorStatus: 'Lembaga Hukum',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    content: 'Meskipun UU ITE hasil revisi kedua meringankan sanksi pidana pencemaran nama baik, kami mencatat masih adanya celah hukum di mana penegak hukum tingkat bawah langsung melakukan penahanan sebelum dilakukan mediasi (Restorative Justice). Harus ada kesepahaman bersama berupa SKB Jaksa Agung, Kapolri, dan Menkominfo yang lebih ketat.',
    likes: 412,
    dislikes: 18,
    userVote: null,
    timestamp: '5 jam yang lalu',
    category: 'Ulasan Yuridis',
    comments: [
      {
        id: 'comment-2-1',
        userName: 'Dr. Diana Sari',
        userStatus: 'Akademisi / Ahli',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        content: 'Setuju, regulasi prosedural di tingkat Polres/Polsek sering menyimpang dari maksud pembuat undang-undang karena mengejar target penanganan kasus.',
        likes: 72,
        timestamp: '3 jam yang lalu'
      }
    ]
  },
  {
    id: 'post-3',
    ruuId: 'uu-cipta-kerja',
    ruuTitle: 'UU Cipta Kerja',
    title: 'Evaluasi Dampak PKWT Panjang Terhadap Keamanan Finansial Buruh Muda',
    authorName: 'Amri Siregar',
    authorStatus: 'Rakyat Umum',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    content: 'Sebagai pekerja pabrik sikat gigi di Karawang, aturan kontrak diperpanjang hingga 5 tahun sangat merugikan kami. Perusahaan terus mengontrak ulang tanpa pernah mengangkat kami jadi karyawan tetap. Tidak ada jaminan pesangon yang kokoh, membuat kami kesulitan mengambil cicilan rumah sederhana sekalipun karena slip gaji non-permanen.',
    likes: 1420,
    dislikes: 54,
    userVote: null,
    timestamp: '1 hari yang lalu',
    category: 'Dampak Sosial',
    comments: [
      {
        id: 'comment-3-1',
        userName: 'Farhan Maulana',
        userStatus: 'Mahasiswa',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        content: 'Suara langsung dari lapangan seperti ini yang jarang didengar dalam ruang sidang DPR tertutup! Ini membuktikan perlunya aplikasi seperti Nexus Law agar legislator sadar dampak nyata kebijakannya.',
        likes: 310,
        timestamp: '18 jam yang lalu'
      },
      {
        id: 'comment-3-2',
        userName: 'Supendi (Yandri & Associates)',
        userStatus: 'Lembaga Hukum',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        content: 'Ada celah hukum gugatan PHI jika perpanjangan melampaui ketentuan kumulatif dasar perundang-undangan. Silakan hubungi LBH daerah Anda.',
        likes: 125,
        timestamp: '15 jam yang lalu'
      }
    ]
  }
];
