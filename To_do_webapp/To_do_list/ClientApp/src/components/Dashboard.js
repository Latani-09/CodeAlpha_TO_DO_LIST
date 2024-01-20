import React, { useState,useEffect } from 'react';
import authService from './api-authorization/AuthorizeService';
import Form from 'react-bootstrap/Form';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
export const Dashboard = () => {
    const [seen, setSeen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loadingtasks, setLoading] = useState(false);

    const togglePop = () => {
        setSeen(!seen);
    };

    const populatetasks = async () => {
        try {
            setLoading(true);
            const token = await authService.getAccessToken();
            const response = await fetch('todotask/gettasks', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setTasks(data);
                setLoading(false);
            } else {
                console.error("Invalid data format for tasks:", data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        populatetasks();
    }, []); // Empty dependency array to mimic componentDidMount

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

    let tasks_view = loadingtasks
        ? <p><em>Loading...</em></p>
        : rendertasksTable(tasks);

    return (
        <div>
            <button onClick={togglePop} style={addButtonStyle}>+</button>
            {seen ? <Popup toggle={togglePop} handleAddTask={handleAddTask} addTask={addTask} /> : null}

            {tasks_view}
        </div>
    );
};

// Rest of the code remains the same...

const rendertasksTable = (tasks) => {


    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    };

    const tileStyle = {
        border: '1px solid #ddd',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    };

    const h3Style = {
        marginTop: '0',
    };
    return (
        <div style={gridStyle}>
            {tasks.map(task => (
                <div key={task.taskID} style={tileStyle}>
                    <h3 style={h3Style}>{task.title}</h3>
                    <p>Priority: {task.priority}</p>
                    <p>Due: {task.due}</p>
                    <p>Description: {task.description}</p>
                </div>
            ))}
        </div>
    );

}
    const Popup = ({ toggle, handleAddTask, addTask }) => {
        const [Title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [due, setDue] = useState('');
        const [priority, setPriority] = useState('default');
        const [radioValue, setRadioValue] = useState("default");
        const priorities = [
            { name: "Default", value: "Default" },
            { name: "Low", value: "Low" },
            { name: "Medium", value: "Medium" },
            { name: "High", value: "High" }
        ];
        


        const handleSubmit = (e) => {
            e.preventDefault();
            var task_to_add = {
                
                Title: Title,
                Description: description,
                Due: due,
                Priority: priority
            };

            addTask(task_to_add);
            toggle(); // Close the popup after submitting
        };

        return (
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Task</h5>
                            <button type="button" className="close" onClick={toggle}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={Title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter task"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter description"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Due:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={due}
                                        onChange={(e) => setDue(e.target.value)}
                                        placeholder="Enter due date"
                                    />
                                </div>
                                
                                <ButtonGroup>
                                    {priorities.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                                            name="radio"
                                            value={radio.value}
                                            checked={priority === radio.value}
                                            onChange={(e) => setPriority(e.currentTarget.value)}
                                        >
                                            {radio.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                               

                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        Add
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={toggle}>
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between', // Adjust as needed
        alignItems: 'center', // Align buttons vertically in the center
        width: '100%' // Adjust the width as needed
    };
    const formStyle = {
        height: '100%',
        borderradius: '20%'
    };

    const inputContainerStyle = {
        marginBottom: '10px',
        width: '100%',
        borderradius: '20%'
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
        borderradius: '20%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    };
    const baseButtonStyle = {
        position: 'right',
        padding: '8px 16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '20%',
        width: 'auto',
    };

    const closeButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        fontSize: '16px',
        // You can add other specific styles for the close button if needed
    };

    const addButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: 'rgba(0, 200, 0, 0.5)',
        fontSize: '20px',
        width: '50px'
        // Green color (you can use your preferred shade of green)

    };
    const submitButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: 'rgba(0, 200, 0, 0.5)',
        display: 'inline-block',
        fontSize: '16px',
        marginRight: '10px',
        cursor: 'pointer',

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


    const disabledButtonStyle = {
        backgroundColor: '#bfbfbf',
        color: '#ffffff',
        cursor: 'not-allowed',
    };


