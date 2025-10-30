package com.attendance.attendance.service;

import com.attendance.attendance.entity.Admin;
import com.attendance.attendance.repository.AdminRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class AdminServiceImplementation implements AdminService {
    private AdminRepository adminRepository;

    @Override
    public String login(String username, String password) {
        Admin admin=adminRepository.getById(username);
        if(admin.getPassword().equals(password)){
            return "SUCCESS";
        }
        return "FAILED";
    }

    @Override
    public String changePassword(String username,String oldPassword, String newPassword) {
        Admin admin=adminRepository.getById(username);
        boolean flag=false;
        if(admin.getPassword().equals(oldPassword)){
            admin.setPassword(newPassword);
            flag=true;

        }
        try {
            adminRepository.save(admin);

        }
        catch (Exception e){
            return "Failed: "+e.getMessage();
        }

        return flag?"Changed Successfully":"Wrong Password";
    }
}

