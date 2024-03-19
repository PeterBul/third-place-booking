import { Text } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';
import { IUser } from '../../api/users';
import { TValue } from './types';

export const StaticCell = ({ getValue }: CellContext<IUser, TValue>) => {
  const value = getValue();

  return (
    <Text
      variant="filled"
      size="sm"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
      {value}
    </Text>
  );
};
