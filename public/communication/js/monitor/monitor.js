var UI_container = document.getElementsByClassName('UI-container')[0];
var userRow = document.getElementsByClassName('user-row')[0];
var oMenu = document.getElementById("menu");
var socket = io.connect(socketPort);                                          //该socket连接主要用来监控学生状态

var pageNum = {};                                                                  //总共的分页数
var courseList = [];
var studentEleList = document.getElementsByClassName('user');
var studentNumForPage = 12;
var courseNumForPage = 3;

//studentCourseInfo用来存放所有学生的当前所有正在学习课程的信息
//第一层以学生ID为索引，第二层以课程ID为索引
//这个对象里面存放的信息主要用于学生详细信息中的实时信息的显示
var studentCourseInfo = {};

//以instanceId作索引，存放该instanceId对应的任务的进度、以及课程名
var instanceInfo = {};

//synergy这个对象用来存放协同操作成员列表以及对应的任务ID
var synergy = {};

//用来存放老师名下有哪些课程
var courseInfo = {};

//用来存放老师名下课程正在学习的学生的名字
var studentInfo = {};

//id转换表
var idTable = {};

//处理学生求助请求
//设置这个函数是为了以后可能有多个老师负责同一课程的监控
//但是目前实现的同一个课程只有一个老师负责监控
function resolve(courseId, userId, teacherId) {
	socket.emit('resolveHelp', {
		userId : userId,
		courseId : courseId,
		teacherId: teacherId
	});
}

window.onload = function() {
	courseInstanceInfo = courseInstanceInfo.replace(/&quot;/g, '"');
	try {
		courseInstanceInfo = JSON.parse(courseInstanceInfo);
	} catch(e) {
		console.log(e);
	}
	courseInstanceInfo = courseInstanceInfo || [];
	console.log(courseInstanceInfo);
	var i, courseIdF, paging = '';
	//用courseId组成的数组进行查询时
	var arr = [];
	i = 1;
	console.log(courseUI);
	courseInstanceInfo.forEach(function(data) {
		if (data.courseId) {

			arr.push(data.courseId);
			courseInfo[data.courseName] = i;

			//进行id转换
			courseIdF = generateId();
			idTable[data.courseId] = courseIdF;
			idTable[courseIdF] = data.courseId;

			var display;
			if (i > courseNumForPage) {
				display = 'style="display:none"';
			} else {
				display = ''
			}
			var sessionList = document.getElementById('session-list');
			var courseEle = '<div class="course-row row" data-historyCount="0/0" data-unfinishedCount="0/0" data-completedCount="0/0" data-sequence="' + i + '"' + display +
				'data-course="' + i + '" data-onlineCount="0" data-filter="1"><div class="course col-lg-2 col-md-3 col-sm-4" id="info' + courseIdF + '"><h4>' + data.courseName +
				'</h4><div>' + UITextMap.historyLearningCounts + '：<div>0/0</div></div><div>' + UITextMap.unFinishedCourseCounts +
				'：<div>0/0</div></div><div>' + UITextMap.finishedCourseCounts + '：<div>0/0</div></div><div>' + UITextMap.onlineCounts + '：<div id="' + courseIdF +'OnlineCount">0</div></div></div>' +
				'<div class="img-container col-lg-10 col-md-9 col-sm-8"></div></div>';
			var session = ' <li id="' + courseIdF +  '" onclick="showChat(this)" type="group" class="list-group-item session-single-room">' +
				'<img src="images/group.png" onerror="imgLoadError(this)" class="session-user-img" title="'+ UITextMap.thisIsACourseDiscussionGroups +
				'"><p class="session-single-name" title="' + data.courseName + '">' + data.courseName + '</p><p class="session-single-content"></p></li>';
			courseUI.insertAdjacentHTML('beforeEnd', courseEle);
			sessionList.insertAdjacentHTML('beforeEnd', session);

			i++;
		}
	});
	if (i - 1 > courseNumForPage) {
		var pageCount = Math.ceil(i - 1 / courseNumForPage);
		pageNum.course = pageCount;
		paging = '<option value="1">1</option>';
		for (var j = 2; j <= pageCount; j++) {
			paging = paging + '<option value="' + j + '">' + j + '</option>';
		}
		paging = '<li><select id="currentPageByCourse">' + paging + '</select></li>';
		paging = '<ul class="pagination" id="paginationByCourse"><li><a onclick="skipPage(1)" aria-label="firstPage" title="跳转到第一页"><span aria-hidden="true">&laquo;</span></a></li>' +
			'<li><a onclick="prevPage()" aria-label="Previous" title="跳转到上一页"><span aria-hidden="true">&lt;</span></a></li>' +
			paging + '<li><a onclick="nextPage()" aria-label="Next" title="跳转到下一页"><span aria-hidden="true">&gt;</span></a></li>' +
			'<li><a onclick="skipPage(' + pageCount + ')" aria-label="lastPage" title="跳转到最后一页"><span aria-hidden="true">&raquo;</span></a></li>';

		courseUI.insertAdjacentHTML('beforeEnd', paging);
		var pagination = document.getElementById('paginationByCourse');
		pagination.style.left = (document.body.clientWidth - 400) / 2 + "px";

		//给分页绑定事件
		document.getElementById('currentPageByCourse').addEventListener('change', function () {
			skipPage(this.value);
		});
	}
	console.log(UI_container);

	getCourseLearningInfoByArr(arr, renderCourseInfo);

	$('#toggleChatRoom').on('click', function() {
		adjustUI();
	});

    oMenu.style.display = "block";

	document.onclick = function(event)
	{
		oMenu.style.display = "none";
		document.getElementById('search-menu').style.display = 'none';
		var emojiBox = document.getElementById('emojiBox');
		var chatContents = document.getElementById('chat-contents');
		emojiBox.style.display = 'none';
		chatContents.style.bottom = '128px';
	};
	console.log(ecgeditor);
	pageNum.student = 0;

	setTimeout(function() {
		var loading = document.getElementsByClassName('loading')[0];
		loading.parentNode.removeChild(loading);
	}, 100);

	var courseElelist = document.getElementsByClassName('course-row row');
	for (i = 0; i < courseElelist.length; i++) {
		courseList.push(courseElelist[i]);
	}
};

window.onresize = function() {
	var chatRoom_width;
	var paginationByCourse = document.getElementById('paginationByCourse');
	var paginationByStudent = document.getElementById('paginationByStudent');
	if ($('#chatRoom').is(':hidden')) {
		chatRoom_width = 0;
		console.log(chatRoom.style.width + ' hide');
	} else {
		chatRoom_width = parseInt(chatRoom.style.width) || 300;
		console.log(chatRoom.style.width + ' show');
	}
	UI_container.style.width = (document.body.clientWidth - chatRoom_width) + 'px';
	if (paginationByCourse !== null) {
		paginationByCourse.style.left = (parseInt(UI_container.style.width) - 400) / 2 + "px";
	}
	if (paginationByStudent !== null) {
		paginationByStudent.style.left = (parseInt(UI_container.style.width) - 400) / 2 + "px";
	}
};

