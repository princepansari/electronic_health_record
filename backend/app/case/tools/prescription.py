import time

from reportlab.graphics.shapes import Drawing, Line
from reportlab.lib.enums import TA_JUSTIFY, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def generate_pdf():
    doc = SimpleDocTemplate("prescription.pdf", pagesize=letter,
                            rightMargin=72, leftMargin=40,
                            topMargin=40, bottomMargin=18)
    story = []

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))
    styles.add(ParagraphStyle(name='RightAligned', alignment=TA_RIGHT))
    styles.add(ParagraphStyle(name='Bold', fontName='Helvetica-Bold'))

    hospital_info = ["Health Center", "Indian Institute of Technology - Bhilai (IIT Bhilai)", "GEC Campus, Sejbahar",
                     "Raipur 492015, Chhattisgarh, India ", "Help Line No: 9424283691"]
    for info in hospital_info:
        story.append(Paragraph(info, styles["Normal"]))

    d = Drawing(100, 10)
    d.add(Line(0, 0, doc.width, 0))
    story.append(d)
    story.append(Spacer(1, 12))

    date = time.strftime("%d/%m/%Y")
    story.append(Paragraph("Date: " + date, styles["RightAligned"]))

    case_id = "12"
    story.append(Paragraph("Case No: " + case_id, styles["Bold"]))
    prescription_id = "12"
    story.append(Paragraph("Prescription No: " + prescription_id, styles["Bold"]))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Doctor Info", styles["Bold"]))
    d = Drawing(100, 1)
    d.add(Line(0, 0, 60, 0))
    story.append(d)

    doctor_name = "Dr. S.K. Gupta"
    story.append(Paragraph("Name: " + doctor_name, styles["Normal"]))
    doctor_phone = "9424283691"
    story.append(Paragraph("Phone: " + doctor_phone, styles["Normal"]))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Patient Info", styles["Bold"]))
    d = Drawing(100, 1)
    d.add(Line(0, 0, 60, 0))
    story.append(d)

    patient_name = "Mr. S.K. Gupta"
    story.append(Paragraph("Name: " + patient_name, styles["Normal"]))
    patient_phone = "9424283691"
    story.append(Paragraph("Phone: " + patient_phone, styles["Normal"]))
    patient_age = "21"
    story.append(Paragraph("Age: " + patient_age, styles["Normal"]))
    patient_allergy = "Allergy"
    story.append(Paragraph("Allergy: " + patient_allergy, styles["Normal"]))
    story.append(Spacer(1, 12))

    doc.build(story)


generate_pdf()
