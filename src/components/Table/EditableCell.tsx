import {
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  Input,
} from '@chakra-ui/react';
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
    >
      <Editable defaultValue={value as string}>
        <EditablePreview />

        <Input
          as={EditableInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          variant="filled"
          size="sm"
          w="85%"
          onBlur={onBlur}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        />
      </Editable>
    </FormControl>
  );
}
