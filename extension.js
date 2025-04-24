const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    console.log('Расширение Three.js Autocomplete активировано');

    // Путь к JSON файлу
    const completionsPath = path.join(context.extensionPath, 'threejs-completions_basic.json');

    // Загрузка JSON файла
    let threeCompletionsJson;
    try {
        if (fs.existsSync(completionsPath)) {
            const completionsContent = fs.readFileSync(completionsPath, 'utf-8');
            threeCompletionsJson = JSON.parse(completionsContent);
            console.log(`Загружено ${threeCompletionsJson.completions.length} элементов из JSON`);
        } else {
            console.error('Файл threejs-completions.json не найден.');
            return;
        }
    } catch (error) {
        console.error('Ошибка при загрузке JSON файла:', error);
        return;
    }

    // Регистрация провайдера автодополнения
    const provider = vscode.languages.registerCompletionItemProvider(
        ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
        {
            provideCompletionItems(document, position) {
                const linePrefix = document.lineAt(position).text.substring(0, position.character);

                // Проверяем минимальную длину строки
                if (linePrefix.length < 5) {
                    return undefined;
                }

                // Проверяем, находимся ли мы после "THREE."
                if (!linePrefix.endsWith('THREE.') && !linePrefix.match(/THREE\.\w*$/)) {
                    return undefined;
                }

                // Создаем элементы автодополнения
                return threeCompletionsJson.completions.map(item => {
                    const completionItem = new vscode.CompletionItem(item.label, getKind(item.kind));
                    completionItem.detail = item.detail;

                    if (item.snippet) {
                        completionItem.insertText = new vscode.SnippetString(item.snippet);
                    }

                    if (item.documentation) {
                        const markdown = new vscode.MarkdownString();
                        markdown.isTrusted = true;
                        markdown.appendMarkdown(`## ${item.label}\n`);
                        markdown.appendMarkdown(`${item.documentation.description}\n`);
                        if (item.documentation.params) {
                            markdown.appendMarkdown(`**Параметры:**\n\`${item.documentation.params}\`\n`);
                        }
                        if (item.documentation.example) {
                            markdown.appendCodeblock(item.documentation.example, 'javascript');
                        }
                        completionItem.documentation = markdown;
                    }

                    return completionItem;
                });
            }
        },
        '.' // Триггерный символ
    );

    context.subscriptions.push(provider);
}

function deactivate() {}

function getKind(kind) {
    switch (kind) {
        case 'class':
            return vscode.CompletionItemKind.Class;
        case 'constant':
            return vscode.CompletionItemKind.Constant;
        default:
            return vscode.CompletionItemKind.Property;
    }
}

module.exports = {
    activate,
    deactivate
};