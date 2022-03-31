import { useEffect, useState, useContext } from "react"
import Prescription from "./prescription";
import Typography from '@mui/material/Typography'
import { Grid, Skeleton, Button } from "@mui/material";
import PrescriptionForm from "./prescriptionForm";
import AuthContext from "../auth/AuthContext";
import { useParams } from "react-router-dom";
import { getCase } from "./apis";

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
        created_by: "Dr MJ Memon",
        created_at: (new Date()).toLocaleString(),
        updated_at: (new Date()).toLocaleString(),
        problem: "Cold and cough",
        medicines,
        labtests,
        corrections,
    };
}


function createCase(id, prescriptions) {
    return {
        id,
        created_by: "Dr. MJ Memon",
        created_at: (new Date()).toLocaleString(),
        updated_at: (new Date()).toLocaleString(),
        patient_name: "Joe",
        patient_age: 21,
        patient_allergy: "allergic to azithromycin",
        problem: "Cold and Cough",
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
    let params = useParams();
    const caseId = params.caseId;

    const reFetchCase = () => {
        //TODO: api call
        // setCaseObj(getCase(user.token, caseId));
    }

    useEffect(() => {
        // setCaseObj(getCase(user.token, caseId));
        setCaseObj(createCase(1, [p1]));
    }, [])

    const briefInfoFields = [
        'id',
        'created_by',
        'created_at',
        'updated_at',
        'patient_name',
        'patient_age',
        'patient_allergy',
        'problem',
    ]

    const displayName = {
        id: "Case Id: ",
        created_by: "Created By: ",
        created_at: "Created On: ",
        patient_name: "Patient Name: ",
        patient_age: "Patient Age: ",
        patient_allergy: "Allergy: ",
        updated_at: "Updated On:",
        problem: "Problem: "
    }

    return (
        <>
            {
                caseObj === null ?
                    <Skeleton variant="rectangular" height={500} />
                    :
                    <>
                        <Grid container sx={{ marginBottom: 10 }}>
                            {console.log(caseObj)}
                            {briefInfoFields.map((field) => (
                                <Grid item key={field} sm={6} md={4} >
                                    <Typography variant="h6" component='span'>
                                        {displayName[field] + caseObj[field]}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                        {console.log(user.user_type)}
                        {!isDisplayForm
                            ?
                            (['doctor', 'nurse'].includes(user.user_type) &&
                                <Button variant="contained" sx={{ marginBottom: 2 }} onClick={() => { setIsDisplayForm(true); }}>
                                    Add a prescription
                                </Button>)
                            : <PrescriptionForm caseId={caseObj.id} reFetchCase={reFetchCase} cancel={() => { setIsDisplayForm(false); }} />}
                        <div style={{ marginBottom: 10 }}></div>
                        <Typography variant="h5" sx={{ marginTop: 5, marginBottom: 2 }}>Old Prescriptions</Typography>
                        {caseObj.prescriptions !== undefined && caseObj.prescriptions.map((prescription) => (
                            <Prescription key={prescription.id} caseId={caseObj.id} reFetchCase={reFetchCase} prescription={prescription} />
                        ))}
                    </>
            }

        </>
    )

}