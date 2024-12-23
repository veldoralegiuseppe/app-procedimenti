import { useContext } from 'react';
import { RouteContext, getRoute} from '@ui-shared/context';

const useRouteContext = () => {
    const context = useContext(RouteContext);
    if (!context) {
        throw new Error('useRouteContext must be used within a RouteProvider');
    }
    
    return {...context}
}

export default useRouteContext;