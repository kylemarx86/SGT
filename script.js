/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = [];

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    //when clicked the add clicked should create a student object
    addStudent();
    updateData();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm();
}

/**
 * addStudent - creates a student object based on input fields in the form and adds the object to global student array
 * @global {array}
 * @return undefined ***********************************************QUESTION
 */
function addStudent() {
    var studentInfo = {
        studentName: $('#studentName').val(),
        course: $('#course').val(),
        studentGrade: $('#studentGrade').val(),
    };

    student_array.push(studentInfo);
    inputIds.push(studentInfo.length);

    clearAddStudentForm();
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    if(student_array.length === 0){
        return 0;
    }else{
        var sum = 0;
        for(var i = 0; i < student_array.length; i++){
            sum += parseInt(student_array[i].studentGrade);
        }
        return Math.round(sum / student_array.length);
    }
}

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    $('.avgGrade').text(calculateAverage());   //set DOM element's text equal to the value of the calculated average
    updateStudentList();
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    // for each element in the global variable student_array add each
    $('tbody').empty();
    for(var i = 0; i < student_array.length; i++){
        (function () {              //creating the closure allows me to pass the variable i (saved as studentId) to the inner function
            var studentId = i;
            addStudentToDom(student_array[studentId]);

            var $deleteButton = $('button.btn-danger');
            $deleteButton.click(function () {
                removeStudent(studentId);
            });
        })()
    }
}

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj) {
    $('tbody').append('<tr></tr>');
    $('tbody tr:last').append('<td>' + studentObj.studentName + '</td>');
    $('tbody tr:last').append('<td>' + studentObj.course + '</td>');
    $('tbody tr:last').append('<td>' + studentObj.studentGrade + '</td>');
    var $deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
    $('tbody tr:last').append($deleteButton);
}

/**
 * removeStudent - removes a given student from the student_array, then updates the list of students on the DOM
 * @param {number} studentId
 */
function removeStudent(studentId) {
    student_array.splice(studentId, 1);
    updateData();
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
    console.log('document loaded','page reset');
    clearAddStudentForm();

    //need to add initialized average and data in student table
    $('.avgGrade').text(0);     //put an average of zero in grade average

    $('tbody').empty();

    //add an initial response to the grade table prior to student information being entered
    var $initialRow = $('<tr>');
    var $initialDivision = $('<td>').attr('colspan',4);
    var $textElement = $('<h2>').text('User Info Unavailable');

    $initialDivision.append($textElement);
    $initialRow.append($initialDivision);
    $('tbody').append($initialRow);
}


/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function() {
    reset();
});