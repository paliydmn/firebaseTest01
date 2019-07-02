
//  <!-- The core Firebase JS SDK is always required and must be listed first -->


/*const dbRefList = firebase.database().ref().child("tokens");
dbRefList.on('child_added', snap => {
console.log(snap);
});
*/

/*
function requestNotif()
{
    switch(Notification.permission.toLowerCase())
    {
        case "granted":
          subscribe();
            break;
        case "denied":
          console.log("Permission if not given!");
            break;
        case "default":
          Notification.requestPermission(function(state){
            if(state == "granted")
              subscribe();
            if(state == "default")
              setTimeout("requestNotif",3000);
            });
            break;
    }
}
console.log("Ask Permission");

requestNotif();
*/

//AUTH and firestore references
// const auth = firebase.auth();
// const db = firebase.firestore();

// update firestore settings
//deprecated
//db.settings({ timestampsInSnapshots: true });
//
// auth.createUserWithEmailAndPassword("paliydmn@gmail.com", "superpasswd")
// .then(cred => {
//     console.log(cred);
// });

//setup guide
console.log("***********Main app Init **********");

// DOM elements
const guideList = document.querySelector('.guides');

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');


const setupUI = (user) => {
  if(user){
    //account details
    const html = `
    <div> Looged in as ${user.email}</div>
    `;
    accountDetails.innerHTML = html;

    //toggle UI elems 
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else{
    // side account details
    accountDetails.innerHTML = '';

    //toggle UI elems
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};

// setup guides
const setupGuides = (data) => {
  const pushBlock = document.querySelector('.pushBlock');
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
    pushBlock.style = "display:block;";
  } else {
    guideList.innerHTML = '<h5 class="center-align"> Login, please, to see the content</h5>';
    pushBlock.style = "display:none;";
  }
};

function subscribe() {
  var msg = firebase.messaging();
  msg.requestPermission().then(function () {
    msg.getToken().then(function (token) {
      console.log(token);
      writeUserData(token);
    }).catch(function (err) {
      console.log("Can't get a tocken!");
    });
  }).catch(function (err) {
    console.log(err);
  });
}
subscribe();
/*
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
var UUID = uuidv4();
console.log(UUID);
*/
function writeUserData(token) {
  let id = token.substring(0, 4) + token.substring(token.length - 5, token.length);
  firebase.database().ref("tokens").child(id).set(token)
    .catch(function (error) {
      console.log('database ref error: ', error);
    });
}
