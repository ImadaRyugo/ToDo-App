import React, {useState} from "react";
import { Input } from "postcss";

function ToDoInput({list, setList}: any) {
  const[inputValue,setInputValue] = useState('');
  function handleAdd() {
    const val = inputValue;
    const newList = list.slice();
    newList.push(val);
    setList(newList);
    setInputValue('');
    add(val).then((res)=>{
      console.log(res);
    });
  }

  function handleInputChange(e: any) {
    const value = e.target.value;
    setInputValue(value);
  }

  return(
    <div>
      <input value={inputValue} onChange={(e) => handleInputChange(e)}></input>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

function ToDoList({list, setList}: any) {
  function deleteTodo(index: number) {
    const del = list.slice();
    del.splice(index,1);
    setList(del);
  }
  
  return(
    <div className="list">
      {list.map((text: string, index: number) => {
        return (
          <div className="textList">{text}<button onClick={() => deleteTodo(index)}>Delete</button></div>
        );
      } )}
    </div>
  );
} 

async function add(todo : string){
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      todo
    }),
  };
  const response = await fetch("http://localhost:7984/add",　options);
  return response;
}

export default function ToDo() {
  const[list,setList] = useState<string[]>([]);

  return (
    <div>
      <h1>To-Do App</h1>
      <ToDoInput list={list} setList={setList} />
      <ToDoList list={list} setList={setList}/>
    </div>
  );
}
