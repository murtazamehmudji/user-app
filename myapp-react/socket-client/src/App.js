import React, { Component } from 'react';
import './App.css';
import Form from './components/Form';
import Table from './components/Table';
import Button from './components/Button';
import socket from './socket';
import swal from 'sweetalert';

class App extends Component {
	constructor() {
		super();
		this.state = {
			form: true,
			rows: [],
			selected: {}
		}
	}

	componentDidMount() {
		socket.on('rows', (rows) => {
			this.setState({ form: true, selected: {}, rows: rows });
		})
		socket.on('message', (msg) => {
			swal(msg, "", "success");
		})

		socket.on('error', (msg) => {
			swal(msg, "", "error");
		})
		socket.on('showrowdetails', (row) => {
			this.setState({ form: false, selected: row[0] });
		})
	}

	deleteHandler = (id, img) => {
		if (window.confirm('Are you sure to delete?')) {
			var data = { id: id, old_image: img };
			socket.emit('deleterow', data);
		} else {
			return;
		}
	}

	showAddFormHandler = () => {
		if (!this.state.form) {
			this.setState({ form: true, selected: {} });
		}
	}

	showEditFormHandler = (id) => {
		socket.emit('getrowdetails', { id: id });
	}

	render() {
		return (
			<div className='container'>
				<Form state={this.state.form} row={this.state.selected} />
				<hr></hr>
				<div className="text-center">
					<Button btn='btn-primary' clicked={this.showAddFormHandler}>Add User</Button>
				</div>
				<hr></hr>
				<Table showForm={this.showEditFormHandler} deleteRow={this.deleteHandler} rows={this.state.rows} />
			</div>
		)
	}
}

export default App;
