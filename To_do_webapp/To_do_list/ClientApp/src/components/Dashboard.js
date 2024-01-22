import React, { useState,useEffect } from 'react';
import authService from './api-authorization/AuthorizeService';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup'
import { ToggleButton } from 'react-bootstrap';
import  styles  from './Dashboard.module.css' ;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
       
            console.log(response);
               
            window.location.reload();
        

        // Handle the data as needed, e.g., update state or perform other actions
    };
    

    const handleAddTask = (e) => {
        e.preventDefault();
        toast.success("Task added successfully!");
       
    };

    let tasks_view = loadingtasks
        ? <p><em>Loading...</em></p>
        : rendertasksTable(tasks);

    return (
        <div>
            <button onClick={togglePop} className={styles.addButtonStyle}>+</button>
            {seen ? <Popup toggle={togglePop} handleAddTask={handleAddTask} addTask={addTask} /> : null}

            {tasks_view}
        </div>
    );
};

// Rest of the code remains the same...

const rendertasksTable = (tasks) =>
{
    let expandedTaskId = null;
    const deleteTask = async (taskId) => {
        try {
            const token = await authService.getAccessToken();
            const response = await fetch(`todotask/taskDelete${taskId}`, {
                method: 'delete',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                toast.success("Task deleted successfully!");

                // Optionally, you can update the state or perform other actions after a successful deletion.
            } else {
                const errorData = await response.json();
                toast.error(`Error deleting task: ${errorData.message}`);
            }
        } catch (error) {
            console.error("An error occurred during task deletion:", error);
            toast.error("An unexpected error occurred while deleting the task.");
        }
    }
    
    const handleExpand = (taskId) => {
        expandedTaskId=(taskId === expandedTaskId ? null : taskId);
    };

    const handleEdit = (taskId) => {
        // Handle edit operation
        console.log(`Edit task with ID: ${taskId}`);
    };

    const handleDelete = (taskId) => {
        deleteTask(taskId);
       
        // Handle delete operation

        console.log(`Delete task with ID: ${taskId}`);
    };

    let today = new Date();
    const editSymbol = '\u270E'; // Edit symbol
    const deleteSymbol = '\u2716'; // Delete symbol
    const expandSymbol = '\u2193'; // Expand symbol
    tasks.forEach(function (task) {

       
        if (task.priority == 0) {
            task.priority ='Low'
        }
        if (task.priority == 1) {
            task.priority = 'Medium'
        }
        if (task.priority == 2) {
            task.priority = 'High'
        }
        if (task.priority == 3) {
            task.priority = 'Default'
        }
    })
    return (
        <div className={styles.gridStyle}>
            {tasks.map((task) => (
                <div key={task.taskID} className={styles.tileStyle}>
                    <h5 className={styles.h3Style}>{task.title}</h5>
                    <p>Priority: {task.priority}</p>
                    <p>Due: {(task.due.split('T')[0] == today.toISOString().split('T')[0]) ? ('Today' + '  ' + task.due.split('T')[1].slice(0,5)) : (task.due.split('T')[0] + ' ' + task.due.split('T')[1].slice(0, 5))}</p>

                    <button className={styles.buttonStyle} onClick={() => handleEdit(task.taskID)}>
                        {editSymbol}
                    </button>
                    <button className={styles.buttonStyle} onClick={() => handleDelete(task.taskID)}>
                        {deleteSymbol} 
                    </button>

                </div>
            ))}
        </div>

    );

}
    const Popup = ({ toggle, handleAddTask, addTask }) => {
        const [Title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [due, setDue] = useState (new Date());
        const [time, onChange] = useState('10:00');
        const [DueDate, setDueDate] = useState('No due');
        const [priority, setPriority] = useState('Default');
        const priorities = [
            { name: "Default", value: "Default" },
            { name: "Low", value: "Low" },
            { name: "Medium", value: "Medium" },
            { name: "High", value: "High" }
        ];
        const Days = [
            { name: "Today", value: "Today" },
            { name: "Pick a date", value: "Pick a date" },
            { name: "No due", value: "No due" }
        ];
        

        const setDueDate_Time = (DueDate, due, time) => {
             let day = new Date().toISOString().split('T')[0]
            if (DueDate == 'No due') {
                setDue(null)
                return;
            }
            else if (DueDate == 'Today') {
               
                setDue(day)
}
            else if (DueDate == 'Tomorrow') {
               
                setDue(day)
            }
            
                // Create a Date object from the date part
                const combinedDate = new Date(`${day}T${time}:00.000Z`);

                // Get the combined ISO date string
            const combinedISODate = combinedDate.toISOString();
            setDue(combinedISODate);
            
        }
        const handleSubmit = (e) => {
            e.preventDefault();
            setDueDate_Time(DueDate, due, time);
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
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={Title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter task"
                                    />
                                </div>
                                <div className="form-group">
                                <label></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter description"
                                    />
                                </div>
                                
                                <FormGroup >
                                    <label>Due:</label>
                                    <fieldset name='grp1'>
                                        {Days.map((radio, idx) => (
                                            <ToggleButton
                                                key={idx}
                                                id={`radio-${idx}`}
                                                type="radio"
                                                variant={'outline-success'}
                                                name="dueRadio"
                                                value={radio.value}
                                                checked={DueDate === radio.value}
                                                onChange={(e) => setDueDate(e.currentTarget.value)}
                                            >
                                                {radio.name}
                                            </ToggleButton>
                                        ))}
                                    </fieldset >
                                    {DueDate === 'Pick a date' ?
                                        <input type='date'></input> : <p></p>}
                                    <input type='time'></input>
                                </FormGroup>

                                <div className="form-group">
                                    <label>Priority:</label>
                                    <fieldset name='grp2'>
                                        {priorities.map((radio2, idx) => (
                                            <ToggleButton
                                                key={idx}
                                                id={`radio2-${idx}`}
                                                type="radio"
                                                variant={'outline-success'}
                                                name="priorityRadio"
                                                value={radio2.value}
                                                checked={priority === radio2.value}
                                                onChange={(e) => setPriority(e.currentTarget.value)}
                                            >
                                                {radio2.name}
                                            </ToggleButton>
                                        ))}
                                    </fieldset>
                                </div>

                               

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

   


