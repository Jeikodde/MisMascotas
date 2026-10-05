import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = 'user_session';
const THEME_KEY = 'dark_theme';

export const saveSession = async (username: string): Promise<void> => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
}

export const getSession = async (): Promise<string | null> => {
  const storedSession = await AsyncStorage.getItem(SESSION_KEY);

  if(!storedSession) {
    return null;
  }

  const session: { username: string } = JSON.parse(storedSession);
  return session.username;
}

export const saveDarkTheme = async (isDark: boolean): Promise<void> => {
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDark));
}

export const getDarkTheme = async (): Promise<boolean> => {
  const storedTheme = await AsyncStorage.getItem(THEME_KEY);

  if(!storedTheme) {
    return false;
  }

  return JSON.parse(storedTheme) as boolean;
}

export const logOut = async (): Promise<void> => {
  await AsyncStorage.multiRemove([SESSION_KEY, THEME_KEY]);
}