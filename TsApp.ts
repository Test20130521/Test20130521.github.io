declare var $: any;

module App {
    var enterKey = 13;
    var escapeKey = 27;
    var storageKey = 'occam-razor-typescript-20131028';

    interface ITodo {
        title: string;
        completed: boolean;
    }

    export function main() {
        fromStorage().forEach(addTodo);
        $('#new-todo').keyup(function(e: any) {
            if (e.which !== enterKey) return;
            const val = processValue($(this).val());
            if (!val) return;
            addTodo({ title: val, completed: false });
            $(this).val('');
            refreshTodoListInfoAndSave();
        });
        $('#toggle-all').change(function() {
            var checked = $(this).prop('checked');
            $todos().each(function() {
                setChecked($(this), checked);
            });
            refreshTodoListInfoAndSave();
        });
        $(window).bind('hashchange',
            () => {
                $todos().each(function() {
                    refreshVisible($(this));
                });
                refreshFilterState();
            });
        $('#clear-completed').click(() => {
            $todos().each(function() {
                const item = $(this);
                if (todo(item).toggle.prop('checked'))
                    removeTodo(item);
            });
            refreshTodoListInfoAndSave();
        });
        refreshFilterState();
        refreshTodoListInfo();
    }

    function addTodo(data: ITodo) {
        var item = $('#TodoTemplate').clone().removeAttr('id').appendTo('#todo-list');
        todo(item).title.text(data.title);
        setChecked(item, data.completed);
        todo(item).toggle.change(() => {
            refreshTodo(item);
            refreshTodoListInfoAndSave();
        });
        todo(item).title.dblclick(() => {
            todo(item).edit.val(data.title);
            var edit = todo(item.addClass('editing')).edit;
            edit.val(edit.val()).focus();
        });
        todo(item).edit.keyup((event: any) => {
            if (event.which === enterKey)
                event.target.blur();
            else if (event.which === escapeKey) {
                todo(item).edit.val(todo(item).title.text());
                event.target.blur();
            }
        }).blur(function() {
            item.removeClass('editing');
            const newVal = processValue($(this).val());
            if (newVal)
                todo(item).title.text(newVal);
            else
                removeTodo(item);
            refreshTodoListInfoAndSave();
        });
        todo(item).destroy.click(() => {
            removeTodo(item);
            refreshTodoListInfoAndSave();
        });
    }

    function removeTodo(item: any) {
        item.remove();
    }

    function todo(item: any) {
        return Util.tag(item,
            () => {
                return {
                    toggle: item.find('.toggle'),
                    title: item.find('.title'),
                    destroy: item.find('.destroy'),
                    edit: item.find('.edit')
                };
            });
    }

    function setChecked(item: any, val: boolean) {
        todo(item).toggle.prop('checked', val);
        refreshTodo(item);
    }

    function refreshTodo(item: any) {
        item.toggleClass('completed', todo(item).toggle.prop('checked'));
        refreshVisible(item);
    }

    function refreshVisible(item: any) {
        const hash = window.location.hash;
        let show: boolean;
        if (hash === '#active')
            show = !todo(item).toggle.prop('checked');
        else if (hash === '#completed')
            show = todo(item).toggle.prop('checked');
        else
            show = true;
        item.toggle(show);
    }

    function refreshFilterState() {
        $('#filters').children().each(function() {
            const hash = window.location.hash;
            const filterItem = $(this).find('[href]');
            var selected: boolean;
            if (hash === '#active' || hash === '#completed')
                selected = filterItem.attr('href') === hash;
            else
                selected = filterItem.attr('href') === '#';
            filterItem.toggleClass('selected', selected);
        });
    }

    function refreshTodoListInfo() {
        const activeTodoCount = getActiveTodoCount();
        $('#toggle-all').prop('checked', activeTodoCount === 0);
        $('#main').toggle($todos().length > 0);
        const completedTodoCount = $todos().length - activeTodoCount;
        const footer = $('#footer');
        footer.find('#LeftTodoCount').text(activeTodoCount);
        footer.find('#PluralizeItem').text(activeTodoCount === 1 ? 'item' : 'items');
        footer.find('#CompletedCount').text(completedTodoCount);
        footer.find('#clear-completed').toggle(completedTodoCount > 0);
        footer.toggle($todos().length > 0);
    }

    function refreshTodoListInfoAndSave() {
        refreshTodoListInfo();
        toStorage(Util.map($todos(),
            item => {
                return {
                    title: todo($(item)).title.text(),
                    completed: todo($(item)).toggle.prop('checked')
                };
            }));
    }

    function toStorage(data: ITodo[]) {
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function fromStorage(): ITodo[] {
        const storeItem = localStorage.getItem(storageKey);
        return storeItem !== null ? JSON.parse(storeItem) : [];
    }

    function $todos() {
        return $('#todo-list').children();
    }

    function getActiveTodoCount() {
        var count = 0;
        $todos().each(function() {
            if (!todo($(this)).toggle.prop('checked'))
                count++;
        });
        return count;
    }

    function processValue(val: string) {
        return $.trim(val);
    }
}

$(App.main);