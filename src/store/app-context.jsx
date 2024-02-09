import { createContext } from "react";

export const routes = [
    {
        path: '/dashboard', 
        component: 'dashboard', 
    },
    {
        path: '/provvedimenti', 
        component: 'Provvedimenti', 
        children: [
            {
                path: '/crea',
                component: 'Crea provvedimento'
            },
            {
                path: '/cerca',
                component: 'Ricerca provvedimento'
            },
        ]
    },
    {
        path: '/parti', 
        component: 'Parti e controparti', 
        children: [
            {
                path: '/crea',
                component: 'Crea parte'
            },
            {
                path: '/cerca',
                component: 'Ricerca parte'
            },
        ]
    },
]

export const AppContext = createContext({
    currentPath: '/dashboard',
})