//教师打开监控页面，初始化所有正在学习该老师名下课程的学生的信息
function initStudentInfo (data, element) {
	var currentCourseList = {} ;       //存放学生当前学习在该老师名下的课程列表
	var offLineMsgNum;                 //学生发给该老师的离线消息数量
	var studentInfo;                   //学生信息块
	var studentLearningCourse;         //学生当前学习的在该教师名下的课程

	var courseInfo;                    //获取课程监控页面处的课程卡片
	var courseStudentInfo;             //获取用来存放学生头像的DIV元素
	var courseOnlineStudent;           //课程监控页面上的学生头像
	var onlineCount;                   //在线学生的人数
	var courseId;                      //课程ID
	var synergyMemberInfo;             //当前任务中正在协同操作的人员信息
	var instanceId;                    //课程实例ID

	var userIdF;
	var courseIdF;

	var pretreatment = document.getElementsByClassName('pretreatment')[0];

	//当学生监控页面处需要显示更多详细信息时，使用queryInfo
	//queryInfo 里面将设置userId,courseId,progress,courseName 4个属性
	//var queryInfo = {};

	//因为data中的userId只有一个，所以先把userId属性设置好
	//queryInfo.userId = data.userId;

	for (instanceId in data.courseList) {
		if (instanceId !== 'offLineMsgNum') {
			currentCourseList[instanceId] = data.courseList[instanceId];
		} else {
			offLineMsgNum = data.courseList.offLineMsgNum;
		}
	}

	if (idTable[data.userId] === undefined){
		userIdF= generateId();
		idTable[data.userId] = userIdF;
		idTable[userIdF] = data.userId;
	} else {
		userIdF = idTable[data.userId];
	}

	console.log(data);
	//初始化监控用户页面
	if (offLineMsgNum) {
		studentInfo = '<div class="user" id="user'+ userIdF + '"><div class="user-info"><img src="images/' + data.userAvatar +
			'" class="img-circle user-img" onerror="imgLoadError(this)"><span text-align="center" id="name' + userIdF +
			'">' + data.userName + '</span><span class="badge" onclick="openChatByBadge(this)" style="float:right">' + offLineMsgNum +
			'</span></div><div class="user-course"><span>当前学习课程:</span><ul class="now-course"></ul></div></div></div>';
	} else {
		studentInfo = '<div class="user" id="user'+ userIdF + '"><div class="user-info"><img src="images/' + data.userAvatar +
			'" class="img-circle user-img" onerror="imgLoadError(this)"><span text-align="center" id="name' + userIdF + '">' + data.userName +
			'</span></div><div class="user-course"><span>当前学习课程:</span><ul class="now-course"></ul></div></div></div>';
	}
	try {
		element.insertAdjacentHTML('afterBegin',studentInfo);
	} catch (e) {
		console.log(e);
	}


	//给学习监控页面处头像也添加右键菜单功能
	studentInfo = document.getElementById('user' + userIdF);

	studentInfo.style.display = 'none';

	var studentInfoImg = studentInfo.children[0].children[0];
	studentInfoImg.oncontextmenu = function(event) {
		event = event || window.event; //处理event事件对象兼容性
		oMenu.style.display = "block";
		oMenu.style.left = event.clientX + "px";
		oMenu.style.top = event.clientY + "px";

		//将用户的ID放到查看信息标签的data-studentId属性里面
		/*	var studentAvatarId = userCourseImg.parentNode.getAttribute('id');
		 var studentId = studentAvatarId.slice(6,studentAvatarId.length);*/
		oMenu.children[0].children[0].setAttribute('data-studentId', userIdF);
		oMenu.children[1].children[0].setAttribute('onclick', 'openChat("' + userIdF + '","' + data.userName +'")');

		//处理这个事件，不让其他元素看到它
		cancelEventBubble(event);
		//阻止默认事件
		preventDefault(event);
	};

	//接下来将课程列表插入用户信息块中

	var currentCourseListElement = studentInfo.getElementsByClassName('now-course')[0];
	for (var instanceId in data.synergy) {
		//console.log(synergy);
		courseId = instanceId.split('@')[0];
		//当用户有在学习自己的课程时候才进行以下操作
		if (synergy[instanceId] === undefined) {
			synergy[instanceId] = {};
		}
		synergyMemberInfo = '';
		if (currentCourseList[instanceId]) {
			studentLearningCourse = '<li id="' + instanceId.split('@')[1]  + '">' + currentCourseList[instanceId].courseName + '</li>';
			currentCourseListElement.insertAdjacentHTML('afterBegin',studentLearningCourse);
			pretreatment.innerHTML = '';
			pretreatment.insertAdjacentHTML('beforeEnd', currentCourseList[instanceId].progress);

			//console.log('协同操作人员列表');
			//console.log(data.synergy[instanceId]);
			for (var synergyMember in data.synergy[instanceId]) {
				if (synergyMember !== 'userId') {
					synergy[instanceId][synergyMember] = data.synergy[instanceId][synergyMember];
					synergyMemberInfo += '<li>' + data.synergy[instanceId][synergyMember] + '</li>';
				}
			}
			//只显示学生学习的动态信息
			if (synergyMemberInfo === '') {
				$('#' + instanceId.split('@')[1]).popover({
					trigger: 'hover',
					html: true,
					content: '<div class="course-info"><div class="course-info-courseName">当前学习课程：<div class="font-retract">' + currentCourseList[instanceId].courseName +
					'</div></div><div class="course-info-progress">当前学习进度：<div class="font-retract">' + pretreatment.innerText + '</div></div></div>',
					placement: 'right'
				});
			} else {
				$('#' + instanceId.split('@')[1]).popover({
					trigger: 'hover',
					html: true,
					content: '<div class="course-info"><div class="course-info-courseName">当前学习课程：<div class="font-retract">' + currentCourseList[instanceId].courseName +
					'</div></div><div class="course-info-progress">当前学习进度：<div class="font-retract">' + pretreatment.innerText +
					'</div></div><div class="course-info-synergyMember">当前协同操作成员：<ul class="font-retract">' + synergyMemberInfo + '</ul></div></div>',
					placement: 'right'
				}).css('color', 'red');
			}

			courseIdF = idTable[courseId];

			console.log('info' + courseIdF);
			//初始化监控课程页面
			courseInfo = document.getElementById('info' + courseIdF);
			console.log(courseInfo);
			courseStudentInfo = getNextElement(courseInfo);
			onlineCount = document.getElementById(courseIdF + 'OnlineCount');
			courseOnlineStudent = '<div class="users-img" id="' + courseIdF + userIdF +'"><img src="images/' +
				data.userAvatar + '" width="100%" height="100%" name="courseUserImg" class="img-circle" onerror="imgLoadError(this)"></div>';
			courseStudentInfo.insertAdjacentHTML('afterBegin',courseOnlineStudent);
			//更新在线人数
			onlineCount.innerHTML = parseInt((onlineCount.innerHTML || 0)) + 1;
			courseInfo.parentNode.setAttribute('data-onlineCount', onlineCount.innerHTML);

			$('#' + courseIdF + userIdF +" img").popover({
				trigger: 'hover',
				placement: 'right',
				content: '<div class="course-info">当前学习进度：<div class="font-retract">' + pretreatment.innerText + '</div></div>',
				title: '用户名：' + data.userName,
				html: true
			});

			//现在给课程监控页面处的用户头像添加右键菜单
			var userCourseImg = document.getElementById(courseIdF + userIdF).children[0];
			userCourseImg.oncontextmenu = (function(courseId) {
				return function(event) {
					event = event || window.event; //处理event事件对象兼容性
					oMenu.style.display = "block";
					oMenu.style.left = event.clientX + "px";
					oMenu.style.top = event.clientY + "px";

					//将用户的ID放到查看信息标签的data-studentId属性里面
					//将课程的ID放到查看属性标签的data-courseId属性里面
					/*	var studentAvatarId = userCourseImg.parentNode.getAttribute('id');
					 var studentId = studentAvatarId.slice(6,studentAvatarId.length);*/
					oMenu.children[0].children[0].setAttribute('data-studentId', userIdF);

					////将课程的ID放到协同操作标签的data-courseId属性里面
					//oMenu.children[1].children[0].setAttribute('href', '../?courseId=' + courseId);
					//oMenu.children[1].children[0].setAttribute('target', '_blank');

					oMenu.children[1].children[0].setAttribute('onclick', 'openChat("' + userIdF + '","' + data.userName +'")');

					//处理这个事件，不让其他元素看到它
					cancelEventBubble(event);

					//阻止默认事件
					preventDefault(event);
				};
			})(courseId);
		}
	}
}

