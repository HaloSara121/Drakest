import { Input, InputProps } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import { useField } from "@unform/core";


export function CreateCharacterModalInput({ 
  name,
  placeholder,
  ...rest
}: InputProps){
  const inputRef = useRef<HTMLInputElement>(null)

  const {fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])

  return (
    <Input
      defaultValue={defaultValue}
      ref={inputRef}
      transition="background-color .4s"
      variant="unstyled"
      p="2"
      // border="1px solid #181b23cc"
      borderRadius="4"
      autoComplete="off"
      fontSize="2xl"
      bgColor='gray.800'
      _hover={{
        bgColor:'gray.900'
      }}
      _placeholder={{
        color: 'gray.400'
      }}
      _focus={{
        outline: "none",
        bg: "gray.900"
      }}
      title={placeholder}
      placeholder={placeholder}
      onWheel={() => inputRef.current.blur()}
      {...rest}
    />
  )
}