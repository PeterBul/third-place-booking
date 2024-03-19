import { ThemeConfig, extendTheme } from '@chakra-ui/react';
import styles from './styles';
import { Heading } from './heading';
import { cardTheme } from './card';
import { textTheme } from './text';
import { alertTheme } from './alert.theme';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles,
  components: { Heading, Card: cardTheme, Text: textTheme, Alert: alertTheme },
});

export default theme;
