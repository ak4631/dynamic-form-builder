-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: database
-- Generation Time: Jul 24, 2024 at 04:21 AM
-- Server version: 8.0.32
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lamp`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_permission`
--

CREATE TABLE `api_permission` (
  `id` int NOT NULL,
  `module_id` int DEFAULT NULL,
  `data_group_id` int DEFAULT NULL,
  `api_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `api_permission`
--

INSERT INTO `api_permission` (`id`, `module_id`, `data_group_id`, `api_name`) VALUES
(1, 2, 1, 'Optimust\\Admin\\Api\\UpdatePasswordAPI');

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE `config` (
  `name` varchar(100) NOT NULL DEFAULT '',
  `value` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`name`, `value`) VALUES
('admin.localization.default_date_format', 'Y-m-d'),
('admin.localization.default_language', 'en_US'),
('admin.localization.use_browser_language', 'No'),
('admin.product_type', 'os'),
('auth.password_policy.default_required_password_strength', 'strong'),
('auth.password_policy.enforce_password_strength', 'on'),
('auth.password_policy.is_spaces_allowed', 'false'),
('auth.password_policy.min_lowercase_letters', '1'),
('auth.password_policy.min_numbers_in_password', '1'),
('auth.password_policy.min_password_length', '8'),
('auth.password_policy.min_special_characters', '1'),
('auth.password_policy.min_uppercase_letters', '1'),
('authentication.status', 'Enable'),
('authorize_user_role_manager_class', 'BasicUserRoleManager'),
('base_url', 'https://www.optimust.world'),
('csrf_secret', 's1xFChLfLL2H03HNfMEGpTrTX_1UFOJTmbvLQneBermW-LwQgjGdPkaW9IuaJxqeJI-Uc51XN2FZwTf9T8ZA2w'),
('domain.name', 'localhost'),
('email_config.sendmail_path', '/usr/sbin/sendmail -bs'),
('help.processorClass', 'ZendeskHelpProcessor'),
('help.url', 'https://help.optimust.world'),
('instance.identifier', ''),
('instance.reg_consent', '1'),
('instance.version', '1.0.0'),
('oauth.access_token_ttl', 'PT30M'),
('oauth.auth_code_ttl', 'PT5M'),
('oauth.encryption_key', 'uXo6Q3bsrSWUzPz7ah1SqP/kntyQa/gscJze0fLOyn0='),
('oauth.refresh_token_ttl', 'P1M'),
('oauth.token_encryption_key', 'R/PMTkI8TKjhYltwJky5KFTiEEGSL/XBMPCSaWvdLOY='),
('openId.provider.added', 'on'),
('open_source_integrations', '<xml><integrations></integrations></xml>');

-- --------------------------------------------------------

--
-- Table structure for table `data_group`
--

CREATE TABLE `data_group` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `can_read` tinyint DEFAULT NULL,
  `can_create` tinyint DEFAULT NULL,
  `can_update` tinyint DEFAULT NULL,
  `can_delete` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `data_group`
--

INSERT INTO `data_group` (`id`, `name`, `description`, `can_read`, `can_create`, `can_update`, `can_delete`) VALUES
(1, 'apiv1_admin_update_password', 'API-v1 - Password Update', 0, 0, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `email`
--

CREATE TABLE `email` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `email_notification`
--

CREATE TABLE `email_notification` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_enable` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `email_processor`
--

CREATE TABLE `email_processor` (
  `id` int NOT NULL,
  `email_id` int NOT NULL,
  `class_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `email_template`
--

CREATE TABLE `email_template` (
  `id` int NOT NULL,
  `email_id` int NOT NULL,
  `locale` varchar(20) DEFAULT NULL,
  `performer_role` varchar(50) DEFAULT NULL,
  `recipient_role` varchar(50) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `body` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `group_field`
--

CREATE TABLE `group_field` (
  `group_field_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `group_by_clause` mediumtext NOT NULL,
  `group_field_widget` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `home_page`
--

CREATE TABLE `home_page` (
  `id` int NOT NULL,
  `user_role_id` int NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `enable_class` varchar(100) DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '0' COMMENT 'lowest priority 0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `home_page`
--

INSERT INTO `home_page` (`id`, `user_role_id`, `action`, `enable_class`, `priority`) VALUES
(1, 1, 'admin/viewSystemUsers', NULL, 15);

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_role_name` text NOT NULL,
  `user_role_predefined` tinyint(1) NOT NULL,
  `login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `user_id`, `user_name`, `user_role_name`, `user_role_predefined`, `login_time`) VALUES
(1, 1, 'balbeer.mca', 'Admin', 1, '2024-07-24 04:18:18');

-- --------------------------------------------------------

--
-- Table structure for table `mail_queue`
--

CREATE TABLE `mail_queue` (
  `id` int NOT NULL,
  `to_list` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  `cc_list` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '(DC2Type:array)',
  `bcc_list` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '(DC2Type:array)',
  `subject` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `sent_at` datetime DEFAULT NULL,
  `status` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menu_item`
--

CREATE TABLE `menu_item` (
  `id` int NOT NULL,
  `menu_title` varchar(255) NOT NULL,
  `screen_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `level` tinyint NOT NULL,
  `order_hint` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `additional_params` longtext COMMENT '(DC2Type:json)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `module`
--

CREATE TABLE `module` (
  `id` int NOT NULL,
  `name` varchar(120) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `display_name` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `module`
--

INSERT INTO `module` (`id`, `name`, `status`, `display_name`) VALUES
(1, 'core', 1, 'Core'),
(2, 'admin', 1, 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `modules_default_page`
--

CREATE TABLE `modules_default_page` (
  `id` int NOT NULL,
  `module_id` int NOT NULL,
  `user_role_id` int NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `enable_class` varchar(100) DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '0' COMMENT 'lowest priority 0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `registration_event_queue`
--

CREATE TABLE `registration_event_queue` (
  `id` int NOT NULL,
  `event_type` int NOT NULL,
  `published` smallint UNSIGNED NOT NULL DEFAULT '0',
  `event_time` datetime DEFAULT NULL,
  `publish_time` datetime DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `screen`
--

CREATE TABLE `screen` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `module_id` int NOT NULL,
  `action_url` varchar(255) NOT NULL,
  `menu_configurator` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `task_scheduler_log`
--

CREATE TABLE `task_scheduler_log` (
  `id` int NOT NULL,
  `started_at` datetime NOT NULL,
  `finished_at` datetime DEFAULT NULL,
  `command` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `input` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci COMMENT '(DC2Type:json)',
  `status` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unique_id`
--

CREATE TABLE `unique_id` (
  `id` int NOT NULL,
  `last_id` int UNSIGNED NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `field_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `user_role_id` int NOT NULL,
  `user_name` varchar(40) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `date_entered` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `modified_user_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `user_role_id`, `user_name`, `user_password`, `deleted`, `status`, `date_entered`, `date_modified`, `modified_user_id`, `created_by`) VALUES
(1, 1, 'admin', '$2y$12$S/lZjA2eXeiOuSdW1DtzbOLdB/6p.GKW8J/0L5cNT4l5aFEKCPOYO', 0, 1, '2023-03-31 18:22:30', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_auth_provider`
--

CREATE TABLE `user_auth_provider` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `provider_type` int NOT NULL,
  `ldap_user_hash` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `ldap_user_dn` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `ldap_user_unique_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `is_assignable` tinyint(1) DEFAULT '0',
  `is_predefined` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`id`, `name`, `display_name`, `is_assignable`, `is_predefined`) VALUES
(1, 'Admin', 'Admin', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_role_data_group`
--

CREATE TABLE `user_role_data_group` (
  `id` int NOT NULL,
  `user_role_id` int DEFAULT NULL,
  `data_group_id` int DEFAULT NULL,
  `can_read` tinyint DEFAULT NULL,
  `can_create` tinyint DEFAULT NULL,
  `can_update` tinyint DEFAULT NULL,
  `can_delete` tinyint DEFAULT NULL,
  `self` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `user_role_data_group`
--

INSERT INTO `user_role_data_group` (`id`, `user_role_id`, `data_group_id`, `can_read`, `can_create`, `can_update`, `can_delete`, `self`) VALUES
(1, 1, 1, 0, 0, 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_role_screen`
--

CREATE TABLE `user_role_screen` (
  `id` int NOT NULL,
  `user_role_id` int NOT NULL,
  `screen_id` int NOT NULL,
  `can_read` tinyint(1) NOT NULL DEFAULT '0',
  `can_create` tinyint(1) NOT NULL DEFAULT '0',
  `can_update` tinyint(1) NOT NULL DEFAULT '0',
  `can_delete` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `workflow_state_machine`
--

CREATE TABLE `workflow_state_machine` (
  `id` bigint NOT NULL,
  `workflow` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `resulting_state` varchar(255) NOT NULL,
  `roles_to_notify` text,
  `priority` int NOT NULL DEFAULT '0' COMMENT 'lowest priority 0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_permission`
--
ALTER TABLE `api_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_name` (`api_name`),
  ADD KEY `IDX_AE4B8278AFC2B591` (`module_id`),
  ADD KEY `IDX_AE4B8278348A109B` (`data_group_id`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `data_group`
--
ALTER TABLE `data_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `email`
--
ALTER TABLE `email`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `ohrm_email_name` (`name`);

--
-- Indexes for table `email_notification`
--
ALTER TABLE `email_notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_processor`
--
ALTER TABLE `email_processor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_id` (`email_id`);

--
-- Indexes for table `email_template`
--
ALTER TABLE `email_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_id` (`email_id`);

--
-- Indexes for table `group_field`
--
ALTER TABLE `group_field`
  ADD PRIMARY KEY (`group_field_id`);

--
-- Indexes for table `home_page`
--
ALTER TABLE `home_page`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_role_id` (`user_role_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mail_queue`
--
ALTER TABLE `mail_queue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_item`
--
ALTER TABLE `menu_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `screen_id` (`screen_id`);

--
-- Indexes for table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modules_default_page`
--
ALTER TABLE `modules_default_page`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_role_id` (`user_role_id`),
  ADD KEY `module_id` (`module_id`);

--
-- Indexes for table `registration_event_queue`
--
ALTER TABLE `registration_event_queue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `screen`
--
ALTER TABLE `screen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `module_id` (`module_id`);

--
-- Indexes for table `task_scheduler_log`
--
ALTER TABLE `task_scheduler_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `unique_id`
--
ALTER TABLE `unique_id`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `table_field` (`table_name`,`field_name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_role_id` (`user_role_id`),
  ADD KEY `modified_user_id` (`modified_user_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `user_auth_provider`
--
ALTER TABLE `user_auth_provider`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_role_name` (`name`);

--
-- Indexes for table `user_role_data_group`
--
ALTER TABLE `user_role_data_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_role_id` (`user_role_id`),
  ADD KEY `data_group_id` (`data_group_id`);

--
-- Indexes for table `user_role_screen`
--
ALTER TABLE `user_role_screen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_role_id` (`user_role_id`),
  ADD KEY `screen_id` (`screen_id`);

--
-- Indexes for table `workflow_state_machine`
--
ALTER TABLE `workflow_state_machine`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_permission`
--
ALTER TABLE `api_permission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `data_group`
--
ALTER TABLE `data_group`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `email`
--
ALTER TABLE `email`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_notification`
--
ALTER TABLE `email_notification`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_processor`
--
ALTER TABLE `email_processor`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_template`
--
ALTER TABLE `email_template`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `home_page`
--
ALTER TABLE `home_page`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mail_queue`
--
ALTER TABLE `mail_queue`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu_item`
--
ALTER TABLE `menu_item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `module`
--
ALTER TABLE `module`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `modules_default_page`
--
ALTER TABLE `modules_default_page`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registration_event_queue`
--
ALTER TABLE `registration_event_queue`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `screen`
--
ALTER TABLE `screen`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_scheduler_log`
--
ALTER TABLE `task_scheduler_log`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unique_id`
--
ALTER TABLE `unique_id`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_auth_provider`
--
ALTER TABLE `user_auth_provider`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_role_data_group`
--
ALTER TABLE `user_role_data_group`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_role_screen`
--
ALTER TABLE `user_role_screen`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `workflow_state_machine`
--
ALTER TABLE `workflow_state_machine`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_permission`
--
ALTER TABLE `api_permission`
  ADD CONSTRAINT `fk_ohrm_data_group_data_group_id` FOREIGN KEY (`data_group_id`) REFERENCES `data_group` (`id`),
  ADD CONSTRAINT `fk_ohrm_module_module_id` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`);

--
-- Constraints for table `email_processor`
--
ALTER TABLE `email_processor`
  ADD CONSTRAINT `email_processor_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `email` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_template`
--
ALTER TABLE `email_template`
  ADD CONSTRAINT `email_template_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `email` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `home_page`
--
ALTER TABLE `home_page`
  ADD CONSTRAINT `home_page_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_item`
--
ALTER TABLE `menu_item`
  ADD CONSTRAINT `menu_item_ibfk_1` FOREIGN KEY (`screen_id`) REFERENCES `screen` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `modules_default_page`
--
ALTER TABLE `modules_default_page`
  ADD CONSTRAINT `modules_default_page_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `modules_default_page_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `screen`
--
ALTER TABLE `screen`
  ADD CONSTRAINT `screen_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `user_auth_provider`
--
ALTER TABLE `user_auth_provider`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `user_role_data_group`
--
ALTER TABLE `user_role_data_group`
  ADD CONSTRAINT `user_role_data_group_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_role_data_group_ibfk_2` FOREIGN KEY (`data_group_id`) REFERENCES `data_group` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_role_screen`
--
ALTER TABLE `user_role_screen`
  ADD CONSTRAINT `user_role_screen_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_role_screen_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `screen` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
