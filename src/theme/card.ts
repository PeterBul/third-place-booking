import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    // backgroundColor: '#e7e7e7',
  },
  header: {
    // paddingBottom: '2px',
  },
  body: {
    padding: '14px',
  },
  footer: {
    // paddingTop: '2px',
  },
});

const variants = {
  selected: definePartsStyle({
    container: {
      outline: '2px solid var(--chakra-colors-blue-300)',
    },
  }),
  warning: definePartsStyle({
    container: {
      outline: '2px solid var(--chakra-colors-yellow-500)',
    },
  }),
};

const sizes = {};

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes, variants });