//有新的学生进入课程后，监控页面添加该学生的信息
function addStudentInfo (data, element) {
	var userIdF = idTable[data.userId];
	var courseIdF = idTable[data.courseId];

	//按学生显示的UI添加
	var studentInfo = document.getElementById('user' + userIdF);
	//用户监控页面处用户正在学习的课程的列表
	var currentCourseList;
	//用户监控页面处用户正在学习的课程名
	var studentLearningCourse = document.getElementById(data.instanceId.split('@')[1]);
	//获取在线学生的人数
	var onlineCount = document.getElementById(courseIdF + 'OnlineCount');

	//预处理元素
	var pretreatment = document.getElementsByClassName('pretreatment')[0];
	if (studentInfo === null){
		if (data.offLineMsgNum) {
			studentInfo = '<div class="user" id="user'+ userIdF + '"><div class="user-info"><img src="images/' + data.userAvatar +
				'" class="img-circle user-img" onerror="imgLoadError(this)"><span text-align="center" id="name' + userIdF + '">' + data.userName +
				'</span><span class="badge" onclick="openChatByBadge(this)" style="float:right">' + data.offLineMsgNum +
				'</span></div><div class="user-course"><span>当前学习课程:</span><ul class="now-course"><li id="'+ data.instanceId.split('@')[1] +
				'">' + data.courseName + '</li></ul></div></div></div>';
		} else {
			studentInfo = '<div class="user" id="user'+ userIdF + '"><div class="user-info"><img src="images/' + data.userAvatar +
				'" class="img-circle user-img" onerror="imgLoadError(this)"><span text-align="center" id="name' + userIdF + '">' + data.userName +
				'</span></div><div class="user-course"><span>当前学习课程:</span><ul class="now-course"><li id="'+ data.instanceId.split('@')[1] +
				'">' + data.courseName + '</li></ul></div></div></div>';
		}
		element.insertAdjacentHTML('afterBegin',studentInfo);

		pretreatment.innerHMTL = '';
		pretreatment.insertAdjacentHTML('beforeEnd', data.progress);

		//给学习监控页面处头像也添加右键菜单功能
		studentInfo = document.getElementById('user' + userIdF);
		var studentInfoImg = studentInfo.children[0].children[0];
		studentInfoImg.oncontextmenu = function(event) {
			event = event || window.event; //处理event事件对象兼容性
			oMenu.style.display = "block";
			oMenu.style.left = event.clientX + "px";
			oMenu.style.top = event.clientY + "px";

			//将用户的ID放到查看信息标签的data-studentId属性里面
			/*	var studentAvatarId = userCourseImg.parentNode.getAttribute('id');
			 var studentId = studentAvatarId.slice(6,studentAvatarId.length);*/
			oMenu.children[0].children[0].setAttribute('data-studentId', userIdF);

			//处理这个事件，不让其他元素看到它
			cancelEventBubble(event);

			//阻止默认事件
			preventDefault(event);
		};

		//只显示学生学习的动态信息
		$('#' + data.instanceId.split('@')[1]).popover({
			trigger: 'hover',
			html: true,
			content: '<div class="course-info"><div class="course-info-courseName">当前学习课程：<div class="font-retract">' + data.courseName +
			'</div></div><div class="course-info-progress">当前学习进度：<div class="font-retract">' + pretreatment.innerText + '</div></div></div>',
			placement: 'right'
		});

		////如果需要显示更详细的信息，则使用ajax从服务器去获取关于该学生的非动态的信息
		//addInformationToStudentPopover(data);

		console.log('studentInfo is null');
	} else {
		if (studentLearningCourse === null) {
			currentCourseList = studentInfo.getElementsByClassName('now-course')[0];
			studentLearningCourse = '<li id="' + data.instanceId.split('@')[1] + '">' + data.courseName + '</li>';
			currentCourseList.insertAdjacentHTML('afterBegin',studentLearningCourse);

			//只显示学生学习的动态信息
			$('#' + data.instanceId.split('@')[1]).popover({
				trigger: 'hover',
				html: true,
				content: '<div class="course-info"><div class="course-info-courseName">当前学习课程：<div class="font-retract">' + data.courseName +
				'</div></div><div class="course-info-progress">当前学习进度：<div class="font-retract">' + pretreatment.innerText + '</div></div></div>',
				placement: 'right'
			});

			////如果需要显示更详细的信息，则使用ajax从服务器去获取关于该学生的非动态的信息
			//addInformationToStudentPopover(data);

			console.log(data.courseName);
			console.log(currentCourseList);
		}
		console.log(data.courseName);
		insertAt(studentInfo.parentNode, studentInfo, 0);
	}

	//按课程显示的UI添加
	var courseInfo = document.getElementById('info' + courseIdF);
	var courseOnlineStudent = document.getElementById(courseIdF + userIdF);  //获取该上线学生处于课程监控页面的头像
	var courseStudentInfo = getNextElement(courseInfo);     //获取用来存放学生头像的DIV元素
	if (courseInfo !== null) {
		if (courseOnlineStudent === null) {
			courseOnlineStudent = '<div class="users-img" id="' + courseIdF + userIdF +'"><img src="images/' +
				data.userAvatar + '" width="100%" height="100%" name="courseUserImg" class="img-circle" onerror="imgLoadError(this)"></div>';
			courseStudentInfo.insertAdjacentHTML('afterBegin',courseOnlineStudent);

			//在用户头像处添加 popover 事件
			$('#' + courseIdF + userIdF +" img").popover({
				trigger: 'hover',
				placement: 'right',
				content: '当前学习进度：<div class="font-retract">' + pretreatment.innerText + '</div>',
				title: '用户名：' + data.userName,
				html: true
			});

			onlineCount.innerHTML = parseInt((onlineCount.innerHTML || 0)) + 1;
			courseInfo.parentNode.setAttribute('data-onlineCount', onlineCount.innerHTML);
		} else {
			insertAt(courseStudentInfo, courseOnlineStudent, 0);
		}
	}
	var userCourseImg = document.getElementById(courseIdF + userIdF).children[0];
	userCourseImg.oncontextmenu = function(event) {
		event = event || window.event; //处理event事件对象兼容性
		oMenu.style.display = "block";
		oMenu.style.left = event.clientX + "px";
		oMenu.style.top = event.clientY + "px";

		//将用户的ID放到查看信息标签的data-studentId属性里面
		/*	var studentAvatarId = userCourseImg.parentNode.getAttribute('id');
		 var studentId = studentAvatarId.slice(6,studentAvatarId.length);*/
		oMenu.children[0].children[0].setAttribute('data-studentId', userIdF);

		//处理这个事件，不让其他元素看到它
		cancelEventBubble(event);

		//阻止默认事件
		preventDefault(event);
	};
}

//将学生的信息添加到模态框中
function addStudentInfoToModal(element) {
	//先获取当前学生的ID
	var studentId = element.getAttribute('data-studentId');
	var instanceId;
	var studentInfo = document.getElementById('user' + studentId);
	var studentName = document.getElementById('studentName');
	var studentCurrentCourse = document.getElementById('studentCurrentCourse');
	var singleCourseInfo;          //课程列表中单个课程的信息
	var pretreatment = document.getElementsByClassName('pretreatment')[0];
	//将实时信息添加到模态框中
	studentName.innerHTML = studentInfo.children[0].children[1].innerHTML;
	studentCurrentCourse.innerHTML = '';

	//转换回原始用户ID
	studentId = idTable[studentId];
	//从studentCourseInfo 中去获取当前学生的关于课程学习的所有实时信息
	try {
		//先在studentCurrentCourse里面添加ul列表元素
		studentCurrentCourse.insertAdjacentHTML('beforeEnd', '<ul></ul>');
		//现在给课程列表添加信息，包括所有的课程名，学习进度以及学习时长
		for (instanceId in studentCourseInfo[studentId]) {
			if (instanceId !== 'offLineMsgNum') {
				pretreatment.innerHTML = '';
				pretreatment.insertAdjacentHTML('beforeEnd', studentCourseInfo[studentId][instanceId].progress);

				singleCourseInfo = '<li>' + studentCourseInfo[studentId][instanceId].courseName +
					'<ul><li>学习进度：' + pretreatment.innerText +
					'</li><li>学习时长：' + studentCourseInfo[studentId][instanceId].onlineTime +
					' min </li></ul></li>';
				studentCurrentCourse.children[0].insertAdjacentHTML('beforeEnd', singleCourseInfo);
			}
		}
	} catch(e) {
		console.log(e);
	}


	//发送ajax请求到后台获取该学生的一些非实时的数据
	//studentInformationAjax('http://192.168.1.97:2433/studentInformationAjax',studentId);
	studentInformationAjax('/communication/monitor/studentInformationAjax',studentId);
}

