/**
 * Define all global variables here
 */
/**
 * grade_array - global array to hold student objects
 * @type {Array}
 */
var grade_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = [];

/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function() {
    reset();
    retrieveData();
    autorepopulateStudentFields();
});


/**
 * addClicked - Event Handler when user clicks the add button
 */
function addGradeClicked() {
    //when clicked the add clicked should create a student object
    addGrade();
    updateData();
    // $('#studentName').focus();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    clearAddGradeForm();
}

/**
 *  retrieveData - Event Handler when user clicks the Retrieve Data From Server button, this will clear out the student table and repopulate it with data from the server
 */
function retrieveData() {
    reset();
    autorepopulateStudentFields();
    grade_array = [];

    $.ajax({
        dataType: 'json',
        url: 'read.php',
        method: 'post',
        data: {
            // api_key: 'z9KW32X6Ky'
        },
        success: function (response) {
            console.log(response);
            if(response.success){
                for (var i = 0; i < response.data.length; i++) {
                    var student_info = {
                        name: response.data[i].student,
                        course: response.data[i].course,
                        grade: response.data[i].grade
                    };
                    grade_array.push(student_info);
                    inputIds[i] = response.data[i].ID;
                }
                $('#statusBar').text('Student grade table successfully loaded.').removeClass('alert-success alert-warning').addClass('alert-info');
                updateData();
            }else{
                //update the status bar
                $('#statusBar').text('Failed to load student grade table. ').removeClass('alert-success alert-info').addClass('alert-warning');
                for(var i = 0; i < response.error.length; i++){
                    $('#statusBar').append('<p>' + response.error[i] + '</p>');
                }
            }
        },
        error: function (response) {
            console.log(response);
            //update the status bar
            $('#statusBar').text('Failed to load student grade table').removeClass('alert-success alert-info').addClass('alert-warning');
            for(var i = 0; i < response.error.length; i++){
                $('#statusBar').append('<p>' + response.error[i] + '</p>');
            }
        }
    });
}

/**
 * addStudent - creates a student object based on input fields in the form and adds the object to global student array
 * @global {array}
 * @return undefined ***********************************************QUESTION
 */
function addGrade() {
    //data to keep locally
    var studentInfo = {
        name: $('#studentName').val(),
        course: $('#course').val(),
        grade: $('#studentGrade').val(),
    };
    //data to send the server
    var formData = {
        // api_key: 'z9KW32X6Ky',   //old
        name: studentInfo.name,
        course: studentInfo.course,
        grade: parseInt(studentInfo.grade)
    };
    $.ajax({
        dataType: 'json',
        // url: 'http://s-apis.learningfuze.com/sgt/create',   //old
        url: 'add_grade.php',   //new
        method: 'post',
        data: formData,
        success: function (response) {
            if(response.success){
                //update status bar
                $('#statusBar').text(studentInfo.name + ' was successfully added').removeClass('alert-warning alert-info').addClass('alert-success');
                //add student info to array of students
                grade_array.push(studentInfo);
                //add student id to array of inputIds
                    //need to amend this
                inputIds.push(response.new_id);
                //update the DOM with list of students
                updateData();
            }else{
                //update the status bar
                $('#statusBar').text('Failed to add grade for student' + studentInfo.name + '.').removeClass('alert-success alert-info').addClass('alert-warning');
                for(var i = 0; i < response.errors.length; i++){
                    $('#statusBar').append('<p>' + response.errors[i] + '</p>');
                }
                // console.log(response.errors);
            }
        },
        error: function (response) {
            //update the status bar
            $('#statusBar').text('Failed to add ' + studentInfo.name).removeClass('alert-success alert-info').addClass('alert-warning');
            for(var i = 0; i < response.error.length; i++){
                $('#statusBar').append('<p>' + response.error[i] + '</p>');
            }
            // console.log(response);
        }
    });

    clearAddGradeForm();              //empty out the add student form
    autorepopulateStudentFields();      //for testing and ease of use
}

/**
 * removeGrade - removes a given student from the grade_array, then updates the list of students on the DOM
 * @param {number} rowIndex
 */
