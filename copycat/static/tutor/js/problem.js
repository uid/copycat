$(document).ready(function(){
    setUpCodeMirror();
    getCode();
    configureButtons();
    $(document).tooltip();
    configureSave();
    $('#student_test_toggler').on('click', function(e) {
        toggleTestResultVisibility($('#student_test'));
    })
});


// Returns true if the student is current writing their test case,
// false if they've moved on to writing implementation.
var inTestMode = function() {
    return $('.template_code').css("opacity") < 1;
}


// Update the step which the student is currently on.
// Step is an interger between 0 and 6 (inclusive),
// where 6 corresponds to being completed.
var updateStep = function(step) {
    next = $('#next_step');
    go = $('#go');
    var t = $('#step_pointer').detach()
    if (step == 0) {
        if (!inTestMode) {
            disableJavaBox();
        }
        clearBold();
        console.log("STEP 0");
        $('#next_step #step_0').css('font-weight', 'bold');
        $('#next_step #step_0').prepend(t)
        go.html('Generate My Test');
    }
    if (step == 1) {
        console.log("STEP 1");
        if (!inTestMode) {
            disableJavaBox();
        }
        clearBold();
        $('#next_step #step_1').css('font-weight', 'bold');
        $('#next_step #step_1').prepend(t)
        go.html('Compile My Test');
    } else if (step == 2) {
        clearBold();
        $('#next_step #step_2').css('font-weight', 'bold');
        $('#next_step #step_2').prepend(t)
        go.html('Run My Test Against Instructor Solution');
    } else if (step == 3) {
        if (inTestMode()) {
            enableJavaBox();
        }
        clearBold();
        $('#next_step #step_3').css('font-weight', 'bold');
        $('#next_step #step_3').prepend(t)
        go.html('Compile My Implementation');
    } else if (step == 4) {
        clearBold();
        $('#next_step #step_4').css('font-weight', 'bold');
        $('#next_step #step_4').prepend(t)
        go.html('Run My Test Case Against My Implementation');
    } else if (step == 5) {
        clearBold();
        $('#next_step #step_5').css('font-weight', 'bold');
        $('#next_step #step_5').prepend(t)
        go.html('Run Instructor Tests Against My Implementation');
    } else if (step == 6) {
        clearBold();
    }
}


// Clear all the bold from the steps.
// Used to update step
var clearBold = function() {
    $('#next_step #step_0').css('font-weight', 'normal');
    $('#next_step #step_1').css('font-weight', 'normal');
    $('#next_step #step_2').css('font-weight', 'normal');
    $('#next_step #step_3').css('font-weight', 'normal');
    $('#next_step #step_4').css('font-weight', 'normal');
    $('#next_step #step_5').css('font-weight', 'normal');
}


// Allow the user to edit the box for writing Java code.
var enableJavaBox = function() {
    $('.template_code').css('opacity', '1');
    java_codemirror.toTextArea();
    var java_textarea = $('#id_response_code')[0];
    java_codemirror = CodeMirror.fromTextArea(java_textarea,
        { mode:'text/x-java',
          lineNumbers: true,
          theme: 'eclipse',
          tabSize: 2,
          gutters: ["error-gutter", "CodeMirror-linenumbers"],
          lineWrapping: true,
        }
    );
    var go_button = $('#go');
    go_button.removeAttr('disabled');
    java_codemirror.on("change", function(e) {
        if (!inTestMode()) {
            updateStep(3);
            clearResults();
            $('#student_test').addClass('summary');
            $('#student_test').removeClass('pass');
            $('#student_test').removeClass('fail');
            $('#student_test').removeClass('error');
            go_button.removeAttr('disabled');
        }
    })
}


// Disable the user from writing in the implementation box
var disableJavaBox = function() {
    $('.template_code').css('opacity', '.4');
    java_codemirror.toTextArea();
    var java_textarea = $('#id_response_code')[0];
    java_codemirror = CodeMirror.fromTextArea(java_textarea,
        { mode:'text/x-java',
          lineNumbers: true,
          theme: 'eclipse',
          tabSize: 2,
          gutters: ["error-gutter", "CodeMirror-linenumbers"],
          lineWrapping: true,
          readOnly: true,
          cursorHeight: 0
        }
    );
    var go_button = $('#go');
    java_codemirror.on("change", function(e) {
        if (!inTestMode()) {
            updateStep(3);
            clearResults();
            $('#student_test').addClass('summary');
            $('#student_test').removeClass('pass');
            $('#student_test').removeClass('fail');
            $('#student_test').removeClass('error');
            go_button.removeAttr('disabled');
        }
    })
}


// Convert the Java code textarea to CodeMirror
// Creates global variable java_codemirror so that CodeMirror object
// can be accessed from other functions
var setUpCodeMirror = function() {
    var java_textarea = $('#id_response_code')[0];
    java_codemirror = CodeMirror.fromTextArea(java_textarea,
        { mode:'text/x-java',
          lineNumbers: true,
          theme: 'eclipse',
          tabSize: 2,
          gutters: ["error-gutter", "CodeMirror-linenumbers"],
          lineWrapping: true,
          readOnly: true,
          cursorHeight: 0
        }
    );

    var test_textarea = $('#student_test_box')[0];
    test_codemirror = CodeMirror.fromTextArea(test_textarea,
        { mode:'text/x-java',
          theme: 'eclipse',
          tabSize: 2,
          gutters: ["error-gutter", "CodeMirror-linenumbers"],
          lineWrapping: true,
          lineNumbers:true,
        }
    );
    test_codemirror.setSize(null, 200);
}


// Configure the button to move to the appropriate step
var configureButtons = function() {
    var go_button = $('#go');
    if (go_button != null) {
        go_button.on('click', function(event) {
            event.preventDefault();
            if ($('#next_step #step_0 #step_pointer').length != 0) {
                generateTest();
            } else if ($('#next_step #step_1 #step_pointer').length != 0) {
                compileTest();
            } else if ($('#next_step #step_2 #step_pointer').length != 0) {
                runTestAgainstSolution();
            } else if ($('#next_step #step_3 #step_pointer').length != 0) {
                compileCode();
            } else if ($('#next_step #step_4 #step_pointer').length != 0) {
                runAgainstUserTest();
            } else if ($('#next_step #step_5 #step_pointer').length != 0) {
                runCode();
                var arrow = $('#student_test').find('.toggler');
                if (arrow.attr('src') == 'http://localhost:8000/tutor/static/tutor/down.png') {
                    toggleTestResultVisibility($('#student_test'));
                }
            }  
        });
    }

    java_codemirror.on("change", function(e) {
        if (!inTestMode()) {
            updateStep(3);
            clearResults();
            $('#student_test').addClass('summary');
            $('#student_test').removeClass('pass');
            $('#student_test').removeClass('fail');
            $('#student_test').removeClass('error');
            go_button.removeAttr('disabled');
        }
    })

    test_codemirror.on("change", function(e) {
        updateStep(1);
        clearResults();
        disableJavaBox();
        $('#student_test').addClass('summary');
        $('#student_test').removeClass('pass');
        $('#student_test').removeClass('fail');
        $('#student_test').removeClass('error');
        go_button.removeAttr('disabled');
    })

    var reset_button = $('#reset');
    if (reset_button != null) {
        reset_button.on('click', function(event) {
            event.preventDefault();
            resetCode();
        })
    }
}


// Override Ctrl-S to always take the next available step (either compile or run,
// maybe neither are available) when pressed inside the Java CodeMirror window.
var configureSave = function() {
    $('.java').bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            if (String.fromCharCode(event.which).toLowerCase() == 's') {
                event.preventDefault();
                var compile_disabled = $('#compile').attr('disabled');
                var run_disabled = $('#run').attr('disabled');
                if (compile_disabled && !run_disabled) {
                    if (inTestMode()) {
                        runTestAgainstSolution();
                    } else {
                        if ($('#next_step #step_4 #step_pointer').length != 0) {
                            runAgainstUserTest();
                        } else {
                            runCode();
                        }
                    }
                } else if (run_disabled && !compile_disabled) {
                    if (inTestMode()) {
                        compileTest();
                    } else {
                        compileCode();
                    }
                }
            }
        }
    });
}


// Underline an error in java_codemirror. The error will be underlined on
// line_number, in [start, end). Message will appear as a tooltip.
var underlineError = function(line_number, start, end, message, test) {
    var index = 0;
    if (!test) {
        var line = $('.java .code_container .CodeMirror-code pre')[line_number - 1];
        var s = java_codemirror.getLine(line_number - 1);
    } else {
        var line = $('#student_test .code_container .CodeMirror-code pre')[line_number - 1];
        var s = test_codemirror.getLine(line_number - 1);
    }
    console.log(line);
    console.log(s);
    var spans = $(line).children('span');
    spans.each(function(i, span) {
        var word = $(span).html();
        console.log(word);
        // need to update s
        //s = s.substring(index, s.length);
        index = s.indexOf(word);
        console.log(index, start, end);
        if (index >= start && index + word.length - 1 <= end) {
            $(span).addClass('underline-error');
            $(span).attr('title', message);
        }
    });
}


// Add an error marker in the gutter of java_codemirror on line_number.
// Message will appear as a tooltip.
var addError = function(line_number, message, test) {
    var error_icon = $('<img>');
    error_icon.attr('src', 'http://localhost:8000/tutor/static/tutor/error.png');
    error_icon.attr('title', message)
    error_icon.tooltip({"tooltipClass": "ui-tooltip"});
    if (test) {
        test_codemirror.setGutterMarker(line_number - 1, "error-gutter", error_icon[0]);
    } else {
        java_codemirror.setGutterMarker(line_number - 1, "error-gutter", error_icon[0]);
    }
}


// Load the code from the problem into the Java and Python CodeMirror objects.
// Sends an ajax request to the server to get the code.
var getCode = function() {
    $.post("/tutor/read",
        { csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
          name: $('h1').html().toLowerCase()
        },
    populateWithCode);
}


// Populate the Java and Python CodeMirror objects with code from server
// Code is sent as ajax in the form {"python": "xxx", "java": "xxx"}
var populateWithCode = function(result) {
    var result = $.parseJSON(result);
    var java_code = result['java'];
    var python_code = result['python'];
    var test_code = result['test'];
    $('.java .CodeMirror')[0].CodeMirror.setValue(java_code);
    setUpPairs();
    if (test_code != '') {
        test_codemirror.setValue(test_code);
        populatePairs(test_code);
    } else {
        //test_codemirror.setValue(generateDefaultTestCode($('h1').html()));
        $('#student_test div.code_container.spacing_above').hide()
    }
}

// Populate the input, output pairs with last response when the page loads
var populatePairs = function(test) {
    args = test.match(/assertEquals\((.*), .*Class..*Equals\((.*), (.*)\)\)/)
    expected = args[1]
    params = args.slice(2, args.length)
    $(".pair_text").each(function(i, e) {
        if (i < params.length) {
            $(e).val(params[i]);
        } else {
            $(e).val(expected);
        }
    })
}

// Set up the input/output pairs by reading in the parameters of
// the method to be written
var setUpPairs = function() {
    console.log("CALLED");
    updateStep(0);
    var text = $('.java .CodeMirror')[0].CodeMirror.getValue();
    var arg_string = text.match(/public static .*\((.*)\)/)[1]
    var args = arg_string.split(',');
    var args = args.map(function(e) {
        return e.trim();
    })
    for (arg in args) {
        var div = $("<div>");
        div.addClass("input");
        var span = $("<span>");
        span.addClass("pair_label");
        span.html(args[arg] + " = ");
        var input = $("<input>");
        input.addClass("pair_text");
        div.append(span);
        div.append(input);
        $("#inputs").append(div);
    }
    $(".pair_text").on('input', function(e) {
        console.log("STEP 0");
        clearResults();
        disableJavaBox();
        updateStep(0);
    })
}

