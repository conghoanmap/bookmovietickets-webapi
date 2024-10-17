package com.javamongo.moviebooktickets.controller;

import java.util.Set;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javamongo.moviebooktickets.dto.account.ChangePasswordRequest;
import com.javamongo.moviebooktickets.dto.account.LoginRequest;
import com.javamongo.moviebooktickets.dto.account.RegisterRequest;
import com.javamongo.moviebooktickets.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {

    Logger logger = Logger.getLogger(AccountController.class.getName());

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.Login(loginRequest));
        // return ResponseEntity.ok(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> Register(@Valid @RequestBody RegisterRequest registerRequest) {
        logger.info("Register Request: " + registerRequest);
        return ResponseEntity.ok(userService.Register(registerRequest));
        // return ResponseEntity.ok(registerRequest);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyAuthority('Admin', 'Customer')")
    public ResponseEntity<?> Profile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userService.Profile(email));
    }

    @GetMapping("/get-roles")
    public ResponseEntity<?> GetRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userService.GetRoles(email));
    }

    @GetMapping("/get-all-users")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> GetAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userService.GetAllUsers(email));
    }

    @PutMapping("/grant-revoke-role")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> GrantRevokeRole(@RequestParam String id, @RequestBody Set<String> roles) {
        return ResponseEntity.ok(userService.GrantRevokeRole(id, roles));
    }

    @DeleteMapping("/delete-user")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> DeleteUser(@RequestParam String id) {
        return ResponseEntity.ok(userService.DeleteUser(id));
    }

    @GetMapping("/get-by-email")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> GetByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.GetByEmail(email));
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasAnyAuthority('Admin', 'Customer')")
    public ResponseEntity<?> ChangePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userService.ChangePassword(email, changePasswordRequest));
    }

    @GetMapping("/reset-password")
    public ResponseEntity<?> ResetPassword(@RequestParam String email) {
        return ResponseEntity.ok(userService.ResetPassword(email));
    }
}
