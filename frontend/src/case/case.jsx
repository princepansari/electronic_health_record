import { useEffect, useState, useContext } from "react"
import Prescription from "./prescription";
import Typography from '@mui/material/Typography'
import { Grid, Skeleton, Button } from "@mui/material";
import PrescriptionForm from "./prescriptionForm";
import AuthContext from "../auth/AuthContext";

function createMedicine(medicine, dosage) {
    return { medicine, dosage };
}


function createLabTest(id, testname, reportLink) {
    return { id, testname, reportLink };
}

function createCorrection(id, description) {
    return { id, description }
}

function createPrescription(id, medicines, labtests, corrections) {
    return {
        id,
        doctor: "Dr MJ Memon",
        issue: "Cold and cough",
        created_at: (new Date()).toLocaleString(),
        updated_at: (new Date()).toLocaleString(),
        medicines,
        labtests,
        corrections
    };
}


function createCase(id, prescriptions) {
    return {
        id,
        created_by: "Dr. MJ Memon",
        created_at: (new Date()).toLocaleString(),
        patient_name: "Joe",
        patient_age: 21,
        patient_allergies: "allergic to azithromycin",
        prescriptions
    }
}

const p1 = createPrescription(
    1,

    [createMedicine('India', 'IN'),
    createMedicine('China', 'CN'),
    createMedicine('Italy', 'IT')],

    [createLabTest(1, 'India', 'https://google.com'),
    createLabTest(2, 'China', ''),
    createLabTest(3, 'Italy', 'https://google.com')],

    [createCorrection(1, "change abcd to xyz"),
    createCorrection(2, "change lmno to rsty")]
);


export default function Case(props) {
    const [caseObj, setCaseObj] = useState(null);
    const [isDisplayForm, setIsDisplayForm] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchCase = () => {
        //TODO: api call
    }

    useEffect(() => {
        //TODO: api call to fetch the case
        // setCaseObj(fetchCase());
        setCaseObj(createCase(1, [p1]));
    }, [props.caseId])

    const briefInfoFields = [
        'id',
        'created_by',
        'created_at',
        'patient_name',
        'patient_age',
        'patient_allergies'
    ]

    const displayName = {
        id: "Case Id: ",
        created_by: "Created By: ",
        created_at: "Opened On: ",
        patient_name: "Patient Name: ",
        patient_age: "Patient Age: ",
        patient_allergies: "Allergies: "
    }

    return (
        <>
            {
                caseObj === null ?
                    <Skeleton variant="rectangular" height={500} />
                    :
                    <>
                        <Grid container sx={{ marginBottom: 10 }}>
                            {briefInfoFields.map((field) => (
                                <Grid item key={field} sm={6} md={4} >
                                    <Typography variant="h6" component='span'>
                                        {displayName[field] + caseObj[field]}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                        {!isDisplayForm
                            ?
                            (['doctor', 'nurse'].includes(user.usertype) &&
                                <Button variant="contained" sx={{ marginBottom: 2 }} onClick={() => { setIsDisplayForm(true); }}>
                                    Add a prescription
                                </Button>)
                            : <PrescriptionForm cancel={() => { setIsDisplayForm(false); }} />}
                        <div style={{ marginBottom: 10 }}></div>
                        <Typography variant="h5" sx={{ marginTop: 5, marginBottom: 2 }}>Old Prescriptions</Typography>
                        {caseObj.prescriptions !== undefined && caseObj.prescriptions.map((prescription) => (
                            <Prescription key={prescription.id} reFetchCase={fetchCase} prescription={prescription} />
                        ))}
                    </>
            }

        </>
    )

}