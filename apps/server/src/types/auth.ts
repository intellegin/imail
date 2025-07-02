export interface CustomUser {
  id: string;
  email: string;
  username?: string;
  name?: string;
  created_at: Date;
  updated_at: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
