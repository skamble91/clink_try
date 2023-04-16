package business.clink.chatgpt.plugin

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.ClassPathResource
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import java.nio.file.Files

@Component
class DatabaseInitializer(@Autowired var jdbcTemplate: JdbcTemplate) {
    //@PostConstruct
    fun postConstruct() {
        jdbcTemplate.update("""
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
        """.trimIndent())

        val subscriptionsData = Files.readAllLines(ClassPathResource("subscriptions.csv", this.javaClass.classLoader).file.toPath())
        val subscriptionsColumns = subscriptionsData
            .subList(0, 1)
            .joinToString { it.split(",").joinToString(prefix = "(", postfix = ")") { v -> v } }
        val subscriptionsRows = subscriptionsData
            .subList(1, 2)
            .joinToString { it.split(",").joinToString(prefix = "(", postfix = ")") { v -> '"' + v + '"' } }
        jdbcTemplate.update("INSERT INTO `subscriptions` $subscriptionsColumns VALUES $subscriptionsRows")


        jdbcTemplate.update("""
            CREATE TABLE `visits` (
                `visit_id` varchar(36) NOT NULL,
                `account_id` varchar(36) NOT NULL,
                `date` DATE NOT NULL,
                `region` varchar(50) DEFAULT NULL,
                `channel` varchar(50) DEFAULT NULL,
                `landing_page` varchar(50) DEFAULT NULL,
                PRIMARY KEY (`visit_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
        """.trimIndent())

        val visitsData = Files.readAllLines(ClassPathResource("visits.csv", this.javaClass.classLoader).file.toPath())
        val visitsColumns = visitsData
            .subList(0, 1)
            .joinToString { it.split(",").joinToString(prefix = "(", postfix = ")") { v -> '`' + v + '`' } }
        val visitsRows = visitsData
            .subList(1, visitsData.size)
            .joinToString { it.split(",").joinToString(prefix = "(", postfix = ")") { v -> '"' + v + '"' } }
        jdbcTemplate.update("INSERT INTO `visits` $visitsColumns VALUES $visitsRows")
    }
}