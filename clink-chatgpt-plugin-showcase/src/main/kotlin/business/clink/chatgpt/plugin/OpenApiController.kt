package business.clink.chatgpt.plugin

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class OpenApiController {
    @GetMapping("/open-api.yaml", produces = ["application/yaml"])
    @ResponseBody
    fun openApiYaml(): String {
        val ref = "\$ref"
        return """
openapi: 3.0.1
info:
  title: Data Insights Plugin
  description: Plugin for interpreting human language inquiries into a data warehouse queries.
  version: 'v1'
servers:
  - url: http://localhost:3333
paths:
  /dataShape:
    get:
      operationId: dataShape
      summary: Retrieve data schema used by the plugin
      requestBody:
        required: false
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/dataShapeResponse'
  /insights:
    post:
      operationId: insights
      summary: Retrieve data insights from request input
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/insightsRequest'
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/insightsResponse'
components:
  schemas:
    dataShapeResponse:
      type: object
      properties:
        value:
          type: string
          description: The schema of data storage.
    insightsRequest:
      type: object
      properties:
        query:
          type: string
          description: The list of data insights retrieved.
    insightsResponse:
      type: object
      properties:
        insights:
          type: array
          items:
            type: string
          description: The list of data insights retrieved.
        """.trimIndent()
    }
}