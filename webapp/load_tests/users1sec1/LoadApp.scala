package wichat

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class LoadApp extends Simulation {

  private val httpProtocol = http
    .baseUrl("http://localhost:3000")
    .proxy(Proxy("localhost", 3000))
    .inferHtmlResources()
    .acceptHeader("image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0")
  
  private val headers_0 = Map(
  		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  		"If-None-Match" -> """W/"6dc-sVUZktIsebvSXRl+xECe6ONpUhM"""",
  		"Priority" -> "u=0, i",
  		"Upgrade-Insecure-Requests" -> "1"
  )
  
  private val headers_1 = Map(
  		"Accept" -> "*/*",
  		"If-None-Match" -> """W/"6e5af0-xRT6FsGC8PhhrnwvWAp3H8H3D3c""""
  )
  
  private val headers_2 = Map(
  		"If-Modified-Since" -> "Mon, 07 Apr 2025 16:51:24 GMT",
  		"If-None-Match" -> """W/"1fc7f-1961129f51f"""",
  		"Priority" -> "u=5"
  )
  
  private val headers_3 = Map(
  		"If-Modified-Since" -> "Mon, 07 Apr 2025 16:51:24 GMT",
  		"If-None-Match" -> """W/"66e8c-1961129f51a"""",
  		"Priority" -> "u=5"
  )


  private val scn = scenario("LoadApp")
    .exec(
      http("request_0")
        .get("/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("/static/js/bundle.js")
            .headers(headers_1),
          http("request_2")
            .get("/LogoWichat.gif")
            .headers(headers_2),
          http("request_3")
            .get("/FondoWichat.png")
            .headers(headers_3)
        )
    )

	setUp(scn.inject(atOnceUsers(1))).protocols(httpProtocol)
}
