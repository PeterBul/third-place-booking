import { CellContext } from '@tanstack/react-table';
import { TValue } from './types';
import { Center, IconButton } from '@chakra-ui/react';

export function IconButtonCell<T>(context: CellContext<T, TValue>) {
  const meta = context.column.columnDef.meta?.iconButtonCell;
  if (!meta) {
    throw new Error('No meta provided for IconButtonCell');
  }

  const { getBtnRef, onClick, ...rest } = meta;
  return (
    <Center flex={1}>
      <IconButton
        ref={getBtnRef ? getBtnRef(+context.row.id) : null}
        variant="inline"
        {...rest}
        onClick={() => onClick(+context.row.id, context.getValue())}
      />
    </Center>
  );
}
