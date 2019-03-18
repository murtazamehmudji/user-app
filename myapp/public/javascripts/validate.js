$(document).ready(function () {
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
            image: 'required'

        },
        messages: {
            name: 'This field is required',
            mobile: 'Mobile must be 10 digits',
            user_email: 'Enter a valid email',
            password: {
                minlength: 'Password must be at least 8 characters long'
            },
            address: 'This field is required',
            city: 'This field is required',
            state: 'This field is required',
            zip: 'Zip Must be 6 digits',
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});