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
    deleteGhost: {
      color: 'red.500',
      fontWeight: 'bold',
      _hover: {
        bg: 'red.500',
        color: 'white',
      },
    },
    deleteOutline: {
      border: '1px solid',
      borderColor: 'red.500',
      color: 'red.500',
      _hover: {
        bg: 'red.500',
        color: 'white',
      },
    },
  },
});
