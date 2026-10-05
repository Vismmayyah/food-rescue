import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.sql.SQLException;
import java.sql.Date;
import java.sql.Timestamp;

public class FoodDonationDAO {

    // ADD DONATION
    public boolean addDonation(FoodDonation donation) {

        String sql = "INSERT INTO food_donations " +
                     "(user_id, food_name, food_type, quantity, location, " +
                     "preparation_date, expiry_date, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, donation.getUserId());
            statement.setString(2, donation.getFoodName());
            statement.setString(3, donation.getFoodType());
            statement.setInt(4, donation.getQuantity());
            statement.setString(5, donation.getLocation());
            statement.setDate(6, Date.valueOf(donation.getPreparationDate()));
            statement.setTimestamp(7, Timestamp.valueOf(donation.getExpiryDate()));
            statement.setString(8, donation.getStatus());

            int rows = statement.executeUpdate();

            return rows > 0;

        } catch (SQLException e) {
            System.out.println("Error adding donation!");
            e.printStackTrace();
            return false;
        }
    }

    // VIEW ALL DONATIONS
    public void viewDonations() {

        String sql = "SELECT * FROM food_donations";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet result = statement.executeQuery()) {

            while (result.next()) {

                System.out.println("----------------------------");

                System.out.println("Food ID: " +
                        result.getInt("food_id"));

                System.out.println("User ID: " +
                        result.getInt("user_id"));

                System.out.println("Food Name: " +
                        result.getString("food_name"));

                System.out.println("Food Type: " +
                        result.getString("food_type"));

                System.out.println("Quantity: " +
                        result.getInt("quantity"));

                System.out.println("Location: " +
                        result.getString("location"));

                System.out.println("Preparation Date: " +
                        result.getDate("preparation_date"));

                System.out.println("Expiry Date: " +
                        result.getTimestamp("expiry_date"));

                System.out.println("Status: " +
                        result.getString("status"));
            }

        } catch (SQLException e) {
            System.out.println("Error viewing donations!");
            e.printStackTrace();
        }
    }

    // DELETE DONATION
    public boolean deleteDonation(int foodId) {

        String sql = "DELETE FROM food_donations WHERE food_id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, foodId);

            int rows = statement.executeUpdate();

            return rows > 0;

        } catch (SQLException e) {
            System.out.println("Error deleting donation!");
            e.printStackTrace();
            return false;
        }
    }

    // UPDATE DONATION
    public boolean updateDonation(FoodDonation donation) {

        String sql = "UPDATE food_donations SET " +
                     "food_name = ?, food_type = ?, quantity = ?, " +
                     "location = ?, preparation_date = ?, expiry_date = ? " +
                     "WHERE food_id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, donation.getFoodName());
            statement.setString(2, donation.getFoodType());
            statement.setInt(3, donation.getQuantity());
            statement.setString(4, donation.getLocation());
            statement.setDate(5, Date.valueOf(donation.getPreparationDate()));
            statement.setTimestamp(6, Timestamp.valueOf(donation.getExpiryDate()));
            statement.setInt(7, donation.getFoodId());

            int rows = statement.executeUpdate();

            return rows > 0;

        } catch (SQLException e) {
            System.out.println("Error updating donation!");
            e.printStackTrace();
            return false;
        }
    }
        // GET ALL DONATIONS
    public List<FoodDonation> getAllDonations() {

        List<FoodDonation> donations = new ArrayList<>();

        String sql = "SELECT * FROM food_donations ORDER BY food_id DESC";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet result = statement.executeQuery()) {

            while (result.next()) {

                FoodDonation donation = new FoodDonation();

                donation.setFoodId(result.getInt("food_id"));
                donation.setUserId(result.getInt("user_id"));
                donation.setFoodName(result.getString("food_name"));
                donation.setFoodType(result.getString("food_type"));
                donation.setQuantity(result.getInt("quantity"));
                donation.setLocation(result.getString("location"));

                if (result.getDate("preparation_date") != null) {
                    donation.setPreparationDate(
                        result.getDate("preparation_date").toLocalDate()
                    );
                }

                if (result.getTimestamp("expiry_date") != null) {
                    donation.setExpiryDate(
                        result.getTimestamp("expiry_date").toLocalDateTime()
                    );
                }

                donation.setStatus(result.getString("status"));

                if (result.getTimestamp("created_at") != null) {
                    donation.setCreatedAt(
                        result.getTimestamp("created_at").toLocalDateTime()
                    );
                }

                donations.add(donation);
            }

        } catch (SQLException e) {
            System.out.println("Error getting donations!");
            e.printStackTrace();
        }

        return donations;
    }
}