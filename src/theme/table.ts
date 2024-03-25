import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  table: {
    borderCollapse: 'collapse',
  },
  th: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'gray.400',
    padding: '0.5rem',
    fontWeight: 'bold',
    fontSize: 'xs',
    textTransform: 'uppercase',
    textAlign: 'center',
    boxShadow: 'inset 0 0 0 1px #424242',
    borderWidth: '0px !important',
  },
  td: {
    display: 'flex',
    alignItems: 'center',
    boxShadow: 'inset 0 0 0 1px #424242',
    borderWidth: '0px !important',
    padding: '0px !important',
  },
  tr: {
    display: 'flex',
    width: 'fit-content',
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
