import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, getMyRoles, getUsers } from '../api/users';
import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Text,
  useBoolean,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TValue } from './Table/types';
import { StaticCell } from './Table/StaticCell';
import { CheckmarkCell } from './Table/CheckmarkCell';
import { useMemo, useRef, useState } from 'react';
import { Filters } from './Table/Filters';
import {
  deleteBooking,
  editBooking,
  getArchivedBookings,
  getBookings,
} from '../api/bookings';
import moment from 'moment';
import { IconButtonCell } from './Table/IconButtonCell';
import { Table } from './Table/Table';
import { e_CellType, e_Roles } from '../enums';
import { DeleteIcon } from '@chakra-ui/icons';
import { MdArchive, MdRestore } from 'react-icons/md';
import {
  SeriousConfirmDestructButton,
  SeriousConfirmDialog,
  SeriousConfirmInput,
} from './SeriousConfirmDialog';
import { BooleanFilter } from './Table/BooleanFilter';

const BookingsAdmin = () => {
  // const [users, setUsers] = useState<IUser[]>([]);
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: getMe });
  const { data: myRoles } = useQuery({
    queryKey: ['myRoles'],
    queryFn: getMyRoles,
  });
  const queryClient = useQueryClient();

  const centerCheckmark = useBreakpointValue({ base: false, md: true });

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const [globalFilter, setGlobalFilter] = useState('');

  const [isMeFilterActive, setIsMeFilterActive] = useBoolean(false);

  const [isArchivedFilterActive, setIsArchivedFilterActive] = useBoolean(false);

  const { data: archivedBookings } = useQuery({
    queryKey: ['archivedBookings'],
    queryFn: getArchivedBookings,
  });

  const editBookingMutation = useMutation({
    mutationFn: editBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['archivedBookings'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const cancelRef = useRef(null);
  const [bookingIdToDelete, setBookingIdToDelete] = useState<number | null>(
    null
  );

  const data = useMemo(() => {
    return (
      (isArchivedFilterActive ? archivedBookings : bookings)
        ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        .filter((booking) => {
          if (isMeFilterActive) {
            return booking.userId === me?.id;
          }
          return true;
        })
        .map((booking) => {
          const user = users?.find((user) => user.id === booking.userId);
          return {
            borrowedBy: user?.name,
            rentedFrom: moment(booking.pickupDate).format('MMM Do YYYY'),
            rentedTo: moment(booking.returnDate).format('MMM Do YYYY'),
            status: booking.isReturned
              ? 'Returned'
              : booking.isPickedUp
              ? 'Picked Up'
              : 'Not Picked Up',
            isPickedUp: booking.isPickedUp,
            isReturned: booking.isReturned,
            userId: booking.userId,
            id: booking.id,
          };
        }) ?? []
    );
  }, [
    archivedBookings,
    bookings,
    isArchivedFilterActive,
    isMeFilterActive,
    me?.id,
    users,
  ]);

  type TData = (typeof data)[0];

  const columns: (ColumnDef<TData, TValue> | ColumnDef<TData, boolean>)[] = [
    {
      header: 'Borrowed By',
      accessorKey: 'borrowedBy',
      cell: StaticCell,
    },
    {
      header: 'Rented From',
      accessorKey: 'rentedFrom',
      cell: StaticCell,
    },
    {
      header: 'Rented To',
      accessorKey: 'rentedTo',
      cell: StaticCell,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: StaticCell,
    },
    {
      header: 'Is Picked Up',
      accessorKey: 'isPickedUp',
      cell: CheckmarkCell,
      meta: {
        center: centerCheckmark,
        props: {
          px: 2,
        },
      },
    },
    {
      header: 'Is Returned',
      accessorKey: 'isReturned',
      cell: CheckmarkCell,
      meta: {
        center: centerCheckmark,
        props: {
          px: 2,
        },
      },
    },
  ];

  if (myRoles?.includes(e_Roles.Admin)) {
    if (!isArchivedFilterActive) {
      columns.push({
        header: 'Archive',
        accessorKey: 'id',
        cell: IconButtonCell,
        size: 50,
        meta: {
          type: e_CellType.iconButton,
          isInline: true,
          iconButtonCell: {
            icon: <Icon as={MdArchive} />,
            variant: 'ghost',
            'aria-label': 'Archive booking',
            title: 'Archive booking',
            onClick: (id: number) =>
              editBookingMutation.mutate({ id, isArchived: true }),
          },
        },
      });
    } else {
      columns.push({
        header: 'Restore',
        accessorKey: 'id',
        cell: IconButtonCell,
        size: 50,
        meta: {
          type: e_CellType.iconButton,
          isInline: true,
          iconButtonCell: {
            icon: <Icon as={MdRestore} />,
            variant: 'ghost',
            'aria-label': 'Restore booking',
            title: 'Restore booking',
            onClick: (id: number) =>
              editBookingMutation.mutate({ id, isArchived: false }),
          },
        },
      });
    }
    columns.push({
      header: 'Delete',
      accessorKey: 'id',
      cell: IconButtonCell,
      size: 40,
      meta: {
        type: e_CellType.iconButton,
        isInline: true,
        iconButtonCell: {
          icon: <DeleteIcon />,
          color: 'red.400',
          variant: 'ghost',
          'aria-label': 'Delete booking',
          title: 'Delete booking',
          onClick: (id: number) => {
            setBookingIdToDelete(+id);
          },
        },
      },
    });
  }

  const table = useReactTable({
    data,
    columns,
    initialState: {
      sorting: [
        {
          id: 'rentedFrom',
          desc: true,
        },
      ],
    },
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
        const booking = bookings?.find((booking) => booking.id === +rowId);
        if (!booking) return;
        editBookingMutation.mutate({
          id: booking.id,
          [columnId]: value,
        });
      },
    },
  });

  return (
    <>
      <Box>
        <Table
          table={table}
          filters={
            <Filters
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              customFilters={
                <>
                  <BooleanFilter
                    id="toggleMeBookings"
                    label="Show only my bookings"
                    value={isMeFilterActive}
                    onToggle={setIsMeFilterActive.toggle}
                  />
                  <BooleanFilter
                    id="toggleArchivedBookings"
                    label="Show archived bookings"
                    value={isArchivedFilterActive}
                    onToggle={setIsArchivedFilterActive.toggle}
                  />
                </>
              }
            />
          }
        />
      </Box>
      <SeriousConfirmDialog
        confirmString="delete"
        isOpen={bookingIdToDelete !== null}
        leastDestructiveRef={cancelRef}
        onClose={() => setBookingIdToDelete(null)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Booking
            </AlertDialogHeader>

            <AlertDialogBody>
              <Flex flexDir={'column'} gap={4}>
                <Text>
                  Are you sure you want to delete this booking? This is a
                  destructive action and can't be undone.
                </Text>
                <Text>
                  You can also archive the booking by clicking{' '}
                  <Box
                    as="span"
                    display={'inline-block'}
                    verticalAlign={'middle'}
                  >
                    <Icon as={MdArchive} cursor={'text'} boxSize={5} />
                  </Box>
                  .
                </Text>
                <FormControl>
                  <FormLabel htmlFor="delete-booking">
                    Type "delete" to confirm
                  </FormLabel>
                  <SeriousConfirmInput id="delete-booking" />
                </FormControl>
              </Flex>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setBookingIdToDelete(null)}
              >
                Cancel
              </Button>
              <SeriousConfirmDestructButton
                colorScheme="red"
                onClick={() => {
                  if (bookingIdToDelete === null) return;
                  deleteBookingMutation.mutate(bookingIdToDelete);
                  setBookingIdToDelete(null);
                }}
                ml={3}
              >
                Delete
              </SeriousConfirmDestructButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </SeriousConfirmDialog>
    </>
  );
};

export default BookingsAdmin;
