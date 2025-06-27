import React from 'react';
import { Button } from './ui/button';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  console.log("Current theme", theme);

  return (
    <Button
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <MoonIcon className="!size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      
      {/* SunIcon: Hidden in light, visible in dark. Positioned absolutely to overlap MoonIcon. */}
      <SunIcon className="absolute !size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggleButton;