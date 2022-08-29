import { FC } from "react";
import { Elem } from "../../../utils/bem";
import { ABILITY } from '../../../config/PermissionsConfig';
import { useCheckPermission } from '../../../providers/PermissionProvider';

export interface WorkspaceEmptyProps {
  projectFilter: 'all' | 'pinned_only' | 'exlude_pinned'
}

export const WorkspaceEmpty: FC<WorkspaceEmptyProps> = ({ projectFilter = 'all' }) => {
  const hasPermission = useCheckPermission();
  const canChangeProjects = hasPermission?.(ABILITY.can_change_projects);

  let phrase = "There are no visible projects.";

  if (canChangeProjects) {
    phrase = `There are no projects. Create a project by clicking the "Create Project" button or "Use Template" button.`;
  }

  if (projectFilter === 'pinned_only' && canChangeProjects)
    phrase = `No projects have been pinned. To pin a project, click the three horizontal dots (…) >> “Pin project”. Now, the pinned project is added to the top of the list and located as the first project.`;

  return (
    <Elem name="empty-workspace-message">{phrase}</Elem>
  );
};