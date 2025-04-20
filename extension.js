const vscode = require('vscode');

function activate(context) {
    console.log('Расширение Three.js Autocomplete активировано');
    
    // Определяем базовые элементы Three.js для автодополнения
    const threeCompletions = [
        // Базовые классы
        { label: 'Vector2', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Vector2' },
        { label: 'Vector3', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Vector3' },
        { label: 'Vector4', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Vector4' },
        { label: 'Matrix3', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Matrix3' },
        { label: 'Matrix4', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Matrix4' },
        { label: 'Quaternion', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Quaternion' },
        
        // Геометрия
        { label: 'BoxGeometry', kind: vscode.CompletionItemKind.Class, detail: 'THREE.BoxGeometry' },
        { label: 'SphereGeometry', kind: vscode.CompletionItemKind.Class, detail: 'THREE.SphereGeometry' },
        { label: 'PlaneGeometry', kind: vscode.CompletionItemKind.Class, detail: 'THREE.PlaneGeometry' },
        
        // Материалы
        { label: 'MeshBasicMaterial', kind: vscode.CompletionItemKind.Class, detail: 'THREE.MeshBasicMaterial' },
        { label: 'MeshStandardMaterial', kind: vscode.CompletionItemKind.Class, detail: 'THREE.MeshStandardMaterial' },
        { label: 'MeshPhongMaterial', kind: vscode.CompletionItemKind.Class, detail: 'THREE.MeshPhongMaterial' },
        
        // Основные объекты
        { label: 'Scene', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Scene' },
        { label: 'PerspectiveCamera', kind: vscode.CompletionItemKind.Class, detail: 'THREE.PerspectiveCamera' },
        { label: 'WebGLRenderer', kind: vscode.CompletionItemKind.Class, detail: 'THREE.WebGLRenderer' },
        { label: 'Mesh', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Mesh' },
        { label: 'Group', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Group' },
        
        // Свет
        { label: 'AmbientLight', kind: vscode.CompletionItemKind.Class, detail: 'THREE.AmbientLight' },
        { label: 'DirectionalLight', kind: vscode.CompletionItemKind.Class, detail: 'THREE.DirectionalLight' },
        { label: 'PointLight', kind: vscode.CompletionItemKind.Class, detail: 'THREE.PointLight' },
        { label: 'SpotLight', kind: vscode.CompletionItemKind.Class, detail: 'THREE.SpotLight' },
        
        // Константы
        { label: 'FrontSide', kind: vscode.CompletionItemKind.Constant, detail: 'THREE.FrontSide' },
        { label: 'BackSide', kind: vscode.CompletionItemKind.Constant, detail: 'THREE.BackSide' },
        { label: 'DoubleSide', kind: vscode.CompletionItemKind.Constant, detail: 'THREE.DoubleSide' }
    ];
    
    // Общая функция для проверки контекста THREE
    function isThreeContext(linePrefix) {
        return linePrefix.endsWith('THREE.') || linePrefix.match(/THREE\.\w*$/);
    }

    // Общая функция для проверки минимальной длины строки
    function checkMinLength(linePrefix, minLength) {
        if (linePrefix.length < minLength) {
            console.log(`Слишком мало символов для проверки (минимум ${minLength} символа)`);
            return false;
        }
        return true;
    }

    // Регистрируем основной провайдер автодополнения
    const provider = vscode.languages.registerCompletionItemProvider(
        ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
        {
            provideCompletionItems(document, position) {
                const linePrefix = document.lineAt(position).text.substring(0, position.character);

                // Проверяем минимальную длину строки
                if (!checkMinLength(linePrefix, 4)) {
                    return undefined;
                }

                console.log(`Проверка автодополнения. Текст: "${linePrefix}"`);

                // Проверяем, находимся ли мы после "THREE."
                if (!isThreeContext(linePrefix)) {
                    console.log('Не в контексте THREE');
                    return undefined;
                }

                console.log('В контексте THREE, предоставляем автодополнения');

                // Создаем элементы автодополнения
                return threeCompletions.map(item => {
                    const completionItem = new vscode.CompletionItem(item.label, item.kind);
                    completionItem.detail = item.detail;

                    // Если это метод с параметрами, добавляем сниппет
                    if (item.snippet) {
                        completionItem.insertText = new vscode.SnippetString(item.snippet);
                    }

                    return completionItem;
                });
            }
        },
        '.' // Триггерный символ
    );

    // Добавляем провайдер в подписки контекста
    context.subscriptions.push(provider);

    // Регистрируем тестовый провайдер
    const testProvider = vscode.languages.registerCompletionItemProvider(
        ['javascript', 'typescript'],
        {
            provideCompletionItems(document, position) {
                const linePrefix = document.lineAt(position).text.substring(0, position.character);

                // Проверяем минимальную длину строки
                if (!checkMinLength(linePrefix, 4)) {
                    return undefined;
                }

                console.log(`Тестовый провайдер вызван. Текст: "${linePrefix}"`);

                // Всегда возвращаем тестовый элемент
                const testItem = new vscode.CompletionItem('TEST_ITEM', vscode.CompletionItemKind.Text);
                testItem.detail = 'Тестовый элемент автодополнения';

                return [testItem];
            }
        }
    );

    context.subscriptions.push(testProvider);
    console.log('Тестовый провайдер зарегистрирован');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};