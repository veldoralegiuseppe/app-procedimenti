import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import {AppContext} from '/src/store/app-context.jsx';
import Breadcrumbs from "/src/components/breadcrumbs/Breadcrumbs.jsx";
import { Typography } from '@mui/material';

export default function CreaProvvedimento(){

    var {currentPath} = React.useContext(AppContext);

    function getCurrentPage(){
        var regex = /\/[a-zA-Z]+/g
        var subPath = currentPath.match(regex)
        return camelCase(subPath[subPath.length -1 ].replaceAll('/',''))
    }

    return(
        <>
        <Grid xs={12}>
            <div style={{display: 'flex', backgroundColor: 'white', justifyContent: 'space-between', height: '56px', alignItems: 'center', padding: '0 16px', borderRadius: '8px'}}>
                <Typography variant="h5" sx={{fontWeight: '600', fontSize: '1.25rem', color:'#4b62a2'}}>{getCurrentPage()}</Typography>
                <Breadcrumbs></Breadcrumbs>
            </div>
        </Grid>
        </>
    )
}

/**
 * Function to convert into camel Case
 * @param {string} str Stringa
 * @returns Stringa camelCase
 */
function camelCase(str) {
    return str.substring(0,1).toLocaleUpperCase() + str.substring(1)
}