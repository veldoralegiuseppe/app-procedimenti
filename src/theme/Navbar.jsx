import { styled, keyframes } from '@mui/system';

export const StyledLi = styled('li')({
  listStyle: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  gap: '8px',
  '&:hover .link-text::after': {
    width: '100%', // La linea appare quando si passa con il mouse sull'`<li>`
  },
  '&:hover': {
    cursor: 'pointer',
  },
});

export const StyledLink = styled('a')({
  display: 'inline-block',
  color: '#0D47A1',
  textDecoration: 'none',
  flex: '1',
});

export const LinkText = styled('span')({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '-2px', // Posiziona la linea leggermente più in basso
    height: '1px',
    backgroundColor: '#0D47A1',
    width: '0%',
    transition: 'width 0.2s ease-in-out',
    margin: '0 auto', // Centra la linea rispetto al testo
  },
});

export const dropdownFadeIn = keyframes`
from {
  opacity: 0;
  transform: translateY(-10%);
}
to {
  opacity: 1;
  transform: translateY(0);
}
`;
