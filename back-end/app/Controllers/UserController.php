<?php
require_once  __DIR__ . '/../Models/Usermodel.php';

class UserController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function handleRequest($action)
    {
        $userModel = new UserModel($this->db);

        switch ($action) {
            case 'getAllUsers':
                $users = $userModel->getAllUsers();
                echo json_encode($users);
                break;

            case 'getUserById':
                if (isset($_GET['id'])) {
                    $user = $userModel->getUserById($_GET['id']);
                    echo json_encode($user);
                } else {
                    echo json_encode(['error' => 'ID not provided']);
                }
                break;

            case 'getUserByEmail':
                if (isset($_GET['email'])) {
                    $email = htmlspecialchars(strip_tags($_GET['email']), ENT_QUOTES, 'UTF-8');
                    $user = $userModel->getUserByEmail($email);
                    echo json_encode($user);
                } else {
                    echo json_encode(['error' => 'Email not provided']);
                }
                break;

            case 'addUser':
                if (isset($_POST['nom'], $_POST['email'], $_POST['password'], $_POST['role'])) {
                    $nom = htmlspecialchars(strip_tags($_POST['nom']), ENT_QUOTES, 'UTF-8');
                    $email = htmlspecialchars(strip_tags($_POST['email']), ENT_QUOTES, 'UTF-8');
                    $password = htmlspecialchars(strip_tags($_POST['password']), ENT_QUOTES, 'UTF-8');
                    $role = htmlspecialchars(strip_tags($_POST['role']), ENT_QUOTES, 'UTF-8');
                    $result = $userModel->addUser($nom, $email, $password, $role);
                    echo json_encode(['success' => $result]);
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;
            case 'updateUser':
                if (isset($_POST['id'], $_POST['nom'], $_POST['email'], $_POST['role'])) {
                    try {
                        $result = $userModel->updateUser(
                            (int)$_POST['id'],
                            $_POST['nom'],
                            $_POST['email'],
                            $_POST['role']
                        );
                        echo json_encode(['success' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => 'Failed to update user: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Missing parameters']);
                }
                break;


            case 'deleteUser':
                if (isset($_GET['id'])) {
                    $result = $userModel->deleteUser($_GET['id']);
                    echo json_encode(['success' => $result]);
                } else {
                    echo json_encode(['error' => 'ID not provided']);
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
    $controller = new UserController($db);
    $controller->handleRequest($_GET['action']);
}
