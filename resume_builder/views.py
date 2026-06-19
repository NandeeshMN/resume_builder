import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.db import transaction
from .models import Resume, Education, Skills, Projects, Certifications, Languages, Achievements, Experience

def index(request):
    return render(request, 'index.html')

def templates_gallery(request):
    return render(request, 'templates.html')

def builder_new(request):
    return render(request, 'builder.html', {'resume_data_json': 'null'})

def resume_list(request):
    resumes = Resume.objects.all().order_by('-updated_at')
    return render(request, 'resume_list.html', {'resumes': resumes})

def serialize_resume(resume):
    # Education
    education = []
    for edu in resume.education_list.all():
        education.append({
            'id': f'edu-{edu.education_id}',
            'university': edu.institution,
            'degree': edu.degree or '',
            'year': edu.passing_year or '',
            'grade': edu.percentage or ''
        })
    
    # Skills
    skills = [s.skill_name for s in resume.skills_list.all() if s.skill_name]
    
    # Experience
    experience = []
    for exp in resume.experience_list.all():
        bullets = [b.strip() for b in exp.bullets.split('\n') if b.strip()] if exp.bullets else []
        experience.append({
            'id': f'exp-{exp.experience_id}',
            'role': exp.role or '',
            'company': exp.company or '',
            'duration': exp.duration or '',
            'bullets': bullets
        })
        
    # Projects
    projects = []
    for proj in resume.projects_list.all():
        projects.append({
            'id': f'proj-{proj.project_id}',
            'title': proj.project_title or '',
            'role': proj.role or '',
            'duration': proj.duration or '',
            'description': proj.project_description or ''
        })
        
    # Certifications
    certifications = []
    for cert in resume.certifications_list.all():
        certifications.append({
            'id': f'cert-{cert.certification_id}',
            'title': cert.certification_name or '',
            'issuer': cert.issuer or '',
            'date': cert.certification_year or ''
        })
        
    # Languages
    languages_str = ", ".join([l.language_name for l in resume.languages_list.all() if l.language_name])
    
    # Achievements
    ach = resume.achievements_list.first()
    achievements_str = ach.achievement_description if ach else ""
    
    return {
        'resumeId': resume.resume_id,
        'templateId': resume.selected_template or 'professional',
        'styles': {
            'themeColor': resume.theme_color or '#2563EB',
            'fontFamily': resume.font_choice or 'sans',
            'margins': resume.density_option or '20',
            'displayPhoto': resume.display_photo,
            'highlightSkillsBg': resume.highlight_skills
        },
        'personal': {
            'fullName': resume.full_name,
            'email': resume.email,
            'phone': resume.phone or "",
            'location': resume.address or "",
            'linkedin': resume.linkedin or "",
            'github': resume.github or "",
            'photoDataUrl': resume.photo_data_url or ""
        },
        'objective': resume.objective or "",
        'education': education,
        'skills': skills,
        'experience': experience,
        'projects': projects,
        'certifications': certifications,
        'languages': languages_str,
        'achievements': achievements_str
    }

def resume_edit(request, resume_id):
    resume = get_object_or_404(Resume, resume_id=resume_id)
    serialized = serialize_resume(resume)
    return render(request, 'builder.html', {
        'resume': resume,
        'resume_data_json': json.dumps(serialized)
    })

def resume_view(request, resume_id):
    resume = get_object_or_404(Resume, resume_id=resume_id)
    serialized = serialize_resume(resume)
    return render(request, 'resume_view.html', {
        'resume': resume,
        'resume_data_json': json.dumps(serialized)
    })

def resume_delete(request, resume_id):
    resume = get_object_or_404(Resume, resume_id=resume_id)
    resume.delete()
    return redirect('resume_list')

def resume_save(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST method is allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
        resume_id = data.get('resumeId') or data.get('resume_id')
        
        personal = data.get('personal', {})
        styles = data.get('styles', {})
        
        # Start transaction to ensure atomic saves
        with transaction.atomic():
            if resume_id:
                resume = Resume.objects.get(resume_id=resume_id)
            else:
                resume = Resume()
                
            # Update basic fields
            resume.full_name = personal.get('fullName', 'User Profile')
            resume.email = personal.get('email', '')
            resume.phone = personal.get('phone', '')
            resume.address = personal.get('location', '')
            resume.linkedin = personal.get('linkedin', '')
            resume.github = personal.get('github', '')
            resume.photo_data_url = personal.get('photoDataUrl', '')
            
            resume.objective = data.get('objective', '')
            resume.selected_template = data.get('templateId', 'professional')
            
            # Styling fields
            resume.theme_color = styles.get('themeColor', '#2563EB')
            resume.font_choice = styles.get('fontFamily', 'sans')
            resume.density_option = styles.get('margins', '20')
            resume.display_photo = styles.get('displayPhoto', True)
            resume.highlight_skills = styles.get('highlightSkillsBg', True)
            
            resume.save()
            
            # Recreate Education
            resume.education_list.all().delete()
            for edu in data.get('education', []):
                if edu.get('university') or edu.get('degree'):
                    Education.objects.create(
                        resume=resume,
                        institution=edu.get('university', ''),
                        degree=edu.get('degree', ''),
                        passing_year=edu.get('year', ''),
                        percentage=edu.get('grade', '')
                    )
                    
            # Recreate Skills
            resume.skills_list.all().delete()
            for skill in data.get('skills', []):
                if skill.strip():
                    Skills.objects.create(resume=resume, skill_name=skill.strip())
                    
            # Recreate Projects
            resume.projects_list.all().delete()
            for proj in data.get('projects', []):
                if proj.get('title'):
                    Projects.objects.create(
                        resume=resume,
                        project_title=proj.get('title', ''),
                        project_description=proj.get('description', ''),
                        role=proj.get('role', ''),
                        duration=proj.get('duration', '')
                    )
                    
            # Recreate Certifications
            resume.certifications_list.all().delete()
            for cert in data.get('certifications', []):
                if cert.get('title'):
                    Certifications.objects.create(
                        resume=resume,
                        certification_name=cert.get('title', ''),
                        issuer=cert.get('issuer', ''),
                        certification_year=cert.get('date', '')
                    )
                    
            # Recreate Languages
            resume.languages_list.all().delete()
            languages_str = data.get('languages', '')
            if languages_str:
                langs = [l.strip() for l in languages_str.split(',') if l.strip()]
                for lang in langs:
                    Languages.objects.create(resume=resume, language_name=lang)
                    
            # Recreate Achievements
            resume.achievements_list.all().delete()
            ach_str = data.get('achievements', '')
            if ach_str:
                Achievements.objects.create(resume=resume, achievement_description=ach_str)
                
            # Recreate Experience
            resume.experience_list.all().delete()
            for exp in data.get('experience', []):
                if exp.get('role') or exp.get('company'):
                    bullets_str = "\n".join(exp.get('bullets', []))
                    Experience.objects.create(
                        resume=resume,
                        role=exp.get('role', ''),
                        company=exp.get('company', ''),
                        duration=exp.get('duration', ''),
                        bullets=bullets_str
                    )
            
        return JsonResponse({
            'status': 'success',
            'resume_id': resume.resume_id,
            'message': 'Resume saved successfully'
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
