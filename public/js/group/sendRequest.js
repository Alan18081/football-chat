$(document).ready(() => {
  const socket = io();
  const room = $('#groupName').val();
  const sender = $('#sender').val();
  socket.on('connect', () => {
    socket.emit('joinRequest',{
      sender
    },() => {
      console.log('Join request is sent');
    });
  });

  socket.on('newFriendRequest',({sender,receiver}) => {
    $('#reload').load(`${location.href} #reload`);
    $(document).on('click','.accept',e => {
      const btn = e.target;
      const senderId = $(btn).prevAll('.senderId').val();
      const senderName = $(btn).prevAll('.senderName').val();
      $.ajax({
        url: `/groups/addFriend/${room}`,
        type: 'POST',
        data: {
          senderId,
          senderName
        },
        success() {
          $(btn).closest('li').remove();
          $('#reload').load(`${location.href} #reload`);
        }
      })
    });
    $(document).on('click', '.reject',e => {
      const btn = e.target;
      const senderId = $(btn).prevAll('.senderId').val();
      $.ajax({
        url: `/groups/handleFriend/${room}`,
        type: 'POST',
        data: {
          senderId
        }
      });
    });
  });

  $('.accept').on('click',e => {
    const btn = e.target;
    const senderId = $(btn).prevAll('.senderId').val();
    const senderName = $(btn).prevAll('.senderName').val();
    $.ajax({
      url: `/groups/addFriend/${room}`,
      type: 'POST',
      data: {
        senderId,
        senderName
      },
      success() {
        $(btn).closest('li').remove();
        $('#reload').load(`${location.href} #reload`);
      }
    })
  });
  $('.reject').on('click',e => {
    const btn = e.target;
    const senderId = $(btn).prevAll('.senderId').val();
    $.ajax({
      url: `/groups/handleFriend/${room}`,
      type: 'POST',
      data: {
        senderId
      }
    });
  });

  $('#addFriend').on('click',() => {
    const receiverName = $('#modal-name').text();
    $.ajax({
      url: `/groups/${room}`,
      type: 'POST',
      data: {
        receiver: receiverName,
        sender
      },
      success() {
        socket.emit('friendRequest',{
          receiver: receiverName,
          sender
        },() => {
          console.log('Request to friendship is sent');
        });
      }
    })
  });
});