export const LanguageContext = createContext<Language>({
  language: locales.EN.value,
});

export const LanguageProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState(
    localStorage.getItem(LocalStorageKey.SELECTED_LOCALE) || locales.EN.value
  );

  useEffect(() => {
    if (navigator.language.toLowerCase().includes("es")) {
      setLanguage(locales.ES.value);
    }
  }, []);

  const selectLanguage = useCallback((selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    localStorage.setItem(LocalStorageKey.SELECTED_LOCALE, selectedLanguage);
  }, []);

  const contextValue = useMemo(
    (): Language => ({
      language,
      selectLanguage,
    }),
    [language, selectLanguage]
  );
  return (
    <LanguageContext.Provider value={contextValue}>
      <IntlProvider locale={language} messages={messages[language]}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
