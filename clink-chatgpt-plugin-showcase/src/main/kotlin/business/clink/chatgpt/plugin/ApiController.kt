package business.clink.chatgpt.plugin

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import feign.Feign
import feign.jackson.JacksonDecoder
import feign.jackson.JacksonEncoder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.openfeign.support.SpringMvcContract
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseBody

data class DataShapeApiResponse(val value: String)

data class InsightsApiRequest(val query: String)

data class InsightsApiResponse(val insights: List<String>, val errors: List<String>)

@Controller
class InsightsController(@Autowired var jdbcTemplate: JdbcTemplate) {

    private final val objectMapper = ObjectMapper()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        .registerKotlinModule()

    private final val openAiClient = Feign.builder()
        .contract(SpringMvcContract())
        .decoder(JacksonDecoder(objectMapper))
        .encoder(JacksonEncoder(objectMapper))
        .requestInterceptor { template ->
            template.header(
                HttpHeaders.AUTHORIZATION,
                "Bearer " + System.getenv("OPEN_AI_API_KEY")
            )
        }
        .target(OpenAIClient::class.java, "https://api.openai.com");

    @GetMapping("/dataShape", produces = [MediaType.APPLICATION_JSON_VALUE])
    @ResponseBody
    fun dataShape(): DataShapeApiResponse {
        return DataShapeApiResponse("The following data schema is used by the plugin: ${tableDefinitions()}.")
    }

    @PostMapping("/insights", consumes = [MediaType.APPLICATION_JSON_VALUE], produces = [MediaType.APPLICATION_JSON_VALUE])
    @ResponseBody
    fun insights(@RequestBody body: InsightsApiRequest): InsightsApiResponse {
        if (body.query.isBlank()) {
            return error("No query was received.")
        }

        val sqlQuery = openAiClient.completions(OpenAIRequest(
            "text-davinci-003",
            """The following is a set of MySQL tables: 

${tableDefinitions() }}

Using these table definitions, please generate and show only an MySQL query with tables aliases to """.trimIndent() + body.query,
            2000,
            0.7
        )).extractSelect()


        val sqlResults = jdbcTemplate.query(sqlQuery) { rs, _ ->
            run {
                (1..rs.metaData.columnCount)
                    .joinToString(prefix = "(", postfix = ")") { rs.getString(it).orEmpty() }
            }
        }

        if (sqlResults.isEmpty()) {
            return error("No results were found, please try use different time frame or rephrase using more precise terms.")
        }

        return success("Using Wolfram please plot a bar chart for the following data points: ${sqlResults.joinToString(prefix = "[", postfix = "]")}.")
    }

    private fun tableDefinitions(): String {
        val tableNames = jdbcTemplate.query("SHOW TABLES") { rs, _ -> rs.getString(1).orEmpty() }

        val tableDefinitions = tableNames.map {
            jdbcTemplate.query("SHOW CREATE TABLE $it") { rs, _ ->
                rs.getString(2).orEmpty()
            }
        }

        return tableDefinitions.joinToString(separator = "\n\n")
    }

    private fun success(insightMessage: String): InsightsApiResponse {
        return InsightsApiResponse(
            listOf(insightMessage),
            listOf()
        )
    }

    private fun error(errorMessage: String): InsightsApiResponse {
        return InsightsApiResponse(
            listOf(),
            listOf(errorMessage)
        )
    }
}