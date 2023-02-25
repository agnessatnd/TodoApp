import {useState} from 'react';
import AddTask from './components/AddTask.jsx';
import Todo from './components/ToDo.jsx';
import UpdateForm from './components/UpdateForm.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

function App() {

  //Tasks
  const [toDo, setToDo] = useState([
    {id: 1, title: "task 1", status: false},
    {id: 2, title: "task 2", status: false}
  ]);
  
  //Temp State
  const [newTask, setNewTask] = useState('');
  const [updateData, setUpdateData] = useState('');

  //Add new task
const addTask = () => {
  if(newTask) {
    let num = toDo.length + 1;
    let newEntry = {id: num, title: newTask, status: false}
    setToDo([...toDo, newEntry])
    setNewTask('');
  }
}

//Delete task
const deleteTask = (id) => {
  let newTasks = toDo.filter( task => task.id !== id)
  setToDo(newTasks);
}

//Mark task as done or completed
const markDone = (id) => {
  let newTask = toDo.map( task => {
    if(task.id === id){
      return({...task, status: !task.status})
    }
    return task;
  })
  setToDo(newTask);
}

//Cancel update
const cancelUpdate = () => {
  setUpdateData('');
}

//Change task for update
const changeTask = (e) => {
  let newEntry = {
    id: updateData.id,
    title: e.target.value,
    status: updateData.status ? true : false
  }
  setUpdateData(newEntry);
}

//Update task
  function updateTask() {
   let filterRecords = [...toDo].filter( task => task.id !== updateData.id);
   let updatedObject = [...filterRecords, updateData]
   setToDo(updatedObject);
   setUpdateData('');
  }

  return (
    <div className="container App">
      <br></br>
      <h2>To Do List</h2>
      <br></br>

      {/*Update Task*/}
      {updateData && updateData ? (
        <UpdateForm 
        updateDate ={updateData}
        changeTask ={changeTask}
        updateTask ={updateTask}
        cancelUpdate ={cancelUpdate}
        />
      ) : (
       <AddTask 
       newTask ={newTask}
       setNewTask ={setNewTask}
       addTask ={addTask}
       />

      )}
      
      {toDo && toDo.lenght ? '' : 'Tasks'}

      <Todo 
      toDo = {toDo}
      markDone ={ markDone}
      setUpdateData ={setUpdateData}
      deleteTask ={deleteTask}
      />
      

    </div>
  );
}

export default App;
