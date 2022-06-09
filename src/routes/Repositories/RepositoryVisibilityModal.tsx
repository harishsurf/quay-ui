import * as React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';

export const RepositoryVisibilityModal = (
  props: RepositoryVisibilityModalProps,
): JSX.Element => {
  const {isModalOpen, handleModalToggle, quayEndPoint} = props;

  const nameInputRef = React.useRef();

  const changeVisibilityHandler = async () => {
    handleModalToggle(); // check if this is needed
    await fetch(`${quayEndPoint.QUAY_HOSTNAME}/api/v1/organization/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${quayEndPoint.QUAY_OAUTH_TOKEN}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({}),
    }).then;
  };

  return (
    <Modal
      title="Make repositories public"
      variant={ModalVariant.large}
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          onClick={changeVisibilityHandler}
          form="modal-with-form-form"
        >
          Make public
        </Button>,
      ]}
    ></Modal>
  );
};

type RepositoryVisibilityModalProps = {
  isModalOpen: boolean;
  handleModalToggle?: () => void;
  quayEndPoint: {
    QUAY_OAUTH_TOKEN: string;
    QUAY_HOSTNAME: string;
  };
};
