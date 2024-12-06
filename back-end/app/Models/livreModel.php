<?php
require_once  __DIR__ . '/../CLasses/livre.php';

class LivreModel
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getAllLivres()
    {
        $query = "SELECT * FROM livres";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLivreById($id)
    {
        $query = "SELECT * FROM livres WHERE ID_livre = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addLivre($nom, $description, $sourceImg, $typeLivre, $prix)
    {
        $query = "INSERT INTO livres (nom, description, sourceImg, typeLivre, prix) VALUES (:nom, :description, :sourceImg, :typeLivre, :prix)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':sourceImg', $sourceImg);
        $stmt->bindParam(':typeLivre', $typeLivre);
        $stmt->bindParam(':prix', $prix);
        return $stmt->execute();
    }

    public function updateLivre($id, $nom, $description, $sourceImg, $typeLivre, $prix)
    {
        try {
            $sql = "UPDATE Livres 
                    SET nom = :nom, 
                        description = :description, 
                        sourceImg = :sourceImg, 
                        typeLivre = :typeLivre, 
                        prix = :prix
                    WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':nom', $nom, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':sourceImg', $sourceImg, PDO::PARAM_STR);
            $stmt->bindParam(':typeLivre', $typeLivre, PDO::PARAM_STR);
            $stmt->bindParam(':prix', $prix, PDO::PARAM_STR);

            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function deleteLivre($id)
    {
        $query = "DELETE FROM livres WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
