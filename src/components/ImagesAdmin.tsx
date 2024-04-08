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
import { createImage, deleteImage, editImage, getImages } from '../api/images';
import { CheckmarkCell } from './Table/CheckmarkCell';
import { NewItemButton, newId } from './NewItemButton';
import { useNewItem } from '../hooks/useNewItem';
import { Table } from './Table/Table';
import { IconButtonCell } from './Table/IconButtonCell';
import { e_CellType } from '../enums';
import { DeleteIcon } from '@chakra-ui/icons';

const ImagesAdmin = () => {
  // const [users, setUsers] = useState<IUser[]>([]);

  const { data: images } = useQuery({
    queryKey: ['images'],
    queryFn: getImages,
  });

  const isClippablePadding = useBreakpointValue({ base: 0, md: 2 });
  const centerCheckmark = useBreakpointValue({ base: false, md: true });

  const queryClient = useQueryClient();
  const deleteImageMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });

  const columns = [
    {
      header: 'Alt',
      accessorKey: 'alt',
      cell: EditableCell,
    },
    {
      header: 'Url',
      accessorKey: 'url',
      cell: EditableCell,
      size: 500,
      meta: {
        allowNull: false,
      },
    },
    {
      header: 'Clippable',
      accessorKey: 'isClippable',
      cell: CheckmarkCell,
      size: 120,
      meta: {
        center: centerCheckmark,
        props: {
          p: isClippablePadding,
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
          onClick: (id: number) => deleteImageMutation.mutate(+id),
        },
      },
    },
  ];

  const [globalFilter, setGlobalFilter] = useState('');

  const itemMutation = useMutation({
    mutationFn: editImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });

  const createImageMutation = useMutation({
    mutationFn: createImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });

  const defaultImage = {
    id: newId,
    url: '',
    alt: '',
    isClippable: false,
  };
  const {
    newItem,
    cancelAddingItem,
    saveNewItem,
    startAddingItem,
    updateNewItem,
    addItemToData,
  } = useNewItem(defaultImage, (newImage) => {
    createImageMutation.mutate(newImage);
  });

  const data = useMemo(() => {
    return addItemToData(
      images
        ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        .map((image) => {
          return {
            id: image.id,
            alt: image.alt,
            url: image.url,
            isClippable: image.isClippable,
          };
        }) ?? []
    );
  }, [addItemToData, images]);

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
        const item = images?.find((image) => image.id === +rowId);
        if (!item) return;
        itemMutation.mutate({
          id: item.id,
          [columnId]: value,
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

export default ImagesAdmin;
