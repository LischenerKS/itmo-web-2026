# Лабораторная работа №2

## Запуск

Нужен Docker с Compose

```bash
docker compose up --build -d
```

Страница открывается по адресу http://localhost:8080

Другой порт

```bash
PORT=8081 docker compose up --build -d
```

Остановка

```bash
docker compose down
```

Логи

```bash
docker compose logs -f
```

Apache раздаёт HTML, CSS и JS и передаёт POST `/fcgi-bin/check` в Java FastCGI
Порт Java доступен только внутри Docker

[Описание API](backend/README.md)
