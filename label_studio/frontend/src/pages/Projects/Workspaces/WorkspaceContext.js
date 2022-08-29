import { createContext, useContext } from "react";

export const WorkspaceContext = createContext([]);

export const useWorkspaces = () => {
  return useContext(WorkspaceContext)?.workspaces ?? [];
};
