import { Avatar, Flex, HStack, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";

import { HiPencil, HiTrash } from "react-icons/hi"
import { api } from "../../../services/api";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";

interface CharacterCardProps{
  character: CharacterSheet
  characterId: string
  editable?: boolean
  selectedId?: any
}

export function CharacterCard({
  character,
  characterId,
  editable,
  selectedId
}: CharacterCardProps) {

  return (
    <Flex
      display="flex"
      flexDir="column"
      align="center"
      bg={selectedId === characterId ? "gray.600" : "gray.700"}
      border={selectedId === characterId ? "1px solid green" : "none"}
      rounded="md"
    >
      {editable && (
        <HStack
          w="100%"
          h="2"
          py="2"
          px="2"
          align="flex-start"
          justify="flex-end"
        >
          <EditButton 
            character={character}
            characterId={characterId}
          />

          <DeleteButton 
            characterId={characterId}
          />
        </HStack>
      )}

      <Avatar 
        src="/images/defaultCharacter2.png" 
        size="xl" 
        mx="auto" 
        my="4" 
      />

      <Flex
        w="100%"
        flexDir="column"
      >
        <Text
          mx="auto"
          fontSize="large"
          fontWeight="bold"
        >
          {character.infos.name}
        </Text>

        <Flex>
          <Text
            as="span"
            m="2"
          >
            Torre Negra
          </Text>
        </Flex>
      </Flex>

    </Flex>
  )
}