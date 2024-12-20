import * as React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { RouteContext, getRoute } from '@ui-shared/context';
import { useTheme } from '@mui/material/styles';

export default function IconBreadcrumbs() {
  var { currentPath, setCurrentPath } = React.useContext(RouteContext);
  const theme = useTheme();

  function handleClick(requestPath) {
    console.log(requestPath)
    if (getRoute(requestPath).component) setCurrentPath(requestPath);
  }

  function Links() {
    var regex = /\/[a-zA-Z]+/g;
    var subPath = currentPath.match(regex);

    return subPath.map((path, index) => (
      <Link
        key={path}
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center', color: '#5b6f82' }}
        onClick={(event) => {
          event.preventDefault();
          handleClick(subPath.slice(0, index + 1).join(''));
        }}
        color="inherit"
        href={subPath.slice(0, index + 1).join('')}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.1rem',
            fontWeight: index == subPath.length - 1 ? '400' : '600',
            textDecoration: index == subPath.length - 1 ? 'none' : 'underline',
            color: index == subPath.length - 1 ? '#5b6f82' : '#435a70',
          }}
        >
          {camelCase(path.replace('/', ''))}
        </Typography>
      </Link>
    ));
  }

  return (
    <div role="presentation">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator="›"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            fontSize: '1.5rem',
            paddingBottom: '0.15rem',
          },
        }}
      >
        <Link
          key={'/dashboard'}
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.text.primary,
          }}
          color="inherit"
          href="/dashboard"
          onClick={(event) => {
            event.preventDefault();
            handleClick('/dashboard');
          }}
        >
          <HomeIcon
            sx={{
              mr: 0.5,
              color: '#fb8500',
              width: '1.5rem',
              height: '1.5rem',
            }}
            fontSize="inherit"
          />
        </Link>
        {Links()}
      </Breadcrumbs>
    </div>
  );
}

/**
 * Function to convert into camel Case
 * @param {string} str Stringa
 * @returns Stringa camelCase
 */
function camelCase(str) {
  return str.substring(0, 1).toLocaleUpperCase() + str.substring(1);
}
