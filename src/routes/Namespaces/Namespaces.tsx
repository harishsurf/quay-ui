import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import {
  Button,
  TextInput,
  Page,
  PageSection,
  PageSectionVariants,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Select,
  SelectOption,
  SelectVariant,
  SelectGroup,
} from '@patternfly/react-core';

import './css/Namespaces.scss';
import {CreateNamespaceModal} from './CreateNamespaceModal';
import {Link, useNavigate} from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import {AuthState} from 'src/atoms/AuthState';
import {UserOrgs} from 'src/atoms/UserState';
import {deleteOrg} from 'src/resources/OrganisationResource';
import {useEffect, useState} from 'react';

export default function Namespaces() {
  const [namespacesList, setNamespacesList] = useState<NamespaceListProps[]>(
    [],
  );
  const [isNamespaceModalOpen, setNamespaceModalOpen] = useState(false);
  const [namespaceSearchInput, setNamespaceSearchInput] = useState(
    'Filter by name or ID..',
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedNamespace, setSelectedNamespace] = useState<string[]>([]);

  const userOrgs = useRecoilValue(UserOrgs);

  const columnNames = {
    name: 'Namespace',
    repoCount: 'Repo Count',
    tagCount: 'Tags',
    size: 'Size',
    pulls: 'Pulls (Activity)',
    lastPull: 'Last Pull',
    lastModified: 'Last Modified',
  };

  const handleModalToggle = () => {
    setNamespaceModalOpen(!isNamespaceModalOpen);
  };

  const handleFilteredSearch = (value: any) => {
    setNamespaceSearchInput(value);
  };

  const onSelect = () => {
    // TODO: Add filter logic
  };

  // Logic for handling all ns checkbox selections from <Th>
  const selectAllNamespaces = (isSelecting = true) => {
    setSelectedNamespace(
      isSelecting ? namespacesList.map((ns) => ns.name) : [],
    );
  };

  const areAllNamespacesSelected =
    selectedNamespace.length === namespacesList.length;

  // Logic for handling row-wise checkbox selection in <Td>
  const isNamespaceSelected = (ns: NamespaceListProps) =>
    selectedNamespace.includes(ns.name);

  const setNamespaceChecked = (ns: NamespaceListProps, isSelecting = true) =>
    setSelectedNamespace((prevSelected) => {
      const otherSelectedNamespaceNames = prevSelected.filter(
        (r) => r !== ns.name,
      );
      return isSelecting
        ? [...otherSelectedNamespaceNames, ns.name]
        : otherSelectedNamespaceNames;
    });

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  const onSelectNamespace = (
    currentNamespace: NamespaceListProps,
    rowIndex: number,
    isSelecting: boolean,
  ) => {
    // If the user is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(
              new Array(numberSelected + 1),
              (_x, i) => i + recentSelectedRowIndex,
            )
          : Array.from(
              new Array(Math.abs(numberSelected) + 1),
              (_x, i) => i + rowIndex,
            );
      intermediateIndexes.forEach((index) =>
        setNamespaceChecked(namespacesList[index], isSelecting),
      );
    } else {
      setNamespaceChecked(currentNamespace, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShifting(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (userOrgs) {
      userOrgs.map((org: any) => {
        setNamespacesList((prevNamespaces) => [
          ...prevNamespaces,
          {
            name: org.name,
            repoCount: 1,
            tagCount: 1,
            size: '1.1GB',
            pulls: 108,
            lastPull: 'TBA',
            lastModified: 'TBA',
          },
        ]);
      });
    }
  }, [userOrgs]);

  const onDelete = async () => {
    console.log('Delete clicked');
    const x = selectedNamespace?.forEach(async (nsToBeDeleted) => {
      try {
        await deleteOrg(nsToBeDeleted);
        setNamespacesList((prev) =>
          prev.filter((ns) => ns.name !== nsToBeDeleted),
        );
      } catch (e) {
        console.error(e);
      }
    });
  };

  const options = [
    <SelectGroup label="Role" key="group1">
      <SelectOption key={0} value="Public" />
      <SelectOption key={1} value="Private" />
    </SelectGroup>,
  ];

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} hasShadowBottom>
        <div className="co-m-nav-title--row">
          <Title headingLevel="h1">Namespace</Title>
        </div>
      </PageSection>

      <PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem spacer={{default: 'spacerNone'}}>
                <Select
                  variant={SelectVariant.checkbox}
                  aria-label="Select Input"
                  onToggle={() => setFilterOpen(!filterOpen)}
                  onSelect={onSelect}
                  // selections={selected}
                  isOpen={filterOpen}
                  placeholderText="Filter"
                  // aria-labelledby={titleId}
                >
                  {options}
                </Select>
              </ToolbarItem>
              {/* try for search field
              <ToolbarItem variant='search-filter' className="co-filter-search--full-width"></ToolbarItem>  */}
              <ToolbarItem>
                <TextInput
                  isRequired
                  type="search"
                  id="modal-with-form-form-name"
                  name="search input"
                  value={namespaceSearchInput}
                  onChange={handleFilteredSearch}
                />
              </ToolbarItem>
              <ToolbarItem>
                {' '}
                <Button
                  isDisabled={selectedNamespace.length === 0 ? true : false}
                  variant="primary"
                  className="pf-c-button pf-m-plain"
                  type="button"
                  // aria-label={t('notification-drawer~Close')}
                  onClick={onDelete}
                >
                  <i className="fas fa-trash"></i>{' '}
                </Button>
              </ToolbarItem>
              <ToolbarItem alignment={{xl: 'alignRight'}}>
                <Button
                  variant="primary"
                  onClick={() => setNamespaceModalOpen(true)}
                >
                  Create Namespace
                </Button>
                {isNamespaceModalOpen ? (
                  <CreateNamespaceModal
                    isModalOpen={isNamespaceModalOpen}
                    handleModalToggle={handleModalToggle}
                  />
                ) : null}{' '}
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          <TableComposable aria-label="Selectable table">
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_event, isSelecting) =>
                      selectAllNamespaces(isSelecting),
                    isSelected: areAllNamespacesSelected,
                  }}
                />
                <Th>{columnNames.name}</Th>
                <Th>{columnNames.repoCount}</Th>
                <Th>{columnNames.tagCount}</Th>
                <Th>{columnNames.size}</Th>
                <Th>{columnNames.pulls}</Th>
                <Th>{columnNames.lastPull}</Th>
                <Th>{columnNames.lastModified}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {namespacesList.map((ns, rowIndex) => (
                <Tr key={ns.name}>
                  <Td
                    select={{
                      rowIndex,
                      onSelect: (_event, isSelecting) =>
                        onSelectNamespace(ns, rowIndex, isSelecting),
                      isSelected: isNamespaceSelected(ns),
                    }}
                  />
                  <Td dataLabel={columnNames.name}>
                    <Link to={`${ns.name}`}>{ns.name}</Link>
                    {/* <Link to={'namespaces/builds'}> {ns.name} </Link> */}
                  </Td>
                  <Td dataLabel={columnNames.repoCount}>{ns.repoCount}</Td>
                  <Td dataLabel={columnNames.tagCount}>{ns.tagCount}</Td>
                  <Td dataLabel={columnNames.size}>{ns.size}</Td>
                  <Td dataLabel={columnNames.pulls}>{ns.pulls}</Td>
                  <Td dataLabel={columnNames.lastPull}>{ns.lastPull}</Td>
                  <Td dataLabel={columnNames.lastModified}>
                    {ns.lastModified}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </PageSection>
      </PageSection>
    </Page>
  );
}

type NamespaceListProps = {
  name: string;
  repoCount: number;
  tagCount: number;
  size: string;
  pulls: number;
  lastPull: string;
  lastModified: string;
};
