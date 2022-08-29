import { useCallback, useMemo, useState, useEffect } from "react";
// import { getUserRole, RoleMapping } from "../../providers/PermissionProvider";
import { Block, Elem } from "../../utils/bem";
import { isDefined, reverseMap, userDisplayName } from "../../utils/helpers";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { Input } from "../../components/Form";
import { Userpic } from "../../components/Userpic/Userpic";
import "./UsersList.styl";

import { Select } from '../../components/Form'

export const UsersList = ({
  title,
  subtitle,
  list,
  selected,
  onChange,
  showCount,
  disabledMessage = null,
  canCheck = true,
  roles,
  setRole,
  displayRole = true,
}) => {
  const onChangeRole = (userId, roleId) => {

    setRole({userId, roleId})
  }

  const [searchTerm, setSearchTerm] = useState("");
  const indeterminate = useMemo(() => {
    return selected.length && (selected.length !== list.length);
  }, [selected, list]);

  const checked = useMemo(() => {
    return selected.length && (selected.length === list.length);
  }, [selected, list]);

  const onSelected = useCallback((e, user, all = false) => {
    if (all) {
      onChange((!checked || indeterminate) ? list.map(u => u.id) : []);
    } else {
      const checkedIds = new Set(selected);

      if (e.target.checked) {
        checkedIds.add(user.id);
      } else {
        checkedIds.delete(user.id);
      }

      onChange(Array.from(checkedIds));
    }
  }, [selected, checked, list]);

  const listFilter = useCallback((user) => {
    if (!searchTerm) {
      return true;
    } else {
      const tester = new RegExp(searchTerm, 'ig');
      console.log('tester', tester);
      const nameMatch = !!user.firstName.match(tester) || !!user.lastName.match(tester);
      const emailMatch = !!user.email?.match(tester);
      const usernameMatch = !!user.userName?.match(tester);

      return nameMatch || emailMatch || usernameMatch;
    }
  }, [searchTerm]);

  const finalUsersList = useMemo(() => {
    const enabled = [];
    const disabled = [];

    (list ?? []).filter(listFilter).forEach(u => {
      if (u.disabled === true) {
        disabled.push(u);
      } else {
        enabled.push(u);
      }
    });

    return { enabled, disabled };
  }, [list, listFilter]);

  const userRenderer = useCallback((user) => {
    // const fullName = userDisplayName(user);

    return (
      <Elem
        tag={UserItem}
        name="item"
        canCheck={canCheck}
        key={`user-${user.id}`}
        disabled={user.disabled}
        onChange={(e) => onSelected(e, user)}
        checked={selected.includes(user.id)}
      >
        <Userpic user={user}/>
        <Elem name="info">
          {(user.firstName && user.lastName) && (
            <Elem name="line">
              {/* <Elem name="name">{fullName.replace(/@([.]+)/i, '')}</Elem> */}
              {/* <Elem name="name">{user.firstName} {user.lastName}</Elem> */}
              <Elem name="name">{user.userName}</Elem>
            </Elem>
          )}
          {/* <Elem name="line">
            <Elem name="email">{user.userName}</Elem>
          </Elem> */}
          
          <Elem name="line">
            <Elem name="email">{user.email}</Elem>

            {displayRole && roles.length && (
              <Elem name="role">
                <UserRole roleList={roles} role={user.role} onChange={r => onChangeRole(user.id, r)} />
              </Elem>
            )}
          </Elem>

        </Elem>
      </Elem>
    );
  }, [canCheck, displayRole, selected, roles.length]);

  return (
    <Block name="users-list">
      <Elem name="header">
        <Elem name="title">
          {title}
          <Elem name="subtitle">{subtitle}</Elem>
        </Elem>
        {showCount && <Elem name="count">{list.length}</Elem>}
      </Elem>
      <Elem name="list">
        <Elem name="toolbar"
          tag={UserItem}
          canCheck={canCheck}
          checked={checked}
          indeterminate={indeterminate}
          onChange={(e) => onSelected(e, null, true)}
          single
        >
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ghost
          />
        </Elem>

        <Elem name="items">
          {finalUsersList.enabled.map(userRenderer)}

          {(finalUsersList.disabled.length > 0) && (
            <>
              <Elem name="disabled-message">
                {disabledMessage ?? "Users below are disabled"}
              </Elem>
              {finalUsersList.disabled.map(userRenderer)}
            </>
          )}
        </Elem>
      </Elem>
    </Block>
  );
};

const UserItem = ({
  checked,
  indeterminate,
  onChange,
  children,
  className,
  canCheck = true,
  single = false,
  disabled = false,
}) => {
  return (
    <Block name="users-list-item" tag="label" mix={className} mod={{ single, disabled }}>
      {canCheck && (
        <Elem name="leading">
          {(disabled !== true) && (
            <Checkbox
              onChange={onChange}
              checked={checked}
              indeterminate={indeterminate}
            />
          )}
        </Elem>
      )}
      <Elem name="content">
        {children}
      </Elem>
    </Block>
  );
};

const UserRole = ({ roleList, role, onChange }) => {
  return (
    // <div className="field field--wide">
      // {/* <label>{role}</label> */}
      <Select value={role} onChange={e => onChange(e.target.value)}
        options={roleList.map(r => ({
          value: r.id,
          label: r.name,
        }))}
        style={{ 'borderRightWidth': '0px' }}
      />
    // </div>
  )
};
