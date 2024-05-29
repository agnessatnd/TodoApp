import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router";

export default function TaskList() {
    const location = useLocation();
    const newTaskInitialValues = {
        title: "", 
        desc: ""
    };
    const [tasks, setTasks] = useState([]);
    const [newTaskValues, setNewTaskValues] = useState(newTaskInitialValues);

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData(){
        if (location.state && location.state.token) {
            fetch("http://demo2.z-bit.ee/tasks", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${location.state.token}`,
                },
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                setTasks(response);
            })
            .catch(error => console.log(error));
        }
    }

    const handleNameChange = (task, event) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].title = event.target.value;
        });
        setTasks(newTasks);

        fetch(`http://demo2.z-bit.ee/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${location.state.token}`
            },
            body: JSON.stringify({ ...task, title: event.target.value })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })
        .catch(error => console.log(error));
    };

    const handleCompletedChange = (task, event) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = event.target.checked;
        });
        setTasks(newTasks);

        fetch(`http://demo2.z-bit.ee/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${location.state.token}`
            },
            body: JSON.stringify({ ...task, completed: event.target.checked })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })
        .catch(error => console.log(error));
    };

    const handleAddTask = () => {
        const newTask = {
            id: Math.random(),
            title: "",
            completed: false
        };

        setTasks(produce(tasks, draft => {
            draft.push(newTask);
        }));

        fetch("http://demo2.z-bit.ee/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${location.state.token}`
            },
            body: JSON.stringify(newTask)
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })
        .catch(error => console.log(error));
    };

    const handleDeleteTask = (task) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);
        }));

        fetch(`http://demo2.z-bit.ee/tasks/${task.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${location.state.token}`
            }
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })
        .catch(error => console.log(error));
    };

    return (
        <Row type="flex" justify="center" style={{ minHeight: '100vh', marginTop: '6rem' }}>
            <Col span={12}>
                <h1>Task List</h1>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{ width: '100%' }}>
                            <Space>
                                <Checkbox checked={task.completed} onChange={(e) => handleCompletedChange(task, e)} />
                                <Input value={task.title} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}
