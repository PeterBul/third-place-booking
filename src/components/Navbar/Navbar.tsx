import { Flex } from '@chakra-ui/layout';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { Button, IconButton, useDisclosure } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useLayoutEffect, useState } from 'react';
import { e_Roles } from '../../enums';
import { Gravatar } from '../Gravatar';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../api/users';
import { UserDrawer } from '../UserDrawer/UserDrawer';

const Navbar = () => {
  const { auth } = useAuth();
  const isLoggedIn = auth.accessToken;
  const handleLogout = useLogout();
  const [display, changeDisplay] = useState('none');

  const location = useLocation();

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  useLayoutEffect(() => {
    if (display === 'flex') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [display]);

  const showAdminButton =
    auth.roles?.includes(e_Roles.Member) || auth.roles?.includes(e_Roles.Admin);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isHome = location.pathname === '/';

  return (
    <>
      <Flex
        as={'nav'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={'1rem'}
        m={display === 'flex' ? undefined : { base: '0.5rem', md: '1rem' }}
        p={'1rem'}
        pos={'fixed'}
        top={{ base: '0', md: '1rem' }}
        left={{ base: '0', md: '1rem' }}
        right={{ base: '0', md: '1rem' }}
        zIndex={100}
        bgColor={isHome ? 'rgb(26, 32, 44)' : 'rgba(26, 32, 44, 0.60)'}
        backdropFilter={'blur(5px)'}
        borderRadius={'20px'}
      >
        <Flex alignItems={'center'}>
          <Button as={Link} variant={'ghost'} to="/">
            Third place
          </Button>
        </Flex>
        <Flex
          gap={1}
          alignItems={'center'}
          display={{ base: 'none', md: 'flex' }}
        >
          {isLoggedIn ? (
            <>
              <Button as={Link} variant={'ghost'} to="/booking" mx={1}>
                Gear share
              </Button>
              {showAdminButton && (
                <Button as={Link} variant={'ghost'} to="/admin" mx={1}>
                  Admin
                </Button>
              )}
              <Button
                className="nav-button"
                onClick={handleLogout}
                colorScheme="yellow"
                variant={'ghost'}
                mx={1}
              >
                Sign Out
              </Button>
              <Gravatar
                email={me?.email ?? ''}
                size={'sm'}
                borderWidth={1}
                borderColor={'yellow.300'}
                onClick={onOpen}
                cursor={'pointer'}
              />
            </>
          ) : (
            <Button as={Link} to="/login" mx={1}>
              Login
            </Button>
          )}
        </Flex>
        {/* hamburger{/* Mobile */}
        <IconButton
          aria-label="Open Menu"
          size="lg"
          icon={<HamburgerIcon />}
          onClick={() => changeDisplay('flex')}
          display={{ base: 'flex', md: 'none' }}
          variant={'ghost'}
        />
        {/* <Switch color="green" isChecked={isDark} onChange={toggleColorMode} /> */}

        {/* Mobile content */}
        <Flex
          w={'100vw'}
          h={'100vh'}
          pos={'absolute'}
          py={'1rem'}
          style={{
            paddingRight: `calc(1rem + ${
              window.innerWidth - document.documentElement.clientWidth
            }px`,
            paddingLeft: `calc(1rem + ${
              window.innerWidth - document.documentElement.clientWidth
            }px`,
          }}
          left={0}
          top={0}
          right={0}
          zIndex={20}
          display={display}
          overflowY={'auto'}
          flexDir={'column'}
          bg={'gray.800'}
          onClick={() => changeDisplay('none')}
        >
          <Flex justify={'flex-end'}>
            <IconButton
              aria-label="Close Menu"
              size="lg"
              icon={<CloseIcon />}
              onClick={() => changeDisplay('none')}
              variant={'ghost'}
            />
          </Flex>
          <Flex flexDir={'column'} align={'center'}>
            <Button as={Link} to="/" w={'100%'} my={5} variant={'ghost'}>
              Home
            </Button>
            <Button as={Link} to="/booking" w={'85%'} my={5} variant={'ghost'}>
              Gear share
            </Button>
            {showAdminButton && (
              <Button as={Link} to="/admin" w={'85%'} my={5} variant={'ghost'}>
                Admin
              </Button>
            )}
            {isLoggedIn ? (
              <Button
                className="nav-button"
                colorScheme="yellow"
                onClick={handleLogout}
                w={'85%'}
                variant={'ghost'}
              >
                Sign Out
              </Button>
            ) : (
              <Button as={Link} to="/login" colorScheme="yellow" w={'85%'}>
                Login
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
      <UserDrawer
        isOpen={isOpen}
        onClose={onClose}
        user={me}
        isLoading={isLoading}
      />
    </>
  );
};

export default Navbar;
