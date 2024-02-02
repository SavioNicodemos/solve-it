import { Center, HStack, Text, VStack } from 'native-base';

import { ProductDTO } from '@dtos/ProductDTO';
import { AdDetails } from './AdDetails';
import { Button } from './Button';
import Loading from './Loading';

function RenderProduct({
  product,
  isLoading,
  isMyAd,
  isLoadingChangeVisibility,
  onChangeVisibilityClick,
}: Props) {
  if (isLoading) {
    return <Loading backgroundStyle="appDefault" />;
  }

  if (!product) {
    return (
      <Center flex={1} bg="gray.700">
        <Text>Produto não encontrado</Text>
      </Center>
    );
  }

  return (
    <>
      <AdDetails product={product!} />

      {isMyAd ? (
        <HStack
          justifyContent="space-between"
          bg="white"
          pt={4}
          pb={8}
          alignItems="center"
          px="6"
          flexDir="column"
          space={4}
        >
          <VStack>
            <Button
              title={
                product!.is_active ? 'Desativar Resolve' : 'Ativar Resolve'
              }
              icon="power"
              variant="primary"
              minW={360}
              isDisabled={isLoadingChangeVisibility}
              onPress={onChangeVisibilityClick}
            />
          </VStack>
          <VStack mt={3}>
            <Button
              title="Excluir Resolve"
              icon="trash"
              variant="secondary"
              minW={360}
            />
          </VStack>
        </HStack>
      ) : null}
    </>
  );
}

type Props = {
  product?: ProductDTO;
  isLoading: boolean;
  isMyAd: boolean;
  isLoadingChangeVisibility: boolean;
  onChangeVisibilityClick: () => void;
};

export default RenderProduct;
