import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import TableCell from '@mui/material/TableCell';
import { Button, Paper, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import LabTests from "./labtests"
import Medicines from "./medicines"
import Corrections from "./corrections"

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.action.hover
}));


const briefInfoFields = ['created_at', 'created_by', 'problem']

const displayText = {
    "created_by": "Created By",
    "problem": "Problem Description",
    "created_at": "Date and Time"
}

export default function Prescription({ prescription, caseId, ...rest }) {


    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ flexGrow: 1 }}>
            <CardHeader
                action={
                    <IconButton aria-label="download">
                        <DownloadIcon />
                    </IconButton>
                }
                title={"Prescription " + prescription.id}
            />
            <CardContent>
                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 700 }} >
                        <TableBody>
                            {
                                briefInfoFields.map((field) => (
                                    <StyledTableRow key={field}>
                                        <TableCell component="th" scope="row">
                                            {displayText[field]}
                                        </TableCell>
                                        <TableCell >{prescription[field]}</TableCell>
                                    </StyledTableRow>
                                ))
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {prescription.recording ?
                        <>
                            <Typography variant='h6' sx={{ marginBottom: 2 }}>Voice Recording:</Typography>
                            <audio
                                controls
                                src={prescription.recording}>
                                Your browser does not support the
                                <code>audio</code> element.
                            </audio>
                        </>
                        :
                        null}
                    <Typography variant='h6' sx={{ marginBottom: 2, marginTop: 2 }}>Medicines:</Typography>
                    <Medicines medicines={prescription.medicines || []} {...rest} />
                    <Typography variant='h6' sx={{ marginBottom: 2, marginTop: 2 }}>Lab Tests:</Typography>
                    <LabTests labTests={prescription.labtests || []} caseId={caseId} prescriptionId={prescription.id} {...rest} />
                    <Typography variant='h6' sx={{ marginBottom: 2, marginTop: 2 }}>Corrections:</Typography>
                    <Corrections caseId={caseId} prescriptionId={prescription.id} corrections={prescription.corrections || []} {...rest} />
                </CardContent>
            </Collapse>
        </Card>
    );
}
