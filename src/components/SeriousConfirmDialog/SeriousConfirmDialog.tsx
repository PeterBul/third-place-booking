import { AlertDialog, AlertDialogProps } from '@chakra-ui/react';
import { createContext, useState } from 'react';
interface IProps extends AlertDialogProps {
  confirmString: string;
}

interface IAlertContext {
  confirmString: string;
  inputString: string;
  setInputString: (inputString: string) => void;
}

export const SeriousConfirmContext = createContext<IAlertContext | undefined>(
  undefined
);

export const SeriousConfirmDialog = ({
  confirmString,
  children,
  ...props
}: IProps) => {
  const [inputString, setInputString] = useState('');
  return (
    <SeriousConfirmContext.Provider
      value={{ confirmString, inputString, setInputString }}
    >
      <AlertDialog {...props}>{children}</AlertDialog>
    </SeriousConfirmContext.Provider>
  );
};
