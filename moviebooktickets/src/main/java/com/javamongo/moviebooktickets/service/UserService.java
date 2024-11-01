package com.javamongo.moviebooktickets.service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.javamongo.moviebooktickets.dto.MyResponse;
import com.javamongo.moviebooktickets.dto.account.ChangePasswordRequest;
import com.javamongo.moviebooktickets.dto.account.LoginRegisterResponse;
import com.javamongo.moviebooktickets.dto.account.LoginRequest;
import com.javamongo.moviebooktickets.dto.account.RegisterRequest;
import com.javamongo.moviebooktickets.entity.AppUser;
import com.javamongo.moviebooktickets.repository.AppUserRepository;
import com.javamongo.moviebooktickets.util.RandomStringGenerator;


@Service
public class UserService {
    
    @Autowired
    private EmailSenderService emailSenderService;
    @Autowired
    private AppUserRepository usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginRegisterResponse Login(LoginRequest loginRequest) {
        LoginRegisterResponse response = new LoginRegisterResponse();

        try {
            Optional<AppUser> appuser = usersRepo.findByEmail(loginRequest.getEmail());
            if (appuser.isEmpty()) {
                response.setStatusCode(404);
                response.setMessage("Tài khoản không tồn tại!");
                return response;
            }

            // Kiểm tra xem email và password có khớp không
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), loginRequest.getPassword()));

            var user = appuser.get();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRoles(user.getRoles());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Đăng nhập thành công!");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    public LoginRegisterResponse Register(RegisterRequest registerRequest) {
        LoginRegisterResponse response = new LoginRegisterResponse();

        try {
            // Kiểm tra mật khẩu có khớp không
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                response.setStatusCode(400);
                response.setMessage("Mật khẩu không khớp!");
                return response;
            }

            // Kiểm tra xem email đã tồn tại chưa
            Optional<AppUser> appuser = usersRepo.findByEmail(registerRequest.getEmail());
            if (!appuser.isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("Email đã tồn tại!");
                return response;
            }

            var ourUsers = new AppUser();
            ourUsers.setEmail(registerRequest.getEmail());
            ourUsers.setName(registerRequest.getName());
            ourUsers.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            ourUsers.setAccountBalance(1000000); // Set số dư ví mặc định là 1 triệu
            // Set role mặc định là Customer
            ourUsers.setRoles(Set.of("Customer"));
            AppUser appUser = new AppUser();
            appUser.setId(null);
            appUser = usersRepo.save(ourUsers);

            if (appUser.getId() != null) {
                response.setUser(appUser);
                response.setStatusCode(200);
                response.setMessage("Đăng kí thành công!");
            }

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    public MyResponse<AppUser> Profile(String email) {
        MyResponse<AppUser> response = new MyResponse<>();
        try {
            Optional<AppUser> appuser = usersRepo.findByEmail(email);
            if (appuser.isEmpty()) {
                response.setStatus(404);
                response.setMessage("Tài khoản không tồn tại!");
                return response;
            }
            response.setStatus(200);
            response.setMessage("Lấy thông tin thành công!");
            response.setData(appuser.get());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public MyResponse<List<String>> GetRoles(String email) {
        MyResponse<List<String>> response = new MyResponse<>();
        try {
            Optional<AppUser> appuser = usersRepo.findByEmail(email);
            if (appuser.isEmpty()) {
                response.setStatus(404);
                response.setMessage("Tài khoản không tồn tại!");
                return response;
            }
            response.setStatus(200);
            response.setMessage("Lấy thông tin thành công!");
            response.setData(List.copyOf(appuser.get().getRoles()));
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public MyResponse<List<AppUser>> GetAllUsers(String email) {
        MyResponse<List<AppUser>> response = new MyResponse<>();
        try {
            List<AppUser> appusers = usersRepo.findAll();
            // Bỏ qua tài khoản của chính người dùng đang đăng nhập
            appusers.removeIf(user -> user.getEmail().equals(email));
            response.setStatus(200);
            response.setMessage("Lấy thông tin thành công!");
            response.setData(appusers);
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public MyResponse<?> GrantRevokeRole(String id, Set<String> roles) {
        MyResponse<?> response = new MyResponse<>();
        try {
            Optional<AppUser> appuser = usersRepo.findById(id);
            if (appuser.isEmpty()) {
                response.setStatus(404);
                response.setMessage("Tài khoản không tồn tại!");
                return response;
            }
            AppUser user = appuser.get();
            user.setRoles(roles);
            usersRepo.save(user);
            response.setStatus(200);
            response.setMessage("Cấp quyền thành công!");
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public MyResponse<?> DeleteUser(String id) {
        MyResponse<?> response = new MyResponse<>();
        try {
            Optional<AppUser> appuser = usersRepo.findById(id);
            if (appuser.isEmpty()) {
                response.setStatus(404);
                response.setMessage("Tài khoản không tồn tại!");
                return response;
            }
            usersRepo.deleteById(id);
            response.setStatus(200);
            response.setMessage("Xóa tài khoản thành công!");
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public MyResponse<AppUser> GetByEmail(String email) {
        MyResponse<AppUser> response = new MyResponse<>();
        try {
            Optional<AppUser> appuser = usersRepo.findByEmail(email);
            if (appuser.isEmpty()) {
                response.setStatus(404);
                response.setMessage("Tài khoản không tồn tại!");
                return response;
            }
            response.setStatus(200);
            response.setMessage("Lấy thông tin thành công!");
            response.setData(appuser.get());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public MyResponse<?> ChangePassword(String email, ChangePasswordRequest changePasswordRequest) {
        MyResponse<?> response = new MyResponse<>();
        try {
            Optional<AppUser> appuser = usersRepo.findByEmail(email);
            if (appuser.isEmpty()) {
                response.setStatus(404);
                response.setMessage("Tài khoản không tồn tại!");
                return response;
            }
            AppUser user = appuser.get();
            if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
                response.setStatus(400);
                response.setMessage("Mật khẩu cũ không đúng!");
                return response;
            }
            if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
                response.setStatus(400);
                response.setMessage("Mật khẩu mới không khớp!");
                return response;
            }
            // Kiểm tra mật khẩu mới có khớp với mật khẩu cũ không
            if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), user.getPassword())) {
                response.setStatus(400);
                response.setMessage("Mật khẩu mới không được trùng với mật khẩu cũ!");
                return response;
            }
            user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            usersRepo.save(user);
            response.setStatus(200);
            response.setMessage("Đổi mật khẩu thành công!");
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public MyResponse<?> ResetPassword(String email) {
        MyResponse<?> response = new MyResponse<>();
        // Tạo mật khẩu ngẫu nhiên có 32 kí tự
        String newPassword = RandomStringGenerator.generateRandomString(32);
        try {
            Optional<AppUser> appuser = usersRepo.findByEmail(email);
            if (appuser.isEmpty()) {
                response.setStatus(404);
                response.setMessage("Email không tồn tại!");
                return response;
            }
            AppUser user = appuser.get();
            // user.setPassword(passwordEncoder.encode(newPassword));
            user.setPassword(passwordEncoder.encode("CongHoan123#@!"));
            usersRepo.save(user);
            // Gửi email thông báo mật khẩu mới
            emailSenderService.sendEmail(email, "Reset Password", "Mật khẩu mới của bạn là: " + newPassword);
            response.setStatus(200);
            response.setMessage("Một mật khẩu mới đã được gửi đến email của bạn!");
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

}
