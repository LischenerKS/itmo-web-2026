package io.github.lischenerks.web;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class PointValidator {
    private static final BigDecimal MIN_X = new BigDecimal("-2");
    private static final BigDecimal MAX_X = new BigDecimal("2");
    private static final BigDecimal Y_BOUND = new BigDecimal("3");
    private static final BigDecimal MAX_R = new BigDecimal("5");
    private static final BigDecimal TWO = new BigDecimal("2");

    private PointValidator() {
    }

    public static List<Point> validate(List<String> xValues, String yValue, String rValue) {
        if (xValues == null || xValues.isEmpty()) {
            throw new IllegalArgumentException("Выберите хотя бы одно значение X");
        }

        BigDecimal y = decimal(yValue, "Y");
        if (y.abs().compareTo(Y_BOUND) >= 0) {
            throw new IllegalArgumentException("Y должен быть строго между -3 и 3");
        }

        BigDecimal r = decimal(rValue, "R");
        if (r.compareTo(BigDecimal.ONE) < 0 || r.compareTo(MAX_R) > 0
                || r.remainder(BigDecimal.ONE).signum() != 0) {
            throw new IllegalArgumentException("R должен быть одним из значений: 1, 2, 3, 4, 5");
        }

        List<Point> points = new ArrayList<>();
        for (String xValue : xValues) {
            BigDecimal x = decimal(xValue, "X");
            if (x.compareTo(MIN_X) < 0 || x.compareTo(MAX_X) > 0
                    || x.multiply(TWO).remainder(BigDecimal.ONE).signum() != 0) {
                throw new IllegalArgumentException("X должен быть от -2 до 2 с шагом 0.5");
            }
            points.add(new Point(x, y, r));
        }
        return List.copyOf(points);
    }

    private static BigDecimal decimal(String value, String name) {
        if (value == null || !value.matches("-?[0-9]+(?:\\.[0-9]+)?")) {
            throw new IllegalArgumentException(name + ": введите десятичное число с точкой");
        }
        return new BigDecimal(value);
    }
}
