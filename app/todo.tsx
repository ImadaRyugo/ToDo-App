"use client"
import React, {useState} from "react";
import { Input } from "postcss";

function ToDoInput({list, setList}: any) {
  const [inputValue,setInputValue] = useState('');

  function handleAdd() {
    const val = inputValue;
    const newList = list.slice();
    newList.push(val);
    setList(newList);
    setInputValue('');
    const id = newList.length - 1;
  
    addTodoServer(val,id)
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
    <div>
      <input value={inputValue} onChange={(e) => handleInputChange(e)} onKeyDown={handleEnter}></input>
      <button className="btn" onClick={handleAdd}>Add</button>
    </div>
  );
}

function ToDoList({list, setList}: any) {
  function deleteTodo(index: number) {
    const del = list.slice();
    del.splice(index,1);
    setList(del);
  }

  if(!list || list.length == 0){
    return null;
  }
  
  return(
    <div className="list">
      {list.map((text: string, index: number) => {
        return (
          <div key={`${text}${index}`} className="textList">{text}<button onClick={() => deleteTodo(index)}>Delete</button></div>
        );
      } )}
    </div>
  );
} 

async function addTodoServer(todo : string, id: number){
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      todo,
      id
    }),
  };
  const response = await fetch("http://localhost:7984/add",　options);
  return response;
}

async function deleteTodoServer(index : number){
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      index
    }),
  };
  const response = await fetch("http://localhost:7984/delete",　options);
  return response;
}

export default function ToDo() {
  const [list,setList] = useState<string[]>([]);

  return (
    <div className="all">
      <h1>To-Do App</h1>
      <ToDoInput list={list} setList={setList}/>
      <ToDoList list={list} setList={setList}/>
    </div>
  );
}
