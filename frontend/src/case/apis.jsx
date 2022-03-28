import axios from "axios";


export const createPrescription = (token, recordingBlob, formData) => {
    console.log(recordingBlob, formData);
    const prescription = new FormData();
    prescription.append('recording', recordingBlob);
    for (const key in formData) {
        prescription.append(key, formData[key])
    }

    console.log(prescription.toString(), prescription);

    axios.defaults.headers = {
        'Content-Type': `multipart/form-data; boundary=${prescription._boundary}`,
        Authorization: `Token ${token}`
    };

    axios
        .post(`case/create_prescription/`, prescription)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });

};