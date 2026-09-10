import {useMemo} from 'react';
import {userRepository} from '../data/userRepository';

// Snapshot of the session user for the current Home visit.
const useCurrentUser = () => useMemo(() => userRepository.getCurrent(), []);

export default useCurrentUser;
