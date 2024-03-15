import * as React from 'react';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

/**
 * 
 * @param {*} props {importo, label, sx} 
 * @returns 
 */
export default function ImportoField(props){
   const importoFieldRef = React.useRef(null);
   var importoError = false
   const labelColor = 'rgb(105 105 105 / 60%)'
   var [reset, setReset] = React.useState(false)
   var [cursorShift, setCursorShift] = React.useState(0)
   var [importoAttuale, setImportoAttuale] = React.useState(props.importo ? props.importo : '0,00')
   const theme = useTheme()

    function resetImporto(){
        let input = importoFieldRef.current.childNodes[1].childNodes[1]
        input.value = '0,00'
    }
    
    return (
        <CssTextField 
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <EuroSymbolIcon sx={{color: importoError ? theme.palette.error.main : '#69696961'}}/>
                </InputAdornment>
            ),
            maxLength: 30
        }}
        error={importoError}
        helperText=""
        defaultValue={reset ? resetImporto() : importoAttuale}
        onChange={event => {
            let input = importoFieldRef.current.childNodes[1].childNodes[1]
            let importoCorrente = input.value.replaceAll('.','')
            const activateLog = true
            if(activateLog) console.log('onChange!')
            var exit = false

            importoCorrente.split(',').forEach(s => {
                console.log(`Token: ${s}, isNumber: ${!/[^\d+]/g.test(s)}`)
                if(/[^\d+]/g.test(s)) {
                    let currentPosition = input.selectionStart
                    console.log(`Input ${s} non valido, riporto al valore precedente di €${importoAttuale} currentPosition:${currentPosition}`)
                    input.value = importoAttuale
                    importoCorrente = importoAttuale.replaceAll('.','')
                    input.setSelectionRange(currentPosition-1, currentPosition-1)
                    exit = true
                }
            })
            if(exit) return
            var isOnlyCent = /^,{1}\d+/g
            var inputValido = /(?<![\D*\w*])(\d+,{1}\d{2})(?![\D*\d*,*])/g

            if(isOnlyCent.test(importoCorrente) || importoCorrente == '') {
                input.value = ''
            }
            else if(!importoCorrente.includes(',')){
                // Inserimento di numeri interi
                if(importoCorrente.length < 3) {
                    if(activateLog) console.log('Gestisco numeri interi')
                    input.value = importoCorrente += ',00'
                    input.setSelectionRange(1, 1)
                } else {
                    // Canc della virgola
                    if(activateLog) console.log('Gestisco la virgola cancellata')
                    let currentPosition = input.selectionStart
                    input.value = importoCorrente.slice(0, importoCorrente.length-2) + ',' + importoCorrente.slice(importoCorrente.length-2)
                    input.setSelectionRange(currentPosition, currentPosition)
                }
                
            }
            else if(importoCorrente.charAt(0) == '0' && /\d/g.test(importoCorrente.charAt(1))){
                // Gestisco i numeri del tipo 023,00
                if(activateLog) console.log('Gestisco i valori all inizio')
                let currentPosition = input.selectionStart
                input.value = importoCorrente.slice(1)
                input.setSelectionRange(currentPosition-1, currentPosition-1)
            }
            else if(input.selectionStart == 1 && importoAttuale == '0,00'){
                if(activateLog) console.log('Gestisco primo input')
                let importo = importoCorrente.charAt(0) + importoCorrente.slice(2)
                input.value = importo
                let currentPosition = input.selectionStart
                if(activateLog) console.log(`importoCorrente: ${importoCorrente}, importo: ${importo}, currentPosition: ${currentPosition}`)
                input.setSelectionRange(currentPosition-3,currentPosition-3)
            }
            else if(input.selectionStart == input.value.length - 3 && importoCorrente.includes(",,")){
                // Gestisco l'aggiunta della virgola
                if(activateLog) console.log('Gestisco aggiunta virgola')
                if(importoCorrente.includes(",,") && !inputValido.test(importoCorrente.replace(',,',','))) return 
                else {
                    let currentPosition = input.selectionStart
                    input.value = importoCorrente.replace(",,",",")
                    input.setSelectionRange(currentPosition, currentPosition)
                }                       
            }
            else if(input.selectionStart == input.value.length - 2 ){
                // Aggiunta di un decimale 
                if(activateLog) console.log('Aggiungo un decimale')
                let importo = importoCorrente.slice(0,importoCorrente.length - 2) + importoCorrente.slice(importoCorrente.length-1)
                if(!inputValido.test(importo)) {
                    if(activateLog) console.log('Input invalido nell aggiungere decimali')
                    let currentPosition = input.selectionStart
                    input.value = importoAttuale
                    input.setSelectionRange(currentPosition-1, currentPosition-1)
                    return
                }
                let currentPosition = input.selectionStart
                let formattedImporto = Number(importo.replaceAll(',','.')).toLocaleString('it-IT',{
                    style: 'decimal', 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
                input.value = formattedImporto
                let numPunti = (formattedImporto.match(/\./g) || []).length
                if(activateLog) console.log(`Aggiungo decimo - importo:${importo}, formattedImporto: ${formattedImporto}, numPunti: ${numPunti}, currentPosition: ${currentPosition}, cursorShift:${cursorShift}`)
                if(numPunti == cursorShift) 
                    input.setSelectionRange(currentPosition, currentPosition)
                else
                    input.setSelectionRange(currentPosition+1, currentPosition+1)
            }
            else if(input.selectionStart == input.value.length - 1 ){
                if(importoCorrente.charAt(importoCorrente.length-2) == ',') {
                    // Canc dei decimi
                    if(activateLog) console.log('Gestisco il canc dei decimi')
                    let importo = importoCorrente.slice(0, importoCorrente.length-1) + '0' + importoCorrente.slice(importoCorrente.length-1)
                    if(!inputValido.test(importo)) {
                        if(activateLog) console.log('Input invalido nel canc decimi')
                        let currentPosition = input.selectionStart
                        input.value = importoAttuale
                        input.setSelectionRange(currentPosition-1, currentPosition-1)
                        return
                    }
                    let currentPosition = input.selectionStart
                    input.value = importoCorrente.slice(0, importoCorrente.length-1) + '0' + importoCorrente.slice(importoCorrente.length-1)
                    input.setSelectionRange(currentPosition, currentPosition)
                } else {
                    // Aggiunta di un centesimo
                    if(activateLog) console.log('Aggiungo un centesimo')
                    let importo = importoCorrente.slice(0,importoCorrente.length - 1)
                    if(!inputValido.test(importo)) {
                        let currentPosition = input.selectionStart
                        input.value = importoAttuale
                        input.setSelectionRange(currentPosition, currentPosition)
                        return
                    }
                    let currentPosition = input.selectionStart
                    let formattedImporto = Number(importo.replaceAll(',','.')).toLocaleString('it-IT',{
                        style: 'decimal', 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                    input.value = formattedImporto
                    input.setSelectionRange(currentPosition, currentPosition)
                }
            }
            else if(input.selectionStart == input.value.length){
                // Canc dei centesimi
                if(importoCorrente.charAt(importoCorrente.length-2) == ',') {
                    if(activateLog) console.log('Gestisco il canc dei centesimi')
                    let currentPosition = input.selectionStart
                    input.value += '0'
                    input.setSelectionRange(currentPosition, currentPosition)
                } else {
                    let currentPosition = input.selectionStart
                    input.value = importoAttuale
                    input.setSelectionRange(currentPosition, currentPosition)
                }
            }
            else if(!inputValido.test(importoCorrente)){
                if(activateLog) console.log(`Gestisco input non valido => importoCorrente: ${importoCorrente}, importoAttuale: ${importoAttuale}`)
                let currentPosition = input.selectionStart
                input.value = importoAttuale
                input.setSelectionRange(currentPosition-1, currentPosition-1)
                //input.setSelectionRange(dimParteIntera, dimParteIntera)
            } 
                
        
            // Aggiungo i punti
            if(activateLog) console.log(`input.value:${input.value}`)
            let importoView = input.value ? input.value.replaceAll('.','') : '0.00'
            let importoNumber = Number(importoView.replace(',','.'))
            if(activateLog) console.log(`importoView:${importoView}\nimportoNumber: ${importoNumber}`)
            const formattedNumber = importoNumber.toLocaleString('it-IT',{
                style: 'decimal', 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            let currentPosition = input.selectionStart
            setImportoAttuale(formattedNumber)
            input.value = formattedNumber
           
            let numPunti = (formattedNumber.match(/\./g) || []).length
            if(activateLog) console.log(`prevPosition: ${currentPosition}, numPunti: ${numPunti}`)

            if(numPunti == cursorShift) 
                input.setSelectionRange(Number(currentPosition), Number(currentPosition))
            else{
                if(numPunti > cursorShift)
                    input.setSelectionRange(Number(currentPosition+1), Number(currentPosition+1))
                else 
                    input.setSelectionRange(Number(currentPosition-1), Number(currentPosition-1))   
                setCursorShift(numPunti)
            }
            
        }}
        sx={{...props.sx, '& .MuiFormLabel-root:not(.Mui-error, .Mui-selected, .Mui-focused)':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary,},}} 
        id="outlined-basic" 
        label={props.label}
        ref={importoFieldRef}
        variant="outlined" 
        size='small'
        required={props.required}/>

    )
}


const CssTextField = styled(TextField)(({ theme }) => ({

    //  '& .MuiInputLabel-root[data-shrink="true"]':{
    //     color: theme.palette.logo.secondary,
  
    //     '& ~ .MuiInputBase-root fieldset':{ borderColor: theme.palette.logo.secondary,}
    //   },
      '& .MuiInputLabel-root.Mui-focused, & .MuiFormLabel-root.Mui-focused':{ color: theme.palette.logo.secondary,},
      '& .MuiOutlinedInput-root': {
          'input':{textTransform: 'uppercase'},
          '&:hover fieldset': {
              borderColor: theme.palette.logo.secondary,
          },
          '&.Mui-focused fieldset': {
              border: `1.2px solid ${theme.palette.logo.secondary}`,
          },
          '&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root': {
              fill: `${theme.palette.logo.secondary} !important`,
          },
      },
}));
