import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import useAuth from '../hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Icon } from '@chakra-ui/react';
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
import { editImage, getImages } from '../api/images';
import { CheckmarkCell } from './Table/CheckmarkCell';

const ImagesAdmin = () => {
  // const [users, setUsers] = useState<IUser[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const {
    data: images,
    isError,
    error,
  } = useQuery({
    queryKey: ['images'],
    queryFn: getImages,
  });

  const columns = [
    {
      header: 'Alt',
      accessorKey: 'alt',
      cell: EditableCell,
    },
    {
      header: 'url',
      accessorKey: 'url',
      cell: EditableCell,
      size: 600,
    },
    {
      header: 'Clippable',
      accessorKey: 'isClippable',
      cell: CheckmarkCell,
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

  const data = useMemo(() => {
    return (
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
  }, [images]);

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
        const item = images?.find((image) => image.id === +rowId);
        if (!item) return;
        itemMutation.mutate({
          id: item.id,
          [columnId]: value,
        });
      },
    },
  });

  if (isError) {
    if (error instanceof AxiosError) {
      // TODO: Make a shared axios error handler
      if (error?.response?.status === 401) {
        setAuth({});
      }
      navigate('/login', { state: { from: location }, replace: true });
    }
  }

  return (
    <Box>
      <Filters globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <Box className="table" w={table.getTotalSize()}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box className="tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Box className="th" w={header.getSize()} key={header.id}>
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
