// Theme Initializer Component - يضمن تطبيق الثيم الصحيح عند التحميل
import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeInitializer = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    // تطبيق الثيم فوراً عند تحميل التطبيق
    const applyTheme = () => {
      // تطبيق data-theme attribute
      document.documentElement.setAttribute(
        'data-theme',
        darkMode ? 'dark' : 'light'
      );

      // تطبيق classes على body
      if (darkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }

      // تطبيق meta theme-color للمتصفحات المحمولة
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.name = 'theme-color';
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.content = darkMode ? '#0d0d0f' : '#ffffff';

      // تطبيق meta color-scheme
      let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
      if (!colorSchemeMeta) {
        colorSchemeMeta = document.createElement('meta');
        colorSchemeMeta.name = 'color-scheme';
        document.head.appendChild(colorSchemeMeta);
      }
      colorSchemeMeta.content = darkMode ? 'dark' : 'light';
    };

    applyTheme();
  }, [darkMode]);

  // هذا المكون لا يعرض أي شيء، فقط يطبق الثيم
  return null;
};

export default ThemeInitializer;
