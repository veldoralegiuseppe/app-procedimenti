import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { Typography } from '@mui/material';
import { AppContext, getRoute } from '/src/store/app-context.jsx';

export default function IconBreadcrumbs() {
    var {currentPath, setCurrentPath} = React.useContext(AppContext);

    function handleClick(requestPath) {
        if(getRoute(requestPath).component) setCurrentPath(requestPath)
    }
 
    function Links(){
        var regex = /\/[a-zA-Z]+/g
        var subPath = currentPath.match(regex)

        return subPath.map((path, index) => (
            <Link key={path} 
                  underline="hover" 
                  sx={{ display: 'flex', alignItems: 'center' }} 
                  onClick={(event) => {event.preventDefault(); handleClick(subPath.slice(0, index+1).join(''))}} 
                  color="inherit" 
                  href={subPath.slice(0, index+1).join('')}>
                 <Typography variant="h6" sx={{fontSize: '0.9rem'}}>{camelCase(path.replace('/',''))}</Typography>
            </Link>
        ))
    }

    return (
        <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{'& .MuiBreadcrumbs-separator':{fontSize: '1.5rem', paddingBottom: '0.15rem'} }}>
            <Link 
                key={'/dashboard'} 
                underline="hover" 
                sx={{ display: 'flex', alignItems: 'center' }} 
                color="inherit" href="/dashboard" 
                onClick={(event) => {event.preventDefault(); handleClick('/dashboard')}} >
                <HomeIcon sx={{ mr: 0.5, color: '#fb8500', width:'1.25rem', height: '1.25rem' }} fontSize="inherit" />
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
    return str.substring(0,1).toLocaleUpperCase() + str.substring(1)
}