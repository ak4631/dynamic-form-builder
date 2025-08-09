import { useToasts } from 'react-toast-notifications';

const useNotify = () => {
  const { addToast } = useToasts();

  const notify = (message, type = "e", timeout = "5") => {
    timeout = timeout * 1000;
    switch(type) {
      case 'e':
        type = "error";
        break;
      case 's':
        type = "success";
        break;
      case 'w':
        type = "warning";
        break;
      case 'i':
        type = "info";
        break;
    }
    addToast(message, { appearance: type, autoDismiss: true, autoDismissTimeout : timeout });
  };

  return notify;
};

export default useNotify;