import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownToggleCheckbox,
  KebabToggle,
  Page,
  PageSection,
  PageSectionVariants,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import * as React from 'react';
import {useRecoilValue} from 'recoil';
import {UserOrgs} from 'src/atoms/UserState';
import {fetchAllRepos, IRepository} from 'src/resources/RepositoryResource';
import {CreateRepositoryModal} from './CreateRepositoryModal';
import {DeleteRepositoryModal} from './DeleteRepositoryModal';

export default function Repositories() {
  const [isCreateRepoModalOpen, setCreateRepoModalOpen] = React.useState(false);
  const [isSelectDropDownOpen, setSelectDropDownOpen] = React.useState(false);
  const [isKebabOpen, setKebabOpen] = React.useState(false);
  const [repositoryList, setRepositoryList] = React.useState<
    RepositoryListProps[]
  >([]);

  const [repositorySearchInput, setRepositorySearchInput] =
    React.useState('Filter by name..');

  const [deleteKebabOption, setDeleteKebabOption] = React.useState({
    isModalOpen: false,
  });

  const userOrgs = useRecoilValue(UserOrgs);

  const handleDeleteModalToggle = () => {
    setDeleteKebabOption((prevState) => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  const handleRepoDeletion = () => {
    setKebabOpen(!isKebabOpen);
    handleDeleteModalToggle();
    // TODO: ADD API calls for bulk/ selected repo deletion
  };

  const dummy = () => {
    setRepositoryList(repositoryList); // dummy line added to fix compilation
  };
  console.log(dummy);

  const selectDropdownItems = [
    <DropdownItem key="Select all">Select all</DropdownItem>,
    <DropdownItem key="Select none">Select none</DropdownItem>,
  ];

  const kebabItems = [
    <DropdownItem key="delete" onClick={handleRepoDeletion}>
      Delete
    </DropdownItem>,
    <DropdownItem key="Make public">Make public</DropdownItem>,
    <DropdownItem key="Make private">Make private</DropdownItem>,
    <DropdownItem key="Set team permissions">
      Set team permissions
    </DropdownItem>,
  ];

  const columnNames = {
    repoName: 'Name',
    visibility: 'Visibility',
    tags: 'Tags',
    size: 'Size',
    pulls: 'Pulls',
    lastPull: 'Last Pull',
    lastModified: 'Last Modified',
  };

  const handleFilteredSearch = (value: any) => {
    setRepositorySearchInput(value);
  };

  // React.useEffect(() => {
  //   let userRepositories;

  //   async function fetchRepos() {
  //     let listOfOrgNames = [];
  //     if (userOrgs) {
  //       userOrgs.map((org) => listOfOrgNames.push(org.name));
  //       try {
  //         userRepositories = await fetchAllRepos(listOfOrgNames);
  //         console.log("userRepositories:", userRepositories)
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }
  //   }

  //   fetchRepos();
  //   userRepositories?.data.repositories.map((repo: IRepository) => {
  //     setRepositoryList((prevRepos) => [
  //       ...prevRepos,
  //       {
  //         name: repo.name,
  //         visibility: repo.is_public,
  //         tags: 1,
  //         size: "1.1GB",
  //         pulls: 108,
  //         lastPull: "TBA",
  //         lastModified: "TBA",
  //       },
  //     ]);
  //   });
  // }, []);

  React.useEffect(() => {
    async function fetchRepos() {
      const listOfOrgNames = [];
      if (userOrgs) {
        userOrgs.map((org) => listOfOrgNames.push(org.name));
        try {
          await fetchAllRepos(listOfOrgNames).then((resp) => {
            console.log('resp', resp);
            resp.map((r) =>
              r?.data.repositories.map((repo: IRepository) => {
                setRepositoryList((prevRepos) => [
                  ...prevRepos,
                  {
                    name: repo.name,
                    visibility: repo.is_public,
                    tags: 1,
                    size: '1.1GB',
                    pulls: 108,
                    lastPull: 'TBA',
                    lastModified: 'TBA',
                  },
                ]);
              }),
            );
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    fetchRepos();
  }, [userOrgs]);

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} hasShadowBottom>
        <div className="co-m-nav-title--row">
          <Title headingLevel="h1">Repositories</Title>
        </div>
      </PageSection>

      <PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem variant="bulk-select">
                <Dropdown
                  onSelect={() => setSelectDropDownOpen(!isSelectDropDownOpen)}
                  toggle={
                    <DropdownToggle
                      id="stacked-example-toggle"
                      splitButtonItems={[
                        <DropdownToggleCheckbox
                          id="example-checkbox-1"
                          key="split-checkbox"
                          aria-label="Select all"
                        />,
                      ]}
                      onToggle={() =>
                        setSelectDropDownOpen(!isSelectDropDownOpen)
                      }
                    />
                  }
                  isOpen={isSelectDropDownOpen}
                  dropdownItems={selectDropdownItems}
                />
              </ToolbarItem>
              <ToolbarItem>
                <TextInput
                  isRequired
                  type="search"
                  id="modal-with-form-form-name"
                  name="search input"
                  value={repositorySearchInput}
                  onChange={handleFilteredSearch}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="primary"
                  onClick={() => setCreateRepoModalOpen(true)}
                >
                  Create Repository
                </Button>
                {isCreateRepoModalOpen ? (
                  <CreateRepositoryModal
                    isModalOpen={isCreateRepoModalOpen}
                    handleModalToggle={() =>
                      setCreateRepoModalOpen(!isCreateRepoModalOpen)
                    }
                  />
                ) : null}{' '}
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  onSelect={() => setKebabOpen(!isKebabOpen)}
                  toggle={
                    <KebabToggle
                      onToggle={() => setKebabOpen(!isKebabOpen)}
                      id="toggle-id-6"
                    />
                  }
                  isOpen={isKebabOpen}
                  isPlain
                  dropdownItems={kebabItems}
                />
                {deleteKebabOption.isModalOpen ? (
                  <DeleteRepositoryModal
                    handleModalToggle={handleDeleteModalToggle}
                    handleRepoDeletion={handleRepoDeletion}
                    isModalOpen={deleteKebabOption.isModalOpen}
                  />
                ) : null}
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          <TableComposable aria-label="Selectable table">
            <Thead>
              <Tr>
                <Th
                // select={{
                //   onSelect: (_event, isSelecting) =>
                //     selectAllNamespaces(isSelecting),
                //   isSelected: areAllNamespacesSelected,
                // }}
                />
                <Th>{columnNames.repoName}</Th>
                <Th>{columnNames.visibility}</Th>
                <Th>{columnNames.tags}</Th>
                <Th>{columnNames.size}</Th>
                <Th>{columnNames.pulls}</Th>
                <Th>{columnNames.lastPull}</Th>
                <Th>{columnNames.lastModified}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {repositoryList.map((repo, idx) => {
                <Tr key={idx}>
                  <Td dataLabel={columnNames.repoName}> {repo.name} </Td>
                  <Td dataLabel={columnNames.visibility}>{repo.visibility}</Td>
                  <Td dataLabel={columnNames.tags}>TBA</Td>
                  <Td dataLabel={columnNames.size}>TBA</Td>
                  <Td dataLabel={columnNames.pulls}>TBA</Td>
                  <Td dataLabel={columnNames.lastPull}>TBA</Td>
                  <Td dataLabel={columnNames.lastModified}>TBA</Td>
                </Tr>;
              })}
              {/* <Tr>
                <Td dataLabel={columnNames.repoName} />
                <Td dataLabel={columnNames.visibility}>TBA</Td>
                <Td dataLabel={columnNames.tags}>TBA</Td>
                <Td dataLabel={columnNames.size}>TBA</Td>
                <Td dataLabel={columnNames.pulls}>TBA</Td>
                <Td dataLabel={columnNames.lastPull}>TBA</Td>
                <Td dataLabel={columnNames.lastModified}>TBA</Td>
              </Tr> */}
            </Tbody>
          </TableComposable>
        </PageSection>
      </PageSection>
    </Page>
  );
}

type RepositoryListProps = {
  name: string;
  visibility: boolean;
  tags: number;
  size: string;
  pulls: number;
  lastPull: string;
  lastModified: string;
};