//发送ajax请求获取学生的非实时信息
//该函数用于给学生监控页面处的卡片的悬浮窗口添加信息
//data 至少拥有4个属性 userId,courseId,courseName,progress
//弃用了
//function addInformationToStudentPopover(queryInfo) {
//	if (queryInfo !== undefined) {
//		var userId = queryInfo.userId,
//			courseId = queryInfo.courseId,
//			courseName = queryInfo.courseName,
//			progress = queryInfo.progress,
//		    keyword = {keyword: userId};
//
//		$.ajax({
//			type: 'get',
//			url: '/studentInformationAjax',
//			data: keyword,
//			success: function(ajaxdata) {
//				$('#' + userId + courseId).popover({
//					trigger: 'hover',
//					html: true,
//					content: '<div class="course-info"><div class="course-info-courseName">当前学习课程：<br/>' + courseName +
//					'</div><div class="course-info-progress">当前学习进度：<br/>' + progress +
//					'</div><div class="course-info-learningTime">当前课程学习时长：' + ajaxdata.studentLearningTime + 'min' +
//					'</div><div class="course-info-finishedCourseName">已经完成的课程：' + ajaxdata.studentFinishedCourse +
//					'</div><div class="course-info-unFinishedCourseName">未完成的课程：' + ajaxdata.studentUnfinishedCourse + '</div></div>',
//					placement: 'right'
//				});
//			}
//		});
//	}
//}

//发送ajax请求获取学生的非实时信息
//value为学生的ID
function studentInformationAjax(url, value) {
	var keyword = {keyword: value};
	var studentUnfinishedCourse = document.getElementById('studentUnfinishedCourse');
	var studentFinishedCourse = document.getElementById('studentFinishedCourse');
	var litterSpinners = $('.litter-spinner');
	//将上一次显示的内容清空
	studentFinishedCourse.innerHTML = '';
	studentUnfinishedCourse.innerHTML = '';

	litterSpinners.show();

	if (value !== undefined) {
		$.ajax({
			type: "get",
			url: url,
			data: keyword,
			success: loadInfo,
			error:function (data) {
				litterSpinners.hide();
				studentFinishedCourse.innerHTML = '<div style="text-align: center">获取已完成课程信息失败！</div>';
				studentUnfinishedCourse.innerHTML = '<div style="text-align: center">获取未完成课程信息失败！</div>';
			}
		});
	}

	function loadInfo(data) {
		var finished, unFinished, finishedCourse, unFinishedCourse, courseId;
		finished = {};
		unFinished = {};
		finishedCourse = [];
		unFinishedCourse = [];
		data.forEach(function (courseInstance) {
			if (courseInstance.statement === 'on') {
				unFinished[courseInstance.courseId] = courseInstance.courseName;
			} else if (courseInstance.statement === 'off') {
				finished[courseInstance.courseId] = courseInstance.courseName;
			}
			//if (courseInstance.status === 'active') {
			//	unFinished[courseInstance.courseId] = courseInstance.courseName;
			//} else if (courseInstance.status === 'finished') {
			//	finished[courseInstance.courseId] = courseInstance.courseName;
			//}
		});
		for (courseId in finished) {
			finishedCourse.push(finished[courseId]);
		}
		for (courseId in unFinished) {
			unFinishedCourse.push(unFinished[courseId]);
		}

		litterSpinners.hide();

		studentFinishedCourse.insertAdjacentHTML('beforeEnd', '<ul class="now-course"></ul>');
		finishedCourse.forEach(function (courseName) {
			studentFinishedCourse.children[0].insertAdjacentHTML('beforeEnd', '<li>' + courseName + '</li>')
		});
		studentUnfinishedCourse.insertAdjacentHTML('beforeEnd', '<ul class="now-course"></ul>');
		unFinishedCourse.forEach(function (courseName) {
			studentUnfinishedCourse.children[0].insertAdjacentHTML('beforeEnd', '<li>' + courseName + '</li>')
		});
		console.log(finishedCourse);
		console.log(unFinishedCourse);
		console.log(data);
	}
}

//当聊天室显示或隐藏的时候调整UI
function adjustUI() {
	var UI_container_width = parseInt(UI_container.style.width) || document.body.clientWidth;
	var chatRoom_width = parseInt(chatRoom.style.width) || 300;
	var paginationByCourse = document.getElementById('paginationByCourse');
	var paginationByStudent = document.getElementById('paginationByStudent');
	if ($('#chatRoom').is(':hidden')) {
		$('#chatRoom').show(500);
		/*$('#chatRoom').animate({
		 width: 'show'
		 },500);*/  //animate 动画移动
		UI_container.style.width = (UI_container_width - chatRoom_width) + 'px';
		if (paginationByCourse !== null) {
			paginationByCourse.style.left = (parseInt(UI_container.style.width) - 400) / 2 + "px";
		}
		if (paginationByStudent !== null) {
			paginationByStudent.style.left = (parseInt(UI_container.style.width) - 400) / 2 + "px";
		}
	} else {
		$('#chatRoom').hide(500,function () {
			UI_container.style.width = (UI_container_width + chatRoom_width) + 'px';
			if (paginationByCourse !== null) {
				paginationByCourse.style.left = (parseInt(UI_container.style.width) - 400) / 2 + "px";
			}
			if (paginationByStudent !== null) {
				paginationByStudent.style.left = (parseInt(UI_container.style.width) - 400) / 2 + "px";
			}
		});
		/*	$('#chatRoom').animate({
		 width:'hide'
		 });*/
		//console.log('hide');
	}
}

//转换成以学生为主监控界面
function conversionStudent() {
	var userUI = $('#userUI');
	var courseUI = $('#courseUI');
	if (userUI.is(':hidden') && courseUI.is(':visible')) {
		courseUI.hide();
		userUI.show();
		$('#conversionStudent').addClass('conversion');
		$('#conversionCourse').removeClass('conversion');
	}
}
//转换成以课程为主监控页面
function conversionCourse() {
	var userUI = $('#userUI');
	var courseUI = $('#courseUI');
	if (courseUI.is(':hidden') && userUI.is(':visible')){
		userUI.hide();
		courseUI.show();
		$('#conversionCourse').addClass('conversion');
		$('#conversionStudent').removeClass('conversion');
	}
}

//获取当前用户发布过的课程
function getAllPublishedInstance(ip, userId, callback) {
	console.log(ip);

	$.ajax({
		type : "GET",
		//url: "http://192.168.1.44:4000/getInstanceByUser?userId=PKCH5L9U&isPublished=true",
		url: 'http://' + ip + '/getAllPublishedInstance?userId=' + userId,
		async: false,
		success: function (data) {
			callback(data);
		},
		error: function (data) {
			console.log(data);
			console.log('获取教师所属的课程信息出错！' + data.statusText);
		}
	});
}

