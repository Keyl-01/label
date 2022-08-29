import { useCallback } from 'react';
import { UserAssigner } from '../../../components_lse/UserAssigner/UserAssigner';
import { useAPI } from '../../../providers/ApiProvider';
import { useCurrentUser } from '../../../providers/CurrentUser';
import "../../DataManager/UserAssigner.styl";

export const WorkspaceMembers = () => {
  const api = useAPI();
  const { user } = useCurrentUser();

  // const onSaveMembers = useCallback(async (state) => {
  //   const params = {
  //     pk: 1, // Test
  //   };

  //   const initial = state.initialMembers.map(u => u.id);

  //   for (const user of state.members.filter(u => !initial.includes(u.id))) {
  //     const body = { user: user.id };

  //     await api.callApi("setWorkspaceMembers", { params, body });
  //   }

  //   const currentIds = state.members.map(u => u.id);

  //   for (const id of initial.filter(id => !currentIds.includes(id))) {
  //     const body = { user: id };

  //     await api.callApi("deleteWorkspaceMembers", { params, body });
  //   }

  //   // @todo errors handling
  //   // onSave?.();
  // }, [api]);

  const fetchUsers = useCallback(async () => {
    const rolesList = (await api.callApi("projectRoles", {
      params: { page_size: -1 },
    }))?.data?.roles?.map(( role ) => {
      console.log(role);
      return role
    });

    const usersList = (await api.callApi("projectMembers", {
      params: { page_size: -1 },
    }))?.items?.map(( user ) => {
      console.log(user);
      return user
    });

    // const usersList = users?.map(( user ) => user);
    // console.log('WorkspaceMembers', usersList);

    const members = []?.map(( user ) => user.id);

    return {
      rolesList,
      usersList,
      selectedUsersList: usersList.filter(u => members.includes(u.id)),
    };
  }, [api, user]);

  return (
    <UserAssigner
      usersListTitle="User"
      usersListSubtitle="Members"
      selectedUsersListTitle='Module'
      selectedUsersListSubtitle="Members"
      usersLoader={fetchUsers}
      // usersAssigner={onSaveMembers}
    />
  );
};
