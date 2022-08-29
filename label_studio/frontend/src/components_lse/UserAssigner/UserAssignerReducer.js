import { unique } from "../../utils/helpers";

export const ACTIONS = {
  LOAD_USERS: 'load_users',
  CHECK_USERS: 'check_users',
  MOVE_USERS: 'move_users',
  LOAD_MEMBERS: 'load_members',
  CHECK_MEMBERS: 'check_members',
  MOVE_MEMBERS: 'move_members',
  CLEANUP: 'cleanup',
  LOAD_ROLES: 'load_roles',
  SET_ROLES: 'set_roles',
};

export const initialState = {
  dirty: false,
  loading: true,
  users: [],
  members: [],
  checkedUsers: [],
  initialMembers: [],
  checkedMembers: [],
  disabledMembers: [],
  roles: [],
};

export const UserAssignerReducer = (state = initialState, action) => {
  if (action.type === ACTIONS.LOAD_USERS) {
    action.payload = action.payload.map(u => {
      u.role = state.roles[0].id
      return u
    })

    return {
      ...state,
      loading: false,
      users: unique(action.payload, (a, b) => a.id === b.id),
    };
  } else if (action.type === ACTIONS.LOAD_MEMBERS) {
    const members = unique(action.payload, (a, b) => a.id === b.id);

    return {
      ...state,
      loading: false,
      members,
      initialMembers: members,
      disabledMembers: members.filter(m => m.disabled === true).map(m => m.id),
    };
  } else if (action.type === ACTIONS.CHECK_USERS) {
    return {
      ...state,
      checkedUsers: action.payload,
    };
  } else if (action.type === ACTIONS.CHECK_MEMBERS) {
    return {
      ...state,
      checkedMembers: action.payload.filter(m => !state.disabledMembers.includes(m)),
    };
  } else if (action.type === ACTIONS.MOVE_USERS) {
    const selected = state.users
      .filter(u => state.checkedUsers.includes(u.id));

    return {
      ...state,
      dirty: true,
      checkedUsers: [],
      members: [...state.members, ...selected],
    };
  } else if (action.type === ACTIONS.MOVE_MEMBERS) {
    const selected = state.members
      .filter(u => !state.checkedMembers.includes(u.id));

    return {
      ...state,
      dirty: true,
      checkedMembers: [],
      members: selected,
    };
  } else if (action.type === ACTIONS.CLEANUP) {
    return {
      ...state,
      dirty: false,
    };
  } else if (action.type === ACTIONS.LOAD_ROLES) {
    return {
      ...state,
      loading: false,
      roles: action.payload
    };
  } else if (action.type === ACTIONS.SET_ROLES) {
    const {userId, roleId} = action.payload

    console.log("userId", userId);
    console.log("roleId", roleId);

    for (var i in state.users) {
      if (state.users[i].id === userId) {
        state.users[i].role = roleId;
        console.log(state.users[i]);
        break; //Stop this loop, we found it!
      }
    }
    for (var i in state.members) {
      if (state.members[i].id === userId) {
        state.members[i].role = roleId;
        console.log(state.users[i]);
        break; //Stop this loop, we found it!
      }
    }

    return {
      ...state,
    };
  }

  return state;
};