function getCourseLearningInfoByArr(keys, callback) {
	keys =  JSON.stringify(keys);
	$.ajax({
		type : 'POST',
		url : '/communication/monitor/getCourseInfo',
		//beforeSend: function (xhr) {
		//	xhr.setRequestHeader('Content-Type', 'application/json');
		//	xhr.setRequestHeader('Authorization', "Basic YWRtaW46MTIz");
		//},
		data: {
			keys: keys
		},
		success: function (data) {
			console.log(data);
			callback(data);
		},
		error: function (data) {
			console.log(data);
			console.log('获取课程学习信息出错！' + data.statusText);
		}
	});
}

//获取历史课程学习信息
function getCourseLearningInfo(courseId, callback) {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.97:3000/communication/monitor/getCourseInfo',
		async: false,
		//beforeSend: function (xhr) {
		//	xhr.setRequestHeader('Content-Type', 'application/json');
		//	xhr.setRequestHeader('Authorization', "Basic YWRtaW46MTIz");
		//},
		data: 'courseId=' + courseId,
		success: function (data) {
			callback(data);
		},
		error: function (data) {
			console.log(data);
			console.log('获取课程学习信息出错！' + data.statusText);
		}
	});
}

function coursePlayer(courseId, callback) {
	$.ajax({
		type : 'GET',
		url: 'http://192.168.1.77:8080/index.php/apps/courseplayer/getAllCourseData',
		async: false,
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader('Authorization', "Basic YWRtaW46MTIz");
			//xhr.setRequestHeader("Accept", 'application/json');
			console.log(xhr);
		},
		data: 'courseId=' + courseId,
		success: function (data) {
			callback(data);
		},
		error: function (data) {
			console.log(data);
			console.log('获取课程学习信息出错！' + data.statusText);
		}
	});
}

function stretch(element, event) {
	event = event || window.event; //处理event事件对象兼容性
	var startX = event.clientX ;
	var elementX = element.style.width || 300;
	var element2 = document.getElementsByClassName('UI-container')[0];
	var element1 = document.getElementById('paginationByCourse');
	console.log(element2.style.width);
	//elementX = elementX.slice(0,-2);
	elementX = parseInt(elementX);

	//注册用于响应接着mousedown事件发生的mousemove和mouseup事件的事件处理程序
	if (document.addEventListener) { // 标准事件模型
		//在document对象上注册捕获事件处理程序
		document.addEventListener("mousemove", moveHandler, true);
		document.addEventListener("mouseup", upHandler, true);
	} else if (document.attachEvent) {
		//在IE事件模型中，
		//捕获事件是通过调用元素上的setCapture()捕获它们
		element.setCapture();
		element.attachEvent("onmousemove", moveHandler);
		element.attachEvent("onmouseup", upHandler);
		//作为mouseup事件看待鼠标捕获的丢失
		element.attachEvent("onlosecapture", upHandler);
	}

	//处理这个事件，不让其他元素看到它
	cancelEventBubble(event);

	//阻止默认事件
	preventDefault(event);

	function moveHandler(e) {
		if (!e) {
			e = window.event; //IE事件模型
		}
		//调节页面布局
		element.style.width = (elementX + startX - e.clientX) < 300 ? 300 + 'px' : (elementX + startX - e.clientX) + "px";
		//console.log((elementX + startX - e.clientX) < 300 ? 300 + 'px' : (elementX + startX - e.clientX) + "px");
		element.style.width = parseInt(element.style.width) > (document.body.clientWidth - 929) ? (document.body.clientWidth - 929) + 'px' : element.style.width;
		//console.log(parseInt(element.style.width) > (document.body.clientWidth - 929) ? (document.body.clientWidth - 624) + 'px' : element.style.width);
		element2.style.width = (document.body.clientWidth - parseInt(element.style.width)) + "px";

		//console.log(element1);
		element1.style.left = (parseInt(element2.style.width) - 400) / 2 + "px";
		cancelEventBubble(e);
	}

	function upHandler(e) {
		if (!e) {
			e = window.event; //IE事件模型
		}

		//注销事件处理程序
		if (document.removeEventListener) { //DOM事件模型
			document.removeEventListener("mouseup", upHandler, true);
			document.removeEventListener("mousemove", moveHandler, true);
		} else if (document.detachEvent) { //IE5+事件模型
			element.detachEvent("onlosecapture", upHandler);
			element.detachEvent("onmouseup", upHandler);
			element.detachEvent("onmousemove", moveHandler);
			element.releaseCaptrue();
		}

		cancelEventBubble(e);
	}
}


//function skipPage(ele) {
//	var activePage = $(ele);
//	var page = activePage.text();
//	var courseList= [];
//	var arr = [];
//	var courseElelist = document.getElementsByClassName('course-row row');
//	for (var i = 0; i < courseElelist.length; i++) {
//		courseList.push(courseElelist[i]);
//	}
//	//arr = courseList.filter(function (e) {
//	//	return e.style.display !== 'none';
//	//});
//	courseList.forEach(function (e) {
//		e.style.display = 'none';
//	});
//	$('[data-sequence=' + (3 * page) +']').show();
//	$('[data-sequence=' + (3 * page - 1) +']').show();
//	$('[data-sequence=' + (3 * page - 2) +']').show();
//	$('#pagination li a.active').removeClass('active');
//	activePage.addClass('active');
//}

//function prevPage() {
//	var activePage = $('#pagination li a.active');
//	if (activePage.text() === '1') {
//		return;
//	}
//	skipPage(activePage.parent().prev().children());
//}
//
//function nextPage() {
//	var activePage = $('#pagination li a.active');
//	if (activePage.text() === pageNum.course) {
//		return;
//	}
//	skipPage(activePage.parent().next().children());
//}

/*
 排序操作
 */

function sortCourseInfoByCount (name, rule) {
	//排序参照为name参数对应的人数
	//flag 决定升序还是降序 没有flag参数的时候是降序，有flag参数则是升序
	//var courseElelist = document.getElementsByClassName('course-row row');
	//var length = courseElelist.length;
	//var courseList = [];
	//var i;
	//for (i = 0; i < length; i++) {
	//	courseList.push(courseElelist[i]);
	//}
	var page = parseInt($('#currentPageByCourse').val()) || 1;
	var flag = parseInt(document.getElementById('sortMethod').getAttribute('data-order'));
	var j = 1;
	var i = 0;
	if (flag === 1) {
		courseList.sort(function(a,b) {
			var aCount = a.getAttribute('data-' + name).split('/')[rule] || 0;
			var bCount = b.getAttribute('data-' + name).split('/')[rule] || 0;
			return aCount - bCount < 0 ? 1 : -1;
		});
	} else {
		courseList.sort(function(a,b) {
			var aCount = a.getAttribute('data-' + name).split('/')[rule] || 0;
			var bCount = b.getAttribute('data-' + name).split('/')[rule] || 0;
			return aCount - bCount > 0 ? 1 : -1;
		});
	}

	courseList.forEach(function(e) {
		e.parentNode.appendChild(e);
		e.setAttribute('data-sequence', j++);
		e.style.display = 'none';
	});

	for (i; i < courseNumForPage; i++) {
		$('[data-sequence=' + (courseNumForPage * page - i) +']').show();
	}

	try {
		var pagination = document.getElementById('paginationByCourse');
		pagination.parentNode.appendChild(pagination);
	} catch(e) {
		console.log(e);
	}
}

function conversionSortMethod(element) {
	var flag = parseInt(element.getAttribute('data-order'));
	if (flag === 1) {
		element.setAttribute('data-order', 0);
		element.innerText = UITextMap.ascendingSort;
	} else {
		element.setAttribute('data-order', 1);
		element.innerText = UITextMap.descendingSort;
	}
}

/*
 分页操作
 */


