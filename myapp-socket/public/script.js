// Make connection
var socket = io.connect('http://localhost:4000');
var uploader = new SocketIOFileUpload(socket);

//Message and error divs
var message = document.getElementById('message');
var error = document.getElementById('error');
hidemsgs();
function hidemsgs() {
    message.style.display = "none";
    error.style.display = "none";
}

// get Elements of Signup form
var name_field = document.getElementById('name_field');
var email = document.getElementById('email');
var mobile = document.getElementById('mobile');
var password = document.getElementById('password');
var address = document.getElementById('address');
var city = document.getElementById('city');
var state = document.getElementById('state');
var zip = document.getElementById('zip');
var image_name = document.getElementById('image_name');

// get elements of edit form
var edit_name_field = document.getElementById('edit_name_field');
var edit_email = document.getElementById('edit_email');
var edit_mobile = document.getElementById('edit_mobile');
var edit_password = document.getElementById('edit_password');
var edit_address = document.getElementById('edit_address');
var edit_city = document.getElementById('edit_city');
var edit_state = document.getElementById('edit_state');
var edit_zip = document.getElementById('edit_zip');
var id_field = document.getElementById('id_field');
var old_image = document.getElementById('old_image');
var new_image_name = document.getElementById('new_image_name');

$('#edit_form').hide();
var todo="add";

var uploader = new SocketIOFileUpload(socket);
uploader.addEventListener("complete", function (event) {
    // image_name.value = event.detail.base+"."+event.file.name.split('.').pop();
    // new_image_name.value = event.detail.base+"."+event.file.name.split('.').pop();

    if(todo=="add"){
        socket.emit('adduser', {
            name: name_field.value,
            email: email.value,
            mobile: mobile.value,
            password: password.value,
            address: address.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            image_name: event.detail.base+"."+event.file.name.split('.').pop()
        })
        $(':input', 'form').val('');
    } else {
        socket.emit('edituser', {
            id: id_field.value,
            name: edit_name_field.value,
            email: edit_email.value,
            mobile: edit_mobile.value,
            password: edit_password.value,
            address: edit_address.value,
            city: edit_city.value,
            state: edit_state.value,
            zip: edit_zip.value,
            image_name: event.detail.base+"."+event.file.name.split('.').pop(),
            old_image: old_image.value
        })
        $(':input', 'form').val('');
        $('.heading').text('Add User');
        $('#signup_form').show();
        $("#edit_form").hide();
    }
});
uploader.addEventListener("choose", function (event) {
});
uploader.addEventListener("start", function (event) {
    event.file.meta.hello = "World";
});
uploader.addEventListener("progress", function (event) {
    // console.log(event);
    // console.log("File is", event.bytesLoaded / event.file.size * 100, "percent loaded");
});
uploader.addEventListener("load", function (event) {
    // alert("File Loaded: " + event.file.name);
    // console.log(event);
});
uploader.addEventListener("error", function (event) {
    alert("Error: " + event.message);
    // console.log(event.message);
    if (event.code === 1) {
        alert("Don't upload such a big file");
    }
});
uploader.maxFileSize = 200000;
uploader.useBuffer = true;
uploader.chunkSize = 10240;

// Signup form
$('#signup_form').validate({
    rules: {
        name: 'required',
        mobile: {
            required: true,
            number: true,
            minlength: 10,
        },
        email: {
            required: true,
            email: true,
        },
        password: {
            required: true,
            minlength: 8,
        },
        address: 'required',
        city: 'required',
        state: 'required',
        zip: {
            required: true,
            minlength: 6,
            number: true
        },
        image_name: 'required'

    },
    messages: {
        name: 'Name is required',
        mobile: 'Mobile must be 10 digits',
        user_email: 'Enter a valid email',
        password: {
            minlength: 'Password must be at least 8 characters long'
        },
        address: 'This field is required',
        city: 'This field is required',
        state: 'This field is required',
        zip: 'Zip Must be 6 digits',
        image_name: 'Please upload an image'
    },
    submitHandler: function (form) {
        todo="add";
        uploader.prompt();
    }
});

