import './menu.scss';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useUser } from '../../hooks/useUser';
import { signOut } from '../../api/auth';
import Divider from '@mui/material/Divider';
import { Badge, IconButton, InputAdornment, Popover, TextField, Typography, Tooltip } from '@mui/material';
import { Clear, FilterList, Chat, MoreVertOutlined, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import ProfileDrawer from '../ProfileDrawer';
import { User } from '../../types';
import AddContactDialog from '../AddContactDialog';
import ProfileContactDrawer from '../ProfileContactDrawer';
import { FormattedMessage, useIntl } from 'react-intl'; 
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../api/config';

interface UserChat {
    idUser: User | null;
    setId: (value: User | null) => void;
    openProfileContact: boolean;
    setOpenProfileContact: (value: boolean) => void;
  }

const Menu = ({idUser, setId, openProfileContact, setOpenProfileContact}: UserChat): JSX.Element => {

    const [chats, setChats] = useState([]);

    const user = useUser()!;

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", user.id), (doc) => {
                //@ts-ignore 
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };

        user.id && getChats();
    }, [user.id]);

    const [onFocusInput, setOnFocusInput] = useState<boolean>(false);

    const [filterChat, setFilterChat] = useState<string>("");

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    
    const [openDrawerProfile, setOpenDrawerProfile] = useState<boolean>(false);

    const [openDialogContact, setOpenDialogContact] = useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    const intl = useIntl();

    function padTo2Digits(num: any) {
        return num.toString().padStart(2, '0');
      }
      
      function formatDate(date: any) {
        return [
          padTo2Digits(date.getDate()),
          padTo2Digits(date.getMonth() + 1),
          date.getFullYear(),
        ].join('/');
      }
  
    return (
        <>
            <ProfileDrawer
                open={openDrawerProfile}
                onOpen={() => setOpenDrawerProfile(true)}
                onClose={() => setOpenDrawerProfile(false)}
            />
            <ProfileContactDrawer 
                open={openProfileContact}
                onOpen={() => setOpenProfileContact(true)}
                onClose={() => setOpenProfileContact(false)}
                user={idUser}
            />
            <AddContactDialog 
                open={openDialogContact}
                onClose={() => setOpenDialogContact(false)}
                setId={setId}
            />
            <AppBar 
                position="fixed" 
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, width: 400, position: 'relative', backgroundColor: '#f6f6f6', borderRight: '1px solid #e0e0e0' }} 
                elevation={0}
            >
                <Toolbar>
                    <Stack direction="row" spacing={2} sx={{position: 'relative', width: '100%'}}>
                        <Avatar imgProps={{ referrerPolicy: "no-referrer" }} sx={{cursor: 'pointer'}} src={user.image ? user.image : ""} onClick={() => setOpenDrawerProfile(true)} />
                        <Tooltip title={intl.formatMessage({id: 'newChat'})}>
                            <IconButton sx={{position: 'absolute', right: 50}} onClick={() => setOpenDialogContact(true)}>
                                <Chat/>
                            </IconButton>
                        </Tooltip>
                        <IconButton aria-describedby={id} onClick={handleClick} sx={{position: 'absolute', right: 0}}>
                            <MoreVertOutlined/>
                        </IconButton>
                    </Stack>
                </Toolbar>
                <Popover
                    id={id}
                    open={openPopover}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    >
                        <List>
                            <ListItem  
                                disablePadding 
                                dense
                            >
                                <ListItemButton onClick={signOut}>
                                    <ListItemText primary={intl.formatMessage({id: 'signOut'})}/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                </Popover>
                <Toolbar sx={{boxShadow: onFocusInput ? '0 4px 2px -2px rgba(0,0,0,0.1)' : '', transition: 'all .3s', backgroundColor: '#fff', borderTop: '1px solid #dcdcdc', borderBottom: '1px solid #dcdcdc'}}>
                    <Stack direction="row" spacing={2} justifyContent="center" >
                        <TextField 
                            autoComplete='off'
                            onFocus={() => setOnFocusInput(true)}
                            onBlur={() => setOnFocusInput(false)}
                            placeholder={intl.formatMessage({id: 'searchChat'})}
                            variant="standard"
                            value={filterChat}
                            onChange={e => setFilterChat(e.target.value)}
                            size='small' 
                            sx={{
                                backgroundColor: '#f6f6f6',
                                borderRadius: '5px',
                                width: '260pt',
                            }}
                            InputProps={{
                                disableUnderline: true,
                                style: {
                                    fontSize: "10pt",
                                    paddingTop: '3pt',
                                    paddingLeft: '10pt',
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize='small' sx={{marginTop: '-2px', marginRight: '15pt', transition: 'all .3s', color: onFocusInput ? "#682bd7" : ""}}/>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        { filterChat && <Clear onClick={() => setFilterChat("")} fontSize='small' sx={{cursor: 'pointer', marginRight: '5pt', marginTop: '-2px'}}/>}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                width: 400,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 400, boxSizing: 'border-box' },
                }}
            >
                <Toolbar/>
                <Toolbar/>
                <Box sx={{ overflow: 'auto', border: 'none', marginTop: '-8px'}}>
                    <List>
                        {/* @ts-ignore */}
                        {chats && Object.entries(chats)?.sort((a,b) => b[1].date?.toDate() - a[1].date?.toDate()
                        ).filter((data)=>{
                            if(filterChat == ""){
                              return data
                            } //@ts-ignore
                            else if (data[1].userInfo.name.toLowerCase().includes(filterChat.toLowerCase())){
                              return data
                            }
                          }).map((chat, index) => (
                        <div key={index+""}>
                            <ListItem 
                                // @ts-ignore
                                onClick={() => setId(chat[1].userInfo)}
                                disablePadding 
                                // @ts-ignore
                                sx={{position: 'relative', backgroundColor: idUser?.id === chat[1].userInfo.id ? "#eee" : ""}}
                            >
                                <ListItemButton>
                                    {/* @ts-ignore */}
                                    { chat[1].date ? (
                                        <Typography variant='caption' sx={{position: 'absolute', right: 0, top: 0, margin: '10px'}}>
                                            {
                                            // @ts-ignore
                                            formatDate(chat[1].date?.toDate()) === formatDate((new Date)) ?
                                            // @ts-ignore
                                            chat[1].date?.toDate().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) :
                                            // @ts-ignore
                                            formatDate(chat[1].date?.toDate())
                                            } 
                                        </Typography>
                                    ) : (
                                        <Typography variant='caption' sx={{position: 'absolute', right: 0, top: 0, margin: '10px'}}>
                                            {
                                            (new Date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                            } 
                                        </Typography>
                                    )}
                                    <ListItemIcon>
                                    {/* @ts-ignore */}
                                    <Avatar imgProps={{ referrerPolicy: "no-referrer" }} src={chat[1].userInfo.image ? chat[1].userInfo.image : ""} />
                                    </ListItemIcon>
                                    {/* @ts-ignore */}
                                    <ListItemText primary={chat[1].userInfo.name} secondary={chat[1].lastMessageIdUser === user.id ? "✓ " + chat[1].lastMessage : chat[1].lastMessage}
                                        sx={{
                                            maxWidth: 260
                                        }}
                                        primaryTypographyProps={{
                                            style: {
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }
                                        }}
                                        secondaryTypographyProps={{
                                            style: {
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider sx={{backgroundColor: '#f6f6f6'}} variant="inset" component="li" />
                        </div>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
  };
  
  export default Menu;