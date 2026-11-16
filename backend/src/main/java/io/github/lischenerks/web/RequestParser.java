package io.github.lischenerks.web;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class RequestParser {
    private static final int MAX_BODY_BYTES = 8192;

    private RequestParser() {
    }

    public static List<Point> read(InputStream input, String contentLength) throws IOException {
        int length;
        try {
            length = Integer.parseInt(contentLength);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Некорректный CONTENT_LENGTH");
        }
        if (length < 0 || length > MAX_BODY_BYTES) {
            throw new IllegalArgumentException("Размер тела запроса должен быть от 0 до 8192 байт");
        }

        byte[] bytes = input.readNBytes(length);
        if (bytes.length != length) {
            throw new IllegalArgumentException("Длина тела запроса не соответствует CONTENT_LENGTH");
        }

        Map<String, List<String>> values = new HashMap<>();
        String body = new String(bytes, StandardCharsets.UTF_8);
        if (!body.isEmpty()) {
            for (String pair : body.split("&", -1)) {
                int separator = pair.indexOf('=');
                if (separator < 0) {
                    throw new IllegalArgumentException("Ожидаются параметры в формате имя=значение");
                }
                String name = decode(pair.substring(0, separator));
                String value = decode(pair.substring(separator + 1));
                values.computeIfAbsent(name, key -> new ArrayList<>()).add(value);
            }
        }

        return PointValidator.validate(values.get("x"), single(values, "y"), single(values, "r"));
    }

    private static String single(Map<String, List<String>> values, String name) {
        List<String> entries = values.get(name);
        if (entries == null || entries.size() != 1) {
            throw new IllegalArgumentException("Параметр " + name + " должен быть указан ровно один раз");
        }
        return entries.getFirst();
    }

    private static String decode(String value) {
        try {
            return URLDecoder.decode(value, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Некорректное URL-кодирование параметров");
        }
    }
}
