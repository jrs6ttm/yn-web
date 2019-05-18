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
  `id` varchar(64) NOT NULL COMMENT '基础课程类别的id',
  `name` varchar(64) DEFAULT NULL COMMENT '基础课程类别名称',
  `course_classification_name` varchar(64) DEFAULT NULL COMMENT '课程类别的名称',
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

//创建课程授权表
CREATE TABLE `oc_course_authorize` (
  `id` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '课程授权ID',
  `course_id` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '课程id',
  `course_type` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '课程类型，1:情景，2:实例',
  `course_name` varchar(512) COLLATE utf8_bin NOT NULL COMMENT '课程名称',
  `dept_id` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '部门id' ,
  `user_id` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '人员id' ,
  `rights` varchar(16) COLLATE utf8_bin DEFAULT NULL COMMENT '所授权利，1:组织课程，2:学习课程',
  `remark` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '备注',
  `isvalid` varchar(1) CHARACTER SET utf8 DEFAULT '1' COMMENT '是否有效,1:有效,0或NULL无效',
  `creator_id` varchar(64) COLLATE utf8_bin DEFAULT NULL COMMENT '录入人员',
  `create_date` datetime DEFAULT NULL COMMENT '录入日期',
  `lastupdator_id` varchar(64) COLLATE utf8_bin DEFAULT NULL COMMENT '最近更新人',
  `lastupdate_date` datetime DEFAULT NULL COMMENT '最近更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='课程授权表';

INSERT INTO `base_course_type` VALUES ('46c46f9c-fcc8-11e6-a340-080027477d92', '财经文化教育', 'CJWHJY', '财经文化教育', 'R0010', '1', '0', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c47c23-fcc8-11e6-a340-080027477d92', '经济类', 'CJWHJY_JJL', '经济类', 'R00100010', '2', '0', '46c46f9c-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c482e1-fcc8-11e6-a340-080027477d92', '电子商务1', 'CJWHJY_JJL_dzsw', '电子商务1', 'R001000100010', '3', '1', '46c47c23-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c49181-fcc8-11e6-a340-080027477d92', '金融管理与务实', 'CJWHJY_JJL_JJWS', '金融管理与务实', 'R001000100020', '3', '1', '46c47c23-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4b34d-fcc8-11e6-a340-080027477d92', '电子信息', 'DZXX', '电子信息', 'R0020', '1', '0', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c4b9d0-fcc8-11e6-a340-080027477d92', '计算机类', 'DZXX_JSJ', '计算机类', 'R00200010', '2', '0', '46c4b34d-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4bfa7-fcc8-11e6-a340-080027477d92', '计算机应用', 'DZXX_JSJ_JSJYY', '计算机应用', 'R002000100010', '3', '1', '46c4b9d0-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4c56a-fcc8-11e6-a340-080027477d92', '计算机网络', 'DZXX_JSJ_JSJWL', '计算机网络', 'R002000100020', '3', '1', '46c4b9d0-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4cc4d-fcc8-11e6-a340-080027477d92', '计算机信息管理', 'DZXX_JSJ_JSJXXGL', '计算机信息管理', 'R002000100030', '3', '1', '46c4b9d0-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4d221-fcc8-11e6-a340-080027477d92', '网络系统管理', 'DZXX_JSJ_WLGL', '网络系统管理', 'R002000100040', '3', '1', '46c4b9d0-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4d9ff-fcc8-11e6-a340-080027477d92', '动漫设计与制作', 'DZXX_JSJ_DMZZ', '动漫设计与制作', 'R002000100050', '3', '1', '46c4b9d0-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4dffd-fcc8-11e6-a340-080027477d92', '嵌入式系统技术与应用', 'DZXX_JSJ_QRSJSYY', '嵌入式系统技术与应用', 'R002000100060', '3', '1', '46c4b9d0-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4e5c8-fcc8-11e6-a340-080027477d92', '电子信息类', 'DZXX_DZXX', '电子信息类', 'R00200020', '2', '0', '46c4b34d-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4ec30-fcc8-11e6-a340-080027477d92', '电子信息物联网方向', 'DZXX_DZXX_DZWLW', '电子信息物联网方向', 'R002000200010', '3', '1', '46c4e5c8-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4f201-fcc8-11e6-a340-080027477d92', '电子信息网络信息方向', 'DZXX_DZXX_WL', '电子信息网络信息方向', 'R002000200020', '3', '1', '46c4e5c8-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c4f7d5-fcc8-11e6-a340-080027477d92', '应用电子技术', 'DZXX_DZXX_YYDZ', '应用电子技术', 'R002000200030', '3', '1', '46c4e5c8-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c50077-fcc8-11e6-a340-080027477d92', '微电子技术', 'DZXX_DZXX_WDZ', '微电子技术', 'R002000200040', '3', '1', '46c4e5c8-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c50669-fcc8-11e6-a340-080027477d92', '数字媒体技术', 'DZXX_DZXX_SZMDJS', '数字媒体技术', 'R002000200050', '3', '1', '46c4e5c8-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c50c29-fcc8-11e6-a340-080027477d92', '嵌入式工程', 'DZXX_DZXX_QRSGC', '嵌入式工程', 'R002000200060', '3', '1', '46c4e5c8-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c51527-fcc8-11e6-a340-080027477d92', '通信类', 'TXL', '通信类', 'R00200030', '2', '1', '46c4b34d-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c51d19-fcc8-11e6-a340-080027477d92', '信息安全技术', 'XXAQ', '信息安全技术', 'R00200040', '2', '0', '46c4b34d-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c52827-fcc8-11e6-a340-080027477d92', '安全集成', 'XXAQ_AQJC', '安全集成', 'R002000400010', '3', '1', '46c51d19-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c52e3e-fcc8-11e6-a340-080027477d92', '安全应用', 'XXAQ_AQYY', '安全应用', 'R002000400020', '3', '1', '46c51d19-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c535f8-fcc8-11e6-a340-080027477d92', '安全服务', 'XXAQ_AQFW', '安全服务', 'R002000400030', '3', '1', '46c51d19-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c53d15-fcc8-11e6-a340-080027477d92', '产品生产', 'XXAQ_AQSC', '产品生产', 'R002000400040', '3', '1', '46c51d19-fcc8-11e6-a340-080027477d92', '', '1');
INSERT INTO `base_course_type` VALUES ('46c542f4-fcc8-11e6-a340-080027477d92', '医药卫生', 'YYWS', '医药卫生', 'R0030', '1', '1', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c54aab-fcc8-11e6-a340-080027477d92', '农林牧渔', 'NLMY', '农林牧渔', 'R0040', '1', '1', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c550b7-fcc8-11e6-a340-080027477d92', '资源开发与测绘', 'ZYKFYCH', '资源开发与测绘', 'R0050', '1', '1');
INSERT INTO `base_course_type` VALUES ('46c55685-fcc8-11e6-a340-080027477d92', '土建水利与气象环保安全', 'TJSLYQXHBAQ', '土建水利与气象环保安全', 'R0060', '1', '1', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c55ced-fcc8-11e6-a340-080027477d92', '制造', 'ZZY', '制造', 'R0070', '1', '1', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c562c4-fcc8-11e6-a340-080027477d92', '轻纺食品', 'QFSP', '轻纺食品', 'R0080', '1', '1', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c56884-fcc8-11e6-a340-080027477d92', '旅游', 'LIUYOU', '旅游', 'R0090', '1', '1', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c49896-fcc8-11e6-a340-080027477d92', '公共事业', 'GGSY', '公共事业', 'R0100', '1', '1', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c49e6c-fcc8-11e6-a340-080027477d92', '艺术与传媒', 'YSYCM', '艺术与传媒', 'R0110', '1', '1', null, '', '1');
INSERT INTO `base_course_type` VALUES ('46c4a507-fcc8-11e6-a340-080027477d92', '法律类', 'FLL', '法律类', 'R0120', '1', '1', null, '', '1');




