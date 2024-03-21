import { Box, Icon } from '@chakra-ui/react';
import {
  RowData,
  SortDirection,
  type Table,
  flexRender,
} from '@tanstack/react-table';

import { MdArrowDownward, MdArrowUpward, MdSwapVert } from 'react-icons/md';

interface IProps<TData extends RowData> {
  table: Table<TData>;
}
const Table = <TData extends RowData>(props: IProps<TData>) => {
  const table = props.table;

  return (
    <Box className="table" w={table.getTotalSize()}>
      {table.getHeaderGroups().map((headerGroup) => (
        <Box className="tr" key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <Box className="th" w={header.getSize()} key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.getCanSort() && (
                <Icon
                  as={getSortIcon(header.column.getIsSorted())}
                  mx={3}
                  fontSize={14}
                  onClick={header.column.getToggleSortingHandler()}
                />
              )}
              <Box
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className={`resizer ${
                  header.column.getIsResizing() ? 'isResizing' : ''
                }`}
              ></Box>
            </Box>
          ))}
        </Box>
      ))}
      {table.getRowModel().rows.map((row) => (
        <Box className="tr" key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Box className="td" w={cell.column.getSize()} key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default Table;

const getSortIcon = (dir: SortDirection | false) => {
  if (dir === 'asc') {
    return MdArrowUpward;
  }
  if (dir === 'desc') {
    return MdArrowDownward;
  }
  return MdSwapVert;
};
