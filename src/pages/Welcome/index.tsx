import {useState, useEffect} from 'react';
import Login from '../Login';
import { motion } from "framer-motion";
import './welcome.scss';
import logo from '../../assets/roomslogo.png';
import banVideo from '../../assets/bannerVideo.mp4';
import { Fade } from '@mui/material';
import { FormattedMessage } from 'react-intl'; 

const Welcome = (): JSX.Element => {

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <div className='welcome-banner'>
        <video playsInline preload="true" autoPlay muted loop id="myVideo">
          {/* TO DO: CAMBIAR VIDEO */}
          <source src={banVideo} type="video/mp4"/>
        </video>
        {/* TO DO: CAMBIAR LOGO */}
        <img src={logo} className="logo-banner"/>
        <motion.button 
          className="button-banner"
          onClick={() => setOpen(true)}
          whileHover={{scale: 1.05, backgroundColor: '#fff', color: "#010101"}}
          whileTap={{scale: 0.95}}
        >
          <FormattedMessage 
            id="signIn"
            defaultMessage="Sign In"
          />
        </motion.button>
        <Fade in={true} timeout={1000}>
          <div className='text-banner'>
            <p className='subtitle-banner'>
              <FormattedMessage 
                id="slogan"
                defaultMessage="Every chat has a story."
              />
            </p>
          </div>
        </Fade>
      </div>
      <Login open={open} setOpen={setOpen}/>
    </div>
  );
};

export default Welcome;