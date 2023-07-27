const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");

const app = express();
const port = 7984;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Ryugo3849!',
  database: 'todo'
});

connection.connect((err) => {
  if (err) {
    console.log('MySQLの接続に失敗: ' + err.stack);
    return;
  }
  console.log('MySQLの接続に成功');
});

app.post('/add',(request, response) => {
  // console.log(request);
  const sql = `INSERT INTO todos (todo_text) VALUES ('${request.body.todo}')`

	connection.query(sql,function(error,result){
		console.log(result);
    if(error) {
      console.log(error);
      response.send('エラーが出ました。');
    } else {
      response.send('登録が完了しました');
    }
	});
});

app.post('/delete',(request, response) => {
  const sql = `DELETE FROM todos WHERE id = '${request.body.index}'`;
	connection.query(sql,function(error,result){
		console.log(result)
		response.redirect('/');
	})
});

app.get('/',(request, response) => {
  response.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});