function removeGrade(rowIndex) {
    var studentId = inputIds[rowIndex];

    var formData = {
        // api_key: 'z9KW32X6Ky',   //old
        student_id: studentId
    };

    $.ajax({
        dataType: 'json',
        // url: 'https://s-apis.learningfuze.com/sgt/delete',  //old
        url: 'delete_grade.php',
        method: 'post',
        data: formData,
        success: function (response) {
            if(response.success){
                console.log(response);
                //update status bar (remember student has been removed remotely but not locally)
                $('#statusBar').text('Student ' + grade_array[rowIndex].name + ' successfully removed').removeClass('alert-info alert-warning').addClass('alert-success');
                //remove the student locally
                grade_array.splice(rowIndex, 1);
                inputIds.splice(rowIndex, 1);
                //update the DOM
                updateData();
            }else{
                console.log(response);
                $('#statusBar').text('Could not remove student ' + grade_array[rowIndex].name).removeClass('alert-success alert-success').addClass('alert-warning');
                for(var i = 0; i < response.errors.length; i++){
                    $('#statusBar').append('<p>' + response.errors[i] + '</p>');
                }
                //change the text of the button that was clicked back to delete
                $('tbody').find('button').eq(rowIndex).text('Delete');

                //old attempts to change the wording of the delete button
                // $('tbody').find('button:eq(rowIndex)').text('Delete');    //
                // $('tr').eq(rowIndex).find('button').text('Delete');    //
                // $('tr:eq(rowIndex) > button').text('Delete');            //
                // $('tbody > button:eq(rowIndex)').text('Delete');    //button is not the direct descendant of of the tbody, it is of the tr
                // $('tbody > button:eq(rowIndex)').text('Delete');         //button is not the direct descendant of of the tbody, it is of the tr
                // $('button.btn-danger:nth-of-type(rowIndex)').text('Delete');    //
            }
        },
        error: function(response){
            console.log(response);
            //update status bar
            $('#statusBar').text('Could not remove student ' + grade_array[rowIndex].name).removeClass('alert-success alert-success').addClass('alert-warning');
            for(var i = 0; i < response.error.length; i++){
                $('#statusBar').append('<p>' + response.error[i] + '</p>');
            }
            //change the text of the button that was clicked back to delete
            $('tbody').find('button').eq(rowIndex).text('Delete');
        }
    });
}

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    $('.avgGrade').text(calculateAverage());   //set DOM element's text equal to the value of the calculated average
    updateStudentList();
}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    var sum = 0;
    for(var i = 0; i < grade_array.length; i++){
        sum += parseInt(grade_array[i].grade);
    }
    return Math.round(sum / grade_array.length);
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    if(grade_array.length === 0){
        reset();
    }else{
        // for each element in the global variable grade_array add each
        $('tbody').empty();
        for(var i = 0; i < grade_array.length; i++){
            addGradeToDom(grade_array[i]);
        }
    }
}

/**
 * addGradeToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addGradeToDom(studentObj) {
    $('tbody').append('<tr></tr>');
    $('tbody tr:last').append('<td>' + studentObj.name + '</td>');
    $('tbody tr:last').append('<td>' + studentObj.course + '</td>');
    $('tbody tr:last').append('<td>' + studentObj.grade + '</td>');
    var $deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
    $('tbody tr:last').append('<td>' + $deleteButton+ '</td>>');
    //old
    // var $editButton = $('<button>').addClass('btn btn-warning').attr({type:'button','data-toggle':'modal', 'data-target':'#editModal'}).text('Edit');
    var $editButton = $('<button>').addClass('btn btn-warning').attr({type:'button','data-toggle':'modal'}).text('Edit');
    $('tbody tr:last').append('<td>' + $editButton + '</td>');

    $deleteButton.click(function () {
        var indexOfRow = $(this).parent().index();
        removeGrade(indexOfRow);
        //the rest will happen after ajax call sent but before the success of that call (since call will take time to complete)
        //change the status of delete button
        $(this).text('Deleting');
    });
    $editButton.click(function () {
        var row = $(this).parent();
        // var indexOfRow = $(this).parent().index();
        var indexOfRow = row.index();

        console.log('this student: ', grade_array[indexOfRow].name);
        console.log('this course: ', grade_array[indexOfRow].course);
        console.log('this grade: ', grade_array[indexOfRow].grade);
        // console.log('edit button clicked');
        var modal = $('#editModal');
        modal.modal('show');
        $('#modalStudentName').val(grade_array[indexOfRow].name);
        $('#modalCourse').val(grade_array[indexOfRow].course);
        $('#modalStudentGrade').val(grade_array[indexOfRow].grade);

        // $('#modalCourse').attr(placeholder, )

        //write code for edit here
        //create modal for info to edit with submit button. submit button should check to see if


    });
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
    clearAddGradeForm();

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
 * clearAddGradeForm - clears out the form values based on inputIds variable
 */
function clearAddGradeForm() {
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}

/**
 * Autopopulates the add student field with randomly generated south park characters, activities, and grades. will also place the focus on the add button.
 */
function autorepopulateStudentFields(){
    var characterArray = ['Stan Marsh', 'Kyle Broflovski', 'Eric Cartman', 'Kenny McCormick', 'Butters Stotch', 'Wendy Testaburger'];
    var activityArray = ['Chili cooking', 'Saving Imaginationland', 'Peruvian Pan Fluting', 'Eating Cheesy Poofs', 'Killing Kenny', 'Tap Dancing Accidents'];

    var randomCharacter = characterArray[Math.floor(Math.random() * characterArray.length)];
    var randomActivity = activityArray[Math.floor(Math.random() * activityArray.length)];
    var randomGrade = Math.floor(Math.random() * 100 + 1);

    $('#studentName').val(randomCharacter);
    $('#course').val(randomActivity);
    $('#studentGrade').val(randomGrade);
    $('button.btn-success').focus();
}