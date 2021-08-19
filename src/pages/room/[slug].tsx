import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";

import { Flex, Text, useDisclosure } from "@chakra-ui/react";

import { Characters } from "../../components/room/Characters";
import { CharacterSheetModal } from "../../components/room/CharacterSheetModal";
import { DicesSection } from "../../components/room/DicesSection";

export default function Room({user, roomId}){
  const { isOpen, onOpen, onClose } = useDisclosure()

  return(
    <>
      <Head>
        <title>Room-{roomId} | Drakest</title>
      </Head>
      
      <CharacterSheetModal
        isOpen={isOpen} 
        onRequestClose={onClose}
      />

      <Flex w="100%" mx="auto">
        <Flex flex="1">
          <Flex
            width="30rem"
            bg="gray.900"
            rounded="3xl"
            my="4"
            mx="6"
          >
            <DicesSection />
          </Flex>

        </Flex>
        <Flex align="center" w="100%" h="100vh" ml="auto" maxW="400px">
          <Characters openCharacterSheet={onOpen} />
        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const session = await getSession({req})   
  const {slug} = params

  if(!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const user = session.user

  return {
    props: {
      user,
      roomId: slug
    }
  }
}