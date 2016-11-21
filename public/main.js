
jQuery(function($){
    // alert("in jQuery");
    var socket = io.connect();
    var nickForm =  $('#setNick');
    var nickError =  $('#nickError');
    var nickBox =  $('#nickname');
    var messageBtn = $('#btn-chat');
    var messageBox = $('#btn-input');
    var users = $('#users');
    var chat = $('#chat');
    //var usersList = $("usersList");
    var login = "false";
    var panelbody = $('#panel-body');
    var usersList = $('#usersList');

    // This function handles the Keyboards ENTER key, We need this because user could click the SUBMIT button but also can just hit ENTER key
    $(document).keypress(function(e) {
        if(e.which == 13) {
            if(login == "true"){
              sendMessage();
            }
            else{
                e.preventDefault();
                addNewUser();
            }
        }
    });

    // This function handles the users entry of Nick name
    nickForm.submit(function(e){
        e.preventDefault();
        addNewUser();
    });

    messageBtn.click(function(e){
      sendMessage();
    });


    // This function handles the arrival for new message from the server
    socket.on('new_message',function(data){
        // construct the message with face icon for the chat
        var message = "<li class='left clearfix'><span class='chat-img pull-left'><img height='30' width='30' " +
            "src='http://i.stack.imgur.com/HQwHI.jpg' alt='User Avatar' class='img-circle'>" +
            "</span><div class='chat-body clearfix'><div class='header' ><strong class='pull-left primary-font' style='margin-left: 12px'>"
            + data.user+
            "</strong> <small class='pull-right text-muted'></div><p>"
            +  data.data
            + "</p></div></li> ";

        // Now add the message to the Chat Panel
        chat.append(message);

        // This makes sure the vertical scroller is always at the bottom
        setTimeout(function() {
            panelbody.scrollTop(panelbody[0].scrollHeight);
        }, 1);
    });

    function addNewUser() {

        var userNickName = nickBox.val().trim();
        socket.emit('new_user', userNickName, function (data) {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
                login = "true";
            } else {
                $("#error").slideDown("medium");
            }
        });
        nickBox.val("");
    }

    socket.on('user_list_modified', function(data){
        usersList.empty();
        usersList.append('<li id="header" class="list-group-item"><span class="badge"></span> *  Online Users * </li>');
        //console.log("Users: " + data);
        for (var i = 0 ; i< data.length; i++){

            var newUser = '<li class="list-group-item"><span class="badge">Online</span>' +data[i] +'</li>';
            usersList.append(newUser);


        }



    });

    function sendMessage(){
        socket.emit('send_message',messageBox.val());
        messageBox.val("");
    }

});


