import time
from io import BytesIO

from reportlab.graphics.shapes import Drawing, Line
from reportlab.lib.enums import TA_JUSTIFY, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from flask import make_response


class PdfGenerator:
    def __init__(self, case, prescriptions, download_type):
        self.case = case
        self.prescriptions = prescriptions
        self.download_type = download_type
        self.story = []

    def generate_pdf(self):
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter,
                                rightMargin=72, leftMargin=40,
                                topMargin=40, bottomMargin=18)

        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))
        styles.add(ParagraphStyle(name='RightAligned', alignment=TA_RIGHT))
        styles.add(ParagraphStyle(name='Bold', fontName='Helvetica-Bold'))

        hospital_info = ["Health Center", "Indian Institute of Technology - Bhilai (IIT Bhilai)",
                         "GEC Campus, Sejbahar",
                         "Raipur 492015, Chhattisgarh, India ", "Help Line No: 9424283691"]
        for info in hospital_info:
            self.story.append(Paragraph(info, styles["Normal"]))

        d = Drawing(100, 10)
        d.add(Line(0, 0, doc.width, 0))
        self.story.append(d)
        self.story.append(Spacer(1, 12))

        self.add_case_details(styles)

        for prescription in self.prescriptions:
            self.add_prescriptions_details(prescription, styles, doc.width)

        doc.build(self.story)
        pdf = buffer.getvalue()
        buffer.close()
        response = make_response(pdf)
        response.headers['Content-Type'] = 'application/pdf'
        if self.download_type == 'case':
            response.headers['Content-Disposition'] = 'attachment; filename=%s.pdf' % self.case['case_id']
        elif self.download_type == 'prescription':
            response.headers['Content-Disposition'] = 'attachment; filename=%s.pdf' % self.case['case_id'] + "_" +\
                                                      self.prescriptions[0]['prescription_id']
        else:
            response.headers['Content-Disposition'] = 'inline; filename=%s.pdf' % time.time()
        return response

    def add_case_details(self, styles):
        case_id = self.case['case_id']
        self.story.append(Paragraph("<strong> Case No: </strong>" + str(case_id), styles["Justify"]))
        problem = self.case['problem']
        self.story.append(Paragraph("<strong> Problem: </strong>" + problem, styles["Justify"]))
        created_at_date = self.case['created_at'].date().isoformat()
        self.story.append(Paragraph("<strong> Case Created On: </strong>" + created_at_date, styles["Justify"]))
        self.story.append(Spacer(1, 12))

        self.story.append(Paragraph("Doctor Info", styles["Bold"]))
        d = Drawing(100, 1)
        d.add(Line(0, 0, 60, 0))
        self.story.append(d)

        doctor_name = self.case['created_by']
        self.story.append(Paragraph("Name: " + doctor_name, styles["Normal"]))
        self.story.append(Spacer(1, 12))

        self.story.append(Paragraph("Patient Info", styles["Bold"]))
        d = Drawing(100, 1)
        d.add(Line(0, 0, 60, 0))
        self.story.append(d)

        patient_name = self.case['patient_name']
        self.story.append(Paragraph("Name: " + patient_name, styles["Normal"]))
        patient_age = self.case['patient_age']
        self.story.append(Paragraph("Age: " + str(patient_age), styles["Normal"]))
        patient_allergy = self.case['patient_allergy']
        self.story.append(Paragraph("Allergy: " + patient_allergy, styles["Normal"]))
        self.story.append(Spacer(1, 12))

    def add_prescriptions_details(self, prescription, styles, doc_width):
        d = Drawing(100, 10)
        d.add(Line(doc_width / 4, 0, 3 * doc_width / 4, 0))
        self.story.append(d)
        self.story.append(Spacer(1, 12))

        date = prescription['created_at'].date().isoformat()
        self.story.append(Paragraph("<strong> Date: </strong>" + date, styles["RightAligned"]))

        prescription_id = prescription['prescription_id']
        self.story.append(Paragraph("<strong> Prescription No: </strong>" + str(prescription_id), styles["Justify"]))
        self.story.append(Spacer(1, 12))

        problem_description = prescription['prescription'].get('problem') or ''
        self.story.append(Paragraph("Problem Description", styles["Bold"]))
        self.story.append(Paragraph(problem_description, styles["Justify"]))
        self.story.append(Spacer(1, 12))

        self.story.append(Paragraph("Medicine List", styles["Bold"]))
        if prescription['prescription'].get('medicines') is None:
            self.story.append(Paragraph("No Medicine", styles["Justify"]))
        else:
            count = 1
            for medicine in prescription['prescription']['medicines']:
                self.story.append(
                    Paragraph(str(count) + ". " + medicine['medicine'] + " - " + medicine['dosage'], styles["Normal"]))
                count += 1
        self.story.append(Spacer(1, 12))

        self.story.append(Paragraph("Lab Tests", styles["Bold"]))
        if prescription['prescription'].get('lab_tests') is None or len(prescription['prescription']['lab_tests']) == 0:
            self.story.append(Paragraph("No Lab Test", styles["Justify"]))
        else:
            count = 1
            for lab_test in prescription['prescription']['lab_tests']:
                self.story.append(Paragraph(str(count) + ". " + lab_test['lab_test'], styles["Normal"]))
                count += 1
        self.story.append(Spacer(1, 12))

        if prescription['prescription'].get('corrections') is not None and len(prescription['prescription']['corrections']) != 0:
            self.story.append(Paragraph("Corrections", styles["Bold"]))
            count = 1
            for correction in prescription['prescription']['corrections']:
                self.story.append(Paragraph(str(count) + ". " + correction['description'], styles["Normal"]))
                count += 1
        self.story.append(Spacer(1, 12))
