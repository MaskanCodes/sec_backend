CREATE DATABASE `shareecare_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE `sec_configurations` (
  `config_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `configurations` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_roles` (
  `role_ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_review_types` (
  `review_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `review_name` VARCHAR(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_countries` (
  `country_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `country_name` VARCHAR(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_states` (
  `state_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `country_id` INT NOT NULL,
  `state_name` VARCHAR(50) NOT NULL,
  `country_code` VARCHAR(5) NOT NULL,
  CONSTRAINT `states_country_id` 
    FOREIGN KEY (`country_id`) 
    REFERENCES `sec_countries` (`country_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_cities` (
  `city_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `state_id` INT NOT NULL,
  `city_code` VARCHAR(5) NOT NULL,
  `city_name` VARCHAR(50) NOT NULL,
  CONSTRAINT `cities_state_id` 
    FOREIGN KEY (`state_id`) 
    REFERENCES `sec_states` (`state_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_hcf_categories` (
  `hcf_category_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `hcf_category` VARCHAR(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sec_users` (
  `suid` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `first_name` VARCHAR(100) DEFAULT NULL,
  `last_name` VARCHAR(100) DEFAULT NULL,
  `middle_name` VARCHAR(100) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `can_login` tinyint DEFAULT 1,
  `is_active` tinyint DEFAULT 1,
  `is_approved` tinyint DEFAULT 1,
  `free_trial_expiration` DATETIME DEFAULT NULL,
  `approved_by` INT DEFAULT NULL,
  `email` VARCHAR(200) DEFAULT NULL,
  `dialing_code` INT DEFAULT NULL,
  `contact_no_primary` VARCHAR(20) NOT NULL,
  `contact_no_secondary` VARCHAR(20) DEFAULT NULL,
  `added_by` VARCHAR(250) DEFAULT NULL,
  `gender` VARCHAR(12) DEFAULT NULL,
  `DOB` VARCHAR(30) DEFAULT NULL,
  `country_id` INT DEFAULT NULL,
  `state_id` INT DEFAULT NULL,
  `city_id` INT DEFAULT NULL,
  `street_address1` VARCHAR(150) DEFAULT NULL,
  `street_address2` VARCHAR(150) DEFAULT NULL,
  `zip_code` VARCHAR(15) DEFAULT NULL,
  `home_no` VARCHAR(20) DEFAULT NULL,
  `location` TEXT DEFAULT NULL,
  `profile_picture` longtext DEFAULT NULL,
  `access_token` VARCHAR(255) DEFAULT NULL,
  `access_token_generated_on` DATETIME DEFAULT NULL,
  `access_token_expires_on` DATETIME DEFAULT NULL,
  `registration_type` VARCHAR(10) DEFAULT NULL,
  `registered_via` VARCHAR(10) DEFAULT NULL,
  `last_login` DATETIME DEFAULT NULL,
  `last_active` DATETIME DEFAULT NULL,
  `force_logout` tinyint DEFAULT 1,
  `tokens` longtext DEFAULT NULL,
  `registered_device` VARCHAR(5) DEFAULT "web",
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `contact_no_primary_UNIQUE` (`contact_no_primary`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `role_id_idx` (`role_id`),
  CONSTRAINT `role_id` 
    FOREIGN KEY (`role_id`) 
    REFERENCES `sec_roles` (`role_ID`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sec_departments` (
  `department_id` int NOT NULL PRIMARY KEY,
  `department_name` varchar(50) DEFAULT NULL,
  `added_by` int DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `department_added_by` 
    FOREIGN KEY (`added_by`) 
    REFERENCES `sec_users` (`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sec_hcf_exam` (
  `exam_id` int NOT NULL PRIMARY KEY,
  `exam_name` varchar(255) DEFAULT NULL,
  `hcf_id` int DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `hcf_exam_created_by` 
    FOREIGN KEY (`hcf_id`) 
    REFERENCES `sec_users` (`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sec_hcf_sub_exam` (
  `sub_exam_id` int NOT NULL PRIMARY KEY,
  `exam_id` int NOT NULL,
  `sub_exam_name` varchar(255) DEFAULT NULL,
  `hcf_id` int DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `hcf_sub_exam_created_by` 
    FOREIGN KEY (`hcf_id`) 
    REFERENCES `sec_users` (`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_user_codes` (
  `code_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` int DEFAULT NULL,
  `otp_code` varchar(15) DEFAULT NULL,
  `otp_code_generated_on` DATETIME DEFAULT NULL,
  `activation_code` varchar(15) DEFAULT NULL,
  `activation_code_generated_on` DATETIME DEFAULT NULL,
  `no_of_email_tries` INT NOT NULL DEFAULT 0,
  `no_of_mobile_tries` INT NOT NULL DEFAULT 0,
  `is_expired` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `user_code_user_id` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `sec_users` (`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

i want to alter these fields in mysql database 

CREATE TABLE `sec_doctors_details` (
  `doctor_details_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `qualification` varchar(45) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `qualified_year` int DEFAULT NULL,
  `reg_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `speciality_id` int DEFAULT NULL,
  `state_med_council_id` INT DEFAULT NULL,
  `state_reg_number` INT DEFAULT NULL,
  `country_reg_number` INT DEFAULT NULL,
  `university_name` varchar(45) DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `approved` tinyint DEFAULT NULL,
  UNIQUE KEY `state_regnumber_UNIQUE` (`state_reg_number`),
  KEY `doctor_id_idx` (`doctor_id`),
  CONSTRAINT `doctor_id` 
    FOREIGN KEY (`doctor_id`) 
    REFERENCES `sec_users` (`suid`),
  CONSTRAINT `state_med_council_id` 
    FOREIGN KEY (`state_med_council_id`) 
    REFERENCES `sec_states` (`state_id`),
  CONSTRAINT `doctor_speciality_id` 
    FOREIGN KEY (`speciality_id`) 
    REFERENCES `sec_departments` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  


CREATE TABLE `sec_doctors_details` (
  `doctor_details_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `qualification` varchar(45) DEFAULT NULL,
  `degree` varchar(30) DEFAULT NULL,
  `state_reg_date` DATETIME NOT NULL DEFAULT ,
  `country_reg_date` DATETIME NOT NULL DEFAULT ,
  `job` varchar(30) DEFAULT NULL,
  `hospital_org`  varchar(30) DEFAULT NULL,
  `start_date` DATETIME NOT NULL DEFAULT ,
  `lic_title` TEXT DEFAULT NULL,
  `lic_certificate_no` varchar(30) DEFAULT NULL,
  `lic_issuedby` varchar(30) DEFAULT NULL,
  `lic_date` DATETIME NOT NULL DEFAULT ,
  `lic_description` TEXT DEFAULT NULL,
  `award_title` TEXT DEFAULT NULL,
  `award_issuedby` varchar(30) DEFAULT NULL,
  `award_date` DATETIME NOT NULL DEFAULT ,
  `award_description` TEXT DEFAULT NULL,
  `qualified_year` int DEFAULT NULL,
  `reg_date` DATETIME NOT NULL DEFAULT,
  `speciality_id` int DEFAULT NULL,
  `state_med_council_id` INT DEFAULT NULL,
  `state_reg_number` INT DEFAULT NULL,
  `country_reg_number` INT DEFAULT NULL,
  `university_name` varchar(45) DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `approved` tinyint DEFAULT NULL,
  UNIQUE KEY `state_regnumber_UNIQUE` (`state_reg_number`),
  KEY `doctor_id_idx` (`doctor_id`),
  CONSTRAINT `doctor_id` 
    FOREIGN KEY (`doctor_id`) 
    REFERENCES `sec_users` (`suid`),
  CONSTRAINT `state_med_council_id` 
    FOREIGN KEY (`state_med_council_id`) 
    REFERENCES `sec_states` (`state_id`),
  CONSTRAINT `doctor_speciality_id` 
    FOREIGN KEY (`speciality_id`) 
    REFERENCES `sec_departments` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `sec_doc_listing_details` (
  `doctor_listing_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `doctor_id` int DEFAULT NULL,
  `listing_name` varchar(45) DEFAULT NULL,
  `working_days` DATETIME DEFAULT NULL,
  `working_time` DATETIME DEFAULT NULL,
  `about` TEXT DEFAULT NULL,
  KEY `doctor_id_idx` (`doctor_id`),
  CONSTRAINT `fk_doc_listing_doctor_id`  -- Use a unique name here
    FOREIGN KEY (`doctor_id`)
    REFERENCES `sec_users` (`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `sec_hcf_details` (
  `hcf_details_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_id` int NOT NULL,
  `hcf_name` varchar(255) DEFAULT NULL,
  `reg_no` varchar(100) DEFAULT NULL,
  `service_day_from` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `service_day_to` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `service_offer` varchar(50) DEFAULT NULL,
  `country_id` INT DEFAULT NULL,
  `state_id` INT DEFAULT NULL,
  `city_id` INT DEFAULT NULL,
  `street_address1` VARCHAR(150) DEFAULT NULL,
  `street_address2` VARCHAR(150) DEFAULT NULL,
  `zip_code` VARCHAR(15) DEFAULT NULL,
  `location` TEXT DEFAULT NULL,

  `city` varchar(60) DEFAULT NULL,
  `company_name`TEXT DEFAULT NULL,
  `business_name`TEXT DEFAULT NULL,
  `working_hours` varchar(50) DEFAULT NULL,
  `doing_business` TEXT DEFAULT NULL,
  `facilities` TEXT DEFAULT NULL,
  `reg_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `license_no` varchar(45) DEFAULT NULL,
  `fax_no` varchar(45) DEFAULT NULL,
  `office_no` varchar(45) DEFAULT NULL,
  `terms_and_condition` varchar(50) DEFAULT NULL,
  `university_name` varchar(45) DEFAULT NULL,
  `hcf_id` int DEFAULT NULL,
  `approved` tinyint DEFAULT NULL,
  KEY `hcf_id_idx` (`hcf_id`),
  CONSTRAINT `hcf_id` 
    FOREIGN KEY (`hcf_id`) 
    REFERENCES `sec_users` (`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CREATE TABLE `sec_hcf_details` (
--   `hcf_details_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
--   `category_id` int NOT NULL,
--   `hcf_name` varchar(255) DEFAULT NULL,
 
--   `working_hours` varchar(50) DEFAULT NULL,
--   `doing_business` TEXT DEFAULT NULL,
--   `facilities` TEXT DEFAULT NULL,
--   `reg_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `license_no` varchar(45) DEFAULT NULL,
--   `fax_no` varchar(45) DEFAULT NULL,
--   `office_no` varchar(45) DEFAULT NULL,
--   `terms_and_condition` varchar(50) DEFAULT NULL,
--   `university_name` varchar(45) DEFAULT NULL,
--   `hcf_id` int DEFAULT NULL,
--   `approved` tinyint DEFAULT NULL,
--   KEY `hcf_id_idx` (`hcf_id`),
--   CONSTRAINT `hcf_id` 
--     FOREIGN KEY (`hcf_id`) 
--     REFERENCES `sec_users` (`suid`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_user_devices` (
  `user_id` int NOT NULL,
  `device_type` varchar(20) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `allow_notification` tinyint DEFAULT 1,
  `device_data` varchar(100) DEFAULT NULL,
  `activated_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `device_id_UNIQUE` (`device_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_user_notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `to` varchar(30) DEFAULT "Admin",
  `type` varchar(30) DEFAULT NULL,
  `status` tinyint DEFAULT 1,
  `read_by` int NOT NULL,
  `parameters` JSON DEFAULT NULL,
  `read_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `notification_user_id_idx` (`user_id`),
  CONSTRAINT `notification_user_id` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_banking_details` (
  `bank_details_id` int NOT NULL AUTO_INCREMENT,
  `account_number` int DEFAULT NULL,
  `bank_name` varchar(45) DEFAULT NULL,
  `ifsc_code` varchar(45) DEFAULT NULL,
  `branch` varchar(45) DEFAULT NULL,
  `branch_city_id` int DEFAULT NULL,
  `branch_state_id` int DEFAULT NULL,
  `branch_email` varchar(45) DEFAULT NULL,
  `branch_phone` varchar(45) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`bank_details_id`),
  UNIQUE KEY `account_number_UNIQUE` (`bank_name`,`account_number`),
  KEY `bank_uid_idx` (`user_id`),
  CONSTRAINT `bank_uid` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CREATE TABLE `sec_card_details` (
--   `card_details_id` int NOT NULL AUTO_INCREMENT,
--   `card_no` varchar(45) DEFAULT NULL,
--   `bank_name` varchar(45) DEFAULT NULL,
--   `exp_month` varchar(10) DEFAULT NULL,
--   `exp_year` int DEFAULT NULL,
--   `user_id` int DEFAULT NULL,
--   `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`card_details_id`),
--   KEY `card_user_id_idx` (`user_id`),
--   CONSTRAINT `card_user_id` 
--     FOREIGN KEY (`user_id`) 
--     REFERENCES `sec_users` (`suid`)
--     ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_subscription_plans` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `plan_description` varchar(500) NOT NULL,
  `plan_fee` int DEFAULT 0,
  `plan_name` varchar(45) DEFAULT NULL,
  `plan_duration` varchar(45) DEFAULT NULL,
  `start_date` varchar(45) DEFAULT NULL,
  `end_date` varchar(45) DEFAULT NULL,
  `is_active` tinyint DEFAULT 0,
  `is_trial` tinyint DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subscription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


  CREATE TABLE `sec_doc_fee_plans` (
    `doc_fee_plan_id` int NOT NULL AUTO_INCREMENT,
    `doctor_id` int NOT NULL,
    `msg_active` varchar(15) NOT NULL,
    `msg_price` int DEFAULT 0,
    `msg_duration` ENUM("30 ", "60", "both"),
    `voice_active` varchar(15) NOT NULL,
    `voice_price` int DEFAULT 0,
    `voice_duration` ENUM("30 ", "60", "both"),
    `video_active` varchar(15) NOT NULL,
    `video_price` int DEFAULT 0,
    `video_duration` ENUM("30 ", "60", "both"),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`doc_fee_plan_id`),
    UNIQUE KEY `doctor_id_UNIQUE` (`doctor_id`),
    KEY `doctor_id_plan_idx` (`doctor_id`),
    CONSTRAINT `doctor_id_plan`
      FOREIGN KEY (`doctor_id`)
      REFERENCES `sec_users` (`suid`)
      ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sec_doctor_fee_plans` (
  `doctor_fee_plan_id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `plan_description` varchar(500) NOT NULL,
  `plan_fee` int DEFAULT 0,
  `plan_name` varchar(45) DEFAULT NULL,
  `plan_duration` varchar(45) DEFAULT NULL,
  `start_date` varchar(45) DEFAULT NULL,
  `end_date` varchar(45) DEFAULT NULL,
  `is_active` tinyint DEFAULT 0,
  `is_trial` tinyint DEFAULT 1,
  `no_of_reviews` tinyint DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`doctor_fee_plan_id`),
  UNIQUE KEY `doctor_id_UNIQUE` (`doctor_id`),
  UNIQUE KEY `plan_name_UNIQUE` (`plan_name`),
  KEY `doctor_id_plan_idx` (`doctor_id`),
  CONSTRAINT `doctor_id_plan`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_transactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `doctor_fee_plan_id` int NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('created', 'authorized', 'processed', 'failed') NOT NULL DEFAULT 'created',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `doctor_fee_plan_id` 
    FOREIGN KEY (`doctor_fee_plan_id`) 
    REFERENCES `sec_doctor_fee_plans` (`doctor_fee_plan_id`)
    ON DELETE CASCADE,
  CONSTRAINT `transaction_user_id` 
    FOREIGN KEY (`user_id`)
    REFERENCES `sec_users` (`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sec_patient_plans` (
  `plan_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `patient_id` int NOT NULL,
  `doctor_fee_plan_id` int NOT NULL,
  `plan_description` varchar(500) DEFAULT NULL,
  `plan_fee` int DEFAULT NULL,
  `is_plan_started` tinyint DEFAULT 1,
  `plan_name` varchar(45) DEFAULT NULL,
  `plan_duration` varchar(45) DEFAULT NULL,
  `start_date` varchar(45) DEFAULT NULL,
  `end_date` varchar(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `plan_name_UNIQUE` (`plan_name`),
  CONSTRAINT `fk_doctor_fee_plan_id` 
    FOREIGN KEY (`doctor_fee_plan_id`) 
    REFERENCES `sec_doctor_fee_plans` (`doctor_fee_plan_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fee_plan_patient_id` 
    FOREIGN KEY (`patient_id`) 
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_patient_doctor_conversation` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` int NOT NULL,
  `conversation_name` varchar(200) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `conversation_id_UNIQUE` (`conversation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_conversation_members` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `member_user_id` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE,
  CONSTRAINT `member_conversation_id` 
    FOREIGN KEY (`conversation_id`) 
    REFERENCES `sec_patient_doctor_conversation` (`conversation_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_conversation_messages` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` TEXT DEFAULT NULL,
  `sent_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` DATETIME,
  `delivered_at` DATETIME,
  `status` ENUM('sent', 'delivered', 'read') NOT NULL DEFAULT 'sent',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `message_sender_id` 
    FOREIGN KEY (`sender_id`) 
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE,
  CONSTRAINT `message_receiver_id` 
    FOREIGN KEY (`receiver_id`) 
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE,
  CONSTRAINT `message_conversation_id` 
    FOREIGN KEY (`conversation_id`) 
    REFERENCES `sec_patient_doctor_conversation` (`conversation_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_connections` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` int NOT NULL,
  `connection_id` VARCHAR(100) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `domain_name` VARCHAR(20) NOT NULL,
  `api_gateway_domain` VARCHAR(50) NOT NULL,
  `connect_source` VARCHAR(10) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `connection_user_id` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `sec_users` (`suid`)
    ON DELETE CASCADE,
  CONSTRAINT `connection_role_id` 
    FOREIGN KEY (`role_id`) 
    REFERENCES `sec_roles` (`role_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `appointment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `patient_id` INT NOT NULL,
  `minor_name` TEXT DEFAULT NULL,
  `minor_gender` ENUM("male", "female", "others"),
  `minor_age` INT NOT NULL,
  `minor_reports` VARCHAR(100) DEFAULT NULL,
  `patient_report` VARCHAR(100) DEFAULT NULL,
  `answer_1` TEXT DEFAULT NULL,
  `answer_2` TEXT DEFAULT NULL,
  `answer_3` TEXT DEFAULT NULL,
  `answer_4` TEXT DEFAULT NULL,
  `answer_5` TEXT DEFAULT NULL,
  `duration` ENUM("30 minutes", "60 minutes"),
  `subscription_id` INT NOT NULL,
  `transaction_id` VARCHAR(100) DEFAULT NULL,
  `problem` TEXT DEFAULT NULL,
  `doctor_id` INT NOT NULL,
  `symptoms` TEXT DEFAULT NULL,
  `attachments` TEXT DEFAULT NULL,
  `status` ENUM("booked", "rescheduled", "in_progress", "completed", "next_review", "cancelled"),
  `reason` TEXT DEFAULT NULL,
  `next_review_date` DATETIME DEFAULT NULL,
  `action_done_by` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `appointment_subscription_id` 
    FOREIGN KEY (`subscription_id`) 
    REFERENCES `sec_users`(`suid`), 
    CONSTRAINT `appointment_patient_id` 
    FOREIGN KEY (`patient_id`) 
    REFERENCES `sec_users`(`suid`),
  CONSTRAINT `appointment_doctor_id` 
    FOREIGN KEY (`doctor_id`) 
    REFERENCES `sec_users`(`suid`),
  CONSTRAINT `appointment_action_done_by` 
    FOREIGN KEY (`action_done_by`) 
    REFERENCES `sec_users`(`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- ALTER TABLE `sec_appointments`
-- ADD COLUMN `minor_name` TEXT DEFAULT NULL,
-- ADD COLUMN `minor_gender` ENUM("male", "female", "others"),
-- ADD COLUMN `minor_age` INT NOT NULL,
-- ADD COLUMN `minor_reports` VARCHAR(100) DEFAULT NULL,
-- ADD COLUMN `patient_report` VARCHAR(100) DEFAULT NULL,
-- ADD COLUMN `answer_1` TEXT DEFAULT NULL,
-- ADD COLUMN `answer_2` TEXT DEFAULT NULL,
-- ADD COLUMN `answer_3` TEXT DEFAULT NULL,
-- ADD COLUMN `answer_4` TEXT DEFAULT NULL,
-- ADD COLUMN `answer_5` TEXT DEFAULT NULL,
-- ADD COLUMN `duration` ENUM("30 minutes", "60 minutes"),
-- ADD COLUMN `subscription_id` INT NOT NULL,
-- ADD COLUMN `transaction_id` VARCHAR(100) DEFAULT NULL,
-- ADD COLUMN `problem` TEXT DEFAULT NULL;



CREATE TABLE `sec_doctor_notes` (
    `notes_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `doctor_id` INT NOT NULL,
    `description` TEXT DEFAULT NULL,
    `appointment_id` INT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `notes_patient_id` 
        FOREIGN KEY (`patient_id`) 
        REFERENCES `sec_users`(`suid`),
    CONSTRAINT `notes_doctor_id` 
        FOREIGN KEY (`doctor_id`) 
        REFERENCES `sec_users`(`suid`),
    CONSTRAINT `notes_appointment_id` 
        FOREIGN KEY (`appointment_id`) 
        REFERENCES `sec_appointments`(`appointment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_reviews` (
    `user_review_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `from_id` INT NOT NULL,
    `to_id` INT NOT NULL,
    `description` TEXT DEFAULT NULL,
    `review_type` INT DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `reviews_from_id` 
        FOREIGN KEY (`from_id`) 
        REFERENCES `sec_users`(`suid`),
    CONSTRAINT `reviews_to_id` 
        FOREIGN KEY (`to_id`) 
        REFERENCES `sec_users`(`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_tests` (
    `test_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `doctor_id` INT NOT NULL,
    `special_instructions` TEXT DEFAULT NULL,
    `test_files` VARCHAR(100) NOT NULL,
    `hcf_id` INT DEFAULT NULL,
    `exam_id` INT DEFAULT NULL,
    `sub_exam_id` INT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `tests_patient_id` 
        FOREIGN KEY (`patient_id`) 
        REFERENCES `sec_users`(`suid`),
    CONSTRAINT `tests_doctor_id` 
        FOREIGN KEY (`doctor_id`) 
        REFERENCES `sec_users`(`suid`),
    CONSTRAINT `tests_hcf_id` 
        FOREIGN KEY (`hcf_id`) 
        REFERENCES `sec_users`(`suid`),
    CONSTRAINT `tests_exam_id` 
        FOREIGN KEY (`exam_id`) 
        REFERENCES `sec_hcf_exam`(`exam_id`),
    CONSTRAINT `tests_sub_exam_id` 
        FOREIGN KEY (`sub_exam_id`) 
        REFERENCES `sec_hcf_sub_exam`(`sub_exam_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_reports` (
    `report_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `test_id` INT NOT NULL,
    `report_path` VARCHAR(100) NOT NULL,
    `approved_by` INT DEFAULT NULL,
    `is_approved` INT DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `reports_test_id` 
        FOREIGN KEY (`test_id`) 
        REFERENCES `sec_tests`(`test_id`)    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_reports_shared` (
    `report_shared_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `test_id` INT NOT NULL,
    `report_id` INT NOT NULL,
    `shared_with` INT DEFAULT NULL,
    `shared_by` INT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `reports_shared_report_id` 
        FOREIGN KEY (`report_id`) 
        REFERENCES `sec_reports`(`report_id`),
    CONSTRAINT `reports_shared_test_id` 
        FOREIGN KEY (`test_id`) 
        REFERENCES `sec_tests`(`test_id`),
    CONSTRAINT `reports_shared_shared_with` 
        FOREIGN KEY (`shared_with`) 
        REFERENCES `sec_users`(`suid`),
    CONSTRAINT `reports_shared_shared_by` 
        FOREIGN KEY (`shared_by`) 
        REFERENCES `sec_users`(`suid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sec_user_events` (
    `event_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `event_name` VARCHAR(100) DEFAULT NULL,
    `event_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `event_source` VARCHAR(100) DEFAULT NULL,
    `resource_type` VARCHAR(100) DEFAULT NULL,
    `access_role` INT NOT NULL,
    `time_spent` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `events_user_id` 
        FOREIGN KEY (`user_id`) 
        REFERENCES `sec_users`(`suid`),
    CONSTRAINT `events_access_role` 
        FOREIGN KEY (`access_role`) 
        REFERENCES `sec_roles` (`role_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
