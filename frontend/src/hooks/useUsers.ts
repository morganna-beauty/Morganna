'use client';

import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useProtectedActions } from './useProtectedActions';
import { usersApi } from '@/lib';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types';
import { USERS_QUERY_KEY } from '@/lib/constants/queryKeys';

export function useUsers() {
  const queryClient = useQueryClient();
  const { withAdminAuth } = useProtectedActions();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[], Error>({
    queryKey: USERS_QUERY_KEY,
    queryFn: usersApi.getUsers,
  });

  const createUser = useCallback(
    (newUserData: CreateUserRequest) => {
      const protectedAction = withAdminAuth(async () => {
        const newUser = await usersApi.createUser(newUserData);

        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });

        return newUser;
      });

      return protectedAction();
    },
    [queryClient, withAdminAuth]
  );

  const updateUser = useCallback(
    (userId: number, updatedUserData: UpdateUserRequest) => {
      const protectedAction = withAdminAuth(async () => {
        const updatedUser = await usersApi.updateUser(userId, updatedUserData);

        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });

        return updatedUser;
      });

      return protectedAction();
    },
    [queryClient, withAdminAuth]
  );

  const deleteUser = useCallback(
    (userId: number) => {
      const protectedAction = withAdminAuth(async () => {
        await usersApi.deleteUser(userId);

        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      });

      return protectedAction();
    },
    [queryClient, withAdminAuth]
  );

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
  }, [queryClient]);

  return useMemo(
    () => ({
      users,
      loading: isLoading,
      error,
      createUser,
      updateUser,
      deleteUser,
      refetch,
    }),
    [users, isLoading, error, createUser, updateUser, deleteUser, refetch]
  );
}
