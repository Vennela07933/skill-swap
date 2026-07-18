-- MySQL Database Script for Skill Swap Platform
-- Database name: skillswap

CREATE DATABASE IF NOT EXISTS `skillswap` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skillswap`;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL DEFAULT NULL,
  `location` VARCHAR(255) NULL DEFAULT NULL,
  `bio` TEXT NULL DEFAULT NULL,
  `profile_picture` VARCHAR(255) NULL DEFAULT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'USER',
  `skills_wanted` TEXT NULL DEFAULT NULL,
  `availability` VARCHAR(100) NULL DEFAULT NULL,
  `experience` VARCHAR(100) NULL DEFAULT NULL,
  `is_blocked` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `skills`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `skills`;
CREATE TABLE IF NOT EXISTS `skills` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `skill_name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `user_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_skills_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `exchange_requests`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `exchange_requests`;
CREATE TABLE IF NOT EXISTS `exchange_requests` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `sender_id` BIGINT NOT NULL,
  `receiver_id` BIGINT NOT NULL,
  `sender_skill_id` BIGINT NOT NULL,
  `receiver_skill_id` BIGINT NOT NULL,
  `message` TEXT NULL DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_requests_sender`
    FOREIGN KEY (`sender_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_requests_receiver`
    FOREIGN KEY (`receiver_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_requests_sender_skill`
    FOREIGN KEY (`sender_skill_id`)
    REFERENCES `skills` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_requests_receiver_skill`
    FOREIGN KEY (`receiver_skill_id`)
    REFERENCES `skills` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `notifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `user_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notifications_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `reviews`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `reviewer_id` BIGINT NOT NULL,
  `reviewee_id` BIGINT NOT NULL,
  `exchange_request_id` BIGINT NULL DEFAULT NULL,
  `rating` INT NOT NULL,
  `feedback` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_reviews_reviewer`
    FOREIGN KEY (`reviewer_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_reviewee`
    FOREIGN KEY (`reviewee_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_request`
    FOREIGN KEY (`exchange_request_id`)
    REFERENCES `exchange_requests` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Seed Sample Data (Password is BCrypt encrypted 'password123' for users, and 'admin123' for admin)
-- -----------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `location`, `bio`, `profile_picture`, `role`, `skills_wanted`, `availability`, `experience`, `is_blocked`, `created_at`, `updated_at`) VALUES
(1, 'Admin Controller', 'admin@skillswap.com', '$2a$10$w8T0tT8L98m.m1U6r4C4x.N6WwN3Oas65hR9p18/x9uI8d9vG4q3e', '9999999999', 'Global Staging', 'System administrator profile.', NULL, 'ADMIN', NULL, 'Flexible', 'Advanced', 0, NOW(), NOW()),
(2, 'John Doe', 'john@example.com', '$2a$10$1r2bU7.D3yG3eJsn2l51.OUB2e4v.x7a8b9c0d1e2f3g4h5i6j7k8', '1234567890', 'San Francisco, CA', 'Full-stack software developer looking to swap design and language skills.', NULL, 'USER', 'UI/UX, Spanish', 'Weekends', 'Intermediate', 0, NOW(), NOW()),
(3, 'Jane Smith', 'jane@example.com', '$2a$10$1r2bU7.D3yG3eJsn2l51.OUB2e4v.x7a8b9c0d1e2f3g4h5i6j7k8', '9876543210', 'Austin, TX', 'UI/UX Designer eager to pick up web development skills and French.', NULL, 'USER', 'Web Development, French', 'Weekdays', 'Advanced', 0, NOW(), NOW()),
(4, 'Carlos Gomez', 'carlos@example.com', '$2a$10$1r2bU7.D3yG3eJsn2l51.OUB2e4v.x7a8b9c0d1e2f3g4h5i6j7k8', '5554443322', 'Miami, FL', 'Native Spanish speaker looking to learn Data Science and Piano.', NULL, 'USER', 'Data Science, Music', 'Flexible', 'Intermediate', 0, NOW(), NOW());

INSERT INTO `skills` (`id`, `skill_name`, `description`, `category`, `level`, `user_id`, `created_at`) VALUES
(1, 'React & Node.js Dev', 'Proficient in building responsive SPAs using React.js and REST APIs in Node.', 'WEB_DEVELOPMENT', 'ADVANCED', 2, NOW()),
(2, 'Java Programming', 'Core Java, Collections, Multithreading, and Spring Boot.', 'PROGRAMMING', 'INTERMEDIATE', 2, NOW()),
(3, 'Figma UI Design', 'Creating wireframes, interactive prototypes, and custom UI asset export.', 'UI_UX', 'ADVANCED', 3, NOW()),
(4, 'Spanish Conversation', 'Native speaker willing to swap conversational skills.', 'LANGUAGE', 'ADVANCED', 4, NOW()),
(5, 'Python & NumPy', 'Data analysis, statistics, and machine learning basics.', 'DATA_SCIENCE', 'INTERMEDIATE', 4, NOW());

INSERT INTO `exchange_requests` (`id`, `sender_id`, `receiver_id`, `sender_skill_id`, `receiver_skill_id`, `message`, `status`, `created_at`) VALUES
(1, 2, 3, 1, 3, 'Hey Jane! I saw you are looking for Web Development. I can teach you React in exchange for some Figma design tips.', 'ACCEPTED', NOW()),
(2, 4, 2, 4, 2, 'Hi John! I can help you with Spanish conversation in barter for Java coding guidance.', 'PENDING', NOW());

INSERT INTO `notifications` (`id`, `message`, `is_read`, `user_id`, `created_at`) VALUES
(1, 'New exchange request received from Carlos Gomez for skill: Java Programming', 0, 2, NOW()),
(2, 'Your swap request has been accepted by Jane Smith', 0, 2, NOW());

INSERT INTO `reviews` (`id`, `reviewer_id`, `reviewee_id`, `exchange_request_id`, `rating`, `feedback`, `created_at`) VALUES
(1, 3, 2, 1, 5, 'John was an excellent teacher. He explained React states and props clearly. Highly recommend swapping with him!', NOW());
