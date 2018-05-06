CREATE TABLE `base_course_type` (
  `id` varchar(36) COLLATE utf8_bin NOT NULL COMMENT '基础课程分类id',
  `name` varchar(100) COLLATE utf8_bin NOT NULL COMMENT '基础课程分类名称',
  `code` varchar(50) COLLATE utf8_bin NOT NULL,
  `short_des` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '基础课程分类描述',
  `tree_node_no` varchar(100) COLLATE utf8_bin NOT NULL COMMENT '分类编码',
  `level_index` int(11) DEFAULT NULL COMMENT '分类层级序号',
  `is_leaf` varchar(1) COLLATE utf8_bin DEFAULT NULL COMMENT '节点状态, 1: 是末节点, 0:不是末节点',
  `parent_id` varchar(36) COLLATE utf8_bin DEFAULT NULL COMMENT '父分类id',
  `remark` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '备注',
  `data_status` varchar(1) COLLATE utf8_bin DEFAULT NULL COMMENT '数据有效性, 1:有效, 0:删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `base_course_classification` (
  `id` varchar(64) NOT NULL COMMENT '基础课程分类的id',
  `name` varchar(64) DEFAULT NULL COMMENT '基础课程分类名称',
  `course_classification_name` varchar(64) DEFAULT NULL COMMENT '课程分类的名称',
  `data_status` varchar(1) DEFAULT NULL COMMENT '数据有效性, 1:有效, 0:删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `base_course` (
  `id` varchar(64) NOT NULL COMMENT '基础课程id',
  `name` varchar(256) DEFAULT NULL COMMENT '基础课程名称',
  `description` longtext COMMENT '基础课程描述',
  `base_course_classification_id` varchar(64) DEFAULT NULL COMMENT '基础课程分类id',
  `is_published` varchar(1) DEFAULT NULL COMMENT '发布状态, 1: 发布, 0:未发布',
  `icon` varchar(64) DEFAULT NULL COMMENT '基础课程的图标',
  `scan_times` int(11) DEFAULT 0 COMMENT '浏览次数',
  `subscribe_times` int(11) DEFAULT 0  COMMENT '订阅次数',
  `graph_xml_id` varchar(64) DEFAULT NULL COMMENT '基础课程的bpmn文件id',
  
  `data_status` varchar(1) DEFAULT NULL COMMENT '数据有效性, 1:有效, 0:删除',
  `create_time` varchar(23) DEFAULT NULL COMMENT '创建时间',
  `creator_id` varchar(64) DEFAULT NULL COMMENT '创建人id',
  `update_time` varchar(23) DEFAULT NULL COMMENT '修改时间',
  `updator_id` varchar(64) DEFAULT NULL COMMENT '修改人id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `base_course_detail` (
  `id` varchar(64) NOT NULL COMMENT '基础课程详情id',
  `base_course_id` varchar(64) DEFAULT NULL COMMENT '基础课程id',
  `course_guide` longtext COMMENT '课程导读',
  `suitable_user` longtext  COMMENT '适用对象',
  `typical_task_des` longtext  COMMENT '典型工作任务描述',
  `course_goal` longtext COMMENT '课程目标',
  `course_content` longtext COMMENT '课程内容',
  `work_target` longtext COMMENT '工作对象',
  `tool` longtext COMMENT '工具、工作方法与工作组织方式',
  `work_requirement` longtext COMMENT '工作要求',
  `vocational_standard` longtext COMMENT '职业资格标准',
  `course_length` varchar(32) DEFAULT '0' COMMENT '课时数',
  `about_professor` longtext COMMENT '教师介绍',
  `work_process` longtext COMMENT '工作过程',
  
  `data_status` varchar(1) DEFAULT NULL COMMENT '数据有效性, 1:有效, 0:删除',
  `create_time` varchar(23) DEFAULT NULL COMMENT '创建时间',
  `creator_id` varchar(64) DEFAULT NULL COMMENT '创建人id',
  `update_time` varchar(23) DEFAULT NULL COMMENT '修改时间',
  `updator_id` varchar(64) DEFAULT NULL COMMENT '修改人id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `course` (
  `id` varchar(64) NOT NULL COMMENT '课程id',
  `name` varchar(256) DEFAULT NULL COMMENT '课程名称',
  `base_course_id` varchar(64) DEFAULT NULL  COMMENT '基础课程id',
  `parent_id` varchar(64) DEFAULT NULL COMMENT '父课程id',
  `description` longtext COMMENT '课程描述',
  `is_leaf` varchar(1) DEFAULT NULL COMMENT '节点状态, 1: 是末节点, 可学习的课程, 0:不是末节点',
  `position` int(11) DEFAULT 0   COMMENT '课程次序',
  `icon` varchar(64) DEFAULT NULL COMMENT '课程的图标',
  `is_published` varchar(1) DEFAULT NULL COMMENT '发布状态, 1: 发布, 0:未发布',
  
  `is_cooperation` varchar(1) DEFAULT NULL COMMENT '1: 合作课程, 0:非合作课程',
  `graph_xml_id` varchar(64) DEFAULT NULL COMMENT '课程的bpmn文件id',
  `group_range` varchar(2000) DEFAULT NULL COMMENT '分组信息',
  `role_pool` varchar(2000) DEFAULT NULL COMMENT '角色信息',
  `scan_times` int(11) DEFAULT 0   COMMENT '浏览次数',
  `subscribe_times` int(11) DEFAULT 0   COMMENT '订阅次数',
  `study_times` int(11) DEFAULT 0   COMMENT '学习次数',
  
  `data_status` varchar(1) DEFAULT NULL COMMENT '数据有效性, 1:有效, 0:删除',
  `create_time` varchar(23) DEFAULT NULL COMMENT '创建时间',
  `creator_id` varchar(64) DEFAULT NULL COMMENT '创建人id',
  `update_time` varchar(23) DEFAULT NULL COMMENT '修改时间',
  `updator_id` varchar(64) DEFAULT NULL COMMENT '修改人id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `course_detail` (
  `id` varchar(64) NOT NULL COMMENT '课程详情id',
  `course_id` varchar(64) DEFAULT NULL COMMENT '课程id',
  `work_situation` longtext COMMENT '学习情境描述',
  `work_task` longtext COMMENT '学习任务',
  `goal` longtext COMMENT '学习目标',
  `content` longtext COMMENT '课学习内容',
  `difficulty` longtext COMMENT '重难点',
  `organization_form` longtext COMMENT '教学组织形式与教学方法',
  `assessment_standards` longtext COMMENT '考核标准',
  `teaching_condition` longtext COMMENT '教学条件',
  `schedule` longtext COMMENT '教学时间安排',
  `target` longtext COMMENT '工作对象',
  `tool` longtext COMMENT '工作与教学用具',
  `work_requirement` longtext COMMENT '工作要求',
  
  `data_status` varchar(1) DEFAULT NULL COMMENT '数据有效性, 1:有效, 0:删除',
  `create_time` varchar(23) DEFAULT NULL COMMENT '创建时间',
  `creator_id` varchar(64) DEFAULT NULL COMMENT '创建人id',
  `update_time` varchar(23) DEFAULT NULL COMMENT '修改时间',
  `updator_id` varchar(64) DEFAULT NULL COMMENT '修改人id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;






