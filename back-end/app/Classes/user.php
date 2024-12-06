<?php
class User implements JsonSerializable{
    private $id;
    private $nom;
    private $email;
    private $password;
    private $role;

    public function __construct($id, $nom, $email, $password, $role) {
        $this->id = $id;
        $this->nom = $nom;
        $this->email = $email;
        $this->password = $password;
        $this->role = $role;
    }

    public function getId() {
        return $this->id;
    }

    public function getNom() {
        return $this->nom;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getPassword() {
        return $this->password;
    }

    public function getRole() {
        return $this->role;
    }

    public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'password' => $this->password,
            'role' => $this->role,
        ];
    }
}
