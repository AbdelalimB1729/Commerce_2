<?php
require_once __DIR__ . '/../Models/OrderModel.php';

class OrderController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function handleRequest($action)
    {
        $orderModel = new OrderModel($this->db);

        switch ($action) {
            case 'getAllOrders':
                try {
                    $orders = $orderModel->getAllOrders();
                    echo json_encode($orders);
                } catch (Exception $e) {
                    echo json_encode(['error' => 'Failed to fetch orders: ' . $e->getMessage()]);
                }
                break;

            case 'getOrderById':
                if (isset($_GET['id'])) {
                    try {
                        $order = $orderModel->getOrderById((int)$_GET['id']);
                        echo json_encode($order);
                    } catch (Exception $e) {
                        echo json_encode(['error' => 'Failed to fetch order: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Order ID not provided']);
                }
                break;

            case 'addOrder':
                if (isset($_POST['userId'], $_POST['totalPrice'])) {
                    try {
                        $result = $orderModel->addOrder(
                            (int)$_POST['userId'],
                            (float)$_POST['totalPrice']
                        );
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => 'Failed to add order: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;
                case 'updateOrder':
                    if (isset($_POST['id'], $_POST['userId'], $_POST['totalPrice'])) {
                        try {
                            $result = $orderModel->updateOrder(
                                (int)$_POST['id'],
                                (int)$_POST['userId'],
                                (float)$_POST['totalPrice']
                            );
                            echo json_encode(['success' => $result]);
                        } catch (Exception $e) {
                            echo json_encode(['error' => 'Failed to update order: ' . $e->getMessage()]);
                        }
                    } else {
                        echo json_encode(['error' => 'Missing parameters']);
                    }
                    break;

            case 'deleteOrder':
                if (isset($_GET['id'])) {
                    try {
                        $result = $orderModel->deleteOrder((int)$_GET['id']);
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => 'Failed to delete order: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Order ID not provided']);
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
    $controller = new OrderController($db);
    $controller->handleRequest($_GET['action']);
}
?>
