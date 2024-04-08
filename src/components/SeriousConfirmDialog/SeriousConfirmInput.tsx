import { Input, InputProps } from '@chakra-ui/react';
import { useSeriousConfirmContext } from './useSeriousConfirmContext';

export const SeriousConfirmInput = ({ onChange, ...props }: InputProps) => {
  const confirmContext = useSeriousConfirmContext();
  return (
    <Input
      onChange={(e) => {
        confirmContext.setInputString(e.target.value);
        onChange && onChange(e);
      }}
      {...props}
    />
  );
};
