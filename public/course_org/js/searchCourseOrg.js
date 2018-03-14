(function($){
	var TemplateView = {
		SearchButHTML :
							'<div class="row">'+
								'<div class="col-md-8"></div>'+
								'<div class="col-md-2">'+
									'<button type="button" class="btn btn-success" id="organizedCourse">搜 索</button>'+
								'</div>'+
								'<!--<div class="col-md-2">'+
									'<button type="button" class="btn btn-success organizeNewCourse" data-toggle="modal" data-target="#organizeNewCoursePanel">组织新课程</button>'+
							   '</div>-->'+
							'</div>'+
							'<div class="modal fade" id="organizeNewCoursePanel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
								'<div class="modal-dialog">'+
									'<div class="modal-content">'+
										'<div class="modal-header">'+
											'<button type="button" class="close"data-dismiss="modal" aria-hidden="true">&times;</button>'+
											'<h4></h4>'+
										'</div>'+
										'<div class="modal-body">'+
											'<div class="row" style="margin-top: 40px;margin-bottom: 40px;">'+
												'<span class="col-sm-2" align="center">选择课程:</span>'+
												'<div class="col-sm-9">'+
													'<select class="form-control" name="courses"></select>'+
												'</div>'+
											'</div>'+
										'</div>'+
										'<div class="modal-footer">'+
											'<button type="button" class="btn btn-info startToOrg" data-dismiss="modal">开始组织课程</button>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div><hr />'+
							'<div style="overflow-x:auto;"><div id="courseOrgGrid"></div></div>',

	    SearchConditionHTML : '<ul class="list-group">'+
									'<li class="list-group-item">'+
										'<div class="row">'+
											'<span class="col-sm-2" align="right">课程名称:</span>'+
											'<div class="col-sm-4">'+
												'<input type="text" class="form-control myCondition" name="INSTANCE_NAME">'+
											'</div>'+
											'<span class="col-sm-2" align="right">负责老师:</span>'+
											'<div class="col-sm-4">'+
												'<input type="text" class="form-control myCondition" name="TEACHER_NAME">'+
											'</div>'+
										'</div>'+
									'</li>'+
									'<li class="list-group-item">'+
										'<div class="row">'+
											'<span class="col-sm-2" align="right">组织单位:</span>'+
											'<div class="col-sm-4">'+
												'<input type="text" class="form-control myCondition" name="CREATOR_ORGID_NAME">'+
											'</div>'+
											'<span class="col-sm-2" align="right">组织人:</span>'+
											'<div class="col-sm-4">'+
												'<input type="text" class="form-control myCondition" name="ORG_USER_NAME">'+
											'</div>'+
										'</div>'+
									'</li>'+
									'<li class="list-group-item">'+
										'<div class="row">'+
											'<span class="col-sm-2" align="right">组织开始时间:</span>'+
											'<div class="col-sm-4">'+
												'<input type="text" class="form-control myCondition time" readonly style="cursor: pointer;" id="BEGIN_TIME"  name="BEGIN_TIME">'+
											'</div>'+
											'<span class="col-sm-2" align="right">组织结束时间:</span>'+
											'<div class="col-sm-4">'+
												'<input type="text" class="form-control myCondition time" readonly style="cursor: pointer;" id="END_TIME"  name="END_TIME">'+
											'</div>'+
										'</div>'+
									'</li>'+
						        '</ul>'
	};

	//搜索框
	var SearchButView = Backbone.View.extend({
		className: 'searchInput',
		attributes: {
			style: 'margin-bottom: 10px'
		},

		events : {
			'click .optOrganizedCourse' : 'optOrganizedCourse',
			'click  #organizedCourse' : 'getOrganizedCourse',
			'click .organizeNewCourse' : 'preOrganizeNewCourse',
			'click .startToOrg' : 'startToOrg'
		},

		initialize : function(){
			_.bindAll(this, 'render');

			this.render();
		},

		render: function(){
			this.template = _.template(TemplateView.SearchButHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
			$('.container', 'body').append(this.el);
		},

		optOrganizedCourse : function(event){
			var currObj = event.currentTarget,
				currName = $(currObj).attr('name'),
				LRNSCN_ORG_ID = $(currObj).attr('LRNSCN_ORG_ID');

			//var me = this;
			if(currName == 'delete'){
				$.post('/CourseOrg/optCourseOrg/delete', {LRNSCN_ORG_ID: LRNSCN_ORG_ID}, function(result){
					if(result && result.isOk){
						alert('删除课程组织成功~~');
						courseOrgList.postForm();
					}
				});
			}else{
				console.log('new');
				window.location.href = '/CourseOrg/opt?LRNSCN_ORG_ID='+LRNSCN_ORG_ID+'&optType='+currName;
			}
		},

		//获取我的已组织的课程
		getOrganizedCourse : function(){
			$('.lrList', 'body').html('<div style="margin-top:15%;margin-left:45%;"><img src = "/course_org/images/wait.jpg"  alt="请稍等..."/></div>');
			$('.myCondition', 'ul').each(function(){
				var cName = $(this).attr('name'), cValue = $(this).val();
				var tempJ = {};
				tempJ[cName] = cValue;
				Query.set(tempJ, {silent : true});
			});

			courseOrgList.postForm();
		},

		//获取我的和公开的等可供组织的课程
		preOrganizeNewCourse : function(){
			var userId = Query.get('userId');
			$('select[name="courses"]', this.el).html(
				'<option value="">-- 请选择要组织的课程 --</option>'+
				'<option value="a343ce90-70cf-11e6-b39c-51491ea8ce2a" area_id="6da27590-70af-11e6-ba19-53ce6aac1a16" area_name="网络安全现状描述">密码安全之弱口令_new</option>'+
				'<option value="203df730-70cc-11e6-b39c-51491ea8ce2a" area_id="6da27590-70af-11e6-ba19-53ce6aac1a16" area_name="网络安全现状描述">应用程序Nday漏洞_new</option>'+
				'<option value="61564050-6dcb-11e6-ad5c-6d43e447ffba" area_id="1683d4c0-6db7-11e6-b820-9dbc81782d6a" area_name="测试160829_领域">测试160829_情境一_实例一_learn</option>'+
				'<!--<option value="3eccc410-7635-11e6-bfb1-35c652256e30" area_id="17f8b110-7634-11e6-bfb1-35c652256e30" area_name="web安全工程师职责">信息泄露事件</option>'+
				'<option value="342c8e30-6dcc-11e6-ad5c-6d43e447ffba" area_id="17f8b110-7634-11e6-bfb1-35c652256e30" area_name="测试160829_领域">测试160829_领域_情境二_实例一_权限提升缺陷绕过_learn</option>'+
				'<option value="392805c0-7634-11e6-bfb1-35c652256e30" area_id="17f8b110-7634-11e6-bfb1-35c652256e30" area_name="web安全工程师职责">web安全评估工程师_new</option>-->'
			);
		},

		//开始准备课程
		startToOrg : function(){
			var selOption = $('select[name="courses"]', this.el).find('option:selected'),
				INSTANCE_ID = selOption.val().trim();
			if(INSTANCE_ID == ''){
				alert('请先选择一个课程~~');
			}else{
				window.location.href = '/CourseOrg/opt?courseId='+INSTANCE_ID+'&optType=save';
			}
		}
	});

	//搜索条件
	var SearchConditionView = Backbone.View.extend({
		className : 'searchCondition',

		events : {
			'focus .time': 'setTime',
			'change .myCondition' : 'changeCondition'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'changeCondition');
			this.render();
		},

		render: function(){
			$(this.el).append(TemplateView.SearchConditionHTML);
			$('.container', 'body').append(this.el);					      
		},

		setTime: function(event){
			var currObj = event.currentTarget,
				cName = $(currObj).attr('name');
			if(cName == 'BEGIN_TIME'){
				WdatePicker({el: 'BEGIN_TIME', dateFmt:'yyyy-MM-dd HH:mm:ss', maxDate: '#F{$dp.$D(\'END_TIME\');}'});
			}else if(cName == 'END_TIME'){
				WdatePicker({el: 'END_TIME', dateFmt:'yyyy-MM-dd HH:mm:ss', minDate: '#F{$dp.$D(\'BEGIN_TIME\');}'});
			}
		},

		changeCondition: function(event){
			var currObj = event.currentTarget;
			var cName = $(currObj).attr('name'), cValue = $(currObj).val();
			var tempJ = {};
			tempJ[cName] = cValue;
			Query.set(tempJ, {silent: true});
			courseOrgList.postForm();
		}

	});

	//主视图，组织各个子视图
	var APPView = Backbone.View.extend({
		className : 'container',
		attributes : {
			style : "padding: 50px 50px 10px"
		},

		initialize : function(){
			_.bindAll(this, 'render', 'writeItem');
			this.listenTo(courseOrgList, 'reset', this.writeItem);
			this.render();
		},

		render : function(){
			$('body').append(this.el);
			this.searchConditionView = new SearchConditionView();
			this.searchButView = new SearchButView({model: Query});
		},

		writeItem : function(){
			$("#courseOrgGrid").empty();
			//console.log(courseOrgList.toJSON());

			$("#courseOrgGrid").kendoGrid({
				dataSource: {
					data: courseOrgList.toJSON(),
					pageSize: 20
				},
				sortable: {
					mode: "single",
					allowUnsort: false
				},
				pageable: {
					buttonCount: 5
				},
				scrollable: false,
				columns: [
					{
						field: "INSTANCE_NAME",
						title: "<div align='center'><strong>学习情境</strong></div>",
						width: "18%"
					},
					{
						field: "BEGIN_TIME",
						title: "<div align='center'><strong>组织开始时间</strong></div>",
						width: "14%"
					},

					{
						field: "END_TIME",
						title: "<div align='center'><strong>组织结束时间</strong></div>",
						width: "14%"
					},

					{
						field: "CREATOR_ORGID_NAME",
						title: "<div align='center'><strong>组织单位</strong></div>",
						width: "18%"
					},

					{
						field: "TEACHER_NAME",
						title: "<div align='center'><strong>负责老师</strong></div>",
						width: "8%"
					},

					{
						template: '#if(IS_SINGLE == 1){#<span title="学习时，组内的各个学生各自独立完成学习任务">单人独立学习</span>#}else {#<span title="学习时，各组相互独立，且一个组内的角色里的学生分别完成本角色的课程任务，协作共同完成课程的学习">多人合作学习</span>#}#',
						title: "<div align='center'><strong>组织类型</strong></div>",
						width: "8%"
					},

					{
						template: '#if(STATUS == "0"){#组织中#}else if(STATUS == "1"){#组织完#}else if(STATUS == "2"){#学习中#}else{#学习完#}#',
						title: "<div align='center'><strong>状态</strong></div>",
						width: "6%"
					},

					{
						template: '<div align="center"><button type="button" class="btn btn-info btn-xs optOrganizedCourse" name="look" LRNSCN_ORG_ID="#=LRNSCN_ORG_ID#">查 看</button>&nbsp;&nbsp;'+
									'#if(STATUS == "0"){#<button type="button" class="btn btn-info btn-xs optOrganizedCourse" name="edit" LRNSCN_ORG_ID="#=LRNSCN_ORG_ID#">编 辑</button>&nbsp;&nbsp;#}#'+
									'#if(STATUS == "0" || STATUS == "1"){#<button type="button" class="btn btn-info btn-xs optOrganizedCourse" name="delete" LRNSCN_ORG_ID="#=LRNSCN_ORG_ID#">删 除</button>#}#</div>',
						title: "<div align='center'><strong>操作</strong></div>",
						width: "14%"
					}
				]
			});
		}
	});

	var appView = new APPView();
})(jQuery);