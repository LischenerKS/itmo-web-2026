package io.github.lischenerks.web;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.StringJoiner;

public final class JsonResponse {
    private JsonResponse() {
    }

    public static String success(List<Point> points, long started) {
        StringJoiner results = new StringJoiner(",", "[", "]");
        for (Point point : points) {
            results.add("{\"x\":" + quote(point.x().toPlainString())
                    + ",\"y\":" + quote(point.y().toPlainString())
                    + ",\"r\":" + quote(point.r().toPlainString())
                    + ",\"hit\":" + AreaChecker.isHit(point) + "}");
        }
        return "{\"results\":" + results + metadata(started) + "}";
    }

    public static String error(String message, long started) {
        return "{\"error\":" + quote(message) + metadata(started) + "}";
    }

    private static String metadata(long started) {
        Instant now = Instant.now();
        BigDecimal milliseconds = BigDecimal.valueOf(System.nanoTime() - started, 6);
        return ",\"currentTime\":" + quote(now.toString())
                + ",\"executionTimeMs\":" + milliseconds.toPlainString();
    }

    private static String quote(String value) {
        StringBuilder json = new StringBuilder("\"");
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '"' -> json.append("\\\"");
                case '\\' -> json.append("\\\\");
                default -> {
                    if (c < 0x20) {
                        json.append(String.format("\\u%04x", (int) c));
                    } else {
                        json.append(c);
                    }
                }
            }
        }
        return json.append('"').toString();
    }
}