function skipPage(page) {
	var courseUI = document.getElementById('courseUI');
	var i;
	if (courseUI.style.display !== 'none') {
		if (page > pageNum.course) {
			return;
		}
		//var courseList= [];
		//var courseElelist = document.getElementsByClassName('course-row row');
		//for (var i = 0; i < courseElelist.length; i++) {
		//	courseList.push(courseElelist[i]);
		//}
		console.log(courseList);
		courseList.forEach(function (e) {
			e.style.display = 'none';
		});
		console.log('skip page ' + page);
		$('#currentPageByCourse').val(page);
		for (i = 0; i < courseNumForPage; i++) {
			$('[data-sequence=' + (courseNumForPage * page - i) +']').show();
		}
	} else {
		if (page > Math.ceil(pageNum.student / 2)) {
			return;
		}
		$('.user').attr('style', 'display:none');

		for (i = 0; i < studentNumForPage; i++) {
			$('[data-num=' + (studentNumForPage * page - i) +']').show();
		}

		console.log('skip page by student ' + page);
		$('#currentPageByStudent').val(page);
	}
}

function prevPage() {
	var courseUI = document.getElementById('courseUI');
	var currentPage;
	console.log('prev page');
	if (courseUI.style.display !== 'none') {
		currentPage = $('#currentPageByCourse').val();
		if (currentPage === '1') {
			return;
		}

	} else {
		currentPage = $('#currentPageByStudent').val();
		console.log(currentPage);
		if (currentPage === '1') {
			return;
		}
	}
	skipPage(currentPage - 1);
}

function nextPage() {
	var courseUI = document.getElementById('courseUI');
	var currentPage;
	console.log('next page');
	if (courseUI.style.display !== 'none') {
		currentPage = parseInt($('#currentPageByCourse').val());
		if (currentPage === pageNum.course) {
			return;
		}
	} else {
		currentPage = parseInt($('#currentPageByStudent').val());
		console.log(currentPage);
		if (currentPage === Math.ceil(pageNum.student / studentNumForPage)) {
			return;
		}
	}
	skipPage(currentPage + 1);
}

/*
 搜索操作
 */

function search(key) {
	//console.log(key);
	var searchMenu = document.getElementById('search-menu');
	var searchInput1 = document.getElementById('search-input-1');
	var cancelInputButton = searchInput1.children[2];
	var courseName, studentId, searchUnit, i = 0;
	var courseUI = document.getElementById('courseUI');
	searchMenu.innerHTML = '';
	if (courseUI.style.display === 'none') {
		for (studentId in studentInfo) {
			if (studentInfo[studentId].indexOf(key) !== -1 && i < 5) {
				searchUnit = '<li><a onclick="putValueInSearchBox(this)">' + studentInfo[studentId] + '</a></li>';
				searchMenu.insertAdjacentHTML('beforeEnd', searchUnit);
				i++;
			}
		}
		if (i === 0) {
			searchMenu.style.display = 'none';
		} else {
			searchMenu.style.display = 'block';
		}
	} else {
		for (courseName in courseInfo) {
			if (courseName.indexOf(key) !== -1 && i < 5) {
				searchUnit = '<li><a onclick="putValueInSearchBox(this)">' + courseName + '</a></li>';
				searchMenu.insertAdjacentHTML('beforeEnd', searchUnit);
				i++;
			}
		}
		if (i === 0) {
			searchMenu.style.display = 'none';
		} else {
			searchMenu.style.display = 'block';
		}
	}

	//这里添加一个取消按钮
	if (key === '') {
		//if (cancelInputButton !== null) {
		//	searchInput1.removeChild(cancelInputButton);
		//}
		try {
			cancelInputButton.style.display = 'none';
		} catch (e) {

		}
	} else {
		//if (cancelInputButton === null) {
		//	cancelInputButton = '<i id="cancelInputButton" class="fa fa-close cancel-input-button" onclick="cancelInput(this, true)"></i>';
		//	searchInput1.insertAdjacentHTML('beforeEnd', cancelInputButton);
		//}
		try {
			cancelInputButton.style.display = 'block';
		} catch (e) {

		}
	}
	//用空白填充，让搜索下拉框有5行
	//for (i; i < 5; i++) {
	//	searchUnit = '<li><a>  </a></li>';
	//	searchMenu.insertAdjacentHTML('beforeEnd', searchUnit);
	//}
}

document.getElementById('search-input-2').addEventListener('focus', function () {
	search(this.value);
});

document.getElementById('search-input-2').addEventListener('click', function (e) {
	cancelEventBubble(e);
});

document.getElementById('search-input-2').addEventListener('keydown', function (e) {
	if (e.keyCode === 13) {
		showInfoBySearch([this.value]);
	}
	cancelEventBubble(e);
});

document.getElementById('search-input-2').addEventListener('keyup', function () {
	search(this.value);
});

function showCourseByKey(keys) {
	var i = 0;
	var paging = '';
	var courseUI = document.getElementById('courseUI');
	var pagination = document.getElementById('paginationByCourse');

	//移除分页栏
	if (pagination !== null) {
		courseUI.removeChild(pagination);
	}

	courseList.forEach(function (e) {
		e.style.display = 'none';
	});

	keys.forEach(function (key) {
		i++;
		$('[data-course=' + key + ']').attr('data-sequence', i);
		if (i < 4) {
			$('[data-course=' + key + ']').show();
		}
	});

	if (i > courseNumForPage) {
		var pageCount = Math.ceil(i / courseNumForPage);
		pageNum.course = pageCount;
		paging = '<option value="1">1</option>';
		for (var j = 2; j <= pageCount; j++) {
			paging = paging + '<option value="' + j + '">' + j + '</option>';
		}
		paging = '<li><select id="currentPageByCourse">' + paging + '</select></li>';
		paging = '<ul class="pagination" id="paginationByCourse"><li><a onclick="skipPage(1)" aria-label="firstPage" title="跳转到第一页"><span aria-hidden="true">&laquo;</span></a></li>' +
			'<li><a onclick="prevPage()" aria-label="Previous" title="跳转到上一页"><span aria-hidden="true">&lt;</span></a></li>' +
			paging + '<li><a onclick="nextPage()" aria-label="Next" title="跳转到下一页"><span aria-hidden="true">&gt;</span></a></li>' +
			'<li><a onclick="skipPage(' + pageCount + ')" aria-label="lastPage" title="跳转到最后一页"><span aria-hidden="true">&raquo;</span></a></li>';

		courseUI.insertAdjacentHTML('beforeEnd', paging);
		pagination = document.getElementById('paginationByCourse');
		pagination.style.left = (document.body.clientWidth - 400) / 2 + "px";

		//给分页绑定事件
		document.getElementById('currentPageByCourse').addEventListener('change', function () {
			skipPage(this.value);
		});
	}
}

function showStudentByKey(keys) {
	var i = 0;
	var paging = '';
	var userUI = document.getElementById('userUI');
	var pagination = document.getElementById('paginationByStudent');

	//移除分页栏
	if (pagination !== null) {
		userUI.removeChild(pagination);
	}

	for (i = 0; i < studentEleList.length; i++) {
		studentEleList[i].style.display = 'none';
	}

	i = 0;

	keys.forEach(function (key) {
		i++;
		document.getElementById('user' + idTable[key]).setAttribute('data-num', i);
		if (i <= studentNumForPage) {
			document.getElementById('user' + idTable[key]).style.display = 'block';
		}
	});

	if (i > studentNumForPage) {
		var pageCount = Math.ceil(i / studentNumForPage);

		paging = '<option value="1">1</option>';
		for (var j = 2; j <= pageCount; j++) {
			paging = paging + '<option value="' + j + '">' + j + '</option>';
		}
		paging = '<li><select id="currentPageByStudent">' + paging + '</select></li>';
		paging = '<ul class="pagination" id="paginationByStudent"><li><a onclick="skipPage(1)" aria-label="firstPage" title="跳转到第一页"><span aria-hidden="true">&laquo;</span></a></li>' +
			'<li><a onclick="prevPage()" aria-label="Previous" title="跳转到上一页"><span aria-hidden="true">&lt;</span></a></li>' +
			paging + '<li><a onclick="nextPage()" aria-label="Next" title="跳转到下一页"><span aria-hidden="true">&gt;</span></a></li>' +
			'<li><a onclick="skipPage(' + pageCount + ')" aria-label="lastPage" title="跳转到最后一页"><span aria-hidden="true">&raquo;</span></a></li>';

		userUI.insertAdjacentHTML('beforeEnd', paging);
		pagination = document.getElementById('paginationByStudent');
		pagination.style.left = (document.body.clientWidth - 400) / 2 + "px";

		//给分页绑定事件
		document.getElementById('currentPageByStudent').addEventListener('change', function () {
			skipPage(this.value);
		});
	}
}