// Generate the test case corresponding to the input/output pairs
var generateTest = function() {
    var expected = $('#output .pair_text')[0].value
    var text = $('.java .CodeMirror')[0].CodeMirror.getValue();
    var m = text.match('public class (.*)Class(.|\n)*public static [^\s]* ([^\(]*)');
    var name = m[1];
    var method = m[3];
    var args = $('#inputs').children(".input").map(function(i, e) {
        return $(e).children('input')[0].value;
    })
    var line = "assertEquals(" + expected + ", " + name + "Class." + method + "(";
    for (var i = 0; i < args.length; i++) {
        line += args[i];
        if (i != args.length - 1) {
            line += ", "
        }
    }
    line += "));";
    var test = "import static org.junit.Assert.*;\n"
         + "import org.junit.Test;\n\n"
         + "public class " + name + "Test {\n\n"
         + "  @Test\n"
         + "  public void yourTest() {\n"
         + "    " + line + "\n"
         + "  }\n\n"
         + "}"
    $('#student_test div.code_container.spacing_above').show();
    test_codemirror.setValue(test);
}

// Generate the template test code which should appear before a student writes
// their test case
var generateDefaultTestCode = function(name) {
    return "import static org.junit.Assert.*;\n"
         + "import org.junit.Test;\n\n"
         + "public class " + name + "Test {\n\n"
         + "  @Test\n"
         + "  public void yourTest() {\n"
         + "    // Your Code Here\n"
         + "  }\n\n"
         + "}"
}


// Reset the code to the template. First asks for confirmation that the user wants to
// reset their code, then sends an ajax request to update the current response to
// the template
var resetCode = function() {
    var msg = "Are you sure you want to reset your code? " +
              "This will revert your code back to the template and all changes will be lost."
    var res = confirm(msg);
    if (res) {
        var code = java_codemirror.getValue();
        $.post("/tutor/reset",
            { code: code,
              csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
              name: $('h1').html().toLowerCase()
            },
            parseResetResult);
    }
}


// Set the code in the Java CodeMirror to the problem template
var parseResetResult = function(result) {
    clearResults();
    java_codemirror.setValue(result);
    test_codemirror.setValue(generateDefaultTestCode($('h1').html()));
    disableJavaBox();
    updateStep(0);
    $('#go').show();
    $('#step_pointer').show();
}


// Compile the test case
var compileTest = function() {
    // Read code from java_codemirror
    var code = $('#student_test .CodeMirror')[0].CodeMirror.getValue();

    if (code.indexOf($('h1').html() + "Class") == -1) {
        clearResults();
        $('#compile').attr('disabled', 'true');
        bad_test = $('<div>');
        bad_test.html("Your test should reference the class " + $('h1').html() + "Class");
        bad_test.addClass('error');
        $('#compilation_status').append(bad_test);
    } else if (code.indexOf("assert") == -1) {
        clearResults();
        $('#compile').attr('disabled', 'true');
        bad_test = $('<div>');
        bad_test.html("Your test should contain at least one assertion");
        bad_test.addClass('error');
        $('#compilation_status').append(bad_test);
    } else {
        // Display waiting cursor
        $('#overlay').show();
        document.body.style.cursor = "wait";
        
        // Send ajax reuqest to compile code
        if (code != null){
            $.post("/tutor/compile",
                { code:code,
                  csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                  name: $('h1').html().toLowerCase(),
                  test: 'true'
                }, 
            parseTestCompileResult);
        }
    }
}


// Read in the results of the compiled test case, underlining as necessary
var parseTestCompileResult = function(result) {
    clearResults();
    
    // Parse JSON result
    var result = $.parseJSON(result);

    if (result.length == 0) {
        updateStep(2);
    }

    // Update display
    $('#compile').attr('disabled', 'true');
    displayCompilationStatus(result, true);
    displayCompilationErrors(result, true);
    
    // Done compiling. Switch back to normal cursor
    $('#overlay').hide();
    document.body.style.cursor = "auto";
}


// Compile the Java code currently in java_codemirror. This will
// 1. Display the waiting cursor
// 2. Send ajax request to server to compile code
// 3. Parse JSON results of code compilation
// 4. Either display 'Compilation Succeeded' message or
//    'Fix Errors' message along with gutter markers and underlines
var compileCode = function() {
    // Display waiting cursor
    $('#overlay').show();
    document.body.style.cursor = "wait";

    // Read code from java_codemirror
    var code = java_codemirror.getValue();

    // Send ajax reuqest to compile code
    if (code != null){
        $.post("/tutor/compile",
            { code:code,
              csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
              name: $('h1').html().toLowerCase(),
              test: 'false'
            },
        parseCompileResult);
    }
}


