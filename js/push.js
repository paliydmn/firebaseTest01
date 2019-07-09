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
					str += '<li class="li selectAll">Select all</li>';
				}
				snapResult.forEach(val => {
					str += '<li class="li">' + val + '</li>';
				});
				showList();
				//--------------------------------------------
				const list = document.getElementById("tokenList").getElementsByTagName("li");
				const iterable = Array.prototype.slice.call(list);
				var i = 0;
				iterable.forEach(function (item) {
					item.id = "l" + i++;
				});
				// SELECT DESELECT SELECT-ALL 
				document.querySelector('.tList').addEventListener('click', function (e) {
					if (e.target.tagName === 'LI') {
						let idStr = "#" + e.target.id;
						id = document.querySelector(idStr);
						if (id.className == 'li selectAll') {
							iterable.forEach(function (item) {
								item.className = 'li selected';
							});
							id.className = 'li selectAll selected';
						} else {
							if (id.className == 'li selectAll selected') {
								iterable.forEach(function (item) {
									if (item.className != 'selectAll')
										item.className = 'li';
								});
								id.className = 'li selectAll';
							} else {
								if (id.className == 'li selected') {
									id.className = 'li';
								} else {
									e.target.className = 'li selected';
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
