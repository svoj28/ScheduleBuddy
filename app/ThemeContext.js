import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        if (theme !== null) {
          setIsDarkMode(theme === 'dark');
        }
      } catch (error) {
        // Handle the error gracefully without logging it
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode ? 'dark' : 'light';
      await AsyncStorage.setItem('theme', newTheme);
      setIsDarkMode(!isDarkMode);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;