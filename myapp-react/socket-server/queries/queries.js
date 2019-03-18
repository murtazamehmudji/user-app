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
                Name: userdata.Name,
                Email: userdata.Email,
                mobile: userdata.Mobile,
                Password: userdata.Password,
                Address: userdata.Address,
                City: userdata.City,
                State: userdata.State,
                Zip: userdata.Zip,
                Image: userdata.Image
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
                Name: userdata.Name,
                Email: userdata.Email,
                mobile: userdata.Mobile,
                Password: userdata.Password,
                Address: userdata.Address,
                City: userdata.City,
                State: userdata.State,
                Zip: userdata.Zip,
                Image: userdata.Image
            })
            .catch((err) => {
                callback(err, null);
            })
            .then(() => {
                callback(null, 'User Edited');
            })
    },
    get_row_details: (data, callback) => {
        knex
            .select()
            .where('id', data)
            .from('users')
            .then(function (row) {
                if (row.length > 0) {
                    callback(null, row);
                } else {
                    callback("No data", null);
                }
            });
    },
    delete_user: (data, callback)=>{
        knex('users')
            .where('id', data.id)
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