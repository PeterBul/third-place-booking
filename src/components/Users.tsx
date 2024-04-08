import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { editUser, getUsers } from '../api/users';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EditableCell } from './Table/EditableCell';
import { TValue } from './Table/types';
import { StaticCell } from './Table/StaticCell';
import { CheckmarkCell } from './Table/CheckmarkCell';
import { useMemo, useState } from 'react';
import { Filters } from './Table/Filters';
import { IconButtonCell } from './Table/IconButtonCell';
import { UserDrawer } from './UserDrawer/UserDrawer';
import parsePhoneNumberFromString from 'libphonenumber-js/max';
import { e_CellType } from '../enums';
import { EditIcon } from '@chakra-ui/icons';
import { Table } from './Table/Table';

const Users = () => {
  const emailPadding = useBreakpointValue({ base: 0, md: 2 });
  const centerCheckmark = useBreakpointValue({ base: false, md: true });

  const queryClient = useQueryClient();

  const userMutation = useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: EditableCell,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: StaticCell,
      meta: {
        props: {
          p: emailPadding,
        },
      },
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: StaticCell,
    },
    {
      header: 'Member Third Place',
      accessorKey: 'isMemberThirdPlace',
      cell: CheckmarkCell,
      meta: {
        center: centerCheckmark,
        props: {
          px: 2,
        },
      },
    },
    {
      header: 'Member Bloom',
      accessorKey: 'isMemberBloom',
      cell: CheckmarkCell,
      meta: {
        center: centerCheckmark,
        props: {
          px: 2,
        },
      },
    },
    {
      header: 'Edit',
      accessorKey: 'id',
      cell: IconButtonCell,
      size: 40,
      meta: {
        isInline: true,
        type: e_CellType.iconButton,
        iconButtonCell: {
          icon: <EditIcon boxSize={4} />,
          onClick: (id: number) => setCurrentUserId(id),
          'aria-label': 'Edit',
          title: 'Edit',
          color: 'gray.300',
        },
      },
    },
  ];
  // const [users, setUsers] = useState<IUser[]>([]);
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const processedUsers = useMemo(() => {
    if (!users) return [];
    return users?.map((user) => ({
      ...user,
      phone:
        user.phone &&
        parsePhoneNumberFromString(user.phone)?.formatInternational(),
    }));
  }, [users]);

  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data: processedUsers,
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
        const user = users?.find((user) => user.id === +rowId);
        if (!user) return;
        userMutation.mutate({
          id: user.id,
          [columnId]: value,
        });
      },
    },
  });

  const currentUser = users?.find((user) => user.id === currentUserId);

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
      {currentUser != null && (
        <UserDrawer
          isOpen={currentUserId !== null}
          onClose={() => setCurrentUserId(null)}
          user={currentUser}
          canEditRoles
        />
      )}
    </Box>
  );
};

export default Users;
