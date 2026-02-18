package com.university.security;

import com.university.entity.User;
import com.university.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CustomAuthenticationEventListener {

    @Autowired
    private UserRepository userRepository;

    @EventListener
    public void onAuthenticationSuccess(AuthenticationSuccessEvent event) {
        Object principal = event.getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (user.getFailedAttempts() != null && user.getFailedAttempts() > 0) {
                    user.setFailedAttempts(0);
                    userRepository.save(user); // Reset failed attempts on success
                }
            }
        }
    }

    @EventListener
    public void onAuthenticationFailure(AuthenticationFailureBadCredentialsEvent event) {
        Object principal = event.getAuthentication().getPrincipal();
        String usernameOrEmail = "";

        if (principal instanceof String) {
            usernameOrEmail = (String) principal;
        } else if (principal instanceof UserDetails) {
            usernameOrEmail = ((UserDetails) principal).getUsername();
        }

        Optional<User> userOptional = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!Boolean.TRUE.equals(user.getLocked())) {
                int currentAttempts = user.getFailedAttempts() == null ? 0 : user.getFailedAttempts();
                int attempts = currentAttempts + 1;
                user.setFailedAttempts(attempts);
                if (attempts >= 5) {
                    user.setLocked(true);
                }
                userRepository.save(user);
            }
        }
    }
}
