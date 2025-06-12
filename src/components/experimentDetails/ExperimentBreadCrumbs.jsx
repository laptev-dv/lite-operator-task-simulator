import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const ExperimentBreadcrumbs = ({ folderId, lastName = "Эксперимент" }) => (
  <Breadcrumbs separator={"/"} sx={{ mb: 1 }}>
    <Link
      component={RouterLink}
      to="/library"
      style={{
        textDecoration: "none",
        color: "primary",
        "&:hover": { textDecoration: "underline" },
      }}
    >
      Библиотека
    </Link>

    {folderId && (
      <Link
        component={RouterLink}
        to={`/folder/${folderId}`}
        style={{
          textDecoration: "none",
          color: "primary",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        Папка
      </Link>
    )}

    <Typography color="text.secondary">{lastName}</Typography>
  </Breadcrumbs>
);

export default ExperimentBreadcrumbs;
