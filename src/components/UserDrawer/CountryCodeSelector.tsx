import { useQuery } from '@tanstack/react-query';
import { getCountriesWithCodes } from '../../api/restcountries';
import { Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useRef } from 'react';

interface IProps {
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
}

export const CountryCodeSelector = (props: IProps) => {
  const { data } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountriesWithCodes,
  });
  const countries = data?.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Menu>
      <MenuButton
        w={'100%'}
        // as={Button}
        // isActive={isOpen}
        // rightIcon={<ChevronDownIcon />}
        onClick={() => {
          setTimeout(() => {
            ref.current?.focus();
          }, 50);
        }}
      >
        {props.countryCode}
      </MenuButton>
      {/* <Portal> */}
      <>
        <MenuList>
          {countries?.map((country) => {
            const callingCode =
              country.idd.root +
              (country.idd.suffixes.length === 1
                ? country.idd.suffixes[0]
                : '');
            return (
              <MenuItem
                key={country.name.common}
                onClick={() => {
                  props.setCountryCode(callingCode);
                }}
                ref={callingCode === props.countryCode ? ref : undefined}

                // onFocus={(e) => {
                //   if (
                //     e.target.attributes.getNamedItem('tabindex')?.value === '0'
                //   ) {
                //     e.target.scrollIntoView();
                //   }
                // }}
              >
                <Text w={14}>{callingCode}</Text>
                <Text>{country.name.common}</Text>
              </MenuItem>
            );
          })}
        </MenuList>
      </>
      {/* </Portal> */}
    </Menu>
  );
};
