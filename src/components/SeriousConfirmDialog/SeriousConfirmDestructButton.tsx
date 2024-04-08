import { Button, ButtonProps } from '@chakra-ui/react';
import { useSeriousConfirmContext } from './useSeriousConfirmContext';

export const SeriousConfirmDestructButton = ({
  children,
  ...props
}: ButtonProps) => {
  const confirmContext = useSeriousConfirmContext();
  return (
    <Button
      isDisabled={confirmContext.confirmString !== confirmContext.inputString}
      {...props}
    >
      {children}
    </Button>
  );
};
