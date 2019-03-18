// Make connection
var socket = io.connect('http://localhost:3000');

$('#edit_form').hide();
var todo = "add";

var uploader = new SocketIOFileUpload(socket);
uploader.addEventListener("complete", function (event) {
    if (todo == "add") {
        var x = $("#signup_form").serializeArray();
        var result = {};
        $.each(x, function (i, field) {
            result[field.name] = field.value;
        });
        result.image_name = event.detail.base + "." + event.file.name.split('.').pop();
        socket.emit('adduser', result);
        $(':input', 'form').val('');
    } else {
        var x = $("#edit_form").serializeArray();
        var userdata = {};
        $.each(x, function (i, field) {
            userdata[field.name] = field.value;
        });
        userdata.image_name = event.detail.base + "." + event.file.name.split('.').pop();
        socket.emit('edituser', userdata)
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
    swal(event.message, "", "error");
    if (event.code === 1) {
        swal("Too Big", "Don't upload such a big file", "error");
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
        todo = "add";
        uploader.prompt();
    }
});

// Edit form
$('#edit_form').validate({
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
        old_image: 'required',
        id: 'required'
    },
    messages: {
        name: 'Name is required',
        mobile: 'Mobile must be 10 digits',
        email: 'Enter a valid email',
        password: {
            minlength: 'Password must be at least 8 characters long'
        },
        address: 'This field is required',
        city: 'This field is required',
        state: 'This field is required',
        zip: 'Zip Must be 6 digits',
    },
    submitHandler: function () {
        todo = "edit"
        uploader.prompt();
    }
});

// Prevent form from submit
$('form').submit(function (e) {
    e.preventDefault();
})

$('.adduserbtn').click(function () {
    $('.heading').text('Add User');
    $('#signup_form').show();
    $("#edit_form").hide();
})

$('tbody').on('click', 'tr td .deletebtn', function () {
    $('#edit_form').hide();
    $('#signup_form').show();

    var mob = $(this).closest('tr').find('td:eq(2)').text();
    var old_image = $(this).prev().prev().text();
    socket.emit('deleterow', { mobile: mob, old_image: old_image });
})

$('tbody').on('click', 'tr td .editbtn', function () {
    $('.heading').text('Edit User');
    $('#signup_form').hide();
    $('#edit_form').show();
    $('#id_field').val($(this).next().next().text());
    $('#edit_name_field').val($(this).closest('tr').find('td:eq(0)').text());
    $('#edit_email').val($(this).closest('tr').find('td:eq(1)').text());
    $('#edit_mobile').val($(this).closest('tr').find('td:eq(2)').text());
    $('#edit_password').val($(this).closest('tr').find('td:eq(3)').text());
    $('#edit_address').val($(this).closest('tr').find('td:eq(4)').text());
    $('#edit_city').val($(this).closest('tr').find('td:eq(5)').text());
    $('#edit_state').val($(this).closest('tr').find('td:eq(6)').text());
    $('#edit_zip').val($(this).closest('tr').find('td:eq(7)').text());
    $('#old_image').val($(this).next().text());
})

// Handle Message and Error Divs
socket.on('message', function (msg) {
    swal(msg, "", "success");
})

socket.on('error', function (msg) {
    swal(msg, "", "error");
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