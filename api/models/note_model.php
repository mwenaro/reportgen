<?php

class Note_Model extends Model{

    public function __construct() {
        parent::__construct();
    }

    public function noteList() {
        return $this->db->select('SELECT * FROM note WHERE userId = :userId', array('userId' => $_SESSION['userId']))->getData();
    }

    public function noteSingleList($noteId) {
        return $this->db->select('SELECT * FROM note WHERE userId = :userId AND noteId = :noteId', array('userId' => $_SESSION['userId'], 'noteId' => $noteId))->getData();
    }

    public function create($data) {
        $this->db->insert('note', array(
            'title' => $data['title'],
            'userId' => $_SESSION['userId'],
            'content' => $data['content'],
            'date_added' => date('Y-m-d H:i:s') // use GMT aka UTC 0:00
        ));
    }

    public function editSave($data) {
        $postData = array(
            'title' => $data['title'],
            'content' => $data['content'],
        );

        $this->db->update('note', $postData, "`noteId` = '{$data['noteId']}' AND userId = '{$_SESSION['userId']}'");
    }

    public function delete($Id) {
        $this->db->delete('note', "`noteId` = {$data['noteId']} AND userId = '{$_SESSION['userId']}'");
    }

}
