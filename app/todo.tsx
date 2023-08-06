"use client"
import React, {useState} from "react";
import { Input } from "postcss";

function ToDoInput({list, setList}: any) {
  const [inputValue,setInputValue] = useState('');

  function handleAdd() {
    const val = inputValue;
    const newList = list.slice();
    const id = `${Date.now()}`;
    const newTodo = {
      todo: val, 
      id,
      done: false,
    };

    if (!inputValue.match(/\S/g)) {
      return;
    }

    newList.push(newTodo);
    setList(newList);
    setInputValue('');

    addTodoServer(newTodo)
      .then((res)=>{
        console.log(res);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  function handleInputChange(e: any) {
    const value = e.target.value;
    setInputValue(value);
  }

  function handleEnter(e: any) {
    if (e.key === 'Enter') {
      if (!inputValue.match(/\S/g)) return;
      handleAdd();
    }
  }

  return(
    <div className="input">
      <input value={inputValue} onChange={(e) => handleInputChange(e)} onKeyDown={handleEnter}></input>
      <button className="btn" onClick={handleAdd}>Add</button>
    </div>
  );
}

function ToDoList({list, setList}: any) {

  const handleDone = (id: number) => {
    setList((previousList: any[]) => previousList.map(previousTodo =>
      previousTodo.id === id ? {...previousTodo, done: !previousTodo.done} : previousTodo
      ))
  }

  function deleteTodo(id: string) {
    let del = list.slice();
    del = del.filter((list: { id: string; }) =>  list.id !== id)
    setList(del);

    deleteTodoServer(id)
      .then((res)=>{
        console.log(res);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  if(!list || list.length == 0){
    return null;
  }
  
  return(
    <>
      {list.map(({todo, id, done}: any) => {
        return (
          <div key={id} className={done ? 'done' : ''}>
          <div className="list-box">
            <input className="list-item-check" type="checkbox" onClick={() => handleDone(id) } defaultChecked={done}></input>
            <div key={`${todo}${id}`} className="textList">{todo}<button className="delete" onClick={() => deleteTodo(id)}>Delete</button></div>
          </div>
          </div>
        );
      } )}
    </>
  );
} 

async function addTodoServer({id,todo}: any){
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      todo
    }),
  };
  const response = await fetch("http://localhost:7984/add",　options);
  return response;
}

async function deleteTodoServer(id : string){
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id
    }),
  };
  const response = await fetch("http://localhost:7984/delete",　options);
  return response;
}

export default function ToDo() {
  const [list,setList] = useState<Object[]>([]);

  return (
    <div className="all">
      <h1>To-Do App</h1>
      <ToDoInput list={list} setList={setList}/>
      <ToDoList list={list} setList={setList}/>
    </div>
  );
}