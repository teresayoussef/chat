import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {}

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#fff",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#682bd7",
    },
    secondary: {
      main: "#bd2e95",
    },
    error: {
      main: "#a37cf0",
    },
  },
});

export default theme;
