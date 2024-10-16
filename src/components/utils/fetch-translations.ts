export const fetchTranslations = async (url: string, lang: string) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.names.find((name: any) => name.language.name === lang)?.name;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la traduction :", error);
  }
};
