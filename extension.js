const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    console.log('Расширение Three.js Autocomplete активировано');
    
    // Загрузка полного списка автодополнений из JSON файла
    let threeCompletionsJson;
    try {
        const completionsPath = path.join(context.extensionPath, 'threejs-completions.json');
        if (fs.existsSync(completionsPath)) {
            const completionsContent = fs.readFileSync(completionsPath, 'utf-8');
            threeCompletionsJson = JSON.parse(completionsContent);
            console.log(`Загружено ${threeCompletionsJson.completions.length} элементов из JSON`);
        } else {
            console.log('Файл threejs-completions.json не найден, используем встроенные элементы');
        }
    } catch (error) {
        console.error('Ошибка при загрузке JSON файла:', error);
    }
    
    // Документация для элементов Three.js
    const threeDocsMap = {
        // Базовые классы
        'Vector2': {
            description: '2D вектор с компонентами x и y',
            params: 'x: Number, y: Number',
            example: 'const vector = new THREE.Vector2(1, 2);'
        },
        'Vector3': {
            description: '3D вектор с компонентами x, y и z',
            params: 'x: Number, y: Number, z: Number',
            example: 'const vector = new THREE.Vector3(1, 2, 3);'
        },
        'Matrix4': {
            description: 'Матрица 4x4 для 3D-преобразований',
            params: '',
            example: 'const matrix = new THREE.Matrix4();'
        },
        'Quaternion': {
            description: 'Кватернион для представления вращений',
            params: 'x: Number, y: Number, z: Number, w: Number',
            example: 'const quaternion = new THREE.Quaternion();'
        },
        
        // Геометрия
        'BoxGeometry': {
            description: 'Геометрия прямоугольного параллелепипеда',
            params: 'width: Number, height: Number, depth: Number',
            example: 'const geometry = new THREE.BoxGeometry(1, 1, 1);'
        },
        'SphereGeometry': {
            description: 'Геометрия сферы',
            params: 'radius: Number, widthSegments: Number, heightSegments: Number',
            example: 'const geometry = new THREE.SphereGeometry(1, 32, 32);'
        },
        'PlaneGeometry': {
            description: 'Геометрия плоскости',
            params: 'width: Number, height: Number',
            example: 'const geometry = new THREE.PlaneGeometry(10, 10);'
        },
        
        // Материалы
        'MeshBasicMaterial': {
            description: 'Базовый материал без освещения',
            params: '{ color: Number, wireframe: Boolean, map: Texture }',
            example: 'const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });'
        },
        'MeshStandardMaterial': {
            description: 'Физически корректный материал с PBR',
            params: '{ color: Number, roughness: Number, metalness: Number }',
            example: 'const material = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5, metalness: 0.5 });'
        },
        
        // Основные объекты
        'Scene': {
            description: 'Контейнер для всех объектов сцены',
            params: '',
            example: 'const scene = new THREE.Scene();'
        },
        'PerspectiveCamera': {
            description: 'Камера с перспективной проекцией',
            params: 'fov: Number, aspect: Number, near: Number, far: Number',
            example: 'const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);'
        },
        'WebGLRenderer': {
            description: 'Рендерер WebGL для отображения сцены',
            params: '{ antialias: Boolean, alpha: Boolean }',
            example: 'const renderer = new THREE.WebGLRenderer({ antialias: true });'
        },
        'Mesh': {
            description: 'Объект с геометрией и материалом',
            params: 'geometry: Geometry, material: Material',
            example: 'const mesh = new THREE.Mesh(geometry, material);'
        },
        
        // Свет
        'AmbientLight': {
            description: 'Рассеянный свет, освещающий все объекты равномерно',
            params: 'color: Number, intensity: Number',
            example: 'const light = new THREE.AmbientLight(0xffffff, 0.5);'
        },
        'DirectionalLight': {
            description: 'Направленный свет, имитирующий солнце',
            params: 'color: Number, intensity: Number',
            example: 'const light = new THREE.DirectionalLight(0xffffff, 1);'
        },
        'PointLight': {
            description: 'Точечный источник света, излучающий во всех направлениях',
            params: 'color: Number, intensity: Number, distance: Number',
            example: 'const light = new THREE.PointLight(0xffffff, 1, 100);'
        },
        
        // Константы
        'FrontSide': {
            description: 'Константа для рендеринга только передней стороны полигонов',
            example: 'material.side = THREE.FrontSide;'
        },
        'BackSide': {
            description: 'Константа для рендеринга только задней стороны полигонов',
            example: 'material.side = THREE.BackSide;'
        },
        'DoubleSide': {
            description: 'Константа для рендеринга обеих сторон полигонов',
            example: 'material.side = THREE.DoubleSide;'
        }
    };
    
    // Определяем базовые элементы Three.js для автодополнения
    const threeCompletions = [
        // Базовые классы
        { label: 'Vector2', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Vector2', snippet: 'Vector2($1, $2)' },
        { label: 'Vector3', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Vector3', snippet: 'Vector3($1, $2, $3)' },
        { label: 'Vector4', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Vector4', snippet: 'Vector4($1, $2, $3, $4)' },
        { label: 'Matrix3', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Matrix3', snippet: 'Matrix3()' },
        { label: 'Matrix4', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Matrix4', snippet: 'Matrix4()' },
        { label: 'Quaternion', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Quaternion', snippet: 'Quaternion()' },
        
        // Геометрия
        { label: 'BoxGeometry', kind: vscode.CompletionItemKind.Class, detail: 'THREE.BoxGeometry', snippet: 'BoxGeometry($1, $2, $3)' },
        { label: 'SphereGeometry', kind: vscode.CompletionItemKind.Class, detail: 'THREE.SphereGeometry', snippet: 'SphereGeometry($1, $2, $3)' },
        { label: 'PlaneGeometry', kind: vscode.CompletionItemKind.Class, detail: 'THREE.PlaneGeometry', snippet: 'PlaneGeometry($1, $2)' },
        
        // Материалы
        { label: 'MeshBasicMaterial', kind: vscode.CompletionItemKind.Class, detail: 'THREE.MeshBasicMaterial', snippet: 'MeshBasicMaterial({ color: 0x$1 })' },
        { label: 'MeshStandardMaterial', kind: vscode.CompletionItemKind.Class, detail: 'THREE.MeshStandardMaterial', snippet: 'MeshStandardMaterial({ color: 0x$1 })' },
        { label: 'MeshPhongMaterial', kind: vscode.CompletionItemKind.Class, detail: 'THREE.MeshPhongMaterial', snippet: 'MeshPhongMaterial({ color: 0x$1 })' },
        
        // Основные объекты
        { label: 'Scene', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Scene', snippet: 'Scene()' },
        { label: 'PerspectiveCamera', kind: vscode.CompletionItemKind.Class, detail: 'THREE.PerspectiveCamera', snippet: 'PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)' },
        { label: 'WebGLRenderer', kind: vscode.CompletionItemKind.Class, detail: 'THREE.WebGLRenderer', snippet: 'WebGLRenderer({ antialias: true })' },
        { label: 'Mesh', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Mesh', snippet: 'Mesh($1, $2)' },
        { label: 'Group', kind: vscode.CompletionItemKind.Class, detail: 'THREE.Group', snippet: 'Group()' },
        
        // Свет
        { label: 'AmbientLight', kind: vscode.CompletionItemKind.Class, detail: 'THREE.AmbientLight', snippet: 'AmbientLight(0x$1)' },
        { label: 'DirectionalLight', kind: vscode.CompletionItemKind.Class, detail: 'THREE.DirectionalLight', snippet: 'DirectionalLight(0x$1, $2)' },
        { label: 'PointLight', kind: vscode.CompletionItemKind.Class, detail: 'THREE.PointLight', snippet: 'PointLight(0x$1, $2, $3)' },
        { label: 'SpotLight', kind: vscode.CompletionItemKind.Class, detail: 'THREE.SpotLight', snippet: 'SpotLight(0x$1, $2, $3, $4)' },
        
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

    // Функция для создания документации в формате Markdown
    function createDocumentation(name) {
        const docs = threeDocsMap[name];
        if (!docs) {
            return new vscode.MarkdownString(`**THREE.${name}**`);
        }
        
        let markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;
        
        markdown.appendMarkdown(`## THREE.${name}\n\n`);
        
        if (docs.description) {
            markdown.appendMarkdown(`${docs.description}\n\n`);
        }
        
        if (docs.params) {
            markdown.appendMarkdown(`**Параметры:**\n\n\`${docs.params}\`\n\n`);
        }
        
        if (docs.example) {
            markdown.appendCodeblock(docs.example, 'javascript');
        }
        
        return markdown;
    }

    // Регистрируем основной провайдер автодополнения
    const provider = vscode.languages.registerCompletionItemProvider(
        ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
        {
            provideCompletionItems(document, position) {
                const linePrefix = document.lineAt(position).text.substring(0, position.character);

                // Проверяем минимальную длину строки
                if (!checkMinLength(linePrefix, 5)) {
                    return undefined;
                }

                console.log(`Проверка автодополнения. Текст: "${linePrefix}"`);

                // Проверяем, находимся ли мы после "THREE."
                if (!isThreeContext(linePrefix)) {
                    console.log('Не в контексте THREE');
                    return undefined;
                }

                console.log('В контексте THREE, предоставляем автодополнения');

                // Используем JSON файл, если он загружен, иначе используем встроенные элементы
                let completionsToUse = threeCompletionsJson ? threeCompletionsJson.completions : threeCompletions;
                
                // Создаем элементы автодополнения
                return completionsToUse.map(item => {
                    // Обрабатываем элементы из JSON файла
                    if (typeof item === 'string') {
                        // Простая строка из JSON файла
                        const name = item.replace('THREE.', '');
                        const isClass = name.charAt(0) === name.charAt(0).toUpperCase() && 
                                       name.charAt(0) !== name.charAt(0).toLowerCase();
                        
                        const completionItem = new vscode.CompletionItem(
                            name, 
                            isClass ? vscode.CompletionItemKind.Class : vscode.CompletionItemKind.Constant
                        );
                        
                        completionItem.detail = item;
                        
                        // Добавляем скобки для классов
                        if (isClass && !name.includes('.')) {
                            completionItem.insertText = new vscode.SnippetString(`${name}($0)`);
                        } else {
                            completionItem.insertText = name;
                        }
                        
                        // Добавляем документацию
                        completionItem.documentation = createDocumentation(name);
                        
                        return completionItem;
                    } 
                    // Обрабатываем объекты с триггером и содержимым из JSON файла
                    else if (item.trigger && item.contents) {
                        const name = item.trigger.replace('THREE.', '');
                        const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Method);
                        completionItem.detail = item.trigger;
                        completionItem.insertText = new vscode.SnippetString(item.contents.replace('THREE.', ''));
                        
                        // Добавляем документацию
                        completionItem.documentation = createDocumentation(name);
                        
                        return completionItem;
                    } 
                    // Обрабатываем встроенные элементы
                    else {
                        const completionItem = new vscode.CompletionItem(item.label, item.kind);
                        completionItem.detail = item.detail;
                        
                        // Если это класс или метод с параметрами, добавляем сниппет
                        if (item.snippet) {
                            completionItem.insertText = new vscode.SnippetString(item.snippet);
                        }
                        
                        // Добавляем документацию
                        completionItem.documentation = createDocumentation(item.label);
                        
                        return completionItem;
                    }
                });
            }
        },
        '.' // Триггерный символ
    );

    // Добавляем провайдер в подписки контекста
    context.subscriptions.push(provider);

    console.log('Провайдер автодополнения Three.js зарегистрирован');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};