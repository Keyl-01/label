import React, { useCallback, useContext } from 'react';
import { Button } from '../../components';
import { Form, Input, TextArea } from '../../components/Form';
import { RadioGroup } from '../../components/Form/Elements/RadioGroup/RadioGroup';
import { ProjectContext } from '../../providers/ProjectProvider';
import { Block } from '../../utils/bem';

export const GeneralSettings = () => {
  const {project, fetchProject} = useContext(ProjectContext);
  console.log('asdasd')

  const updateProject = useCallback(() => {
    if (project.id) fetchProject(project.id, true);
  }, [project]);

  const colors = [
    '#FFFFFF',
    '#F52B4F',
    '#FA8C16',
    '#F6C549',
    '#9ACA4F',
    '#51AAFD',
    '#7F64FF',
    '#D55C9D',
  ];

  const samplings = [
    {value: "Sequential", label: "Sequential", description: "Tasks are ordered by Data manager ordering"},
    {value: "Uniform", label: "Random", description: "Tasks are chosen with uniform random"},
  ];

  console.log(project)



  //   const fetchProjects = async (page  = currentPage, pageSize = defaultPageSize) => {
  //   setNetworkState('loading');
  //   abortController.renew(); // Cancel any in flight requests

  //   const requestParams = { page, page_size: pageSize };

  //   if (isFF(2575)) {
  //     requestParams.include = [
  //       'id',
  //       "name",
  //       "project",
  //       "status"
  //     ].join(',');
  //   }

  //   const data = await api.callApi("projects", {
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

  //   setTotalItems(data?.total ?? 1);
  //   setProjectsList(data.items ?? []);
  //   setNetworkState('loaded');

  //   if (isFF(FF_DEV_2575) && data?.items?.length) {
  //     const additionalData = await api.callApi("projects", {
  //       params: { ids: data?.items?.map(({ id }) => id).join(',') },
  //       signal: abortController.controller.current.signal,
  //       errorFilter: (e) => e.error.includes('aborted'), 
  //     });

  //     console.log('additionalData', additionalData);

  //     if (additionalData?.items?.length) {
  //       setProjectsList(additionalData.items);
  //     }
  //   }
  // };

  return (
    <div style={{width: 480}}>
      <Form
        action="updateProject"
        formData={{...project}}
        params={{pk: project.id}}
        onSubmit={updateProject}
      >
        <Form.Row columnCount={1} rowGap="32px">
          <Input
            name="name"
            label="Module Name"
            labelProps={{large: true}}
          />

          <TextArea
            name="description"
            label="Description"
            labelProps={{large: true}}
            style={{minHeight: 128}}
          />

          <RadioGroup name="color" label="Color" size="large" labelProps={{size: "large"}}>
            {colors.map(color => (
              <RadioGroup.Button key={color} value={color}>
                <Block name="color" style={{'--background': color}}/>
              </RadioGroup.Button>
            ))}
          </RadioGroup>

          <RadioGroup label="Task Sampling" labelProps={{size: "large"}} name="sampling" simple>
            {samplings.map(({value, label, description}) => (
              <RadioGroup.Button
                key={value}
                value={`${value} sampling`}
                label={`${label} sampling`}
                description={description}
              />
            ))}
          </RadioGroup>
        </Form.Row>

        <Form.Actions>
          <Form.Indicator>
            <span case="success">Saved!</span>
          </Form.Indicator>
          <Button type="submit" look="primary" style={{width: 120}}>Save</Button>
        </Form.Actions>
      </Form>
    </div>
  );
};

GeneralSettings.menuItem = "General";
GeneralSettings.path = "/";
GeneralSettings.exact = true;
