import json
from django.test import TestCase, Client
from django.urls import reverse
from .models import Resume, Education, Skills, Projects, Certifications, Languages, Achievements, Experience

class ResumeCRUDTests(TestCase):
    def setUp(self):
        self.client = Client()
        # Mock resume data payload mimicking the JS object
        self.mock_resume_data = {
            "templateId": "professional",
            "styles": {
                "themeColor": "#2563EB",
                "fontFamily": "sans",
                "margins": "20",
                "displayPhoto": True,
                "highlightSkillsBg": True
            },
            "personal": {
                "fullName": "Test Rohan",
                "email": "test.rohan@example.com",
                "phone": "+91 98765 43210",
                "location": "Pune, India",
                "linkedin": "linkedin.com/in/test-rohan",
                "github": "github.com/test-rohan",
                "photoDataUrl": "data:image/png;base64,testdata"
            },
            "objective": "Test MCA graduate objective.",
            "education": [
                {
                    "university": "Savitribai Phule Pune University",
                    "degree": "MCA",
                    "year": "2022 - 2024",
                    "grade": "CGPA: 9.2/10"
                }
            ],
            "skills": ["React", "Django", "MySQL"],
            "experience": [
                {
                    "role": "Intern",
                    "company": "TechVision",
                    "duration": "6 Months",
                    "bullets": ["Optimized SQL queries", "Built dashboard"]
                }
            ],
            "projects": [
                {
                    "title": "Resume Builder",
                    "role": "Developer",
                    "duration": "1 Month",
                    "description": "Migrated static to Django"
                }
            ],
            "certifications": [
                {
                    "title": "AWS Associate",
                    "issuer": "Amazon",
                    "date": "2024"
                }
            ],
            "languages": "English, Hindi",
            "achievements": "SIH Winner 2023"
        }

    def test_pages_load(self):
        # Test landing page
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

        # Test templates gallery
        response = self.client.get(reverse('templates_gallery'))
        self.assertEqual(response.status_code, 200)

        # Test builder new
        response = self.client.get(reverse('builder_new'))
        self.assertEqual(response.status_code, 200)

        # Test resume list
        response = self.client.get(reverse('resume_list'))
        self.assertEqual(response.status_code, 200)

    def test_resume_save_and_crud_workflow(self):
        # 1. Create a new Resume via AJAX Save
        response = self.client.post(
            reverse('resume_save'),
            data=json.dumps(self.mock_resume_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data['status'], 'success')
        resume_id = json_data['resume_id']
        self.assertIsNotNone(resume_id)

        # Check DB rows
        resume = Resume.objects.get(resume_id=resume_id)
        self.assertEqual(resume.full_name, "Test Rohan")
        self.assertEqual(resume.email, "test.rohan@example.com")
        self.assertEqual(resume.education_list.count(), 1)
        self.assertEqual(resume.skills_list.count(), 3)
        self.assertEqual(resume.experience_list.count(), 1)
        self.assertEqual(resume.projects_list.count(), 1)
        self.assertEqual(resume.certifications_list.count(), 1)
        self.assertEqual(resume.languages_list.count(), 2)
        self.assertEqual(resume.achievements_list.count(), 1)

        # 2. View/Edit Page Load with data
        edit_url = reverse('resume_edit', args=[resume_id])
        response = self.client.get(edit_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Rohan")

        view_url = reverse('resume_view', args=[resume_id])
        response = self.client.get(view_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Rohan")

        # 3. Modify/Update Resume via AJAX Save (including the resumeId in payload)
        self.mock_resume_data['resumeId'] = resume_id
        self.mock_resume_data['personal']['fullName'] = "Updated Rohan"
        self.mock_resume_data['skills'].append("Docker") # 4 skills now

        response = self.client.post(
            reverse('resume_save'),
            data=json.dumps(self.mock_resume_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data['status'], 'success')
        self.assertEqual(json_data['resume_id'], resume_id)

        # Re-check DB rows
        resume.refresh_from_db()
        self.assertEqual(resume.full_name, "Updated Rohan")
        self.assertEqual(resume.skills_list.count(), 4)

        # 4. Delete the Resume
        delete_url = reverse('resume_delete', args=[resume_id])
        response = self.client.post(delete_url) # or GET, our view supports redirecting
        self.assertEqual(response.status_code, 302) # Redirects to resumes list
        
        # Verify it is deleted from DB
        with self.assertRaises(Resume.DoesNotExist):
            Resume.objects.get(resume_id=resume_id)
