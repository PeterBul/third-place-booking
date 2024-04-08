import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TValue } from './Table/types';
import { useMemo, useState } from 'react';
import { Filters } from './Table/Filters';
import { EditableCell } from './Table/EditableCell';
import { createItem, deleteItem, editItem, getItems } from '../api/items';
import { getImages } from '../api/images';
import { SelectCell } from './Table/SelectCell';
import { NewItemButton } from './NewItemButton';
import { useNewItem } from '../hooks/useNewItem';
import { Table } from './Table/Table';
import { IconButtonCell } from './Table/IconButtonCell';
import { e_CellType } from '../enums';
import { DeleteIcon } from '@chakra-ui/icons';

export const newId = 1000000000;

const ItemsAdmin = () => {
  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: getItems({ from: undefined }),
  });

  const images = useQuery({
    queryKey: ['images'],
    queryFn: getImages,
  });

  const imagePadding = useBreakpointValue({ base: 0, md: 2 });

  const deleteItemMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
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
      size: 300,
    },
    {
      header: 'Image',
      accessorKey: 'imageId',
      cell: SelectCell,
      size: 200,
      meta: {
        options: images.data?.map((image) => ({
          id: image.id,
          displayValue: image.alt,
        })),
        props: {
          p: imagePadding,
        },
      },
    },
    {
      header: 'Delete',
      accessorKey: 'id',
      enableSorting: false,
      enableColumnFilter: false,
      enableResizing: false,

      cell: IconButtonCell,
      size: 40,
      meta: {
        type: e_CellType.iconButton,
        isInline: true,
        iconButtonCell: {
          icon: <DeleteIcon />,
          color: 'red.400',
          variant: 'ghost',
          'aria-label': 'Delete item',
          onClick: (id: number) => deleteItemMutation.mutate(+id),
        },
      },
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
      <Table
        table={table}
        filters={
          <Filters
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        }
      />
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
