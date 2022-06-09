export enum NavigationPath {
  // Side NAV
  home = '/',
  organizations = '/organizations',
  repositories = '/repositories',

  // Scoped Repositories Sub Nav
  orgScopedRepository = '/organizations/:reponame',
  orgScopedRepositoryTab = '/organizations/:reponame/repo',
  usagelogs = '/organizations/:reponame/logs',
  settings = '/organizations/:reponame/settings',
}
