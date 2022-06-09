import {
  Modal,
  ModalVariant,
  Button,
  Form,
  FormGroup,
  TextInput,
  Radio,
  SelectVariant,
  Select,
  SelectOption,
  Grid,
  Alert,
  FileUpload,
} from '@patternfly/react-core';
import {useRecoilValue} from 'recoil';
import {UserOrgs} from 'src/atoms/UserState';
import './css/CreateRepositoryModal.css';
import {createNewRepository} from 'src/resources/RepositoryResource';
import {useRef, useState} from 'react';

enum RepoInitializationType {
  EMPTY = 'EMPTY',
  DOCKERFILE = 'DOCKERFILE',
  GITHUB = 'GITHUB',
  BITBUCKET = 'BITBUCKET',
  GITLAB = 'GITLAB',
  CUSTOMGIT = 'CUSTOMGIT',
}

enum visibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export const CreateRepositoryModal = (
  props: CreateRepositoryModalProps,
): JSX.Element => {
  const {isModalOpen, handleModalToggle} = props;

  const userOrgs = useRecoilValue(UserOrgs);

  const [newRepository, setNewRepository] = useState({
    name: '',
    description: '',
  });
  const [currentNamespace, setCurrentNamespace] = useState({
    name: '',
    isDropdownOpen: false,
  });

  const [repoVisibility, setrepoVisibility] = useState(visibilityType.PUBLIC);
  const [initRepoType, setInitRepoType] = useState(
    RepoInitializationType.EMPTY,
  );

  const [dockerfileUpload, setDockerfileUpload] = useState({
    value: '',
    filename: '',
    isLoading: false,
  });

  const nameInputRef = useRef();

  const handleNameInputChange = (value) => {
    setNewRepository({...newRepository, name: value});
  };

  const handleRepoDescriptionChange = (value) => {
    setNewRepository({...newRepository, description: value});
  };

  const createRepositoryHandler = async () => {
    handleModalToggle(); // check if this is needed
    let visibility;
    repoVisibility === visibilityType.PUBLIC
      ? (visibility = 'public')
      : (visibility = 'private');
    console.log('currentNamespace.name', currentNamespace.name);
    await createNewRepository(
      currentNamespace.name,
      newRepository.name,
      visibility,
      newRepository.description,
      'image',
    );
  };

  const handleNamespaceSelection = (e, value) => {
    // console.log("e.target", e.target);
    console.log('value', value);
    setCurrentNamespace((prevState) => ({
      name: value,
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };

  const authAlert = () => (
    <Alert variant="info" title="Authorization needed" isInline>
      <p>
        {' '}
        You will be redirected to authorize for TBD Repository Push once the
        repository has been created{' '}
      </p>
    </Alert>
  );

  const planUpgradeAlert = () => (
    <Alert variant="warning" title="Plan upgrade needed" isInline>
      <p>
        In order to make this repository private under TBD, you will need to
        upgrade the namespace&apos;s plan.
        <br />
        <a href="#">Upgrade TBD plan</a>
      </p>
    </Alert>
  );

  const repoInitializationComponent = () => (
    <>
      <Radio
        isChecked={initRepoType === RepoInitializationType.EMPTY}
        name="Empty repository"
        onChange={() => setInitRepoType(RepoInitializationType.EMPTY)}
        label={
          <>
            <i className="fas fa-hdd" />
            &nbsp;(Empty repository)
          </>
        }
        id={RepoInitializationType.EMPTY}
        value={RepoInitializationType.EMPTY}
      />
      <br />
      <Radio
        isChecked={initRepoType === RepoInitializationType.DOCKERFILE}
        name="Initialize from a Dockerfile"
        onChange={() => setInitRepoType(RepoInitializationType.DOCKERFILE)}
        label={
          <>
            <i className="fas fa-file" />
            &nbsp;Initialize from a Dockerfile
          </>
        }
        id={RepoInitializationType.DOCKERFILE}
        value={RepoInitializationType.DOCKERFILE}
      />
      <br />
      <Radio
        isChecked={initRepoType === RepoInitializationType.GITHUB}
        name="Github"
        onChange={() => setInitRepoType(RepoInitializationType.GITHUB)}
        label={
          <>
            <i className="fab fa-github" />
            &nbsp;Link to a Github Repository Push
          </>
        }
        id={RepoInitializationType.GITHUB}
        value={RepoInitializationType.GITHUB}
      />
      <br />
      <Radio
        isChecked={initRepoType === RepoInitializationType.BITBUCKET}
        name="Bitbucket"
        onChange={() => setInitRepoType(RepoInitializationType.BITBUCKET)}
        label={
          <>
            <i className="fas fa-hdd" />
            &nbsp;Link to a Bitbucket Repository Push
          </>
        }
        id={RepoInitializationType.BITBUCKET}
        value={RepoInitializationType.BITBUCKET}
      />
      <br />
      <Radio
        isChecked={initRepoType === RepoInitializationType.GITLAB}
        name="Gitlab"
        onChange={() => setInitRepoType(RepoInitializationType.GITLAB)}
        label={
          <>
            <i className="fab fa-gitlab" />
            &nbsp;Link to a GitLab Repository Push
          </>
        }
        id={RepoInitializationType.GITLAB}
        value={RepoInitializationType.GITLAB}
      />
      <br />
      <Radio
        isChecked={initRepoType === RepoInitializationType.CUSTOMGIT}
        name="Custom Git"
        onChange={() => setInitRepoType(RepoInitializationType.CUSTOMGIT)}
        label={
          <>
            <i className="fas fa-hdd" />
            &nbsp;Link to a Custom Git Repository Push
          </>
        }
        id={RepoInitializationType.CUSTOMGIT}
        value={RepoInitializationType.CUSTOMGIT}
      />
      <br />
    </>
  );

  const fileUploadComponent = () => (
    <>
      <FileUpload
        id="simple-text-file"
        type="text"
        value={dockerfileUpload.value}
        filename={dockerfileUpload.filename}
        filenamePlaceholder="Drag and drop a file or upload one"
        onFileInputChange={(e, file) =>
          setDockerfileUpload({...dockerfileUpload, filename: file.name})
        }
        onDataChange={(value) =>
          setDockerfileUpload({...dockerfileUpload, value})
        }
        onTextChange={(value) =>
          setDockerfileUpload({...dockerfileUpload, value})
        }
        onReadStarted={() =>
          setDockerfileUpload({...dockerfileUpload, isLoading: true})
        }
        onReadFinished={() =>
          setDockerfileUpload({...dockerfileUpload, isLoading: false})
        }
        onClearClick={(e) =>
          setDockerfileUpload({...dockerfileUpload, filename: '', value: ''})
        }
        isLoading={dockerfileUpload.isLoading}
        browseButtonText="Upload"
        hideDefaultPreview
      />
      <p>
        Please select a Dockerfile or an archive (.tar.gz or .zip) containing a
        Dockerfile at the root directory.
      </p>
    </>
  );

  return (
    <Modal
      title="Create repository"
      variant={ModalVariant.large}
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          onClick={createRepositoryHandler}
          form="modal-with-form-form"
        >
          Create
        </Button>,
        <Button key="cancel" variant="link" onClick={handleModalToggle}>
          Cancel
        </Button>,
      ]}
    >
      <Form id="modal-with-form-form" maxWidth="750px">
        <Grid hasGutter md={4}>
          <FormGroup
            isInline
            label="Namespace"
            fieldId="modal-with-form-form-name"
          >
            <Select
              variant={SelectVariant.single}
              aria-label="Select Input"
              onToggle={() =>
                setCurrentNamespace((prevState) => ({
                  ...prevState,
                  isDropdownOpen: !prevState.isDropdownOpen,
                }))
              }
              onSelect={handleNamespaceSelection}
              isOpen={currentNamespace.isDropdownOpen}
              width="200px"
            >
              {userOrgs.map((orgs, idx) => (
                <SelectOption key={idx} value={orgs.name}></SelectOption>
              ))}
            </Select>
          </FormGroup>
          <FormGroup
            label="Repository name"
            isRequired
            fieldId="modal-with-form-form-name"
            isStack
          >
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-form-name"
              value={newRepository.name}
              onChange={handleNameInputChange}
              ref={nameInputRef}
            />
          </FormGroup>
        </Grid>
        <FormGroup
          label="Repository description"
          fieldId="modal-with-form-form-email"
        >
          <TextInput
            type="text"
            id="modal-with-form-form-name"
            name="modal-with-form-form-name"
            value={newRepository.description}
            onChange={handleRepoDescriptionChange}
            ref={nameInputRef}
          />
        </FormGroup>
        <FormGroup
          label="Repository visibility"
          fieldId="modal-with-form-form-email"
        >
          <Radio
            isChecked={repoVisibility === visibilityType.PUBLIC}
            name="Public"
            onChange={() => setrepoVisibility(visibilityType.PUBLIC)}
            label="Public"
            id={visibilityType.PUBLIC}
            value={visibilityType.PUBLIC}
            description="Anyone can see and pull from this repository. You choose who can push."
          />
          <br />
          <Radio
            isChecked={repoVisibility === visibilityType.PRIVATE}
            name="Private"
            onChange={() => setrepoVisibility(visibilityType.PRIVATE)}
            label="Private"
            id={visibilityType.PRIVATE}
            value={visibilityType.PRIVATE}
            description="You choose who can see,pull and push from/to this repository."
          />
          {repoVisibility === visibilityType.PRIVATE
            ? planUpgradeAlert()
            : null}
        </FormGroup>
        <FormGroup
          label="Initialize repository"
          fieldId="modal-with-form-form-email"
        >
          {repoInitializationComponent()}
          {initRepoType !== RepoInitializationType.EMPTY &&
          initRepoType !== RepoInitializationType.DOCKERFILE
            ? authAlert()
            : null}
          {initRepoType === RepoInitializationType.DOCKERFILE
            ? fileUploadComponent()
            : null}
        </FormGroup>
      </Form>
    </Modal>
  );
};

type CreateRepositoryModalProps = {
  isModalOpen: boolean;
  handleModalToggle?: () => void;
};
