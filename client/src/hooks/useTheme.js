import shader from '../utils/colorShader';

const useTheme = () => {
  const colors = {
    light: {
      primary: '#FF8C00',
      secondary: '#1E90FF',
      tertiary: '#32CD32',
      textColor: '#333',
      backgroundColor: '#F4F4F4'
    },
    dark: {
      primary: shader('#FF8C00', 0.2),
      secondary: shader('#1E90FF', 0.2),
      tertiary: shader('#32CD32', 0.2),
      textColor: '#F4F4F4',
      backgroundColor: '#333'
    }
  };

  const rootEl = document.querySelector(':root');

  return (theme, primaryColor) => {
    rootEl.style.setProperty('--primary', colors[theme][primaryColor]);
    rootEl.style.setProperty('--primary-light', shader(colors[theme][primaryColor], 0.2));
    rootEl.style.setProperty('--primary-dark', colors['dark'][primaryColor]);
    rootEl.style.setProperty('--background-color', colors[theme]['backgroundColor']);
    rootEl.style.setProperty('--text-color', colors[theme]['textColor']);
  }
};

export default useTheme;
