import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Show,
  Table,
  Td,
  Th,
  Tr,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
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
import { createImage, deleteImage, editImage, getImages } from '../api/images';
import { CheckmarkCell } from './Table/CheckmarkCell';
import { NewItemButton, newId } from './NewItemButton';
import { useNewItem } from '../hooks/useNewItem';
import { DeleteCell } from './Table/DeleteCell';

const ImagesAdmin = () => {
  // const [users, setUsers] = useState<IUser[]>([]);

  const { data: images } = useQuery({
    queryKey: ['images'],
    queryFn: getImages,
  });

  const isClippablePadding = useBreakpointValue({ base: 0, md: 2 });
  const centerCheckmark = useBreakpointValue({ base: false, md: true });

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

      cell: DeleteCell,
      size: 40,

      meta: {
        deleteCell: {
          mutation: deleteImage,
          invalidateKey: 'images',
        },
      },
    },
  ];

  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });

  return (
    <Box>
      <Filters globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <Show above="md">
        <Box overflowX={'auto'}>
          <Box as={Table} w={table.getTotalSize()}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Box as={Tr} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    w={`${header.getSize()}px`}
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
              </Box>
            ))}
            {table.getRowModel().rows.map((row) => (
              <Box as={Tr} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Box
                    as={Td}
                    w={`${cell.column.getSize()}px`}
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
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Show>

      <Show below="md">
        <VStack>
          {table.getRowModel().rows.map((row) => (
            <Card key={row.id} w={'100%'}>
              <CardBody>
                {row.getVisibleCells().map((cell) =>
                  cell.column.columnDef.header?.toString() === 'Delete' ? (
                    <Button
                      variant={'deleteOutline'}
                      w={'100%'}
                      onClick={() => deleteMutation.mutate(+cell.row.id)}
                      key={cell.id}
                    >
                      Delete
                    </Button>
                  ) : (
                    <FormControl
                      display={'flex'}
                      my={2}
                      key={cell.id}
                      alignItems={'center'}
                    >
                      <FormLabel
                        htmlFor={cell.id}
                        minWidth={'80px'}
                        alignItems={'center'}
                      >
                        {cell.column.columnDef.header?.toString()}
                      </FormLabel>
                      <Flex key={cell.id} id={cell.id} flex={1}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Flex>
                    </FormControl>
                  )
                )}
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Show>

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

const getSortIcon = (dir: SortDirection | false) => {
  if (dir === 'asc') {
    return MdArrowUpward;
  }
  if (dir === 'desc') {
    return MdArrowDownward;
  }
  return MdSwapVert;
};
