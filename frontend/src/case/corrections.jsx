import { useContext, useState } from "react";
import Button from '@mui/material/Button'
import { Snackbar, Stack, TextField, Typography } from "@mui/material";
import AuthContext from "../auth/AuthContext";
import { addCorrection } from "./apis";
import CenterCircularProgress from "../common/centerLoader";


export default function Corrections({ corrections, caseId, prescriptionId, reFetchCase, ...rest }) {
    const { user } = useContext(AuthContext);
    const [newCorrection, setNewCorrection] = useState("");
    const [wantToAddCorrection, setWantToAddCorrection] = useState(false);

    const [isSuccess, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = () => {
        console.log(newCorrection);
        const correctionId = corrections.length;
        addCorrection(user.token, caseId, prescriptionId, correctionId, newCorrection)
            .then((res) => {
                setSuccess(true);
                setWantToAddCorrection(false);
                setNewCorrection("");
                reFetchCase();
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err?.response?.data?.message)
                setErrorMsg(err?.response?.data?.message);
                setIsLoading(false);
            });
        setIsLoading(true);
    }

    return (
        <>
            <Snackbar
                open={isSuccess}
                autoHideDuration={6000}
                message="Successfully added correction"
            />
            <ul>
                {
                    corrections.map((correction) => (
                        < li key={correction.id} > {correction.description}</li >
                    ))
                }
            </ul >
            {
                !wantToAddCorrection ?
                    <Button variant="contained" color="primary" size='small' onClick={() => { setWantToAddCorrection(true); }}>
                        Add Item
                    </Button>

                    :
                    <Stack direction='row' spacing={2}>
                        <TextField
                            id="add_correction"
                            label="Description"
                            value={newCorrection}
                            size='small'
                            onChange={(e) => { setNewCorrection(e.target.value); }}
                        />
                        <Button variant="contained" color="primary" size='small' onClick={handleSubmit}>
                            {isLoading ?
                                <CenterCircularProgress />
                                :
                                "Submit"
                            }
                        </Button>
                        <Button variant="outlined" color="error" size='small' onClick={() => { setWantToAddCorrection(false); }}>
                            Cancel
                        </Button>
                        <Typography variant="body1"
                            color="error"
                            component='div'>
                            {errorMsg}
                        </Typography>
                    </Stack>
            }
        </>
    );
}
