import { Text } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';
import { TValue } from './types';

export function StaticCell<T>({ getValue, column }: CellContext<T, TValue>) {
  const value = getValue();

  return (
    <Text
      variant="filled"
      size="sm"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      p={2}
      {...column.columnDef.meta?.props}
    >
      {value}
    </Text>
  );
}
