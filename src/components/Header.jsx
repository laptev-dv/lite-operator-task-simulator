import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PersonIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
      <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Имитатор операторской задачи
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/lite-operator-task-simulator/library"
              startIcon={<LibraryBooksIcon />}
            >
              Исследования
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/lite-operator-task-simulator/profile"
              startIcon={<PersonIcon />}
            >
              Подсказка
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem 
                component={RouterLink} 
                to="/lite-operator-task-simulator/library"
                onClick={handleClose}
              >
                <LibraryBooksIcon sx={{ mr: 1 }} />
                Исследования
              </MenuItem>
              <MenuItem 
                component={RouterLink} 
                to="/lite-operator-task-simulator/profile"
                onClick={handleClose}
              >
                <PersonIcon sx={{ mr: 1 }} />
                Подсказка
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
  );
}

export default Header;