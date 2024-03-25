import { defineStyleConfig } from '@chakra-ui/react';

export const buttonTheme = defineStyleConfig({
  variants: {
    delete: {
      bg: 'red.500',
      color: 'white',
      _hover: {
        bg: 'red.600',
      },
    },
  },
});
