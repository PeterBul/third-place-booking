import {
  Box,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Show,
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';
import { e_CellType } from '../../enums';
import type * as ReactTable from '@tanstack/react-table';
import { MdArrowUpward, MdArrowDownward, MdSwapVert } from 'react-icons/md';

interface IProps<TData> {
  filters: JSX.Element;
  table: ReactTable.Table<TData>;
}

export const Table = <TData extends object>({
  table,
  filters,
}: IProps<TData>) => {
  return (
    <>
      {filters}
      <Show breakpoint="(min-width: 769px)">
        <Box overflowX={'auto'}>
          <ChakraTable w={table.getTotalSize()}>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      w={`${header.getSize()}px`}
                      key={header.id}
                      border={
                        header.column.columnDef.meta?.isInline
                          ? 'none'
                          : undefined
                      }
                      boxShadow={
                        header.column.columnDef.meta?.isInline
                          ? 'none'
                          : undefined
                      }
                    >
                      {!header.column.columnDef.meta?.isInline && (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                        </>
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      w={`${cell.column.getSize()}px`}
                      key={cell.id}
                      border={
                        cell.column.columnDef.meta?.isInline
                          ? 'none'
                          : undefined
                      }
                      boxShadow={
                        cell.column.columnDef.meta?.isInline
                          ? 'none'
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </ChakraTable>
        </Box>
      </Show>

      <Show below="md">
        <VStack>
          {table.getRowModel().rows.map((row) => (
            <Card key={row.id} w={'100%'}>
              <CardBody>
                {row.getVisibleCells().map((cell) => {
                  if (
                    cell.column.columnDef.meta?.type === e_CellType.iconButton
                  ) {
                    const meta = cell.column.columnDef.meta.iconButtonCell;
                    if (!meta) {
                      throw new Error('No meta provided for IconButtonCell');
                    }
                    return (
                      <IconButton
                        size={'md'}
                        w={'100%'}
                        {...meta}
                        onClick={() =>
                          meta.onClick(+row.id, cell.getContext().getValue())
                        }
                        // onClick={meta.onClick.bind(null, +context.row.id, context.getValue())}
                      />
                    );
                  }
                  return (
                    <FormControl
                      display={'flex'}
                      my={2}
                      key={cell.id}
                      alignItems={'center'}
                      flexWrap={'wrap'}
                    >
                      <FormLabel htmlFor={cell.id} minW={'150px'}>
                        {cell.column.columnDef.header?.toString()}
                      </FormLabel>
                      <Box key={cell.id} id={cell.id} flex={1}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Box>
                    </FormControl>
                  );
                })}
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Show>
    </>
  );
};

const getSortIcon = (dir: ReactTable.SortDirection | false) => {
  if (dir === 'asc') {
    return MdArrowUpward;
  }
  if (dir === 'desc') {
    return MdArrowDownward;
  }
  return MdSwapVert;
};
