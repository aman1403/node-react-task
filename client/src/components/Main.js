import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Typography, AppBar, Toolbar, Paper, Grid, Box, Container, Fab, Zoom } from "@material-ui/core";

import Tables from "./Tables";
import NewFile from "./NewFile";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

export default function Main(props) {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const cachedRows = JSON.parse(localStorage.getItem("files"));
    console.log(cachedRows);
    if (cachedRows?.length > 0) {
      console.log(cachedRows);
      setRows(cachedRows);
    }
  }, []);

  const addFile = (newFile) => {
    console.log(newFile);
    console.log(rows);
    setRows((prevRows) => {
      return [...prevRows, newFile];
    });

    const oldFiles = JSON.parse(localStorage.getItem("files"));

    if (oldFiles?.length > 0) {
      localStorage.setItem("files", JSON.stringify([...oldFiles, newFile]));
    } else {
      localStorage.setItem("files", JSON.stringify([newFile]));
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar style={{ padding: "0px 25px" }}>
          <Typography variant="h6">Renter-Buyer</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
        <Box my={2}>
          <Paper elevation={0} style={{ padding: "30px", backgroundColor: "#FAFAFA" }}>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h5">Your Files : :</Typography>
              </Grid>
              <Grid item>
                <NewFile addFile={addFile} />
              </Grid>
            </Grid>
            <Tables rows={rows} />
          </Paper>
        </Box>
      </Container>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
