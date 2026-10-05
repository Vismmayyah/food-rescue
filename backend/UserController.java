import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class UserController {

    public static void main(String[] args) throws IOException {

        HttpServer server = HttpServer.create(
            new InetSocketAddress(8080), 0
        );

        // LOGIN
        server.createContext("/login", (HttpExchange exchange) -> {

            exchange.getResponseHeaders().add(
                "Access-Control-Allow-Origin", "*"
            );

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {

                String body = new String(
                    exchange.getRequestBody().readAllBytes(),
                    StandardCharsets.UTF_8
                );

                Map<String, String> data = parseFormData(body);

                String email = data.get("email");
                String password = data.get("password");

                UserService userService = new UserService();

                User user = userService.loginUser(email, password);

                String response;

                if (user != null) {
                    response = "Login successful! Welcome, " + user.getName();
                } else {
                    response = "Invalid email or password.";
                }

                byte[] responseBytes =
                    response.getBytes(StandardCharsets.UTF_8);

                exchange.sendResponseHeaders(
                    200,
                    responseBytes.length
                );

                OutputStream output = exchange.getResponseBody();
                output.write(responseBytes);
                output.close();

            } else {

                String response =
                    "Please use POST method for login.";

                exchange.sendResponseHeaders(
                    405,
                    response.length()
                );

                OutputStream output = exchange.getResponseBody();
                output.write(response.getBytes());
                output.close();
            }
        });

        // REGISTRATION
        server.createContext("/register", (HttpExchange exchange) -> {

            exchange.getResponseHeaders().add(
                "Access-Control-Allow-Origin", "*"
            );

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {

                String body = new String(
                    exchange.getRequestBody().readAllBytes(),
                    StandardCharsets.UTF_8
                );

                Map<String, String> data = parseFormData(body);

                String name = data.get("name");
                String email = data.get("email");
                String password = data.get("password");

                UserService userService = new UserService();

                boolean registered = userService.registerUser(
                    name,
                    email,
                    password
                );

                String response;

                if (registered) {
                    response = "Registration successful!";
                } else {
                    response = "Registration failed!";
                }

                byte[] responseBytes =
                    response.getBytes(StandardCharsets.UTF_8);

                exchange.sendResponseHeaders(
                    200,
                    responseBytes.length
                );

                OutputStream output = exchange.getResponseBody();
                output.write(responseBytes);
                output.close();

            } else {

                String response =
                    "Please use POST method for registration.";

                exchange.sendResponseHeaders(
                    405,
                    response.length()
                );

                OutputStream output = exchange.getResponseBody();
                output.write(response.getBytes());
                output.close();
            }
        });

        server.start();

        System.out.println(
            "Server started at http://localhost:8080"
        );
    }

    // Converts form data into key-value pairs
    private static Map<String, String> parseFormData(String body) {

        Map<String, String> data = new HashMap<>();

        for (String pair : body.split("&")) {

            String[] parts = pair.split("=", 2);

            if (parts.length == 2) {

                String key = URLDecoder.decode(
                    parts[0],
                    StandardCharsets.UTF_8
                );

                String value = URLDecoder.decode(
                    parts[1],
                    StandardCharsets.UTF_8
                );

                data.put(key, value);
            }
        }

        return data;
    }
}