package business.clink.chatgpt.plugin

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

data class OpenAIRequest(val model: String, val prompt: String, val max_tokens: Int, val temperature: Double)

data class OpenAIChoice(val index: Int, val text: String)

data class OpenAIResponse(val choices: List<OpenAIChoice>) {
    fun extractSelect(): String {
        return if (choices.isEmpty()) {
            ""
        } else {
            val rawSqlQuery = choices[0].text
            rawSqlQuery.substring(rawSqlQuery.indexOf("SELECT"))
        }
    }
}

@FeignClient("OpenAI")
interface OpenAIClient {
    @PostMapping("/v1/completions", consumes = ["application/json"])
    fun completions(@RequestBody body: OpenAIRequest): OpenAIResponse
}
