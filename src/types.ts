export interface User {
  id: string;
  email: string;
  nick: string;
  isAdmin: boolean;
  loginMethod: 'email';
  avatar?: string;
}

export interface Report {
  id: string;
  authorId: string;
  authorNick: string;
  playerNick: string;
  registrationId: string;
  reportType: 'nick' | 'rejestracja' | 'razem';
  description: string;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  reportId: string;
  authorId: string;
  authorNick: string;
  rating: number;
  comment: string;
  createdAt: string;
}
