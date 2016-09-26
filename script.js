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
function addClicked() {
    //when clicked the add clicked should create a student object
    addStudent();
    updateData();
    // $('#studentName').focus();
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
    autorepopulateStudentFields();
    student_array = [];

    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        method: 'post',
        data: {
            api_key: 'z9KW32X6Ky'
        },
        success: function (response) {
            if(response.success){
                console.log('great success');
                for (var i = 0; i < response.data.length; i++) {
                    var student_info = {
                        name: response.data[i].name,
                        course: response.data[i].course,
                        grade: response.data[i].grade
                    };
                    student_array.push(student_info);
                    inputIds[i] = response.data[i].id;
                }
                $('#statusBar').text('Student grade table successfully loaded').removeClass('alert-success alert-warning').addClass('alert-info');
                updateData();
            }else{
                //update the status bar
                $('#statusBar').text('Failed to load student grade table').removeClass('alert-success alert-info').addClass('alert-warning');
                for(var i = 0; i < response.error.length; i++){
                    $('#statusBar').append('<p>' + response.error[i] + '</p>');
                }
            }
        },
        error: function (response) {
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
function addStudent() {
    //data to keep locally
    var studentInfo = {
        name: $('#studentName').val(),
        course: $('#course').val(),
        grade: $('#studentGrade').val(),
    };
    //data to send the server
    var formData = {
        api_key: 'z9KW32X6Ky',
        name: studentInfo.name,
        course: studentInfo.course,
        grade: parseInt(studentInfo.grade)
    };
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        method: 'post',
        data: formData,
        success: function (response) {
            // console.log(response);
            if(response.success){
                //update status bar
                $('#statusBar').text(studentInfo.name + ' was successfully added').removeClass('alert-warning alert-info').addClass('alert-success');
                //add student info to array of students
                student_array.push(studentInfo);
                //add student id to array fo inputIds
                inputIds.push(response.new_id);
                //update the DOM with list of students
                updateData();
            }else{
                //update the status bar
                $('#statusBar').text('Failed to add ' + studentInfo.name).removeClass('alert-success alert-info').addClass('alert-warning');
                for(var i = 0; i < response.error.length; i++){
                    $('#statusBar').append('<p>' + response.error[i] + '</p>');
                }
            }
        },
        error: function (response) {
            //update the status bar
            $('#statusBar').text('Failed to add ' + studentInfo.name).removeClass('alert-success alert-info').addClass('alert-warning');
            for(var i = 0; i < response.error.length; i++){
                $('#statusBar').append('<p>' + response.error[i] + '</p>');
            }
        }
    });

    clearAddStudentForm();              //empty out the add student form
    autorepopulateStudentFields();      //for testing and ease of use
}

/**
 * removeStudent - removes a given student from the student_array, then updates the list of students on the DOM
 * @param {number} rowIndex
 */
function removeStudent(rowIndex) {
    var studentId = inputIds[rowIndex];

    var formData = {
        api_key: 'z9KW32X6Ky',
        student_id: studentId
    };

    $.ajax({
        dataType: 'json',
        url: 'https://s-apis.learningfuze.com/sgt/delete',
        method: 'post',
        data: formData,
        success: function (response) {
            if(response.success){
                //update status bar (remember student has been removed remotely but not locally)
                $('#statusBar').text('Student ' + student_array[rowIndex].name + ' successfully removed').removeClass('alert-info alert-warning').addClass('alert-success');
                //remove the student locally
                student_array.splice(rowIndex, 1);
                inputIds.splice(rowIndex, 1);
                //update the DOM
                updateData();
            }else{
                $('#statusBar').text('Could not remove student ' + student_array[rowIndex].name).removeClass('alert-success alert-success').addClass('alert-warning');
                for(var i = 0; i < response.error.length; i++){
                    $('#statusBar').append('<p>' + response.error[i] + '</p>');
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
            //update status bar
            $('#statusBar').text('Could not remove student ' + student_array[rowIndex].name).removeClass('alert-success alert-success').addClass('alert-warning');
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
    for(var i = 0; i < student_array.length; i++){
        sum += parseInt(student_array[i].grade);
    }
    return Math.round(sum / student_array.length);
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
    $('tbody tr:last').append('<td>' + studentObj.name + '</td>');
    $('tbody tr:last').append('<td>' + studentObj.course + '</td>');
    $('tbody tr:last').append('<td>' + studentObj.grade + '</td>');
    var $deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
    $('tbody tr:last').append($deleteButton);

    $deleteButton.click(function () {
        // console.log('index of parent of this',$(this).parent().index());
        var indexOfRow = $(this).parent().index();
        removeStudent(indexOfRow);
        //the rest will happen after ajax call sent but before the success of that call (since call will take time to complete)
        //change the status of delete button
        $(this).text('Deleting');
    });
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
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}

/**
 * Autopopulates the add student field with randomly generated south park characters, activities, and grades. will also place the focus on the add button.
 */
function autorepopulateStudentFields(){
    var characterArray = ['Stan Marsh', 'Kyle Broflovski', 'Eric Cartman', 'Kenny McCormick', 'Butters Stotch', 'Wendy Testaburger'];
    var activityArray = ['Chili cooking', 'Saving ImaginationLand', 'Peruvian Pan Fluting', 'Eating Cheesy Poofs', 'Killing Kenny', 'Tap Dancing Accidents'];

    var randomCharacter = characterArray[Math.floor(Math.random() * characterArray.length)];
    var randomActivity = activityArray[Math.floor(Math.random() * activityArray.length)];
    var randomGrade = Math.floor(Math.random() * 100 + 1);

    $('#studentName').val(randomCharacter);
    $('#course').val(randomActivity);
    $('#studentGrade').val(randomGrade);
    $('button.btn-success').focus();
}