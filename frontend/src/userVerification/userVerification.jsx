import { useTheme } from "@emotion/react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import CenterCircularProgress from "../common/centerLoader";
import { getUsersList, sendVerfication } from "./apis";

const buttonColumnStyle = {
    display: "flex",
    justifyContent: "space-between",
};

const UserVerification = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [verifyUser, setVerifyUser] = useState(0);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        // console.log(user);
        updateUsersList();

        return () => {
            setOpenDialog(false);
            setVerifyUser(0);
            setUserId(null);
            setUserName(null);
        };
    }, []);

    const updateUsersList = () => {
        getUsersList(user.token).then((data) => {
            setUserList(data.user_details);
            setIsLoading(false);
        });
    };

    const setValues = (id, verify, name) => {
        setUserId(id);
        setVerifyUser(verify ? 1 : 2);
        setUserName(name);
        setOpenDialog(true);
    };

    const unsetValues = () => {
        setUserId(null);
        setVerifyUser(0);
        setUserName(null);
        setOpenDialog(false);
    };

    const handleVerification = () => {
        let verificationStatus = false;
        if (verifyUser == 1) {
            verificationStatus = true;
        }
        setIsLoading(true);
        sendVerfication(user.token, userId, verificationStatus)
            .then((data) => {
                console.log(data);
                updateUsersList();
                unsetValues();
            })
            .catch((err) => console.log(err.message));

        // updateUsersList();
        // unsetValues();
    };

    const ButtonColumn = ({ id, name }) => (
        <Box sx={buttonColumnStyle}>
            <Button
                variant="outlined"
                color="success"
                onClick={() => setValues(id, true, name)}
            >
                Verify
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={() => setValues(id, false, name)}
            >
                Deny
            </Button>
        </Box>
    );

    if (isLoading) return <CenterCircularProgress />;

    return (
        <div>
            <Typography variant="h4" textAlign="center">
                User Verification
            </Typography>

            {userList.length !== 0 ? (
                <TableContainer component={Paper} sx={{ my: 3 }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: "primary.main",
                                    "&>*": { color: "#fff", fontWeight: "bold" },
                                }}
                            >
                                <TableCell>User Name</TableCell>
                                <TableCell>Email Id</TableCell>
                                <TableCell>User Type</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {userList.map((userObj) => (
                                <TableRow key={userObj.user_id}>
                                    <TableCell>{userObj.name}</TableCell>
                                    <TableCell>{userObj.email}</TableCell>
                                    <TableCell>{userObj.user_type}</TableCell>
                                    <TableCell>
                                        <ButtonColumn id={userObj.user_id} name={userObj.name} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography
                    variant="h4"
                    component="div"
                    textAlign="center"
                    sx={{ color: "gray", p: 1, my: 5 }}
                >
                    No Users to verify currently.
                </Typography>
            )}

            <Dialog
                fullScreen={fullScreen}
                open={openDialog}
                onClose={() => unsetValues()}
                aria-labelledby="responsive-dialog-title"
                PaperProps={{ sx: { width: { xs: "90%", md: "60%" } } }}
            >
                <DialogTitle id="responsive-dialog-title">{"Verify User"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to{" "}
                        <strong>{verifyUser == 1 ? "verify" : "deny"}</strong> {userName}&rsquo;s
                        request?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='error' autoFocus onClick={() => unsetValues()}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleVerification()} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserVerification;
