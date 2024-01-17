import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true ,tasks:[],loadingtasks:true};
    }

    componentDidMount() {
        this.populateWeatherData();
        this.populatetasks();
        //this.addtasks()
    }

    static renderForecastsTable(forecasts) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.TemperatureC}</td>
                            <td>{forecast.TemperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    static rendertasksTable(tasks) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Priority </th>
                        <th>Due</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task =>
                        <tr key={task.taskID}>
                            <td>{task.title}</td>
                            <td>{task.priority}</td>
                            <td>{task.due}</td>
                            <td>{task.description}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }



    

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchData.renderForecastsTable(this.state.forecasts);
         let tasks_view = this.state.loadingtasks
            ? <p><em>Loading...</em></p>
            : FetchData.rendertasksTable(this.state.tasks);
        
        return (
            <div>
                <h1 id="tabelLabel" >Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
                {tasks_view}

            </div>
        );
    };

    async populateWeatherData() {
        const token = await authService.getAccessToken();
        const response = await fetch('weatherforecast', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }
    async populatetasks() {
        try {
                const token = await authService.getAccessToken();
                const response = await fetch('todotask/gettasks', {
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    this.setState({ tasks: data, loadingtasks: false });
                    console.log('no error in data type')
                } else {
                    console.error("Invalid data format for tasks:", data);
            }
                        }
        catch (error) { console.log(error) }
    }
    
    async addtasks() {
        var task_to_add = {
            Title: 'newTask',
            Description:''

        }

        const token = await authService.getAccessToken();
        const response = await fetch('todotask/addTask', {
            method:'post',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(task_to_add)
            
        });
        const data = await response.json();
       
    }
}



/*import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { tasks: [], loadingtasks: true ,forecast:[],loadingforecast:true};
  }

  componentDidMount() {
      this.populateWeatherData();
      this.populateTask();
      this.addTask();
  }

  static renderForecastsTable(forecasts) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

    static renderTasks(tasks) {
        console.log(tasks);
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Task </th>
                        <th>Due Date</th>
                        <th>priority</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task =>
                        <tr key={task.title}>
                            <td>{task.due}</td>
                            <td>{task.priority}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
  render() {
    let contents = this.state.loadingtasks
      ? <p><em>Loading...</em></p>
          : FetchData.renderTasks(this.state.tasks);
      let weatherdata = this.state.loadingforecast ?
          <p>Loading weather data...</p>
          : FetchData.renderForecastsTable(this.state.forecast);

      return (
        <div>
        <div>
            <h1 id="tabelLabel" >Task to do</h1>
        {contents}
        </div>
          <div>
            <h1 id="tabelLabel" >Waeather data</h1>
        {weatherdata}
              </div>
          </div>
    );
  }

  async populateWeatherData() {
    const token = await authService.getAccessToken();
      const response = await fetch('WeatherForecastController', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
      const data = await response.json();
      console.log('weather ----------------------', data)
    this.setState({ forecasts: data, loadingforecast: false });
    }  
    
  async populateTask() {
      const token = await authService.getAccessToken();
      const response = await fetch('todo/getTask', {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
      });
      console.log('get data -----', response.json())

      if (response.ok) {
          const tasksData = await response.json();
          this.setState({ tasks: tasksData, loadingtasks: false });
      } else {
          // Handle error cases
          console.error('Error fetching tasks:', response.status);
      }
    
    }
    async addTask() {
        const token = await authService.getAccessToken();
        const formData = {
            task: {
               "TaskID":"20",
               "Title": "new task",

            }
        }
        const response = await fetch('todo/addTask', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        //const response = await fetch('HomeController', {
        //    method: 'Get',
        //    headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
        //    body: JSON.stringify(formData),
        //});
            console.log(response)
    }
}


*/



