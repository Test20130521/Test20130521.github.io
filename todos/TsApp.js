var App;
(function (App) {
    var enterKey = 13;
    var escapeKey = 27;
    var storageKey = 'occam-razor-typescript-20131028';
    function main() {
        fromStorage().forEach(addTodo);
        $('#new-todo').keyup(function (e) {
            if (e.which !== enterKey)
                return;
            var val = processValue($(this).val());
            if (!val)
                return;
            addTodo({ title: val, completed: false });
            $(this).val('');
            refreshTodoListInfoAndSave();
        });
        $('#toggle-all').change(function () {
            var checked = $(this).prop('checked');
            $todos().each(function () {
                setChecked($(this), checked);
            });
            refreshTodoListInfoAndSave();
        });
        $(window).bind('hashchange', function () {
            $todos().each(function () {
                refreshVisible($(this));
            });
            refreshFilterState();
        });
        $('#clear-completed').click(function () {
            $todos().each(function () {
                var item = $(this);
                if (todo(item).toggle.prop('checked'))
                    removeTodo(item);
            });
            refreshTodoListInfoAndSave();
        });
        refreshFilterState();
        refreshTodoListInfo();
    }
    App.main = main;
    function addTodo(data) {
        var item = $('#TodoTemplate').clone().removeAttr('id').appendTo('#todo-list');
        todo(item).title.text(data.title);
        setChecked(item, data.completed);
        todo(item).toggle.change(function () {
            refreshTodo(item);
            refreshTodoListInfoAndSave();
        });
        todo(item).title.dblclick(function () {
            todo(item).edit.val(data.title);
            var edit = todo(item.addClass('editing')).edit;
            edit.val(edit.val()).focus();
        });
        todo(item).edit.keyup(function (event) {
            if (event.which === enterKey)
                event.target.blur();
            else if (event.which === escapeKey) {
                todo(item).edit.val(todo(item).title.text());
                event.target.blur();
            }
        }).blur(function () {
            item.removeClass('editing');
            var newVal = processValue($(this).val());
            if (newVal)
                todo(item).title.text(newVal);
            else
                removeTodo(item);
            refreshTodoListInfoAndSave();
        });
        todo(item).destroy.click(function () {
            removeTodo(item);
            refreshTodoListInfoAndSave();
        });
    }
    function removeTodo(item) {
        item.remove();
    }
    function todo(item) {
        return Util.tag(item, function () {
            return {
                toggle: item.find('.toggle'),
                title: item.find('.title'),
                destroy: item.find('.destroy'),
                edit: item.find('.edit')
            };
        });
    }
    function setChecked(item, val) {
        todo(item).toggle.prop('checked', val);
        refreshTodo(item);
    }
    function refreshTodo(item) {
        item.toggleClass('completed', todo(item).toggle.prop('checked'));
        refreshVisible(item);
    }
    function refreshVisible(item) {
        var hash = window.location.hash;
        var show;
        if (hash === '#active')
            show = !todo(item).toggle.prop('checked');
        else if (hash === '#completed')
            show = todo(item).toggle.prop('checked');
        else
            show = true;
        item.toggle(show);
    }
    function refreshFilterState() {
        $('#filters').children().each(function () {
            var hash = window.location.hash;
            var filterItem = $(this).find('[href]');
            var selected;
            if (hash === '#active' || hash === '#completed')
                selected = filterItem.attr('href') === hash;
            else
                selected = filterItem.attr('href') === '#';
            filterItem.toggleClass('selected', selected);
        });
    }
    function refreshTodoListInfo() {
        var activeTodoCount = getActiveTodoCount();
        $('#toggle-all').prop('checked', activeTodoCount === 0);
        $('#main').toggle($todos().length > 0);
        var completedTodoCount = $todos().length - activeTodoCount;
        var footer = $('#footer');
        footer.find('#LeftTodoCount').text(activeTodoCount);
        footer.find('#PluralizeItem').text(activeTodoCount === 1 ? 'item' : 'items');
        footer.find('#CompletedCount').text(completedTodoCount);
        footer.find('#clear-completed').toggle(completedTodoCount > 0);
        footer.toggle($todos().length > 0);
    }
    function refreshTodoListInfoAndSave() {
        refreshTodoListInfo();
        toStorage(Util.map($todos(), function (item) {
            return {
                title: todo($(item)).title.text(),
                completed: todo($(item)).toggle.prop('checked')
            };
        }));
    }
    function toStorage(data) {
        localStorage.setItem(storageKey, JSON.stringify(data));
    }
    function fromStorage() {
        var storeItem = localStorage.getItem(storageKey);
        return storeItem !== null ? JSON.parse(storeItem) : [];
    }
    function $todos() {
        return $('#todo-list').children();
    }
    function getActiveTodoCount() {
        var count = 0;
        $todos().each(function () {
            if (!todo($(this)).toggle.prop('checked'))
                count++;
        });
        return count;
    }
    function processValue(val) {
        return $.trim(val);
    }
})(App || (App = {}));
$(App.main);
//# sourceMappingURL=TsApp.js.map