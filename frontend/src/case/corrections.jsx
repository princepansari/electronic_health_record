import { useContext, useState } from "react";
import Button from '@mui/material/Button'
import { Snackbar, Stack, TextField } from "@mui/material";
import AuthContext from "../auth/AuthContext";
import { addCorrection } from "./apis";


export default function Corrections({ corrections, caseId, prescriptionId, reFetchCase, ...rest }) {
    const { user } = useContext(AuthContext);
    const [newCorrection, setNewCorrection] = useState("");
    const [wantToAddCorrection, setWantToAddCorrection] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const handleSubmit = () => {
        console.log(newCorrection);
        //TODO: PUT api call
        const correctionId = corrections.length;
        addCorrection(user.token, caseId, prescriptionId, correctionId, newCorrection).then((res) => {
            setSuccess(true);
            setWantToAddCorrection(false);
            setNewCorrection("");
            // reFetchCase();
        }).catch((err) => { console.log(err) });
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
                            Submit
                        </Button>
                        <Button variant="outlined" color="error" size='small' onClick={() => { setWantToAddCorrection(false); }}>
                            Cancel
                        </Button>
                    </Stack>
            }
        </>
    );
}
