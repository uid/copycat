from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
from django.conf import settings
from tutor.models import Problem, Response, ProblemManager, Test
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
import re
import json
import os
from datetime import datetime


def create(request):
	if request.method == "POST":
		username = request.POST['username']
		password = request.POST['password']
		password_confirmation = request.POST['password_confirmation']
		errors = []
		if password == password_confirmation:
			try:
				user = User.objects.create_user(username, password = password)
				user.save()
				u = authenticate(username = username, password = password)
				login(request, u)
				return redirect('1/')
			except:
				errors.append("Username " + username + " is already taken")
		else:
			errors.append("Passwords do not match")
		return render(request, 'registration/signup.html', {'errors': errors})
	return render(request, 'registration/signup.html', {})


@login_required
def read(request):
	problem = Problem.objects.get(name = request.POST['name'])
	code = {}
	code['python'] = problem.python
	try:
		response = Response.objects.get(problem = problem, user = request.user)
		code['java'] = response.code	
	except Response.DoesNotExist:
		code['java'] = problem.template
	try:
		test = Test.objects.get(problem = problem, user = request.user)
		code['test'] = test.code
	except Test.DoesNotExist:
		code['test'] = ''
	return HttpResponse(json.dumps(code));


@login_required
def reset(request):
	problem = Problem.objects.get(name = request.POST['name'])
	print "----------------------------------------------------------------------------------------------------\n" + \
		  "[" + str(datetime.now()) + "] USER " + str(request.user) + " RESET EXERCISE " + problem.name + "\n" + \
		  "----------------------------------------------------------------------------------------------------"
	try:
		response = Response.objects.get(problem = problem, user = request.user)
		response.code = problem.template
		response.save()
	except Response.DoesNotExist:
		pass
	try:
		test = Test.objects.get(problem = problem, user = request.user)
		test.delete()
	except Test.DoesNotExist:
		pass
	return HttpResponse(problem.template)


@login_required
def compile(request):
	problem = Problem.objects.get(name = request.POST['name'])
	if request.method == 'POST':
		code = request.POST['code']
		if request.POST['test'] == 'false':
			print "----------------------------------------------------------------------------------------------------\n" + \
		  		  "[" + str(datetime.now()) + "] USER " + str(request.user) + " COMPILED IMPLEMENTATION FOR EXERCISE " + problem.name + "\n" + \
		  		  request.POST['code'] + "\n" + \
		  		  "----------------------------------------------------------------------------------------------------"
			try:
				response = Response.objects.get(problem = problem, user = request.user)
				response.code = code
			except Response.DoesNotExist:
				response = Response(
					code = code,
					problem_id = problem.id,
					user_id = request.user.id,
					compiled = False)
			response.save()
			compile_errors = Problem.objects.compile_code(problem.name, code, request.user)
		elif request.POST['test'] == 'true':
			print "----------------------------------------------------------------------------------------------------\n" + \
		  		  "[" + str(datetime.now()) + "] USER " + str(request.user) + " COMPILED TEST FOR EXERCISE " + problem.name + "\n" + \
		  		  request.POST['code'] + "\n" + \
		  		  "----------------------------------------------------------------------------------------------------"
			try:
				test = Test.objects.get(problem = problem, user = request.user)
				test.code = code
			except Test.DoesNotExist:
				test = Test(
					code = code,
					problem_id = problem.id,
					user_id = request.user.id)
			test.save()
			compile_errors = Problem.objects.compile_user_test(problem.name, code, request.user)
	return HttpResponse(json.dumps(compile_errors))


@login_required
def checkTemplate(code, problem):
	template = problem.template
	condensed_template = re.sub(r'\s+', ' ', template)
	regex_string = condensed_template.replace(" // Your Code Here ", ".*").replace('(', '\\(').replace(')', '\\)')
	regex = re.compile(regex_string)
	condensed_code = re.sub(r'\s+', ' ', code)
	return regex.match(condensed_code) != None


@login_required
def run(request):
	problem = Problem.objects.get(name = request.POST['name'])
	print "----------------------------------------------------------------------------------------------------\n" + \
		  "[" + str(datetime.now()) + "] USER " + str(request.user) + " RAN INSTRUCTOR TESTS FOR EXERCISE " + problem.name + "\n" + \
	  	  "----------------------------------------------------------------------------------------------------"
	if request.method == 'POST':
		out, test_errors = problem.run_tests(request.user)

		if len(test_errors) > 0:
			result = "ERROR IN TESTS"
		else:
			result = out
		response = Response.objects.get(problem = problem, user = request.user)
		response.save()

	return HttpResponse(json.dumps(result))

@login_required
def run_test(request):
	problem = Problem.objects.get(name = request.POST['name'])
	if request.method == 'POST':
		if request.POST['solution'] != 'false':
			print "----------------------------------------------------------------------------------------------------\n" + \
		  		  "[" + str(datetime.now()) + "] USER " + str(request.user) + " RAN THEIR TEST AGAINST SOLUTION FOR EXERCISE " + problem.name + "\n" + \
	  	  		  "----------------------------------------------------------------------------------------------------"
			out, test_errors = problem.run_user_test(request.user)
		else:
			print "----------------------------------------------------------------------------------------------------\n" + \
		  		  "[" + str(datetime.now()) + "] USER " + str(request.user) + " RAN THEIR TEST AGAINST THEIR IMPLEMENTATION FOR EXERCISE " + problem.name + "\n" + \
	  	  		  "----------------------------------------------------------------------------------------------------"
			out, test_errors = problem.run_user_test(request.user, False)
		if len(test_errors) > 0:
			result = "ERROR IN TESTS"
		else:
			result = out
	return HttpResponse(json.dumps(result))

@login_required
def index(request):
	created = []
	updated = []
	e = []
	names = Problem.objects.get_names()
	for name in names:
		try:
			p = Problem.objects.get(name = name)
			if p.update():
				updated.append(name)
		except Problem.DoesNotExist:
			p = Problem.objects.build(name)
			created.append(name)
		valid, errors = p.is_valid_code()
		if valid:
			p.save()
		e.extend(errors)
	current = Problem.objects.all()
  	return render(request, 'tutor/index.html',
  		{ 'created': created,
  		  'updated': updated,
  		  'errors': e,
  		  'current': current,
  		})


@login_required
def show(request, problem_id):
	problem = Problem.objects.get(id = problem_id)
	print "----------------------------------------------------------------------------------------------------\n" + \
		  "[" + str(datetime.now()) + "] USER " + str(request.user) + " LOADED EXERCISE " + problem.name + "\n" + \
	  	  "----------------------------------------------------------------------------------------------------"
	name = problem.name.capitalize()
	next = "/tutor/" + str(problem.id + 1)
	if Problem.objects.filter(id = problem.id + 1).count() == 1:
		next_problem = True
	else:
		next_problem = False
	prev = "/tutor/" + str(problem.id - 1)
	if Problem.objects.filter(id = problem.id - 1).count() == 1:
		prev_problem = True
	else:
		prev_problem = False
	return render(request, 'tutor/show.html',
		{ 'name': name,
		  'problem': problem,
		  'next': next,
		  'prev':prev,
		  'next_problem':next_problem,
		  'prev_problem':prev_problem
		})

