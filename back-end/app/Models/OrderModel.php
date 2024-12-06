<?php
require_once __DIR__ . '/../CLasses/Order.php';

class OrderModel
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getAllOrders()
    {
        $query = "SELECT * FROM orders";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOrderById($id)
    {
        $query = "SELECT * FROM orders WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addOrder($userId, $totalPrice)
    {
        $query = "INSERT INTO orders (ID_user, total_prix) VALUES (:userId, :totalPrice)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':totalPrice', $totalPrice, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function updateOrder($id, $userId, $totalPrice)
    {
        try {
            $query = "UPDATE orders 
                      SET ID_user = :userId, 
                          total_prix = :totalPrice 
                      WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':totalPrice', $totalPrice, PDO::PARAM_STR);

            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function deleteOrder($id)
    {
        $query = "DELETE FROM orders WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
