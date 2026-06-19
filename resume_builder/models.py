from django.db import models

class Resume(models.Model):
    resume_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=50, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    linkedin = models.CharField(max_length=255, null=True, blank=True)
    github = models.CharField(max_length=255, null=True, blank=True)
    objective = models.TextField(null=True, blank=True)
    selected_template = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    # UI styling properties
    theme_color = models.CharField(max_length=50, null=True, blank=True, default='#2563EB')
    font_choice = models.CharField(max_length=50, null=True, blank=True, default='sans')
    density_option = models.CharField(max_length=10, null=True, blank=True, default='20')
    display_photo = models.BooleanField(default=True)
    highlight_skills = models.BooleanField(default=True)
    photo_data_url = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'resume'

    def __str__(self):
        return f"{self.full_name} ({self.resume_id})"


class Education(models.Model):
    education_id = models.AutoField(primary_key=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, db_column='resume_id', related_name='education_list')
    institution = models.CharField(max_length=150)
    degree = models.CharField(max_length=100, null=True, blank=True)
    specialization = models.CharField(max_length=100, null=True, blank=True)
    passing_year = models.CharField(max_length=50, null=True, blank=True)
    percentage = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'education'

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class Skills(models.Model):
    skill_id = models.AutoField(primary_key=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, db_column='resume_id', related_name='skills_list')
    skill_name = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'skills'

    def __str__(self):
        return self.skill_name or ""


class Projects(models.Model):
    project_id = models.AutoField(primary_key=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, db_column='resume_id', related_name='projects_list')
    project_title = models.CharField(max_length=150, null=True, blank=True)
    project_description = models.TextField(null=True, blank=True)
    technologies = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=150, null=True, blank=True)
    duration = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'projects'

    def __str__(self):
        return self.project_title or ""


class Certifications(models.Model):
    certification_id = models.AutoField(primary_key=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, db_column='resume_id', related_name='certifications_list')
    certification_name = models.CharField(max_length=150, null=True, blank=True)
    issuer = models.CharField(max_length=150, null=True, blank=True)
    certification_year = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'certifications'

    def __str__(self):
        return self.certification_name or ""


class Languages(models.Model):
    language_id = models.AutoField(primary_key=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, db_column='resume_id', related_name='languages_list')
    language_name = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'languages'

    def __str__(self):
        return self.language_name or ""


class Achievements(models.Model):
    achievement_id = models.AutoField(primary_key=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, db_column='resume_id', related_name='achievements_list')
    achievement_description = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'achievements'

    def __str__(self):
        return self.achievement_description[:50] if self.achievement_description else ""


class Experience(models.Model):
    experience_id = models.AutoField(primary_key=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, db_column='resume_id', related_name='experience_list')
    role = models.CharField(max_length=150, null=True, blank=True)
    company = models.CharField(max_length=150, null=True, blank=True)
    duration = models.CharField(max_length=100, null=True, blank=True)
    bullets = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'experience'

    def __str__(self):
        return f"{self.role} at {self.company}"
