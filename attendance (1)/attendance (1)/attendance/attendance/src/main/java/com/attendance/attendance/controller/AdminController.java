package com.attendance.attendance.controller;
import com.attendance.attendance.service.AdminServiceImplementation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@AllArgsConstructor
public class AdminController {
    private AdminServiceImplementation adminServiceImplementation;
    @PostMapping("/change-password/{username}/{oldPassword}/{newPassword}")
    public String changePassword(@PathVariable String username, @PathVariable String oldPassword,@PathVariable String newPassword){
        return adminServiceImplementation.changePassword(username,oldPassword,newPassword);
    }
    @GetMapping("/admin-login/{username}/{password}")
    public String login(@PathVariable String username,@PathVariable String password){
        return adminServiceImplementation.login(username,password);
    }
}