// Handle the compilation results passed back from the server
// as a string of JSON
var parseCompileResult = function(result) {
    clearResults();

    // If the solution doesn't match template
    if (result == 'FALSE') {
        displayDoesNotMatchTemplate();

    // Solution matched template, show compile results
    } else {
        // Parse JSON result
        var result = $.parseJSON(result);
        
        if (result.length == 0) {
            updateStep(4);
        }
        // Update display
        $('#compile').attr('disabled', 'true');
        displayCompilationStatus(result, false);
        displayCompilationErrors(result, false);
    }
    
    // Done compiling. Switch back to normal cursor
    $('#overlay').hide();
    document.body.style.cursor = "auto";
}


// Display a banner that the solution does not match provided template
var displayDoesNotMatchTemplate = function() {
    var error = $('<div>');
    error.html('Your code does not match the template. Please fix.');
    error.addClass('error');
    $('#compilation_status').append(error);
}


// Display the compilation status (succeeded or failed) below the
// java_codemirror box
var displayCompilationStatus = function(result) {
    var status = $('<div>');
    // Compilation succeeded
    if (result.length == 0) {
        $('#run').removeAttr('disabled');
        status.html("Compilation Succeeded!")
        status.addClass("pass");
    // Compilation failed
    } else {
        $('#run').attr('disabled', 'true');
        status.html("Compilation Failed. Please fix marked errors.");
        status.addClass("error");
    }
    $('#compilation_status').append(status);
}


// Display the compilation errors by adding the error icons to the
// java_codemirror gutter and underlining errors
displayCompilationErrors = function(result, test) {
    java_codemirror.clearGutter("error-gutter");
    test_codemirror.clearGutter("error-gutter");
    var errorLines = [];
    for (var i in result) {
        var error = result[i];
        // Only display one error per line
        if ($.inArray(line, errorLines) == -1) {
            var line = error['line'];
            var message = error['message'];
            var start = error['start'];
            var end = error['end'];
            addError(line, message, test);
            underlineError(line, start, end, message, test);
            errorLines.push(line);
        }
    }
}


// Run student test case against instructor solution
var runTestAgainstSolution = function() {
    // Display waiting cursor and disable run button
    $('#overlay').show();
    document.body.style.cursor = "wait";
    $('#run').attr('disabled', 'true');

    // Send ajax request to run code
    $.post("/tutor/run_test",
        { csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
          name: $('h1').html().toLowerCase(),
          solution: 'true'
        },
        parseTestRunResult
    );   
}


// Read in results of student test case run
var parseTestRunResult = function(result) {
    // hmm... this breaks if I take one of these away? No idea why
    var res = $.parseJSON(result);
    var res = $.parseJSON(res);
    var tests = res['tests'];
    clearResults();
    for (var i in tests) {
        var test = tests[i];
        test_result = $('#student_test');
        // If the test failed, check if it was a failure or error
        var test_status = $("<div>");
        if (test['trace']) {
        
            // Test failed
            if (isFailure(test)) {
                test_status.addClass('fail');
                test_status.html('Test case failed on solution:<br><br>' + getErrorMessage(test));
        
            // There was an error
            } else {
                test_status.addClass('error');
                test_status.html('Running test case produced an error:<br><br>' + getTraceSegment(test));
            }

        } else {
            test_status.addClass('pass');
            test_status.html('Test case passed against solution!')
            updateStep(3);
        }
        $('#compilation_status').append(test_status);
    }

    $('#overlay').hide();
    document.body.style.cursor = "auto"; 
}

// Run the user implementation against user test
var runAgainstUserTest = function() {
    // Display waiting cursor and disable run button
    $('#overlay').show();
    document.body.style.cursor = "wait";
    $('#run').attr('disabled', 'true');

    // Send ajax request to run code
    $.post("/tutor/run_test",
        { csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
          name: $('h1').html().toLowerCase(),
          solution: 'false'
        },
        parseUserTestRunResult
    );   
}


