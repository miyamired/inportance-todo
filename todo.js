'use strict';

const addTaskValue = document.getElementsByClassName('addTask')[0];
const entryButton = document.getElementsByClassName('entry')[0];
const taskList = document.getElementsByClassName('taskList')[0];

const Post = require('./post');
const router = require('./router');

// 各タスクについている削除ボタンを押したとき、タスク全体を削除する
const removeTask = removeButton => {
  const targetTask = removeButton.closest('li');
  taskList.removeChild(targetTask);
};

const addTask = task => {
  const listItem = document.createElement('li');
  const removeButton = document.createElement('button'); // 削除ボタン
  const completeButton = document.createElement('button'); // 完了ボタン

  // 削除イベントの追加
  removeButton.innerText = '削除';
  removeButton.addEventListener('click', () => removeTask(removeButton));

  // 完了イベントの追加
  completeButton.innerText = '完了';
  completeButton.addEventListener('click', () => completeTask(completeButton));

  listItem.innerText = post.content;

  listItem.append(completeButton);
  listItem.append(removeButton);
  taskList.appendChild(listItem);
};

// 「登録する」ボタンを押したときにタスクを追加する
const contents = [];
function handle(req, res) {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      res.end(renderFile('./index.html', { contents: contents }));
      break;
      
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const decoded = decodeURIComponent(body);
        const content = decoded.split('content=')[1];
        console.info("登録されました: " + content);
        contents.push(content);
        console.info("登録された全内容: " + contents);
        handleRedirectPosts(req, res);
      });
      break;
    default:
      break;
  };
};

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
};

module.exports = {
  handle
};

// 完了ボタンを押したときにToDoに取り消し線をつける
const completeTask = completeButton => {
  const targetTask = completeButton.closest('li');
  targetTask.classList.add('isComplete');
  targetTask.removeChild(completeButton);
};

// 重要度順でソート

// sequelize の データベース上にデータ保存
Post.create({
  content: content,
  trackingCookie: null,
  postedBy: req.user
}).then(() => {
  handleRedirectPosts(req, res);
});

// データベースからデータを読み込む
Post.findAll({order:[['id', 'DESC']]}).then((posts) => {
  res.end(renderFile('./index.html', {
    posts: posts
  }));
});