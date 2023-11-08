import { useState } from 'react';
import Chat from '../../components/Chat';
import Menu from '../../components/Menu';
import { User } from '../../types';
import './home.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppBar, Avatar, IconButton, Stack, Toolbar, Typography, Box, TextField } from '@mui/material';
import Lottie from 'react-lottie';
import { FormattedMessage } from 'react-intl';

const Home = (): JSX.Element => {

  const [userChat, setUserChat] = useState<User | null>(null);

  const [openProfileContact, setOpenProfileContact] = useState<boolean>(false);

  const matches = useMediaQuery('(min-width:800px)');

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../../assets/startChat.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

    return (
      <>
        { matches ?
          (
            <div className='container-home'>
              <Menu idUser={userChat} setId={setUserChat} openProfileContact={openProfileContact} setOpenProfileContact={setOpenProfileContact}/>
              <div className='container-chat'>
                <Chat idUser={userChat} setOpenProfileContact={setOpenProfileContact}/>
              </div>
            </div>
          ) 
          : 
          (
            <div className='container-empty'>
                <div className='container-animation'>
                    <Box sx={{ width: "40%", mx: "auto", mt: '-20pt' }}>
                        <Lottie options={defaultOptions} loop />
                    </Box>
                    <Typography variant='h4' fontWeight={400} mb={2}>
                        {/* TO DOñ CAMBIAR NOMBRE */}
                        Sup
                    </Typography>
                    <Typography variant='body1' fontWeight={400}>
                        <FormattedMessage 
                            id="roomsDesktop"
                            defaultMessage="We're sorry, but the app is only available for desktop version."
                        />
                    </Typography>
                </div>
            </div>
          )
        }
      </>
    );
  };
  
  export default Home;