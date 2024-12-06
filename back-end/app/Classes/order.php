<?php
class Order implements JsonSerializable
{
    private $id;
    private $userId;
    private $totalPrice;

    public function __construct($id, $userId, $totalPrice)
    {
        $this->id = $id;
        $this->userId = $userId;
        $this->totalPrice = $totalPrice;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getUserId()
    {
        return $this->userId;
    }

    public function getTotalPrice()
    {
        return $this->totalPrice;
    }

    public function setTotalPrice($totalPrice)
    {
        $this->totalPrice = $totalPrice;
    }

    public function jsonSerialize() : mixed
    {
        return [
            'id' => $this->id,
            'userId' => $this->userId,
            'totalPrice' => $this->totalPrice,
        ];
    }
}
?>