// Read the results of running user implementation against user test
var parseUserTestRunResult = function(result) {
    // hmm... this breaks if I take one of these away? No idea why
    var res = $.parseJSON(result);
    var res = $.parseJSON(res);
    var tests = res['tests'];
    clearResults();
    for (var i in tests) {
        var test = tests[i];
        test_result = $('#student_test');
        test_result.removeClass('summary');
        var test_status = $("<div>");
        // If the test failed, check if it was a failure or error
        if (test['trace']) {
            message = $('#student_test .message');
            //message.hide();
        
            // Test failed
            if (isFailure(test)) {
                test_status.addClass('fail');
                test_status.html('Your test case failed.');
                message.html(getErrorMessage(test));
                test_result.addClass('fail');
        
            // There was an error
            } else {
                test_status.addClass('error');
                test_status.html('Running your test case produced an error');
                message.html(getTraceSegment(test));
                test_result.addClass('error');
            }

        } else {
            test_status.addClass('pass');
            test_status.html('Your implementation passed your test case!');
            $('#run').removeAttr('disabled');
            test_result.addClass('pass');
            updateStep(5);

        }
        $('#compilation_status').append(test_status);
    }

    $('#overlay').hide();
    document.body.style.cursor = "auto"; 
}


// Run the Java test cases with the compiled code. This will
// 1. Display the waiting cursor and disable run button
// 2. Send ajax request to server to run tests
// 3. Parse JSON results of test results
// 4. Display test results
var runCode = function() {
    // Display waiting cursor and disable run button
    $('#overlay').show();
    document.body.style.cursor = "wait";
    $('#run').attr('disabled', 'true');

    // Send ajax request to run code
    $.post("/tutor/run",
        { csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
        name: $('h1').html().toLowerCase()
        },
        parseRunResult
    );
}


var parseRunResult = function(result) {
    // hmm... this breaks if I take one of these away? No idea why
    var res = $.parseJSON(result);
    var res = $.parseJSON(res);
    var tests = res['tests'];

    // Clear previous results
    clearResults();

    // Count test runs, failures, and errors
    var run = 0;
    var fail = 0;
    var error = 0;

    // Display test results, counting failures, errors, and runs
    for (var i in tests) {
        var test = tests[i];
        var outcome = displayTestResult(test, run);
        if (outcome == 'fail') {
            fail += 1;
        } else if (outcome == 'error') {
            error += 1;
        }
        run += 1;
    }

    if (fail == 0 && error == 0) {
        updateStep(6);
        success = $("<div>");
        success.html("Completed!");
        success.addClass("pass");
        $("#compilation_status").append(success)
    } else {
        f = $("<div>");
        f.html("Correct your implementation.");
        f.addClass("error");
        $("#compilation_status").append(f);
    }

    // Display test result summary
    displayTestResultSummary(run, fail, error, getFileName(test));
    showFirstErrorOrFailure();

    $('#overlay').hide();
    document.body.style.cursor = "auto"; 
}


// Expand the test result panel to show the test code as well as the message
// (in the case of a failure or error)
var showTestResultDetails = function(test_result) {
    var code_container = test_result.find('.code_container').show();
    code_container.find('.CodeMirror')[0].CodeMirror.refresh();
    test_result.find('.message').show();
    var arrow = test_result.find('.toggler');
    arrow.attr('src', 'http://localhost:8000/tutor/static/tutor/down.png');
}


// Toggle the visibility of the test result details (meaning the code as well
// as the message)
var toggleTestResultVisibility = function(test_result) {
    var code_container = test_result.find('.code_container').toggle();
    code_container.find('.CodeMirror')[0].CodeMirror.refresh();
    test_result.find('.message').toggle();
    var arrow = test_result.find('.toggler');
    if (arrow.attr('src') == 'http://localhost:8000/tutor/static/tutor/right.png') {
        arrow.attr('src', 'http://localhost:8000/tutor/static/tutor/down.png');
    } else {
        arrow.attr('src', 'http://localhost:8000/tutor/static/tutor/right.png');
    }
}


