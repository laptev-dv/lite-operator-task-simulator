import { Routes, Route } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import InfoPage from "./pages/InfoPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import ExperimentLayout from "./layouts/ExperimentLayout";
import CreateExperimentPage from "./pages/CreateExperimentPage";
import ExperimentDetailsPage from "./pages/ExperimentDetailsPage";
import ExperimentRunPage from "./pages/ExperimentRunPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LibraryPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="info" element={<InfoPage />} />

          <Route path="experiment">
            <Route path="create" element={<CreateExperimentPage />} />
            <Route path=":id" element={<ExperimentDetailsPage />} />
          </Route>
          
          {/* Страница 404 с MainLayout */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="experiment/:id/run" element={<ExperimentLayout />}>
          <Route index element={<ExperimentRunPage />} />
        </Route>
      </Routes>
  );
}

export default App;