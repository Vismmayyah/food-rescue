import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class FoodRequestDAO {

    // =========================
    // SAVE REQUEST
    // =========================

    public static boolean saveRequest(
            int donationId,
            int requesterId,
            int quantity) {

        String sql = """
                INSERT INTO food_requests
                (donation_id, requester_id, quantity, status)
                VALUES (?, ?, ?, 'Requested')
                """;

        try (
            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement statement =
                    connection.prepareStatement(sql)
        ) {

            statement.setInt(1, donationId);
            statement.setInt(2, requesterId);
            statement.setInt(3, quantity);

            statement.executeUpdate();

            return true;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }


    // =========================
    // GET ALL REQUESTS
    // =========================

    public static List<String> getAllRequests() {

        List<String> requests =
                new ArrayList<>();

        String sql = """
                SELECT request_id,
                       donation_id,
                       requester_id,
                       quantity,
                       status,
                       request_date
                FROM food_requests
                ORDER BY request_id DESC
                """;

        try (
            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement statement =
                    connection.prepareStatement(sql);

            ResultSet result =
                    statement.executeQuery()
        ) {

            while (result.next()) {

                String json =
                        "{"
                        + "\"requestId\":"
                        + result.getInt("request_id")
                        + ","
                        + "\"donationId\":"
                        + result.getInt("donation_id")
                        + ","
                        + "\"requesterId\":"
                        + result.getInt("requester_id")
                        + ","
                        + "\"quantity\":"
                        + result.getInt("quantity")
                        + ","
                        + "\"status\":\""
                        + result.getString("status")
                        + "\""
                        + ","
                        + "\"requestDate\":\""
                        + result.getString("request_date")
                        + "\""
                        + "}";

                requests.add(json);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return requests;
    }


    // =========================
    // ACCEPT REQUEST
    // =========================

    public static boolean acceptRequest(
            int requestId) {

        String sql = """
                UPDATE food_requests
                SET status = 'Accepted'
                WHERE request_id = ?
                """;

        try (
            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement statement =
                    connection.prepareStatement(sql)
        ) {

            statement.setInt(1, requestId);

            int rows =
                    statement.executeUpdate();

            return rows > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }
        // =========================
    // MARK REQUEST AS PICKED UP
    // =========================

    public static boolean pickUpRequest(
            int requestId) {

        String sql = """
                UPDATE food_requests
                SET status = 'Picked Up'
                WHERE request_id = ?
                """;

        try (
            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement statement =
                    connection.prepareStatement(sql)
        ) {

            statement.setInt(1, requestId);

            int rows =
                    statement.executeUpdate();

            return rows > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }
    // =========================
// MARK REQUEST AS DELIVERED
// =========================

public static boolean deliverRequest(int requestId) {

    String getDonationSql = """
            SELECT donation_id
            FROM food_requests
            WHERE request_id = ?
            """;

    String updateRequestSql = """
            UPDATE food_requests
            SET status = 'Delivered'
            WHERE request_id = ?
            """;

    String updateDonationSql = """
            UPDATE food_donations
            SET status = 'Delivered'
            WHERE id = ?
            """;

    try (
        Connection connection = DBConnection.getConnection()
    ) {

        // 1. Find the donation connected to this request
        int donationId;

        try (PreparedStatement statement =
                     connection.prepareStatement(getDonationSql)) {

            statement.setInt(1, requestId);

            try (ResultSet result =
                         statement.executeQuery()) {

                if (!result.next()) {
                    return false;
                }

                donationId =
                        result.getInt("donation_id");
            }
        }

        // 2. Change the request to Delivered
        try (PreparedStatement statement =
                     connection.prepareStatement(updateRequestSql)) {

            statement.setInt(1, requestId);

            int rows =
                    statement.executeUpdate();

            if (rows == 0) {
                return false;
            }
        }

        // 3. Change the related donation to Delivered
        try (PreparedStatement statement =
                     connection.prepareStatement(updateDonationSql)) {

            statement.setInt(1, donationId);

            statement.executeUpdate();
        }

        return true;

    } catch (Exception e) {

        e.printStackTrace();

        return false;
    }
}
}