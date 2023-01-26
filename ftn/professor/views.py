from django.shortcuts import render, redirect
from .forms import ProfessorRegistrationForm
from .models import Professor
import requests
import json

# Create your views here.
def professor_table(request):
    professors = Professor.objects.all()
    return render(request, 'professor_table.html', {'professors': professors})

def professor_registration(request):
    if request.method == 'POST':
        form = ProfessorRegistrationForm(request.POST)
        if form.is_valid():
            if professor_to_uns(form):
                form.save()
            else:
                print("Professor already exists in UNS database")
            return redirect('professor-table')
    else:
        form = ProfessorRegistrationForm()
    return render(request, 'professor_registration.html', {'form':form})

def professor_to_uns(form):
    url = 'http://uns:3000/professor'
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
