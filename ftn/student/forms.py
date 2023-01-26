from django import forms
from .models import Student

class StudentRegistrationForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['first_name', 'last_name', 'email']

    def save(self):
        data = self.cleaned_data
        professor = Student(first_name=data['first_name'], last_name=data['last_name'], email=data['email'])
        professor.save()