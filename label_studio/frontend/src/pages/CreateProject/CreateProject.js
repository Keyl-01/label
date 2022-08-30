import React from 'react';
import { useHistory } from 'react-router';
import { Button, ToggleItems } from '../../components';
import { Modal } from '../../components/Modal/Modal';
import { Space } from '../../components/Space/Space';
import { useAPI } from '../../providers/ApiProvider';
import { cn } from '../../utils/bem';
import { ConfigPage } from './Config/Config';
import "./CreateProject.styl";
import { ImportPage } from './Import/Import';
import { useImportPage } from './Import/useImportPage';
import { useDraftProject } from './utils/useDraftProject';

import { useCurrentUser } from '../../providers/CurrentUser';
import { WorkspaceMembers } from "../Projects/Workspaces/WorkspaceMembers";
import { ACTIONS, initialState, UserAssignerReducer } from '../../components_lse/UserAssigner/UserAssignerReducer';
// onBlur={onSaveName}

const ProjectName = ({ name, setName, onSaveName, onSubmit, error, description, setDescription, status, setSatus, show = true, setMember }) => !show ? null :(
  <><form className={cn("project-name")} onSubmit={e => { e.preventDefault(); onSubmit(); }}>
    <div className="field field--wide">
      <label htmlFor="project_name">Module Name</label>
      <input name="name" id="project_name" value={name} onChange={e => setName(e.target.value)} />
      {error && <span className="error">{error}</span>}
    </div>
    <div className="field field--wide">
      <label htmlFor="project_description">Description</label>
      <textarea
        name="description"
        id="project_description"
        placeholder="Optional description of your project"
        rows="4"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
    </div>
    <div className="field field--wide">
      <label>Status</label>
      <div>
        <div style={{display: 'inline', marginRight: '48px'}}>
          <input
            type="radio"
            id="Active" 
            value="Active"
            checked={status === 'Active'} 
            onChange={e => setSatus(e.target.value)}
          />
          <label htmlFor="Active" >Active</label>
        </div>
        <div style={{display: 'inline'}}>
          <input 
            type="radio" 
            id="Inactive" 
            value="Inactive" 
            checked={status === 'Inactive'} 
            onChange={e => setSatus(e.target.value)}
          />
          <label htmlFor="Inactive">Inactive</label>
        </div>
      </div>
    </div>
    <div className="field field--wide">
    <WorkspaceMembers onSaveMembers={setMember}/>
    </div>
  </form>
  
  </>
);

