
import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class LoadTest extends Simulation {

  private HttpProtocolBuilder httpProtocol = http
    .baseUrl("http://localhost:8000")
    .inferHtmlResources()
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0");
  
  private Map<CharSequence, String> headers_0 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    Map.entry("Priority", "u=0, i"),
    Map.entry("Upgrade-Insecure-Requests", "1")
  );
  
  private Map<CharSequence, String> headers_1 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
    Map.entry("Priority", "u=5")
  );
  
  private Map<CharSequence, String> headers_2 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
    Map.entry("If-None-Match", "\"e929b4434a2825678eb21f82027fd301b4954335\""),
    Map.entry("Priority", "u=5")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
    Map.entry("If-Modified-Since", "Sun, 27 Apr 2025 16:54:05 GMT"),
    Map.entry("If-None-Match", "W/\"1fc7f-196782b9b25\""),
    Map.entry("Priority", "u=5")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
    Map.entry("If-Modified-Since", "Sun, 27 Apr 2025 16:54:05 GMT"),
    Map.entry("If-None-Match", "W/\"66e8c-196782b9b1f\""),
    Map.entry("Priority", "u=5")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_7 = Map.ofEntries(
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private Map<CharSequence, String> headers_8 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("Cache-Control", "no-cache"),
    Map.entry("Content-Type", "application/ocsp-request"),
    Map.entry("Pragma", "no-cache"),
    Map.entry("Priority", "u=2")
  );
  
  private Map<CharSequence, String> headers_11 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"575-KtVBUr0r9YM/uJlaPGOk8iBx82s\""),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_12 = Map.ofEntries(
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private Map<CharSequence, String> headers_13 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("Cache-Control", "max-age=0"),
    Map.entry("If-None-Match", "W/\"628b3f-S1ljTYGKFKKmWpt0LH4vccdXGpQ\""),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_14 = Map.of("Origin", "http://localhost:3000");
  
  private Map<CharSequence, String> headers_15 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"2d97-KWS+tfz1AS1FgGBj4qxFAiBY8DE\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private String uri1 = "http://status.geotrust.com";
  
  private String uri2 = "localhost";

  private ScenarioBuilder scn = scenario("LoadTest")
    .exec(
      http("request_0")
        .get("http://" + uri2 + ":3000/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri2 + ":3000/LogoWichat.gif")
            .headers(headers_1),
          http("request_2")
            .get("http://" + uri2 + ":3000/FondoWichat.png")
            .headers(headers_2)
        ),
      pause(1),
      http("request_3")
        .get("http://" + uri2 + ":3000/register")
        .headers(headers_0)
        .resources(
          http("request_4")
            .get("http://" + uri2 + ":3000/LogoWichat.gif")
            .headers(headers_4),
          http("request_5")
            .get("http://" + uri2 + ":3000/FondoWichat.png")
            .headers(headers_5)
        ),
      pause(10),
      http("request_6")
        .options("/api/register")
        .headers(headers_6)
        .resources(
          http("request_7")
            .post("/api/register")
            .headers(headers_7)
            .body(RawFileBody("loadtest/0007_request.json"))
        ),
      pause(2),
      http("request_8")
        .post(uri1 + "/")
        .headers(headers_8)
        .body(RawFileBody("loadtest/0008_request.dat")),
      pause(3),
      http("request_9")
        .options("/api/login")
        .headers(headers_6)
        .resources(
          http("request_10")
            .post("/api/login")
            .headers(headers_7)
            .body(RawFileBody("loadtest/0010_request.json")),
          http("request_11")
            .get("/api/ranking")
            .headers(headers_11)
            .check(status().is(500))
        ),
      pause(1),
      http("request_12")
        .get("/api/ranking")
        .headers(headers_12)
        .check(status().is(500)),
      pause(6),
      http("request_13")
        .get("http://" + uri2 + ":3000/static/js/bundle.js.map")
        .headers(headers_13),
      pause(29),
      http("request_14")
        .get("/api/ranking")
        .headers(headers_14),
      pause(1),
      http("request_15")
        .get("/api/ranking")
        .headers(headers_15)
    );

  {
	  setUp(scn.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
  }
}
