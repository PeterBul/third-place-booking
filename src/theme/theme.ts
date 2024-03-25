import { ThemeConfig, extendTheme } from '@chakra-ui/react';
import styles from './styles';
import { Heading } from './heading';
import { cardTheme } from './card';
import { textTheme } from './text';
import { alertTheme } from './alert.theme';
import { tableTheme } from './table';
import { buttonTheme } from './button.theme';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles,
  components: {
    Alert: alertTheme,
    Button: buttonTheme,
    Card: cardTheme,
    Heading,
    Table: tableTheme,
    Text: textTheme,
  },
});

export default theme;
