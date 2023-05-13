$(document).ready(function () {
    getTodos()
    
    function getTodos(){
        const url = 'todo/read'

        $.ajax({
            url: url,
            method: "GET",
            contentType: "application/json",
        }).done(function (todos) {
            console.log(todos)
            loadTodos(todos)
        });
    }

    function loadTodos(todos){
        for (const todo of todos) {
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
            }

            $('input:checkbox').change(function(){
                spanEle = $(this).parent().children('span')
                todoText = $(spanEle).text()
                checked = $(this).is(":checked")
                if(checked){
                    $(spanEle).html('<s>'+todoText+'</s>')
                } else {
                    $(spanEle).html(todoText)
                }

                const url = 'todo/update'

                const data = {
                    "todo": String(todoText),
                    "is_done": Number(checked),
                    "created": new Date()
                }

                var inputData = JSON.stringify(data)

                $.ajax({
                    url: url,
                    method: "POST",
                    data: inputData,
                    dataType: "json",
                    contentType: "application/json",
                }).done(function (result) {
                });
                
                
            })

    }

    
    $('#btnAdd').click(function () {
        const url = 'todo/add'

        const data = {
            "todo": String($('#txtTodo').val()),
            "is_done": 0,
            "created": new Date()
        }

        var inputData = JSON.stringify(data)

        $.ajax({
            url: url,
            method: "POST",
            data: inputData,
            dataType: "json",
            contentType: "application/json",
        }).done(function (result) {
            $('#txtTodo').val('')
            $('#todoContainer').empty()
            getTodos()
        });
    })

    $('#btnConnect').click(function () {
        const url = 'connect_to_db'

        const data = {
            "serverName": String($('#txtServerName').val()),
            "admin": String($('#txtAdmin').val()),
            "password": String($('#txtPassword').val()),
        }

        var inputData = JSON.stringify(data)

        $.ajax({
            url: url,
            method: "POST",
            data: inputData,
            dataType: "json",
            contentType: "application/json",
        }).done(function (result) {
            $('#result').append('  <div class="alert alert-primary" role="alert">\
            DB Connection Success!\
          </div>')
        });
    })
});