import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserService {

    // Register a new user
    public boolean registerUser(String name, String email, String password) {

        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, name);
            statement.setString(2, email);
            statement.setString(3, password);

            statement.executeUpdate();

            System.out.println("User registered successfully!");
            return true;

        } catch (Exception e) {
            System.out.println("Registration failed!");
            e.printStackTrace();
            return false;
        }
    }

    // Login
    public User loginUser(String email, String password) {

        String sql = "SELECT * FROM users WHERE email = ? AND password = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, email);
            statement.setString(2, password);

            ResultSet result = statement.executeQuery();

            if (result.next()) {

                System.out.println("Login successful!");

                return new User(
                    result.getInt("user_id"),
                    result.getString("name"),
                    result.getString("email"),
                    result.getString("password")
                );
            }

            System.out.println("Invalid email or password.");
            return null;

        } catch (Exception e) {
            System.out.println("Login failed!");
            e.printStackTrace();
            return null;
        }
    }
}