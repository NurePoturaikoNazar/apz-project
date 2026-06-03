package com.example.aquila_mobile.ui.auth

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.example.aquila_mobile.R
import com.example.aquila_mobile.data.api.RetrofitClient
import com.example.aquila_mobile.databinding.FragmentLoginBinding
import com.example.aquila_mobile.utils.SessionManager
import kotlinx.coroutines.launch

class LoginFragment : Fragment(R.layout.fragment_login) {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentLoginBinding.bind(view)

        val sessionManager = SessionManager(requireContext())

        binding.loginButton.setOnClickListener {
            val email = binding.emailInput.text.toString()
            val password = binding.passwordInput.text.toString()

            if (email == "admin" && password == "admin") {
                // Dev Bypass
                sessionManager.saveAuthToken("dev_token")
                sessionManager.saveUserRole("admin")
                findNavController().navigate(R.id.action_loginFragment_to_dashboardFragment)
                return@setOnClickListener
            }

            if (email.isNotEmpty() && password.isNotEmpty()) {
                performLogin(email, password)
            } else {
                Toast.makeText(context, "Please fill all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun performLogin(email: String, password: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.login(mapOf(
                    "email" to email,
                    "password" to password
                ))
                if (response.isSuccessful && response.body() != null) {
                    val loginResponse = response.body()!!
                    val sessionManager = SessionManager(requireContext())
                    sessionManager.saveAuthToken(loginResponse.token)
                    sessionManager.saveUserRole(loginResponse.user.role ?: "user")
                    findNavController().navigate(R.id.action_loginFragment_to_dashboardFragment)
                } else {
                    Toast.makeText(context, "Login failed", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
