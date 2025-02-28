const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
    const completionsPath = path.join(context.extensionPath, 'threejs-completions.json');
    const completions = JSON.parse(fs.readFileSync(completionsPath, 'utf-8'));

    const provider = vscode.languages.registerCompletionItemProvider(
        completions.scope.split(','), // Поддерживаемые языки
        {
            provideCompletionItems(document, position) {
                return completions.completions.map(item => {
                    if (typeof item === 'string') {
                        return new vscode.CompletionItem(item, vscode.CompletionItemKind.Value);
                    } else {
                        const completionItem = new vscode.CompletionItem(item.trigger, vscode.CompletionItemKind.Method);
                        completionItem.insertText = new vscode.SnippetString(item.contents);
                        return completionItem;
                    }
                });
            }
        }
    );

    context.subscriptions.push(provider);
}

exports.activate = activate;