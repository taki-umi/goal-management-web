export interface User {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string) => User;
    logout: () => void;
    isAuthenticated: () => boolean;
    isAdmin: () => boolean;
}