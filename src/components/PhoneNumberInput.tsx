import {
  Box,
  Text,
  Input,
  InputGroup,
  useDisclosure,
  useOutsideClick,
  InputLeftElement,
} from '@chakra-ui/react';
import Countries from '../data/countries.json';
import parsePhoneNumberFromString, { AsYouType } from 'libphonenumber-js/max';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Country, SearchOnList } from './SearchOnList';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface IProps {
  value: string;
  onChange: (arg: string) => void;
}

export const PhoneNumberInput = ({ value, onChange }: IProps) => {
  const ref = useRef(null);
  const initialValue = parsePhoneNumberFromString(value ?? '', {
    // set this to use a default country when the phone number omits country code
    defaultCountry: 'NO',

    // set to false to require that the whole string is exactly a phone number,
    // otherwise, it will search for a phone number anywhere within the string
    extract: false,
  });

  const [number, setNumber] = useState(
    initialValue ? initialValue.nationalNumber : ''
  );
  const [country, setCountry] = useState(
    initialValue ? `+${initialValue.countryCallingCode}` : '+47'
  );
  const [countryFlag, setCountryFlag] = useState(() => {
    if (initialValue) {
      const country = Countries.find(
        (item) => item.dial_code === `+${initialValue.countryCallingCode}`
      );
      return country?.flag || `🇳🇴`;
    }
    return `🇳🇴`;
  });
  const { isOpen, onToggle, onClose } = useDisclosure();

  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  });

  useEffect(() => {
    if (country !== '' || number !== '') {
      onChange(`${country}${number}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, number]);

  const onCountryChange = (item: Country) => {
    const parsedNumber = new AsYouType().input(`${country}${number}`);

    setCountry(item?.dial_code);
    setCountryFlag(item?.flag);
    onChange(parsedNumber);
    onClose();
  };

  const onPhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedNumber = new AsYouType().input(`${country}${number}`);

    setNumber(value);
    onChange(parsedNumber);
  };

  return (
    <Box as="section" ref={ref} position="relative">
      <InputGroup>
        <InputLeftElement width="5em" cursor="pointer" onClick={onToggle}>
          <Text as="span" mr={3}>
            {countryFlag}
          </Text>
          {isOpen ? (
            <ChevronUpIcon boxSize={6} color="gray.500" />
          ) : (
            <ChevronDownIcon boxSize={6} color="gray.500" />
          )}
        </InputLeftElement>
        <Input
          pl="5em"
          type="tel"
          value={number}
          placeholder="Enter your phone number"
          onChange={onPhoneNumberChange}
        />
      </InputGroup>

      {isOpen ? (
        <SearchOnList data={Countries} onChange={onCountryChange} />
      ) : null}
    </Box>
  );
};
