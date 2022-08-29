import React from 'react';
import { useAPI } from '../../../providers/ApiProvider';

export const useDraftProject = () => {
  const api = useAPI();
  const [project, setProject] = React.useState();

  const fetchDraftProject = React.useCallback(async () => {
    const response = await api.callApi('projects');

    // always create the new one
    const projects = response?.items ?? [];
    const lastIndex = projects.length;
    let projectNumber = lastIndex + 1;
    let projectName = `New Module #${projectNumber}`;

    // dirty hack to get proper non-duplicate name
    while(projects.find(({ name }) => name === projectName)) {
      projectNumber++;
      projectName = `New Module #${projectNumber}`;
    }

    // const draft = await api.callApi('createProject', {
    //   body: {
    //     name: projectName,
    //   },
    // });

    // if (draft) setProject(draft);
  }, []);

  React.useEffect(() => {
    fetchDraftProject();
  }, []);

  return project;
};
