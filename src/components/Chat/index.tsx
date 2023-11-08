import { AttachFile, Mic, MoreVertOutlined, Send, Stop } from '@mui/icons-material';
import { AppBar, Avatar, IconButton, Stack, Toolbar, Typography, Box, TextField } from '@mui/material';
import Lottie from 'react-lottie';
import './chat.scss';
import { useEffect, useState, Fragment, useRef } from "react";
import { User } from '../../types';
import { FormattedMessage, useIntl } from 'react-intl'; 
import { handleSendAudio, handleSendFile, handleSendImage, handleSendMessage } from '../../api/chat';
import { useUser } from '../../hooks/useUser';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../api/config';
import Message from '../Message';
import { useSnackbar } from "notistack";
import RecordAudio from '../RecordAudio';

interface UserChat {
    idUser: User | null;
    setOpenProfileContact: (value: boolean) => void;
  }

const Chat = ({idUser, setOpenProfileContact}: UserChat): JSX.Element => {

    const user = useUser()!;

    const [chat, setChat] = useState();

    const [isRecording, setIsRecording] = useState<boolean>(false);

    const [audio, setAudio] = useState<any>();

    const contMessages = useRef() as React.MutableRefObject<HTMLInputElement>;

    const { enqueueSnackbar } = useSnackbar();

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

    useEffect(() => {
        setMessage('');
        
        const getChat = () => {
            //@ts-ignore
           const unsub = onSnapshot(doc(db, "chats", user.id > idUser?.id ? user.id + idUser?.id  : idUser?.id  + user.id), (doc) => {
                //@ts-ignore
                setChat(doc.data());
            });

            return () => {
                unsub();
            };
        };

        idUser && getChat();
    
    }, [idUser])

    useEffect(() => {
        const timer = setTimeout(() => {
            contMessages.current.scrollIntoView({ behavior: 'smooth' })
        }, 1000);
        return () => clearTimeout(timer);
      }, [idUser]);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: require('../../assets/startChat.json'),
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      }

      const [message, setMessage] = useState<string>('');

      const intl = useIntl();

      const handleSendFileOrImage = async (e: React.ChangeEvent<any>) => {
        const fileReader = new FileReader();
        if (e.target.files[0].type.includes("image") || e.target.files[0].type.includes("video")) {
          if (fileReader && e.target.files.length) {
            try {
              fileReader.readAsArrayBuffer(e.target.files[0]);
              fileReader.onload = async function () {
                const imageData = fileReader.result;
                await handleSendImage(user, idUser! ,imageData, e.target.files[0]);
              };
            } catch (err) {
              return enqueueSnackbar(intl.formatMessage({id: 'errorUploadingImage'}), {
                variant: "error",
              });
            }
          }
        } else {
            try {
                fileReader.readAsArrayBuffer(e.target.files[0]);
                fileReader.onload = async function () {
                    const imageData = fileReader.result;
                    await handleSendFile(user, idUser! ,imageData, e.target.files[0]);
                };
            } catch (err) {
                return enqueueSnackbar(intl.formatMessage({id: 'errorUploadingFile'}), {
                    variant: "error",
                });
            }
        }
      };

      const handleSendVoice = async () => {
        setIsRecording(false);
        await handleSendAudio(user, idUser!, audio);
        setAudio(null);
      }

    return (
        <div>
            { idUser ? (
                <div className='cont-chat'>
                    <AppBar 
                        position="fixed" 
                        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, position: 'relative', backgroundColor: '#f6f6f6', borderBottom: '1px solid #e0e0e0' }} 
                        elevation={0}
                    >
                        <Toolbar>
                            <Stack direction="row" spacing={2} sx={{position: 'relative', width: '100%', alignItems: 'center', color: '#010101'}}>
                                <Avatar imgProps={{ referrerPolicy: "no-referrer" }} sx={{cursor: 'pointer'}} src={idUser?.image} onClick={() => setOpenProfileContact(true)}/>
                                <Typography noWrap sx={{maxWidth: '300pt', textOverflow: 'ellipsis'}}>
                                    {idUser?.name}
                                </Typography>
                            </Stack>
                        </Toolbar>
                    </AppBar>
                    {/* @ts-ignore */}
                    <div className='cont-messages'>
                        {/* @ts-ignore */}
                        {chat && chat?.messages.map((message, index) => (
                            // @ts-ignore
                            <div key={index + ""} style={ user.id !== message.userId ? { alignSelf: 'flex-start', maxWidth: '60%'} : { alignSelf: 'flex-end', maxWidth: '60%'}}>
                                <Message message={message}/>
                                {contMessages.current.scrollIntoView({ behavior: 'smooth' })}
                            </div>
                        ))}
                        <div ref={contMessages} style={{paddingBottom: '15pt'}}>
                            <Typography variant="body2" textAlign={"center"} color="grayText" sx={{marginTop: '30pt', marginBottom: '-30pt'}}>
                                <FormattedMessage 
                                    id="yourMessagesAreProtected"
                                    defaultMessage="The messages you send through Rooms are protected."
                                />
                            </Typography>
                        </div>
                    </div>
                    <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
                        <AppBar 
                            position='fixed'
                            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#f6f6f6', borderTop: '1px solid #e0e0e0', position: 'relative' }} 
                            elevation={0}
                        >
                            <Toolbar sx={{color: '#010101'}}>
                                <Stack direction="row" spacing={2} sx={{position: 'relative', width: '100%', alignItems: 'center'}}>
                                    { isRecording ? (
                                        <>
                                            <RecordAudio
                                                band={audio}
                                                onChange={(audio: any) => {
                                                    setAudio(audio);
                                                }}
                                                isRecording={isRecording}
                                                setIsRecording={setIsRecording}
                                            />
                                            <IconButton disabled={audio ? false : true} onClick={handleSendVoice} sx={{position: 'absolute', right: 0}}>
                                                <Send/>
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <label htmlFor={user.id}>
                                                <input
                                                accept="/*"
                                                style={{ display: "none" }}
                                                id={user.id}
                                                type="file"
                                                onChange={(e) => handleSendFileOrImage(e)}
                                                />
                                                <IconButton component="span">
                                                    <AttachFile sx={{rotate: '45deg', transform: 'rotateY(180deg)'}}/>
                                                </IconButton>
                                            </label>
                                            
                                            <TextField 
                                                autoComplete='off'
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                onKeyPress={(ev) => {
                                                    if (ev.key === 'Enter') {
                                                        if (message !== ""){
                                                            handleSendMessage(user, idUser, message);
                                                            setMessage("");
                                                            contMessages.current.scrollIntoView({ behavior: 'smooth' })
                                                        } 
                                                        ev.preventDefault();
                                                    }
                                                }}
                                                placeholder={intl.formatMessage({id: 'typeMessage'})}
                                                variant="standard"
                                                size='small' 
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: '5px',
                                                    width: '100%',
                                                    padding: '3pt',
                                                    transition: 'all .5s'
                                                }}
                                                InputProps={{
                                                    disableUnderline: true,
                                                    style: {
                                                        paddingTop: '3pt',
                                                        paddingLeft: '15pt',
                                                    },
                                                }}
                                            />
                                            {message !== '' ? (
                                                <IconButton onClick={
                                                    () => {
                                                        handleSendMessage(user, idUser, message);
                                                        setMessage("");
                                                        contMessages.current.scrollIntoView({ behavior: "smooth" });
                                                    }
                                                }>
                                                    <Send/>
                                                </IconButton>
                                            ) : (
                                                // @ts-ignore
                                                <IconButton 
                                                    onClick={() => setIsRecording(true)}
                                                >
                                                    <Mic/>
                                                </IconButton>
                                            )}
                                        </>
                                    )}
                                </Stack>
                            </Toolbar>
                        </AppBar>
                    </div>
                </div>
            ) : (
                <div className='container-empty'>
                    <div className='container-animation'>
                        <Box sx={{ width: "40%", mx: "auto", mt: '-20pt' }}>
                            <Lottie options={defaultOptions} loop />
                        </Box>
                        <Typography variant='h4' fontWeight={400} mb={2}>
                            {/* TO DO: CAMBIAR EL TITULO */}
                            Sup
                        </Typography>
                        <Typography variant='body1' fontWeight={400}>
                            <FormattedMessage 
                                id="roomsWebDescription"
                                defaultMessage="Send and receive messages from anywhere. What are you waiting for to start a chat?"
                            />
                        </Typography>
                    </div>
                </div>
            )}
        </div>
    );
  };
  
  export default Chat;