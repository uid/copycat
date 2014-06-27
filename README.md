# CopyCat

### Basic Structue

1. copycat/copycat contains basic setup files.

2. copycat/static contains all the images, javascript, and css files (this includes CodeMirror). static/tutor/javascript/problem.js contains the javascript which controls the page when a student is working on a problem.

3. copycat/tutor stores the majority of the code.
	
	1. copycat/tutor/concepts contains the files relating to the concept map, including a JSON representing the most updated version.

	2. copycat/tutor/java contains all the java code. When students write code, only the class file is saved. If student 4 submitted an implementation to problem "Equality", the class file would be located at copycat/tutor/java/bin/4/EqualityClass.class. Similarly, if student 4 submitted a test case to problem "Equality", the class file would be located at copycat/tutor/java/bin/4/test/EqualityTest.class.

	3. copycat/tutor/problems contains all the exercises. Each exercise is located under a folder with the problem name. For each problem, the following files must be present:
		1. problem.txt - Contains the text to be displayed at the top of the exercise
		2. solution.java - Instructor solution.
		3. template.java - Template students will initially see. Areas where students should write code should be replaced with "// Your Code Here". Must contain Python code at the top (see strings/template.java for an example).
		4. test.java - Instructor test cases (Junit)

	4. copycat/tutor/templates contains the templates.
		1. base.html sets up the header.
		2. index.html will display the current exercises. Loading this page will also update the exercises if their corresponding files have changed.
		4. show.html contains the formatting for displaying a problem.

	5. copycat/tutor/models.py sets up the models for a Problem, a Response, and a Test

	6. copycat/tutor/views.py sets up the methods to load a problem, compile Java code, run Java code against tests, and reset a problem.

