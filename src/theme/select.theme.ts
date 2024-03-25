import { selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

const variants = {
  flushedP2: definePartsStyle({
    field: {
      p: 2,
      backgroundColor: 'transparent',
    },
  }),
};

export const selectTheme = defineMultiStyleConfig({ variants });
