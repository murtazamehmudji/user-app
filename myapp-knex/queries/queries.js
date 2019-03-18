var dbconfig = require('../dbconfig');
var knex = require('knex')(dbconfig);


let queries = {
    get_users: (callback) => {
        knex
            .select()
            .from('users')
            .then(function (rows) {
                if (rows.length > 0) {
                    callback(null, rows);
                } else {
                    callback("No data", null);
                }
            });
    },
    add_user: (userdata, callback) => {
        knex('users')
            .insert({
                Name: userdata.name,
                Email: userdata.email,
                mobile: userdata.mobile,
                Password: userdata.password,
                Address: userdata.address,
                City: userdata.city,
                State: userdata.state,
                Zip: userdata.zip,
                Image: userdata.image_name
            })
            .catch((err) => {
                console.log('Error occured');
                callback('Error occured', null);
            })
            .then(() => {
                callback(null, 'User Added Successfully');
            })
    },
    edit_user: (userdata, callback) => {
        knex('users')
            .where('id', '=', userdata.id)
            .update({
                Name: userdata.name,
                Email: userdata.email,
                mobile: userdata.mobile,
                Password: userdata.password,
                Address: userdata.address,
                City: userdata.city,
                State: userdata.state,
                Zip: userdata.zip,
                Image: userdata.image_name
            })
            .catch((err) => {
                callback(err, null);
            })
            .then(() => {
                callback(null, 'User Edited');
            })
    },
    delete_user: (data, callback)=>{
        knex('users')
            .where('mobile', data.mobile)
            .del()
            .catch((err)=>{
                callback(err, null);
            })
            .then(()=>{
                callback(null, 'User Deleted');
            })
        }
};

module.exports = queries;