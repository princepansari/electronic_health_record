import axios from "./../axios";


export const createPrescription = (token, recordingBlob, prescriptionData) => {

    console.log(prescriptionData)
    const prescription = new FormData();
    prescription.append('recording', recordingBlob, 'recording.mp3');
    prescription.append('prescription', JSON.stringify(prescriptionData))

    axios.defaults.headers = {
        'Content-Type': `multipart/form-data; boundary=${prescription._boundary}`,
        Authorization: `Token ${token}`
    };

    axios
        .post(`case/create_prescription/`, prescription)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log(err);
        });

};

export const uploadReport = (token, report) => {

    console.log(report)
    const reportData = new FormData();
    reportData.append('report', report, report.name);

    axios.defaults.headers = {
        'Content-Type': `multipart/form-data; boundary=${reportData._boundary}`,
        Authorization: `Token ${token}`
    };

    axios
        .post(`case/add_report/`, reportData)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log(err);
        });

};
