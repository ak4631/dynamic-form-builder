import * as React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import SoftBox from 'components/SoftBox';

const useModal = () => {
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState({
    title: 'Default Title',
    body: 'Default Body'
  });

  const makeModal = (title = 'Default Title', body = 'Default Body') => {
    setModalContent({ title, body });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const Modal = () => (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle>
        {modalContent.title} 
        <Button variant="text" onClick={closeModal} style={{ float: 'right', color: '#000000' }}>
          X
        </Button>
      </DialogTitle>
      <DialogContent>
        <SoftBox>
          {modalContent.body}
        </SoftBox>
      </DialogContent>
    </Dialog>
  );

  return { Modal, makeModal, closeModal };
};

export default useModal;