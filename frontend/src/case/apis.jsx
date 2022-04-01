import axios from "./../axios";

export const createCase = (token, patientEmail, problem) => {

    const caseData = {
        'patient_email': patientEmail,
        'problem': problem,
    }

    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
    };
    console.log("in create case api= ", token);
    return axios
        .post(`/api/case/create_case`, caseData)
        .then(res => {
            return res.data.case_id;
        })


};



export const createPrescription = (token, caseId, recordingBlob, prescriptionData) => {

    console.log(prescriptionData)
    const prescription = new FormData();
    prescription.append('recording', recordingBlob, 'recording.mp3');
    prescription.append('case_id', caseId);
    prescription.append('prescription', JSON.stringify(prescriptionData));

    axios.defaults.headers = {
        'Content-Type': `multipart/form-data; boundary=${prescription._boundary}`,
        Authorization: `Token ${token}`
    };

    return axios
        .post(`/api/case/create_prescription`, prescription)
        .then(res => {
            return res.data;
        })

};


export const addCorrection = (token, caseId, prescriptionId, correctionId, correctionDesc) => {

    correctionData = {
        'case_id': caseId,
        'prescription_id': prescriptionId,
        'correction': {
            'id': correctionId,
            'description': correctionDesc
        }
    }
    axios.defaults.headers = {
        'Content-Type': `application/json`,
        Authorization: `Token ${token}`
    };

    return axios
        .post(`/api/case/add_correction`, correctionData)
        .then(res => {
            return res.data;
        })


};


export const uploadReport = (token, caseId, prescriptionId, reportId, report) => {

    console.log(report)
    const reportData = new FormData();
    reportData.append('case_id', caseId);
    reportData.append('prescription_id', prescriptionId);
    reportData.append('report_id', reportId);
    reportData.append('report', report, report.name);

    axios.defaults.headers = {
        'Content-Type': `multipart/form-data; boundary=${reportData._boundary}`,
        Authorization: `Token ${token}`
    };

    return axios
        .post(`/api/case/add_report`, reportData)
        .then(res => {
            return res.data.message;
        })


};


export const getCase = (token, caseId) => {

    axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
    };
    return axios
        .get(`/api/case/get_case/${caseId}`)
        .then(res => {
            console.log(res.data);
            return res.data;
        })


};


export const getMyCases = (token) => {
    axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
    };
    return axios
        .get(`/api/case/get_all_cases`)
        .then(res => {
            console.log(res.data);
            return res.data;
        })

};

