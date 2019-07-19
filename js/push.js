//<!-- The core Firebase JS SDK is always required and must be listed first -->
function setupPush(data) {
	if (data.admin) {
		const dbRefList = firebase.database().ref("tokens");
		let str = '<ul class="tList">';
		function showList() {
			//
			getTokens(function () {
				document.getElementById("tokenList").innerHTML = str;
			});
		}
		function getTokens(showList) {
			dbRefList.once('value', snap => {
				var snapResult = Object.values(snap.val());
				if (snapResult.length > 1) {
					str += '<li class="li selectAll"><div class="deleteTok" style="display: none;"></div>Select all</li>';
				}
				snapResult.forEach(val => {
					str += '<li class="li"><div class="deleteTok" style="display: none;"></div>' + val + '</li>';
				});
				showList();
				//--------------------------------------------
				const list = document.getElementById("tokenList").getElementsByTagName("li");
				const iterable = Array.prototype.slice.call(list);
				var i = 0;
				iterable.forEach(function (item) {
					var id = i++;
					item.id = '_'+id;
					if(id !== 0){
						item.children[0].id = '_' + id; 
					}
				});
				//DELETE TIKENS FROM DB
				var deleteList = document.querySelectorAll('.deleteTok');
				[].forEach.call(deleteList, function(tok) {
					// do whatever
					tok.addEventListener('click', function (e) {
						console.log(e.target.parentNode.innerText);
						//const dbRefList = firebase.database().ref('tokens/cgOsRW0e6').remove();
						//dbRefList.ref(''); = token.substring(0, 4) + token.substring(token.length - 5, token.length);
						M.Modal.init(document.querySelector('#delNotif')).open(); 
						
						document.querySelector('#agree').onclick = function(){
							console.log('click agree');
							var item = e.target.parentNode.innerText;
							if (item === "Select all"){
								//ToDo remove all 
								var selectedArr = Array.prototype.slice.call(document.querySelectorAll('li.selected'));
								selectedArr.forEach(item =>{
									if (item.innerText === "Select all"){return;}
									console.log("remove all! " +item.innerText);	
									deleteToken(item.innerText);						
								});
								return;
							}
							deleteToken(item);
						};
					
						document.querySelector('#disagree').onclick = function(){
							console.log('click disagree');
						};
		
					});
				  });
				//Delete token from database
				  function deleteToken(item){
					var target = 'tokens/'+item.substring(0, 4) + item.substring(item.length -5, item.length);
					firebase.database().ref(target).remove()
					.then( () => { 
						console.log('Success!');
						e.target.parentNode.remove();
					})
					.catch(err => {
						console.log(err.message);	
					});
				  }
				// SELECT DESELECT SELECT-ALL 
				document.querySelector('.tList').addEventListener('click', function (e) {
					if (e.target.tagName === 'LI') {
						let idStr = "#" + e.target.id;
						id = document.querySelector(idStr);
						if (id.className == 'li selectAll') {
							iterable.forEach(function (item) {
								item.className = 'li selected';
								item.children[0].style.display = 'block';
								id.children[0].style.display = 'block';
							});
							id.className = 'li selectAll selected';
						} else {
							if (id.className == 'li selectAll selected') {
								iterable.forEach(function (item) {
									if (item.className != 'selectAll'){
										item.className = 'li';
										id.children[0].style.display = 'none';
										item.children[0].style.display = 'none';
									}
								});
								id.className = 'li selectAll';
							} else {
								if (id.className == 'li selected') {
									id.className = 'li';
									id.children[0].style.display = 'none';
								} else {
									e.target.className = 'li selected';
									id.children[0].style.display = 'block';
								}
							}
						}
					}
				});
			});
		}
		showList();
		let sentCount = 0;
		let successCount = 0;
		let failureCount = 0;

		function deleteTok(){

		}

		//Handle POST. send puches to users
		var sendBtn = document.getElementById("send");
		var authKey = '';

		sendBtn.onclick = function () {
			var selectedArr = Array.prototype.slice.call(document.querySelectorAll('li.selected'));
			if (Array.isArray(selectedArr) && selectedArr.length) {
				dbRef = firebase.database().ref("key");
				dbRef.once('value', snap => {
					authKey = 'key=' + snap.val();
					var title = document.querySelector(".mTitle").value;
					var body = document.querySelector(".mBody").value;
					var action = document.querySelector(".mClickAction").value;

					selectedArr.forEach(function (to) {
						if (to.innerHTML == 'Select all') {
							return;
						}
						var xhr = new XMLHttpRequest();
						xhr.open('POST', 'https://fcm.googleapis.com/fcm/send', true);
						xhr.setRequestHeader('Content-type', 'application/json');
						xhr.setRequestHeader('Authorization', authKey);
						xhr.onload = function () {
							// do something to response
							var result = JSON.parse(this.responseText).success;
							
							document.getElementById("sent").textContent = ++sentCount;

							var successVal = document.getElementById("success");
							var failureVal = document.getElementById("failure");
							if (result) {
								successCount++;
								successVal.textContent = successCount;
							} else {
								failureCount++;
								failureVal.textContent = failureCount;
							}
						};
						var mess = '{"to" :"'
							+ to.innerText + '","notification":{"title":"'
							+ title + '","body":"'
							+ body + '","click_action":"'
							+ action + '","analytics_label": "testLabel"}}'
						//console.log(mess);
						xhr.send(mess);
					});
				});
			} else {
				alert("Select at least one tocken");
			}
		};
	} else {
		document.getElementById("tokenList").innerHTML = '<h5>Unauthorized!</h5>';
	}
}
//------------------------------------------------
