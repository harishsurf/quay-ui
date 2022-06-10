export enum NavigationPath {
  // Side NAV
  home = '/',
  overview = '/overview',
  search = '/search',
  namespace = '/namespaces',
  repositories = '/repositories',

  // Repositories Nav
  orgScopedRepositories = '/namespaces/:reponame',
  repositoriesTab = '/namespaces/:reponame/repo',
  teamMembershipTab = '/namespaces/:reponame/team',
  robotAccountTab = '/namespaces/:reponame/robotacct',
  defaultPermissionsTab = '/namespaces/:reponame/permissions',
  oauth = '/namespaces/:reponame/oauth',
  usagelogs = '/namespaces/:reponame/logs',
  settings = '/namespaces/:reponame/settings',
}
