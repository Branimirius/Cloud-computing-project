from django import forms
from .models import Professor

class ProfessorRegistrationForm(forms.ModelForm):
    class Meta:
        model = Professor
        fields = ['first_name', 'last_name', 'email']
    
    def save(self):
        data = self.cleaned_data
        professor = Professor(first_name=data['first_name'], last_name=data['last_name'], email=data['email'])
        professor.save()