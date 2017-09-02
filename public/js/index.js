const _global = {};

class Ajax {
	constructor () {

	}
	sendRequest (url, req, callback) {
		var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XHR();
		xhr.open((req.type == 'POST' ? 'POST' : 'GET'), url);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		// xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function (e) {
			if (xhr.status != 200) {
				console.log(xhr.status + ': ' + xhr.statusText);
				return (NULL);
			} else {
				let str = JSON.parse(xhr.responseText);
				callback(str);
			}
		};
		xhr.send((req.body ? req.body : 0));
	}
}

class Task {
	constructor () {
		console.log('some_info');
		this.submit 			= document.querySelectorAll('.submit-task')[0];
		this.preview 			= document.querySelectorAll('.show-preview')[0];
		this.previewBlock 		= document.querySelectorAll('.preview')[0];
		this.photo				= {};
		this.form				= {};
		this.form.name			= document.querySelectorAll('input[name=taskName]')[0];
		this.form.email			= document.querySelectorAll('input[name=taskEmail]')[0];
		this.form.text			= document.querySelectorAll('textarea[name=task-text]')[0];
		this.uploadImgBtn		= document.querySelectorAll('.photo-upload-wrap')[0];
		this.uploadInput		= document.querySelectorAll('input[name=upload-photo]')[0];

		this.submit.onclick = () => {
			this.checkForm() == true ?
				this.sendData({photo: this.photo, task: this.form})
				: 0;
		};

		this.preview.onclick = () => {
			this.checkForm() == true ?
				this.showPreview()
				: 0;
		};

		this.uploadImgBtn.onclick = () => {
			this.uploadInput.click()
		};

		this.uploadInput.onchange = () => {
			this.addNewImg();
		};

	}

	addNewImg () {
		this.msg			= document.getElementsByClassName('click-to-upload-avatar')[0];
		var file            = this.uploadInput.files[0]; //sames as here
		var reader          = new FileReader();

		if (!file.type.match(/.(jpg|jpeg|png|gif|bmp)$/i)) {
			this.msg.innerHTML 	= 'It`s not an image!!\nI`m watching you -_-';
			this.photo.name 	= '';
			this.photo.src 		= '';
			this.msg.setAttribute('style', 'color: red;font-size:0.7em;');
		}
		else if (file) {
			reader.onloadend = () => {
				this.msg.removeAttribute('style');
				document.querySelectorAll('.fa-cloud-upload')[0].removeAttribute('style');
				this.msg.innerHTML 	= 'Photo uploaded!';
				this.photo.name 	= this.uploadInput.files[0].name;
				this.photo.src 		= reader.result;
			}
			reader.readAsDataURL(file); //reads the data as a URL
		} else this.msg.innerHTML = 'Some error, try another file';
	}

	checkForm () {
		var flag = 1;
		for (var input in this.form) {
			if (this.form[input].value.length == 0 || !this.form[input].checkValidity()) {
				this.form[input].style.border = "1px solid red";
				flag = 0;
			} else {this.form[input].style.border = ""}
		}
		if (!this.photo.name || !this.photo.src) {
			flag = 0;
			document.querySelectorAll('.fa-cloud-upload')[0].setAttribute('style', 'color:red;');
		} else document.querySelectorAll('.fa-cloud-upload')[0].removeAttribute('style');
		return (flag == 1 ?  true : false);
	}

	sendData (data) {
		console.log(data);
		var ajax = new Ajax;
		var ajaxReq = {
			type: 'POST',
			body: 'name=' + encodeURIComponent(this.form.name.value) +
				'&email=' + encodeURIComponent(this.form.email.value) +
				'&text=' + encodeURIComponent(this.form.text.value) +
				'&photoName=' + encodeURIComponent(this.photo.name) +
				'&photoSrc=' + encodeURIComponent(this.photo.src)
		}
		ajax.sendRequest('newTask', ajaxReq, (data) => {
			var previewBlock 		= document.querySelectorAll('.preview')[0];

			_global.preview.task.src 	= '';
			_global.preview.task.name 	= '';
			_global.preview.task.email 	= '';
			_global.preview.task.text  	= '';

			console.log(data);
			if (data.task != 'not added') {
				data.task.img = 'public/images/' + data.task.img;
				_global.tasksList.tasks.push(data.task);
			}

			previewBlock.removeAttribute('style');
		});
	}

