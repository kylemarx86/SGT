/**
 * grade_array - global array to hold grade objects
 * @type {Array}
 */
var grade_array = [];

/**
 * inputIds - IDs of the elements that are used to add grades
 * @type {number[]}
 */
var inputIds = [];

/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function() {
    retrieveData();
    $("input[name='auto_fill']").click(changeAutoRepopulateState);
});


/**
 * addClicked - Event Handler when user clicks the add button
 */
function addGradeClicked() {
    //when clicked the add clicked should create a grade object
    addGrade();
    updateData();
    // $('#studentName').focus();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button. clear out grade form
 */
function cancelClicked() {
    clearAddGradeForm();
}

/**
 *  retrieveData - Event Handler when user clicks the Retrieve Data From Server button, this will clear out the grade table and repopulate it with data from the server
 */
function retrieveData() {
    reset();
    prepareGradeForm();
    grade_array = [];

    $.ajax({
        dataType: 'json',
        url: 'read.php',
        method: 'post',
        success: function (response) {
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
                $('#statusBar').text('Failed to load student grade table.').removeClass('alert-success alert-info').addClass('alert-warning');
                for(var i = 0; i < response.errors.length; i++){
                    $('#statusBar').append('<p>' + response.errors[i] + '</p>');
                }
            }
        },
        error: function (response) {
            //update the status bar
            $('#statusBar').text('Failed to load student grade table.').removeClass('alert-success alert-info').addClass('alert-warning');
            $('#statusBar').append('<p>Could not connect to server.</p>');
            
        }
    });
}

/**
 * addStudent - creates a student object based on input fields in the form and adds the object to global student array
 * @global {array}
 * @return none
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
        name: studentInfo.name,
        course: studentInfo.course,
        grade: parseInt(studentInfo.grade)
    };
    $.ajax({
        dataType: 'json',
        url: 'add_grade.php',
        method: 'post',
        data: formData,
        success: function (response) {
            if(response.success){
                //update status bar
                $('#statusBar').text(studentInfo.name + ' was successfully added').removeClass('alert-warning alert-info').addClass('alert-success');
                //add student info to array of students
                grade_array.push(studentInfo);
                //add student id to array of inputIds
                    //look into the naming of this variable (new_id)
                inputIds.push(response.new_id);
                //update the DOM with list of students
                updateData();
            }else{
                //update the status bar
                $('#statusBar').text('Failed to add grade for student ' + studentInfo.name + '.').removeClass('alert-success alert-info').addClass('alert-warning');
                for(var i = 0; i < response.errors.length; i++){
                    $('#statusBar').append('<p>' + response.errors[i] + '</p>');
                }
            }
        },
        error: function (response) {
            //update the status bar
            $('#statusBar').text('Failed to add grade for student ' + studentInfo.name + '.').removeClass('alert-success alert-info').addClass('alert-warning');
            $('#statusBar').append('<p>Unable to reach server.</p>');
        }
    });
    //either populate the grade form or empty it out
    prepareGradeForm();
}
/**
 * editGradeInfo - method to edit an existing grade in the db
 */
function editGradeInfo(rowIndex) {
    //data to keep locally
    var gradeInfo = {
        id: inputIds[rowIndex],
        name: $('#modalStudentName').val(),
        course: $('#modalCourse').val(),
        grade: $('#modalStudentGrade').val(),
    };   
    //data to send the server
    var formData = {
        id: inputIds[rowIndex],
        grade: parseInt(gradeInfo.grade)
    };

    $.ajax({
        dataType: 'json',
        url: 'edit_grade.php',
        method: 'post',
        data: formData,
        success: function (response) {
            if(response.success){
                //update student info in array of students
                grade_array[rowIndex].grade = response.new_grade;
                //update the DOM with list of students
                updateData();
                //update status bar
                $('#statusBar').text('Grade for ' + gradeInfo.name + ' was successfully edited.').removeClass('alert-warning alert-info').addClass('alert-success');
            }else{
                //update the status bar
                $('#statusBar').text('Failed to edit student info for ' + gradeInfo.name + '.').removeClass('alert-success alert-info').addClass('alert-warning');
                for(var i = 0; i < response.errors.length; i++){
                    $('#statusBar').append('<p>' + response.errors[i] + '</p>');
                }
            }
        },
        error: function (response) {
            //update the status bar
            $('#statusBar').text('Failed to edit student info for ' + gradeInfo.name + '.').removeClass('alert-success alert-info').addClass('alert-warning');
            $('#statusBar').append('<p>Could not connect to server.</p>');
        }
    });
}
/**
 * removeGrade - removes a given student from the grade_array, then updates the list of students on the DOM
 * @param {number} rowIndex
 */
