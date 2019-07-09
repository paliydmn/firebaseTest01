// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const adminEmail = document.querySelector('#admin-email').value;
  const adminResult = document.querySelector('.adminResult');
  const addAdminRole = functions.httpsCallable('addAdminRole');

  const preloader = document.querySelector('.preloader-wrapper');
  preloader.classList.add('active');
  // M.init(preloader).add
  //preloader.className = 'active small';

  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
    preloader.classList.remove('active');
    adminResult.innerHTML = `<p>${result.data.message}<\p>`;
    M.Modal.init(document.querySelector('#makeAdmin')).open();
  });
});
// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    //get data
    db.collection('guides').onSnapshot(snapshot => {
      console.log(snapshot.docs);
      setupGuides(snapshot.docs);
    });
  } else {
    setupGuides([]);
    setupUI();
    console.log('user logged out');
  }
});

// create new Guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();

  db.collection('guides').add({
    title: createForm['title'].value,
    content: createForm['content'].value
  }).then(() => {
    //close the modal and reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => { console.log(err); }
  );
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();

    //close side nav bar after successfull action
    M.Sidenav.getInstance(document.querySelector('#slide-out')).close();
  });
});

// logout
const logouts = document.querySelectorAll('#logout');
//function logOutListEventListener()
logouts.forEach(logOut => {
  logOut.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    //close side nav bar after successfull action
    M.Sidenav.getInstance(document.querySelector('#slide-out')).close();
  });
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');


    M.Modal.getInstance(modal).close();
    loginForm.reset();

    //close side nav bar after successfull action
    M.Sidenav.getInstance(document.querySelector('#slide-out')).close();

  });

});