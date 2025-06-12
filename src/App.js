import { Routes, Route } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import ExperimentLayout from "./layouts/ExperimentLayout";
import CreateExperimentPage from "./pages/CreateExperimentPage";
import FolderPage from "./pages/FolderPage";
import ExperimentPage from "./pages/ExperimentPage";
import SessionsListPage from "./pages/SessionsListPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import ExperimentRunPage from "./pages/ExperimentRunPage";

function App() {
  return (
    <>
      <Routes basename={process.env.PUBLIC_URL}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LibraryPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="profile" element={<ProfilePage />} />

          <Route path="experiment">
            <Route path="create" element={<CreateExperimentPage />} />
            <Route path=":id" element={<ExperimentPage />} />
            <Route path=":id/sessions" element={<SessionsListPage />} />
          </Route>

          <Route path="folder/:id" element={<FolderPage />} />
          <Route path="session/:id" element={<SessionDetailPage />} />
        </Route>

        <Route path="/experiment/:id/run" element={<ExperimentLayout />}>
          <Route index element={<ExperimentRunPage />} />
        </Route>

        {/* Страница 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
