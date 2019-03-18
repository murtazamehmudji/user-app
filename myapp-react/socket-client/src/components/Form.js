import React, { Component } from 'react';
import Button from './Button';
import socket from '../socket';
import uploader from '../siofu';
import swal from 'sweetalert';

import './Form.css';

const states = [
	"Andhra Pradesh",
	"Arunachal Pradesh",
	"Assam",
	"Bihar",
	"Chhattisgarh",
	"Goa",
	"Gujarat",
	"Haryana",
	"Himachal Pradesh",
	"Jammu & Kashmir",
	"Jharkhand",
	"Karnataka",
	"Kerala",
	"Madhya Pradesh",
	"Maharashtra",
	"Manipur",
	"Meghalaya",
	"Mizoram",
	"Nagaland",
	"Odisha",
	"Punjab",
	"Rajasthan",
	"Sikkim",
	"Tamil Nadu",
	"Telangana",
	"Tripura",
	"Uttarakhand",
	"Uttar Pradesh",
	"West Bengal"
]

class Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Name: { value: "", valid: false, touched: false, error: 'Please enter a name' },
			Email: { value: "", valid: false, touched: false, error: 'Email is invalid' },
			Mobile: { value: "", valid: false, touched: false, error: 'Mobile Number must be 10 digits only' },
			Password: { value: "", valid: false, touched: false, error: 'Password must be 8 characters' },
			Address: { value: "", valid: false, touched: false, error: 'Please enter an Address' },
			City: { value: "", valid: false, touched: false, error: 'City must not contain digits and is required' },
			State: { value: "Andhra Pradesh", valid: true, touched: true, error: 'Please Select a State' },
			Zip: { value: "", valid: false, touched: false, error: 'Zip Code must be 6 digits only' },
			id: { value: "", valid: true, touched: true, error: "" },
			old_image: { value: "", valid: true, touched: true, error: "" }
		}
		this.setDefault = this.setDefault.bind(this);
	}

	setDefault = () => {
		this.setState({
			Name: { value: "", valid: false, touched: false, error: 'Please enter a name' },
			Email: { value: "", valid: false, touched: false, error: 'Email is invalid' },
			Mobile: { value: "", valid: false, touched: false, error: 'Mobile Number must be 10 digits only' },
			Password: { value: "", valid: false, touched: false, error: 'Password must be 8 characters' },
			Address: { value: "", valid: false, touched: false, error: 'Please enter an Address' },
			City: { value: "", valid: false, touched: false, error: 'City must not contain digits and is required' },
			State: { value: "Andhra Pradesh", valid: true, touched: true, error: 'Please Select a State' },
			Zip: { value: "", valid: false, touched: false, error: 'Zip Code must be 6 digits only' },
			id: { value: "", valid: true, touched: true, error: "" },
			old_image: { value: "", valid: true, touched: true, error: "" }
		});
	}

	componentWillReceiveProps(newProps) {
		if (newProps.state) {
			this.setDefault();
		} else {
			this.setState({
				Name: { value: newProps.row.Name, valid: true, touched: true, error: 'Please enter a name' },
				Email: { value: newProps.row.Email, valid: true, touched: true, error: 'Email is invalid' },
				Mobile: { value: newProps.row.Mobile, valid: true, touched: true, error: 'Mobile Number must be 10 digits only' },
				Password: { value: newProps.row.Password, valid: true, touched: true, error: 'Password must be 8 characters' },
				Address: { value: newProps.row.Address, valid: true, touched: true, error: 'Please enter an Address' },
				City: { value: newProps.row.City, valid: true, touched: true, error: 'City must not contain digits and is required' },
				State: { value: newProps.row.State, valid: true, touched: true, error: 'Please Select a State' },
				Zip: { value: newProps.row.Zip, valid: true, touched: true, error: 'Zip Code must be 6 digits only' },
				id: { value: newProps.row.id, valid: true, touched: true, error: "" },
				old_image: { value: newProps.row.Image, valid: true, touched: true, error: "" },
			})
		}
	}

	handleInputChange = (event) => {
		const formState = this.state;
		formState[event.target.name].touched = true;
		formState[event.target.name].value = event.target.value;

		// To ValidateField
		switch (event.target.name) {
			case 'Email':
				/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(event.target.value.trim())
					? formState[event.target.name].valid = true
					: formState[event.target.name].valid = false;
				break;
			case 'Mobile':
				/^\d+$/.test(event.target.value.trim()) && event.target.value.trim().length === 10
					? formState[event.target.name].valid = true
					: formState[event.target.name].valid = false;
				break;
			case 'Password':
				event.target.value.trim().length > 7
					? formState[event.target.name].valid = true
					: formState[event.target.name].valid = false
				break;
			case 'Zip':
				/^\d+$/.test(event.target.value.trim()) && event.target.value.trim().length === 6
					? formState[event.target.name].valid = true
					: formState[event.target.name].valid = false;
				break;
			case 'City':
				/^[a-zA-Z]+$/.test(event.target.value.trim()) && event.target.value.trim().length > 0
					? formState[event.target.name].valid = true
					: formState[event.target.name].valid = false;
				break;
			default:
				event.target.value.trim().length > 0
					? formState[event.target.name].valid = true
					: formState[event.target.name].valid = false
		}
		this.setState({ ...formState });
	}

	ValidateForm = () => {
		let isValid = true;
		const formState = this.state;
		for (var key in formState) {
			isValid = formState[key].valid && isValid;
		}
		return isValid;
	}

	formSubmitHandler = (event) => {
		event.preventDefault();
		// Get the state from props and form
		let formState = this.props.state;
		let formDetails = this.state;

		uploader.addEventListener("complete", function (event) {
			// Extract only values from form
			let alter = {};
			for (var key in formDetails) {
				alter[key] = formDetails[key].value;
			}
			alter.Image = event.detail.base + "." + event.file.name.split('.').pop();
			if (formState) {
				socket.emit('adduser', alter);
			} else {
				socket.emit('edituser', alter);
			}
			formDetails = {};
		});
		uploader.addEventListener("choose", function (event) {
		});
		uploader.addEventListener("start", function (event) {
			event.file.meta.hello = "World";
		});
		uploader.addEventListener("progress", function (event) {
		});
		uploader.addEventListener("load", function (event) {

		});
		uploader.addEventListener("error", function (event) {
			swal(event.message, "", "error");
			if (event.code === 1) {
				swal("Too Big", "Don't upload such a big file", "error");
			}
		});
		uploader.prompt();
	}

	render() {
		const state_list = states.map(state => {
			if (state === this.props.row.State) {
				return <option key={state} selected>{state}</option>
			} else {
				return <option key={state}>{state}</option>
			}
		});

		return (
			<div className='border mt-5'>
				<h1 className="text-center py-3 bg-dark text-white heading">{this.props.state ? 'Add User' : 'Edit User'}</h1>
				<div className="container">
					<form className="px-5 py-3" method="post" encType="multipart/form-data">
						<div className="form-row">
							<div className="form-group col-md-6">
								<label htmlFor="name_field">Name</label>
								<input
									className="form-control"
									type="text"
									name="Name"
									value={this.state.Name.value}
									placeholder="Name"
									onChange={this.handleInputChange} />
								{this.state.Name.touched ? (this.state.Name.valid ? null : <p className="error">{this.state.Name.error}</p>) : null}
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="email">Email</label>
								<input
									className="form-control"
									type="email"
									name="Email"
									value={this.state.Email.value}
									placeholder="Email"
									onChange={this.handleInputChange} />
								{this.state.Email.touched ? (this.state.Email.valid ? null : <p className="error">{this.state.Email.error}</p>) : null}
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="mobile">Mobile</label>
								<input
									className="form-control"
									type="text"
									maxLength="10"
									value={this.state.Mobile.value}
									name="Mobile"
									placeholder="Mobile"
									onChange={this.handleInputChange} />
								{this.state.Mobile.touched ? (this.state.Mobile.valid ? null : <p className="error">{this.state.Mobile.error}</p>) : null}
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="password">Password</label>
								<input
									className="form-control"
									type="password"
									value={this.state.Password.value}
									name="Password"
									placeholder="Password"
									onChange={this.handleInputChange} />
								{this.state.Password.touched ? (this.state.Password.valid ? null : <p className="error">{this.state.Password.error}</p>) : null}
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="address">Address</label>
							<input
								className="form-control"
								type="text"
								value={this.state.Address.value}
								name="Address"
								placeholder="Address"
								onChange={this.handleInputChange} />
							{this.state.Address.touched ? (this.state.Address.valid ? null : <p className="error">{this.state.Address.error}</p>) : null}
						</div>
						<div className="form-row">
							<div className="form-group col-md-6">
								<label htmlFor="city">City</label>
								<input
									className="form-control"
									value={this.state.City.value}
									type="text"
									name="City"
									placeholder="City"
									onChange={this.handleInputChange} />
								{this.state.City.touched ? (this.state.City.valid ? null : <p className="error">{this.state.City.error}</p>) : null}
							</div>
							<div className="form-group col-md-4">
								<label htmlFor="state">State</label>
								<select
									className="form-control"
									name="State"
									onChange={this.handleInputChange}>
									{state_list}
								</select>
							</div>
							<div className="form-group col-md-2">
								<label htmlFor="zip">Zip</label>
								<input
									className="form-control"
									type="text"
									maxLength="6"
									value={this.state.Zip.value}
									name="Zip"
									placeholder="452012"
									onChange={this.handleInputChange} />
								{this.state.Zip.touched ? (this.state.Zip.valid ? null : <p className="error">{this.state.Zip.error}</p>) : null}
							</div>
							<div className="form-group">
								<Button btn="btn-primary" disabled={!this.ValidateForm()} clicked={this.formSubmitHandler}>{this.props.state ? 'Sign Up' : 'Update'}</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		)
	}
}

export default Form;