function removeGrade(rowIndex) {
    var studentId = inputIds[rowIndex];

    var formData = {
        student_id: studentId
    };

    $.ajax({
        dataType: 'json',
        url: 'delete_grade.php',
        method: 'post',
        data: formData,
        success: function (response) {
            if(response.success){
                //update status bar (remember student has been removed remotely but not locally)
                $('#statusBar').text('Student ' + grade_array[rowIndex].name + ' successfully removed').removeClass('alert-info alert-warning').addClass('alert-success');
                //remove the student locally
                grade_array.splice(rowIndex, 1);
                inputIds.splice(rowIndex, 1);
                //update the DOM
                updateData();
            }else{
                $('#statusBar').text('Could not remove student ' + grade_array[rowIndex].name).removeClass('alert-success alert-success').addClass('alert-warning');
                for(var i = 0; i < response.errors.length; i++){
                    $('#statusBar').append('<p>' + response.errors[i] + '</p>');
                }
                //change the text of the button that was clicked back to delete
                $('tbody').find('button.btn-danger').eq(rowIndex).text('Delete');
            }
        },
        error: function(response){
            //update status bar
            $('#statusBar').text('Could not remove student ' + grade_array[rowIndex].name).removeClass('alert-success alert-success').addClass('alert-warning');
            $('#statusBar').append('<p>Could not connect to server.</p>');
            //change the text of the button that was clicked back to delete
            $('tbody').find('button.btn-danger').eq(rowIndex).text('Delete');
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
    var $deleteButtonTd = $('<td>').append($deleteButton);
    $('tbody tr:last').append($deleteButtonTd);

    var $editButton = $('<button>').addClass('btn btn-warning').attr({type:'button','data-toggle':'modal'}).text('Edit');
    var $editButtonTd = $('<td>').append($editButton);
    $('tbody tr:last').append($editButtonTd);

    $deleteButton.click(function () {
        var indexOfRow = $(this).parent().parent().index();
        $(this).text('Deleting');
        removeGrade(indexOfRow);
    });
    $editButton.click(function () {
        var indexOfRow = $(this).parent().parent().index();

        var modal = $('#editModal');
        modal.modal('show');
        $('#modalStudentName').val(grade_array[indexOfRow].name);
        $('#modalCourse').val(grade_array[indexOfRow].course);
        $('#modalStudentGrade').val(grade_array[indexOfRow].grade);

        $('#submit').click(function(){
            editGradeInfo(indexOfRow);
        });
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
 * Autopopulates the add grade fields with randomly generated Marvel characters, activities, and grades. will also place the focus on the add button.
 */
function autorepopulateStudentFields(){
    var characterArray = ['Peter Parker', 'Donald Blake', 'Robert Bruce Banner', 'Natasha Romanoff', 'Clint Barton', 'Janet van Dyne', 'Henry Pym', 'Anthony Stark', 'Jacques Duquesne'];
    var activityArray = ['Web Slinging', 'Wall Crawling', 'Hammer Throwing', 'Thundering', 'Smashing', 'Espionage', 'Archery', 'Flying', 'Stinging', 'Shrinking', 'Growing', 'Sword Fighting', 'Engineering'];
    
    var randomCharacter = characterArray[Math.floor(Math.random() * characterArray.length)];
    var randomActivity = activityArray[Math.floor(Math.random() * activityArray.length)];
    var randomGrade = Math.floor(Math.random() * 100 + 1);

    $('#studentName').val(randomCharacter);
    $('#course').val(randomActivity);
    $('#studentGrade').val(randomGrade);
    $('button.btn-success').focus();
}

/**
 * method to change the fields of the grade form based on whether or not auto-fill is on
 */
function changeAutoRepopulateState(){
    if(this.value === 'on'){
        autorepopulateStudentFields();
    }else{
        clearAddGradeForm();
    }
}

/**
 * method to determine if a new random student's information should be into the grade form
 */
function prepareGradeForm(){
    if($("input[name='auto_fill']:checked").val() === 'on'){
        autorepopulateStudentFields();
    }else{
        clearAddGradeForm();
    }
}