import { FlashList } from '@shopify/flash-list';
import { Center, Divider, Heading, Text, VStack, View } from 'native-base';

import { GroupItem } from '@/components/GroupItem';
import { Header } from '@/components/Header';
import Loading from '@/components/Loading';
import { useGroups } from '@/hooks/useGroups';

export default function Groups() {
  return (
    <VStack bgColor="gray.600" flex={1} pt={12}>
      <Header title="Grupos" px={6} />

      <RenderGroups />
    </VStack>
  );
}

function RenderGroups() {
  const { data, isSuccess, isLoading } = useGroups();

  if (isLoading) {
    return <Loading />;
  }

  if (!isSuccess) {
    return <ErrorComponent />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <GroupItem group={item} />}
        estimatedItemSize={213}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        ItemSeparatorComponent={ListDivider}
        ListEmptyComponent={<EmptyList />}
      />
    </View>
  );
}

function ListDivider() {
  return <Divider my={2} />;
}

function EmptyList() {
  return (
    <Center flex={1} justifyContent="center" alignItems="center">
      <Heading fontSize="md">Você ainda não possui nenhum grupo!</Heading>
      <Text fontSize="md" textAlign="center">
        Para usar a aplicação tente criar ou entrar em um grupo existente
      </Text>
    </Center>
  );
}

function ErrorComponent() {
  return (
    <Center>
      <Heading fontSize="md" color="red.500">
        Erro ao buscar os grupos.
      </Heading>
      <Text>Tente novamente mais tarde!</Text>
    </Center>
  );
}
