import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { LsChevronLeft, LsChevronRight } from '../../assets/icons';
import { Button } from "../../components";
import { useModalControls } from '../../components/Modal/ModalPopup';
import { Space } from "../../components/Space/Space";
import { UsersList } from '../../components_lse/UsersList/UsersList';
import { useAPI } from '../../providers/ApiProvider';
import { Block, Elem } from "../../utils/bem";
import "./UserAssigner.styl";
import { ACTIONS, initialState, UserAssignerReducer } from './UserAssignerReducer';

export const UserAssigner = ({
  usersListTitle = "Members",
  selectedUsersListTitle = "To Be Assigned",
  usersListSubtitle,
  selectedUsersListSubtitle,
  showCount = ['selected'],
  canCancel = true,
  cancelButtonTitle = "Cancel",
  saveButtonTitle = "Save",
  usersDisabledMessage = null,
  selectedUsersDisabledMessage = null,
  usersLoader,
  // usersAssigner,
  displayRole = true,
  disabled = false,
  style,
}) => {
  const api = useAPI();

  const [usersState, dispatch] = useReducer(UserAssignerReducer, initialState);

  // const onSaveButtonClick = useCallback(async () => {
  //   await usersAssigner(usersState);

  //   dispatch({ type: ACTIONS.CLEANUP });
  // }, [api, dispatch, usersAssigner, usersState]);


  const fetchUsers = useCallback(async () => {
    const {
      rolesList,
      usersList,
      selectedUsersList,
    } = await usersLoader(usersState);

    dispatch({
      type: ACTIONS.LOAD_ROLES,
      payload: rolesList,
    });

    dispatch({
      type: ACTIONS.LOAD_USERS,
      payload: usersList,
    });

    dispatch({
      type: ACTIONS.LOAD_MEMBERS,
      payload: selectedUsersList,
    });
  }, [api, dispatch, usersLoader, usersState]);

  const onCheckUsers = useCallback((type, payload) => {
    dispatch({ type, payload });
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const memberIds = useMemo(() => usersState.members.map(u => u.id), [usersState.members]);

  return (
    <Block name="user-assigner" mod={{ disabled: disabled || usersState.loading }} style={style}>
      <Elem name="body">
        <UsersList
          title={usersListTitle}
          subtitle={usersListSubtitle}
          showCount={showCount?.includes("source")}
          disabledMessage={usersDisabledMessage}
          list={usersState.users.filter(u => !memberIds.includes(u.id))}
          onChange={selected => onCheckUsers(ACTIONS.CHECK_USERS, selected)}
          selected={usersState.checkedUsers}
          roles={usersState.roles}
          setRole={userRole => onCheckUsers(ACTIONS.SET_ROLES, userRole)}
          displayRole={displayRole}
        />

        <Elem name="movers">
          <Space direction="vertical" size="small">
            <Button
              style={{ width: 40, height: 80 }}
              icon={<LsChevronRight/>}
              disabled={usersState.checkedUsers.length === 0}
              onClick={() => dispatch({ type: ACTIONS.MOVE_USERS })}
            />
            <Button
              style={{ width: 40, height: 80 }}
              icon={<LsChevronLeft/>}
              disabled={usersState.checkedMembers.length === 0}
              onClick={() => dispatch({ type: ACTIONS.MOVE_MEMBERS })}
            />
          </Space>
        </Elem>

        <UsersList
          title={selectedUsersListTitle}
          subtitle={selectedUsersListSubtitle}
          list={usersState.members}
          disabledMessage={selectedUsersDisabledMessage}
          showCount={showCount?.includes("selected")}
          onChange={selected => onCheckUsers(ACTIONS.CHECK_MEMBERS, selected)}
          selected={usersState.checkedMembers}
          roles={usersState.roles}
          setRole={userRole => onCheckUsers(ACTIONS.SET_ROLES, userRole)}
          displayRole={displayRole}
        />
      </Elem>

      {/* {!disabled && (
        <Elem name="actions">
          <Space align="end">
            {modal && canCancel && (
              <Button onClick={() => modal.hide()}>
                {cancelButtonTitle}
              </Button>
            )}

            <Button
              primary
              onClick={onSaveButtonClick}
              disabled={!usersState.dirty}
            >
              {saveButtonTitle}
            </Button>
          </Space>
        </Elem>
      )} */}

    </Block>
  );
};
