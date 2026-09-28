import {useMemo} from 'react';
import {getExpense} from '../../../composition';

const useExpense = (id?: string) => useMemo(() => getExpense(id), [id]);

export default useExpense;