function showInfoBySearch() {
	var key, keys = [];
	var courseName, studentId;
	if (arguments[0]) {
		key = arguments[0][0];
	} else {
		key = document.getElementById('search-input-2').value;
	}
	//var pattern = new RegExp(key, 'i');

	if (document.getElementById('courseUI').style.display === 'none') {
		for (studentId in studentInfo) {
			//if (pattern.test(studentInfo[studentId])) {
			//	keys.push(studentInfo[studentId]);
			//}
			if (studentInfo[studentId].indexOf(key) !== -1) {
				keys.push(studentId);
			}
		}
		showStudentByKey(keys);
	} else {
		for (courseName in courseInfo) {
			//if (pattern.test(courseName)) {
			//	keys.push(courseInfo[courseName]);
			//}
			if (courseName.indexOf(key) !== -1) {
				keys.push(courseInfo[courseName]);
			}
		}
		courseList.forEach(function(e) {
			e.setAttribute('data-sequence', '0');
		});
		showCourseByKey(keys);
	}
}

function putValueInSearchBox(element) {
	var value = element.innerText;
	console.log(value);
	document.getElementById('search-input-2').value = value;
	showInfoBySearch([value]);
}


/*
 监控初始化
 */

function MonitorInit() {

	socket.on('connect', function () {
		console.log('socket is connected');

		socket.emit('socketType', {
			type : 'monitor'
		});

		//将老师的信息发送到服务器
		socket.emit('userInformation',{
			userId: userId
		});

		socket.emit('teacherOpenMonitor', {
			teacherId: userId
		});
	});

//断线重连
	socket.on('disconnect', function () {
		alert('与服务器连接中断！');
		courseList.forEach(function(ele) {
			ele.children[1].innerHTML = '';
			ele.children[0].children[4].children[0].innerHTML = 0;
		});
		userRow.innerHTML = '';
		//location.reload();
	});

//初始化监控页面
	socket.on('init', function(data) {
		console.log(data);
		var i;
		for (var studentId in data) {
			pageNum.student++;

			initStudentInfo(data[studentId], userRow);

			//存放学生的id和用户名用于检索使用
			studentInfo[studentId] = data[studentId].userName;

			//将data[studentId] 里面的课程信息赋值给studentCourseInfo
			studentCourseInfo[studentId] = data[studentId].courseList;
			console.log('init');
			//将data[studentId] 里面的synergy信息赋给instanceInfo
			for (var instanceId in data[studentId].synergy) {
				if (data[studentId].courseList[instanceId]) {
					if (instanceInfo[instanceId] === undefined) {
						instanceInfo[instanceId] = {};
					}
					instanceInfo[instanceId].progress = data[studentId].courseList[instanceId].progress;
					instanceInfo[instanceId].courseName = data[studentId].courseList[instanceId].courseName;
				}
			}
		}

		for (i = 0; i < studentNumForPage; i++) {
			if (studentEleList[i] !== undefined) {
				studentEleList[i].style.display = 'block';
			}
		}

		for (i = 0; i < studentEleList.length; i++) {
			studentEleList[i].setAttribute('data-num', i + 1);
		}

		if (pageNum.student > studentNumForPage) {
			var pageCount = Math.ceil(pageNum.student / studentNumForPage);
			var paging, pagination;
			var userUI = document.getElementById('userUI');
			paging = '<option value="1">1</option>';
			for (var j = 2; j <= pageCount; j++) {
				paging = paging + '<option value="' + j + '">' + j + '</option>';
			}
			paging = '<li><select id="currentPageByStudent">' + paging + '</select></li>';
			paging = '<ul class="pagination" id="paginationByStudent"><li><a onclick="skipPage(1)" aria-label="firstPage" title="跳转到第一页"><span aria-hidden="true">&laquo;</span></a></li>' +
				'<li><a onclick="prevPage()" aria-label="Previous" title="跳转到上一页"><span aria-hidden="true">&lt;</span></a></li>' +
				paging + '<li><a onclick="nextPage()" aria-label="Next" title="跳转到下一页"><span aria-hidden="true">&gt;</span></a></li>' +
				'<li><a onclick="skipPage(' + pageCount + ')" aria-label="lastPage" title="跳转到最后一页"><span aria-hidden="true">&raquo;</span></a></li>';

			userUI.insertAdjacentHTML('beforeEnd', paging);
			pagination = document.getElementById('paginationByStudent');
			pagination.style.left = (document.body.clientWidth - 400) / 2 + "px";

			//给分页绑定事件
			document.getElementById('currentPageByStudent').addEventListener('change', function () {
				skipPage(this.value);
			});
		}
	});

//有新的学生进入课程学习
	socket.on('studentOnline', function(data) {
		console.log('studentOnline');
		console.log(data);
		var key = document.getElementById('search-input-2').value;
		var userIdF;

		if (idTable[data.userId] === undefined){
			userIdF= generateId();
			idTable[data.userId] = userIdF;
			idTable[userIdF] = data.userId;
		} else {
			userIdF = idTable[data.userId];
		}

		addStudentInfo(data, userRow);

		//查看studentCourseInfo中是否已经有该学生的信息
		if (studentCourseInfo[data.userId] === undefined) {
			studentCourseInfo[data.userId] = {};
		}
		studentCourseInfo[data.userId][data.instanceId] = {};
		studentCourseInfo[data.userId][data.instanceId].courseName = data.courseName;
		studentCourseInfo[data.userId][data.instanceId].progress = data.progress;
		studentCourseInfo[data.userId][data.instanceId].onlineTime = 0;

		//将以任务相关信息放入instanceInfo中，用于在协同操作后操作人员列表的显示
		if (instanceInfo[data.instanceId] === undefined) {
			instanceInfo[data.instanceId] = {};
		}
		instanceInfo[data.instanceId].courseName = data.courseName;
		instanceInfo[data.instanceId].progress = data.progress;

		//存放学生的id和用户名用于检索使用
		studentInfo[data.userId] = data.userName;

		pageNum.student++;

		if (data.userName.indexOf(key) !== -1) {
			showInfoBySearch();
		} else {
			document.getElementById('user' + userIdF).style.display = 'none';
		}
	});

//学生学习进度改变
	socket.on('studentProgress', function(data) {
		console.log('studentProgress');
		//课程监控页面处头像信息变动
		console.log(data);
		var userIdF = idTable[data.userId];
		var courseIdF = idTable[data.courseId];
		var courseStudentProgress = document.getElementById(courseIdF + userIdF).children[0];
		var pretreatment = document.getElementsByClassName('pretreatment')[0];
		pretreatment.innerHTML = '';
		pretreatment.insertAdjacentHTML('beforeEnd', data.progress);
		console.log(pretreatment);
		var synergyMemberInfo = '';
		courseStudentProgress.setAttribute('data-content', '<div class="course-info"><div class="course-info-progress">当前学习进度：<div class="font-retract">' + pretreatment.innerText + '</div></div></div>');
		//学生监控页面处头像信息变动
		var studentInfoProgress = document.getElementById(data.instanceId.split('@')[1]);

		for (var userId in synergy[data.instanceId]) {
			synergyMemberInfo += '<li>' + synergy[data.instanceId][userId] + '</li>';
		}

		if (synergyMemberInfo !== '') {
			studentInfoProgress.style = "color:#ff0000";
			studentInfoProgress.setAttribute('data-content', '<div class="course-info"><div class="course-info-courseName">当前学习课程：<div class="font-retract">' +
				data.courseName + '</div></div><div class="course-info-progress">当前学习进度：<div class="font-retract">' + pretreatment.innerText +
				'</div></div><div class="course-info-synergyMember">当前协同操作成员：<ul class="font-retract">'+ synergyMemberInfo + '</ul></div></div>');
		} else {
			studentInfoProgress.setAttribute('data-content', '<div class="course-info"><div class="course-info-courseName">当前学习课程：<div class="font-retract">' + data.courseName +
				'</div></div><div class="course-info-progress">当前学习进度：<div class="font-retract">' + pretreatment.innerText+ '</div></div></div>');
		}

		try {
			//改变studentCourseInfo 中该学生的当前学习课程的学习进度
			studentCourseInfo[data.userId][data.instanceId].progress = pretreatment.innerText;
			//改变instanceInfo 中当前任务的学习进度
			instanceInfo[data.instanceId].progress = pretreatment.innerText;
		} catch(e) {
			console.log(e);
		}
	});

//学生当前学习时间改变
	socket.on('studentOnlineTimeChange', function(data) {
		try {
			studentCourseInfo[data.userId][data.instanceId].onlineTime = data.onlineTime;
		} catch(e) {
			console.log(e);
		}
	});

//学生退出当前学习的课程
	socket.on('studentOffline', function(data) {
		delete studentInfo[data.userId];
		pageNum.student--;
		var userIdF = idTable[data.userId];
		var courseIdF = idTable[data.courseId];

		var studentInfoEle = document.getElementById('user' + userIdF);
		var courseStudentInfo = document.getElementById(courseIdF + userIdF);
		//用户当前退出的课程
		var studentLearningCourse;
		//用户当前正在学习的课程的列表
		var currentCourseList;
		if (studentInfoEle !== null) {
			currentCourseList = studentInfoEle.getElementsByTagName('ul')[0];
			console.log(data.instanceId);
			studentLearningCourse = document.getElementById(data.instanceId.split('@')[1]);
			if (currentCourseList.children.length > 0) {
				currentCourseList.removeChild(studentLearningCourse);
				if (currentCourseList.children.length === 0) {
					studentInfoEle.parentNode.removeChild(studentInfoEle);
				}
			}
		}
		if (courseStudentInfo !== null) {
			courseStudentInfo.parentNode.removeChild(courseStudentInfo);
		}
		var onlineCount = document.getElementById(courseIdF + 'OnlineCount');
		onlineCount.innerHTML = (parseInt((onlineCount.innerHTML || 1)) - 1) < 0 ? 0 : (parseInt((onlineCount.innerHTML || 1)) - 1);
		onlineCount.parentNode.parentNode.parentNode.setAttribute('data-onlineCount', onlineCount.innerHTML);
		console.log('studentOffline');

		//在studentCourseInfo 中删除关于该学生的该课程的信息
		if (studentCourseInfo[data.userId][data.instanceId] !== undefined) {
			delete studentCourseInfo[data.userId][data.instanceId];
		}
		//在instanceInfo 中删除该任务的信息
		if (instanceInfo[data.instanceId] !== undefined) {
			delete instanceInfo[data.instanceId];
		}
	});

//学生发出求助请求
//	socket.on('help', function(data) {
//		//获取用户头像
//		console.log('help');
//		console.log(data);
//		//获取以学生为主的监控页面中的该学生的头像 avatar
//		var avatar = getPrevElement(document.getElementById('name' + idTable[data.userId]));
//		//获取以课程为主的监控页面中的该学生的头像 courseStudentAvatar
//		var courseStudentAvatar = document.getElementById(data.courseId + data.userId).children[0];
//		//添加头像闪动效果
//		avatar.className += ' help';
//		courseStudentAvatar.className += ' help';
//		//给协同操作添加学生当前url地址
//		avatar.addEventListener('contextmenu',function () {
//			//将课程的ID放到协同操作标签的data-courseId属性里面
//			oMenu.children[1].children[0].setAttribute('href', '../?instanceId=' + data.instanceId);
//			oMenu.children[1].children[0].setAttribute('target', '_blank');
//			oMenu.children[1].children[0].setAttribute('onclick', 'resolve("' + data.courseId + '","' + data.userId + '","' + userId + '")');
//		});
//		courseStudentAvatar.addEventListener('contextmenu', function () {
//			//将课程的ID放到协同操作标签的data-courseId属性里面
//			oMenu.children[1].children[0].setAttribute('href', '../?instanceId=' + data.instanceId);
//			oMenu.children[1].children[0].setAttribute('target', '_blank');
//			oMenu.children[1].children[0].setAttribute('onclick', 'resolve("' + data.courseId + '","' + data.userId + '","' + userId + '")');
//		});
//
//	});

	//当学生给老师发信息的时候处理
	socket.on('offMsg', function (data) {
		if(clientSockets[data.userId]) {
			return;
		}
		var userIdF = idTable[data.userId];
		var target = document.getElementById('name' + userIdF);
		var unReadMsg;
		var unReadMsgBadge;
		if (target !== null) {
			if (getNextElement(target) === null) {
				unReadMsgBadge = '<span class="badge" onclick="openChatByBadge(this)" style="float:right"></span>';
				target.insertAdjacentHTML('afterEnd', unReadMsgBadge);
			}
			unReadMsg = getNextElement(target);
		}
		unReadMsg.innerHTML = parseInt((unReadMsg.innerHTML || 0)) + 1;
	});
}

