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
    $('#studentName').focus();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddStudentForm();
}

/**
 *  retrieveData - Event Handler when user clicks the Retrieve Data From Server button, this will clear out the student table and repopulate it with data from the server
 */
function retrieveData() {
    reset();
    student_array = [];

    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        method: 'post',
        data: {
            api_key: 'z9KW32X6Ky'
        },
        success: function (response) {
            console.log('great success');
            for(var i = 0; i < response.data.length; i++){
                var student_info = {
                    studentName: response.data[i].name,
                    course: response.data[i].course,
                    studentGrade: response.data[i].grade
                };
                student_array.push(student_info);
            }
            updateData();
        },
        error: function (response) {
            console.log('you lose');
        }
    });
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
    var sum = 0;
    for(var i = 0; i < student_array.length; i++){
        sum += parseInt(student_array[i].studentGrade);
    }
    return Math.round(sum / student_array.length);
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
    if(student_array.length === 0){
        reset();
    }else{
        // for each element in the global variable student_array add each
        $('tbody').empty();
        for(var i = 0; i < student_array.length; i++){
            addStudentToDom(student_array[i]);
        }
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

    $deleteButton.click(function () {
        // console.log('index of parent of this',$(this).parent().index());
        var indexOfRow = $(this).parent().index();
        removeStudent(indexOfRow);
    });
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
    clearAddStudentForm();

    //need to add initialized average and data in student table
    $('.avgGrade').text(0);     //put an average of zero in grade average

    //add an initial response to the grade table prior to student information being entered
    $('tbody').empty();     //empty out the table body
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