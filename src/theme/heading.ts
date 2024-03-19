import { defineStyleConfig } from '@chakra-ui/react';

export const Heading = defineStyleConfig({
  baseStyle: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 'bold',
  },
  sizes: {
    xl: {
      fontSize: '4xl',
      lineHeight: 'none',
    },
    lg: {
      fontSize: '2xl',
      lineHeight: 'none',
    },
    md: {
      fontSize: 'xl',
      lineHeight: 'none',
    },
    sm: {
      fontSize: 'md',
      lineHeight: 'none',
    },
    xs: {
      fontSize: 'sm',
      lineHeight: 'none',
    },
  },
  defaultProps: {
    size: 'xl',
  },
});
