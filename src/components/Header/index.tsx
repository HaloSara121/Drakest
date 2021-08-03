import { Flex } from '@chakra-ui/react';
import React from 'react';
import LoginSection from './LoginSection';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <Flex
      w="100%"
      maxW="1120"
      mx="auto"
      h="10rem"
      align="center"
      p="6"
    >
      <Logo />

      <Flex ml="auto">
        <LoginSection />
      </Flex>
    </Flex>
  );
}

export default Header;