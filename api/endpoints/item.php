<?php

class Items {

    function __construct($re) {
        
    }

}

$db = new MongoDBCls('badget');
$table = 'items';
$db_name = 'badget';
$api = new RestApiProcessor();
$req_method = $api->request_method();
switch ($req_method) {
    case 'get':
        $data = $db->select($table, ["price.units" => "kg"])->getData();
        echo json_encode($data);
        break;
    case 'post':
        $data = $api->req_data;
        $res = $db->insert($table, $data);
        echo json_encode(['res' => empty($res->getError())]);
        break;
    case 'put':
        echo json_encode(['re m' => $req_method]);
        break;
    case 'delete':
        echo json_encode(['re m' => $req_method]);
        break;

    default:
        echo json_encode(['re m' => $req_method]);
        break;
}

class Item {

//     {
//    _id: 5ed4e19f71580000be003108,
//    num: 0,
//    total: 0,
//    name: 'match box',
//    price: { amt: 5, qty: 1, units: 'kg' }
//  },

    private $amt = null;
    private $units = "pcs";
    private $category = 'food';
    private $name = '';
    private $num = 0;
    private $qty = 1;
    private $total = 0;
    private $item = [];

    function __construct($raw_item) {
        extract($raw_item);
//        var_dump(json_decode($this));

        foreach ($raw_item as $key => $value) {

//            if ($$key instanceof Item) {
            if ($this->{"category"} instanceof Item) {
                $this->{$key} = $value;
                var_dump($this->{$key});
            }
        }
    }

    function prepare_insert() {
        return [
            'name' => $this->name,
            'num' => $this->num,
            'total' => $this->total,
            'price' => [
                'amt' => $this->amt,
                'qty' => $this->qty,
                'units' => $this->units,
            ]
        ];
    }

}
