import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import {
  SortDirection,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TValue } from './Table/types';
import { useMemo, useState } from 'react';
import { Filters } from './Table/Filters';
import { MdArrowDownward, MdArrowUpward, MdSwapVert } from 'react-icons/md';
import { EditableCell } from './Table/EditableCell';
import { createItem, editItem, getItems } from '../api/items';
import { getImages } from '../api/images';
import { SelectCell } from './Table/SelectCell';
import { DeleteCell } from './Table/DeleteCell';
import { NewItemButton } from './NewItemButton';
import { useNewItem } from '../hooks/useNewItem';

export const newId = 1000000000;

const ItemsAdmin = () => {
  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: getItems,
  });

  const images = useQuery({
    queryKey: ['images'],
    queryFn: getImages,
  });

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: EditableCell,
      meta: {
        allowNull: false,
      },
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: EditableCell,
    },
    {
      header: 'Image',
      accessorKey: 'imageId',
      cell: SelectCell,
      meta: {
        options: images.data?.map((image) => ({
          id: image.id,
          displayValue: image.alt,
        })),
      },
    },
    {
      header: 'Delete',
      accessorKey: 'id',
      enableSorting: false,
      enableColumnFilter: false,
      enableResizing: false,

      cell: DeleteCell,
      size: 1,
    },
  ];

  const queryClient = useQueryClient();

  const [globalFilter, setGlobalFilter] = useState('');

  const itemMutation = useMutation({
    mutationFn: editItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const handleSave = (newItem: {
    id: number;
    title: string;
    description: string;
    imageId: number | undefined;
  }) => {
    if (newItem.imageId !== undefined) {
      newItem.imageId = +newItem.imageId;
    }
    createItemMutation.mutate(newItem);
  };

  const {
    newItem,
    startAddingItem,
    cancelAddingItem,
    saveNewItem,
    updateNewItem,
    addItemToData,
  } = useNewItem(
    {
      id: newId,
      title: '',
      description: '',
      imageId: undefined as number | undefined,
    },
    handleSave
  );

  const data = useMemo(() => {
    return addItemToData(
      items
        ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        .map((item) => {
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            imageId: item.image?.id,
          };
        }) ?? []
    );
  }, [addItemToData, items]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    getRowId: (row) => row.id.toString(),
    meta: {
      updateData: (
        rowId: string,
        columnId: string,
        value: TValue | boolean
      ) => {
        if (rowId === newId.toString()) {
          updateNewItem(columnId, value);
          return;
        }

        const convertedValue =
          columnId === 'imageId' && value !== undefined ? +value : value;
        const item = items?.find((booking) => booking.id === +rowId);
        if (!item) return;
        itemMutation.mutate({
          id: item.id,
          [columnId]: convertedValue,
        });
      },
    },
  });

  return (
    <Box>
      <Filters globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <Table w={table.getTotalSize()}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  w={header.getSize()}
                  key={header.id}
                  border={
                    header.column.columnDef.header === 'Delete'
                      ? 'none'
                      : undefined
                  }
                  boxShadow={
                    header.column.columnDef.header === 'Delete'
                      ? 'none'
                      : undefined
                  }
                >
                  {header.column.columnDef.header !== 'Delete' && (
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
                  w={cell.column.getSize()}
                  key={cell.id}
                  border={
                    cell.column.columnDef.header === 'Delete'
                      ? 'none'
                      : undefined
                  }
                  boxShadow={
                    cell.column.columnDef.header === 'Delete'
                      ? 'none'
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <NewItemButton
        newItem={newItem}
        onCancelAddingItem={cancelAddingItem}
        onSave={saveNewItem}
        onStartAddingItem={startAddingItem}
      />
    </Box>
  );
};

export default ItemsAdmin;

const getSortIcon = (dir: SortDirection | false) => {
  if (dir === 'asc') {
    return MdArrowUpward;
  }
  if (dir === 'desc') {
    return MdArrowDownward;
  }
  return MdSwapVert;
};
