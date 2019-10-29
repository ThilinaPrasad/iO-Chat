var loggedUser;

$("#firstmsg_time").text(getTimeStamp());

$(document).ready(function(){
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
        });

// Sockets Handling
    var msg_count = 0;

    var socket = io.connect();
    var $send_btn = $('#send_btn');
    var $message = $('#message');
    var $chat = $('#chat');
    var $messageArea = $('#messageArea');
    var $onlineusers = $('#users_online');

    socket.on('get users', function(data){
        var html = '';
        for(var i = 0; i<data.length;i++){
           html+='<li><div class="d-flex bd-highlight"><div class="img_cont"><img src="'+data[i].Paa+'" class="rounded-circle user_img" data-toggle="modal" data-target="#'+data[i].Eea+'"><span class="online_icon"></span></div><div class="user_info"><span>'+data[i].ig+'</span><p>'+data[i].ofa+' is online</p></div></div></li>';
           var usr_data_html = '<img src="'+data[i].Paa+'" class="profile-img mx-auto d-block mb-2"><h3 class="text-center">'+data[i].ig+'</h3><div class="text-center mb-2">'+data[i].U3+'</div>';
           html+='<div class="modal fade" id="'+data[i].Eea+'" tabindex="-1" role="dialog" aria-labelledby="'+data[i].Eea+'" aria-hidden="true"> <div class="modal-dialog modal-dialog-centered" role="document"> <div class="modal-content" style="background-color: transparent;border:none;"> <div class="modal-body profile-body"> <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: white;"> <span aria-hidden="true">×</span> </button> '+usr_data_html+' </div> </div> </div> </div>'
        }
        $onlineusers.html(html);
    });

    $send_btn.click(function(e){
        e.preventDefault();
        if($message.val()){
        socket.emit('send message',$message.val());
        $message.val('');
        }
    });

    $message.on("keypress", function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        console.log($message.val());
        if($message.val()){
            socket.emit('send message',$message.val());
            $message.val('');
            }
    }
});
    socket.on('new message',function(data){
        msg_count+=1;
        if(loggedUser && loggedUser.Eea == data.user.Eea){
            $chat.append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">'+data.msg+'<span class="msg_time_send">'+getTimeStamp()+'</span></div><div class="img_cont_msg"><img src="'+data.user.Paa+'" class="rounded-circle user_img_msg" data-toggle="modal" data-target="#'+data.user.Eea+'"> </div></div>');
        }else{
            $chat.append('<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="'+data.user.Paa+'" class="rounded-circle user_img_msg" data-toggle="modal" data-target="#'+data.user.Eea+'"></div><div class="msg_cotainer">'+data.msg+'<span class="msg_time">'+getTimeStamp()+'</span></div></div>');
        }
        $(function() {
            var height = $chat[0].scrollHeight;
            $chat.scrollTop(height);
          });
        $('#msg_count').text(msg_count+" Messages");
    });

    $('#signout').click(function(){
        socket.emit('sign out',loggedUser);
        $('#loginArea').show(2000);
         $('#chatArea').hide(2000);
         loggedUser = {};
    });

// END - Sockets handling 

/// Google sign in
var googleUser = {};
  var startApp = function() {
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '789191819966-an99ofvaq4p0b1qveipo6ctlos43pd1u.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      attachSignin(document.getElementById('google_signin'));
    });
  };

  function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function(googleUser) {
        loggedUser = googleUser.getBasicProfile();
         socket.emit('new user',loggedUser);
         console.log(loggedUser);
            var prfile_data_html = '<img src="'+loggedUser.Paa+'" class="profile-img mx-auto d-block mb-2"><h3 class="text-center">'+loggedUser.ig+'</h3><div class="text-center mb-2">'+loggedUser.U3+'</div>';
            $('#profile-data').html(prfile_data_html);
         $('#loginArea').hide(2000);
         $('#chatArea').show(2000);
        }, function(error) {
          console.log(JSON.stringify(error, undefined, 2));
        });
  }

  startApp();

// END Google sign in

  function getTimeStamp() {
      var date = new Date();

      var hours = date.getHours();
      var minutes = date.getMinutes();

    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm + ', Today';
    return strTime;
  }
  