export const CreateProject = ({ onClose }) => {
  const [step, setStep] = React.useState("name"); // name | import | config
  const [waiting, setWaitingStatus] = React.useState(false);

  const project = useDraftProject();
  const history = useHistory();
  const api = useAPI();

  const [name, setName] = React.useState("");
  const [error, setError] = React.useState();
  const [description, setDescription] = React.useState("");
  const [status, setSatus] = React.useState("Active");

  const [usersState, dispatch] = React.useReducer(UserAssignerReducer, initialState);
  // const [config, setConfig] = React.useState("<View></View>");

  React.useEffect(() => { setError(null); }, [name]);

  React.useEffect(() => { console.log('chotngudi', usersState.members); }, [usersState]);

  const onChangeMember = state => {
    // console.log('duma', state.members);
  }

  // const { user } = useCurrentUser();

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




  const { columns, uploading, uploadDisabled, finishUpload, pageProps } = useImportPage(project);

  const rootClass = cn("create-project");
  const tabClass = rootClass.elem("tab");
  const steps = {
    name: <span className={tabClass.mod({ disabled: !!error })}>Module Name</span>,
    // import: <span className={tabClass.mod({ disabled: uploadDisabled })}>Data Import</span>,
    // config: "Labeling Setup",
  };

  // name intentionally skipped from deps:
  // this should trigger only once when we got project loaded
  React.useEffect(() => project && !name && setName(project.name), [project]);

  const projectBody = React.useMemo(() => ({
    name: name,
    description
  }), [name, description]);

  const onCreate = React.useCallback(async () => {
    const imported = await finishUpload();
    if (!imported) return;

    console.log(project);

    setWaitingStatus(true);
    const response = await api.callApi('updateProject',{
      params: {
        pk: project.id,
      },
      body: projectBody,
    });
    setWaitingStatus(false);

    if (response !== null) {
      history.push(`/projects/${response.id}/data`);
    }
  }, [project, projectBody, finishUpload]);

  const onSaveName = async () => {
    if (error) return;
    const res = await api.callApi('updateProjectRaw', {
      params: {
        pk: project.id,
      },
      body: {
        name: name,
      },
    });
    if (res.ok) return;
    const err = await res.json();
    setError(err.validation_errors?.name);
  };

  const onDelete = React.useCallback(async () => {
    setWaitingStatus(true);
    if (project) await api.callApi('deleteProject', {
      params: {
        pk: project.id,
      },
    });
    setWaitingStatus(false);
    history.replace("/projects");
    onClose?.();
  }, [project]);

  console.log(usersState.members);


  // const abortController = useAbortController();
  // const [membersList, setMembersList] = React.useState([]);
  // const [networkState, setNetworkState] = React.useState(null);
  // const fetchMembers = async (page  = 1, pageSize = 30) => {
  //   setNetworkState('loading');
  //   abortController.renew(); // Cancel any in flight requests

  //   const requestParams = { page, page_size: pageSize };

  //   if (isFF(2575)) {
  //     requestParams.include = [
  //       "id",
  //       "firstName",
  //       "lastName",
  //       "email",
  //       "userName",
  //       "status"
  //     ].join(',');
  //   }

  //   const data = await api.callApi("projectMembers", {
  //     params: requestParams,
  //     ...(isFF(FF_DEV_2575) ? {
  //       signal: abortController.controller.current.signal,
  //       errorFilter: (e) => e.error.includes('aborted'), 
  //     } : null),
  //   });
  //   console.log(data);
  //   // console.log('count:', data.count);
  //   console.log('total:', data.total);
  //   console.log(data.items);

  //   setMembersList(data.items ?? []);
  //   setNetworkState('loaded');

  //   if (isFF(FF_DEV_2575) && data?.items?.length) {
  //     const additionalData = await api.callApi("projectMembers", {
  //       params: { ids: data?.items?.map(({ id }) => id).join(',') },
  //       signal: abortController.controller.current.signal,
  //       errorFilter: (e) => e.error.includes('aborted'), 
  //     });

  //     console.log('additionalData', additionalData);

  //     if (additionalData?.items?.length) {
  //       setMembersList(additionalData.items);
  //     }
  //   }
  // };

  // React.useEffect(() => {
  //   fetchMembers();
  // }, []);


  return (
    <Modal onHide={onDelete} fullscreen visible bare closeOnClickOutside={false}>
      <div className={rootClass}>
        <Modal.Header>
          <h1>Create Module</h1>
          <ToggleItems items={steps} active={step} onSelect={setStep} />

          <Space>
            <Button look="danger" size="compact" onClick={onDelete} waiting={waiting}>Delete</Button>
            <Button look="primary" size="compact" onClick={onCreate} waiting={waiting || uploading} disabled={!usersState.members.lenght || error}>Save</Button>
          </Space>
        </Modal.Header>
        <ProjectName
          name={name}
          setName={setName}
          error={error}
          onSaveName={onSaveName}
          onSubmit={onCreate}
          description={description}
          setDescription={setDescription}
          status={status}
          setSatus={setSatus}
          show={step === "name"}
          setMember={onChangeMember}
          // membersList={membersList}
        />
        {/* <ImportPage project={project} show={step === "import"} {...pageProps} /> */}
        {/* <ConfigPage project={project} onUpdate={setConfig} show={step === "config"} columns={columns} disableSaveButton={true} /> */}
      </div>
    </Modal>
  );
};
