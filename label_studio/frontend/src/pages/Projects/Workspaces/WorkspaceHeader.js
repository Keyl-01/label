import React, { useCallback, useEffect } from "react";
import { IconAllProjects, IconEmptyFolder, IconGear } from "../../../assets/icons";
import { Button, Userpic } from "../../../components";
import { modal } from "../../../components/Modal/Modal";
import { Space } from "../../../components/Space/Space";
import { Userpics } from "../../../components_lse/Userpics/Userpics";
import { ABILITY } from "../../../config/PermissionsConfig";
import { useAPI } from "../../../providers/ApiProvider";
import { useCurrentUser } from "../../../providers/CurrentUser";
import { RestrictedAccess, useCheckPermission } from "../../../providers/PermissionProvider";
import { Elem } from "../../../utils/bem";
import { ProjectTemplatesPage } from "../../ProjectTemplates/SelectProjectTemplate";
import { WorkspaceMembers } from "./WorkspaceMembers";
import { WorkspaceModal } from "./WorkspaceModal";
import { FF_DEV_2629, isFF } from '../../../utils/feature-flags';
import { useMounted } from "../../../hooks/useMounted";
import { Tag } from "../../../components/Tag/Tag";
import { Tooltip } from "../../../components/Tooltip/Tooltip";

export const WorkspaceHeader = ({ fetchWorkspaces, workspace, empty, onCreateProject }) => {
  const { user } = useCurrentUser();
  // Ensure async tasks don't trigger state updates once they are torn down
  // can cause memory leaks, and throws errors
  const mounted = useMounted();
  const [members, setMembers] = React.useState([]);
  const api = useAPI();
  const hasPermission = useCheckPermission();
  const billingFlags = APP_SETTINGS.flags ?? {};

  const fetchMembers = useCallback(async () => {
    if (!workspace) return;
    if (!hasPermission(ABILITY.can_manage_workspaces)) return;

    const members = await api.callApi('workspaceMembers', {
      params: { pk: workspace.id },
      errorFilter(err){ return err.status === 404; },
    });

    if (mounted.current && members && !members.error) {
      setMembers(members.map(m => m.user));
    }
  }, [workspace]);

  useEffect(() => {
    setMembers([]);
    fetchMembers();

  }, [fetchMembers]);

  const onEditWorkspace = React.useCallback(() => {
    const onSubmit = async () => {
      await fetchWorkspaces();
      modalRef.close();
    };

    const onDelete = async () => {
      await api.callApi("deleteWorkspace", { params: { pk: workspace?.id }, errorFilter: () => false });
      await fetchWorkspaces();
      modalRef.close();
    };

    const modalRef = modal({
      allowClose: false,
      title: "Edit Workspace",
      closeOnClickOutside: true,
      style: { width: 580 },
      body: <WorkspaceModal
        workspace={workspace}
        empty={empty}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onClose={() => modalRef.close()}
      />,
    });
  }, [workspace]);

  const onEditMembers = async () => {
    const modalRef = modal({
      title: `Manage Members`,
      width: 640,
      height: 610,
      body: () => (
        <WorkspaceMembers
          workspace={workspace}
          onSave={() => { fetchMembers(); modalRef.close(); }}
        />
      ),
    });
  };

  const onUseTemplate = useCallback(() => {
    const modalRef = modal({
      title: `Use Template`,
      width: 440,
      body: () => (
        <ProjectTemplatesPage
          onClose={() => modalRef.close()}
          onSubmit={() => { fetchWorkspaces(); modalRef.close(); }}
          workspace={workspace}
        />
      ),
    });
  }, [workspace]);

  const workspaceIsManagable = billingFlags.manual_workspace_management && workspace && !workspace.is_personal && hasPermission(ABILITY.can_manage_workspaces);

  const header = (
    <Elem tag={Space} name="header" spread>
      <Elem tag={Space} name="meta" size="small">
        {workspace && (
          workspace.is_personal && user
            ? <Userpic user={user} size={36} />
            : <IconEmptyFolder width={36} height={32} color={workspace.color} />
        )}
        {!workspace && <IconAllProjects width={36} height={32} />}

        <Elem name="title">
          <span>{workspace?.title ?? "All Projects"}</span>
        </Elem>

        {isFF(FF_DEV_2629) && workspace?.is_personal && (
          <Tooltip title="This is your private space for drafts and experiments. Only you can see projects here.">
            <Tag>private</Tag>
          </Tooltip>
        )}

        <RestrictedAccess ability={ABILITY.can_change_projects} restrict={!workspaceIsManagable}>
          <Elem component={IconGear} onClick={onEditWorkspace} name="edit-workspace" />
        </RestrictedAccess>
      </Elem>

      <Elem tag={Space} name="controls" align="flex-end" size="small">
        <RestrictedAccess ability={ABILITY.can_change_projects}>
          {workspaceIsManagable && (
            <>
              {members && <Userpics users={members} showUsername/>}
              <Elem name="manage-members" component={Button} onClick={onEditMembers} size="compact">
                Manage Members
              </Elem>
            </>
          )}

          <Elem
            name="create-project"
            component={Button}
            onClick={onCreateProject}
            look="primary"
            size="compact"
          >
            Create Project
          </Elem>

          <Elem
            name="create-project"
            component={Button}
            onClick={onUseTemplate}
            look="primary"
            size="compact"
          >
            Use Template
          </Elem>
        </RestrictedAccess>
      </Elem>
    </Elem>
  );

  if (isFF(FF_DEV_2629)) return header;

  let phrase = "This is public workspace. You can move projects here via project settings or you can create a new one here.";

  if (workspace?.is_personal) phrase = "This is your private space for drafts and experiments. Only you can see projects here.";
  if (!workspace) phrase = "All projects to which you belong will be displayed here.";

  return (
    <>
      {header}
      {(empty || workspace?.is_personal) && (
        <Elem name="empty-message" mod={{ private: workspace?.is_personal }}>{phrase}</Elem>
      )}
    </>
  );
};
