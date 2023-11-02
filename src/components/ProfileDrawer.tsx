import { ArrowBack, Check, Edit } from "@mui/icons-material";
import { useState, useEffect } from 'react';
import { IconButton, Typography, Avatar, TextField, InputAdornment, Fab } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { motion } from 'framer-motion';
import { useUser } from "../hooks/useUser";
import { updateUser, uploadFiles } from "../api/user";
import { User } from "../types";
import { FormattedMessage, useIntl } from 'react-intl'; 
import { useSnackbar } from "notistack";


export default function ProfileDrawer({ open, onOpen, onClose }: any) {

  const user = useUser()!;

  const intl = useIntl();

  const [name, setName] = useState<string>(user.name);
  const [info, setInfo] = useState<string>(user.info);
  const [editName, setEditName] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<User>(user);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!open){
      setEditName(false);
      setEditInfo(false);
      setName(user.name);
      setInfo(user.info);
    }; 
  }, [open]);

  useEffect(() => {
    updateUser(newUser.id, newUser);
  }, [newUser]);

  const handleChangeField = (field: string, value: string)=> {
    setNewUser((previous) => ({ ...previous, [field]: value }));
  };

  const handleChangeName = () => {
    if (name !== "") {
      setEditName(false);
      handleChangeField("name", name);
    }
  }

  const handleChangeInfo = () => {
    setEditInfo(false);
    handleChangeField("info", info);
  }

  const handleChangeImage = async (e: React.ChangeEvent<any>) => {
    const fileReader = new FileReader();
    if (e.target.files[0].type.includes("image")) {
      if (fileReader && e.target.files.length) {
        try {
          fileReader.readAsArrayBuffer(e.target.files[0]);
          fileReader.onload = async function () {
            const imageData = fileReader.result;
            console.log(imageData);
            await uploadFiles(user.id, imageData);
          };
        } catch (err) {
          return enqueueSnackbar(intl.formatMessage({id: 'errorUploadingImage'}), {
            variant: "error",
          });
        }
      }
    } else {
      return enqueueSnackbar(intl.formatMessage({id: 'onlyImages'}), {
        variant: "error",
      });
    }
  };

  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        sx={{width: 400, zIndex: '9999'}}
        BackdropProps={{ invisible: true }}
        elevation={0}
      >
        <div style={{width: 400, backgroundColor: '#f6f6f6', height: '100vh'}}>
          <div style={{ backgroundColor: '#682bd7', height: 110, position: 'relative' }} > 
            <div style={{position: 'absolute', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '10pt', bottom: 0, marginBottom: '10pt'}}>
              <IconButton onClick={onClose} sx={{color: '#fff'}}>
                <ArrowBack/>
              </IconButton>
              <Typography variant="h6" sx={{fontWeight: '500', marginLeft: '20pt', color: '#fff'}}> 
                <FormattedMessage 
                    id="profile"
                    defaultMessage="Profile"
                />
              </Typography>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '20pt'}}>
            <motion.div
              style={{
                width: '200px',
                height: '200px',
                margin: 'auto',
                borderRadius: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                position: 'relative',
              }}  
              initial={{ opacity: 0, scale: 0.3, height: 0 }}
              animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0, height: open ? '200px' : '100px' }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0, 0.71, 0.2, 1.01]
              }}
            >
              <Avatar imgProps={{ referrerPolicy: "no-referrer" }} sx={{cursor: 'pointer', margin: 'auto', width: '200px', height: '200px'}} src={user.image ? user.image : ""} />
              <label htmlFor={user.id}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id={user.id}
                  type="file"
                  onChange={(e) => handleChangeImage(e)}
                />
                <Fab component="span" size="small" color="primary" sx={{position: 'absolute', bottom: 0, right: 0, margin: '10px'}}>
                  <Edit fontSize="small"/>
                </Fab>
              </label>
            </motion.div>
          </div>
          <div style={{textAlign: 'center', marginTop: '10pt'}}>
            <Typography>
              {user.email}
            </Typography>
          </div>
          <div style={{width: '100%', marginTop: '20pt', backgroundColor: '#fff', boxShadow: '0 4px 2px -2px rgba(0,0,0,0.1)', padding: '10pt', paddingLeft: '30pt', paddingRight: '30pt'}}>
              <Typography variant="body2" color="primary">
                <FormattedMessage 
                    id="yourName"
                    defaultMessage="Your name"
                />
              </Typography>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="standard"
                fullWidth
                disabled={ editName ? false : true}
                InputProps={{
                  
                  disableUnderline: editName ? false : true,
                  endAdornment: (
                      <InputAdornment position="end">
                          { editName ? <Check color={name === "" ? "disabled" : "inherit"} fontSize="small" sx={{cursor: 'pointer'}} onClick={handleChangeName}/> : <Edit fontSize="small" sx={{cursor: 'pointer'}} onClick={() => setEditName(true)}/>}
                      </InputAdornment>
                  ),
              }}
                sx={{
                  marginTop: '20pt',
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000000",
                    borderBottom: 'none',
                  },
                }}
              />
          </div>
          <div style={{textAlign: 'center', marginTop: '10pt'}}>
            <Typography variant="caption">
              <FormattedMessage 
                    id="thisNameWillBeVisible"
                    defaultMessage="This name will be visible to your Rooms contacts."
                />
            </Typography>
          </div>

          <div style={{width: '100%', marginTop: '20pt', boxShadow: '0 4px 2px -2px rgba(0,0,0,0.1)', backgroundColor: '#fff', padding: '10pt', paddingLeft: '30pt', paddingRight: '30pt'}}>
              <Typography variant="body2" color="primary">
                <FormattedMessage 
                    id="information"
                    defaultMessage="Information"
                />
              </Typography>
              <TextField
                value={info}
                placeholder={intl.formatMessage({id: 'typeSomething'})}
                onChange={(e) => setInfo(e.target.value)}
                variant="standard"
                fullWidth
                disabled={ editInfo ? false : true}
                InputProps={{
                  
                  disableUnderline: editInfo ? false : true,
                  endAdornment: (
                      <InputAdornment position="end">
                          { editInfo ? <Check fontSize="small" sx={{cursor: 'pointer'}} onClick={handleChangeInfo}/> : <Edit fontSize="small" sx={{cursor: 'pointer'}} onClick={() => setEditInfo(true)}/>}
                      </InputAdornment>
                  ),
              }}
                sx={{
                  marginTop: '20pt',
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000000",
                    borderBottom: 'none',
                  },
                }}
              />
          </div>

        </div>
      </SwipeableDrawer>
    </>
  );
}