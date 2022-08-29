import React from "react";
import { IconAllProjects, IconEmptyFolder } from "../../../assets/icons";
import { Button, Menu, Userpic } from "../../../components";
import { modal } from "../../../components/Modal/Modal";
import { ABILITY } from "../../../config/PermissionsConfig";
import { useCurrentUser } from "../../../providers/CurrentUser";
import { useCheckPermission } from "../../../providers/PermissionProvider";
import { cn } from "../../../utils/bem";
import { WorkspaceModal } from "./WorkspaceModal";

const rootClass = cn("workspaces-sidebar");

export const WorkspacesList = ({
  workspacesList,
  currentWorkspace,
  selectWorkspace,
  fetchWorkspaces,
}) => {
  const billingFlags = APP_SETTINGS.flags ?? {};
  const { user } = useCurrentUser();
  const hasPermission = useCheckPermission();
  const canEdit = billingFlags.manual_workspace_management && hasPermission(ABILITY.can_manage_workspaces);

  const onCreateWorkspace = React.useCallback(() => {
    const onSubmit = async () => {
      const workspaces = await fetchWorkspaces();

      modalRef.close();
      selectWorkspace(workspaces[workspaces.length - 1]);
    };

    const modalRef = modal({
      allowClose: false,
      title: "New Workspace",
      closeOnClickOutside: true,
      style: { width: 580 },
      body: <WorkspaceModal onSubmit={onSubmit} onClose={() => modalRef.close()} />,
    });
  }, []);

  const allProjects = (
    <Menu.Item
      key="all"
      className={rootClass.elem("item")}
      onClick={selectWorkspace.bind(null, null, true)}
      active={!currentWorkspace}
    >
      <IconAllProjects height={18} />
      All Projects
    </Menu.Item>
  );

  if (!workspacesList.length) return [allProjects];

  const item = (w) => (
    <Menu.Item key={w.id} className={rootClass.elem("item")} onClick={selectWorkspace.bind(null, w)} active={currentWorkspace?.id === w.id} title={w.title}>
      {user && w.is_personal
        ? <Userpic user={user} size={20}/>
        : <IconEmptyFolder width={20} height={18} color={w.color} />
      }
      <span className={rootClass.elem("title")}>{w.title}</span>
    </Menu.Item>
  );

  const header = (
    <div key="-" className={rootClass.elem("header")}>
      <span>Workspaces</span>
      {canEdit && <Button onClick={onCreateWorkspace}>+</Button>}
    </div>
  );

  const sandbox = workspacesList.find(w => w.is_personal);
  const rest = workspacesList.filter(w => w.id !== sandbox?.id);

  return [
    sandbox && canEdit && item(sandbox),
    allProjects,
    header,
    ...rest.map(item),
  ];
};
