<?php
require_once  __DIR__ . '/../CLasses/user.php';

class UserModel
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getAllUsers()
    {
        $query = "SELECT * FROM users";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUserById($id)
    {
        $query = "SELECT * FROM users WHERE ID_user = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addUser($nom, $email, $password, $role)
    {
        $query = "INSERT INTO users (nom, email, password, role) VALUES (:nom, :email, :password, :role)";
        $stmt = $this->db->prepare($query);

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':role', $role);
        return $stmt->execute();
    }

    public function getUserByEmail($email)
    {
        $query = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateUser($id, $nom, $email, $role)
{
    try {
        $query = "UPDATE users 
                  SET nom = :nom, email = :email, role = :role 
                  WHERE id = :id";
        $stmt = $this->db->prepare($query);

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':nom', $nom, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':role', $role, PDO::PARAM_STR);

        return $stmt->execute();
    } catch (PDOException $e) {
        throw new Exception("Database error: " . $e->getMessage());
    }
}


    public function deleteUser($id)
    {
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
