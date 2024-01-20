import React, { useState } from 'react';
import authService from './api-authorization/AuthorizeService';

export const Dashboard = () => {
    const [seen, setSeen] = useState(false);

    const togglePop = () => {
        setSeen(!seen);
    };

    const addTask = async (taskToAdd) => {
        const token = await authService.getAccessToken();
        const response = await fetch('todotask/addTask', {
            method: 'post',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(taskToAdd)
        });
        const data = await response.json();
        // Handle the data as needed, e.g., update state or perform other actions
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        // Code to handle adding a task goes here
    };

    return (
        <div>
            <button onClick={togglePop}>+++++++</button>
            {seen ? <Popup toggle={togglePop} handleAddTask={handleAddTask} addTask={addTask} /> : null}
        </div>
    );
};

const Popup = ({ toggle, handleAddTask, addTask }) => {
    const [Title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [due, setDue] = useState('');
    const [priority, setPriority] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        var task_to_add = {
            Title: Title,
            Description: description,
            Due: due,


        }
        addTask(task_to_add);
        toggle(); // Close the popup after submitting
    };

    return (
        <div style={popupStyle}>
            <button onClick={toggle} style={closeButtonStyle}>Close</button>
            <h2>Add task</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={inputContainerStyle}>

                        <input
                            type="text"
                            value={Title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task"
                            style={inputStyle}
                        />

                </div>
                <div style={inputContainerStyle}>

                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            style={inputStyle}
                        />
                    
                </div>
                <div style={inputContainerStyle}>
                    <label>
                        Due:
                        <input
                            type="text"
                            value={due}
                            onChange={(e) => setDue(e.target.value)}
                            placeholder="Enter due date"
                            style={inputStyle}
                        />
                    </label>
                </div>
                <div style={inputContainerStyle}>
                    <label>
                        Priority:
                        <input
                            type="text"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            placeholder="Enter priority"
                            style={inputStyle}
                        />
                    </label>
                </div>
                <button type="submit" style={buttonStyle}>
                    Add Task
                </button>
                </form>
            </div>
        
    );
};
const formStyle = {
    height: '100%',
};

const inputContainerStyle = {
    marginBottom: '10px',
    width: '100%',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};
const popupStyle = {
    display: 'flex',
    flexDirection: 'column',

    zIndex: 1,
    left: 0,
    top: 0,
    width: '60%',
    height: '60%',

    backgroundColor: 'rgba(0, 0, 0, 0.4)',
};
const closeButtonStyle = {
    position:'right',
    padding: '8px 16px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    width:'10%'
};
const popupInnerStyle = {
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    backgroundColor: 'white',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.75)',
    width: '40%',
};

const h2Style = {
    marginTop: 0,
};

const labelStyle = {
    display: 'block',
    marginBottom: '10px',
};

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    marginRight: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
};

const disabledButtonStyle = {
    backgroundColor: '#bfbfbf',
    color: '#ffffff',
    cursor: 'not-allowed',
};

export default Popup;
