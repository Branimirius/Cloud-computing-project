from django.shortcuts import render, redirect
from .forms import StudentRegistrationForm
from .models import Student
import requests
import json

# Create your views here.
def student_table(request):
    students = Student.objects.all()
    return render(request, 'student_table.html', {'students': students})

def student_registration(request):
    if request.method == 'POST':
        form = StudentRegistrationForm(request.POST)
        if form.is_valid():
            if student_to_uns(form):
                form.save()
            else:
                print("Student already exists in UNS database")
            return redirect('student-table')
    else:
        form = StudentRegistrationForm()
    return render(request, 'student_registration.html', {'form': form})

def student_to_uns(form):
    url = 'http://localhost:3000/student'
    data = {
        'email': form.cleaned_data['email'],
        'first_name': form.cleaned_data['first_name'],
        'last_name': form.cleaned_data['last_name']
    }
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    response = requests.post(url, data=json.dumps(data), headers=headers)
    if response.status_code == 201:
        return True
    return False