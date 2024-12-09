import { useContext } from 'react';
import { ContentContext } from '../context/ContentContext';

export const useContent = () => useContext(ContentContext); 