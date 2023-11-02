import {
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    TextField,
} from '@mui/material';
import {useState, useEffect} from 'react';
import { getUserByEmail } from '../api/user';
import { User } from '../types';
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from 'react-intl'; 

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  setId: (value: User | null) => void;
}

const AddContactDialog = (props: SimpleDialogProps) => {

  const { enqueueSnackbar } = useSnackbar();

  const { onClose, open, setId } = props;

  useEffect(() => {
    setEmail("");
    setDisabledActions(false);
  }, [open])

  const [email, setEmail] = useState<string>("");

  const intl = useIntl();

  const [disabledActions, setDisabledActions] = useState<boolean>(false)

  const startNewChat = async () => {
    setDisabledActions(true);
    const userChat = await getUserByEmail(email);
    if (!userChat) {
      setDisabledActions(false);
      return enqueueSnackbar(intl.formatMessage({id: 'thisEmailDoesntExist'}), { variant: "error" });
    } else {
        //@ts-ignore
        setId(userChat);
    }
    onClose();
  } 

  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage 
            id="startNewChat"
            defaultMessage="Start a new chat"
        />
      </DialogTitle>
      <DialogContent>
        <TextField 
          fullWidth
          label={intl.formatMessage({id: 'email'})}
          variant='standard'
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={disabledActions} color="secondary" onClick={onClose}>
          <FormattedMessage 
              id="cancel"
              defaultMessage="Cancel"
          />
        </Button>
        <Button disabled={disabledActions || !email} onClick={startNewChat}>
          <FormattedMessage 
              id="startChat"
              defaultMessage="Start a chat"
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddContactDialog;