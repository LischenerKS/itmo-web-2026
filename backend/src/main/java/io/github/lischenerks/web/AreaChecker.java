package io.github.lischenerks.web;

import java.math.BigDecimal;

public final class AreaChecker {
    private AreaChecker() {
    }

    public static boolean isHit(Point point) {
        BigDecimal x = point.x();
        BigDecimal y = point.y();
        BigDecimal r = point.r();

        if (x.signum() <= 0 && y.signum() >= 0 && y.compareTo(x.add(r)) <= 0) {
            return true;
        }
        if (x.signum() <= 0 && y.signum() <= 0
                && x.multiply(x).add(y.multiply(y)).compareTo(r.multiply(r)) <= 0) {
            return true;
        }
        return x.signum() >= 0 && y.signum() <= 0
                && x.compareTo(r) <= 0 && y.compareTo(r.negate()) >= 0;
    }
}
