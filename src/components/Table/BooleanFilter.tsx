import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

interface IProps {
  id: string;
  label: string;
  value: boolean;
  onToggle: () => void;
}

export const BooleanFilter = (props: IProps) => {
  return (
    <FormControl display={'flex'} alignItems={'center'} width={'fit-content'}>
      <FormLabel size={'sm'} htmlFor={props.id} my={0}>
        {props.label}
      </FormLabel>
      <Switch
        size={'sm'}
        id={props.id}
        onChange={props.onToggle}
        isChecked={props.value}
      />
    </FormControl>
  );
};
