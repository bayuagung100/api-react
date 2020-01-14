import React, { Component } from 'react';
import axios from "axios";

class App extends Component {

    //membuat state
    constructor(props) {
        super(props);
        this.state = {
            dataApi: [],
            edit: false,
            dataPost: {
                id: 0,
                title: '',
                body: ''
            }
        };

        this.handleRemove = this.handleRemove.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    reloadData() {
        //pemanggilan menggunakan axios
        axios.get('http://localhost:3004/posts')
            .then(
                res => {
                    // console.log(res.data)
                    this.setState({
                        // data itu dari response json nya
                        dataApi: res.data,
                        edit: false
                    })
                }
            );
    }

    inputChange(e) {
        // console.log(e.target.value);

        //fungsinya {...} untuk mengkopi state yang ada di constructor
        let newdataPost = { ...this.state.dataPost };

        if(this.state.edit === false){
        newdataPost['id'] = new Date().getTime();
        }
        newdataPost[e.target.name] = e.target.value;


        this.setState({
            dataPost: newdataPost
        }, () => console.log(this.state.dataPost))
    }

    onSubmitForm() {
        if (this.state.edit === false) {
            axios.post('http://localhost:3004/posts', this.state.dataPost)
                .then(
                    res => {
                        this.reloadData();
                        this.clearData();

                    }
                );
        } else {
            axios.put(`http://localhost:3004/posts/${this.state.dataPost.id}`, this.state.dataPost)
                .then(res => {
                    this.reloadData();
                    this.clearData();
                })
        }
    }

    handleRemove(e) {
        console.log(e.target.value);
        //kalau ingin mengambil parameter seperti id harus pakai `` bukan ''
        fetch(`http://localhost:3004/posts/${e.target.value}`, {
            method: "DELETE"
        }).then(res => this.reloadData())
    }

    handleEdit(e) {
        axios.get(`http://localhost:3004/posts/${e.target.value}`)
            .then(
                res => {
                    console.log(res)
                    this.setState({
                        // data itu dari response json nya
                        dataPost: res.data,
                        edit: true
                    })
                }
            );
    }

    clearData() {
        let newdataPost = { ...this.state.dataPost };
        newdataPost['id'] = "";
        newdataPost['body'] = "";
        newdataPost['title'] = "";
        this.setState({
            dataPost: newdataPost
        })
    }
    //untuk pemanggilan api
    componentDidMount() {
        //pemanggilan bawaan
        // fetch('https://jsonplaceholder.typicode.com/posts')
        // .then(response => response.json())
        // .then(res => {
        //         this.setState({
        //             dataApi: res
        //         })
        //     })

        this.reloadData();

        //perbedaan fetch dengan axios itu dilihat dari detail responsenya, kalo axios lebih detail dibandingkan dengan fetch kalau fetch detail responsenya hanya data dari json saja
    }

    render() {
        return (
            <div>
                <p>Hello API</p>
                <input type="text" name="body" value={this.state.dataPost.body} placeholder="Masukkan body" onChange={this.inputChange} />
                <input type="text" name="title" value={this.state.dataPost.title} placeholder="Masukkan title" onChange={this.inputChange} />
                <button type="submit" onClick={this.onSubmitForm}>Save Data</button>

                {this.state.dataApi.map((data, index) => {
                    return (
                        <div key={index}>
                            <p>{data.body}</p>
                            <button value={data.id} onClick={this.handleRemove}>Delete</button>
                            <button value={data.id} onClick={this.handleEdit}>Edit</button>
                        </div>
                    );
                })}
            </div>
        )
    }
}

export default App;