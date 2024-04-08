import { Center, Tag } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';
import { TValue } from './types';

export function TagCell<T>(props: CellContext<T, TValue>) {
  const value = props.getValue();
  const meta = props.column.columnDef.meta?.tagCell;

  if (!meta) {
    throw new Error('No meta provided for TagCell');
  }

  return (
    <Center w={'100%'} h={'100%'}>
      <Tag {...meta.getProps(+props.row.id)}>{value}</Tag>
    </Center>
  );
}
