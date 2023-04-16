Clink ChatGPT plugin is powered by SpringBoot application which does the following:
* Exposes API endpoints for callouts from ChatGPT
* Internal connectivity to ChatGPT to generate precise queries to data sources

Generated queries are based on responses from ChatGPT to prompts containing data schema and user inquiry.

Results contain retrieved data points serialized in tuples.

To run application locally, execute:
```
./gradlew run
```

The following endpoints will be available on `http://localhost:3333`:
* ChatGPT plugin manifest: http://localhost:3333/.well-known/ai-plugin.json
* OpenAPI spec for exposed API: http://localhost:3333/open-api.yaml