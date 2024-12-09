import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { LanguageProvider } from './context/LangContext';
import { ContentProvider } from './context/ContentContext';

function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <RouterProvider router={router} />
      </ContentProvider>
    </LanguageProvider>
  );
}

export default App;
