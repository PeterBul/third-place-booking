import { Select } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { TValue } from './types';

export function SelectCell<T>({
  getValue,
  row,
  column,
  table,
}: CellContext<T, TValue>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onChange = (value: string) => {
    table.options.meta?.updateData(row.id, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Select
      value={value}
      variant={'flushedP2'}
      onChange={(e) => {
        onChange(e.target.value);
        return setValue(e.target.value);
      }}
      border={0}
      placeholder="Select an option"
    >
      {column.columnDef.meta?.options?.map((option) => {
        return (
          <option key={option.id} value={option.id}>
            {option.displayValue}
          </option>
        );
      })}
    </Select>
  );
}
