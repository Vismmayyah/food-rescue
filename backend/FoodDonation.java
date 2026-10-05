import java.time.LocalDate;
import java.time.LocalDateTime;

public class FoodDonation {

    private int foodId;
    private int userId;
    private String foodName;
    private String foodType;
    private int quantity;
    private String location;
    private LocalDate preparationDate;
    private LocalDateTime expiryDate;
    private String status;
    private LocalDateTime createdAt;

    public FoodDonation() {
    }

    public FoodDonation(int userId, String foodName, String foodType,
                        int quantity, String location,
                        LocalDate preparationDate, LocalDateTime expiryDate) {

        this.userId = userId;
        this.foodName = foodName;
        this.foodType = foodType;
        this.quantity = quantity;
        this.location = location;
        this.preparationDate = preparationDate;
        this.expiryDate = expiryDate;
        this.status = "Posted";
    }

    public int getFoodId() {
        return foodId;
    }

    public void setFoodId(int foodId) {
        this.foodId = foodId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getPreparationDate() {
        return preparationDate;
    }

    public void setPreparationDate(LocalDate preparationDate) {
        this.preparationDate = preparationDate;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}