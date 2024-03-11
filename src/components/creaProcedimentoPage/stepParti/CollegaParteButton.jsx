import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';

export default function CollegaParteButton(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme()
    const buttonColor = '#82b9ec'
    const buttonHoverColor = '#4a769b'
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '85%',
        height: '90%',
        bgcolor: 'background.default',
        border: 'unset',
        boxShadow: 24,
        p: 4,
      };
      
    return (
        <div style={{display: 'inline-block', ...props.sx}}>
            <Button 
                onClick={handleOpen}
                variant='text'
                sx={{color: buttonColor, '&:hover, &:hover svg':{backgroundColor: 'unset', color: buttonHoverColor}}}
                startIcon={<LinkIcon sx={{color: buttonColor, transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}}/>}
            >
                Allega una parte
            </Button>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                    Ricerca una parte
                </Typography>
                <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                   Corpo della ricerca
                </Typography>
                </Box>
            </Modal>
        </div>
    )
}