import {
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Switch,
} from '@chakra-ui/react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';
import { MdSearch } from 'react-icons/md';

interface IProps {
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  globalFilter?: string;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  toggleMeFilter?: () => void;
  isMeFilterActive?: boolean;
}
export const Filters = (props: IProps) => {
  return (
    <Flex mb={6} gap={4} alignItems={'center'}>
      <InputGroup size="sm" maxW="12rem">
        <InputLeftElement pointerEvents="none">
          <Icon as={MdSearch} />
        </InputLeftElement>
        <Input
          type="text"
          placeholder={props.placeholder ?? 'Filter...'}
          borderRadius={5}
          value={props.globalFilter ?? ''}
          onChange={(e) => props.setGlobalFilter?.(e.target.value)}
        />
      </InputGroup>
      {props.isMeFilterActive !== undefined && (
        <FormControl display={'flex'} alignItems={'center'}>
          <FormLabel size={'sm'} htmlFor="toggleMeFilter" my={0}>
            Show only my bookings:
          </FormLabel>
          <Switch
            size={'sm'}
            id="toggleMeFilter"
            onChange={props.toggleMeFilter}
            isChecked={props.isMeFilterActive}
          />
        </FormControl>
      )}
    </Flex>
  );
};
