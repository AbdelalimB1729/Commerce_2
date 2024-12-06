<?php
require_once  __DIR__ . '/../CLasses/panier.php';

class PanierModel {
    private $db;

    public function __construct(PDO $db){
        $this->db = $db ;
    }


    public function getAllPaniers() {
        $query = "SELECT * FROM Panier";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addToPanier($userId, $livreId, $quantity) {
        $query = "INSERT INTO Panier (ID_user, ID_livre, quantite) VALUES (:userId, :livreId, :quantity)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':livreId', $livreId);
        $stmt->bindParam(':quantity', $quantity);
        return $stmt->execute();
    }
    
    public function incrementQuantity($userId, $livreId) {
        try {
            $sql = "UPDATE Panier 
                    SET quantite = quantite + 1 
                    WHERE ID_user = :userId AND ID_livre = :livreId";
            $stmt = $this->db->prepare($sql);
    
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':livreId', $livreId, PDO::PARAM_INT);
    
            $stmt->execute();
    
            if ($stmt->rowCount() === 0) {
                throw new Exception("No rows updated. Ensure the User ID and Book ID exist in the table.");
            }
    
            return true;
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function decrementQuantity($userId, $livreId) {
        try {
            $sql = "UPDATE Panier 
                    SET quantite = GREATEST(quantite - 1, 1) 
                    WHERE ID_user = :userId AND ID_livre = :livreId";
            $stmt = $this->db->prepare($sql);
    
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':livreId', $livreId, PDO::PARAM_INT);
    
            $stmt->execute();
    
            if ($stmt->rowCount() === 0) {
                throw new Exception("No rows updated. Ensure the User ID and Book ID exist in the table.");
            }
    
            return true;
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
    
    
    public function checkIfProductExists($userId, $livreId) {
        try {
            $sql = "SELECT ID_panier FROM Panier WHERE ID_user = :userId AND ID_livre = :livreId";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':livreId', $livreId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
    

    public function deleteFromPanier($cartId) {
        $query = "DELETE FROM Panier WHERE ID_panier = :cartId";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':cartId', $cartId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteFromPanierByUserId($userId) {
        try {
            $query = "DELETE FROM Panier WHERE ID_user = :userId";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function getPanierByUserId($userId) {
        try {
            $sql = "SELECT 
                        p.ID_panier AS cart_id, 
                        p.quantite, 
                        l.id AS book_id, 
                        l.nom AS book_name, 
                        l.prix AS book_price, 
                        l.description AS book_description, 
                        l.sourceImg AS book_image 
                    FROM Panier p
                    INNER JOIN Livres l ON p.ID_livre = l.id
                    WHERE p.ID_user = :userId";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
    
}
