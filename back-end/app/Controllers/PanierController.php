<?php
require_once  __DIR__ . '/../Models/panierModel.php';

class PanierController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function handleRequest($action)
    {
        $panierModel = new PanierModel($this->db);

        switch ($action) {
            case 'getAllPaniers':
                $paniers = $panierModel->getAllPaniers();
                echo json_encode($paniers);
                break;

            case 'getPanierByUserId':
                if (isset($_GET['userId'])) {
                    try {
                        $paniers = $panierModel->getPanierByUserId($_GET['userId']);
                        echo json_encode($paniers);
                    } catch (Exception $e) {
                        echo json_encode(['error' => $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'User ID not provided']);
                }
                break;

            case 'addToPanier':
                if (isset($_POST['userId'], $_POST['livreId'], $_POST['quantity'])) {
                    $result = $panierModel->addToPanier($_POST['userId'], $_POST['livreId'], $_POST['quantity']);
                    echo json_encode(['success' => $result]);
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;
            case 'checkIfProductExists':
                if (isset($_GET['userId'], $_GET['livreId'])) {
                    try {
                        $exists = $panierModel->checkIfProductExists((int)$_GET['userId'], (int)$_GET['livreId']);
                        echo json_encode(['exists' => $exists]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;

            case 'incrementQuantity':
                if (!empty($_POST['userId']) && !empty($_POST['livreId'])) {
                    try {
                        $result = $panierModel->incrementQuantity((int)$_POST['userId'], (int)$_POST['livreId']);
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;

            case 'decrementQuantity':
                if (!empty($_POST['userId']) && !empty($_POST['livreId'])) {
                    try {
                        $result = $panierModel->decrementQuantity((int)$_POST['userId'], (int)$_POST['livreId']);
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;

            case 'deleteFromPanierByUserId':
                if (isset($_GET['userId'])) {
                    try {
                        $result = $panierModel->deleteFromPanierByUserId((int)$_GET['userId']);
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'User ID not provided']);
                }
                break;

            case 'deleteFromPanier':
                if (isset($_GET['cartId'])) {
                    $result = $panierModel->deleteFromPanier($_GET['cartId']);
                    echo json_encode(['success' => $result]);
                } else {
                    echo json_encode(['error' => 'Cart ID not provided']);
                }
                break;

            default:
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
    }
}

require_once  __DIR__ . '/../CLasses/Database.php';
$db = Database::getConnection();
if (isset($_GET['action'])) {
    $controller = new PanierController($db);
    $controller->handleRequest($_GET['action']);
}
