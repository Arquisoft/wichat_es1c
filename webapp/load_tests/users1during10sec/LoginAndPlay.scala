package wichat

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class LoginAndPlay extends Simulation {

  private val httpProtocol = http
    .baseUrl("http://localhost:8000")
    .inferHtmlResources()
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .originHeader("http://localhost:3000")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0")
  
  private val headers_0 = Map(
  		"Accept" -> "*/*",
  		"Access-Control-Request-Headers" -> "content-type",
  		"Access-Control-Request-Method" -> "POST",
  		"Priority" -> "u=4"
  )
  
  private val headers_1 = Map(
  		"Content-Type" -> "application/json",
  		"Priority" -> "u=0"
  )
  
  private val headers_2 = Map("If-None-Match" -> """W/"2653-tUg7FtDt9fV3I6CSMzsLLnuLsEs"""")
  
  private val headers_3 = Map("Priority" -> "u=0")


  private val scn = scenario("LoginAndPlay")
    .exec(
      http("request_0")
        .options("/api/login")
        .headers(headers_0)
        .resources(
          http("request_1")
            .post("/api/login")
            .headers(headers_1)
            .body(RawFileBody("wichat/loginandplay/0001_request.json")),
          http("request_2")
            .get("/api/ranking")
            .headers(headers_2)
        ),
      pause(2),
      http("request_3")
        .get("/api/generate-questions?type=Geograf%C3%ADa")
        .headers(headers_3),
      pause(5),
      http("request_4")
        .get("/api/ranking")
        .headers(headers_2)
    )

	setUp(scn.inject(constantUsersPerSec(1).during(10))).protocols(httpProtocol)
}
