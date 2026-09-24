(function () {
  var history = [];
  var historyIndex = -1;

  var COMMANDS = {
    help: {
      desc: 'Показать все доступные команды',
      usage: 'help',
      run: function () {
        print('Доступные команды:', 'info');
        var names = Object.keys(COMMANDS).sort();
        for (var i = 0; i < names.length; i++) {
          var n = names[i];
          print('  ' + n + ' - ' + COMMANDS[n].desc, 'info');
        }
        return true;
      }
    },
    set: {
      desc: 'Установить значение настройки',
      usage: 'set <ключ> <значение>',
      run: function (args) {
        if (args.length < 2) { print('Использование: set <ключ> <значение>', 'err'); return false; }
        var key = args[0];
        var val = args.slice(1).join(' ');
        var all = Settings.all();
        if (!(key in all)) { print('Неизвестный ключ: ' + key, 'err'); return false; }
        var cur = all[key];
        var parsed;
        if (typeof cur === 'boolean') {
          if (val === 'true' || val === '1' || val === 'on') parsed = true;
          else if (val === 'false' || val === '0' || val === 'off') parsed = false;
          else { print('Ожидается true/false', 'err'); return false; }
        } else {
          parsed = val;
        }
        Settings.set(key, parsed);
        print('OK: ' + key + ' = ' + parsed, 'ok');
        return true;
      }
    },
    get: {
      desc: 'Показать значение настройки',
      usage: 'get <ключ>',
      run: function (args) {
        if (!args.length) { print('Использование: get <ключ>', 'err'); return false; }
        var all = Settings.all();
        if (!(args[0] in all)) { print('Неизвестный ключ: ' + args[0], 'err'); return false; }
        print(args[0] + ' = ' + all[args[0]], 'info');
        return true;
      }
    },
    list: {
      desc: 'Показать все настройки и их значения',
      usage: 'list',
      run: function () {
        var all = Settings.all();
        print('Настройки:', 'info');
        var keys = Object.keys(all).sort();
        for (var i = 0; i < keys.length; i++) {
          print('  ' + keys[i] + ' = ' + all[keys[i]], 'info');
        }
        return true;
      }
    },
    reset: {
      desc: 'Сбросить все настройки к значениям по умолчанию',
      usage: 'reset',
      run: function () {
        Settings.reset();
        print('Настройки сброшены', 'ok');
        return true;
      }
    },
    theme: {
      desc: 'Сменить тему: dark | light | blue',
      usage: 'theme <dark|light|blue>',
      run: function (args) {
        if (!args.length) { print('Текущая тема: ' + Settings.get('theme'), 'info'); return true; }
        var t = args[0];
        if (t !== 'dark' && t !== 'light' && t !== 'blue') { print('Допустимо: dark, light, blue', 'err'); return false; }
        Settings.set('theme', t);
        print('Тема: ' + t, 'ok');
        return true;
      }
    },
    font: {
      desc: 'Размер шрифта: small | medium | large',
      usage: 'font <small|medium|large>',
      run: function (args) {
        if (!args.length) { print('Текущий: ' + Settings.get('fontSize'), 'info'); return true; }
        var f = args[0];
        if (f !== 'small' && f !== 'medium' && f !== 'large') { print('Допустимо: small, medium, large', 'err'); return false; }
        Settings.set('fontSize', f);
        print('Размер шрифта: ' + f, 'ok');
        return true;
      }
    },
    density: {
      desc: 'Плотность списка: compact | normal | comfortable',
      usage: 'density <compact|normal|comfortable>',
      run: function (args) {
        if (!args.length) { print('Текущая: ' + Settings.get('density'), 'info'); return true; }
        var d = args[0];
        if (d !== 'compact' && d !== 'normal' && d !== 'comfortable') { print('Допустимо: compact, normal, comfortable', 'err'); return false; }
        Settings.set('density', d);
        print('Плотность: ' + d, 'ok');
        return true;
      }
    },
    user: {
      desc: 'Показать информацию о текущем пользователе',
      usage: 'user',
      run: function () {
        if (!window.S || !window.S.me) { print('Нет активной сессии', 'err'); return false; }
        print('ID: ' + window.S.me.id, 'info');
        print('Логин: ' + window.S.me.login, 'info');
        print('Имя: ' + window.S.me.name, 'info');
        print('Username: @' + window.S.me.username, 'info');
        return true;
      }
    },
    users: {
      desc: 'Показать количество пользователей в сети OldTG',
      usage: 'users',
      run: function () {
        if (!window.S || !window.S.allUsers) { print('Нет данных', 'err'); return false; }
        print('Всего пользователей: ' + window.S.allUsers.length, 'info');
        return true;
      }
    },
    chats: {
      desc: 'Показать количество чатов',
      usage: 'chats',
      run: function () {
        if (!window.S || !window.S.chats) { print('Нет данных', 'err'); return false; }
        print('Всего чатов: ' + window.S.chats.length, 'info');
        return true;
      }
    },
    clear: {
      desc: 'Очистить экран консоли',
      usage: 'clear',
      run: function () {
        var body = document.querySelector('.dev-console-body');
        if (body) body.innerHTML = '';
        return true;
      }
    },
    version: {
      desc: 'Показать версию OldTG',
      usage: 'version',
      run: function () {
        var v = window.OLDTG_CONFIG ? window.OLDTG_CONFIG.version : '?';
        var a = window.OLDTG_CONFIG ? window.OLDTG_CONFIG.author : '?';
        print('OldTG ver ' + v, 'info');
        print('By ' + a, 'info');
        return true;
      }
    },
    exit: {
      desc: 'Закрыть консоль',
      usage: 'exit',
      run: function () {
        closeDevConsole();
        return true;
      }
    }
  };

  function print(text, cls) {
    var body = document.querySelector('.dev-console-body');
    if (!body) return;
    var div = document.createElement('div');
    div.className = 'dev-console-line ' + (cls || 'info');
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function printEcho(text) {
    var body = document.querySelector('.dev-console-body');
    if (!body) return;
    var div = document.createElement('div');
    div.className = 'dev-console-line cmd';
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function parseLine(line) {
    var parts = [];
    var cur = '';
    var inQuote = false;
    var quoteChar = '';
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuote) {
        if (ch === quoteChar) { inQuote = false; }
        else cur += ch;
      } else {
        if (ch === '"' || ch === "'") { inQuote = true; quoteChar = ch; }
        else if (ch === ' ' || ch === '\t') {
          if (cur.length) { parts.push(cur); cur = ''; }
        } else cur += ch;
      }
    }
    if (cur.length) parts.push(cur);
    return parts;
  }

  function execute(line) {
    line = String(line || '').trim();
    if (!line) return;
    printEcho('> ' + line);
    history.push(line);
    if (history.length > 100) history.shift();
    historyIndex = history.length;

    var parts = parseLine(line);
    var name = parts[0].toLowerCase();
    var args = parts.slice(1);

    if (!COMMANDS[name]) {
      print('Неизвестная команда: ' + name + '. Введите help для списка команд.', 'err');
      return;
    }
    try {
      COMMANDS[name].run(args);
    } catch (e) {
      print('Ошибка: ' + e.message, 'err');
    }
  }

  function openDevConsole() {
    if (document.querySelector('.dev-console')) {
      var inp = document.querySelector('.dev-console-input');
      if (inp) inp.focus();
      return;
    }

    var root = document.createElement('div');
    root.className = 'dev-console';

    var header = document.createElement('div');
    header.className = 'dev-console-header';

    var title = document.createElement('div');
    title.className = 'dev-console-title';
    title.textContent = 'OldTG Dev Console';
    header.appendChild(title);

    var closeBtn = document.createElement('div');
    closeBtn.className = 'dev-console-close';
    closeBtn.textContent = 'X';
    closeBtn.onclick = closeDevConsole;
    header.appendChild(closeBtn);

    root.appendChild(header);

    var body = document.createElement('div');
    body.className = 'dev-console-body';
    root.appendChild(body);

    var inputRow = document.createElement('div');
    inputRow.className = 'dev-console-input-row';

    var prompt = document.createElement('div');
    prompt.className = 'dev-console-prompt';
    prompt.textContent = 'C:\\OldTG>';
    inputRow.appendChild(prompt);

    var input = document.createElement('input');
    input.className = 'dev-console-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    inputRow.appendChild(input);

    root.appendChild(inputRow);
    document.body.appendChild(root);

    print('OldTG Dev Console', 'info');
    print('Введите help для списка команд', 'info');
    print('', 'info');

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var v = input.value;
        input.value = '';
        execute(v);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = history[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          historyIndex++;
          input.value = history[historyIndex] || '';
        } else {
          historyIndex = history.length;
          input.value = '';
        }
      }
    });

    setTimeout(function () { input.focus(); }, 30);
  }

  function closeDevConsole() {
    var el = document.querySelector('.dev-console');
    if (el) el.remove();
  }

  window.openDevConsole = openDevConsole;
  window.closeDevConsole = closeDevConsole;
})();