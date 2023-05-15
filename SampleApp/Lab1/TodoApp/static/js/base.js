$(document).ready(function () {
    $('#btnAdd').click(function () {
        const todo = {
            "todo": String($('#txtTodo').val()),
            "is_done": 0,
            "created": new Date()
        }

        todoText = '<span>'+todo.todo+'</span>'
            todoDone = '<input class="form-check-input me-2" type="checkbox" value="" />'
            if(todo.is_done == 1){
                todoText = '<span><s>'+todo.todo+'</s></span>'
                $(todoText).css('text-decoration-line','overline')
                todoDone = '<input class="form-check-input me-2" type="checkbox" value="" checked />'
            }
            $('#todoContainer').append('<li\
                class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">\
                <div class="d-flex align-items-center">\
                '+todoDone+'\
                '+todoText+'\
                </div>\
                <a href="#!" data-mdb-toggle="tooltip" title="Remove item">\
                <i class="fas fa-times text-primary"></i>\
                </a>\
            </li>')
    })
});