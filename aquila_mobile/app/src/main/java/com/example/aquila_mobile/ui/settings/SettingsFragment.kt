package com.example.aquila_mobile.ui.settings

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.aquila_mobile.R
import com.example.aquila_mobile.data.api.RetrofitClient
import com.example.aquila_mobile.databinding.FragmentSettingsBinding
import com.example.aquila_mobile.utils.SessionManager

class SettingsFragment : Fragment(R.layout.fragment_settings) {
    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentSettingsBinding.bind(view)

        val sessionManager = SessionManager(requireContext())
        val isAdmin = sessionManager.getUserRole() == "admin"

        binding.networkConfigCard.visibility = if (isAdmin) View.VISIBLE else View.GONE
        binding.toolbar.title = if (isAdmin) "System Settings" else "Settings"

        binding.notificationsSwitch.isChecked = sessionManager.isNotificationsEnabled()
        binding.notificationsSwitch.setOnCheckedChangeListener { _, isChecked ->
            sessionManager.saveNotificationsEnabled(isChecked)
            Toast.makeText(context, if (isChecked) "Notifications enabled" else "Notifications disabled", Toast.LENGTH_SHORT).show()
        }

        binding.saveButton.setOnClickListener {
            if (!isAdmin) return@setOnClickListener
            val newUrl = binding.serverUrlInput.text.toString()
            if (newUrl.startsWith("http")) {
                RetrofitClient.setBaseUrl(newUrl)
                Toast.makeText(context, "Server URL Updated", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Invalid URL", Toast.LENGTH_SHORT).show()
            }
        }

        binding.logoutButton.setOnClickListener {
            sessionManager.clearSession()
            findNavController().navigate(R.id.loginFragment)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
