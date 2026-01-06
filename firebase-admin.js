// Firebase Admin SDK 설정 (서버/자동화 스크립트용)
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase Admin 초기화 (중복 초기화 방지)
if (!admin.apps.length) {
  let credential;
  
  // 환경변수에 서비스 계정 키가 있는 경우
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    credential = admin.credential.cert(serviceAccount);
  } 
  // 로컬 파일이 있는 경우
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  }
  // 기본 경로 확인
  else {
    try {
      const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.error('Firebase 서비스 계정 키를 찾을 수 없습니다.');
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY 환경변수 또는 serviceAccountKey.json 파일이 필요합니다.');
    }
  }

  admin.initializeApp({
    credential: credential,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();

export default admin;

