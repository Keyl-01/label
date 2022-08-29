import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconChevronRight } from "../../assets/icons";
import { Space } from "../../components/Space/Space";
import { useAPI } from "../../providers/ApiProvider";
import { useCurrentUser } from "../../providers/CurrentUser";
import { useProject } from '../../providers/ProjectProvider';
import { Block, Elem } from "../../utils/bem";
import "./OrganizationSwitch.styl";

const useClickOutside = (targetElem, onClickOutside, options = {}) => {

  useEffect(() => {
    const clickHandler = (e) => {
      if (!targetElem) return;

      const exactMatch = e.target === targetElem;
      const nestedMatch = options.deep ? (targetElem.contains(e.target)) : exactMatch;

      if (exactMatch === false && nestedMatch === false) {
        onClickOutside(e);
      }
    };

    document.addEventListener('click', clickHandler, options?.eventOptions);

    return () => {
      document.removeEventListener('click', clickHandler, options?.eventOptions);
    };
  }, [targetElem, onClickOutside, options?.eventOptions]);

};

export const OrganizationSwitch = () => {
  const { user } = useCurrentUser();
  const api = useAPI();
  const root = useRef();
  const { invalidateCache } = useProject();
  const [oragnizations, setOrganizations] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const selectedOrg = useMemo(() => {
    return user ? (oragnizations ?? []).find(org => org.id === user.active_organization) : null;
  }, [user, oragnizations]);

  const selectable = useMemo(() => {
    return selectedOrg ? (oragnizations ?? []).filter(org => org.id !== selectedOrg.id) : [];
  }, [oragnizations, selectedOrg]);

  const fetchOrganizations = useCallback(async () => {
    if (api && user) {
      const result = await api.callApi("organizations");

      if (Array.isArray(result)) setOrganizations(result);
    }
  }, [api, user]);

  const swicthOrganization = useCallback(async (orgId) => {
    await api.callApi('updateUser', {
      params: {
        pk: user.id,
      },
      body: {
        active_organization: orgId,
      },
    });

    invalidateCache();
    location.href = "/";
  }, [selectable, user]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useClickOutside(root.current, (e) => {
    if (expanded) {
      e.stopPropagation();
      setExpanded(false);
    }
  }, {
    deep: true,
    eventOptions: {
      capture: true,
    },
  });

  return (selectedOrg && oragnizations.length > 1) ? (
    <Block ref={root} name="org-switch" mod={{ expanded }}>
      <Elem
        name="item"
        mod={{
          disabled: selectable.length === 0,
          active: expanded,
        }}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <Space spread>
          <Elem name="org">
            <Elem name="subtitle">Organization</Elem>
            {selectedOrg.title}
          </Elem>

          {selectable.length > 0 && (
            <Elem
              name="indicator"
              tag={IconChevronRight}
              mod={{ open: expanded }}
            />
          )}
        </Space>
      </Elem>

      {(expanded && selectable.length > 0) && (
        <Elem name="list">
          {selectable.map(org => {
            return (
              <Elem name="item" key={`org-${org.id}`} onClick={() => {
                swicthOrganization(org.id);
              }}>
                <Elem name="org-list">
                  {org.title}
                </Elem>
              </Elem>
            );
          })}
        </Elem>
      )}
    </Block>
  ) : null;
};
