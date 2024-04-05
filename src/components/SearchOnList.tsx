import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Box, Input, List, ListItem, Text } from '@chakra-ui/react';

export type Country = {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
};

export type Props = {
  data: Country[];
  onChange: (args: Country) => void;
  onBlur?: () => void;
  initialCode?: string;
};

export const SearchOnList = ({
  data,
  onChange,
  onBlur,
  initialCode,
}: Props) => {
  const [filteredList, setFilteredList] = useState(data);
  const [selectedItem, setSelectedItem] = useState<Country | undefined>(
    initialCode ? data.find((item) => item.code === initialCode) : undefined
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedItemRef = useRef<HTMLLIElement>(null);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const result =
      data?.filter((item) => {
        return item.name.toLowerCase().includes(value);
      }) || [];
    setFilteredList(result);
  };

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Box
      borderRadius="lg"
      overflow={'hidden'}
      className="this"
      position="absolute"
      bg="gray.800"
      zIndex={999}
      my={1}
      width="full"
      height="auto"
      boxShadow="0px 1px 30px rgba(0, 0, 0, 0.1)"
      onBlur={onBlur}
    >
      <Box maxH="xs" overflow="auto">
        <Box position="sticky" top="0" padding={4} bg="gray.800">
          <Input
            ref={inputRef}
            size="sm"
            type="search"
            borderRadius="md"
            autoComplete="off"
            placeholder="Search for a country..."
            onChange={(event) => handleSearch(event)}
            _focusWithin={{ borderColor: 'secondary' }}
            _invalid={{ borderColor: 'gray.50' }}
          />
        </Box>

        <List>
          {filteredList?.map((item: Country, index: number) => (
            <ListItem
              ref={isSameCountry(item, selectedItem) ? selectedItemRef : null}
              key={index}
              paddingY={2}
              color="gray.400"
              cursor="pointer"
              textTransform="capitalize"
              onClick={() => {
                onChange(item);
                setSelectedItem(item);
              }}
              style={{ transition: 'all .125s ease' }}
              _hover={{ bg: 'gray.400', color: 'gray.800' }}
              sx={
                item?.code === selectedItem?.code
                  ? { backgroundColor: 'gray.400', color: 'gray.800' }
                  : {}
              }
            >
              <Text as="span" mx={4}>
                {item?.flag}
              </Text>
              <Text as="span">{item?.name}</Text>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

const isSameCountry = (a: Country, b: Country | undefined) => {
  if (!b) {
    return false;
  }
  return a.flag === b.flag;
};
