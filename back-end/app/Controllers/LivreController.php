<?php
require_once __DIR__ . '/../Models/livreModel.php';

class LivreController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function handleRequest($action)
    {
        $livreModel = new livreModel($this->db);

        switch ($action) {
            case 'getAllLivres':
                try {
                    $livres = $livreModel->getAllLivres();
                    echo json_encode($livres);
                } catch (Exception $e) {
                    echo json_encode(['error' => 'Failed to fetch livres: ' . $e->getMessage()]);
                }
                break;

            case 'getLivreById':
                if (isset($_GET['id'])) {
                    try {
                        $livre = $livreModel->getLivreById((int)$_GET['id']);
                        echo json_encode($livre);
                    } catch (Exception $e) {
                        echo json_encode(['error' => 'Failed to fetch livre: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Livre ID not provided']);
                }
                break;

            case 'addLivre':
                if (isset($_POST['nom'], $_POST['description'], $_POST['sourceImg'], $_POST['typeLivre'], $_POST['prix'])) {
                    try {
                        $result = $livreModel->addLivre(
                            $_POST['nom'],
                            $_POST['description'],
                            $_POST['sourceImg'],
                            $_POST['typeLivre'],
                            (float)$_POST['prix']
                        );
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => 'Failed to add livre: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;
            case 'updateLivre':
                if (isset($_POST['id'], $_POST['nom'], $_POST['description'], $_POST['sourceImg'], $_POST['typeLivre'], $_POST['prix'])) {
                    try {
                        $result = $livreModel->updateLivre(
                            (int)$_POST['id'],
                            $_POST['nom'],
                            $_POST['description'],
                            $_POST['sourceImg'],
                            $_POST['typeLivre'],
                            (float)$_POST['prix']
                        );
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => 'Failed to update livre: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;

            case 'deleteLivre':
                if (isset($_GET['id'])) {
                    try {
                        $result = $livreModel->deleteLivre((int)$_GET['id']);
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => 'Failed to delete livre: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Livre ID not provided']);
                }
                break;

            default:
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
    }
}

require_once __DIR__ . '/../CLasses/Database.php';
$db = Database::getConnection();
if (isset($_GET['action'])) {
    $controller = new LivreController($db);
    $controller->handleRequest($_GET['action']);
}
