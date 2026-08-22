export type UserRole = "admin" | "user";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface UserInput {
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  password?: string;
}
