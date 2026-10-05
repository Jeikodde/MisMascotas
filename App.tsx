import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeDatabase } from './src/services/database.service';

function Main() {
  const { isDarkMode } = useApp();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  useEffect(() => {
    initializeDatabase()
      .then(() => console.log('SQLite inicializada con éxito'))
      .catch((error: any) => console.error('Error inicializando SQLite:', error));
  }, []);

  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}