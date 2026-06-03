package com.example.aquila_mobile.ui.admin

import android.os.Bundle
import android.util.Patterns
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.example.aquila_mobile.R
import com.example.aquila_mobile.data.api.RetrofitClient
import com.example.aquila_mobile.databinding.FragmentAdminProvisioningBinding
import kotlinx.coroutines.launch

class AdminProvisioningFragment : Fragment(R.layout.fragment_admin_provisioning) {

    private var _binding: FragmentAdminProvisioningBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentAdminProvisioningBinding.bind(view)

        binding.toolbar.setNavigationOnClickListener { findNavController().navigateUp() }

        binding.deploySystemButton.setOnClickListener {
            performDeployment()
        }
    }

    private fun performDeployment() {
        val userName = binding.userFullNameInput.text.toString().trim()
        val userEmail = binding.userEmailInput.text.toString().trim()
        val userPass = binding.userPasswordInput.text.toString().trim()

        val roomName = binding.roomNameInput.text.toString().trim()
        val roomType = binding.roomTypeInput.text.toString().trim()

        val deviceName = binding.deviceNameInput.text.toString().trim()
        val macAddr = binding.macAddressInput.text.toString().trim()

        if (!validateInputs(userName, userEmail, userPass, roomName, roomType, deviceName, macAddr)) {
            return
        }

        binding.deploySystemButton.isEnabled = false
        binding.loadingBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                // 1. Create User
                val userResponse = RetrofitClient.apiService.register(mapOf(
                    "full_name" to userName,
                    "email" to userEmail,
                    "password" to userPass
                ))

                if (!userResponse.isSuccessful) {
                    throw Exception("User creation failed: ${userResponse.message()}")
                }
                val createdUser = userResponse.body()!!

                // 2. Create Room
                val roomResponse = RetrofitClient.apiService.createRoom(mapOf(
                    "userId" to createdUser.id,
                    "name" to roomName,
                    "type" to roomType,
                    "description" to "Provisioned via Admin Panel"
                ))

                if (!roomResponse.isSuccessful) {
                    throw Exception("Room creation failed: ${roomResponse.errorBody()?.string() ?: roomResponse.message()}")
                }

                val rooms = RetrofitClient.apiService.getRooms()
                val targetRoom = rooms.find { it.name == roomName } ?: throw Exception("Room not found after creation")

                // 3. Register Device
                val deviceResponse = RetrofitClient.apiService.registerDevice(mapOf(
                    "roomId" to targetRoom.id,
                    "name" to deviceName,
                    "macAddress" to macAddr,
                    "type" to "ESP32"
                ))

                if (deviceResponse.isSuccessful) {
                    Toast.makeText(context, "System Deployed Successfully!", Toast.LENGTH_LONG).show()
                    findNavController().navigateUp()
                } else {
                    throw Exception("Device registration failed: ${deviceResponse.errorBody()?.string() ?: deviceResponse.message()}")
                }

            } catch (e: Exception) {
                Toast.makeText(context, "Deployment failed. Please check the form and try again.", Toast.LENGTH_LONG).show()
            } finally {
                binding.deploySystemButton.isEnabled = true
                binding.loadingBar.visibility = View.GONE
            }
        }
    }

    private fun validateInputs(
        userName: String,
        userEmail: String,
        userPass: String,
        roomName: String,
        roomType: String,
        deviceName: String,
        macAddr: String
    ): Boolean {
        binding.userFullNameLayout.error = null
        binding.userEmailLayout.error = null
        binding.userPasswordLayout.error = null
        binding.roomNameLayout.error = null
        binding.roomTypeLayout.error = null
        binding.deviceNameLayout.error = null
        binding.macAddressLayout.error = null

        var isValid = true

        if (userName.length < 3) {
            binding.userFullNameLayout.error = "Enter the user full name."
            isValid = false
        }

        if (userEmail.isEmpty() || !Patterns.EMAIL_ADDRESS.matcher(userEmail).matches()) {
            binding.userEmailLayout.error = "Enter a valid email like user@example.com."
            isValid = false
        }

        if (userPass.length < 8) {
            binding.userPasswordLayout.error = "Use at least 8 characters for the password."
            isValid = false
        }

        if (roomName.length < 3) {
            binding.roomNameLayout.error = "Enter the room name, for example Living Room."
            isValid = false
        }

        if (roomType.isEmpty()) {
            binding.roomTypeLayout.error = "Enter the type of room, for example Office or Bedroom."
            isValid = false
        }

        if (deviceName.isEmpty()) {
            binding.deviceNameLayout.error = "Enter a device name so it is easy to recognize."
            isValid = false
        }

        val macRegex = Regex("^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$")
        if (!macRegex.matches(macAddr)) {
            binding.macAddressLayout.error = "Use MAC format XX:XX:XX:XX:XX:XX."
            isValid = false
        }

        if (!isValid) {
            Toast.makeText(context, "Please fix the highlighted fields and try again.", Toast.LENGTH_SHORT).show()
        }

        return isValid
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
