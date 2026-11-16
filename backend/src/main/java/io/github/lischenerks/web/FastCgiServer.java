package io.github.lischenerks.web;

import com.fastcgi.FCGIInterface;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Properties;

public final class FastCgiServer {
    private FastCgiServer() {
    }

    public static void main(String[] args) {
        if (System.getProperty("FCGI_PORT") == null) {
            throw new IllegalArgumentException("Укажите порт FastCGI: -DFCGI_PORT=9000");
        }

        FCGIInterface fastCgi = new FCGIInterface();
        while (fastCgi.FCGIaccept() >= 0) {
            long started = System.nanoTime();
            try {
                handleRequest(FCGIInterface.request.params, started);
            } catch (IllegalArgumentException e) {
                respond("400 Bad Request", JsonResponse.error(e.getMessage(), started));
            } catch (IOException e) {
                respond("400 Bad Request", JsonResponse.error("Не удалось прочитать тело запроса", started));
            } catch (RuntimeException e) {
                e.printStackTrace(System.err);
                respond("500 Internal Server Error", JsonResponse.error("Ошибка обработки запроса", started));
            }
        }
    }

    private static void handleRequest(Properties params, long started) throws IOException {
        if (!"POST".equals(params.getProperty("REQUEST_METHOD"))) {
            respond("405 Method Not Allowed", JsonResponse.error("Используйте POST-запрос", started));
            return;
        }

        String contentType = params.getProperty("CONTENT_TYPE", "").split(";", 2)[0].trim();
        if (!"application/x-www-form-urlencoded".equalsIgnoreCase(contentType)) {
            respond("415 Unsupported Media Type",
                    JsonResponse.error("Ожидается application/x-www-form-urlencoded", started));
            return;
        }

        List<Point> points = RequestParser.read(System.in, params.getProperty("CONTENT_LENGTH"));
        respond("200 OK", JsonResponse.success(points, started));
    }

    private static void respond(String status, String json) {
        byte[] body = json.getBytes(StandardCharsets.UTF_8);
        String headers = "Status: " + status + "\r\n"
                + "Content-Type: application/json; charset=utf-8\r\n"
                + "Content-Length: " + body.length + "\r\n"
                + "Cache-Control: no-store\r\n"
                + (status.startsWith("405") ? "Allow: POST\r\n" : "")
                + "\r\n";
        System.out.writeBytes(headers.getBytes(StandardCharsets.US_ASCII));
        System.out.writeBytes(body);
        System.out.flush();
    }
}
