import { ArrowBack } from "@mui/icons-material";
import { IconButton, Typography, Avatar, TextField } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { motion } from 'framer-motion';
import { FormattedMessage, useIntl } from 'react-intl'; 

export default function ProfileContactDrawer({ open, onOpen, onClose, user }: any) {

  const intl = useIntl();

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
                borderRadius: '50%',
                margin: 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}  
              initial={{ opacity: 0, scale: 0.3, height: 0 }}
              animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0, height: open ? '200px' : '100px' }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0, 0.71, 0.2, 1.01]
              }}
            >
              <Avatar imgProps={{ referrerPolicy: "no-referrer" }} sx={{cursor: 'pointer', margin: 'auto', width: '200px', height: '200px'}} src={user?.image ? user?.image : ""} />
            </motion.div>
          </div>
          <div style={{textAlign: 'center', marginTop: '10pt'}}>
            <Typography>
              {user?.email}
            </Typography>
          </div>
          <div style={{width: '100%', marginTop: '20pt', backgroundColor: '#fff', boxShadow: '0 4px 2px -2px rgba(0,0,0,0.1)', padding: '10pt', paddingLeft: '30pt', paddingRight: '30pt'}}>
              <Typography variant="body2" color="primary">
                <FormattedMessage 
                    id="name"
                    defaultMessage="Name"
                />
              </Typography>
              <TextField
                value={user?.name || ""}
                variant="standard"
                fullWidth
                disabled
                InputProps={{              
                    disableUnderline: true,
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

          <div style={{width: '100%', marginTop: '20pt', boxShadow: '0 4px 2px -2px rgba(0,0,0,0.1)', backgroundColor: '#fff', padding: '10pt', paddingLeft: '30pt', paddingRight: '30pt'}}>
              <Typography variant="body2" color="primary">
                <FormattedMessage 
                    id="information"
                    defaultMessage="Information"
                />
              </Typography>
              <TextField
                value={user?.info || intl.formatMessage({id: 'doesntHaveInfo'})}
                variant="standard"
                fullWidth
                disabled
                InputProps={{              
                  disableUnderline: true,
                }}
                sx={{
                  marginTop: '20pt',
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: user?.info ? "#000000" : "#bbb",
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