function renderCourseInfo(result) {
	var arr = [];
	var id;
	for (id in result) {
		arr.push(result[id]);
	}
	try {
		arr.forEach(function (data) {
			console.log(data);
			if (data.length === 0) return;
			var total, finished, unFinished, totalCount, finishedCount, unFinishedCount, totalNum, finishedNum, unFinishedNum, userId;
			total = {};
			finished = {};
			unFinished = {};
			totalCount = 0;
			finishedCount = 0;
			unFinishedCount = 0;
			totalNum = data.length;
			finishedNum = 0;
			unFinishedNum = 0;

			data.forEach(function (courseInstance) {
				if (courseInstance.statement === 'on') {
					unFinished[courseInstance.userId] = courseInstance.userId;
					unFinishedNum++;
				} else if (courseInstance.statement === 'off') {
					finished[courseInstance.userId] = courseInstance.userId;
					finishedNum++;
				}
				//if (courseInstance.status === 'active') {
				//	unFinished[courseInstance.userId] = courseInstance.userId;
				//	unFinishedNum++;
				//} else if (courseInstance.status === 'finished') {
				//	finished[courseInstance.userId] = courseInstance.userId;
				//	finishedNum++;
				//}
				total[courseInstance.userId] = courseInstance.userId;
			});

			for (userId in finished) {
				finishedCount++;
			}
			for (userId in unFinished) {
				unFinishedCount++;
			}
			for (userId in total) {
				totalCount++;
			}

			console.log(finished);
			console.log(unFinished);

			var courseInfoEle = document.getElementById('info' + idTable[data[0].courseId]);
			courseInfoEle.children[1].children[0].innerHTML = totalCount + '/' + totalNum;
			courseInfoEle.parentNode.setAttribute('data-historycount', totalCount + '/' + totalNum);
			courseInfoEle.children[2].children[0].innerHTML = unFinishedCount + '/' + unFinishedNum;
			courseInfoEle.parentNode.setAttribute('data-unfinishedcount', unFinishedCount + '/' + unFinishedNum);
			courseInfoEle.children[3].children[0].innerHTML = finishedCount + '/' + finishedNum;
			courseInfoEle.parentNode.setAttribute('data-completedcount', finishedCount + '/' + finishedNum);
		});
	} catch(e) {
		alert('获取课程历史信息失败！')
	}
}

MonitorInit();


	
