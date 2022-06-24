<?php



class EndMark extends Controller {

    public function __construct() {
        parent::__construct();
//        Auth::handleLogin();
        Session::init();
           if(true!== Session::get('loggedIn')){
               header('location:'.URL.'login');
           }
    }
    
    public function index() 
    {    
        $this->view->title = 'Marks';
        
        $this->view->render('header');
        $this->view->render('user/index');
        $this->view->render('footer');
    }
    
    public function create() 
    {
        $data = array();
        $data['username'] = $_POST['username'];
        $data['password'] = $_POST['password'];
        $data['role'] = $_POST['role'];
        
        // @TODO: Do your error checking!
        
        $this->model->create($data);
        header('location: ' . URL . 'user');
    }
    
    public function edit($id) 
    {
        $this->view->title = 'Edit Mark';
      //  $this->view->user = $this->model->userSingleList($id);
        
        $this->view->render('header');
        $this->view->render('user/edit');
        $this->view->render('footer');
    }
    
    public function editSave($data)
    {
        
        
        // @TODO: Do your error checking!
        
        $this->model->editSave($data);
        header('location: ' . URL . 'endmark');
    }
    
    public function delete($id)
    {
        $this->model->delete($id);
        header('location: ' . URL . 'endmark');
    }
    
}