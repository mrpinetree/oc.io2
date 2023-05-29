import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  if (!name) {
    return null; // Si el nombre es undefined o nulo, retorna null
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}`,
  };
}


export const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userNombre, setUserNombre] = useState("Invitado");
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      url: 'http://localhost:8080/user',
      method: 'GET',
      withCredentials: true,
    })
      .then(res => {
        setUserData(res.data);
        setUserNombre(res.data.nombre);
      })
      .catch(err => console.log(err))
  }, []);


  const handleClick = () => {
    axios.get('http://localhost:8080/logout', { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          // Actualizar el estado o realizar cualquier acción adicional
          navigate('/');
          console.log('Sesión cerrada correctamente');
        }
      })
      .catch(error => console.error(error));
  };

  const handleMenuOptionClick = (option) => {
    handleCloseUserMenu(); // Cerrar el menú desplegable
    if (option === 'Perfil') {
      navigate('/home/perfil'); // Redirigir a la página de perfil
    } else if (option === 'Cerrar sesión') {
      handleClick(); // Realizar acción para cerrar sesión
    }
  };



  // Literales de página

  const pages = !!userData ?
    userData.rol === 'usuario' ?
      [
        {
          title: 'Home',
          path: '/home'
        },
        {
          title: 'Mis Entradas',
          path: '/home/entradas'
        },
      ] :
      userData.rol === 'empresa' ?
        [
          {
            title: 'Home',
            path: '/home'
          },
          {
            title: 'Crear Eventos',
            path: '/home/crearEvento'
          },
        ] :
        userData.rol === 'admin' ?
          [
            {
              title: 'Empresas',
              path: '/empresas'
            },
            {
              title: 'Validar Empresas',
              path: '/validarEmpresas'
            }

          ] :
          [] :
    [
      {
        title: 'Iniciar sesión',
        path: '/login'
      },
      {
        title: 'Registrarse',
        path: '/registro'
      }
    ];


  const settings = ['Perfil', 'Cerrar sesión'];

  // Responsive
  const handleOpenNavMenu = event => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = event => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Diversity3Icon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OC.IO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>


          <Diversity3Icon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OC.IO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={page.path}
              >
                {page.title}
              </Button>
              
            ))}
          </Box>

          {!!userData &&
            <>
              <Stack><Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Tooltip title={userNombre} placement="bottom">
                      <Avatar {...stringAvatar(userNombre)} />
                    </Tooltip>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleMenuOptionClick(setting)}> {/* Llamar a handleMenuOptionClick con la opción seleccionada */}
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              </Stack>
            </>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;