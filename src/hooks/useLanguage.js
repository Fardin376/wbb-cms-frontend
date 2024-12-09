import { useContext } from 'react';
import { LanguageContext } from '../context/LangContext';

export const useLanguage = () => useContext(LanguageContext);
