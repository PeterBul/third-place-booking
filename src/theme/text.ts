import { defineStyleConfig } from '@chakra-ui/react';

export const textTheme = defineStyleConfig({
  baseStyle: {
    fontFamily: 'PT sans, sans-serif',
  },
  variants: {
    fun: {
      fontFamily: 'Lacquer, cursive',
    },
  },
});
