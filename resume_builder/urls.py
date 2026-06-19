from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('templates/', views.templates_gallery, name='templates_gallery'),
    path('builder/', views.builder_new, name='builder_new'),
    path('resumes/', views.resume_list, name='resume_list'),
    path('resume/<int:resume_id>/', views.resume_view, name='resume_view'),
    path('resume/edit/<int:resume_id>/', views.resume_edit, name='resume_edit'),
    path('resume/delete/<int:resume_id>/', views.resume_delete, name='resume_delete'),
    path('resume/save/', views.resume_save, name='resume_save'),
]
