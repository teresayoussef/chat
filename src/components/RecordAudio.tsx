import React, { useRef, useEffect } from "react";
import StopIcon from "@mui/icons-material/Stop";
import MicIcon from "@mui/icons-material/Mic";
import { IconButton, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { keyframes } from "@mui/system";
import { Delete } from "@mui/icons-material";

const blink = keyframes`
  0% {
    opacity: 0;
  }
  50%, {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

// @ts-ignore
const RecordAudio = ({ onChange, band, isRecording, setIsRecording }) => {
  const audioRef = useRef(null);
  const stopRef = useRef(null);
  const recRef = useRef(null);
  const deleteRef = useRef(null);
  // @ts-ignore
  let rec;
  // @ts-ignore
  const chunks = [];

  useEffect(() => {
    // @ts-ignore
    if (band?.length === 0) audioRef.current.controls = false;
  }, [band]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      isRecording && onStart()
    }, 1000);
    return () => clearTimeout(timer);
  }, [isRecording]);

  const getFileBlob = (url: any, cb: any) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener("load", function () {
      cb(xhr.response);
    });
    xhr.send();
  };

  const onStart = () => {
    // @ts-ignore
    stopRef.current.style.display = "block";
    // @ts-ignore
    recRef.current.style.display = "block";

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      rec = new MediaRecorder(stream);
      rec.start();

      // @ts-ignore
      chunks.splice(0, chunks.length);

      rec.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      rec.onstop = () => {
        // @ts-ignore
        const blob = new Blob(chunks, { type: "audio/mp3" });
        const blobURL = URL.createObjectURL(blob);

        // @ts-ignore
        if (rec) {
          stream.getAudioTracks().forEach((track) => {
            track.stop();
          });
        }

        // @ts-ignore
        getFileBlob(blobURL, (blob) => {
          onChange(blob);
        });
        // @ts-ignore
        audioRef.current.src = blobURL;
        // @ts-ignore
        audioRef.current.controls = true;
        // @ts-ignore
        stopRef.current.style.display = "none";
        // @ts-ignore
        recRef.current.style.display = "none";
        // @ts-ignore
        deleteRef.current.style.display = "block";
      };
    });
  };

  return (
    <>
      <div
        style={{
          display: "inline-flex",
          width: "100%",
        }}
      >
        <IconButton
          ref={stopRef}
          sx={{
            marginRight: "10pt",
            height: "40px",
            display: "none",
            marginTop: '8px',
          }}
          // @ts-ignore
          onClick={() => rec.stop()}
        >
          <StopIcon />
        </IconButton>
        <IconButton
          sx={{
            marginRight: "10pt",
            height: "40px",
            marginTop: '7px',
            animation: `${blink} 2s infinite ease`,
            display: "none",
          }}
          disabled
          ref={recRef}
        >
          <CircleIcon color="error" sx={{ fontSize: "18px" }} />
        </IconButton>
        <audio ref={audioRef} style={{ width: "100%", maxWidth: "200pt" }} />
        <IconButton
          ref={deleteRef}
          sx={{
            marginLeft: "10pt",
            height: "40px",
            marginTop: '7px',
            display: 'none',
          }}
          onClick={() => {
            setIsRecording(false);
            onChange(null);
          }}
        >
          <Delete sx={{ fontSize: "18px" }} />
        </IconButton>
      </div>
    </>
  );
};

export default RecordAudio;