// Display a single test result. The first test failure will initially be expanded,
// and all other test result details will be hidden.
var displayTestResult = function(test, run) {
    var test_result = $("<div>");

    // Add button to show test result details
    var left = buildLeftTestResultPanel();
    test_result.append($(left));
    test_result.on('click', function(event) {
        showTestResultDetails($(this));
    });

    // Display test result details
    var right = buildRightTestResultPanel(test);
    test_result.append($(right));

    test_result.addClass("test" + run);
    test_result.addClass(getTestName(test));

    // If the test failed, check if it was a failure or error
    if (test['trace']) {
        message = $('<div>');
        message.addClass('message');
        message.hide();
        right.append(message);
        
        // Test failed
        if (isFailure(test)) {
            message.html(getErrorMessage(test));
            test_result.addClass('fail');
            var outcome = 'fail';
        
        // There was an error
        } else {
            message.html(getTraceSegment(test));
            test_result.addClass('error');
            var outcome = 'error';
        }
    } else {
        test_result.addClass('pass');
        var outcome = 'pass';
    }
    $('#test_results').append(test_result);
    return outcome;
}


// Create the left panel of the test result box
// Contains the arrow to toggle visibility
var buildLeftTestResultPanel = function() {
    var left = $("<div>");
    left.addClass("test_result_left");

    // Create right pointing arrow which, on click, shows test details
    var arrow = $('<img>');
    arrow.attr('src', 'http://localhost:8000/tutor/static/tutor/right.png');
    arrow.addClass('toggler');
    arrow.width(10);

    left.append(arrow);

    arrow.on('click', function(event) {
        event.stopPropagation();
        var tr = $(this).parent().parent();
        toggleTestResultVisibility(tr);
    });
    return left;
}


// Create the right panel of the test result box
// Contains the test name, test code, and message
var buildRightTestResultPanel = function(test) {
    var right = $("<div>");
    right.addClass("test_result_right");
    right.html(getFileName(test) + ": " + getTestName(test));

    // Create textarea to display test code
    test_box = $("<div>")
    test_box.addClass("code_container")
    test_box.addClass("spacing_above")
    textarea = $("<textarea>");
    textarea.text(test['test']);

    test_box.append(textarea);
    right.append(test_box);

    // Convert textarea to CodeMirror
    c = CodeMirror.fromTextArea(textarea[0],
        { mode:'text/x-java',
          theme: 'eclipse',
          tabSize: 2,
          lineWrapping: true,
          lineNumbers:true,
          readOnly: true
        }
    );
    c.setSize(null, 100);

    test_box.hide();
    return right;
}


// Display the test result summary, which includes the filename of the tests,
// the number of tests ran, the number of failures, and the number of errors
var displayTestResultSummary = function(run, fail, error, filename) {
    var summary = $("<div>");
    if (run == 0) {
        summary.html("No tests detected");
    } else {
        var str = "Instructor test results are shown below. " 
        if ((run - fail - error) == 1) {
            str += "1 test passed, "
        } else {
            str += (run - fail - error) + " tests passed, "
        }
        if (fail == 1) {
            str += "1 test failed, and "
        } else {
            str += fail + " tests failed, and "
        }
        if (error == 1) {
            str += "1 test contained an error."
        } else {
            str += error + " tests contained an error."
        }
        summary.html(str);
    }

    summary.addClass('summary_bar');
    $('#test_results').prepend(summary);
}


// Return a div displaying the filename
var buildTestFilenameSummary = function(filename) {
    var file = $('<div>');
    file.addClass('summary_result');
    file.html('Test File: ' + filename);
    return file;
}


// Return a div displaying the number of runs
var buildTestRunSummary = function(run) {
    var runs = $("<div>");
    runs.addClass('summary_result');
    //runs.html("");
    //var runs_count = $("<span>");
    //runs_count.html(run + "/" + run);
    //runs_count.addClass('run_count');
    //runs.append(runs_count);
    runs.html("A total of " + run + " tests were run");
    return runs;
}


// Build a div displaying the number of failures
var buildTestFailSummary = function(run, fail) {
    var failures = $("<span>");
    failures.addClass('summary_result')
    //failures.html("Failures: ");
    //var failures_count = $("<span>");
    //failures_count.html(fail + "/" + run);
    //failures_count.addClass('fail_count');
    //failures.append(failures_count);
    //failures.addClass('fail_count');
    if (fail == 1) {
        failures.html("There was 1 failure");
    } else {
        failures.html("There were " + fail + " failures");
    }
    return failures;
}


