import React from 'react';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import { WebhookPage } from '../WebhookPage/WebhookPage';
import { DangerZone } from './DangerZone';
import { GeneralSettings } from './GeneralSettings';
import { InstructionsSettings } from './InstructionsSettings';
import { LabelingSettings } from './LabelingSettings';
import { MachineLearningSettings } from './MachineLearningSettings/MachineLearningSettings';
import { StorageSettings } from './StorageSettings/StorageSettings';


export const MenuLayout = ({children, ...routeProps}) => {
  // const fetchProjects = async (page  = currentPage, pageSize = defaultPageSize) => {
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
    <SidebarMenu
      menuItems={[
        GeneralSettings,
        LabelingSettings,
        InstructionsSettings,
        MachineLearningSettings,
        StorageSettings,
        WebhookPage,
        DangerZone,
      ]}
      path={routeProps.match.url}
      children={children}
    />
  );
};

export const SettingsPage = {
  title: "Settings",
  path: "/settings",
  exact: true,
  layout: MenuLayout,
  component: GeneralSettings,
  pages: {
    InstructionsSettings,
    LabelingSettings,
    MachineLearningSettings,
    StorageSettings,
    WebhookPage,
    DangerZone,
  },
};
