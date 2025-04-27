package wichat

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class LoginAndNav extends Simulation {

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
  
  private val headers_3 = Map(
  		"If-None-Match" -> """W/"2653-tUg7FtDt9fV3I6CSMzsLLnuLsEs"""",
  		"Priority" -> "u=0"
  )


  private val scn = scenario("LoginAndNav")
    .exec(
      http("request_0")
        .options("/api/login")
        .headers(headers_0)
        .resources(
          http("request_1")
            .post("/api/login")
            .headers(headers_1)
            .body(RawFileBody("wichat/loginandnav/0001_request.json")),
          http("request_2")
            .get("/api/ranking")
            .headers(headers_2)
        ),
      pause(1),
      http("request_3")
        .get("/api/ranking")
        .headers(headers_3),
      pause(2),
      http("request_4")
        .get("/api/ranking")
        .headers(headers_2),
      pause(2),
      http("request_5")
        .get("/api/ranking")
        .headers(headers_2),
      pause(5),
      http("request_6")
        .get("/api/ranking")
        .headers(headers_3),
      pause(1),
      http("request_7")
        .get("/api/ranking")
        .headers(headers_2)
    )

	setUp(scn.inject(atOnceUsers(1))).protocols(httpProtocol)
}
