"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let todos = [];
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    return res.status(200).json({ todos });
});
router.post("/todo", (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text,
    };
    todos.push(newTodo);
    res.status(201).json({ todo: newTodo });
});
router.put("/todo/:todoId", (req, res, next) => {
    const todoId = req.params.todoId;
    const todoIdx = todos.findIndex((todo) => todo.id === todoId);
    if (todoIdx >= 0) {
        todos[todoIdx] = {
            id: todoId,
            text: req.body.text,
        };
        return res.status(200).json({ todos: todos });
    }
    return res.status(404).json({ message: "Could not find todo" });
});
router.delete("/todo/:todoId", (req, res, next) => {
    const todoId = req.params.todoId;
    todos = todos.filter((todo) => todo.id !== todoId);
    return res.status(200).json({ todos });
});
exports.default = router;
