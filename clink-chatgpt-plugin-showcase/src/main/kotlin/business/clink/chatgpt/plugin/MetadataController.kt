package business.clink.chatgpt.plugin

import org.springframework.http.MediaType
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class MetadataController {
    @GetMapping("/.well-known/ai-plugin.json", produces = [MediaType.APPLICATION_JSON_VALUE])
    @ResponseBody
    fun aiPluginJson(): String {
        return """
            {
                "schema_version": "v1",
                "name_for_human": "Clink",
                "name_for_model": "clink",
                "description_for_human": "Converting natural language inquiries into analytical data from underlying data storages.",
                "description_for_model": "Converting natural language inquiries into analytical data from underlying data storages.",
                "auth": {
                    "type": "none"
                },
                "api": {
                    "type": "openapi",
                    "url": "http://localhost:3333/open-api.yaml",
                    "is_user_authenticated": false
                },
                "logo_url": "https://static.tildacdn.com/tild6261-6236-4866-b132-383165633634/Clink.png",
                "contact_email": "info@clink.business",
                "legal_info_url": "https://clink.business/"
            }
        """.trimIndent()
    }
}
