<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
require_once __DIR__ . '/app/CLasses/Database.php';

function loadController($controllerName)
{
    $controllerPath = __DIR__ . '/app/Controllers/' . $controllerName . '.php';
    if (file_exists($controllerPath)) {
        require_once $controllerPath;
        return true;
    }
    return false;
}

function loadModel($modelName)
{
    $modelPath = __DIR__ . '/app/Models/' . $modelName . '.php';
    if (file_exists($modelPath)) {
        require_once $modelPath;
        return true;
    }
    return false;
}

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$controller = isset($_GET['controller']) ? ucfirst($_GET['controller']) . 'Controller' : null;
$action = $_GET['action'] ?? null;

if ($controller && $action) {
    if (loadController($controller)) {
        $controllerInstance = new $controller($db);
        if (method_exists($controllerInstance, $action)) {
            $controllerInstance->$action();
        } 
        else if(!method_exists($controllerInstance, $action)){
            
        }
    } else {
        echo json_encode(['error' => "Controller '$controller' not found."]);
    }
} else {
    echo json_encode(['error' => 'Invalid request. Specify both a controller and an action.']);
}

?>

