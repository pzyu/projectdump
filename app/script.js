$(function(){
	$.ajax({
		url: "http://api.forismatic.com/api/1.0/",
		jsonp: "jsonp",
		dataType: "jsonp",
		data: {
			method: "getQuote",
			lang: "en",
			format: "jsonp"
		}
	}).done(function(quote){
		console.log(quote);
		$("#quote").text("\"" + quote.quoteText + "\"").css("font-style", "italic");
		$("#author").text("- "+ quote.quoteAuthor).css("font-style", "italic").css("font-weight", "bold");
	});

	$.ajax({
		method: "GET",
		url: "https://api.unsplash.com/photos/random?client_id=c6fb740662938509116e3ae0e46cee8045469cb8ff69384d454b99f92277c790&category=4",
	}).done(function(r){
		console.log(r);
		var image = r.urls.regular;
		$("body").css("background-image", "url(" + image + ")");
		$("body").css("background-size", "cover");
		$("body").fadeIn(500);
	}).error(function(r) {
		console.log(r);
		$("body").css("background-image", "url('https://source.unsplash.com/category/nature/1600x900')");
		$("body").css("background-size", "cover");
		$("body").delay(1000).fadeIn(500);
	});


  $("#success-alert").hide();

	$('#new-todo').on('keypress', function(e){
    	e.preventDefault;
	    if (e.which == 13) { //13 is the ENTER key
	        if($(this).val() !== ''){
	            newTodo();
	        }else{
	            // some validation
							$("#success-alert").alert();
							$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
								$("#success-alert").slideUp(500);
							});
	        }
	    }
	});

    viewTodo();
})

function newTodo(){
   var newtodo = $("#new-todo").val();
	 if (newtodo === "") {
		 return;
	 }

    var data = {
        session: localStorage.getItem("session"),
        text:newtodo,
        isDone: false
    };

    $.ajax({
        method: "POST",
        url: "http://earlycodersx.com:8080/todo/create",
        data: data
    }).done(function(r){
        console.log(r);
        //alert("Status: " + r.status);
        if(r.status=="success"){
           var entryText=r.data.text;
           var entryID=r.data._id;

           var htmlTemplate = $('#new_entry_template').html();
           var $htmlToInsert = $(htmlTemplate);

            $htmlToInsert.closest("[name='table_row']").attr("data-id", entryID);
						$htmlToInsert.closest("[name='table_row']").attr("entry-done", "false");
            $htmlToInsert.find("[name='todo_text']").text(entryText);
            $htmlToInsert.find("[name='delete_button']").attr( "onclick", "deleteTodo('"+ entryID +"')" );
            $htmlToInsert.find("[name='edit_button']").attr("onclick", "editTodo('"+ entryID +"')");

            $('#todoTable').append($htmlToInsert);

            $('#new-todo').val("");
        }
    });
}

function viewTodo(){
    $.ajax({
        method: "GET",
        url: "http://earlycodersx.com:8080/todo/view/" + localStorage.getItem("session")
    }).done(function(respData){

        if(respData.status=="success"){

            var arrayOfTodos = respData.data;

            for (var i = 0; i < arrayOfTodos.length; i++){
                // Define data to be inserted into template
                console.log(arrayOfTodos[i]);
                var entryText = arrayOfTodos[i].text;
                var entryID = arrayOfTodos[i]._id;
								var entryDone = arrayOfTodos[i].isDone;

                // Get the template HTML as a string
                var htmlTemplate = $('#new_entry_template').html();
                // Change the stored html string into a jQuery object
                var $htmlToInsert = $(htmlTemplate);
                // Insert the data into the template (found in <head></head>)
                $htmlToInsert.closest("[name='table_row']").attr("data-id", entryID);
								$htmlToInsert.closest("[name='table_row']").attr("entry-done", entryDone.toString());
                $htmlToInsert.find("[name='todo_text']").text(entryText);
                $htmlToInsert.find("[name='delete_button']").attr( "onclick", "deleteTodo('"+ entryID +"')" );
                $htmlToInsert.find("[name='edit_button']").attr("onclick", "editTodo('"+ entryID +"')");

                if (entryDone === true) {
                	$htmlToInsert.find("[name='todo_text']").css("text-decoration", "line-through");
					$htmlToInsert.find("[name='edit_button']").text("Undo");
					$htmlToInsert.find("[name='edit_button']").removeClass("btn-info").addClass("btn-warning");
                }

                // Append to table
                $('#todoTable').append($htmlToInsert);
                // ===============END TEMPLATING===============

            }

        }
    });
}

function deleteTodo(id){
    $.ajax({
        method: "DELETE",
        url: "http://earlycodersx.com:8080/todo/delete/" + localStorage.getItem("session") + "/" + id
    }).done(function(respData) {
        console.log(respData);
        if (respData.status == "success") {
            console.log(respData);

            var test = $("[data-id=" + id + "]");
            $(test).fadeOut();
        }
    })
}

function editTodo(id, markAll){
    var test = $("[data-id=" + id + "]");
		var entryDone = test.attr("entry-done");

		if (entryDone == "false" || markAll) {
			test.attr("entry-done", "true");
			$(test).find("[name='todo_text']").css("text-decoration", "line-through");
			$(test).find("[name='edit_button']").text("Undo");
			$(test).find("[name='edit_button']").removeClass("btn-info").addClass("btn-warning");
		} else {
			test.attr("entry-done", "false");
			$(test).find("[name='todo_text']").css("text-decoration", "none");
			$(test).find("[name='edit_button']").text("Mark");
			$(test).find("[name='edit_button']").removeClass("btn-warning").addClass("btn-info");
		}

		var data = {
				id: id,
				session: localStorage.getItem("session"),
				isDone: test.attr("entry-done")
		};


  $.ajax({
      method: "PUT",
      url: "http://earlycodersx.com:8080/todo/update",
      data: data
  }).done(function(respData) {
      if (respData.status == "success") {
          console.log(respData.data.text);
      }
  });
}

function markAll() {
	$.ajax({
		method: "GET",
		url: "http://earlycodersx.com:8080/todo/view/" + localStorage.getItem("session")
	}).done(function(respData){
		if(respData.status=="success"){
			var arrayOfTodos = respData.data;

			for(var i = 0; i < arrayOfTodos.length; i++) {
				editTodo(arrayOfTodos[i]._id, true);
			}
		}
	});
}