// Build a div diaplaying the number of errors
var buildTestErrorSummary = function(run, error) {
    var errors = $("<div>");
    errors.addClass('summary_result')
    //errors.html("Errors: ");
    //var errors_count = $("<span>");
    //errors_count.html(error + "/" + run);
    //errors_count.addClass('error_count');
    //errors.append(errors_count);
    if (error == 1) {
        errors.html("There was 1 error");
    } else {
        errors.html("There were " + error + " errors");
    }
    return errors;
}


// Returns true if a test is a JUnit test failure and false otherwise
var isFailure = function(test) {
    exception = test['exception']
    if (exception) {
        return /^org.junit./.test(exception) || /^java.lang.AssertionError/.test(exception);
    } else {
        return false;
    }
}


// Get the filename of a particular test
var getFileName = function(test) {
    var name = test['name'];
    return name.match('\\((.*)\\)')[1];
}


// Get the name of a particular test
var getTestName = function(test) {
    var name = test['name'];
    return name.match('(.*)\\(')[1];
}


// Get the error message for a test failure. The format will be:
// Line x: xxx.Exception: message
getErrorMessage = function(test) {
    var trace = test['trace'];
    var error = "";
    if (trace) {
        var line = trace.match(/JavaSourceString:(\d+)/g)[0].match(/\d+/)[0];
        var line_shift = test['line'];
        if (!line_shift) {
            line_shift = '1';
        }
        var new_line = 'Line ' + (line - parseInt(line_shift) + 1) + ": ";
        var message = test['exception'].replace(/</g, '&lt;').replace(/>/g, '&gt;');
        error += new_line + message;
    }
    return error;
}


// Get a shortened, more readable version of the trace.
// In particular, get rid of 'from JavaSourceString' and parse out
// the lines which are relevant to these files
var getTraceSegment = function(test) {
    var trace = test['trace']
    var name = $('h1').html();

    // Get rid of 'from JavaSourceString' and update line numbers in tests
    var r = new RegExp(name + 'Test.java from JavaSourceString:(\\d+)', 'g');
    trace.match(r).map(function(m) {
        var line = m.match(/\d+/)[0];
        var old = name + 'Test.java from JavaSourceString:' + line;
        var line_shift = test['line']
        if (!line_shift) {
            line_shift = 1;
        }
        var n = name + 'Test.java:' + (parseInt(line) - line_shift + 1);
        trace = trace.replace(old, n);
    });
    trace = trace.replace(name + 'Class.java from JavaSourceString:', name + 'Class.java:');

    // Parse out the lines which contain relevant information, replace the rest with '...'
    var lines = trace.split('\n');
    var last = 0
    var trace_segment = lines[0] + '<br>';
    for (var i = 1; i < lines.length; i++) {
        if (lines[i].search(name) >= 0) {
            trace_segment += lines[i].replace(/\t/g, "  ") + '<br>';
            last = i;
        } else {
            if (i == last + 1) {
                trace_segment += '  ...<br>'
            }
        }
    }
    return trace_segment;
}


// Display the details for the first error/failure in the test results
var showFirstErrorOrFailure = function() {
    var test_number_regex = /test(\d+)/;
    var first_error = $($('#test_results .error')[0]);
    var first = 99999999;
    if (first_error.length != 0) {
        var first_error_position = first_error.attr('class').match(test_number_regex)[1];
        first = first_error_position
    }
    var first_fail = $($('#test_results .fail')[0]);
    if (first_fail.length != 0) {
        var first_fail_position = first_fail.attr('class').match(test_number_regex)[1];
        if (first_fail_position < first) {
            first = first_fail_position;
        }
    }
    if (first < 99999999) {
        showTestResultDetails($('.test' + first));
    }
}


// Clear all previous results (compilation or test)
var clearResults = function() {
    $('#test_results').empty();
    $('#test_summary').empty();
    $('#compilation_status').empty();
}