import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const SessionBreadCrumbs = ({ experimentId, lastName = "Сессия" }) => (
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

    <Link
      component={RouterLink}
      to={`/experiment/${experimentId}`}
      style={{
        textDecoration: "none",
        color: "primary",
        "&:hover": { textDecoration: "underline" },
      }}
    >
      Эксперимент
    </Link>

    <Typography color="text.secondary">{lastName}</Typography>
  </Breadcrumbs>
);

export default SessionBreadCrumbs;