	showPreview () {
		var previewBlock 		= document.querySelectorAll('.preview')[0];

		_global.preview.task.src 	= this.photo.src;
		_global.preview.task.name 	= this.form.name.value;
		_global.preview.task.email 	= this.form.email.value;
		_global.preview.task.text  	= this.form.text.value;

		previewBlock.setAttribute('style', 'display:flex');
	}

}

class RenderList {
	constructor () {
		var ajax = new Ajax;
		var ajaxReq = {
			type: 'POST',
			body: {}
		}
		ajax.sendRequest('getList', ajaxReq, (data) => {
			_global.admin = data.admin;
			console.log(data);
			for (var i = 0; i < data.tasks.length; i++) {
				data.tasks[i].img = 'public/images/'+data.tasks[i].img;
				_global.tasksList.tasks.push(data.tasks[i]);
			}
		});
	}

	sortBy (property) {
		var sortOrder = 1;
		if(property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a,b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}
}

class LogIn {
	constructor () {
		this.logName= document.querySelectorAll('input[name=log_name]')[0];
		this.logPass= document.querySelectorAll('input[name=log_pass]')[0];
		this.logBtn	= document.querySelectorAll('input[name=log_btn]')[0];

		this.logBtn.onclick = () => {
			if (this.logName.checkValidity() == true && this.logPass.length != 0) {
				var ajax = new Ajax;
				var ajaxReq = {
					type: 'POST',
					body: 'login=' + encodeURIComponent(this.logName.value) +
					'&pass=' + encodeURIComponent(this.logPass.value)
				}
				ajax.sendRequest('logIn', ajaxReq, (data) => {
					data.logged == true ? _global.admin = true : 0;
				});
			}
		};
	}
}

window.onload = function () {
	var task = new Task;
	var list = new RenderList;
	var login= new LogIn;

	_global.preview = new Vue({
		el: '.preview-wraper',
		data: {
			task: {
				src		: '',
				name	: '',
				email	: '',
				text	: ''
			}
		}
	});
	_global.tasksList = new Vue ({
		el: '.task-list',
		data: {
			tasks: []
		},
		methods: {
			updateTask: function () {
				console.log(_global);
				var task = event.target;
				if (_global.admin == true) {
					console.log(1111);
					var ajax = new Ajax;
					var ajaxReq = {
						type: 'POST',
						body: 'task=' + encodeURIComponent(event.target.getAttribute('id'))
					}
					ajax.sendRequest('updateTask', ajaxReq, (data) => {
						console.log(task);
						task.setAttribute('style', 'color:lightgreen');
					});
				}
				console.log(event.target);
			}
		}
	});
	_global.sort = new Vue ({
		el:'.dropdown-menu',
		data: {

		},
		methods: {
			sortList: function (type) {
				console.log(_global.tasksList.tasks);
				_global.tasksList.tasks.sort(list.sortBy(type));
				console.log(_global.tasksList.tasks);
			}
		}
	});

	Vue.component('preview-task', {
		props: ['item'],
		template:   '<li class="task">'+
						'<div class="row">'+
							'<div class="col-xs-12 col-sm-7 push-sm-5 col-md-7 push-md-5">'+
								'<div class="task-header clearfix">'+
									'<div class="user-name">'+
										'{{item.name}}'+
									'</div>'+
									'<div class="email">'+
										'{{item.email}}'+
									'</div>'+
								'</div>'+
								'<div class="text">'+
									'{{item.task}}'+
								'</div>'+
							'</div>'+
							'<div class="col-xs-12 col-sm-5 pull-sm-7 col-md-5 pull-md-7">'+
								'<div class="task-header clearfix">'+
									'<div class="img-wrap">'+
										'<img v-bind:src="item.img" alt="">'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<i class="fa fa-check" v-if="item.checked == 1" style="color:lightgreen" aria-hidden="true" v-on:click.native="updateTask()" v-bind:id="item.id"></i>'+
							'<i class="fa fa-check" v-else aria-hidden="true" v-bind:id="item.id" v-on:click.native="updateTask()"></i>'+
							'</div>'+
					'</li>'
	});

};