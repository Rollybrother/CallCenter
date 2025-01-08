package com.daelim.Callcenter.Login;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginRepository extends JpaRepository<LoginVO, Integer> {
    
    LoginVO findById(String id);
    
    
}
