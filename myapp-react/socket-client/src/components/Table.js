import React, { Component } from 'react';
import Button from './Button';

class Table extends Component {
    shouldComponentUpdate(nextProps, nextState){
        return nextProps.rows !== this.props.rows;
    }

    componentDidCatch(error, info){
        return <h1>Loading</h1>
    }

    render() {
        const rows = this.props.rows;
        let rowdetails = rows.map(row => {
            return (
                <tr key={row.id}>
                    <td>{row.Name}</td>
                    <td>{row.Email}</td>
                    <td>{row.Mobile}</td>
                    <td>{row.Password}</td>
                    <td>{row.Address}</td>
                    <td>{row.City}</td>
                    <td>{row.State}</td>
                    <td>{row.Zip}</td>
                    <td><img alt={row.Image} className="w-100" src={'http://localhost:4000/image/'+row.Image} /></td>
                    <td>
                        {/* <button onClick={() => {console.log($(this))}} btn='btn-warning'>Edit</button> */}
                        <Button clicked={() => this.props.showForm(row.id)} btn='btn-warning'>Edit</Button>
                        <Button clicked={() => this.props.deleteRow(row.id, row.Image)} btn='btn-danger'>Delete</Button>
                    </td>
                </tr>);
        })
        return (
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Password</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Zip</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rowdetails}
                </tbody>
            </table>
        )
    }
}

export default Table;