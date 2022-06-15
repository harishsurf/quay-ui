import {
  Breadcrumb,
  BreadcrumbItem,
  Page,
  PageBreadcrumb,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core';
import {Link, useLocation} from 'react-router-dom';
import RepositoriesTab from './Tabs/RepositoriesTab/RepositoriesTab';
import {NavigationPath} from '../../NavigationPath';
import UsageLogsTab from './Tabs/UsageLogsTab';
import {useCallback, useState} from 'react';

export default function OrgScopedRepositories() {
  const location = useLocation();
  const repositoryName = location.pathname.split('/')[2];

  console.log('repositoryName', repositoryName);

  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const onTabSelect = useCallback(
    (
      _event: React.MouseEvent<HTMLElement, MouseEvent>,
      tabIndex: string | number,
    ) => setActiveTabKey(tabIndex),
    [],
  );

  const repositoriesSubNav = [
    {
      href: NavigationPath.orgScopedRepositoryTab,
      name: 'Repositories',
      component: <RepositoriesTab />,
    },
    {
      href: NavigationPath.usagelogs,
      name: 'Usage Logs',
      component: <UsageLogsTab />,
    },
  ];

  return (
    <Page>
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem data-testid="organization-breadcrumb" to="#">
            <Link to={NavigationPath.organizations}>Organizations</Link>
          </BreadcrumbItem>
          <BreadcrumbItem data-testid="repo-breadcrumb" to="#" isActive>
            {repositoryName}
          </BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>
      <PageSection variant={PageSectionVariants.light}>
        <Title data-testid="repo-title" headingLevel="h1">
          {repositoryName}
        </Title>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <Tabs activeKey={activeTabKey} onSelect={onTabSelect}>
          {repositoriesSubNav.map((nav, idx) => (
            <Tab
              key={idx}
              eventKey={idx}
              title={<TabTitleText>{nav.name}</TabTitleText>}
            >
              {nav.component}
            </Tab>
          ))}
        </Tabs>
      </PageSection>
    </Page>
  );
}
