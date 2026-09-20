import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class ApiServer {

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(
                new InetSocketAddress(8080), 0
        );

        server.createContext("/api/donations", ApiServer::handleDonations);

        server.setExecutor(null);
        server.start();

        System.out.println("API Server started!");
        System.out.println("http://localhost:8080");
    }

    private static void handleDonations(HttpExchange exchange) throws IOException {

        addCorsHeaders(exchange);

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        if (exchange.getRequestMethod().equalsIgnoreCase("GET")) {

    FoodDonationDAO dao = new FoodDonationDAO();

    var donations = dao.getAllDonations();

    StringBuilder json = new StringBuilder();
    json.append("[");

    for (int i = 0; i < donations.size(); i++) {

        FoodDonation donation = donations.get(i);

        if (i > 0) {
            json.append(",");
        }

        json.append("{");
        json.append("\"foodId\":").append(donation.getFoodId()).append(",");
        json.append("\"userId\":").append(donation.getUserId()).append(",");
        json.append("\"foodName\":\"")
             .append(escapeJson(donation.getFoodName())).append("\",");
        json.append("\"foodType\":\"")
             .append(escapeJson(donation.getFoodType())).append("\",");
        json.append("\"quantity\":").append(donation.getQuantity()).append(",");
        json.append("\"location\":\"")
             .append(escapeJson(donation.getLocation())).append("\",");
        json.append("\"preparationDate\":\"")
             .append(donation.getPreparationDate()).append("\",");
        json.append("\"expiryDate\":\"")
             .append(donation.getExpiryDate()).append("\",");
        json.append("\"status\":\"")
             .append(escapeJson(donation.getStatus())).append("\"");
        json.append("}");
    }

    json.append("]");

    sendResponse(exchange, 200, json.toString());

    return;
}
if (exchange.getRequestMethod().equalsIgnoreCase("PUT")) {

    String query = exchange.getRequestURI().getQuery();

    if (query == null || !query.startsWith("id=")) {
        sendResponse(
                exchange,
                400,
                "{\"message\":\"Food ID is required.\"}"
        );
        return;
    }

    try {
        int foodId = Integer.parseInt(query.substring(3));

        String body = new String(
                exchange.getRequestBody().readAllBytes()
        );

        Map<String, String> data = parseFormData(body);

        FoodDonation donation = new FoodDonation();

        donation.setFoodId(foodId);
        donation.setFoodName(data.get("foodName"));
        donation.setFoodType(data.get("foodType"));
        donation.setQuantity(Integer.parseInt(data.get("quantity")));
        donation.setLocation(data.get("location"));

        if (data.get("preparationDate") != null &&
            !data.get("preparationDate").isEmpty()) {

            donation.setPreparationDate(
                    LocalDate.parse(data.get("preparationDate"))
            );
        }

        if (data.get("expiryDate") != null &&
            !data.get("expiryDate").isEmpty()) {

            donation.setExpiryDate(
                    LocalDateTime.parse(
                            data.get("expiryDate")
                    )
            );
        }

        FoodDonationDAO dao = new FoodDonationDAO();

        boolean result = dao.updateDonation(donation);

        if (result) {
            sendResponse(
                    exchange,
                    200,
                    "{\"message\":\"Donation updated successfully!\"}"
            );
        } else {
            sendResponse(
                    exchange,
                    404,
                    "{\"message\":\"Donation not found.\"}"
            );
        }

    } catch (Exception e) {
        e.printStackTrace();

        sendResponse(
                exchange,
                400,
                "{\"message\":\"Invalid donation data.\"}"
        );
    }

    return;
}
if (exchange.getRequestMethod().equalsIgnoreCase("DELETE")) {

    String query = exchange.getRequestURI().getQuery();

    if (query == null || !query.startsWith("id=")) {
        sendResponse(
                exchange,
                400,
                "{\"message\":\"Food ID is required.\"}"
        );
        return;
    }

    try {
        int foodId = Integer.parseInt(query.substring(3));

        FoodDonationDAO dao = new FoodDonationDAO();

        boolean result = dao.deleteDonation(foodId);

        if (result) {
            sendResponse(
                    exchange,
                    200,
                    "{\"message\":\"Donation deleted successfully!\"}"
            );
        } else {
            sendResponse(
                    exchange,
                    404,
                    "{\"message\":\"Donation not found.\"}"
            );
        }

    } catch (NumberFormatException e) {

        sendResponse(
                exchange,
                400,
                "{\"message\":\"Invalid food ID.\"}"
        );
    }

    return;
}

        if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {

            String body = readRequestBody(exchange);

            Map<String, String> data = parseFormData(body);

            try {

                int userId = 1;

                String foodName = data.get("foodName");
                String foodType = data.get("foodType");
                int quantity = Integer.parseInt(data.get("quantity"));
                String location = data.get("location");

                LocalDate preparationDate =
                        LocalDate.parse(data.get("preparationDate"));

                LocalDateTime expiryDate =
                        LocalDateTime.parse(data.get("expiryDate"));

                FoodDonation donation = new FoodDonation(
                        userId,
                        foodName,
                        foodType,
                        quantity,
                        location,
                        preparationDate,
                        expiryDate
                );

                FoodDonationDAO dao = new FoodDonationDAO();

                boolean result = dao.addDonation(donation);

                if (result) {

                    sendResponse(
                            exchange,
                            200,
                            "{\"message\":\"Donation added successfully!\"}"
                    );

                } else {

                    sendResponse(
                            exchange,
                            500,
                            "{\"message\":\"Failed to add donation.\"}"
                    );
                }

            } catch (Exception e) {

                e.printStackTrace();

                sendResponse(
                        exchange,
                        400,
                        "{\"message\":\"Invalid donation data.\"}"
                );
            }

            return;
        }

        sendResponse(
                exchange,
                405,
                "{\"message\":\"Method not allowed.\"}"
        );
    }

    private static String readRequestBody(HttpExchange exchange)
            throws IOException {

        InputStream inputStream = exchange.getRequestBody();

        return new String(
                inputStream.readAllBytes(),
                StandardCharsets.UTF_8
        );
    }

    private static Map<String, String> parseFormData(String body) {

        Map<String, String> data = new HashMap<>();

        if (body == null || body.isEmpty()) {
            return data;
        }

        String[] pairs = body.split("&");

        for (String pair : pairs) {

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

    private static void addCorsHeaders(HttpExchange exchange) {

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Origin",
                "http://localhost:5173"
        );

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
        );

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );
    }

    private static void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response
    ) throws IOException {

        exchange.getResponseHeaders().add(
                "Content-Type",
                "application/json"
        );

        byte[] responseBytes =
                response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(
                statusCode,
                responseBytes.length
        );

        OutputStream outputStream =
                exchange.getResponseBody();

        outputStream.write(responseBytes);
        outputStream.close();
    }
    private static String escapeJson(String value) {

    if (value == null) {
        return "";
    }

    return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"");
}
}