// packages/shared-types/index.ts

// Enum untuk status streaming
export enum StreamStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
}

// Tipe data untuk pengguna (User)
export type User = {
  id: string;
  wallet: string; // Wallet address sebagai unique identifier
  username?: string;
  createdAt: Date;
};

// Tipe data untuk profil pengguna
export type UserProfile = {
  id: string;
  walletAddress: string; // Alamat wallet Solana
  username?: string;
  profileImageUrl?: string; // Tanda tanya (?) berarti opsional
};

// Tipe data untuk sebuah sesi stream
export type Stream = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: StreamStatus;
  streamerId: string; // Foreign key ke User
  streamer?: UserProfile; // Optional reference ke profil streamer
  viewerCount: number;
  isLive: boolean;
  createdAt: Date;
  startTime?: Date;
  endTime?: Date;
};

// Tipe data untuk donasi
export type Donation = {
  id: string;
  from: string; // Wallet address pengirim
  to: string; // Wallet address penerima (streamer)
  amount: number; // Jumlah donasi
  message?: string; // Pesan opsional dari donatur
  txSignature: string; // Signature transaksi Solana
  timestamp: Date;
  isAnonymous?: boolean; // Apakah donasi anonim
};

// Tipe data untuk polling
export type Poll = {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[]; // Array of options with vote counts
  isActive: boolean;
  streamId: string; // Foreign key ke Stream
  createdAt: Date;
};

// Tipe untuk respon API standar
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// Tipe untuk request donasi
export type CreateDonationRequest = {
  to: string; // Wallet address streamer
  amount: number;
  message?: string;
  txSignature: string;
  isAnonymous?: boolean;
};

// Tipe untuk request vote polling
export type VotePollRequest = {
  pollId: string;
  optionId: string;
};

// Tipe untuk request create stream
export type CreateStreamRequest = {
  title: string;
  description?: string;
  category?: string;
};
