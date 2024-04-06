import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';
import { ChangeEvent, FocusEvent } from 'react';

interface IProps {
  error?: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent) => void;
}

export const BasicInput = ({ error, value, onBlur, onChange }: IProps) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor="name">Name:</FormLabel>
      <Input
        id="name"
        name="name"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      ></Input>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
