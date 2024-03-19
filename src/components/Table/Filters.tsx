import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';
import { MdSearch } from 'react-icons/md';

interface IProps {
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  globalFilter?: string;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
}
export const Filters = (props: IProps) => {
  return (
    <Box mb={6}>
      <InputGroup size="sm" maxW="12rem">
        <InputLeftElement pointerEvents="none">
          <Icon as={MdSearch} />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="User"
          borderRadius={5}
          value={props.globalFilter ?? ''}
          onChange={(e) => props.setGlobalFilter?.(e.target.value)}
        />
      </InputGroup>
    </Box>
  );
};
