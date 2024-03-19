import { Avatar, AvatarProps } from '@chakra-ui/react';
import { useSHA256Hash } from '../hooks/useSHA256Hash';
export const Gravatar = ({
  email,
  gravatarSize = 40,
  ...props
}: {
  email: string;
  gravatarSize?: number;
} & AvatarProps) => {
  const hash = useSHA256Hash(email.trim().toLowerCase());
  return (
    <Avatar
      src={`https://www.gravatar.com/avatar/${hash}?s=${gravatarSize}&d=identicon`}
      {...props}
    />
  );
};
