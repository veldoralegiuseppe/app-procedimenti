import * as React from 'react';
import {AppContext} from '/src/store/app-context.jsx';
import Breadcrumbs from "/src/components/breadcrumbs/Breadcrumbs.jsx";
import { Typography } from '@mui/material';
import HorizontalLinearStepper from '/src/components/stepper/Stepper.jsx';

export default function CreaProvvedimento(){

    var {currentPath} = React.useContext(AppContext);
    

    function getCurrentPage(){
        var regex = /\/[a-zA-Z]+/g
        var subPath = currentPath.match(regex)
        return camelCase(subPath[subPath.length -1 ].replaceAll('/',''))
    }

    return(
        <div style={{display: 'flex', flexDirection: 'column', flex: '1', rowGap: '5rem'}}>
            <div style={{display: 'flex', backgroundColor: 'white', justifyContent: 'space-between', height: '56px', alignItems: 'center', padding: '0 16px', borderRadius: '8px'}}>
                <Typography variant="h5" sx={{fontWeight: '600', fontSize: '1.25rem', color:'#4b62a2'}}>{getCurrentPage()}</Typography>
                <Breadcrumbs></Breadcrumbs>
            </div>

            <HorizontalLinearStepper></HorizontalLinearStepper>
        </div>
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