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

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    console.log('add clicked');
    //when clicked the add clicked should create a student object

    //then add the student object to the
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    console.log('cancel clicked');
}

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent() {
    var studentInfo = {
        studentName: $('#studentName').val(),
        course: $('#course').val(),
        studentGrade: $('#studentGrade').val()
    };
    student_array.push(studentInfo);
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */

/**
 * updateData - centralized function to update the average and call student list update
 */

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
    console.log('document loaded','page reset');
    //add click handlers for buttons
    $('button.btn-success').click(addClicked);
    $('button.btn-default').click(cancelClicked);
}


/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function() {
    reset();
});