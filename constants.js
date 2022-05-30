export const APP_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://thunderous-panda-a976d7.netlify.app';

export const YOUR_REDIRECT_URL = `${APP_URL}/api/google/callback`;

export const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
];
