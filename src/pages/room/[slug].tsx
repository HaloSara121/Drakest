import { useContext, useEffect, useState } from 'react'
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

import { Flex, Image, useDisclosure, VStack } from "@chakra-ui/react";

import { Aside, Characters, CharacterSheetModal, RoomHeader } from "../../components/layout/room";
import { Loading } from "../../components/common/Loading";
import { useLoding } from "../../hooks/useLoding";
import SocketService from '../../services/socketService';
import roomService from '../../services/roomService';
import { DicesProvider } from '../../contexts/DicesContext';

export default function Room({ roomId }){
  const router = useRouter()
  const { isLoading } = useLoding()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [asideIsOpen, setAsideIsOpen] = useState(false)

  useEffect(() => {
    if(!SocketService.socket){
      // SocketService.connect("https://drakest-back-end.herokuapp.com/").catch((err) => { error: err })
      SocketService.connect("http://localhost:8080").catch((err) => { error: err })
      
      const isAbleToJoinRoom = roomService.joinGameRoomRequest(SocketService.socket, roomId)

      if(isAbleToJoinRoom) {
        router.push(`/room/${roomId}`)
      } else {
        router.push('/')
      }
    }
  }, [])
  
  if(router.isFallback || isLoading){    
    return <Loading />;
  }

  return(
    <DicesProvider roomId={roomId}>
      <Head>
        <title>Room-{roomId} | Drakest</title>
      </Head>
      
      <CharacterSheetModal
        isOpen={isOpen} 
        onRequestClose={onClose}
      />

      <Flex 
        flexDir="column"
        h="100vh"
      >
        <RoomHeader 
          roomId={roomId} 
          toggleAside={setAsideIsOpen} 
          asideIsOpen={asideIsOpen} 
        />

        <Flex 
          h="100%"
          py="2"
          px="4"
          position="relative"
        >
          <Aside isOpen={asideIsOpen} />

          <Flex
            flex="1"
          >
          <Image src="/images/bg.png"/>
          </Flex>

          <Characters openCharacterSheet={onOpen} />
        </Flex>
      </Flex>
    </DicesProvider>
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

  return {
    props: {
      roomId: slug
    }
  }
}