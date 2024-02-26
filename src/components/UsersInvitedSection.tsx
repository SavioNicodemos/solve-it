import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { HStack, Heading, Icon, IconButton, Text, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { z } from 'zod';

import { FetchInvitedUser } from '@/dtos/GroupDTO';
import { useDeleteGroupInvite } from '@/hooks/mutations/useDeleteGroupInvite';
import { useInvitedUsers } from '@/hooks/useInvitedUsers';
import { useToast } from '@/hooks/useToast';

import { useSendGroupInvite } from '@/hooks/mutations/useSendGroupInvite';
import { Input } from './Input';
import { UserItem } from './UserItem';

type Props = {
  groupId: number;
  isAdmin: boolean;
};

export function UsersInvitedSection({ groupId, isAdmin }: Props) {
  const { data, refetch } = useInvitedUsers(groupId);
  const { mutateAsync } = useDeleteGroupInvite(groupId);
  const toast = useToast();

  const handleClosePress = async (inviteId: number) => {
    Alert.alert(
      'Cancelar convite',
      'Deseja mesmo cancelar o convite para esse usuário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => handleDelete(inviteId),
        },
      ],
    );
  };

  const handleDelete = async (inviteId: number) => {
    try {
      await mutateAsync(inviteId);
      refetch();
      toast.success('Convidado removido com sucesso.');
    } catch (error) {
      toast.error('Erro ao remover convidado. Tente novamente.');
    }
  };

  if (!isAdmin) return null;

  return (
    <VStack>
      <InviteUserInput groupId={groupId} />
      <HStack alignItems="baseline">
        <Heading fontSize={16}>{data?.length}</Heading>
        <Text> convidados</Text>
      </HStack>

      <VStack space={4} mt={4}>
        {data?.map(user => (
          <InvitedUserItem
            key={user.id}
            user={user}
            onPress={() => handleClosePress(user.id)}
          />
        ))}
      </VStack>
    </VStack>
  );
}

function InviteUserInput({ groupId }: { groupId: number }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SendInvite>({
    resolver: zodResolver(sendInviteSchema),
  });

  const { mutateAsync } = useSendGroupInvite(groupId);
  const { refetch } = useInvitedUsers(groupId);
  const toast = useToast();

  const submitForm = async (data: SendInvite) => {
    try {
      await mutateAsync(data.email);
      refetch();
      toast.success('Convite enviado com sucesso.');
    } catch (error) {
      toast.error('Erro ao enviar convite. Tente novamente.');
    }
  };

  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { value, onChange } }) => (
        <Input
          value={value}
          onChangeText={onChange}
          placeholder="Convidar por e-mail"
          errorMessage={errors.email?.message}
          InputRightElement={
            <IconButton
              icon={<Icon as={Feather} name="send" />}
              rounded="full"
              onPress={() => handleSubmit(submitForm)()}
            />
          }
        />
      )}
    />
  );
}

type InvitedUserItemProps = {
  user: FetchInvitedUser;
  onPress: () => void;
};
function InvitedUserItem({ user, onPress }: InvitedUserItemProps) {
  return (
    <UserItem
      key={user.id}
      title={user.email}
      image=""
      ActionIcons={
        <IconButton
          rounded="full"
          icon={<Icon as={Feather} name="x" color="red.500" />}
          onPress={onPress}
        />
      }
    />
  );
}

type SendInvite = z.infer<typeof sendInviteSchema>;

const sendInviteSchema = z.object({
  email: z.string().email('E-mail inválido'),
});
