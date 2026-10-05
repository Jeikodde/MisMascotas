import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getDarkTheme, getSession, logOut, saveDarkTheme, saveSession } from "../services/storage.service";

export interface ThemColors {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  border: string;
  danger: string;
}

export const lightTheme: ThemColors = {
  background: '#F5F7FB',
  card: '#FFF',
  text: '#1E293B',
  subtext: '#64748B',
  primary: '#2563EB',
  border: '#E2E8F0',
  danger: '#EF4444'
}

export const darkTheme: ThemColors = {
  background: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  subtext: '#94A3B8',
  primary: '#3B82F6',
  border: '#334155',
  danger: '#F87171'
}

interface AppContextType {
  user: string | null;
  isDarkMode: boolean;
  colors: ThemColors;
  isLoading: boolean;
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedUser = await getSession();
        const savedTheme = await getDarkTheme();

        if(savedUser) setUser(savedUser);
        setIsDarkMode(savedTheme);
      } catch(error) {
        console.log('Error loading initial preferences from storage: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = async (username: string) => {
    await saveSession(username);
    setUser(username);
  }

  const signOut = async () => {
    await logOut();
    setUser(null);
    setIsDarkMode(false);
  }

  const toggleTheme = async () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    await saveDarkTheme(nextTheme);
  }

  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <AppContext.Provider
      value={{
        user,
        isDarkMode,
        colors,
        isLoading,
        signIn,
        signOut,
        toggleTheme
      }}
    >
      { children }
    </AppContext.Provider>
  );
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);

  if(!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
}