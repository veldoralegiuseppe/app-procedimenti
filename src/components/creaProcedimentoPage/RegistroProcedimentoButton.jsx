import * as React from 'react';
import { CssTextField} from './DefinisciProcedimentoTheming.jsx';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';

var firstClick = false

function handleClick(ref) {
    firstClick = true
   for(let i=0; i<ref.current.childNodes.length; i++){
        ref.current.childNodes[i].className += ' Mui-focused'
        //console.log(ref.current.childNodes[i].className)
   }
}

function handleOutsideClick(ref, inputRef) {
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
                if(inputRef && firstClick && !inputRef.current.value){
                    //console.log(inputRef.current)
                    inputRef.current.value = new Date().getFullYear()
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

export default function RegistroProcedimentoButton(){
    const theme = useTheme()
    const inputWidth = '20%'
    const minWidth = '133.5px'
    const maxWidth = '200px'
    const margin = '18px 20px 10px 10px'
    const backgroundColor = theme.palette.background.default
    const formLabelFontSize = '1rem'
    const labelColor = 'rgb(105 105 105 / 60%)'
    const textFieldRef = React.useRef(null);
    const annoRef = React.useRef(null);

    handleOutsideClick(textFieldRef, annoRef)

    return(
        <CssTextField 
            onClick={() => handleClick(textFieldRef)}
            ref={textFieldRef}
            sx={{margin: margin, backgroundColor: backgroundColor, width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, '& .MuiInputBase-root':{position: 'relative'}, '& .MuiFormLabel-root':{color: labelColor},  '& .MuiOutlinedInput-input':{fontWeight: '500'}}} 
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start" sx={{alignItems: 'center', justifyContent: 'center', position: 'absolute', left:'0', flex:'1', marginRight: '0'}}>
                        <div style={{display: 'flex', flexDirection: 'row', flex: `1`, minWidth: minWidth, height: '34.13px'}}>
                            <input type="text" style={{width: '65%', border: 'none', paddingRight: '2.5px', textAlign: 'right', outline: 'none'}} />
                            <div style={{textAlign:'center', margin: 'auto', fontSize: '1.4rem', color: '#cdcdcd'}}>/</div>
                            <input ref={annoRef} defaultValue="" type="text" style={{width: '35%', border: 'none', paddingLeft: '2.5px', outline: 'none'}}/>
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