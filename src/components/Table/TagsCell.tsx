import { Flex, Tag } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';
import { TValue } from './types';

export function TagsCell<T>(props: CellContext<T, TValue>) {
  const value = props.getValue();
  const meta = props.column.columnDef.meta?.tagsCell;

  if (!meta) {
    throw new Error('No meta provided for TagsCell');
  }
  if (!Array.isArray(value)) {
    throw new Error('TagsCell value must be an array');
  }
  console.log(value);

  return (
    <Flex px={2} gap={2}>
      {value.map((v) => {
        return <Tag {...meta.getProps(+props.row.id)}>{v}</Tag>;
      })}
    </Flex>
  );
}
