"use strict"
Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")
const path = require("path")

const ACCEPTED_FILENAMES = [
    'todo.txt',
]

class Todo {
    constructor() {

        this.activeEditor = null

        this.decorations = new Map([
            ["date", {
                list: [],
                regex: new RegExp(/\d{4}-\d{2}-\d{2}/g),
                type: vscode.window.createTextEditorDecorationType({
                    color: 'rgb(244, 244, 186)'
                }),
            }],
            ["day", {
                list: [],
                regex: new RegExp(/:::.*$/g),
                type: vscode.window.createTextEditorDecorationType({
                    fontWeight: 'bold',
                    color: 'rgb(209, 186, 244)',
                }),
            }],
            ["tag", {
                list: [],
                regex: new RegExp(/\B\@\w+/g),
                type: vscode.window.createTextEditorDecorationType({
                    color: 'rgb(190, 244, 186)',
                }),
            }],
            ["completed", {
                list: [],
                regex: new RegExp(/(x|X) .*$/g),
                type: vscode.window.createTextEditorDecorationType({
                    fontStyle: 'italic',
                    textDecoration: 'line-through',
                    opacity: '0.5',
                }),
            }],
        ])

        this.decorateDocument()

        vscode.window.onDidChangeTextEditorSelection(this.onEvent, this)
        vscode.window.onDidChangeActiveTextEditor(this.onEvent, this)
    }

    onEvent() {
        this.decorateDocument()
    }

    decorateDocument() {
        this.clearAllDecorations()

        if (vscode.window.activeTextEditor !== undefined) {

            this.activeEditor = vscode.window.activeTextEditor

            let fileName = path.basename(vscode.window.activeTextEditor.document.fileName)

            if (ACCEPTED_FILENAMES.lastIndexOf(fileName) >= 0) {

                let totalLines = vscode.window.activeTextEditor.document.lineCount

                for (var i = 0; i < totalLines; i++) {
                    this.parseLineObject(vscode.window.activeTextEditor.document.lineAt(i))
                }
            }

            this.applyDecorations()
        }
    }

    parseLineObject(inputLine) {
        for (let decorator of this.decorations.values()) {
            let result = false
            while (result = decorator.regex.exec(inputLine.text)) {
                let beginPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index)
                let endPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index + result[0].length)
                let decoration = {
                    range: new vscode.Range(beginPosition, endPosition)
                }
                decorator.list.push(decoration)
            }
        }
    }

    clearAllDecorations() {
        for (let decorator of this.decorations.values()) {
            decorator.list = []
        }
    }

    applyDecorations() {
        for (let decorator of this.decorations.values()) {
            this.activeEditor.setDecorations(decorator.type, decorator.list)
        }
    }
}

exports.default = Todo