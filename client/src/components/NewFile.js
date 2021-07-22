import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { InputLabel } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import faker from "faker";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs({ addFile }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [users, setUsers] = React.useState(10000);

  const handleChange = (event) => {
    setUsers(event.target.value);
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const generateData = () => {
    return new Promise((res, rej) => {
      try {
        const dataArray = new Array(10000).fill().map((value, index) => {
          const firstName = faker.name.firstName();
          const lastName = faker.name.lastName();
          return {
            "S.No.": index,
            email: faker.internet.email(),
            firstName,
            lastName,
            city: faker.address.city(),
            address: faker.address.streetAddress(),
            phoneNumber: faker.phone.phoneNumber(),
            socialLink: `https://www.linkedin.com/${firstName}-${lastName}`,
          };
        });
        res(dataArray);
      } catch (err) {
        rej();
      }
    });
  };

  const sendData = async () => {
    try {
      setLoad(true);
      generateData().then((res) => {
        const data = res;
        axios
          .post(
            `http://localhost:5000/send-data`,
            { data: data },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            addFile({ name: res.data.fileName, date: new Date().toISOString().substring(0, 10) });
          });
      });
      setTimeout(() => {
        setLoad(false);
        handleClose();
      }, 10200);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleClickOpen}>
        Add
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <Backdrop className={classes.backdrop} open={load} onClick={handleClose}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Create New File
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Select Number of Users to Generate New File</Typography>
          <br />
          <InputLabel id="demo-simple-select-helper-label">Users</InputLabel>
          <Select value={users} onChange={handleChange} displayEmpty inputProps={{ "aria-label": "Without label" }}>
            <MenuItem value={1000}>1000</MenuItem>
            <MenuItem value={5000}>5000</MenuItem>
            <MenuItem value={10000}>10000</MenuItem>
          </Select>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={sendData} color="primary">
            Generate File
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
