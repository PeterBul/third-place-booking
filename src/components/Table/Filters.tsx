import {
  Flex,
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
  placeholder?: string;
  customFilters?: JSX.Element | JSX.Element[];
}
export const Filters = (props: IProps) => {
  return (
    <Flex mb={6} gap={4} alignItems={'center'} justifyContent={'flex-start'}>
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
      {props.customFilters}
    </Flex>
  );
};
