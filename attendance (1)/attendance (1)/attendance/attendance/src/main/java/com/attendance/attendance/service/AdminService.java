package com.attendance.attendance.service;

public interface AdminService {
    String login(String username, String password);
    String changePassword(String username,String oldPassword, String newPassword);

}
