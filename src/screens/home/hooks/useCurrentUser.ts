import {useMemo} from 'react';
import {getCurrentUser} from '../../../composition';

const useCurrentUser = () => useMemo(() => getCurrentUser(), []);

export default useCurrentUser;
