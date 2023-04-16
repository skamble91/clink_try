-- Navigate to this folder: `cd {root}/chatgpt-plugin/src/main/resources`
-- Fetch file subscriptions.csv from https://data.world/cameronawilson/lucid/workspace/file?filename=subscriptions.csv
-- Fetch file visits.csv from https://data.world/cameronawilson/lucid/workspace/file?filename=visits.csv
-- Execute `mysql -u root < schema.sql`

CREATE DATABASE IF NOT EXISTS clink_chatgpt_plugin_showcase;

USE clink_chatgpt_plugin_showcase;

DROP TABLE IF EXISTS `subscriptions`;

CREATE TABLE `subscriptions` (
    `subscription_id` varchar(36) NOT NULL,
    `account_id` varchar(36) NOT NULL,
    `subscription_start_date` DATE NULL,
    `subscription_end_date` DATE NULL,
    `trial_start_date` DATE NULL,
    `trial_end_date` DATE NULL,
    `revenue` FLOAT NULL,
    PRIMARY KEY (`subscription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE INDEX `subscriptions_acc_idx` ON `subscriptions` (`account_id`);

DROP TABLE IF EXISTS `visits`;

CREATE TABLE `visits` (
    `visit_id` varchar(36) NOT NULL,
    `account_id` varchar(36) NOT NULL,
    `date` DATE NOT NULL,
    `region` varchar(50) DEFAULT NULL,
    `channel` varchar(50) DEFAULT NULL,
    `landing_page` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE INDEX `visits_acc_idx` ON `visits` (`account_id`);
CREATE INDEX `visits_date_idx` ON `visits` (`date`);
CREATE INDEX `visits_channel_idx` ON `visits` (`channel`);

LOAD DATA LOCAL INFILE 'subscriptions.csv'
INTO TABLE `subscriptions`
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'visits.csv'
INTO TABLE `visits`
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
