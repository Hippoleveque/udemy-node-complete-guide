import { Router } from "express";

import { Todo } from "../models/todo";

let todos: Todo[] = [];

const router = Router();

type RequestBody = {
  text: string;
};

type RequestParams = {
  todoId: string;
};

router.get("/", (req, res, next) => {
  return res.status(200).json({ todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };
  todos.push(newTodo);
  res.status(201).json({ todo: newTodo });
});

router.put("/todo/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;
  const body = req.body as RequestBody;
  const todoId = params.todoId;
  const todoIdx = todos.findIndex((todo) => todo.id === todoId);
  if (todoIdx >= 0) {
    todos[todoIdx] = {
      id: todoId,
      text: body.text,
    };
    return res.status(200).json({ todos: todos });
  }
  return res.status(404).json({ message: "Could not find todo" });
});

router.delete("/todo/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;
  const todoId = params.todoId;
  todos = todos.filter((todo) => todo.id !== todoId);
  return res.status(200).json({ todos });
});

export default router;
