import { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, State } from "../../redux";
import { DIFFICULTY } from "../../lib/sudoku";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "rgba(0,0,0,0)",
      boxShadow: "none",
      maxWidth: 600,
    },
    appBar: {
      paddingLeft: 0,
      paddingRight: 0,
      justifyContent: "space-between",
    },
    title: {
      fontSize: "24px",
      userSelect: "none",
      [theme.breakpoints.down(500)]: {
        fontSize: "17px",
      },
      [theme.breakpoints.down(330)]: {
        fontSize: "14px",
        paddingLeft: 0,
        marginRight: 0,
      },
    },
    menuButton: {
      paddingLeft: 10,
      marginRight: 5,
      fontSize: "17px",
      "&:hover": {
        color: "#ccc",
      },
      [theme.breakpoints.down(500)]: {
        fontSize: "14px",
        paddingLeft: 0,
        marginRight: 0,
      },
      [theme.breakpoints.down(330)]: {
        fontSize: "12px",
        paddingLeft: 0,
        marginRight: 0,
      },
    },
    difficulty: {
      width: "60px;",
      [theme.breakpoints.down(330)]: {
        width: "40px",
      },
    },
    buttonText: {
      marginLeft: "5px",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    menuItems: {
      display: "flex",
    },
  })
);

const Navbar = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch();
  const { createNewBoard, resetBoard, solveBoard, changeDifficulty } =
    bindActionCreators(actionCreators, dispatch);
  const { difficulty } = useSelector((state: State) => state.sudoku);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (difficulty: DIFFICULTY) => {
    changeDifficulty(difficulty);
    setAnchorEl(null);
  };

  return (
    <AppBar className={classes.root} position="static">
      <ToolBar className={classes.appBar}>
        <Typography variant="h6" className={classes.title}>
          SuDoKu.
        </Typography>
        <div className={classes.menuItems}>
          <Button
            onClick={createNewBoard}
            color="inherit"
            className={classes.menuButton}
          >
            New
            <span className={classes.buttonText}> Game</span>
          </Button>
          <Button
            onClick={resetBoard}
            color="inherit"
            className={classes.menuButton}
          >
            Reset
          </Button>
          <Button
            onClick={solveBoard}
            color="inherit"
            className={classes.menuButton}
          >
            Solve
          </Button>
          <Button
            onClick={handleClick}
            color="inherit"
            className={classes.menuButton}
          >
            <span className={classes.difficulty}>{difficulty}</span>
          </Button>

          <Menu
            keepMounted
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleClose(DIFFICULTY.EASY)}>
              Easy
            </MenuItem>
            <MenuItem onClick={() => handleClose(DIFFICULTY.MEDIUM)}>
              Medium
            </MenuItem>
            <MenuItem onClick={() => handleClose(DIFFICULTY.HARD)}>
              Hard
            </MenuItem>
          </Menu>
        </div>
      </ToolBar>
    </AppBar>
  );
};

export default Navbar;
