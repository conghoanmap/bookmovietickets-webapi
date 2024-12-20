package com.javamongo.moviebooktickets.dto.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 12, max = 50, message = "Tên phải có độ dài từ 12 đến 50 ký tự")
    private String name;
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 12, max = 50, message = "Mật khẩu phải có độ dài từ 12 đến 50 ký tự")
    // Ít nhất 1 hoa, 1 thường, 1 số
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]+$", message = "Mật khẩu phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 chữ số và 1 ký tự đặc biệt")
    private String password;
    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String confirmPassword;
}
