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
import { useState, useRef, ChangeEvent } from 'react';
import { Country, SearchOnList } from './SearchOnList';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface IProps {
  value: string;
  onChange: (arg: string) => void;
  placeholder?: string;
}

const defaultCountry = {
  name: 'Norway',
  flag: '🇳🇴',
  code: 'NO',
  dial_code: '+47',
};

export const PhoneNumberInput = ({ value, onChange, placeholder }: IProps) => {
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
  const [country, setCountry] = useState<Country>(() => {
    if (!initialValue) {
      return defaultCountry;
    }
    return (
      Countries.find((item) => item.code === initialValue?.country) ||
      defaultCountry
    );
  });

  const { isOpen, onToggle, onClose } = useDisclosure();

  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onCountryChange = (item: Country) => {
    const parsedNumber = new AsYouType().input(`${item.dial_code}${number}`);

    setCountry(item);
    onChange(parsedNumber);
    inputRef.current?.focus();
    onClose();
  };

  const onPhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedNumber = new AsYouType().input(`${country.dial_code}${value}`);

    setNumber(value);
    onChange(parsedNumber);
  };

  return (
    <Box as="section" ref={ref} position="relative">
      <InputGroup>
        <InputLeftElement width="5em" cursor="pointer" onClick={onToggle}>
          <Text as="span" mr={3}>
            {country.flag}
          </Text>
          {isOpen ? (
            <ChevronUpIcon boxSize={6} color="gray.500" />
          ) : (
            <ChevronDownIcon boxSize={6} color="gray.500" />
          )}
        </InputLeftElement>
        <Input
          ref={inputRef}
          pl="5em"
          type="tel"
          value={number}
          placeholder={placeholder}
          onChange={onPhoneNumberChange}
        />
      </InputGroup>

      {isOpen ? (
        <SearchOnList
          data={Countries}
          onChange={onCountryChange}
          initialCode={country.code}
        />
      ) : null}
    </Box>
  );
};
