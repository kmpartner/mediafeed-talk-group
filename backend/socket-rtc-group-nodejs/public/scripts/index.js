
let isAlreadyCalling = false;
let getCalled = false;

const existingCalls = [];

const { RTCPeerConnection, RTCSessionDescription } = window;

const peerConnection = new RTCPeerConnection();

function unselectUsersFromList() {
  const alreadySelectedUser = document.querySelectorAll(
    ".active-user.active-user--selected"
  );

  alreadySelectedUser.forEach(el => {
    el.setAttribute("class", "active-user");
  });
}

function createUserItemContainer(socketId) {
  const userContainerEl = document.createElement("div");

  const usernameEl = document.createElement("p");

  userContainerEl.setAttribute("class", "active-user");
  userContainerEl.setAttribute("id", socketId);
  usernameEl.setAttribute("class", "username");
  usernameEl.innerHTML = `Socket: ${socketId}`;

  userContainerEl.appendChild(usernameEl);

  userContainerEl.addEventListener("click", () => {
    unselectUsersFromList();
    userContainerEl.setAttribute("class", "active-user active-user--selected");
    const talkingWithInfo = document.getElementById("talking-with-info");
    talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
    callUser(socketId);
  });

  return userContainerEl;
}

async function callUser(socketId) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

  socket.emit("call-user", {
    offer,
    to: socketId
  });
}

function updateUser(userSocketId) {
  let userId = document.getElementById("user-socket-id");
  // console.log(userId);
  userId.innerHTML = `Socket: ${userSocketId}`
}

function updateUserList(socketIds) {
  const activeUserContainer = document.getElementById("active-user-container");
  console.log('socketIds', socketIds);
  socketIds.forEach(socketId => {
    const alreadyExistingUser = document.getElementById(socketId);
    if (!alreadyExistingUser) {
      const userContainerEl = createUserItemContainer(socketId);

      activeUserContainer.appendChild(userContainerEl);
    }
  });
}

const socket = io.connect("localhost:4001");

socket.on('user-socket', (data) => {
  console.log('user-socket :', data.userSocketId);
  updateUser(data.userSocketId);
});

socket.on("update-user-list", ({ users }) => {
  console.log("update-user-list", users);
  updateUserList(users);

  // socket.emit('hey', {
  //   to: users
  // });
});

socket.on("remove-user", ({ socketId }) => {
  console.log('remove-user socketId', socketId);
  const elToRemove = document.getElementById(socketId);
  console.log('elToRemove', elToRemove);
  if (elToRemove) {
    elToRemove.remove();
  }
});

socket.on("call-made", async data => {
  console.log('call-made data', data);
  if (getCalled) {
    const confirmed = confirm(
      `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
    );

    if (!confirmed) {
      socket.emit("reject-call", {
        from: data.socket
      });

      return;
    }
  }

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

  socket.emit("make-answer", {
    answer,
    to: data.socket
  });
  getCalled = true;
});

socket.on("answer-made", async data => {
  console.log("answer-made data", data);
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );

  if (!isAlreadyCalling) {
    callUser(data.socket);
    isAlreadyCalling = true;
  }
});

socket.on("call-rejected", data => {
  console.log('call-rejected data', data);
  alert(`User: "Socket: ${data.socket}" rejected your call.`);
  unselectUsersFromList();
});

socket.on('test-connect', data => {
  console.log('test-connect data', data);
})

socket.on('test-connect2', data => {
  console.log('test-connect2 data', data);
})

peerConnection.ontrack = function({ streams: [stream] }) {
  const remoteVideo = document.getElementById("remote-video");
  if (remoteVideo) {
    remoteVideo.srcObject = stream;
  }
};

navigator.getUserMedia(
  { video: true, audio: true },
  stream => {
    const localVideo = document.getElementById("local-video");
    console.log('localVideo', localVideo);
    if (localVideo) {
      localVideo.srcObject = stream;
    }

    stream.getTracks().forEach(track => {
      console.log(track, stream);
      return peerConnection.addTrack(track, stream)
    });
  },
  error => {
    console.warn(error.message);
  }
);