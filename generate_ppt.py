import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def set_slide_background(slide):
    # Just setting a subtle background or keeping it clean
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor(245, 245, 250)

def style_title(shape):
    if not shape.has_text_frame:
        return
    tf = shape.text_frame
    for paragraph in tf.paragraphs:
        for run in paragraph.runs:
            run.font.name = 'Segoe UI'
            run.font.size = Pt(40)
            run.font.bold = True
            run.font.color.rgb = RGBColor(33, 47, 61)

def add_title_slide(prs, title, subtitle):
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    set_slide_background(slide)
    
    title_shape = slide.shapes.title
    title_shape.text = title
    style_title(title_shape)
    
    subtitle_shape = slide.placeholders[1]
    subtitle_shape.text = subtitle
    tf = subtitle_shape.text_frame
    for paragraph in tf.paragraphs:
        for run in paragraph.runs:
            run.font.name = 'Segoe UI'
            run.font.size = Pt(24)
            run.font.color.rgb = RGBColor(86, 101, 115)

def add_bullet_slide(prs, title, bullets):
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    set_slide_background(slide)
    
    title_shape = slide.shapes.title
    title_shape.text = title
    style_title(title_shape)
    
    tf = slide.placeholders[1].text_frame
    tf.clear()
    
    for bullet in bullets:
        p = tf.add_paragraph()
        p.text = bullet
        p.font.name = 'Segoe UI'
        p.font.size = Pt(22)
        p.font.color.rgb = RGBColor(50, 50, 50)
        p.space_after = Pt(14)
        p.level = 0

def add_image_slide(prs, title, img_path):
    slide = prs.slides.add_slide(prs.slide_layouts[5]) # Title only
    set_slide_background(slide)
    
    title_shape = slide.shapes.title
    title_shape.text = title
    style_title(title_shape)
    
    if os.path.exists(img_path):
        # Adding some "cool" image alignment
        left = Inches(1)
        top = Inches(1.8)
        width = Inches(8)
        pic = slide.shapes.add_picture(img_path, left, top, width=width)
    else:
        # Placeholder text if image is missing
        txBox = slide.shapes.add_textbox(Inches(2), Inches(3), Inches(6), Inches(2))
        tf = txBox.text_frame
        tf.text = f"[Image Missing: {img_path}]"

prs = Presentation()

# Slide 1: Title
add_title_slide(prs, 
    "Attendance Management System", 
    "A Modern, Cloud-Based Academic Platform\n\nDeveloped by:\nManas Mishra\nMalli Akhil\n\nJain (Deemed-to-be University)\n\nGitHub: github.com/Ma-nas/Attandance-Managment-system")

# Slide 2: Introduction
add_bullet_slide(prs, 
    "1. Introduction & Problem Statement", 
    [
        "Background: Educational institutions rely heavily on accurate attendance tracking.",
        "Problem: Traditional paper-based methods are time-consuming and error-prone.",
        "Lack of Transparency: Students lack real-time visibility into their attendance.",
        "Administrative Overhead: Consolidating manual records delays interventions."
    ])

# Slide 3: Objectives
add_bullet_slide(prs, 
    "2. Project Objectives", 
    [
        "Centralized Database: Secure storage for all academic attendance records.",
        "Role-Based Access Control (RBAC): Strict separation of Admin, Trainer, and Student roles.",
        "Real-Time Tracking: Instant visibility for students regarding their academic standing.",
        "Responsive UI: A highly accessible web interface usable on mobile and desktop."
    ])

# Slide 4: System Design
add_bullet_slide(prs, 
    "3. System Architecture", 
    [
        "Client-Server Architecture: Decoupled frontend and backend.",
        "Frontend: React (Vite) with TypeScript and Tailwind CSS.",
        "Backend: Java 21, Spring Boot REST APIs.",
        "Database: PostgreSQL for reliable relational data storage.",
        "Authentication: Secure JWT (JSON Web Token) implementation."
    ])

# Slide 5: Key Features
add_bullet_slide(prs, 
    "4. Key Features & Modules", 
    [
        "Admin Module: Manage users, departments, subjects, and view global stats.",
        "Trainer Module: Interactive dashboard to instantly mark daily attendance.",
        "Student Module: Personalized view of current attendance percentage and events.",
        "Security: Protected API endpoints and encrypted credentials."
    ])

# Slide 6: Login Screenshot
add_image_slide(prs, "5. Interface: Secure Login Portal", "screenshots/login_page.png")

# Slide 7: Admin Dashboard Screenshot
add_image_slide(prs, "6. Interface: Admin Center", "screenshots/admin_dashboard.png")

# Slide 8: Trainer Dashboard Screenshot
add_image_slide(prs, "7. Interface: Trainer Portal", "screenshots/trainer_dashboard.png")

# Slide 9: Results & Future Scope
add_bullet_slide(prs, 
    "8. Results & Future Enhancements", 
    [
        "Results:",
        "- Sub-second response time for attendance submission.",
        "- Complete elimination of manual ledger calculations.",
        "Future Scope:",
        "- Biometric / RFID Scanner Integration.",
        "- Automated warning emails to parents.",
        "- AI/ML analytics to predict and prevent student dropouts."
    ])

# Slide 10: Conclusion
add_title_slide(prs, "Conclusion", "The AMS provides a highly efficient, paperless solution for academic administration.\n\nThank You!\nQuestions?")

prs.save('Attendance_Management_System_Presentation.pptx')
print("PPT generated successfully.")
