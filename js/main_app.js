// DOM elements
const guideList = document.querySelector('.guides');

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
      setupPush(user);
    }
    //account details
   // db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div> Looged in as ${user.email}</div>
        <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
        `;
      accountDetails.innerHTML = html;
    //});
    //toggle UI elems 
    //const pushBlock = document.querySelector('.pushBlock');

    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // side account details
    accountDetails.innerHTML = '';

    //toggle UI elems
    adminItems.forEach(item => item.style.display = 'none');
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};

// setup guides
const setupGuides = (data) => {
  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const guide = doc.data();
      const li = `
      <li>
        <div class="collapsible-header grey lighten-4"> ${guide.title} </div>
        <div class="collapsible-body white"> ${guide.content} </div>
      </li>
    `;
      html += li;
    });
    guideList.innerHTML = html;
    //pushBlock.style = "display:block;";
  } else {
    guideList.innerHTML = '<h5 class="center-align"> Login, please, to see the content</h5>';
    //pushBlock.style = "display:none;";
  }
};

var msg = firebase.messaging();

msg.onTokenRefresh(() => {
  console.log(messaging.getToken());
    messaging.getToken().then((refreshedToken) => {
      console.log('Token refreshed.');
      //setTokenSentToServer(false);
      sendTokenToServer(refreshedToken);
    }).catch((err) => {
      console.log('Unable to retrieve refreshed token ', err);
    });
  });

function subscribe() {
  msg.requestPermission().then(function () {
    msg.getToken().then(function (token) {
      //console.log(token);
      sendTokenToServer(token);
      isNotifAllowed();
    }).catch(function (err) {
      console.log("Can't get a tocken!");
    });
  }).catch(function (err) {
    console.log(err);
    isNotifAllowed();
  });
}

var subscribeBtn = document.querySelector('.subscribe');

subscribeBtn.onclick = function(){
  console.log("Subscribe clicked");
  subscribe();
  isNotifAllowed();
};
function isNotifAllowed(){
  var permission = Notification.permission;
  if(permission === "default"){
    subscribeBtn.style.display = 'inline';
  } else{
    subscribeBtn.style.display = 'none';
  }
}
isNotifAllowed();




/*
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
var UUID = uuidv4();
console.log(UUID);
*/
function sendTokenToServer(token) {
  var id = token.substring(0, 4) + token.substring(token.length - 5, token.length);
  firebase.database().ref("tokens").child(id).set(token)
    .catch(function (error) {
      console.log('database ref error: ', error);
    });
}
