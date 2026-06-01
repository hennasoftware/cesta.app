import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'cesta.theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return false;

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'dark') return true;
  if (storedTheme === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggleDarkMode: () => setIsDark((value) => !value) };
}
