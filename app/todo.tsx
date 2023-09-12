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
    <div className="input-area">
      <input className="input" value={inputValue} onChange={(e) => handleInputChange(e)} onKeyDown={handleEnter}></input>
      <button className="btn" onClick={handleAdd}>追加</button>
    </div>
  );
}

function IncompleteToDo({list, setList, todo, setTodo}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleDone = (id: string) => {
    
    const newIncompleteTodos = list.filter((item: any) => item.id !== id);
    const completedTodo = list.find((item: any) => item.id === id);

    if (completedTodo) {
      completedTodo.done = true;
      const newCompleteTodos = [...todo, completedTodo];
      setList(newIncompleteTodos);
      setTodo(newCompleteTodos);
    }
    
    setList((previousList: any[]) => previousList.map(previousTodo =>
      previousTodo.id === id ? {...previousTodo, done: !previousTodo.done} : previousTodo
    ));
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
        console.log(error);
      });
  }

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  }

  const saveEditing = (id: string) => {
    const updatedList = list.map((item: any) => {
      if (item.id === id) {
        return {...item, todo: editingText}
      }else{
        return item;
      }
    });

    setList(updatedList);
    setEditingId(null);
    setEditingText('');

    updateTodoServer({id, todo: editingText})
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // if(!list || list.length == 0){
  //   return null;
  // }
  
  return(
    <>
      <div className="todo-area">
        <p className="title">未完了のTODO</p>
        {list.length > 0 ? list.map(({todo, id, done}: any) => {
          return (
            <div key={id} className={done ? 'done' : ''}>
              <div className="list-box">
                {editingId === id ? (
                  <>
                    <input className="edit" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                    <button className="btn" onClick={() => saveEditing(id)}>保存</button>
                  </>
                ) : (
                  <>
                    <input className="list-item-check" type="checkbox" onClick={() => handleDone(id) } defaultChecked={done}></input>
                    <div key={`${todo}${id}`} className="textList">
                      {todo}
                    <button className="btn" onClick={() => startEditing(id, todo)}>編集</button>
                    <button className="btn" onClick={() => deleteTodo(id)}>削除</button>
                    </div>
                  </>
                )}
                
              </div>
            </div>
          );
        }) : <p className="todo-status">未完了のTODOはありません。</p>}
      </div>
    </>
  );
} 

function CompleteToDo({list, setList, todo, setTodo}: any) {
  const onClickBack = (id: any) => {
    const newCompleteTodos = todo.filter((item: any) => item.id !== id);
    const incompleteTodo = todo.find((item: any) => item.id === id);

    if (incompleteTodo) {
      incompleteTodo.done = false;
      const newIncompleteTodos = [...list, incompleteTodo];
      setTodo(newCompleteTodos);
      setList(newIncompleteTodos);
    }
  }

  // if(!todo || todo.length == 0){
  //   return null;
  // }

  return(
    <>
      <div className="todo-area">
        <p className="title">完了のTODO</p>
        <ul>
        {todo.length > 0 ? todo.map(({todo, id}: any) => {
          return (
            <div key={id} className="list-box">
              <li key={`${todo}${id}`} className="textList">{todo}<button className="btn" onClick={() => onClickBack(id)}>戻す</button></li>
            </div>
          );
        }) : <p className="todo-status">完了のTODOはありません。</p>}
        </ul>
      </div>
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

async function updateTodoServer({id, todo}: any) {
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
  const response = await fetch("http://localhost:7984/update", options);
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
  const [completeTodos, setCompleteTodos] = useState<Object[]>([]);

  return (
    <>
      <div className="all">
        <h1>TODOリスト</h1>
        <ToDoInput list={list} setList={setList}/>
      </div>
        <IncompleteToDo list={list} setList={setList} todo={completeTodos} setTodo={setCompleteTodos}/>
        <CompleteToDo list={list} setList={setList} todo={completeTodos} setTodo={setCompleteTodos}/>
    </>
  );
}