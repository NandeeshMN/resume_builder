from django.contrib import admin
from .models import Resume, Education, Skills, Projects, Certifications, Languages, Achievements, Experience

class EducationInline(admin.TabularInline):
    model = Education
    extra = 0

class SkillsInline(admin.TabularInline):
    model = Skills
    extra = 0

class ProjectsInline(admin.TabularInline):
    model = Projects
    extra = 0

class CertificationsInline(admin.TabularInline):
    model = Certifications
    extra = 0

class LanguagesInline(admin.TabularInline):
    model = Languages
    extra = 0

class AchievementsInline(admin.TabularInline):
    model = Achievements
    extra = 0

class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 0

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('resume_id', 'full_name', 'email', 'selected_template', 'created_at', 'updated_at')
    search_fields = ('full_name', 'email')
    list_filter = ('selected_template', 'created_at')
    inlines = [
        EducationInline,
        SkillsInline,
        ProjectsInline,
        CertificationsInline,
        LanguagesInline,
        AchievementsInline,
        ExperienceInline
    ]

# Also register individually for full edit capability
admin.site.register(Education)
admin.site.register(Skills)
admin.site.register(Projects)
admin.site.register(Certifications)
admin.site.register(Languages)
admin.site.register(Achievements)
admin.site.register(Experience)
