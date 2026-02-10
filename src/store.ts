import { v4 as uuidv4 } from 'uuid';
import type { User, Report, Review } from './types';

const USERS_KEY = 'stoppcd_users';
const REPORTS_KEY = 'stoppcd_reports';
const REVIEWS_KEY = 'stoppcd_reviews';
const SESSION_KEY = 'stoppcd_session';
const FILES_KEY = 'stoppcd_files';
const PASSWORDS_KEY = 'stoppcd_passwords';

function initializeUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    const users: User[] = JSON.parse(stored);
    const adminExists = users.some(u => u.email === 'olektekli@gmail.com');
    if (!adminExists) {
      users.push({
        id: 'admin-1',
        email: 'olektekli@gmail.com',
        nick: 'lewiksowy',
        isAdmin: true,
        loginMethod: 'email',
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  }
  const defaultUsers: User[] = [
    {
      id: 'admin-1',
      email: 'olektekli@gmail.com',
      nick: 'lewiksowy',
      isAdmin: true,
      loginMethod: 'email',
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function initializePasswords(): Record<string, string> {
  const stored = localStorage.getItem(PASSWORDS_KEY);
  if (stored) {
    const passwords = JSON.parse(stored);
    if (!passwords['olektekli@gmail.com']) {
      passwords['olektekli@gmail.com'] = 'Aleksander1@';
      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
    }
    return passwords;
  }
  const defaults: Record<string, string> = {
    'olektekli@gmail.com': 'Aleksander1@',
  };
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(defaults));
  return defaults;
}

export function getUsers(): User[] {
  return initializeUsers();
}

export function getPasswords(): Record<string, string> {
  return initializePasswords();
}

export function loginWithEmail(email: string, password: string): User | null {
  const users = getUsers();
  const passwords = getPasswords();
  const user = users.find(u => u.email === email);
  if (user && passwords[email] === password) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function registerUser(email: string, password: string, nick: string): User | null {
  const users = getUsers();
  const passwords = getPasswords();
  if (users.some(u => u.email === email)) return null;
  const newUser: User = {
    id: uuidv4(),
    email,
    nick,
    isAdmin: false,
    loginMethod: 'email',
  };
  users.push(newUser);
  passwords[email] = password;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return newUser;
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) return JSON.parse(stored);
  return null;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Reports
export function getReports(): Report[] {
  const stored = localStorage.getItem(REPORTS_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

export function createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Report {
  const reports = getReports();
  const newReport: Report = {
    ...report,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  reports.unshift(newReport);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return newReport;
}

export function deleteReport(reportId: string): void {
  let reports = getReports();
  const report = reports.find(r => r.id === reportId);
  if (report && report.fileUrl) {
    deleteFile(reportId);
  }
  reports = reports.filter(r => r.id !== reportId);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  // Delete associated reviews
  let reviews = getReviews();
  reviews = reviews.filter(r => r.reportId !== reportId);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// File storage (base64 in localStorage)
export function saveFile(reportId: string, base64: string): void {
  const files: Record<string, string> = JSON.parse(localStorage.getItem(FILES_KEY) || '{}');
  files[reportId] = base64;
  localStorage.setItem(FILES_KEY, JSON.stringify(files));
}

export function getFile(reportId: string): string | null {
  const files: Record<string, string> = JSON.parse(localStorage.getItem(FILES_KEY) || '{}');
  return files[reportId] || null;
}

export function deleteFile(reportId: string): void {
  const files: Record<string, string> = JSON.parse(localStorage.getItem(FILES_KEY) || '{}');
  delete files[reportId];
  localStorage.setItem(FILES_KEY, JSON.stringify(files));
}

// Reviews
export function getReviews(): Review[] {
  const stored = localStorage.getItem(REVIEWS_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

export function addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(newReview);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  return newReview;
}

export function deleteReview(reviewId: string): void {
  let reviews = getReviews();
  reviews = reviews.filter(r => r.id !== reviewId);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}
