import * as React from 'react';
import { CssTextField} from './StepProcedimentoTheming.jsx';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';

function isNumber(str){
    let reg = /^[0-9]+$/g
    let validInput = str.trim()
    return reg.test(validInput) ? validInput : undefined
}

function getAnnoValidate(annoRef){
    if(!annoRef) return undefined
    else {
        let str = annoRef.current.value
        if(!isNumber(str.substr(str.length - 1))) annoRef.current.value = str.substr(0, str.length - 1)
        return annoRef.current.value == '' ? undefined : annoRef.current.value
    }
}

 /**
 * Riempie il numero di protocollo con gli 0 messi all'inizio
 * @param {string} numProtocollo 
 * @returns Numero di protocollo
 */
 function fill(numProtocollo){
    let dim = 6 - numProtocollo.length
    if(dim == 0) return numProtocollo
    return '0'.repeat(dim) + numProtocollo
}

function getNumProtocolloValidate(numProtocolloRef){

    if(!numProtocolloRef) return undefined
    else {
        let str = numProtocolloRef.current.value
        if(!isNumber(str.substr(str.length - 1))) numProtocolloRef.current.value = str.substr(0, str.length - 1)
        return numProtocolloRef.current.value == '' ? undefined : fill(numProtocolloRef.current.value)
    }
}

export default function RegistroProcedimentoButton({onChange, numProtocollo, anno, reset, maxWidth, minWidth, error, helperText}){
    const theme = useTheme()
    const inputWidth = '20%'
    const margin = '18px 20px 10px 10px'
    const backgroundColor = theme.palette.background.default
    const formLabelFontSize = '1rem'
    const labelColor = 'rgb(105 105 105 / 60%)'
    const textFieldRef = React.useRef(null);
    const annoRef = React.useRef(null);
    const numProtocolloRef = React.useRef(null);

    function handleClick(ref) {
       
       for(let i=0; i<ref.current.childNodes.length; i++){
            ref.current.childNodes[i].className += ' Mui-focused'
            //console.log(ref.current.childNodes[i].className)
       }
    }
    
    function handleOutsideClick(ref, annoRef, numProtocolloRef) {
        React.useEffect(() => {

            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    for(let i=0; i<ref.current.childNodes.length; i++){
                        ref.current.childNodes[i].className = ref.current.childNodes[i].className.replaceAll(' Mui-focused','')
                        //console.log(ref.current.childNodes[i].className)
                    }
                    // if(annoRef && firstClick && !annoRef.current.value){
                    //     //console.log(inputRef.current)
                    //     annoRef.current.value = new Date().getFullYear()
                    //     onChange( getAnnoValidate(annoRef) )
                    // } 
                    if(numProtocolloRef && numProtocolloRef.current.value){
                        //console.log(inputRef.current)
                        numProtocolloRef.current.value = fill(numProtocolloRef.current.value)
                    } 
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    function handleReset(){
        //console.log(`Handle reset: ${reset}`)
        if(!reset) return
        numProtocollo = undefined
        anno = new Date().getFullYear()
        numProtocolloRef.current.value = ''
        annoRef.current.value = anno
    }

    handleOutsideClick(textFieldRef, annoRef, numProtocolloRef)
    handleReset()

    React.useEffect(()=>{
        console.log('Registro render!')
    },[])
    return(
        <CssTextField 
            error={error}
            helperText={helperText}
            onClick={() => handleClick(textFieldRef)}
            ref={textFieldRef}
            defaultValue={reset ? handleReset() : ""}
            sx={{margin: margin, backgroundColor: backgroundColor, width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, '& .MuiInputBase-root':{position: 'relative'}, '& .MuiFormLabel-root':{color: labelColor},  '& .MuiOutlinedInput-input':{fontWeight: '500'}}} 
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start" sx={{alignItems: 'center', justifyContent: 'center', position: 'absolute', left:'0', flex:'1', marginRight: '0', fontFamily: 'Roboto', fontWeight: '500'}}>
                        <div style={{display: 'flex', flexDirection: 'row', flex: `1`, minWidth: minWidth, height: '34.13px', color: theme.palette.text.primary}}>
                            <input onChange={() => onChange(getNumProtocolloValidate(numProtocolloRef), annoRef.current.value )} ref={numProtocolloRef} maxLength="6" defaultValue={numProtocollo ? numProtocollo : ''} type="text" style={{width: '60%', minWidth: '55px',  border: 'none', paddingRight: '2.5px', textAlign: 'right', outline: 'none', fontFamily: 'Roboto', fontWeight: '500', fontSize: '1rem'}} />
                            <div style={{display:'flex', justifyContent: 'center', alignItems:'center', padding: '0 2px', fontSize: '1.4rem', color: '#cdcdcd'}}>/</div>
                            <input onChange={() => onChange(numProtocolloRef.current.value, getAnnoValidate(annoRef) )} ref={annoRef} defaultValue={anno ? anno : new Date().getFullYear()} type="text" maxLength="4" style={{width: '23%', maxWidth: '65px', border: 'none', paddingLeft: '2.5px', outline: 'none', fontFamily: 'Roboto', fontWeight: '500', fontSize: '1rem'}}/>
                        </div>
                    </InputAdornment>
                ),
            }}
            id="outlined-basic"
            label="Numero" 
            variant="outlined" 
            size='small' 
            required />
    )
}