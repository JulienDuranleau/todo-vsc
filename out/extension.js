'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const Todo = require("./Todo").default;

function activate(context) {
    const todo = new Todo()
}

function deactivate() { }

exports.activate = activate
exports.deactivate = deactivate