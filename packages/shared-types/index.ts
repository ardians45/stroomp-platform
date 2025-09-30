// packages/shared-types/index.ts

// Enum untuk status streaming
export enum StreamStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
}

// Tipe data untuk profil pengguna
export type UserProfile = {
  id: string;
  walletAddress: string; // Alamat wallet Solana
  username: string;
  profileImageUrl?: string; // Tanda tanya (?) berarti opsional
};

// Tipe data untuk sebuah sesi stream
export type Stream = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: StreamStatus;
  streamer: UserProfile; // Menggunakan tipe UserProfile di sini
  viewers: number;
  startTime: Date;
};

// Tipe untuk respon API standar
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
