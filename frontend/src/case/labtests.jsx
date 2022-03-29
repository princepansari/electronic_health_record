import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button'

const columns = [
    { id: 'testname', label: 'Test Name' },
    { id: 'actions', label: 'Actions' }
];


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#757575",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));



export default function LabTests({ labTests, ...rest }) {
    const [selectedFile, setSelectedFile] = React.useState();

    const fileChangeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onReportUpload = () => {
        const formData = new FormData();

        formData.append('File', selectedFile);
        //TODO: api call
        // uploadFile(formData)
        console.log(formData);
        for (var p of formData) {
            console.log(p);
        }
    };

    return (
        <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell key={column.id}>
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {labTests.map((labTest) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={labTest.id}>

                                    <StyledTableCell>
                                        {labTest.testname}
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        {labTest.reportLink !== ''
                                            ?
                                            <Button variant="contained"
                                                color="primary"
                                                href={labTest.reportLink}
                                                target="_blank"
                                                size='small'
                                                rel="noreferrer noopener" >
                                                View
                                                {/* TODO: use link component to open a link of our website in new tab */}
                                            </Button>
                                            :
                                            <>
                                                <input type="file"
                                                    name={"report" + labTest.id}
                                                    accept="image/*"
                                                    id={"report" + labTest.id}
                                                    onChange={fileChangeHandler} />
                                                <Button type={'submit'}
                                                    variant='contained'
                                                    size='small'
                                                    onClick={onReportUpload}>
                                                    Upload
                                                </Button>
                                            </>


                                        }
                                    </StyledTableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
