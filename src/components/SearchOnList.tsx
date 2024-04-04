import { ChangeEvent, useState } from 'react';
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
};

export const SearchOnList = ({ data, onChange }: Props) => {
  const [filteredList, setFilteredList] = useState(data);
  const [selectedItem, setSelectedItem] = useState<Country | undefined>(
    undefined
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const result =
      data?.filter((item) => {
        return item.name.toLowerCase().includes(value);
      }) || [];
    setFilteredList(result);
  };

  return (
    <Box
      my={1}
      maxH="xs"
      bg="gray.800"
      width="full"
      zIndex={999}
      height="auto"
      overflow="auto"
      borderRadius="lg"
      position="absolute"
      boxShadow="0px 1px 30px rgba(0, 0, 0, 0.1)"
    >
      <Box position="sticky" top="0" padding={4} bg="gray.800">
        <Input
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
              item?.flag === selectedItem?.flag
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
  );
};
