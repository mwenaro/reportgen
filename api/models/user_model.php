<?php

class User_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function roleList()
    {
       // return $this->db->select('SELECT roleid, privillage,role FROM roles');
         return array();
    }
     public function userList()
    {
        return $this->db->select('SELECT userId, username, role FROM users')->getData();
       
    }
    public function userSingleList($userId)
    {
        return $this->db->select('SELECT userId,username, role FROM users WHERE userId = :userId', array(':userId' => $userId))->getData();
    }
    
    public function create($data)
    {
        $this->db->insert('users', array(
           'username' => $data['username'],
            'password'=>$data['password'],
           // 'password' => Hash::create('sha256', $data['password'], HASH_PASSWORD_KEY),
            'role' => $data['role']
        ));
    }
    
    public function editSave($data)
    {
        $postData = array(
           'username' => $data['username'],
            'password'=>$data['password'],
           // 'password' => Hash::create('sha256', $data['password'], HASH_PASSWORD_KEY),
            'role' => $data['role']
        );
        
        $this->db->update('users', $postData, "`userId` = {$data['userId']}");
    }
    
    public function delete($userId)
    {
        $result = $this->db->select('SELECT role FROM users WHERE userId = :userId', array(':userId' => $userId))->getData();

        if (!$result[0]['role'] == 'developer'||!$result[0]['role'] == 'admin')
        return false;
        
        $this->db->delete('users', "userId = '$userId'");
    }
}