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
      // _after: {
      //   content: '"✓"',
      //   position: 'absolute',
      //   top: '-20px',
      //   right: '20px',
      //   borderRadius: '50%',
      //   border: '2px solid var(--chakra-colors-blue-300)',
      //   height: '40px',
      //   width: '40px',
      //   backgroundColor: 'var(--chakra-colors-blue-300)',
      // },
    },
  }),
};

const sizes = {};

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes, variants });
