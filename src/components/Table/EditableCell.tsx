import { FormControl, Input } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { TValue } from './types';

export function EditableCell<T>({
  getValue,
  row,
  column,
  table,
}: CellContext<T, TValue>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue ?? '');

  const onBlur = () => {
    table.options.meta?.updateData(row.id, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FormControl
      isInvalid={column.columnDef.meta?.allowNull === false && !value}
      height={'100%'}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="sm"
        onBlur={onBlur}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        height={'100%'}
        p={2}
      />
    </FormControl>
  );
}
