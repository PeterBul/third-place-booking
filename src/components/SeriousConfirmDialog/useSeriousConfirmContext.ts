import { useContext } from 'react';
import { SeriousConfirmContext } from './SeriousConfirmDialog';

export const useSeriousConfirmContext = () => {
  const alertContext = useContext(SeriousConfirmContext);
  if (!alertContext) {
    throw new Error(
      'useSeriousConfirmContext must be used within a SeriousAlertDialog'
    );
  }
  return alertContext;
};
