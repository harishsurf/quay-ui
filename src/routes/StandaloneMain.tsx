import {useEffect} from 'react';
import {Page} from '@patternfly/react-core';

import {Outlet, Route, Routes} from 'react-router-dom';

import OrgScopedRepositories from 'src/routes/Namespaces/OrgScopedRepositories/OrgScopedRepositories';
import Namespaces from 'src/routes/Namespaces/Namespaces';
import TeamMembershipTab from 'src/routes/Namespaces/OrgScopedRepositories/Tabs/TeamMembershipTab';
import {QuayHeader} from '../components/header/QuayHeader';
import {QuaySidebar} from '../components/sidebar/QuaySidebar';
import {getUser} from '../resources/UserResource';
import {useRecoilState} from 'recoil';
import {UserState} from '../atoms/UserState';
import {Overview} from './Overview/Overview';
import Repositories from './Repositories/Repositories';

export function StandaloneMain() {
  const [, setUserState] = useRecoilState(UserState);

  useEffect(() => {
    getUser().then((user) => setUserState(user));
  }, []);

  return (
    <Page
      header={<QuayHeader />}
      sidebar={<QuaySidebar />}
      style={{height: '100vh'}}
      isManagedSidebar
      defaultManagedSidebarIsOpen={true}
    >
      <Routes>
        <Route path={'/namespaces'} element={<Namespaces />}>
          {/* <Route path={":reponame"} element={<Repositories />} /> */}
        </Route>
        <Route
          path={'/namespaces/:namespaceName/*'}
          element={<OrgScopedRepositories />}
        />
        <Route path={'/repositories'} element={<Repositories />} />

        <Route path={'/overview'} element={<Overview />} />
        <Route
          path={'/namespaces/:repoName/team'}
          element={<TeamMembershipTab />}
        />
      </Routes>
      <Outlet />
    </Page>
  );
}