// Edit form
$('#edit_form').validate({
    rules: {
        edit_name: 'required',
        edit_mobile: {
            required: true,
            number: true,
            minlength: 10,
        },
        edit_email: {
            required: true,
            email: true,
        },
        edit_password: {
            required: true,
            minlength: 8,
        },
        edit_address: 'required',
        edit_city: 'required',
        edit_state: 'required',
        edit_zip: {
            required: true,
            minlength: 6,
            number: true
        },
        new_image: 'required'

    },
    messages: {
        edit_name: 'Name is required',
        edit_mobile: 'Mobile must be 10 digits',
        edit_email: 'Enter a valid email',
        edit_password: {
            minlength: 'Password must be at least 8 characters long'
        },
        edit_address: 'This field is required',
        edit_city: 'This field is required',
        edit_state: 'This field is required',
        edit_zip: 'Zip Must be 6 digits',
        new_image: 'Please upload an image'
    },
    submitHandler: function () {
        todo="edit"
        uploader.prompt();
    }
});

// Prvent form from submit
$('form').submit(function (e) {
    e.preventDefault();
})

// document.getElementById("image").addEventListener("click", function(){
//     uploader.prompt();
// }, false);

// document.getElementById("new_image").addEventListener("click", function(){
//     uploader.prompt();
// }, false);

// function senddata() {
//         socket.emit('adduser', {
//             name: name_field.value,
//             email: email.value,
//             mobile: mobile.value,
//             password: password.value,
//             address: address.value,
//             city: city.value,
//             state: state.value,
//             zip: zip.value,
//             image_name: image_name.value
//         })
//         $(':input', 'form').val('');
// }

// function editdata() {
//     uploader.prompt();
//     setTimeout(function(){
//         socket.emit('edituser', {
//             id: id_field.value,
//             name: edit_name_field.value,
//             email: edit_email.value,
//             mobile: edit_mobile.value,
//             password: edit_password.value,
//             address: edit_address.value,
//             city: edit_city.value,
//             state: edit_state.value,
//             zip: edit_zip.value,
//             image_name: new_image_name.value,
//             old_image: old_image.value
//         })
//         $(':input', 'form').val('');
//         $('.heading').text('Add User');
//         $('#signup_form').show();
//         $("#edit_form").hide();      
//     }, 5000);
// }

$('.adduserbtn').click(function () {
    hidemsgs();
    $('.heading').text('Add User');
    $('#signup_form').show();
    $("#edit_form").hide();
})

$('tbody').on('click', 'tr td .deletebtn', function () {
    $('#edit_form').hide();
    $('#signup_form').show();

    var mob = $(this).closest('tr').find('td:eq(2)').text();
    var oldimage = $(this).prev().prev().text();
    socket.emit('deleterow', { mobile: mob, oldimage: oldimage });
    hidemsgs();
})

$('tbody').on('click', 'tr td .editbtn', function () {
    hidemsgs();
    $('.heading').text('Edit User');
    $('#signup_form').hide();
    $('#edit_form').show();
    id_field.value = $(this).next().next().text();
    edit_name_field.value = $(this).closest('tr').find('td:eq(0)').text();
    edit_email.value = $(this).closest('tr').find('td:eq(1)').text();
    edit_mobile.value = $(this).closest('tr').find('td:eq(2)').text();
    edit_password.value = $(this).closest('tr').find('td:eq(3)').text();
    edit_address.value = $(this).closest('tr').find('td:eq(4)').text();
    edit_city.value = $(this).closest('tr').find('td:eq(5)').text();
    edit_state.value = $(this).closest('tr').find('td:eq(6)').text();
    edit_zip.value = $(this).closest('tr').find('td:eq(7)').text();
    old_image.value = $(this).next().text();
})

//Handle Message and Error Divs
socket.on('message', function (msg) {
    message.style.display = "block";
    error.style.display = "none";
    message.textContent = msg;
})

socket.on('error', function (msg) {
    message.style.display = "none";
    error.style.display = "block";
    message.textContent = msg;
})

//Load users from mysql table
socket.on('rows', function (data) {
    $('tbody').empty();
    for (var i = 0; i < data.length; i++) {
        var str = "<tr>"
            + "<td>" + data[i].Name + "</td>"
            + "<td>" + data[i].Email + "</td>"
            + "<td>" + data[i].Mobile + "</td>"
            + "<td>" + data[i].Password + "</td>"
            + "<td>" + data[i].Address + "</td>"
            + "<td>" + data[i].City + "</td>"
            + "<td>" + data[i].State + "</td>"
            + "<td>" + data[i].Zip + "</td>"
            + "<td><img  class='w-100' src='uploads/" + data[i].Image + "'></td>"
            + "<td><button class='btn btn-small btn-warning mx-1 editbtn'>Edit</button><span class='d-none'>" + data[i].Image + "</span><span class='d-none'>" + data[i].id + "</span><button class='btn btn-small btn-danger mx-1 deletebtn'>Delete</button></td>"
            + "</tr>"
        $('tbody').append(str);
    }
})