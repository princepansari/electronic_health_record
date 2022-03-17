import { useState } from "react";
import Button from '@mui/material/Button'
import { Stack, TextField } from "@mui/material";


export default function Corrections({ corrections, reFetchCase, ...rest }) {
    const [newCorrection, setNewCorrection] = useState("");
    const [wantToAddCorrection, setWantToAddCorrection] = useState(false);
    const handleSubmit = () => {
        console.log(newCorrection);
        //TODO: PUT api call
        setWantToAddCorrection(false);
        setNewCorrection("");
        // reFetchCase();
    }

    return (
        <>
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
