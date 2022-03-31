import { Button, Stack } from "@mui/material";
import * as React from "react";


export default function Recorder(props) {
    const { audioURL, isRecording, startRecording, stopRecording, resetRecording } = props;

    return (
        <>
            <audio src={audioURL} controls />
            <Stack sx={{ marginTop: 2, marginBottom: 3 }} direction="row" spacing={2}>
                <Button variant='contained' onClick={startRecording} disabled={audioURL != "" || isRecording}>
                    start recording
                </Button>
                <Button variant='contained' onClick={stopRecording} disabled={!isRecording}>
                    stop recording
                </Button>
                <Button variant='contained' onClick={resetRecording} disabled={audioURL == ""}>
                    reset recording
                </Button>
            </Stack>
        </>
    );
}
